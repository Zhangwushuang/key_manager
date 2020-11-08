/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var WinSize = new Array();
WinSize[0] = {width: 400, height: 750};
WinSize[1] = {width: 320, height: 600};

exports.get_WinSize = function(ScreenSize){

    for(var i = 0; i < WinSize.length; i++){
        
        if((WinSize[i].width < ScreenSize.width) && (WinSize[i].height < ScreenSize.height)){
            
          return WinSize[i];
            
        }
        
    }

    return false;

}