(function () {
    var backendUrl = "/backend/blodhapi.php";
    var front_appkey = "8e9fc618fbd41e28";
    var usefront = true; //尽量使用本地连接（仅限http）
    var ajaxGet = function (url, data, callback) {
        var xhr = new XMLHttpRequest();
        var dataArr = [];
        for (var propKey in data) {
            dataArr.push(propKey + "=" + data[propKey]);
        }
        var resUrl = url + "?" + dataArr.join("&");
        xhr.open("GET", resUrl, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        }
        xhr.send();
        return xhr;
    };
    var jsonpGet = function (url, data, callback) {
        var scriptNode = document.createElement("script");
        var callbackName = "_blodh_cb" + (new Date().getTime());
        var dataArr = [];
        dataArr.push("callback=" + callbackName);
        for (var propKey in data) {
            dataArr.push(propKey + "=" + data[propKey]);
        }
        var resUrl = url + "?" + dataArr.join("&");
        
        window[callbackName] = function(response){
            callback(response);
            delete window[callbackName];
        }
        scriptNode.src = resUrl;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(scriptNode);
    };
    var Blodh = {
        "init": function (elem) {
            if (!elem.dataset.loaded) {
                if (elem.getAttribute("bl-avid") === null) {
                    Blodh._showErr("缺少参数...", elem);
                }
                var avid = elem.getAttribute("bl-avid");
                var page = elem.getAttribute("bl-page") === null ? 1 : elem.getAttribute("bl-page");
                //getinfo
                if(usefront){
                    jsonpGet("http://api.bilibili.com/view",{
                        "appkey": front_appkey,
                        "id": avid,
                        "page": page,
                        "type": "jsonp",
                    }, function(data) {
                        Blodh._buildWrapper(elem, data.title, data.cid);
                    });
                }else{
                    ajaxGet(backendUrl, {
                        "type": "info",
                        "avid": avid,
                        "page": page
                    }, function (data) {
                        data = JSON.parse(data);
                        Blodh._buildWrapper(elem, data.title, data.cid);
                    });
                }
                elem.dataset.loaded = true;
            }
        },
        "_buildWrapper": function (elem, title, cid) {
            var avid = elem.getAttribute("bl-avid");
            var page = elem.getAttribute("bl-page") === null ? 1 : elem.getAttribute("bl-page");
            elem.setAttribute("bl-cid", cid);

            var bilibili_weburl = "http://www.bilibili.com/video/av" + avid;
            if (page != 1) {
                bilibili_weburl += "/index_" + page + ".html";
            }
            elem.innerHTML = "";

            var titleNode = document.createElement("div");
            titleNode.className = "blodh-title";

            var titleLink = document.createElement("a");
            titleLink.href = bilibili_weburl;
            titleLink.target = "_blank";
            titleLink.innerText = title;
            var toggleButton = document.createElement("button");
            toggleButton.innerText = "展开视频";
            toggleButton.dataset.status = "close";
            toggleButton.dataset.play = "never";

            titleNode.appendChild(titleLink);
            titleNode.appendChild(toggleButton);

            var playNode = document.createElement("div");
            playNode.className = "blodh-player";

            var abplayerNode = document.createElement("div");
            var videoNode = document.createElement("video");
            videoNode.innerHTML = "<p>Your browser does not support html5 video!</p>";

            playNode.appendChild(abplayerNode);
            playNode.appendChild(videoNode);

            elem.appendChild(titleNode);
            elem.appendChild(playNode);

            toggleButton.addEventListener("click", function () {
                if (toggleButton.dataset.status == "close") {
                    if (toggleButton.dataset.play == "never") {
                        ajaxGet(backendUrl, {
                            "type": "video",
                            "cid": cid
                        }, function (data) {
                            data = JSON.parse(data);
                            var turl = []
                            if(data.durl[0].backup_url !== undefined) turl = data.durl[0].backup_url
                            turl.push(data.durl[0].url);
                            for(var i=0; i< turl.length; i++){
                                var sourceNode = document.createElement("source");
                                sourceNode.src = turl[i];
                                videoNode.appendChild(sourceNode);
                            }
                            var inst = ABP.create(abplayerNode, {
                                "src": videoNode,
                            });
                            if(usefront){
                                CommentLoader("http://comment.bilibili.com/" + cid + ".xml", inst.cmManager);
                            }else{
                                CommentLoader(backendUrl + "?type=danmaku&cid=" + cid, inst.cmManager);
                            }
                        })
                        toggleButton.dataset.play = "loaded";
                    }
                    playNode.style.display = 'block';
                    toggleButton.innerText = "收起视频";
                    toggleButton.dataset.status = "open";
                } else {
                    playNode.style.display = 'none';
                    toggleButton.innerText = "展开视频";
                    toggleButton.dataset.status = "close";
                }
            })
        },
        "_showErr": function (msg, elem) {
            var errInfo = document.createElement("div");
            errInfo.style.color = "red";
            errInfo.innerText = msg;
            elem.appendChild(errInfo);
        }
    }
    window.blodh = Blodh;
})();