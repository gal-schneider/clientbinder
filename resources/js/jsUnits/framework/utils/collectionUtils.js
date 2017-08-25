(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) {

    var collectionUtils = function(pSetTimeout){

        function forEach(array, action, context){
            if (array !== null && array instanceof Array){
                doAction(array, 0, action, context);
            }
        }

        function doAction(array, index, action, context){
                action(array[index], context);
                pSetTimeout(function(){
                                doAction(array, index++, action, context);
                            },0);
        }

        return {
            forEach: forEach
        };
    };

    unitsInitiator.register("collectionUtils", collectionUtils, ["pSetTimeout"]);

})(window.unitsInitiator);

