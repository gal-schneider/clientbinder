(function(unitsInitiator, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) {

    var browserWindow = function(pWindow) {
        function getGlobal(name){
            return pWindow[name];
        }

        function addGlobal(name, obj){
            pWindow[name] = obj;
        }

        function openWindow(url, windowName, windowFeatures){
            pWindow.open(url, windowName, windowFeatures);
        }

        function scrollTo(x, y){
            pWindow.scrollTo(x, y);
        }

        return {
            getGlobal: getGlobal,
            addGlobal: addGlobal,
            openWindow: openWindow,
            scrollTo: scrollTo
        };
    }


    unitsInitiator.register("browserWindow", browserWindow, ["pWindow"]);
})(window.unitsInitiator);