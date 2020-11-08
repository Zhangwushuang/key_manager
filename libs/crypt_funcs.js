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
const crypto = require('crypto');

class crypt_funcs {
    
    constructor() {
    
    }
  
    //加密
    static encrypt(obj,password){
        
        const hash = crypto.createHash('sha256');
        const key = hash.update(password, 'utf8').digest();
        
        var uncrypted = crypt_funcs.obj_b64(obj);
        
        const cipher =crypto.createCipheriv("aes-256-ecb", key, null);  
        var encrypted = cipher.update(uncrypted,'utf8','base64');
        encrypted += cipher.final('base64');
        
        return encrypted;
        
    }    
    
    //解密
    static decrypt(b64,password){
        
        const hash = crypto.createHash('sha256');
        const key = hash.update(password, 'utf8').digest();

        const Decipher =crypto.createDecipheriv("aes-256-ecb", key, null);
             
        var decrypted = Decipher.update(b64, 'base64', 'utf8');
        decrypted += Decipher.final('utf8');
        
        decrypted = crypt_funcs.b64_obj(decrypted);
        
        return decrypted;
           
    }
    
    static b64_obj(b64){
        
        var json = Buffer.from(b64, 'base64').toString('utf8');
        return JSON.parse(json);
        
    }
    
    static obj_b64(obj){
        
        var json = JSON.stringify(obj);
        return Buffer.from(json).toString('base64');
        
    }

}

module.exports = crypt_funcs;


