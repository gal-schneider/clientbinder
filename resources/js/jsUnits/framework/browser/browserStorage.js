(function(unitsInitiator, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) {

    var browserStorageDefinition = function(pDocument, pEscape, pUnescape, pDate, utils){
        // TODO (Gal) : do not get pEscape, pUnescape, the units which uses this unit should use them and supply a ready to use parameters

        /**
         *
         * if pDocument has a property "cookie" with a value, or a value can be created on a cookie - returns true
         */

        function isEnabled() {
            var enabled = false;
            if ("cookie" in pDocument){
                if (pDocument.cookie.length > 0){
                    enabled = true;
                } else {
                    var TEST = "test";
                    pDocument.cookie = TEST;
                    if (pDocument.cookie.indexOf(TEST) > -1){
                        enabled = true;
                    }
                }
            }
            return enabled;
        }

        /**
         *
         *  returns the text after <name=> up to the ; char.
         * if name doesn't exist it returns ""
         * if name is "" or undefined it returns null
         */
        function get(name) {
            var start = pDocument.cookie.indexOf(name + "=");
            if (name === "" || utils.isUndefined(name) || start === -1) {
                return null;
            }

            var len = start + name.length + 1;
            if (( !start ) && ( name != pDocument.cookie.substring(0, name.length) )) {
                return null;
            }
            var end = pDocument.cookie.indexOf(";", len);
            if (end == -1) {
                end = pDocument.cookie.length;
            }
            return pUnescape(pDocument.cookie.substring(len, end));
        }


        /**
         * Sets "<name>=<value escaped using pEscape>;expires=<expires converted to GMT using pDate.toGMTString in date format>;path=/" in the injected pDocument.cookie
         */
        function set(name, value, daysToExpire) {
            if (name === "" || utils.isUndefined(name)){
                return;
            }

            // set time, it's in milliseconds
            var today = new pDate();
            today.setTime(today.getTime());

            /*
             if the expires variable is set, make the correct
             expires time, the current script below will set
             it for x number of days, to make it for hours,
             delete * 24, for minutes, delete * 60 * 24
             */
            if (daysToExpire) {
                daysToExpire = daysToExpire * 1000 * 60 * 60 * 24;
            }
            var expires_date = new pDate(today.getTime() + (daysToExpire));

            var escapedValue = "";
            if (!utils.isUndefined(value)){
                escapedValue = pEscape(value);
            }

            pDocument.cookie = name + "=" + escapedValue +
                ( ( daysToExpire ) ? ";expires=" + expires_date.toGMTString() : "" ) +
                ";path=/";
        }

        /**
         * remove the cookie by setting the value of the <name> to "", and set the cookie expiration date to yesterday
         */

        function remove(name) {
            set(name, undefined, -1); //TODO (yoavp) check the process because it adds parameters to the string when removing wrong key
        }

        return {
            isEnabled: isEnabled,
            get: get,
            set: set,
            remove: remove
        };
    };
        

    unitsInitiator.register("browserStorage", browserStorageDefinition, ["pDocument", "pEscape", "pUnescape", "pDate", "utils"]);

})(window.unitsInitiator);