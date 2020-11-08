/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const chain_funcs = require('./libs/chain_funcs.js');

process.on('message', function(arg){
 
    try {

        chain_funcs.main(arg, process);

    } catch (e) {

        process.send({ sta: "Internal Error", err: e, rst: arg.action});

    }
          
});
