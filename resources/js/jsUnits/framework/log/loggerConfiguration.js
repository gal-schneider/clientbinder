(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) {

    var loggerConfigurationDefinition = function(Configuration) {
        var URL = "./conf/authentication-logger-conf.json";

        var InstanceClass = function() {

            var ConfigurationClass = Configuration.getClass();

            return new ConfigurationClass({
                url: URL
            });
        };

        var singleton = new InstanceClass();

        function getInstance(){
            return singleton;
        }

        return {
            getInstance: getInstance
        };

    };

    unitsInitiator.register("LoggerConfiguration", loggerConfigurationDefinition, ["Configuration"]);
})(window.unitsInitiator);
