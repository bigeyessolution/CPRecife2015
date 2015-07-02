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
 * with Campus Party - Recife 2015 App.
 * If not, see <http://www.gnu.org/licenses/>.
 */

var ApiCache = {
    urls: [],
    addUrl: function (cacheId, url, timeToLive) {
        this.urls[cacheId] = {
            cacheId: cacheId,
            url: url,
            timeToLive: timeToLive,
            content: {}
        };
    },
    getContent: function (cacheId) {
        //Get local content
        //If timeToLive expires updateCache
    },
    updateCache: function (cacheId) {
        
    },
    updateAllCaches: function () {
        
    }
}