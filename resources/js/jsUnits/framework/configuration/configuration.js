(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) {

    var ConfigurationDefinition = function(JsonRequest, Occasions) {
        var EVENTS_DEFINITIONS_ENUM = {
            CONF_LOADED: "CONF_LOADED"
        };

        var InstanceClass = function() {
            var occasions = Occasions.getInstance();

            (function theConstructor(options) {
                loadConf(options);
            })(arguments[0]);

            function listenToConfigurationLoaded(callback){
                occasions.afterPassed(EVENTS_DEFINITIONS_ENUM.CONF_LOADED, callback);
            }

            function onConfLoaded(conf) {
                occasions.trigger(EVENTS_DEFINITIONS_ENUM.CONF_LOADED, conf);
            }

            function loadConf(options) {
                var url = "./conf/authentication-conf.json";
                if (options && options.url){
                    url = options.url;
                }

                JsonRequest.getInstance({
                    url: url,
                    success: onConfLoaded,
                    error: function (status) {}
                });
            }

            return {
                listenToConfigurationLoaded: listenToConfigurationLoaded
            };
        };

        var singleton = new InstanceClass();

        function getInstance(){
            return singleton;
        }

        function getClass(){
            return InstanceClass;
        }

        return {
            getInstance: getInstance,
            getClass: getClass
        };

    };

    unitsInitiator.register("Configuration", ConfigurationDefinition, ["JsonRequest", "Occasions"]);
})(window.unitsInitiator);
