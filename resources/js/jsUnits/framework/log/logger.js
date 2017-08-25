(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout, console) {

    var loggerDefinition = function(LoggerConfiguration, pConsole, browserStorage) {
        var LOG_NAME = "lgnLog";

        var LOG_LEVEL_ENUM = {
            NONE: 0,
            ERROR: 1,
            INFO: 2,
            DEBUG: 3
        };

        var LOG_METHOD_ENUM = {
            CONSOLE: 0,
            COOKIE: 1
        };

        var loggerConfiguration = LoggerConfiguration.getInstance();
        var logLevel = LOG_LEVEL_ENUM.NONE;
        var logMethod = LOG_METHOD_ENUM.CONSOLE;

        function isLogLevelEnabled(requestedLogLevel){
            return logLevel >= requestedLogLevel;
        }

        function log(message, messagelevel){
            try {
                if (isLogLevelEnabled(messagelevel) && pConsole && pConsole.log){
                    if (logMethod === LOG_METHOD_ENUM.COOKIE){
                        var logStr = browserStorage.get(LOG_NAME);
                        browserStorage.set(LOG_NAME, logStr + "\n" + message);
                    } else {
                        pConsole.log(message);
                    }
                }
            } catch (ex){
                // igrnore exception
            }
        }

        function info(message){
            log(message, LOG_LEVEL_ENUM.INFO);
        }

        function error(message){
            log("ERROR: " + message, LOG_LEVEL_ENUM.ERROR);
        }

        function debug(message){
            log(message, LOG_LEVEL_ENUM.DEBUG);
        }

        function isLogLevelEnabled(requestedLogLevel){
            return logLevel >= requestedLogLevel;
        }

        function isInfoEnabled(){
            return isLogLevelEnabled(LOG_LEVEL_ENUM.INFO);
        }

        function isDebugEnabled(){
            return isLogLevelEnabled(LOG_LEVEL_ENUM.DEBUG);
        }

        function onConfLoaded(conf){
            if (conf.logLevel){
                logLevel = LOG_LEVEL_ENUM[conf.logLevel];
            }

            if (conf.logMethod){
                logMethod = LOG_METHOD_ENUM[conf.logMethod];
            }
        }

        function init(){
            if (logMethod === LOG_METHOD_ENUM.COOKIE) {
                browserStorage.set(LOG_NAME, "Logger Start");
            }
            loggerConfiguration.listenToConfigurationLoaded(onConfLoaded);
        }

        init();

        return {
            info: info,
            error: error,
            debug: debug,
            isInfoEnabled: isInfoEnabled,
            isDebugEnabled: isDebugEnabled
        }

    };

    unitsInitiator.register("logger", loggerDefinition, ["LoggerConfiguration", "pConsole", "browserStorage"]);
})(window.unitsInitiator);
