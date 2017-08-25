(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) {

    var JsonRequestDefinition = function(Request, pJSON) {

        function getInstance(options){
            var oldSuccess = options.success;
            options.success = function(event){
                if (event && event.data){
                    var json = pJSON.parse(event.data.responseText);
                    oldSuccess(json);
                }
            };
            return Request.getInstance(options);
        }

        return {
            getInstance: getInstance
        };
    };

    unitsInitiator.register("JsonRequest", JsonRequestDefinition, ["Request", "pJSON"]);
})(window.unitsInitiator);
