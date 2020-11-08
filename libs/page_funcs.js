/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const path = require('path');
const fs = require('fs');

class page_funcs {
    
    constructor() {
    
    }
  
    //生成密钥选择的html
    static select_html(list){

        var html = "";

        for(var i = 0; i < list.length; i++){
    
            html += '<option value="'+ list[i] + '">' + list[i] + '</option>';
    
        }
    
        return html;
    
    }
    
    //读取密钥文件
    static load_key(name){
        
        var key_path = __dirname + "/../keys/" + name;
        return fs.readFileSync(key_path,'utf8');

    }
    
    //输出密钥信息
    static key_info_html(obj){
    
        var html = "";
        html += "<ul>";

        if(obj.user.name){html += "<li>姓名：" + obj.user.name + "</li>";}
        if(obj.user.mobile){html += "<li>手机号：" + obj.user.mobile + "</li>";}
        if(obj.user.id){html += "<li>身份证：" + obj.user.id + "</li>";}
        if(obj.key.address){html += "<li>链上地址：" + obj.key.address + "</li>";}
        if(obj.key.publicKey){html += "<li>公钥：" + obj.key.publicKey + "</li>";}
        if(obj.key.secret){html += "<li>私钥：" + obj.key.secret + "</li>";}
        
        html += "</ul>";
    
        return html;

    }    

}

module.exports = page_funcs;



