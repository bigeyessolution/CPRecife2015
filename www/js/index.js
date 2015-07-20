/*
 * This file is part of Campus Party - Recife 2015 App.
 * Campus Party - Recife 2015 App is free software: you can redistribute it 
 * and/or modify it under the terms of the GNU General Public License as 
 * published by the Free Software Foundation, either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Campus Party - Recife 2015 App is distributed in the hope that it will be 
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General 
 * Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along 
 * with Campus Party Recife 2015 App.
 * If not, see <http://www.gnu.org/licenses/>.
 */

var isAppInBackground = false;

document.addEventListener('deviceready', function () {
//    platform = device.platform;
    
    beaconsInit();
    
    prepareUI(); 

    populateMagistrais();
    
    //Ativar exibição de notificações no app
    
}, false);

document.addEventListener('pause', function () {
    isAppInBackground = true;
    //Desativar exibição de notificações no app
    stopNearestBeaconDisplayTimer();
});

document.addEventListener('resume', function () {
    isAppInBackground = false;
    //Ativar exibição de notificações no app
    startNearestBeaconDisplayTimer();
});


//apagar depois
$(function(){    
    
    prepareUI(); 

    populateMagistrais();
})