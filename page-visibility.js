/* loosely based on http://mths.be/visibility by @mathias */
;(function(window, document, undefined) {
    if (document.hidden !== undefined) {
        return;
    }

    var prefixes = ['webkit', 'o', 'ms', 'moz'];
    for (var i = 0; i < prefixes.length; i++) {
        var prefix = prefixes[i];

        if (document[prefix + 'Hidden'] !== undefined) {
            var event = new Event('visibilitychange');
            document.addEventListener(prefix + 'visibilitychange', function () {
                document.dispatchEvent(event);
            });

            Object.defineProperty(document, 'hidden', {
                get: function () {
                    return document[prefix + 'Hidden'];
                }
            });

            Object.defineProperty(document, 'visibilityState', {
                get: function () {
                    return document[prefix + 'VisibilityState'];
                }
            });

            return;
        }
    }

    var currentlyHidden = false;
    if ('onfocusin' in document && 'hasFocus' in document) {
        // `fromElement` and `toElement` should both be `null` or `undefined`;
        // else, the page visibility hasn’t changed, but the user just clicked
        // somewhere in the doc. In IE9, we need to check the `relatedTarget`
        // property instead.
        var onFocusInOut = function (ev) {
            var originalEvent = ev.originalEvent;
            if (!originalEvent) {
                return;
            }

            if (originalEvent.toElement === undefined &&
                originalEvent.fromElement === undefined &&
                originalEvent.relatedTarget === undefined) {

                currentlyHidden = (ev.type == 'focusout');
                document.fireEvent('visibilitychange');
            }
        };

        document.attachEvent('focusin', onFocusInOut);
        document.attachEvent('focusout', onFocusInOut);
    } else {
        var event = new Event('visibilitychange');
        var onFocusBlur = function (ev) {
            currentlyHidden = (ev.type == 'blur');
            document.dispatchEvent(event);
        };

        window.addEventListener('focus', onFocusBlur);
        window.addEventListener('blur', onFocusBlur);
    }

    Object.defineProperty(document, 'hidden', {
        get: function () {
            return currentlyHidden;
        }
    });

    Object.defineProperty(document, 'visibilityState', {
        get: function () {
            return currentlyHidden ? 'hidden' : 'visible';
        }
    });
}(this, document));
