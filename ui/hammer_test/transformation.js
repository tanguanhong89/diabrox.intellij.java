function getResetTransform(o) {
    var targetScale = $(window).width() / o.width;
    var targetTranslateY =
        $(window).height() / 2 - (o.height * targetScale) / 2;
    return {
        scale: targetScale,
        translateX: 0,
        translateY: targetTranslateY,
    };
};

function setTransform(o, scale, transX, transY) {
    let transformString = "matrix(" + scale + ", 0, 0, " + scale + ", " + transX + ", " + transY + ")"
    o.css({
        "-webkit-transform": transformString,
        "-moz-transform": transformString,
        "-ms-transform": transformString,
        "-o-transform": transformString,
    });
};