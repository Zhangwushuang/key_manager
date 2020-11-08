/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
exports.codes = {
    
    succ : 0, //成功
    unsetKey: 1, //未选择使用的密钥
    opCancel: 2, //未输入密码，操作被取消
    pswWrong: 3, //密码错误
    ntJson: 4, //不是json
    busy: 5, //上一个请求未处理完
    wsFail:6

};

exports.send_error = function(ws,code,rest = null){
    
    var er_js = { 
            
        code : code
            
    }; 
        
    if(rest !== null){
        
        er_js.result = rest;
        
    } 
    
    ws.send(JSON.stringify(er_js));   
    ws.close();
}

