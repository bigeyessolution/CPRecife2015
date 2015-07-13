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

/**
 * 
 * 
 * @author Laudivan Freire de Almeida <laudivan@bigeyessolution.com>
 * @type ApiCache
 */
var ApiCache = {
    urls: [],
    init: function () {
        //load cache
        var localCache = window.localStorage.getItem('ApiCache');
        
        if (localCache) {
            this.urls = JSON.parse(localCache);
        }
        
        if(this.urls.length > 0 && BigEyesSolutionApp.isConnected()) {
            this.updateAllCaches();
        }
    },
    /**
     * 
     * @param {String} cacheId
     * @param {String} url
     * @param {Integer} timeToLive in milliseconds
     * @param {Function} uiHandler function to run after get data from url.
     * @returns {undefined}
     */
    addUrl: function (cacheId, url, timeToLive, uiHandler) {
        for (var index = 0; index <  this.urls.length; index ++) {
            if (this.urls[index].cacheId == cacheId) {
                this.urls[index].timeToLive = timeToLive;
                this.urls[index].uiHandler = uiHandler;
                return;
            }
        }
        
        this.urls.push({
            cacheId: cacheId,
            url: url,
            timeToLive: timeToLive,
            lastUpdate: (new Date()).getTime(),
            uiHandler: uiHandler, // function (cacheId, data)
            content: {}
        });
    },
    hasCacheId: function (cacheId) {
        for (var index = 0; index <  this.urls.length; index ++) {
           if (this.urls[index].cacheId == cacheId) return true;
        }
       
       return false;
    },
    /**
     * 
     * @param {String} cacheId
     * @returns {Object}
     */
    getCache: function (cacheId) {
        for (var index = 0; index <  this.urls.length; index ++) {
            if (this.urls[index].cacheId == cacheId) return this.urls[index];
        }
        
        return false;
    },
    /**
     * 
     * @param {String} cacheId
     * @param {Array|Object} data
     * @returns {undefined}
     */
    setContent: function (cacheId, data) {
        for (var index = 0; index <  this.urls.length; index ++) {
            if (this.urls[index].cacheId == cacheId) {
                this.urls[index].content = data;
                break;
            }
        }
        
        window.localStorage.setItem('ApiCache', JSON.stringify(this.urls));
    },
    /**
     * 
     * @param {String} cacheId
     * @returns {undefined}
     */
    updateCache: function (cacheId) {
        var cache = this.getCache(cacheId);
        
        var time = (new Date()).getTime() - cache.lastUpdate;
        
        var flag = BigEyesSolutionApp.isConnected() && (time > cache.timeToLive);
        
        function _offLineHandler () {
            console.log(JSON.stringify(cache.content))
            if(cache.uiHandler) cache.uiHandler(cacheId, cache.content);
        }
        
        if( flag ) {
            function _onLineHandler (data) {
                ApiCache.setContent(cacheId, data);                
                
                if(cache.uiHandler) cache.uiHandler(cacheId, data);
            }
            
            $.getJSON(cache.url, _onLineHandler).fail(_offLineHandler);
        } else {
            _offLineHandler();
        }
    },
    /**
     * Updates all url's cache
     * 
     * @returns {undefined}
     */
    updateAllCaches: function () {
        $.each(this.urls, function (index, cache) {
//            ApiCache.updateCache(url.cacheId);

            var flag = BigEyesSolutionApp.isConnected() && (time > cache.timeToLive);

            if (!flag) return;

            var time = (new Date()).getTime() - cache.lastUpdate;
            
            function _onLineHandler (data) {
                ApiCache.setContent(cacheId, data);
            }
            
            $.getJSON(cache.url, _onLineHandler);
        });
    }
}