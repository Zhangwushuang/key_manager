/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

exports.id = /^[0-9]{1,12}$/;
exports.mobile = /^[0-9]{1,20}$/;
exports.password = /^[0-9A-Za-z]{16,32}$/;
exports.card = /^[0-9Xx]{16,32}$/;
exports.name= /^[a-zA-Z0-9.\u4e00-\u9fa5]{1,60}$/;
exports.license = /^[0-9A-Za-z]{16,32}$/;
exports.address = /^[0-9A-Za-z]{16,255}$/;
exports.uuid =/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
exports.aeskey =/^[a-fA-F0-9]{64}$/;
exports.invoice_code = /^[0-9]{1,64}$/;
exports.path = /^[a-zA-Z0-9_/-]{1,1024}$/;

exports.chk_amt = function(amt){

    var tp = parseFloat(amt);

    if(isNaN(tp)){
            
        return false;
            
    }
    
    if(tp <= 0){
            
        return false;
            
    }
    
    tp = tp.toString();
    
    if(tp.length > 64){
            
        return false;          
                      
    }
    
    return tp;
      
}