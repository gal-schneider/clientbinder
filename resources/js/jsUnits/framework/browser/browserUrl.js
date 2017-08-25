(function(unitsInitiator, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) {

    var browserUrlDefinition = function(pWindow, pDocument, pDecodeURIComponent, pEscape, pObject){

        var queryParamsFromUrl = {};

        function buildQueryParam(params) {
            var str = "";
            for (var param in params) {
                str += "&" + param + "=" + params[param];
            }
            if (str != "") {
                str = "?" + str.substring(1);
            }
            return str;
        }

        function parseQueryString() {
            var loc = (pWindow ? pWindow.location : pDocument.location);
            if (loc) {
                var newUrl = loc.search.split('#')[0];
                var search = newUrl.split('?');
                if(search.length === 2) {
                    var args = search[1].split("&");
                    for (var ii = 0; ii < args.length; ii++){
                        var param = args[ii].split("=");
                        if (param.length > 1 && param[1].length > 0) {
                            if (param[0] === "usrId"){
                                try {
                                    queryParamsFromUrl[param[0]] = pDecodeURIComponent(pEscape(pDecodeURIComponent(pDecodeURIComponent(pEscape(param[1])))));
                                } catch (ex){
                                    queryParamsFromUrl[param[0]] = pDecodeURIComponent(param[1]);
                                }
                            } else {
                                queryParamsFromUrl[param[0]] = pDecodeURIComponent(param[1]);
                            }
                        }
                    }
                }
            }
        }

        function getQueryStringParameterValue (name, defaultValue) {
            var param = defaultValue;
            if (queryParamsFromUrl) {
                param = queryParamsFromUrl[name];
                var STRING_CLASS = '[object String]';
                // TODO (Gal): move it to utils.isString
                if (!(typeof param == 'string' || pObject.prototype.toString.call(param) == STRING_CLASS) || 0 === param.length) {
                    param = defaultValue;
                }
            }

            return param;
        }

        function addParameterFromQueryString(params, paramKey){
            var paramValue = getQueryStringParameterValue(paramKey);
            if (paramValue != undefined && paramValue != null && paramValue != "") {
                params[paramKey] = paramValue;
            }
            return params;
        }

        function getAllQueryParams(){
            return queryParamsFromUrl;
        }

        function getPathname(){
            return pWindow.location.pathname;
        }

        function getHost(){
            return pWindow.location.host;
        }
        function getDomain(){
            return getProtocol() + "://" + getHost() + "/";
        }


        function addHash(newUrl, afterHash) {
            if (afterHash) {
                return newUrl + "#" + afterHash;
            }
            else {
                return newUrl;
            }
        }


        function loadUrl(newUrl) {
            pWindow.location.href = newUrl;
        }

        function getProtocol(){
            if (pDocument.location.toString().indexOf('https:') == 0){
                return "https";
            } else {
                return "http";
            }
        }

        ///////////////////////////////

        //TODO:(daniel) Should we use the #??

        //////////////////////////////
        function replaceParam(url, paramName, paramValue){
            var searchHash = url.split("#");
            var beforeHash = searchHash[0];
            var afterHash = searchHash[1];

            var pattern = new RegExp('('+paramName+'=).*?(&|$)');
            var newUrl = beforeHash;
            if(beforeHash.search(pattern)>=0){ // Parameter exists, so replace it
                newUrl = beforeHash.replace(pattern,'$1' +   paramValue +  '$2');
            }
            else{ // New parameter, so add it
                newUrl = newUrl + (newUrl.indexOf('?')>0 ? '&' : '?') + paramName + '='  + paramValue ;
            }
            return addHash(newUrl, afterHash);
        }


        function replaceUrlParam(paramName, paramValue){
            var url = pWindow.location.href;
            var searchHash = url.split("#");
            var beforeHash = searchHash[0];
            var afterHash = searchHash[1];

            var pattern = new RegExp('('+paramName+'=).*?(&|$)');
            var newUrl = beforeHash;
            if(beforeHash.search(pattern) >= 0){ // Parameter exists, so replace it
                newUrl = beforeHash.replace(pattern,'$1' +   paramValue +  '$2');
            } else{ // New parameter, so add it
                newUrl = newUrl + (newUrl.indexOf('?')>0 ? '&' : '?') + paramName + '='  + paramValue ;
            }
            loadUrl(addHash(newUrl, afterHash));
        }

        parseQueryString();

        return {
            buildQueryParam: buildQueryParam,
            getQueryStringParameterValue: getQueryStringParameterValue,
            addParameterFromQueryString: addParameterFromQueryString,
            getAllQueryParams: getAllQueryParams,
            replaceUrlParam: replaceUrlParam,
            replaceParam: replaceParam,
            loadUrl: loadUrl,
            getPathname: getPathname,
            getProtocol: getProtocol,
            getDomain: getDomain
        }
    };

    unitsInitiator.register("browserUrl", browserUrlDefinition, ["pWindow", "pDocument", "pDecodeURIComponent", "pEscape", "pObject"]);
    
})(window.unitsInitiator);
        