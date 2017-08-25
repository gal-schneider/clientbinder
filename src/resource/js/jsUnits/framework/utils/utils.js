(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) {

    var utils = function(){
        var string = function() {
            function trim(str) {
                return str && str.replace(/^\s+|\s+$/g, '');
            }

            return {
                trim: trim
            };
        }();

        function isUndefined(value){
            return typeof value == "undefined";
        }

        function isExist(value){
            return !isUndefined(value) && value && value !== "";
        }

        return {
            string: string,
            isUndefined: isUndefined,
            /**
             * Not undifined and not null and not "" (empty string)
             */
            isExist: isExist
        }
    }

    unitsInitiator.register("utils", utils, []);

})(window.unitsInitiator);