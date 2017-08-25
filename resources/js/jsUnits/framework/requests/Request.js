(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) {
    
    var RequestDefinition = function(pXMLHttpRequest, pActiveXObject, pConsole, Occasions) {
        var EVENTS_DEFINITIONS_ENUM = {
            SUCCESS: "SUCCESS",
            ERROR: "ERROR"
        };

        var theClass = function() {
            var occasions = Occasions.getInstance();

            var retryTimes = 0;
            
            (function theConstructor(options) {
                occasions.afterPassed(EVENTS_DEFINITIONS_ENUM.SUCCESS, options.success);
                occasions.afterPassed(EVENTS_DEFINITIONS_ENUM.ERROR, options.error);
                    setTimeout(function(){
                        submit(options.url);
                    }, 
                    5);
                setTimeout(confLoadingTimeout, 5000);
            })(arguments[0]);

            function submit(url) {
                retryTimes += 1;
                var xhr = (("undefined" !== typeof pXMLHttpRequest)
                    ? new pXMLHttpRequest()
                    : new pActiveXObject("Microsoft.XMLHTTP"));

                xhr.open("get", url, true);
                xhr.onreadystatechange = function () {
                    var status;
                    var data;

                    // http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
                    if (4 === xhr.readyState) { // 'DONE'
                        status = xhr.status;
                        if (200 === status) {
                            try {
                                occasions.trigger(EVENTS_DEFINITIONS_ENUM.SUCCESS, {responseText: xhr.responseText});
                            }
                            catch(err) {
                                if (retryTimes < 4){
                                    submit(url)
                                } else {
                                    occasions.trigger(EVENTS_DEFINITIONS_ENUM.ERROR, {err: err});
                                }
                            }
                        }
                        else {
                            if (retryTimes < 4){
                                submit(url)
                            } else {
                                occasions.trigger(EVENTS_DEFINITIONS_ENUM.ERROR, {status: status});
                            }
                        }
                    }
                };

                xhr.send();
            }

            function confLoadingTimeout(){
                if (!occasions.isPassed(EVENTS_DEFINITIONS_ENUM.SUCCESS) && pConsole && pConsole.log){
                    pConsole.log("configuration> confLoadingTimeout > FAIL");
                }
            }
        };

        function getInstance(options){
            return new theClass(options);
        }

        return {
            /**
             * @param options = {
             *    containerId: the id of the HTML elements that contains this view,
             *     rememberMeEnabled: Is the remember me checkbox in the view can be changed,
             *     model = {
             *        siteId: The init value of the site field,
             *        userId: The init value of the user field,
             *        rememberMe: The init value in the remember me checkbox
             *     }
             * }
             */
            getInstance: getInstance
        };
    };

    unitsInitiator.register("Request", RequestDefinition, ["pXMLHttpRequest", "pActiveXObject", "pConsole", "Occasions"]);
})(window.unitsInitiator);
