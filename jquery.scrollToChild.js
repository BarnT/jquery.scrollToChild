/**
 * jQuery scrollToChild plugin v0.1
 * @author: Barnabas Tarkovacs
 * TODO: implement different scrollPane-position cases
 */
(function ($) {

    var defaults = {
        scrollDuration: 200,
        noAnim: false,
        scrollMargin: 0,
        scrollEase: 'linear',
        visibilityBased: false, // if true then scrolls only if element is not already visible in the scrollPane
        onNoElementFound: $.noop, // callback if no target element found in scrollPane
        onAnimationComplete: $.noop
    };

    $.fn.scrollToChild = function scrollToChild(childElement, options) {
        options = $.extend({}, defaults, options);
        // normalize animation options
        if (typeof options.scrollDuration !== 'number') {
            options.scrollDuration = defaults.scrollDuration;
        }
        if (typeof options.scrollEase !== 'string' || options.scrollEase === '') {
            options.scrollEase = defaults.scrollEase;
        }
        $(this).each(function () {
            var $scrollPane = $(this),
                $element = $scrollPane.find(childElement).eq(0),
                paneHeight, currentTopPos, currentBottomPos, elemHeight, elemTopPos, elemBottomPos, newPos;
            if (!$element.length) {
                options.onNoElementFound.call(this, childElement);
                return;
            }
            paneHeight = $scrollPane.height();
            currentTopPos = $scrollPane.scrollTop();
            currentBottomPos = currentTopPos + paneHeight;
            elemHeight = $element.height();
            elemTopPos = $element.offset().top - $scrollPane.offset().top + currentTopPos;
            elemBottomPos = elemTopPos + elemHeight;
            // Scroll only if animation is forced (visibilityBased == false), or if target element is not visible from top to bottom
            if (!options.visibilityBased || elemBottomPos < currentTopPos || elemTopPos > currentBottomPos || elemBottomPos > currentBottomPos || elemTopPos < currentTopPos) {
                newPos = elemTopPos - options.scrollMargin;
                newPos = newPos > 0 ? newPos : 0;
                if (options.noAnim) {
                    $scrollPane.scrollTop(newPos);
                    options.onAnimationComplete.call($scrollPane);
                } else {
                    $scrollPane.animate({ scrollTop: newPos },  options.scrollDuration, options.scrollEase, options.onAnimationComplete);
                }
            }
        });
        return this;
    };

}(jQuery));
