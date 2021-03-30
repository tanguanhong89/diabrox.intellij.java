let minZoom = 0.01;
let maxZoom = 1;
// including the svgpanzoom lib from git not allowed, added compressed version to script

!(function a(b, c, d) {
    function e(g, h) {
        if (!c[g]) {
            if (!b[g]) {
                var i = "function" == typeof require && require;
                if (!h && i) return i(g, !0);
                if (f) return f(g, !0);
                var j = new Error("Cannot find module '" + g + "'");
                throw ((j.code = "MODULE_NOT_FOUND"), j);
            }
            var k = (c[g] = {
                exports: {},
            });
            b[g][0].call(
                k.exports,
                function(a) {
                    var c = b[g][1][a];
                    return e(c ? c : a);
                },
                k,
                k.exports,
                a,
                b,
                c,
                d
            );
        }
        return c[g].exports;
    }
    for (
        var f = "function" == typeof require && require, g = 0; g < d.length; g++
    )
        e(d[g]);
    return e;
})({
    1: [
        function(a, b, c) {
            var d = a("./svg-pan-zoom.js");
            !(function(a, c) {
                "function" == typeof define && define.amd ?
                    define("svg-pan-zoom", function() {
                        return d;
                    }) :
                    "undefined" != typeof b &&
                    b.exports &&
                    ((b.exports = d), (a.svgPanZoom = d));
            })(window, document);
        }, {
            "./svg-pan-zoom.js": 4,
        },
    ],
    2: [
        function(a, b, c) {
            var d = a("./svg-utilities");
            b.exports = {
                enable: function(a) {
                    var b = a.svg.querySelector("defs");
                    b ||
                        ((b = document.createElementNS(d.svgNS, "defs")),
                            a.svg.appendChild(b));
                    var c = document.createElementNS(d.svgNS, "style");
                    c.setAttribute("type", "text/css"),
                        (c.textContent =
                            ".svg-pan-zoom-control { cursor: pointer; fill: black; fill-opacity: 0.333; } .svg-pan-zoom-control:hover { fill-opacity: 0.8; } .svg-pan-zoom-control-background { fill: white; fill-opacity: 0.5; } .svg-pan-zoom-control-background { fill-opacity: 0.8; }"),
                        b.appendChild(c);
                    var e = document.createElementNS(d.svgNS, "g");
                    e.setAttribute("id", "svg-pan-zoom-controls"),
                        e.setAttribute(
                            "transform",
                            "translate(" +
                            (a.width - 70) +
                            " " +
                            (a.height - 76) +
                            ") scale(0.75)"
                        ),
                        e.setAttribute("class", "svg-pan-zoom-control"),
                        e.appendChild(this._createZoomIn(a)),
                        e.appendChild(this._createZoomReset(a)),
                        e.appendChild(this._createZoomOut(a)),
                        a.svg.appendChild(e),
                        (a.controlIcons = e);
                },
                _createZoomIn: function(a) {
                    var b = document.createElementNS(d.svgNS, "g");
                    b.setAttribute("id", "svg-pan-zoom-zoom-in"),
                        b.setAttribute(
                            "transform",
                            "translate(30.5 5) scale(0.015)"
                        ),
                        b.setAttribute("class", "svg-pan-zoom-control"),
                        b.addEventListener(
                            "click",
                            function() {
                                a.getPublicInstance().zoomIn();
                            }, !1
                        ),
                        b.addEventListener(
                            "touchstart",
                            function() {
                                a.getPublicInstance().zoomIn();
                            }, !1
                        );
                    var c = document.createElementNS(d.svgNS, "rect");
                    c.setAttribute("x", "0"),
                        c.setAttribute("y", "0"),
                        c.setAttribute("width", "1500"),
                        c.setAttribute("height", "1400"),
                        c.setAttribute("class", "svg-pan-zoom-control-background"),
                        b.appendChild(c);
                    var e = document.createElementNS(d.svgNS, "path");
                    return (
                        e.setAttribute(
                            "d",
                            "M1280 576v128q0 26 -19 45t-45 19h-320v320q0 26 -19 45t-45 19h-128q-26 0 -45 -19t-19 -45v-320h-320q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h320v-320q0 -26 19 -45t45 -19h128q26 0 45 19t19 45v320h320q26 0 45 19t19 45zM1536 1120v-960 q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5t84.5 -203.5z"
                        ),
                        e.setAttribute("class", "svg-pan-zoom-control-element"),
                        b.appendChild(e),
                        b
                    );
                },
                _createZoomReset: function(a) {
                    var b = document.createElementNS(d.svgNS, "g");
                    b.setAttribute("id", "svg-pan-zoom-reset-pan-zoom"),
                        b.setAttribute("transform", "translate(5 35) scale(0.4)"),
                        b.setAttribute("class", "svg-pan-zoom-control"),
                        b.addEventListener(
                            "click",
                            function() {
                                a.getPublicInstance().reset();
                            }, !1
                        ),
                        b.addEventListener(
                            "touchstart",
                            function() {
                                a.getPublicInstance().reset();
                            }, !1
                        );
                    var c = document.createElementNS(d.svgNS, "rect");
                    c.setAttribute("x", "2"),
                        c.setAttribute("y", "2"),
                        c.setAttribute("width", "182"),
                        c.setAttribute("height", "58"),
                        c.setAttribute("class", "svg-pan-zoom-control-background"),
                        b.appendChild(c);
                    var e = document.createElementNS(d.svgNS, "path");
                    e.setAttribute(
                            "d",
                            "M33.051,20.632c-0.742-0.406-1.854-0.609-3.338-0.609h-7.969v9.281h7.769c1.543,0,2.701-0.188,3.473-0.562c1.365-0.656,2.048-1.953,2.048-3.891C35.032,22.757,34.372,21.351,33.051,20.632z"
                        ),
                        e.setAttribute("class", "svg-pan-zoom-control-element"),
                        b.appendChild(e);
                    var f = document.createElementNS(d.svgNS, "path");
                    return (
                        f.setAttribute(
                            "d",
                            "M170.231,0.5H15.847C7.102,0.5,0.5,5.708,0.5,11.84v38.861C0.5,56.833,7.102,61.5,15.847,61.5h154.384c8.745,0,15.269-4.667,15.269-10.798V11.84C185.5,5.708,178.976,0.5,170.231,0.5z M42.837,48.569h-7.969c-0.219-0.766-0.375-1.383-0.469-1.852c-0.188-0.969-0.289-1.961-0.305-2.977l-0.047-3.211c-0.03-2.203-0.41-3.672-1.142-4.406c-0.732-0.734-2.103-1.102-4.113-1.102h-7.05v13.547h-7.055V14.022h16.524c2.361,0.047,4.178,0.344,5.45,0.891c1.272,0.547,2.351,1.352,3.234,2.414c0.731,0.875,1.31,1.844,1.737,2.906s0.64,2.273,0.64,3.633c0,1.641-0.414,3.254-1.242,4.84s-2.195,2.707-4.102,3.363c1.594,0.641,2.723,1.551,3.387,2.73s0.996,2.98,0.996,5.402v2.32c0,1.578,0.063,2.648,0.19,3.211c0.19,0.891,0.635,1.547,1.333,1.969V48.569z M75.579,48.569h-26.18V14.022h25.336v6.117H56.454v7.336h16.781v6H56.454v8.883h19.125V48.569z M104.497,46.331c-2.44,2.086-5.887,3.129-10.34,3.129c-4.548,0-8.125-1.027-10.731-3.082s-3.909-4.879-3.909-8.473h6.891c0.224,1.578,0.662,2.758,1.316,3.539c1.196,1.422,3.246,2.133,6.15,2.133c1.739,0,3.151-0.188,4.236-0.562c2.058-0.719,3.087-2.055,3.087-4.008c0-1.141-0.504-2.023-1.512-2.648c-1.008-0.609-2.607-1.148-4.796-1.617l-3.74-0.82c-3.676-0.812-6.201-1.695-7.576-2.648c-2.328-1.594-3.492-4.086-3.492-7.477c0-3.094,1.139-5.664,3.417-7.711s5.623-3.07,10.036-3.07c3.685,0,6.829,0.965,9.431,2.895c2.602,1.93,3.966,4.73,4.093,8.402h-6.938c-0.128-2.078-1.057-3.555-2.787-4.43c-1.154-0.578-2.587-0.867-4.301-0.867c-1.907,0-3.428,0.375-4.565,1.125c-1.138,0.75-1.706,1.797-1.706,3.141c0,1.234,0.561,2.156,1.682,2.766c0.721,0.406,2.25,0.883,4.589,1.43l6.063,1.43c2.657,0.625,4.648,1.461,5.975,2.508c2.059,1.625,3.089,3.977,3.089,7.055C108.157,41.624,106.937,44.245,104.497,46.331z M139.61,48.569h-26.18V14.022h25.336v6.117h-18.281v7.336h16.781v6h-16.781v8.883h19.125V48.569z M170.337,20.14h-10.336v28.43h-7.266V20.14h-10.383v-6.117h27.984V20.14z"
                        ),
                        f.setAttribute("class", "svg-pan-zoom-control-element"),
                        b.appendChild(f),
                        b
                    );
                },
                _createZoomOut: function(a) {
                    var b = document.createElementNS(d.svgNS, "g");
                    b.setAttribute("id", "svg-pan-zoom-zoom-out"),
                        b.setAttribute(
                            "transform",
                            "translate(30.5 70) scale(0.015)"
                        ),
                        b.setAttribute("class", "svg-pan-zoom-control"),
                        b.addEventListener(
                            "click",
                            function() {
                                a.getPublicInstance().zoomOut();
                            }, !1
                        ),
                        b.addEventListener(
                            "touchstart",
                            function() {
                                a.getPublicInstance().zoomOut();
                            }, !1
                        );
                    var c = document.createElementNS(d.svgNS, "rect");
                    c.setAttribute("x", "0"),
                        c.setAttribute("y", "0"),
                        c.setAttribute("width", "1500"),
                        c.setAttribute("height", "1400"),
                        c.setAttribute("class", "svg-pan-zoom-control-background"),
                        b.appendChild(c);
                    var e = document.createElementNS(d.svgNS, "path");
                    return (
                        e.setAttribute(
                            "d",
                            "M1280 576v128q0 26 -19 45t-45 19h-896q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h896q26 0 45 19t19 45zM1536 1120v-960q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5 t84.5 -203.5z"
                        ),
                        e.setAttribute("class", "svg-pan-zoom-control-element"),
                        b.appendChild(e),
                        b
                    );
                },
                disable: function(a) {
                    a.controlIcons &&
                        (a.controlIcons.parentNode.removeChild(a.controlIcons),
                            (a.controlIcons = null));
                },
            };
        }, {
            "./svg-utilities": 5,
        },
    ],
    3: [
        function(a, b, c) {
            var d = a("./svg-utilities"),
                e = a("./utilities"),
                f = function(a, b) {
                    this.init(a, b);
                };
            (f.prototype.init = function(a, b) {
                (this.viewport = a),
                (this.options = b),
                (this.originalState = {
                    zoom: 1,
                    x: 0,
                    y: 0,
                }),
                (this.activeState = {
                    zoom: 1,
                    x: 0,
                    y: 0,
                }),
                (this.updateCTMCached = e.proxy(this.updateCTM, this)),
                (this.requestAnimationFrame = e.createRequestAnimationFrame(
                    this.options.refreshRate
                )),
                (this.viewBox = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                }),
                this.cacheViewBox(),
                    this.processCTM(),
                    this.updateCTM();
            }),
            (f.prototype.cacheViewBox = function() {
                var a = this.options.svg.getAttribute("viewBox");
                if (a) {
                    var b = a
                        .split(/[\s\,]/)
                        .filter(function(a) {
                            return a;
                        })
                        .map(parseFloat);
                    (this.viewBox.x = b[0]),
                    (this.viewBox.y = b[1]),
                    (this.viewBox.width = b[2]),
                    (this.viewBox.height = b[3]);
                    var c = Math.min(
                        this.options.width / this.viewBox.width,
                        this.options.height / this.viewBox.height
                    );
                    (this.activeState.zoom = c),
                    (this.activeState.x =
                        (this.options.width - this.viewBox.width * c) / 2),
                    (this.activeState.y =
                        (this.options.height - this.viewBox.height * c) / 2),
                    this.updateCTMOnNextFrame(),
                        this.options.svg.removeAttribute("viewBox");
                } else {
                    var d = this.viewport.getBBox();
                    (this.viewBox.x = d.x),
                    (this.viewBox.y = d.y),
                    (this.viewBox.width = d.width),
                    (this.viewBox.height = d.height);
                }
            }),
            (f.prototype.recacheViewBox = function() {
                var a = this.viewport.getBoundingClientRect(),
                    b = a.width / this.getZoom(),
                    c = a.height / this.getZoom();
                (this.viewBox.x = 0),
                (this.viewBox.y = 0),
                (this.viewBox.width = b),
                (this.viewBox.height = c);
            }),
            (f.prototype.getViewBox = function() {
                return e.extend({}, this.viewBox);
            }),
            (f.prototype.processCTM = function() {
                var a = this.getCTM();
                if (this.options.fit || this.options.contain) {
                    var b;
                    (b = this.options.fit ?
                        Math.min(
                            this.options.width / this.viewBox.width,
                            this.options.height / this.viewBox.height
                        ) :
                        Math.max(
                            this.options.width / this.viewBox.width,
                            this.options.height / this.viewBox.height
                        )),
                    (a.a = b),
                    (a.d = b),
                    (a.e = -this.viewBox.x * b),
                    (a.f = -this.viewBox.y * b);
                }
                if (this.options.center) {
                    var c =
                        0.5 *
                        (this.options.width -
                            (this.viewBox.width + 2 * this.viewBox.x) * a.a),
                        d =
                        0.5 *
                        (this.options.height -
                            (this.viewBox.height + 2 * this.viewBox.y) * a.a);
                    (a.e = c), (a.f = d);
                }
                (this.originalState.zoom = a.a),
                (this.originalState.x = a.e),
                (this.originalState.y = a.f),
                this.setCTM(a);
            }),
            (f.prototype.getOriginalState = function() {
                return e.extend({}, this.originalState);
            }),
            (f.prototype.getState = function() {
                return e.extend({}, this.activeState);
            }),
            (f.prototype.getZoom = function() {
                return this.activeState.zoom;
            }),
            (f.prototype.getRelativeZoom = function() {
                return this.activeState.zoom / this.originalState.zoom;
            }),
            (f.prototype.computeRelativeZoom = function(a) {
                return a / this.originalState.zoom;
            }),
            (f.prototype.getPan = function() {
                return {
                    x: this.activeState.x,
                    y: this.activeState.y,
                };
            }),
            (f.prototype.getCTM = function() {
                var a = this.options.svg.createSVGMatrix();
                return (
                    (a.a = this.activeState.zoom),
                    (a.b = 0),
                    (a.c = 0),
                    (a.d = this.activeState.zoom),
                    (a.e = this.activeState.x),
                    (a.f = this.activeState.y),
                    a
                );
            }),
            (f.prototype.setCTM = function(a) {
                var b = this.isZoomDifferent(a),
                    c = this.isPanDifferent(a);
                if (b || c) {
                    if (
                        (b &&
                            this.options.beforeZoom(
                                this.getRelativeZoom(),
                                this.computeRelativeZoom(a.a)
                            ) === !1 &&
                            ((a.a = a.d = this.activeState.zoom), (b = !1)),
                            c)
                    ) {
                        var d = this.options.beforePan(this.getPan(), {
                                x: a.e,
                                y: a.f,
                            }),
                            f = !1,
                            g = !1;
                        d === !1 ?
                            ((a.e = this.getPan().x),
                                (a.f = this.getPan().y),
                                (f = g = !0)) :
                            e.isObject(d) &&
                            (d.x === !1 ?
                                ((a.e = this.getPan().x), (f = !0)) :
                                e.isNumber(d.x) && (a.e = d.x),
                                d.y === !1 ?
                                ((a.f = this.getPan().y), (g = !0)) :
                                e.isNumber(d.y) && (a.f = d.y)),
                            f && g && (c = !1);
                    }
                    (b || c) &&
                    (this.updateCache(a),
                        this.updateCTMOnNextFrame(),
                        b && this.options.onZoom(this.getRelativeZoom()),
                        c && this.options.onPan(this.getPan()));
                }
            }),
            (f.prototype.isZoomDifferent = function(a) {
                return this.activeState.zoom !== a.a;
            }),
            (f.prototype.isPanDifferent = function(a) {
                return (
                    this.activeState.x !== a.e || this.activeState.y !== a.f
                );
            }),
            (f.prototype.updateCache = function(a) {
                (this.activeState.zoom = a.a),
                (this.activeState.x = a.e),
                (this.activeState.y = a.f);
            }),
            (f.prototype.pendingUpdate = !1),
            (f.prototype.updateCTMOnNextFrame = function() {
                this.pendingUpdate ||
                    ((this.pendingUpdate = !0),
                        this.requestAnimationFrame.call(
                            window,
                            this.updateCTMCached
                        ));
            }),
            (f.prototype.updateCTM = function() {
                d.setCTM(this.viewport, this.getCTM(), this.defs),
                    (this.pendingUpdate = !1);
            }),
            (b.exports = function(a, b) {
                return new f(a, b);
            });
        }, {
            "./svg-utilities": 5,
            "./utilities": 7,
        },
    ],
    4: [
        function(a, b, c) {
            var d = a("./uniwheel"),
                e = a("./control-icons"),
                f = a("./utilities"),
                g = a("./svg-utilities"),
                h = a("./shadow-viewport"),
                i = function(a, b) {
                    this.init(a, b);
                },
                j = {
                    viewportSelector: ".svg-pan-zoom_viewport",
                    panEnabled: !0,
                    controlIconsEnabled: !1,
                    zoomEnabled: !0,
                    dblClickZoomEnabled: !0,
                    mouseWheelZoomEnabled: !0,
                    preventMouseEventsDefault: !0,
                    zoomScaleSensitivity: 0.1,
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                    fit: !0,
                    contain: !1,
                    center: !0,
                    refreshRate: "auto",
                    beforeZoom: null,
                    onZoom: null,
                    beforePan: null,
                    onPan: null,
                    customEventsHandler: null,
                    eventsListenerElement: null,
                };
            (i.prototype.init = function(a, b) {
                var c = this;
                (this.svg = a),
                (this.defs = a.querySelector("defs")),
                g.setupSvgAttributes(this.svg),
                    (this.options = f.extend(f.extend({}, j), b)),
                    (this.state = "none");
                var d = g.getBoundingClientRectNormalized(a);
                (this.width = d.width),
                (this.height = d.height),
                (this.viewport = h(
                    g.getOrCreateViewport(
                        this.svg,
                        this.options.viewportSelector
                    ), {
                        svg: this.svg,
                        width: this.width,
                        height: this.height,
                        fit: this.options.fit,
                        contain: this.options.contain,
                        center: this.options.center,
                        refreshRate: this.options.refreshRate,
                        beforeZoom: function(a, b) {
                            if (c.viewport && c.options.beforeZoom)
                                return c.options.beforeZoom(a, b);
                        },
                        onZoom: function(a) {
                            if (c.viewport && c.options.onZoom)
                                return c.options.onZoom(a);
                        },
                        beforePan: function(a, b) {
                            if (c.viewport && c.options.beforePan)
                                return c.options.beforePan(a, b);
                        },
                        onPan: function(a) {
                            if (c.viewport && c.options.onPan)
                                return c.options.onPan(a);
                        },
                    }
                ));
                var i = this.getPublicInstance();
                i.setBeforeZoom(this.options.beforeZoom),
                    i.setOnZoom(this.options.onZoom),
                    i.setBeforePan(this.options.beforePan),
                    i.setOnPan(this.options.onPan),
                    this.options.controlIconsEnabled && e.enable(this),
                    (this.lastMouseWheelEventTime = Date.now()),
                    this.setupHandlers();
            }),
            (i.prototype.setupHandlers = function() {
                var a = this,
                    b = null;
                if (
                    ((this.eventListeners = {
                            mousedown: function(b) {
                                return a.handleMouseDown(b, null);
                            },
                            touchstart: function(c) {
                                var d = a.handleMouseDown(c, b);
                                return (b = c), d;
                            },
                            mouseup: function(b) {
                                return a.handleMouseUp(b);
                            },
                            touchend: function(b) {
                                return a.handleMouseUp(b);
                            },
                            mousemove: function(b) {
                                return a.handleMouseMove(b);
                            },
                            touchmove: function(b) {
                                return a.handleMouseMove(b);
                            },
                            mouseleave: function(b) {
                                return a.handleMouseUp(b);
                            },
                            touchleave: function(b) {
                                return a.handleMouseUp(b);
                            },
                            touchcancel: function(b) {
                                return a.handleMouseUp(b);
                            },
                        }),
                        null != this.options.customEventsHandler)
                ) {
                    this.options.customEventsHandler.init({
                        svgElement: this.svg,
                        eventsListenerElement: this.options.eventsListenerElement,
                        instance: this.getPublicInstance(),
                    });
                    var c = this.options.customEventsHandler.haltEventListeners;
                    if (c && c.length)
                        for (var d = c.length - 1; d >= 0; d--)
                            this.eventListeners.hasOwnProperty(c[d]) &&
                            delete this.eventListeners[c[d]];
                }
                for (var e in this.eventListeners)
                    (
                        this.options.eventsListenerElement || this.svg
                    ).addEventListener(e, this.eventListeners[e], !1);
                this.options.mouseWheelZoomEnabled &&
                    ((this.options.mouseWheelZoomEnabled = !1),
                        this.enableMouseWheelZoom());
            }),
            (i.prototype.enableMouseWheelZoom = function() {
                if (!this.options.mouseWheelZoomEnabled) {
                    var a = this;
                    (this.wheelListener = function(b) {
                        return a.handleMouseWheel(b);
                    }),
                    d.on(
                            this.options.eventsListenerElement || this.svg,
                            this.wheelListener, !1
                        ),
                        (this.options.mouseWheelZoomEnabled = !0);
                }
            }),
            (i.prototype.disableMouseWheelZoom = function() {
                this.options.mouseWheelZoomEnabled &&
                    (d.off(
                            this.options.eventsListenerElement || this.svg,
                            this.wheelListener, !1
                        ),
                        (this.options.mouseWheelZoomEnabled = !1));
            }),
            (i.prototype.handleMouseWheel = function(a) {
                if (this.options.zoomEnabled && "none" === this.state) {
                    this.options.preventMouseEventsDefault &&
                        (a.preventDefault ?
                            a.preventDefault() :
                            (a.returnValue = !1));
                    var b = a.deltaY || 1,
                        c = Date.now() - this.lastMouseWheelEventTime,
                        d = 3 + Math.max(0, 30 - c);
                    (this.lastMouseWheelEventTime = Date.now()),
                    "deltaMode" in a &&
                        0 === a.deltaMode &&
                        a.wheelDelta &&
                        (b =
                            0 === a.deltaY ?
                            0 :
                            Math.abs(a.wheelDelta) / a.deltaY),
                        (b = -0.3 < b && b < 0.3 ?
                            b :
                            ((b > 0 ? 1 : -1) * Math.log(Math.abs(b) + 10)) /
                            d);
                    var e = this.svg.getScreenCTM().inverse(),
                        f = g.getEventPoint(a, this.svg).matrixTransform(e),
                        h = Math.pow(
                            1 + this.options.zoomScaleSensitivity, -1 * b
                        );
                    this.zoomAtPoint(h, f);
                }
            }),
            (i.prototype.zoomAtPoint = function(a, b, c) {
                var d = this.viewport.getOriginalState();
                c
                    ?
                    ((a = Math.max(
                            this.options.minZoom * d.zoom,
                            Math.min(this.options.maxZoom * d.zoom, a)
                        )),
                        (a /= this.getZoom())) :
                    this.getZoom() * a < this.options.minZoom * d.zoom ?
                    (a = (this.options.minZoom * d.zoom) / this.getZoom()) :
                    this.getZoom() * a > this.options.maxZoom * d.zoom &&
                    (a = (this.options.maxZoom * d.zoom) / this.getZoom());
                var e = this.viewport.getCTM(),
                    f = b.matrixTransform(e.inverse()),
                    g = this.svg
                    .createSVGMatrix()
                    .translate(f.x, f.y)
                    .scale(a)
                    .translate(-f.x, -f.y),
                    h = e.multiply(g);
                h.a !== e.a && this.viewport.setCTM(h);
            }),
            (i.prototype.zoom = function(a, b) {
                this.zoomAtPoint(
                    a,
                    g.getSvgCenterPoint(this.svg, this.width, this.height),
                    b
                );
            }),
            (i.prototype.publicZoom = function(a, b) {
                b && (a = this.computeFromRelativeZoom(a)), this.zoom(a, b);
            }),
            (i.prototype.publicZoomAtPoint = function(a, b, c) {
                if (
                    (c && (a = this.computeFromRelativeZoom(a)), !("SVGPoint" !== f.getType(b) && "x" in b && "y" in b))
                )
                    throw new Error("Given point is invalid");
                (b = g.createSVGPoint(this.svg, b.x, b.y)),
                this.zoomAtPoint(a, b, c);
            }),
            (i.prototype.getZoom = function() {
                return this.viewport.getZoom();
            }),
            (i.prototype.getRelativeZoom = function() {
                return this.viewport.getRelativeZoom();
            }),
            (i.prototype.computeFromRelativeZoom = function(a) {
                return a * this.viewport.getOriginalState().zoom;
            }),
            (i.prototype.resetZoom = function() {
                var a = this.viewport.getOriginalState();
                this.zoom(a.zoom, !0);
            }),
            (i.prototype.resetPan = function() {
                this.pan(this.viewport.getOriginalState());
            }),
            (i.prototype.reset = function() {
                this.resetZoom(), this.resetPan();
            }),
            (i.prototype.handleDblClick = function(a) {
                if (
                    (this.options.preventMouseEventsDefault &&
                        (a.preventDefault ?
                            a.preventDefault() :
                            (a.returnValue = !1)),
                        this.options.controlIconsEnabled)
                ) {
                    var b = a.target.getAttribute("class") || "";
                    if (b.indexOf("svg-pan-zoom-control") > -1) return !1;
                }
                var c;
                c = a.shiftKey ?
                    1 / (2 * (1 + this.options.zoomScaleSensitivity)) :
                    2 * (1 + this.options.zoomScaleSensitivity);
                var d = g
                    .getEventPoint(a, this.svg)
                    .matrixTransform(this.svg.getScreenCTM().inverse());
                this.zoomAtPoint(c, d);
            }),
            (i.prototype.handleMouseDown = function(a, b) {
                this.options.preventMouseEventsDefault &&
                    (a.preventDefault ?
                        a.preventDefault() :
                        (a.returnValue = !1)),
                    f.mouseAndTouchNormalize(a, this.svg),
                    this.options.dblClickZoomEnabled && f.isDblClick(a, b) ?
                    this.handleDblClick(a) :
                    ((this.state = "pan"),
                        (this.firstEventCTM = this.viewport.getCTM()),
                        (this.stateOrigin = g
                            .getEventPoint(a, this.svg)
                            .matrixTransform(this.firstEventCTM.inverse())));
            }),
            (i.prototype.handleMouseMove = function(a) {
                if (
                    (this.options.preventMouseEventsDefault &&
                        (a.preventDefault ?
                            a.preventDefault() :
                            (a.returnValue = !1)),
                        "pan" === this.state && this.options.panEnabled)
                ) {
                    var b = g
                        .getEventPoint(a, this.svg)
                        .matrixTransform(this.firstEventCTM.inverse()),
                        c = this.firstEventCTM.translate(
                            b.x - this.stateOrigin.x,
                            b.y - this.stateOrigin.y
                        );
                    this.viewport.setCTM(c);
                }
            }),
            (i.prototype.handleMouseUp = function(a) {
                this.options.preventMouseEventsDefault &&
                    (a.preventDefault ?
                        a.preventDefault() :
                        (a.returnValue = !1)),
                    "pan" === this.state && (this.state = "none");
            }),
            (i.prototype.fit = function() {
                var a = this.viewport.getViewBox(),
                    b = Math.min(this.width / a.width, this.height / a.height);
                this.zoom(b, !0);
            }),
            (i.prototype.contain = function() {
                var a = this.viewport.getViewBox(),
                    b = Math.max(this.width / a.width, this.height / a.height);
                this.zoom(b, !0);
            }),
            (i.prototype.center = function() {
                var a = this.viewport.getViewBox(),
                    b =
                    0.5 * (this.width - (a.width + 2 * a.x) * this.getZoom()),
                    c =
                    0.5 *
                    (this.height - (a.height + 2 * a.y) * this.getZoom());
                this.getPublicInstance().pan({
                    x: b,
                    y: c,
                });
            }),
            (i.prototype.updateBBox = function() {
                this.viewport.recacheViewBox();
            }),
            (i.prototype.pan = function(a) {
                var b = this.viewport.getCTM();
                (b.e = a.x), (b.f = a.y), this.viewport.setCTM(b);
            }),
            (i.prototype.panBy = function(a) {
                var b = this.viewport.getCTM();
                (b.e += a.x), (b.f += a.y), this.viewport.setCTM(b);
            }),
            (i.prototype.getPan = function() {
                var a = this.viewport.getState();
                return {
                    x: a.x,
                    y: a.y,
                };
            }),
            (i.prototype.resize = function() {
                var a = g.getBoundingClientRectNormalized(this.svg);
                (this.width = a.width),
                (this.height = a.height),
                this.options.controlIconsEnabled &&
                    (this.getPublicInstance().disableControlIcons(),
                        this.getPublicInstance().enableControlIcons());
            }),
            (i.prototype.destroy = function() {
                var a = this;
                (this.beforeZoom = null),
                (this.onZoom = null),
                (this.beforePan = null),
                (this.onPan = null),
                null != this.options.customEventsHandler &&
                    this.options.customEventsHandler.destroy({
                        svgElement: this.svg,
                        eventsListenerElement: this.options
                            .eventsListenerElement,
                        instance: this.getPublicInstance(),
                    });
                for (var b in this.eventListeners)
                    (
                        this.options.eventsListenerElement || this.svg
                    ).removeEventListener(b, this.eventListeners[b], !1);
                this.disableMouseWheelZoom(),
                    this.getPublicInstance().disableControlIcons(),
                    this.reset(),
                    (k = k.filter(function(b) {
                        return b.svg !== a.svg;
                    })),
                    delete this.options,
                    delete this.publicInstance,
                    delete this.pi,
                    (this.getPublicInstance = function() {
                        return null;
                    });
            }),
            (i.prototype.getPublicInstance = function() {
                var a = this;
                return (
                    this.publicInstance ||
                    (this.publicInstance = this.pi = {
                        enablePan: function() {
                            return (a.options.panEnabled = !0), a.pi;
                        },
                        disablePan: function() {
                            return (a.options.panEnabled = !1), a.pi;
                        },
                        isPanEnabled: function() {
                            return !!a.options.panEnabled;
                        },
                        pan: function(b) {
                            return a.pan(b), a.pi;
                        },
                        panBy: function(b) {
                            return a.panBy(b), a.pi;
                        },
                        getPan: function() {
                            return a.getPan();
                        },
                        setBeforePan: function(b) {
                            return (
                                (a.options.beforePan =
                                    null === b ? null : f.proxy(b, a.publicInstance)),
                                a.pi
                            );
                        },
                        setOnPan: function(b) {
                            return (
                                (a.options.onPan =
                                    null === b ? null : f.proxy(b, a.publicInstance)),
                                a.pi
                            );
                        },
                        enableZoom: function() {
                            return (a.options.zoomEnabled = !0), a.pi;
                        },
                        disableZoom: function() {
                            return (a.options.zoomEnabled = !1), a.pi;
                        },
                        isZoomEnabled: function() {
                            return !!a.options.zoomEnabled;
                        },
                        enableControlIcons: function() {
                            return (
                                a.options.controlIconsEnabled ||
                                ((a.options.controlIconsEnabled = !0),
                                    e.enable(a)),
                                a.pi
                            );
                        },
                        disableControlIcons: function() {
                            return (
                                a.options.controlIconsEnabled &&
                                ((a.options.controlIconsEnabled = !1),
                                    e.disable(a)),
                                a.pi
                            );
                        },
                        isControlIconsEnabled: function() {
                            return !!a.options.controlIconsEnabled;
                        },
                        enableDblClickZoom: function() {
                            return (a.options.dblClickZoomEnabled = !0), a.pi;
                        },
                        disableDblClickZoom: function() {
                            return (a.options.dblClickZoomEnabled = !1), a.pi;
                        },
                        isDblClickZoomEnabled: function() {
                            return !!a.options.dblClickZoomEnabled;
                        },
                        enableMouseWheelZoom: function() {
                            return a.enableMouseWheelZoom(), a.pi;
                        },
                        disableMouseWheelZoom: function() {
                            return a.disableMouseWheelZoom(), a.pi;
                        },
                        isMouseWheelZoomEnabled: function() {
                            return !!a.options.mouseWheelZoomEnabled;
                        },
                        setZoomScaleSensitivity: function(b) {
                            return (a.options.zoomScaleSensitivity = b), a.pi;
                        },
                        setMinZoom: function(b) {
                            return (a.options.minZoom = b), a.pi;
                        },
                        setMaxZoom: function(b) {
                            return (a.options.maxZoom = b), a.pi;
                        },
                        setBeforeZoom: function(b) {
                            return (
                                (a.options.beforeZoom =
                                    null === b ? null : f.proxy(b, a.publicInstance)),
                                a.pi
                            );
                        },
                        setOnZoom: function(b) {
                            return (
                                (a.options.onZoom =
                                    null === b ? null : f.proxy(b, a.publicInstance)),
                                a.pi
                            );
                        },
                        zoom: function(b) {
                            return a.publicZoom(b, !0), a.pi;
                        },
                        zoomBy: function(b) {
                            return a.publicZoom(b, !1), a.pi;
                        },
                        zoomAtPoint: function(b, c) {
                            return a.publicZoomAtPoint(b, c, !0), a.pi;
                        },
                        zoomAtPointBy: function(b, c) {
                            return a.publicZoomAtPoint(b, c, !1), a.pi;
                        },
                        zoomIn: function() {
                            return (
                                this.zoomBy(1 + a.options.zoomScaleSensitivity),
                                a.pi
                            );
                        },
                        zoomOut: function() {
                            return (
                                this.zoomBy(
                                    1 / (1 + a.options.zoomScaleSensitivity)
                                ),
                                a.pi
                            );
                        },
                        getZoom: function() {
                            return a.getRelativeZoom();
                        },
                        resetZoom: function() {
                            return a.resetZoom(), a.pi;
                        },
                        resetPan: function() {
                            return a.resetPan(), a.pi;
                        },
                        reset: function() {
                            return a.reset(), a.pi;
                        },
                        fit: function() {
                            return a.fit(), a.pi;
                        },
                        contain: function() {
                            return a.contain(), a.pi;
                        },
                        center: function() {
                            return a.center(), a.pi;
                        },
                        updateBBox: function() {
                            return a.updateBBox(), a.pi;
                        },
                        resize: function() {
                            return a.resize(), a.pi;
                        },
                        getSizes: function() {
                            return {
                                width: a.width,
                                height: a.height,
                                realZoom: a.getZoom(),
                                viewBox: a.viewport.getViewBox(),
                            };
                        },
                        destroy: function() {
                            return a.destroy(), a.pi;
                        },
                    }),
                    this.publicInstance
                );
            });
            var k = [],
                l = function(a, b) {
                    var c = f.getSvg(a);
                    if (null === c) return null;
                    for (var d = k.length - 1; d >= 0; d--)
                        if (k[d].svg === c)
                            return k[d].instance.getPublicInstance();
                    return (
                        k.push({
                            svg: c,
                            instance: new i(c, b),
                        }),
                        k[k.length - 1].instance.getPublicInstance()
                    );
                };
            b.exports = l;
        }, {
            "./control-icons": 2,
            "./shadow-viewport": 3,
            "./svg-utilities": 5,
            "./uniwheel": 6,
            "./utilities": 7,
        },
    ],
    5: [
        function(a, b, c) {
            var d = a("./utilities"),
                e = "unknown";
            document.documentMode && (e = "ie"),
                (b.exports = {
                    svgNS: "http://www.w3.org/2000/svg",
                    xmlNS: "http://www.w3.org/XML/1998/namespace",
                    xmlnsNS: "http://www.w3.org/2000/xmlns/",
                    xlinkNS: "http://www.w3.org/1999/xlink",
                    evNS: "http://www.w3.org/2001/xml-events",
                    getBoundingClientRectNormalized: function(a) {
                        if (a.clientWidth && a.clientHeight)
                            return {
                                width: a.clientWidth,
                                height: a.clientHeight,
                            };
                        if (a.getBoundingClientRect())
                            return a.getBoundingClientRect();
                        throw new Error("Cannot get BoundingClientRect for SVG.");
                    },
                    getOrCreateViewport: function(a, b) {
                        var c = null;
                        if (((c = d.isElement(b) ? b : a.querySelector(b)), !c)) {
                            var e = Array.prototype.slice
                                .call(a.childNodes || a.children)
                                .filter(function(a) {
                                    return (
                                        "defs" !== a.nodeName && "#text" !== a.nodeName
                                    );
                                });
                            1 === e.length &&
                                "g" === e[0].nodeName &&
                                null === e[0].getAttribute("transform") &&
                                (c = e[0]);
                        }
                        if (!c) {
                            var f =
                                "viewport-" +
                                new Date().toISOString().replace(/\D/g, "");
                            (c = document.createElementNS(this.svgNS, "g")),
                            c.setAttribute("id", f);
                            var g = a.childNodes || a.children;
                            if (g && g.length > 0)
                                for (var h = g.length; h > 0; h--)
                                    "defs" !== g[g.length - h].nodeName &&
                                    c.appendChild(g[g.length - h]);
                            a.appendChild(c);
                        }
                        var i = [];
                        return (
                            c.getAttribute("class") &&
                            (i = c.getAttribute("class").split(" ")), ~i.indexOf("svg-pan-zoom_viewport") ||
                            (i.push("svg-pan-zoom_viewport"),
                                c.setAttribute("class", i.join(" "))),
                            c
                        );
                    },
                    setupSvgAttributes: function(a) {
                        if (
                            (a.setAttribute("xmlns", this.svgNS),
                                a.setAttributeNS(
                                    this.xmlnsNS,
                                    "xmlns:xlink",
                                    this.xlinkNS
                                ),
                                a.setAttributeNS(this.xmlnsNS, "xmlns:ev", this.evNS),
                                null !== a.parentNode)
                        ) {
                            var b = a.getAttribute("style") || "";
                            b.toLowerCase().indexOf("overflow") === -1 &&
                                a.setAttribute("style", "overflow: hidden; " + b);
                        }
                    },
                    internetExplorerRedisplayInterval: 300,
                    refreshDefsGlobal: d.throttle(function() {
                        for (
                            var a = document.querySelectorAll("defs"),
                                b = a.length,
                                c = 0; c < b; c++
                        ) {
                            var d = a[c];
                            d.parentNode.insertBefore(d, d);
                        }
                    }, this.internetExplorerRedisplayInterval),
                    setCTM: function(a, b, c) {
                        var d = this,
                            f =
                            "matrix(" +
                            b.a +
                            "," +
                            b.b +
                            "," +
                            b.c +
                            "," +
                            b.d +
                            "," +
                            b.e +
                            "," +
                            b.f +
                            ")";
                        a.setAttributeNS(null, "transform", f),
                            "ie" === e &&
                            c &&
                            (c.parentNode.insertBefore(c, c),
                                window.setTimeout(function() {
                                    d.refreshDefsGlobal();
                                }, d.internetExplorerRedisplayInterval));
                    },
                    getEventPoint: function(a, b) {
                        var c = b.createSVGPoint();
                        return (
                            d.mouseAndTouchNormalize(a, b),
                            (c.x = a.clientX),
                            (c.y = a.clientY),
                            c
                        );
                    },
                    getSvgCenterPoint: function(a, b, c) {
                        return this.createSVGPoint(a, b / 2, c / 2);
                    },
                    createSVGPoint: function(a, b, c) {
                        var d = a.createSVGPoint();
                        return (d.x = b), (d.y = c), d;
                    },
                });
        }, {
            "./utilities": 7,
        },
    ],
    6: [
        function(a, b, c) {
            b.exports = (function() {
                function g(a, b, c) {
                    var d = function(a) {
                        !a && (a = window.event);
                        var c = {
                            originalEvent: a,
                            target: a.target || a.srcElement,
                            type: "wheel",
                            deltaMode: "MozMousePixelScroll" == a.type ? 0 : 1,
                            deltaX: 0,
                            delatZ: 0,
                            preventDefault: function() {
                                a.preventDefault ?
                                    a.preventDefault() :
                                    (a.returnValue = !1);
                            },
                        };
                        return (
                            "mousewheel" == e ?
                            ((c.deltaY = -0.025 * a.wheelDelta),
                                a.wheelDeltaX && (c.deltaX = -0.025 * a.wheelDeltaX)) :
                            (c.deltaY = a.detail),
                            b(c)
                        );
                    };
                    return (
                        f.push({
                            element: a,
                            fn: d,
                            capture: c,
                        }),
                        d
                    );
                }

                function h(a, b) {
                    for (var c = 0; c < f.length; c++)
                        if (f[c].element === a && f[c].capture === b)
                            return f[c].fn;
                    return function() {};
                }

                function i(a, b) {
                    for (var c = 0; c < f.length; c++)
                        if (f[c].element === a && f[c].capture === b)
                            return f.splice(c, 1);
                }

                function j(c, d, f, h) {
                    var i;
                    (i = "wheel" === e ? f : g(c, f, h)), c[b](a + d, i, h || !1);
                }

                function k(b, d, f, g) {
                    "wheel" === e ? (cb = f) : (cb = h(b, g)),
                        b[c](a + d, cb, g || !1),
                        i(b, g);
                }

                function l(a, b, c) {
                    j(a, e, b, c),
                        "DOMMouseScroll" == e && j(a, "MozMousePixelScroll", b, c);
                }

                function m(a, b, c) {
                    k(a, e, b, c),
                        "DOMMouseScroll" == e && k(a, "MozMousePixelScroll", b, c);
                }
                var b,
                    c,
                    e,
                    a = "",
                    f = [];
                return (
                    window.addEventListener ?
                    ((b = "addEventListener"), (c = "removeEventListener")) :
                    ((b = "attachEvent"), (c = "detachEvent"), (a = "on")),
                    (e =
                        "onwheel" in document.createElement("div") ?
                        "wheel" :
                        void 0 !== document.onmousewheel ?
                        "mousewheel" :
                        "DOMMouseScroll"), {
                        on: l,
                        off: m,
                    }
                );
            })();
        }, {},
    ],
    7: [
        function(a, b, c) {
            function d(a) {
                return function(b) {
                    window.setTimeout(b, a);
                };
            }
            b.exports = {
                extend: function(a, b) {
                    a = a || {};
                    for (var c in b)
                        this.isObject(b[c]) ?
                        (a[c] = this.extend(a[c], b[c])) :
                        (a[c] = b[c]);
                    return a;
                },
                isElement: function(a) {
                    return (
                        a instanceof HTMLElement ||
                        a instanceof SVGElement ||
                        a instanceof SVGSVGElement ||
                        (a &&
                            "object" == typeof a &&
                            null !== a &&
                            1 === a.nodeType &&
                            "string" == typeof a.nodeName)
                    );
                },
                isObject: function(a) {
                    return (
                        "[object Object]" === Object.prototype.toString.call(a)
                    );
                },
                isNumber: function(a) {
                    return !isNaN(parseFloat(a)) && isFinite(a);
                },
                getSvg: function(a) {
                    var b, c;
                    if (this.isElement(a)) b = a;
                    else {
                        if (!("string" == typeof a || a instanceof String))
                            throw new Error(
                                "Provided selector is not an HTML object nor String"
                            );
                        if (((b = document.querySelector(a)), !b))
                            throw new Error(
                                "Provided selector did not find any elements. Selector: " +
                                a
                            );
                    }
                    if ("svg" === b.tagName.toLowerCase()) c = b;
                    else if ("object" === b.tagName.toLowerCase())
                        c = b.contentDocument.documentElement;
                    else {
                        if ("embed" !== b.tagName.toLowerCase())
                            throw "img" === b.tagName.toLowerCase() ?
                                new Error(
                                    'Cannot script an SVG in an "img" element. Please use an "object" element or an in-line SVG.'
                                ) :
                                new Error("Cannot get SVG.");
                        c = b.getSVGDocument().documentElement;
                    }
                    return c;
                },
                proxy: function(a, b) {
                    return function() {
                        return a.apply(b, arguments);
                    };
                },
                getType: function(a) {
                    return Object.prototype.toString
                        .apply(a)
                        .replace(/^\[object\s/, "")
                        .replace(/\]$/, "");
                },
                mouseAndTouchNormalize: function(a, b) {
                    if (void 0 === a.clientX || null === a.clientX)
                        if (
                            ((a.clientX = 0),
                                (a.clientY = 0),
                                void 0 !== a.changedTouches && a.changedTouches.length)
                        ) {
                            if (void 0 !== a.changedTouches[0].clientX)
                                (a.clientX = a.changedTouches[0].clientX),
                                (a.clientY = a.changedTouches[0].clientY);
                            else if (void 0 !== a.changedTouches[0].pageX) {
                                var c = b.getBoundingClientRect();
                                (a.clientX = a.changedTouches[0].pageX - c.left),
                                (a.clientY = a.changedTouches[0].pageY - c.top);
                            }
                        } else
                            void 0 !== a.originalEvent &&
                            void 0 !== a.originalEvent.clientX &&
                            ((a.clientX = a.originalEvent.clientX),
                                (a.clientY = a.originalEvent.clientY));
                },
                isDblClick: function(a, b) {
                    if (2 === a.detail) return !0;
                    if (void 0 !== b && null !== b) {
                        var c = a.timeStamp - b.timeStamp,
                            d = Math.sqrt(
                                Math.pow(a.clientX - b.clientX, 2) +
                                Math.pow(a.clientY - b.clientY, 2)
                            );
                        return c < 250 && d < 10;
                    }
                    return !1;
                },
                now: Date.now ||
                    function() {
                        return new Date().getTime();
                    },
                throttle: function(a, b, c) {
                    var e,
                        f,
                        g,
                        d = this,
                        h = null,
                        i = 0;
                    c || (c = {});
                    var j = function() {
                        (i = c.leading === !1 ? 0 : d.now()),
                        (h = null),
                        (g = a.apply(e, f)),
                        h || (e = f = null);
                    };
                    return function() {
                        var k = d.now();
                        i || c.leading !== !1 || (i = k);
                        var l = b - (k - i);
                        return (
                            (e = this),
                            (f = arguments),
                            l <= 0 || l > b ?
                            (clearTimeout(h),
                                (h = null),
                                (i = k),
                                (g = a.apply(e, f)),
                                h || (e = f = null)) :
                            h || c.trailing === !1 || (h = setTimeout(j, l)),
                            g
                        );
                    };
                },
                createRequestAnimationFrame: function(a) {
                    var b = null;
                    return (
                        "auto" !== a &&
                        a < 60 &&
                        a > 1 &&
                        (b = Math.floor(1e3 / a)),
                        null === b ? window.requestAnimationFrame || d(33) : d(b)
                    );
                },
            };
        }, {},
    ],
}, {}, [1]);

(function($) {
    "use strict";

    var _defaults = {
        hammerEnabled: false,
        element: null,
        hammerHaltEventListeners: [
            "touchstart",
            "touchend",
            "touchmove",
            "touchleave",
            "touchcancel",
        ],

        callbacks: [],
    };

    var _svg = null;

    var _hammer = null;

    function Plugin(defaults) {
        this.options = $.extend(_defaults, defaults);

        this.install();
    }

    Plugin.prototype = {
        install: function() {
            var that = this;

            if (this.options.hammerEnabled) {
                _hammer = Hammer(that.options.element);
            }

            var halt = that.options.hammerEnabled ?
                that.options.hammerHaltEventListeners : [];

            _svg = svgPanZoom(that.options.element, {
                zoomEnabled: true,
                controlIconsEnabled: true,
                fit: true,
                center: true,
                minZoom: 0.01,
                maxZoom: 5,
                zoomScaleSensitivity: 1,
                dblClickZoomEnabled: false,
                customEventsHandler: {
                    haltEventListeners: halt,
                    init: function(options) {
                        // @todo set axis alligned boundingbox

                        $(window).resize(function() {
                            _svg.resize();
                            _svg.fit();
                            _svg.center();
                        });

                        installEventCallbacks(
                            that.options.element,
                            that.options.callbacks
                        );
                    },
                    destroy: function(options) {
                        if (hammer !== undefined) {
                            hammer.destroy();
                        }
                    },
                },
            });

            if (_hammer !== undefined && _hammer != null) {
                installHammer(_hammer, _svg);
            }
        },
    };

    function installEventCallbacks(parent, callbacks) {
        if (callbacks !== undefined && callbacks != null) {
            if (callbacks.length > 0) {
                var viewport = $(parent).children()[0];
                if (
                    viewport !== undefined &&
                    viewport != null &&
                    (viewport.tagName == "g" || viewport.nodeName == "g")
                ) {
                    var elements = viewport.getElementsByTagName("*");
                    for (var i = 0; i < elements.length; i++) {
                        var $elem = $(elements);

                        for (var j = 0; j < callbacks.length; j++) {
                            var callback = callbacks[j];
                            if (callback !== undefined && callback != null) {
                                var name =
                                    callback.name !== undefined ? callback.name : null;
                                var fn =
                                    callback.fn !== undefined &&
                                    typeof callback.fn === "function" ?
                                    callback.fn :
                                    null;

                                if (name != null && fn != null) {
                                    var key = "svg-fn[" + name + "]";
                                    if ($elem.data(key) === undefined) {
                                        $elem.data(key, name).on(name, fn);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function installHammer(hammer, svg) {
        if (Hammer !== undefined) {
            var initialScale = 1,
                pannedX = 0,
                pannedY = 0;

            hammer.inputClass = Hammer.SUPPORT_POINTER_EVENTS ?
                Hammer.PointerEventInput :
                Hammer.TouchInput;

            hammer
                .on("panstart panmove", function(e) {
                    // reset panned variables on panstart
                    if (e.type === "panstart") {
                        pannedX = 0;
                        pannedY = 0;
                    }
                    // only pan the difference
                    svg.panBy({
                        x: e.deltaX - pannedX,
                        y: e.deltaY - pannedY,
                    });

                    pannedX = e.deltaX;
                    pannedY = e.deltaY;
                })
                .on("pinchstart pinchmove", function(e) {
                    if (e.type === "pinchstart") {
                        initialScale = svg.getZoom();
                        svg.zoom(initialScale * e.scale);
                    }
                    svg.zoom(initialScale * e.scale);
                })
                .get("pinch")
                .set({
                    enable: true,
                });
        }
    }

    $.fn.svgPanZoom = function(defaults) {
        var $this = $(this);

        if (
            $this.data("svgpan") == null ||
            $this.data("svgpan") === undefined
        ) {
            var elem = $this[0];
            if (
                (elem !== null || elem !== undefined) &&
                (elem.tagName == "svg" || elem.nodeName == "svg")
            ) {
                defaults.element = elem;

                $this.data("svgpan", new Plugin(defaults));
            }
        }

        return $this.data("svgpan");
    };
})(jQuery);

var c = 0;

var colours = ["limegreen", "red", "orange", "black", "#5f6973"];

$(document.getElementById("svg")).svgPanZoom({
    hammerEnabled: true,
    callbacks: [{
        name: "click",
        fn: function(e) {
            var $this = $(this);
        },
    }, {
        name: "contextmenu",
        fn: function(e) {
            e.preventDefault();
        },
    }, ],
});