/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const fs = require('fs');
const crypt_funcs = require('../libs/crypt_funcs.js');
const regexes = require('../libs/regexes.js');

function get_form_date(selector){
    
    var keys = $(selector).serializeArray();
    var obj = new Object();
    
    for(var i = 0; i < keys.length; i++){
        
        obj[keys[i].name] = keys[i].value;
        
        
    }
    
    return obj;
    
}

//创建新密钥
$("#creat_key").click(function(){
 
    var form_obj = get_form_date("form");
   
    if(!regexes.name.test(form_obj.path)){
        
        x0p('提示：', '文件名仅能由汉字，字母，数字组成。');
        return;
        
    }

    if((!form_obj.psw1) || (form_obj.psw1 !== form_obj.psw2)){
        
        x0p('提示：', '您两次输入的密码不同。');
        return;
        
    }

    try{
        
        var key_obj = {};
        key_obj.key = crypt_funcs.b64_obj(location.search.substring(5));
    
        key_obj.user ={};
        if(form_obj.name){key_obj.user.name = form_obj.name;}
        if(form_obj.mobile){key_obj.user.mobile = form_obj.mobile;}
        if(form_obj.id){key_obj.user.id = form_obj.id;}
        
        console.log(key_obj);
    
        var ob_string = crypt_funcs.encrypt(key_obj,form_obj.psw1);
        var key_path = __dirname + "/../keys/" + form_obj.path + ".key";
                 
        fs.writeFileSync(key_path, ob_string,{ flag:"wx" });
        x0p('提示：', '密钥文件生成成功。');
       
    }catch(e){
        
        x0p('提示：', '文件写入失败。请注意是否有同名文件存在。');
        console.log(e);
        
    }
});

