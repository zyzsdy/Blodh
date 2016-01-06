<?php
/**
 * Blodh backend
 * type = info 获取视频信息 （获取cid和视频标题）必需参数：avid（av号）, page （分P）
 * type = video 获取可供HTML播放器使用的MP4视频绝对路径 必需参数 cid
 * type = danmaku 以xml形式返回弹幕 必需参数 cid
 */
session_start();
ob_start();
define("BLODH_VERSION", "1.0.0");
define("UA", $_SERVER['HTTP_USER_AGENT']);

//============================================
//这部分内容需要根据需要修改
define("APP_KEY", '8e9fc618fbd41e28');
define("SERECT_KEY", '');
define("APP_TYPE", 1); //1-旧版ak（无sk） 2-新版ak（带sk）
//=====================END====================

function get_sign($params, $key){
    $_data = array();
    ksort($params);
    reset($params);
    foreach ($params as $k => $v){
        $_data[] = $k . '=' . rawurlencode($v);
    }
    $_sign = implode('&', $_data);
    return array(
        'sign' => strtolower(md5($_sign . $key)),
        'params' => $_sign,
    );
}

function get_data($url, $params){
    $params['appkey'] = APP_KEY;
    
    $rt = get_sign($params, SERECT_KEY);
    
    if(APP_TYPE==1){
        $paramStr = $rt['params'];
    }else{
        $paramStr = $rt['params']."&sign=".$rt['sign'];
    }

    $_url = $url."?".$paramStr;
    $link = curl_init();
    curl_setopt($link, CURLOPT_URL, $_url);
    curl_setopt($link, CURLOPT_PORT, 80);
    curl_setopt($link, CURLOPT_RETURNTRANSFER, 1);
    if(APP_TYPE==1){
        curl_setopt($link, CURLOPT_USERAGENT, UA);
    }else{
        curl_setopt($link, CURLOPT_USERAGENT, "NamidoNet/1.2.0 Blodh/".BLODH_VERSION." (zyzsdy@foxmail.com) like ".UA);
    }
    $result = curl_exec($link);
    curl_close($link);
    
    return $result;
}

function make_error($code, $msg){
    header("X-Powered-By: FeelyFramework/2.0", true, $code);
    echo json_encode(array(
        'error' => $msg
    ));
    exit();
}

function main(){
    if(isset($_REQUEST['type'])){
        $type = $_REQUEST['type'];
        if($type == "info"){
            return getInfo();
        }else if($type == "video"){
            return getVideo();
        }else if($type == "danmaku"){
            return getDanmaku();
        }
    }
    make_error(400, "Invaild type");
}

function getInfo(){
    if(!isset($_REQUEST['avid'])){
        make_error(400, "'avid' was required.");
    }
    if(!isset($_REQUEST['page'])){
        make_error(400, "'page' was required.");
    }
    $avid = $_REQUEST['avid'];
    $page = $_REQUEST['page'];
    
    header("Content-Type: application/json;charset=UTF-8", true);
    echo get_data("http://api.bilibili.com/view", array(
        'type' => 'json',
        'id' => $avid,
        'page' => $page
    ));
}

function getVideo(){
    if(!isset($_REQUEST['cid'])){
        make_error(400, "'cid' was required.");
    }
    $cid = $_REQUEST['cid'];
    
    header("Content-Type: application/json;charset=UTF-8", true);
    echo get_data("http://interface.bilibili.com/playurl", array(
        'platform' => 'blodh',
        'otype' => 'json',
        'cid' => $cid,
        'quality' => '4',
        'type' => 'mp4'
    ));
}

function getDanmaku(){
    if(!isset($_REQUEST['cid'])){
        make_error(400, "'cid' was required.");
    }
    $cid = $_REQUEST['cid'];
    
    header("Content-Type: text/xml;charset=UTF-8", true);
    header("Access-Control-Allow-Origin: *", true);
    header("Access-Control-Max-Age: 86400", true);
    header("Content-Encoding: deflate", true);

    $url = "http://comment.bilibili.com/".$cid.".xml";    
    echo get_data($url, array());
}     

main();
ob_flush();