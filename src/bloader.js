(function(elem){
    var package_url = "https://127.0.0.1/blodh.min.js";
    var package_css = "https://127.0.0.1/blodh.min.css";
    if(!window.blodh){
        var blodh_style = document.createElement('link');
        blodh_style.rel = "stylesheet";blodh_style.href=package_css;
        var blodh_script = document.createElement('script');
        blodh_script.type = 'text/javascript';blodh_script.async = true;
        blodh_script.src = package_url;blodh_script.charset = 'UTF-8';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(blodh_script);
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(blodh_style);
        blodh_script.addEventListener("load", function(){
            window.blodh.init(elem);
        });
    }else{
        window.blodh.init(elem);
    }
})(document.getElementById("video1"));