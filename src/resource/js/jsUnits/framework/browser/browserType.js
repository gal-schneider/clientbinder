(function(unitsInitiator) {

    var browserType = function(pDocument, pNavigator, logger){
        //--------------------------------------------------
        // Based on device from lpTag.device
        //--------------------------------------------------

        function isIE8(){
            return pDocument.getElementById("ie8");
        }

        function initIsIE() {
            var not_true = false;
            var docMode = pDocument.documentMode;
            var isIE = /*@cc_on!@*/not_true; // If conditional compilation works, then we have IE 11-.

            if (!isIE) {
                /// If document.documentMode is a number, then it is a read-only property, and so we have IE 8+.
                // Try to force this property to be a string.
                try {
                    pDocument.documentMode = "";
                }
                catch(ex) {
                    // Nothing to do, fallback will be checked later
                }

                isIE = "number" === typeof pDocument.documentMode;

                // Switch back the value to be unobtrusive for non-IE browsers.
                try {
                    pDocument.documentMode = docMode;
                }
                catch(ex) {
                    // Nothing to do, fallback will be checked later
                }
            }

            if (!isIE && pNavigator && pNavigator.userAgent) {
                // Otherwise, if Trident exists in the user agent string, then we have IE 8+.
                isIE = "Netscape" === pNavigator.appName &&
                    /Trident\/.*rv:([0-9]{1,}[.0-9]{0,})/.test(pNavigator.userAgent);
            }

            // Otherwise, we have a non-IE browser.
            return isIE;
        }

        return {
            isIE8: isIE8,
            isIE: initIsIE
        };
    }        
    

    unitsInitiator.register("browserType", browserType, ["pDocument", "pNavigator", "logger"]);
})(window.unitsInitiator);

    