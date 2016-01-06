# Blodh

Blodh is abbreviation for Bilibili Loader of Danmaku HTML5

Blodh的目标是提供一种单文件引入的方案，方便在个人博客等页面上引入B站视频，并在HTML5播放器内播放。

# 建立开发环境

Clone整个项目后，在项目根目录执行`npm install`。

如果你需要在你自己的环境中部署，你共需要修改三处。

1. src/Blodh.js 中的 backendUrl
2. src/bloader.js 中的 package_url 和 package_css （bloader并不是必要的）
3. backend/blodhapi.php 中的 APP_KEY, SERECT_KEY和APP_TYPE

源码本身对此有说明。

修改结束后，在项目根目录执行`grunt`，生成编译好的文件。

共有三个文件生成，分别为：

    blodh.min.js ---- 主文件
    blodh.min.css ---- 样式文件
    bloader.min.js ---- 加载器
    
# 部署

你需要一个可执行PHP的环境来部署，将backend/blodhapi.php放置在合适位置。然后在src/Blodh.js中修改backendUrl的路径（见上一节）。

在你的服务器上放置好生成的blodh.min.js和blodh.min.css文件。如果你需要用bloader，你同样需要在src/bloader.js中修改它们的路径。

请总是先预测部署好后文件路径，修改完成后，运行`grunt`编译，并部署编译的结果。
    
# 在HTML中插入播放器

如果你在固定的页面中使用，你需要在页面中加入下面两行：（这种方法无需bloader）

    <link rel="stylesheet" href="blodh.min.css">
    <script type="text/javascript" src="blodh.min.js"></script>
    
在你需要调用播放器的地方使用下面的HTML代码，其中属性bl-avid是视频的av号，属性bl-page是视频的分P号。id可以任意设置。
DIV中的内容为载入前的占位符，载入成功后这部分内容会消失。

    <div id="video1" bl-avid="3425967" bl-page="1">Bilibili视频——载入中</div>
    <script>blodh.init(document.getElementById("video1"))</script>
    
你可以在页面上任何的地方调用任意次。

# 使用bloader插入播放器

bloader是提供给在论坛，博客，百科网站等可以插入片段HTML及javascript，但又不能修改整个页面时的加载工具。

直接在你需要插入视频的地方插入下面的代码：

    <div id="video1" bl-avid="3425967" bl-page="1">Bilibili视频——载入中</div>
    <script type="text/javascript">
    !function(a){var b="https://127.0.0.1/blodh.min.js",c="https://127.0.0.1/blodh.min.css";if(window.blodh)window.blodh.init(a);else{var d=document.createElement("link");d.rel="stylesheet",d.href=c;var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src=b,e.charset="UTF-8",(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(e),(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(d),e.addEventListener("load",function(){window.blodh.init(a)})}}(document.getElementById("video1"));
    </script>

其中script中的内容就是bloader.min.js的内容。注意这段脚本的最后有`getElementById("video1")`，这需要跟随上面div的id来修改。

# License

Blodh licensed by Apache License 2.0


Open Source Libraries used by Blodh:

ABPlayerHTML5 (Github: https://github.com/jabbany/ABPlayerHTML5), MIT License

CommentCoreLibrary (Gihub: https://github.com/jabbany/CommentCoreLibrary), MIT License