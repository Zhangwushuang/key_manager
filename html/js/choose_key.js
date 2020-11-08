/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//electron
const electron = require('electron');
const fs = require('fs');

//WebSocket相关
var wscf = require('../config/host.json');
const WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var wss = new WebSocketServer(wscf);

//杂项函数
const errors = require('../libs/errors');
const crypt_funcs = require('../libs/crypt_funcs.js');
const page_funcs = require('../libs/page_funcs.js');

//打开一个chainsql子进程,防止卡死，签名等都是计算密集型
console.log(__dirname);
const child_process = require('child_process');
const chain_process = child_process.fork(__dirname + "/../chain_process.js");


//密钥缓存
var used_key = null;
var busy = false;

//生成select列表
const key_list = fs.readdirSync( __dirname + "/../keys" );
$("select").html(page_funcs.select_html(key_list));

//使用密钥
$("#use_key").click(function(){
    
    x0p('请输入密码', null, 'input',function(button, text) {
	if(button === 'info') {
            
            try{
                
                var obj = new Object();
                
                var file_name = $("#key").val();
                obj.encry = page_funcs.load_key(file_name);//密文
              
                var key_obj = crypt_funcs.decrypt(obj.encry,text);             
                //delete  key_obj.key.secret;               
                obj.pub = key_obj.key;
                
                used_key = obj;
                
                console.log(used_key);
                
                var alt = "正在使用:" + file_name;
                $("h2").text(alt);
                x0p("", page_funcs.key_info_html(key_obj));
                
            }catch(e){
                
                console.log(e);
                x0p('提示：', '读取密钥文件失败。');
                
            }
            
	}
    }); 
});

//建立新密钥
$("#creat_key").click(function(){
    
    x0p({
        title: '请稍侯',
        text: '正在载入模块.',
        animationType: 'slideDown',
        icon: 'info',
        buttons: [],
        autoClose: 60000
    });
    
    chain_process.once('message', function(m){

        console.log(m.rst);
        location.href = "./creat_key.html?key=" + crypt_funcs.obj_b64(m.rst);

    });

    chain_process.send({ action:"generateAddress" });//发送到区块链进程
   
});

wss.on('error', function (e) {

    console.log(e);
    x0p('提示：', '本地39820端口被占用，请查看位于安装文件夹下的帮助文档。');

});

//监听通信
wss.on('connection', function (ws) {
 
  ws.on('message', function (message) {
      
    console.log(message);
    
    if(busy){

        errors.send_error(ws,errors.codes.busy);
        return;          
     
    }
      
    if(used_key === null){
            
        errors.send_error(ws,errors.codes.unsetKey);
        return;
            
    }
    
    var qy_obj = null;
    try{
        
        qy_obj = JSON.parse(message);
        
    }catch(e){

        errors.send_error(ws,errors.codes.ntJson);
        return;
      
    }
    
    if(qy_obj.action === "get"){
        
        errors.send_error(ws,errors.codes.succ,used_key.pub);
        return;             
        
    }
  
    //作为代理发送数据到节点，主要绕过https页面上不允许发起ws请求的安全限制
    if(qy_obj.action === "proxy"){
        
        const ws_cilent = new WebSocket(qy_obj.host);
        
        ws_cilent.on('error', function(data) {

            errors.send_error(ws,errors.codes.wsFail,data);
            ws_cilent.close();
            return; 
        
        });
        
        ws_cilent.on('open', function () {
        
            ws_cilent.on('message', function(data) {

                errors.send_error(ws,errors.codes.succ,JSON.parse(data));
                ws_cilent.close();
                return; 
        
            });

            ws_cilent.send(JSON.stringify(qy_obj.payload));
        
        });
        
        return;        
    }  
  
    x0p('请输入密码以继续下一步', null, 'input',function(button, text) {
	if(button === 'info') {
            
            x0p({
                title: '请稍侯',
                text: '正在签名并发送交易.',
                animationType: 'slideDown',
                icon: 'info',
                buttons: [],
                autoClose: 60000
            });
            
            try{

                qy_obj.key = crypt_funcs.decrypt(used_key.encry,text).key;            
                busy = true;
                
                chain_process.once('message', function(m) {
                    
                    console.log(m);//打印返回值
                    
                    errors.send_error(ws,errors.codes.succ,m);                    
                    busy = false;
                    
                    x0p('提示：', '操作成功。');
                    
                });

                chain_process.send(qy_obj);                
           
            }catch(e){
                
                console.log(e);
                x0p('提示：', '密码错误。');
                errors.send_error(ws,errors.codes.pswWrong);
                busy = false;
                return;                
                
            }
            
	}
        
        if(button === 'cancel') {
            
            errors.send_error(ws,errors.codes.opCancel);
            busy = false;
            return;
            
	}
    });       
  });
});