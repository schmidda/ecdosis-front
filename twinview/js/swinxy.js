/* jquery.swinxytouch.min.js */
(function(c) {
    function f(a, f) {
        var e;
        return !(e = c.data(a, d)) ? c.data(a, d, new b(a, f)) : e
    }

    function b(d, f) {
        function b(a, d) {
            c(document).on("touchstart", t);
            m.hasFocus = !0;
            l = "sxy-focus";
            a && a(d);
            l = "sxy-hover"
        }

        function e() {
            c(document).off("touchstart", t);
            m.hasFocus = !1;
            l = "sxy-blur";
            m.el.triggerHandler(l);
            l = "sxy-hover"
        }

        function h(a) {
            q = a;
            n.x = a.pageX;
            n.y = a.pageY;
            m.pt = [n];
            m.trigger(l)
        }

        function p(a) {
            q = a;
            a = a.originalEvent.targetTouches;
            for (var d = m.pt = [], c = 0, b = a.length; c < b; ++c) d.push({
                x: a[c].pageX,
                y: a[c].pageY,
                type: 1,
                down: !0
            });
            m.trigger(l)
        }

        function j(a, c, d, b) {
            u.push(a = {
                e: a,
                hnd: d,
                l: 0,
                el: b || m.el
            });
            d = 0;
            for (b = c.length; d < b; ++d) r[k[c[d]]].push(a)
        }
        var m = this,
            l = "sxy-hover",
            n = {
                x: 0,
                y: 0,
                down: !1,
                type: 0
            },
            u = [],
            r = {},
            q;
        this.options = f = c.extend({}, a, f);
        this.el = c(d);
        this.pt = [];
        this.g = {};
        this.h = {};
        this.hasFocus = !1;
        for (var s = 0; s < k.length; ++s) r[k[s]] = [];
        g || (j("mouseenter", [0, 2, 4], function(a) {
            m.hasFocus || b(h, a);
            l = "sxy-hover";
            h(a)
        }), j("mouseleave", [1, 2, 5], function(a) {
            n.down ? l = "sxy-up" : l = "sxy-hover";
            n.down = !1;
            h(a);
            e(h, a)
        }), j("mousedown", [3, 4], function(a) {
            l = "sxy-down";
            n.down = !0;
            h(a);
            l = "sxy-move"
        }), j("mouseup", [0, 1, 2, 3, 4, 5], function(a) {
            l = "sxy-up";
            n.down = !1;
            h(a);
            l = "sxy-hover"
        }), j("mousemove", [2, 4], h));
        j("touchstart", [0, 1, 2, 3, 4, 5], function(a) {
            l = "sxy-down";
            m.hasFocus || b(p, a);
            p(a);
            l = "sxy-move"
        });
        j("touchend", [0, 1, 2, 3, 4, 5], function(a) {
            l = "sxy-up";
            q = a;
            var d = a.originalEvent.targetTouches;
            a = a.originalEvent.changedTouches;
            for (var c = m.pt = [], b = 0, f = d.length; b < f; ++b) c.push({
                x: d[b].pageX,
                y: d[b].pageY,
                type: 1,
                down: !0
            });
            b = 0;
            for (f = a.length; b < f; ++b) c.push({
                x: a[b].pageX,
                y: a[b].pageY,
                type: 1,
                down: !1
            });
            m.trigger(l);
            l = "sxy-hover"
        });
        j("touchmove", [0, 1, 2, 3, 4, 5], p);
        var t = function(a) {
                for (var b = !0, d = m.pt, c = 0, f = d.length; c < f; ++c)
                    if (!0 == d[c].down) {
                        b = !1;
                        break
                    }
                b && e(p, a)
            },
            v = c.Event;
        this.trigger = function(a, b) {
            this.options.preventDefault && q.preventDefault();
            b = b || {};
            b.pointers = m.pt;
            b.originalEvent = q;
            m.el.trigger(v(a, b))
        };
        this.eventEnabler = function(a, b) {
            for (var d, c = r[a], f = b ? 1 : -1, e = 0, h = c.length; e < h; ++e) switch ((d = c[e]).l += f) {
                case 0:
                    d.el.off(d.e, d.hnd);
                    break;
                case 1:
                    d.el.on(d.e, d.hnd)
            }
        };
        m.focus = b;
        m.blur = e
    }
    for (var e = navigator.userAgent.toLowerCase(), g = -1 < e.indexOf("android") && -1 < e.indexOf("mobile"), d = "swinxytouch", a = {
            preventDefault: !0,
            stopPropagation: !1
        }, k = "sxy-focus sxy-blur sxy-hover sxy-down sxy-move sxy-up".split(" "), e = function(a) {
            return function() {
                f(this).eventEnabler(a, !0)
            }
        }, h = function(a) {
            return function() {
                f(this).eventEnabler(a, !1)
            }
        }, j = 0, p = k.length; j < p; ++j) {
        var n = k[j];
        c.event.special[n] = {
            setup: e(n),
            teardown: h(n)
        }
    }
    c.fn[d] = function(a) {
        return this.each(function() {
            var b = f(this);
            a && b[a] && b[a].apply(b, Array.prototype.slice.call(arguments, 1))
        })
    };
    c.fn[d].g = function(a, b, d) {
        c.event.special[a] = {
            setup: function() {
                var e = f(this),
                    h;
                h = e.g[a] = new b(e, e.options[a] ? c.extend({}, d, e.options[a]) : d);
                c.each(h, function(a) {
                    if ("sxy-" == a.substr(0, 4)) e.el.on(a, h[a])
                })
            },
            teardown: function() {
                var b = f(this),
                    d = b.g[a];
                c.each(d, function(a) {
                    "sxy-" == a.substr(0, 4) && b.el.off(a, d[a])
                });
                b.g[a] = null
            }
        }
    };
    c.fn[d].d = function(a, b) {
        var d = a.x - b.x,
            c = a.y - b.y;
        return Math.sqrt(d * d + c * c)
    };
    c.fn[d].a = function(a, b) {
        var d;
        return 0 <
            (d = Math.atan2(a.y - b.y, a.x - b.x)) ? d * (180 / Math.PI) : (2 * Math.PI + d) * (180 / Math.PI)
    };
    c.fn[d].h = function(a, d) {
        b.prototype[a] = function() {
            this.h[a] = new d(this)
        }
    };
    c.fn[d].m = function(a, b) {
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    }
})(jQuery);
(function(c) {
    c.fn.swinxytouch.h("smartclick", function(f) {
        var b = this;
        b.allow = !1;
        b._hndClick = function(c) {
            b.allow || c.preventDefault();
            b.allow = !1
        };
        b._hndTap = function(f) {
            b.allow = !0;
            c(f.originalEvent.target).trigger("click")
        };
        f.el.on("click", b._hndClick);
        f.el.on("sxy-tap", b._hndTap)
    })
})(jQuery);
(function(c) {
    c.fn.swinxytouch.h("bound", function(f) {
        var b = f.el.offset(),
            e = b.left,
            g = b.top,
            d = e + f.el.width(),
            a = g + f.el.height();
        f.el.on("sxy-hover sxy-down sxy-up sxy-move sxy-focus", function(b) {
            var h = b.pointers[0];
            h.y < g || h.x > d || h.y > a || h.x < e ? f.hasFocus && f.blur() : f.hasFocus || (f.focus(), f.el.trigger(c.Event("sxy-focus", {
                pointers: b.pointers,
                originalEvent: b.originalEvent
            })))
        })
    })
})(jQuery);
(function(c) {
    c.fn.swinxytouch.g("sxy-tap", function(c, b) {
        var e = Math.abs,
            g, d;
        this["sxy-down"] = function(a) {
            a = a.pointers;
            1 == a.length && (g = (new Date).getTime(), d = {
                x: a[0].x,
                y: a[0].y
            })
        };
        this["sxy-up"] = function(a) {
            a = a.pointers;
            1 == a.length && ((new Date).getTime() - g < b.maxDelay && e(d.x - a[0].x) < b.maxMove && e(d.y - a[0].y) < b.maxMove) && c.trigger("sxy-tap", {
                position: d
            })
        }
    }, {
        maxDelay: 150,
        maxMove: 2
    })
})(jQuery);
(function(c) {
    c.fn.swinxytouch.g("sxy-swipe", function(f, b) {
        var e = c.fn.swinxytouch.d,
            g = c.fn.swinxytouch.a,
            d = {},
            a, k;
        this["sxy-down"] = function(b) {
            b = b.pointers;
            a = (new Date).getTime();
            k = {
                x: b[0].x,
                y: b[0].y
            }
        };
        this["sxy-up"] = function(c) {
            c = c.pointers;
            (new Date).getTime() - a < b.maxTime && e(k, c[0]) > b.minMove && (d.direction = b.map[Math.round(g(k, c[0]) / (360 / b.map.length)) % b.map.length], d.distance = Math.abs(e(k, c[0])), f.trigger("sxy-swipe", d))
        }
    }, {
        maxTime: 300,
        minMove: 10,
        map: ["left", "up", "right", "down"]
    })
})(jQuery);
(function(c) {
    var f = "sxy-scale";
    c.fn.swinxytouch.g(f, function(b, e) {
        function g(c, e) {
            var g = c.pointers,
                k = d(g[0], g[1]);
            j.state = e;
            j.scale = k / h;
            j.distance = k - h;
            j.position = a(g[0], g[1]);
            b.trigger(f, j)
        }
        var d = c.fn.swinxytouch.d,
            a = c.fn.swinxytouch.m,
            k, h, j = {};
        this["sxy-down"] = function(a) {
            a = a.pointers;
            2 == a.length && (k = !1, h = d({
                x: a[0].x,
                y: a[0].y
            }, {
                x: a[1].x,
                y: a[1].y
            }))
        };
        this["sxy-up"] = function(a) {
            k && g(a, 3)
        };
        this["sxy-move"] = function(a) {
            var b = a.pointers;
            2 == b.length && (k ? g(a, 2) : Math.abs(1 - d(b[0], b[1]) / h) > e.minScale && (k = !0, g(a, 1)))
        }
    }, {
        minScale: 0.2
    })
})(jQuery);
(function(c) {
    var f = "sxy-rotate";
    c.fn.swinxytouch.g(f, function(b, e) {
        function g(d, c) {
            var e, g;
            j.state = c;
            j.rotation += 180 > Math.abs(e = (g = a(d.pointers[0], d.pointers[1])) - h) ? e : 0;
            h = g;
            b.trigger(f, j)
        }
        var d, a = c.fn.swinxytouch.a,
            k, h, j = {};
        this["sxy-down"] = function(b) {
            2 == b.pointers.length && (d = !1, k = h = a(b.pointers[0], b.pointers[1]))
        };
        this["sxy-up"] = function(a) {
            d && (d = !1, g(a, 3))
        };
        this["sxy-move"] = function(b) {
            var c = b.pointers;
            2 == c.length && (d ? g(b, 2) : Math.abs(k - a(c[0], c[1])) > e.minRotate && (d = !0, j.rotation = 0, g(b, 1)))
        }
    }, {
        minRotate: 3
    })
})(jQuery);
(function(c) {
    c.fn.swinxytouch.g("sxy-longpress", function(c, b) {
        var e, g = {},
            d = function() {
                var a = c.pt,
                    d = Math.abs;
                e = null;
                d(g.x - a[0].x) < b.maxMove && d(g.y - a[0].y) < b.maxMove && c.trigger("sxy-longpress", {
                    position: g
                })
            };
        this["sxy-down"] = function(a) {
            a = a.pointers;
            g = {
                x: a[0].x,
                y: a[0].y
            };
            e && clearTimeout(e);
            e = setTimeout(d, b.minDelay)
        };
        this["sxy-up"] = function() {
            clearTimeout(e)
        }
    }, {
        minDelay: 1E3,
        maxMove: 5
    })
})(jQuery);
(function(c) {
    var f = "sxy-drag";
    c.fn.swinxytouch.g(f, function(b) {
        function c(a, e) {
            var g = a.pointers;
            d.state = e;
            0 < g.length && (d.position.x = g[0].x, d.position.y = g[0].y);
            b.trigger(f, d)
        }
        var g, d = {
            position: {}
        };
        this["sxy-up"] = function(a) {
            g && c(a, 3);
            g = !1
        };
        this["sxy-move"] = function(a) {
            1 == a.pointers.length && (g ? c(a, 2) : (g = !0, c(a, 1)))
        }
    })
})(jQuery);
(function(c) {
    c.fn.swinxytouch.g("sxy-doubletap", function(c, b) {
        var e = Math.abs,
            g, d;
        this["sxy-tap"] = function(a) {
            a = a.position;
            null != g && (new Date).getTime() - g < b.maxDelay && e(d.x - a.x) < b.maxMove && e(d.y - a.y) < b.maxMove ? (c.trigger("sxy-doubletap", {
                position: d
            }), g = null) : (g = (new Date).getTime(), d = {
                x: a.x,
                y: a.y
            })
        }
    }, {
        maxDelay: 300,
        maxMove: 4
    })
})(jQuery);

/* jquery.swinxyzoom.min.js */
(function(f, c) {
    function h(a, g) {
        this.e = a.get(0);
        this.j = a.first();
        g != c && f.extend(this, g)
    }

    function e(a, c) {
        var b = this;
        b.element = f(a);
        b.options = f.extend({}, k, c);
        b.driver = new f.fn.swinxyzoom.modes[b.options.mode](this);
        b.initialised = !1;
        b.enabled = !1;
        b.waiting = null;
        b.element.css({
            cursor: "default"
        });
        b.dmp = {
            cX: 0,
            tX: 0,
            cY: 0,
            tY: 0,
            timer: !1
        };
        b.last = !1;
        b.hasFocus = !1;
        b._animate = function() {
            var a = b.dmp,
                d = b.si.e.style,
                c = b.options.damping,
                g = a.tX - a.cX,
                e = a.tY - a.cY;
            d.left = (a.cX += g / c) + "px";
            d.top = (a.cY += e / c) + "px";
            0 == ~~g &&
                0 == ~~e && (clearTimeout(a.timer), a.timer = !1)
        };
        b._moveSlider = function(a) {
            a = a.pointers[0].y;
            var d = b.ct.sl.j.offset(),
                c = b.maxZoom / b.ct.sl.j.height();
            a = b.ct.sl.j.height() - (a - d.top);
            b.zoom(a * c, b.cursor.lastX, b.cursor.lastY)
        };
        b._focus = function() {
            var a = b.dp.j.offset();
            b.dp.ol = a.left;
            b.dp.ot = a.top;
            b.hasFocus = !0;
            b.options.controls && (b.ct.j.show(), b.ct.ol.j.stop().animate({
                opacity: 0.5
            }, {
                queue: !1
            }), b.ct.j.show());
            if (!1 !== b.last && (b.last.w != b.rt.j.width() || b.last.h != b.rt.j.height())) b.rebuild(), b.zoom(b.maxZoom,
                b.cursor.lastX, b.cursor.lastY), b.driver.load && b.driver.load(b.cursor.lastX, b.cursor.lastY), b.zoom(b.maxZoom, b.cursor.lastX, b.cursor.lastY);
            b.last = {
                w: b.rt.j.width(),
                h: b.rt.j.height()
            }
        };
        b._blur = function() {
            b.hasFocus = !1;
            b.options.controls && (b.ct.j.hide(), b.ct.ol.j.stop().animate({
                opacity: 0
            }, {
                queue: !1,
                complete: function() {}
            }))
        };
        b._mousewheel = function(a, d, c, g) {
            a.preventDefault();
            b.zoom(b.level + Math.round(g * (b.maxZoom / b.options.steps)), a.pageX, a.pageY)
        };
        b._stepIn = function(a) {
            a.preventDefault();
            b.zoom(b.level +
                Math.round(1 * (b.maxZoom / b.options.steps)), b.cursor.lastX, b.cursor.lastY)
        };
        b._stepOut = function(a) {
            a.preventDefault();
            b.zoom(b.level + Math.round(-1 * (b.maxZoom / b.options.steps)), b.cursor.lastX, b.cursor.lastY)
        };
        var d;
        b._scale = [];
        b._scale[1] = function() {
            d = b.level;
            f("#info").append("start[" + d + "] ")
        };
        b._scale[2] = function(a) {
            f("#info").append("s ");
            f("#info").append("s[" + Math.abs(d * a.scale) + "," + a.position.x + "] ");
            b.zoom(d * a.scale, a.position.x, a.position.y)
        };
        b._scale[3] = function() {};
        var e = b.element.children().first().attr("src"),
            j = b.element.attr("href"),
            l = new Image;
        l.onload = function() {
            b.load(e, j)
        };
        l.src = e
    }
    var k = {
        damping: 8,
        steps: 15,
        mode: "dock",
        zoom: 15,
        controls: !0,
        size: "actual"
    };
    e.prototype.load = function(a, c, b) {
        var d = this;
        a || (a = d.dp.tn.src);
        c || (c = d.si.src);
        !1 == d.initialised && d.tearUp();
        b && d._focus();
        d.dp.tn.src = a;
        d.si.src = c;
        d.dp.tn.j.attr("src") != d.dp.tn.src && (d.dp.tn.j.one("load", function() {
            "actual" == d.options.size && d.rt.j.css({
                width: d.dp.tn.j.width(),
                height: d.dp.tn.j.height()
            });
            d.dp.tn.j.stop().animate({
                opacity: 1
            }, {
                queue: !1,
                complete: function() {
                    d.rt.bg.j.attr("src", d.dp.tn.src);
                    d.dp.tn.j.css({
                        opacity: 0
                    })
                }
            })
        }), d.dp.tn.j.attr("src", d.dp.tn.src));
        var e = function(a, b) {
            var c;
            d.si.j.one("load", function() {
                d.dp.j.off("sxy-move sxy-hover", c);
                d.waiting = null;
                d.rebuild();
                d.zoom(d.maxZoom / d.options.steps * d.options.zoom, d.cursor.lastX, d.cursor.lastY);
                d.driver.load && d.driver.load(d.cursor.lastX, d.cursor.lastY);
                d.zoom(d.maxZoom / d.options.steps * d.options.zoom, d.cursor.lastX, d.cursor.lastY);
                d.rt.j.toggleClass("sxy-zoom-loading")
            });
            d.cursor = {
                lastX: a,
                lastY: b
            };
            d.dp.j.on("sxy-move sxy-hover", c = function(a) {
                a = a.pointers[0];
                d.cursor = {
                    lastX: a.x,
                    lastY: a.y
                }
            });
            d.si.j.attr("src", d.si.src)
        };
        if (b) d.waiting = null, d.rt.j.toggleClass("sxy-zoom-loading"), e(0, 0);
        else if (!d.waiting) d.rt.j.one("sxy-focus", d.waiting = function(a) {
            d.rt.j.toggleClass("sxy-zoom-loading");
            e(a.pointers[0].x, a.pointers[0].y)
        })
    };
    e.prototype.getNaturalSize = function(a) {
        var c = new Image;
        c.src = a;
        return {
            w: c.width,
            h: c.height
        }
    };
    e.prototype.rebuild = function() {
        var a = this.dp,
            c = this.vp,
            b = this.si,
            d = this.vf;
        f.extend(a, {
            w: "actual" == this.options.size ? a.tn.j.width() : this.rt.j.width(),
            h: "actual" == this.options.size ? a.tn.j.height() : this.rt.j.height(),
            ol: a.j.offset().left,
            ot: a.j.offset().top,
            hyp: Math.round(Math.sqrt(Math.pow(a.tn.j.width(), 2) + Math.pow(a.tn.j.height(), 2)))
        });
        switch (this.options.size) {
            case "actual":
                this.rt.j.css({
                    width: a.w,
                    height: a.h
                });
                break;
            case "src":
                this.rt.j.css({
                    width: a.w,
                    height: a.h
                })
        }
        f.extend(c, {
            w: a.w,
            h: a.h
        });
        this.vp.j.css({
            width: a.w,
            height: a.h
        });
        c = this.getNaturalSize(this.si.src);
        f.extend(b, {
            w: 0,
            h: 0,
            l: 0,
            t: 0,
            mL: 0,
            mT: 0,
            oHyp: Math.round(Math.sqrt(Math.pow(c.w, 2) + Math.pow(c.h, 2))),
            oH: c.h,
            oW: c.w
        });
        f.extend(d, {
            w: 0,
            h: 0,
            l: 0,
            t: 0
        });
        this.ct.sl.j.css({
            height: this.ct.sl.h = this.ct.j.height() - (this.ct.zin.j.outerHeight() + this.ct.zout.j.outerHeight())
        });
        this.ct.sl.h -= 16;
        clearTimeout(this.dmp.timer);
        this.dmp = {
            cX: 0,
            tX: 0,
            cY: 0,
            tY: 0,
            timer: !1
        };
        this.scale = Math.atan(this.si.oH / this.si.oW);
        this.angle = 0;
        this.maxZoom = b.oHyp - a.hyp;
        this.level = 0
    };
    e.prototype.tearUp = function() {
        var a = this;
        a.initialised = !0;
        a.el = new h(a.element);
        a.el.tn = new h(a.element.children());
        var c = a.getNaturalSize(a.el.tn.j.attr("src")),
            b, d;
        switch (a.options.size) {
            case "actual":
                b = c.w + "px";
                d = c.h + "px";
                break;
            case "src":
                b = a.el.tn.j.attr("width") + "px";
                d = a.el.tn.j.attr("height") + "px";
                //d = "auto";
                break;
            default:
                b = a.options.size, d = "auto"
        }
        var e = {
            w: b,
            h: d,
            srcthumb: a.el.tn.j.attr("src"),
            mode: a.options.mode,
            auto: "auto" == d ? '<div style="padding-top: ' + 100 / c.w * c.h + '%;" />' : ""
        };
        a.el.j.wrap('<div class="sxy-zoom-container sxy-zoom-mode-{mode}" style="width: {w}; height: {h}; position: relative;" ></div>'.replace(/\{(\w+)\}/g,
            function(a, b) {
                return e[b] || a
            }));
        a.element.hide();
        a.rt = new h(a.el.j.parent());
        a.rt.j.append('<img class="sxy-zoom-bg" src="{srcthumb}" />{auto}<div class="sxy-controls"><div class="overlay"></div><a class="in" href="#"></a><div class="sxy-slider"><div class="sxy-handle" style="top: 0px;"></div></div><a class="out" href="#"></a></div><div class="sxy-zoom-dragpad"><div class="sxy-overlay"></div><div class="sxy-zoom-viewport"><img galleryimg="no" /></div><img class="inner-thumb" src="{srcthumb}" /><div class="sxy-zoom-viewfinder"></div></div><div class="sxy-loading"><span></span></div>'.replace(/\{(\w+)\}/g,
            function(a, b) {
                return e[b] || a
            }));
        a.rt.bg = new h(a.rt.j.find(".sxy-zoom-bg"));
        a.rt.j.on("dragstart", function() {
            return !1
        });
        a.ct = new h(a.rt.j.find(".sxy-controls").hide());
        a.ct.ol = new h(a.ct.j.find(".overlay"));
        a.ct.zin = new h(a.ct.j.find(".in"));
        a.ct.zout = new h(a.ct.j.find(".out"));
        a.ct.sl = new h(a.ct.j.find(".sxy-slider").first(), {
            h: 0
        });
        a.ct.hnd = new h(a.ct.j.find(".sxy-handle"));
        a.dp = new h(a.rt.j.find(".sxy-zoom-dragpad").first(), {
            w: 0,
            h: 0,
            ol: 0,
            ot: 0,
            hyp: 0
        });
        a.dp.ovl = new h(a.dp.j.find(".sxy-overlay"));
        a.dp.tn =
            new h(a.dp.j.find(".inner-thumb").css({
                opacity: 0
            }), {
                src: ""
            });
        a.vp = new h(a.dp.j.find(".sxy-zoom-viewport").css({
            opacity: 0
        }), {
            w: 0,
            h: 0
        });
        a.si = new h(a.vp.j.find("img"), {
            w: 0,
            h: 0,
            l: 0,
            t: 0,
            mL: 0,
            mT: 0,
            oHyp: 0,
            oH: 0,
            oW: 0,
            src: ""
        });
        a.vf = new h(a.dp.j.find(".sxy-zoom-viewfinder").css({
            display: "none"
        }), {
            w: 0,
            h: 0,
            l: 0,
            t: 0,
            osl: 0,
            ost: 0
        });
        a.rt.j.on("sxy-focus", a._focus);
        a.rt.j.on("sxy-blur", a._blur);
        if (f.event.special.mousewheel) a.rt.j.on("mousewheel", a._mousewheel);
        a.dp.j.on("sxy-scale", function(b) {
            a._scale[b.state](b)
        });
        a.ct.zin.j.on("click", a._stepIn);
        a.ct.zout.j.on("click", a._stepOut);
        a.ct.sl.j.on("sxy-down sxy-move", a._moveSlider)
    };
    e.prototype.move = function(a, c, b) {
        var d = -1 * (a / this.scale),
            e = -1 * (c / this.scale);
        this.cursor.lastX = d + this.vf.w / 2 + this.dp.ol;
        this.cursor.lastY = e + this.vf.h / 2 + this.dp.ot;
        0 > d && (d = a = 0);
        0 > e && (e = c = 0);
        d + this.vf.w > this.dp.w && (d = this.dp.w - this.vf.w, a = this.si.mL);
        e + this.vf.h > this.dp.h && (e = this.dp.h - this.vf.h, c = this.si.mT);
        this.vf.l = ~~d;
        this.vf.t = ~~e;
        this.dmp.tX = a;
        this.dmp.tY = c;
        b && !1 != this.options.damping ?
            this.dmp.timer || (this.dmp.timer = setInterval(this._animate, 16)) : (clearTimeout(this.dmp.timer), this.dmp.timer = !1, b = this.si.e.style, b.left = (this.dmp.tX = this.dmp.cX = a) + "px", b.top = (this.dmp.tY = this.dmp.cY = c) + "px")
    };
    e.prototype.center = function(a, c, b) {
        this.move(-1 * (a - this.vf.w / 2) * this.scale, -1 * (c - this.vf.h / 2) * this.scale, b)
    };
    e.prototype.zoom = function(a, c, b) {
        this.level = a;
        0 > this.level && (this.level = 0);
        this.level > this.maxZoom && (this.level = this.maxZoom);
        a = 100 * ((this.si.oHyp - this.level) / this.si.oHyp);
        this.ct.hnd.j.css({
            top: this.ct.sl.h -
                this.ct.sl.h / 100 * 100 * (this.level / this.maxZoom)
        });
        this.vf.w = this.vp.w / 100 * a;
        this.vf.h = this.vp.h / 100 * a;
        this.vf.osl = parseInt(this.vf.j.css("border-left-width"), 10);
        this.vf.ost = parseInt(this.vf.j.css("border-top-width"), 10);
        this.scale = this.si.oW / this.vp.w / (this.si.oW / 100 * a / this.vp.w);
        this.si.w = this.si.oW / (this.si.oW / 100 * a / this.dp.w);
        this.si.h = this.si.oH / (this.si.oH / 100 * a / this.dp.h);
        this.vf.j.css({
            width: this.vf.w,
            height: this.vf.h
        });
        this.si.j.css({
            width: this.si.w,
            height: this.si.h
        });
        this.si.mL = 0 - (this.si.w -
            this.vp.w);
        this.si.mT = 0 - (this.si.h - this.vp.h);
        this.driver.zoom && this.driver.zoom(c, b)
    };
    f.fn.swinxyzoom = function(a) {
        var c = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var b;
            if (b = f.data(this, "swinxyzoom")) {
                if (b[a]) return b[a].apply(b, c);
                f.error("Method " + a + " does not exist on jQuery.swinxyzoom")
            } else f.data(this, "swinxyzoom", new e(this, a))
        })
    };
    f.fn.swinxyzoom.modes = {}
})(jQuery);
(function(f, c) {
    var h = {
            position: "right"
        },
        e = !1,
        k = {
            backgroundSize: {
                supported: !1,
                variations: ["backgroundSize", "WebkitBackgroundSize", "MozBackgroundSize", "OBackgroundSize", "msBackgroundSize"]
            }
        };
    f.fn.swinxyzoom.modes.dock = function(a) {
        function g() {
            w && (w = !1, a.vf.j.hide(), a.dp.ovl.j.stop().animate({
                opacity: 0
            }, {
                queue: !1
            }), a.vp.j.stop().animate({
                opacity: 0,
                left: a.dp.w / 2,
                top: a.dp.h / 2,
                width: 0,
                height: 0
            }, {
                queue: !1
            }))
        }

        function b(b, c) {
            a.waiting || (w = !0, a.si.j.show(), a.vp.j.show(), a.vf.j.show(), a.dp.ovl.j.stop().animate({
                opacity: 0.5
            }, {
                queue: !1
            }), a.vp.j.stop().animate({
                opacity: 1,
                left: t,
                top: u,
                width: a.vp.w,
                height: a.vp.h
            }, {
                queue: !1
            }), p.move(b, c, !0))
        }

        function d() {
            a.rt.j.on("sxy-focus", function(a) {
                a = a.pointers[0];
                b(a.x, a.y)
            });
            a.rt.j.on("sxy-blur", function() {
                g()
            });
            a.dp.j.on("sxy-hover sxy-move sxy-down", B);
            if (!1 == x) {
                var c = f('<img src="" style="display: block; position: absolute;" />');
                a.vf.j.append(c);
                a.vf.img = {
                    j: c,
                    e: c.get(0)
                }
            }
            p.initialised = !0
        }

        function m() {
            if (p.initialised) {
                var b = a.vf,
                    c = a.vf.e.style;
                b.l != y || b.t != z ? (c.left = (y = b.l) + "px",
                    c.top = (z = b.t) + "px", !1 == x ? (c = a.vf.img.e.style, c.left = "-" + (b.l + b.osl) + "px", c.top = "-" + (b.t + b.ost) + "px") : c.backgroundPosition = "-" + (b.l + b.osl) + "px -" + (b.t + b.ost) + "px", A = setTimeout(m, 8)) : A = !1
            }
        }

        function j(c, d, e) {
            var j = a.dp.j.offset(),
                r = j.left,
                j = j.top,
                f = r + a.dp.j.width(),
                h = j + a.dp.j.height();
            d < j || c > f || d > h || c < r ? g() : (w || b(c, d), a.center(c - a.dp.ol, d - a.dp.ot, e), A || m())
        }
        this.initialised = !1;
        if (!e) {
            e = !0;
            var l = 0,
                n = 0,
                q;
            for (q in k) {
                ++l;
                for (var s = k[q], r = s.variations, v = 0, C = r.length; v < C; ++v)
                    if (document.createElement("div").style[r[v]] !==
                        c) {
                        ++n;
                        s.supported = r[v];
                        break
                    }
            }
            k._all = l == n
        }
        var w = !1,
            p = this,
            t = 0,
            u = 0,
            x = k.backgroundSize.supported,
            B = function(a) {
                1 == a.pointers.length && (a = a.pointers[0], j(a.x, a.y, !0))
            },
            D = f.extend({}, h, a.options.dock != c ? a.options.dock : {}),
            A = !1,
            y, z;
        p.tearUp = d;
        p.load = function(c, e) {
            switch (D.position) {
                case "top":
                    t = 0;
                    u = -1 * (a.dp.h + 10);
                    break;
                case "right":
                    t = a.dp.w + 10;
                    u = 0;
                    break;
                case "bottom":
                    t = 0;
                    u = a.dp.h + 10;
                    break;
                case "left":
                    t = -1 * (a.dp.w + 10), u = 0
            }
            a.vp.j.css({
                width: 0,
                height: 0,
                left: a.dp.w / 2,
                top: a.dp.h / 2
            });
            a.dp.ovl.j.css({
                opacity: 0
            });
            a.vf.j.css({
                position: "relative",
                overflow: "hidden"
            });
            y = z = 0;
            p.initialised || d();
            !1 == x ? (a.vf.img.j.attr("src", a.dp.tn.src), a.vf.img.j.css({
                width: a.dp.w,
                height: a.dp.h
            })) : (a.vf.j.css("background-image", "url(" + a.dp.tn.src + ")"), a.vf.j.css(x, a.dp.w + "px " + a.dp.h + "px"));
            a.hasFocus && b(c, e)
        };
        p.focus = b;
        p.blur = g;
        p.move = j;
        p.zoom = function(a, b) {
            j(a, b, !1)
        }
    }
})(jQuery);
(function(f, c) {
    var h = {
        width: 200,
        height: 200
    };
    f.fn.swinxyzoom.modes.lens = function(e) {
        function k(a, b) {
            e.waiting || (m = !0, e.dp.j.on("sxy-hover sxy-move sxy-down", j), e.vp.j.show(), e.vp.j.stop().animate({
                opacity: 1,
                width: e.vp.w,
                height: e.vp.h
            }, {
                queue: !1
            }), d.move(a, b, !0))
        }

        function a() {
            m && (m = !1, e.dp.j.off("sxy-hover sxy-move sxy-down", j), e.vp.j.stop().animate({
                opacity: 0
            }, {
                queue: !1,
                complete: function() {
                    e.vp.j.hide()
                }
            }))
        }

        function g() {
            var a = e.vf,
                b = e.vp,
                c = e.vp.e.style;
            a.l != q || a.t != s ? (c.left = e.cursor.lastX - e.dp.ol -
                b.w / 2 + "px", c.top = e.cursor.lastY - e.dp.ot - b.h / 2 + "px", n = setTimeout(g, 8)) : n = !1
        }

        function b(a, b, c) {
            e.center(a - e.dp.ol, b - e.dp.ot, c);
            n || g()
        }
        this.initialised = !1;
        var d = this,
            m = !0,
            j = function(a) {
                1 == a.pointers.length && (a = a.pointers[0], b(a.x, a.y, !0))
            },
            l = f.extend({}, h, e.options.lens != c ? e.options.lens : {}),
            n = !1,
            q, s;
        d.tearUp = function() {
            e.dp.j.swinxytouch("bound");
            e.dp.j.on("sxy-focus", function(a) {
                k(a.pointers[0].x, a.pointers[0].y)
            });
            e.dp.j.on("sxy-blur", function() {
                a()
            })
        };
        d.load = function(a, b) {
            e.vp.j.css({
                opacity: 0,
                width: l.width,
                height: l.height,
                left: 0,
                top: 0
            });
            e.vp.w = l.width;
            e.vp.h = l.height;
            e.vp.j.show();
            e.si.j.show();
            e.vf.j.hide();
            q = s = 0;
            d.initialised || d.tearUp();
            e.hasFocus && k(a, b)
        };
        d.focus = k;
        d.blur = a;
        d.move = b;
        d.zoom = function(a, c) {
            b(a, c, !1)
        }
    }
})(jQuery);
(function(f) {
    f.fn.swinxyzoom.modes.slippy = function(c) {
        var f, e, k, a;

        function g() {
            c.dp.j.on("sxy-focus", function(a) {
                b(a.pointers[0].x, a.pointers[0].y)
            });
            c.dp.j.on("sxy-blur", function() {
                d()
            });
            c.dp.j.on("sxy-down", function(b) {
                c.dp.j.toggleClass("down");
                b = b.pointers[0];
                f = c.dmp.tX;
                e = c.dmp.tY;
                k = b.x - c.dp.ol;
                a = b.y - c.dp.ot
            });
            c.dp.j.on("sxy-up", function() {
                c.dp.j.toggleClass("down")
            });
            c.dp.j.on("sxy-move", function(b) {
                b = b.pointers[0];
                c.move(f + (b.x - c.dp.ol - k), e + (b.y - c.dp.ot - a), !0);
                l || m()
            })
        }

        function b() {
            c.waiting ||
                (c.si.j.show(), c.vp.j.show(), c.vf.j.show(), c.vp.j.stop().animate({
                    opacity: 1
                }, {
                    queue: !1
                }))
        }

        function d() {
            c.vf.j.hide();
            c.vp.j.animate({
                opacity: 0
            }, {
                queue: !1
            })
        }

        function m() {
            var a = c.vf,
                b = c.vf.e.style;
            a.l != n || a.t != q ? (b.left = (n = a.l) + "px", b.top = (q = a.t) + "px", l = setTimeout(m, 8)) : l = !1
        }
        this.initialised = !1;
        var j = this;
        a = k = e = f = void 0;
        var l = !1,
            n, q;
        j.tearUp = g;
        j.load = function(d, l) {
            c.vp.j.css({
                opacity: 0,
                width: c.dp.w,
                height: c.dp.h,
                left: 0,
                top: 0
            });
            e = f = 0;
            k = d;
            a = l;
            c.center(c.dp.w / 2, c.dp.h / 2, !1);
            n = q = 0;
            j.initialised || g();
            c.hasFocus &&
                b(d, l)
        };
        j.focus = b;
        j.blur = d;
        j.zoom = function() {
            c.center(c.cursor.lastX - c.dp.ol, c.cursor.lastY - c.dp.ot, !1);
            c.vf.j.css({
                left: c.vf.l,
                top: c.vf.t
            })
        }
    }
})(jQuery);
(function(f) {
    f.fn.swinxyzoom.modes.window = function(c) {
        function f(b, d) {
            c.waiting || (c.si.j.show(), c.vp.j.show(), c.vf.j.show(), c.vp.j.stop().animate({
                opacity: 1
            }, {
                queue: !1
            }), a(b, d, !0))
        }

        function e() {
            c.vf.j.hide();
            c.vp.j.stop().animate({
                opacity: 0
            }, {
                queue: !1
            })
        }

        function k() {
            var a = c.vf,
                e = c.vf.e.style;
            a.l != d || a.t != m ? (e.left = (d = a.l) + "px", e.top = (m = a.t) + "px", b = setTimeout(k, 8)) : b = !1
        }

        function a(a, d, e) {
            c.center(a - c.dp.ol, d - c.dp.ot, e);
            b || k()
        }
        var g = this,
            b = this.initialised = !1,
            d, m;
        g.tearUp = function() {
            c.rt.j.on("sxy-focus",
                function(a) {
                    f(a.pointers[0].x, a.pointers[0].y)
                });
            c.rt.j.on("sxy-blur", function() {
                e()
            });
            c.dp.j.on("sxy-hover sxy-move sxy-down", function(b) {
                1 == b.pointers.length && (b = b.pointers[0], a(b.x, b.y, !0))
            })
        };
        g.load = function(a, b) {
            c.vp.j.css({
                opacity: 0,
                width: c.dp.w,
                height: c.dp.h,
                left: 0,
                top: 0
            });
            d = m = 0;
            g.initialised || g.tearUp();
            c.hasFocus && g.focus(a, b)
        };
        g.focus = f;
        g.blur = e;
        g.move = a;
        g.zoom = function(b, c) {
            a(b, c, !1)
        }
    }
})(jQuery);

/* jquery.swinxyswipe.min.js */
(function(e, p) {
    function t(a, b) {
        this.el = a.get(0);
        this.jq = a.first();
        b != p && e.extend(this, b)
    }

    function j(j, b) {
        function m() {
            g(d.current - 1)
        }

        function c() {
            g(d.current + 1)
        }

        function g(a) {
            a = 1 > a || a > d.total ? d.current : a;
            k.page != p && k.page(a, d.current);
            d.current = a;
            b.change && b.change(d);
            u()
        }
        var k = null,
            q = null,
            d = null,
            l = null,
            u = null;
        this.page = g;
        this.next = c;
        this.previous = m;
        (function() {
            b = e.extend({}, a, b);
            q = new t(e(j));
            d = new t(q.jq.find("ul"), {
                current: null,
                total: null
            });
            k = new e.fn[h].providers[b.provider](this, q, d, b[b.provider] ?
                b[b.provider] : {});
            if (!f) {
                f = !0;
                var N = n,
                    E = n,
                    F = 0,
                    G = 0,
                    H;
                for (H in E) {
                    ++F;
                    for (var I = E[H], B = I.variations, v = 0, O = B.length; v < O; ++v)
                        if (document.createElement("div").style[B[v]] !== p) {
                            ++G;
                            I.supported = B[v];
                            break
                        }
                }
                N._all = F == G
            }
            if (n._all) {
                var J = n.transform.supported,
                    K = n.transition.supported;
                u = function(a) {
                    var c = d.el.style;
                    a == p ? (c[K] = "200ms", c[J] = "translate(" + -1 * (d.current - 1) * (l - b.bleed) + "px,0)") : (c[K] = "0ms", c[J] = "translate(" + a + "px,0)")
                }
            } else {
                var L = d.el.style,
                    w = null,
                    C = 0,
                    x = 0,
                    P = function() {
                        var a = C - x;
                        L.left = (x += a / 8) + "px";
                        0 == ~~a && (L.left = C + "px", clearTimeout(w), w = !1)
                    };
                u = function(a) {
                    C = !a ? -1 * (d.current - 1) * (l - b.bleed) : x = a;
                    w || (w = setInterval(P, 16))
                }
            }
            null != b.width && q.jq.css({
                width: b.width
            });
            null != b.height && q.jq.css({
                height: b.height
            });
            l = q.jq.width();
            q.jq.css({
                overflow: "hidden",
                width: l
            });
            d.jq.css({
                width: d.total * l,
                "list-style": "none",
                margin: 0,
                padding: 0,
                position: "relative"
            });
            d.jq.children("li").css({
                width: l - b.bleed,
                display: "block",
                "float": "left"
            });
            u(-1 * (d.current - 1) * (l - b.bleed));
            b.change && b.change(d);
            b.smartclick && d.jq.swinxytouch("smartclick");
            b.next && e(b.next).click(function(a) {
                a.preventDefault();
                c()
            });
            b.previous && e(b.previous).click(function(a) {
                a.preventDefault();
                m()
            });
            if (b.swipe) d.jq.on("sxy-swipe", function(a) {
                if (a.distance < l / 2) switch (a.direction) {
                    case "right":
                        m();
                        break;
                    case "left":
                        c()
                }
            });
            var y = [],
                M = 0,
                D = 0,
                r = 0,
                s = 0,
                z = 0;
            y[1] = function(a) {
                M = -1 * (d.current - 1) * (l - b.bleed);
                D = a.position.x;
                s = a.position.y;
                z = 0
            };
            y[2] = function(a) {
                0 == z && (z = Math.abs(D - a.position.x) >= Math.abs(s - a.position.y) ? 1 : 2);
                if (1 == z) {
                    var b = 1;
                    r = a.position.x - D;
                    if (1 == d.current && 0 < r ||
                        d.current == d.total && 0 > r) b = Math.abs(r) / l + 1.5;
                    u(M + r / b)
                } else a = s - (s = a.position.y), 0 != a && (s += a, window.scrollBy(0, a))
            };
            y[3] = function() {
                Math.abs(r) > l / 2 ? g(0 > r ? d.current + 1 : d.current - 1) : g(d.current)
            };
            d.jq.on("sxy-drag", function(a) {
                y[a.state](a)
            })
        })()
    }
    var h = "swinxyswipe",
        a = {
            bleed: 0,
            change: null,
            next: null,
            previous: null,
            provider: "html",
            smartclick: !0,
            swipe: !0,
            width: null
        },
        f = !1,
        n = {
            transform: {
                supported: !1,
                variations: ["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"]
            },
            transition: {
                supported: !1,
                variations: ["transition", "WebkitTransition", "MozTransition", "OTransition", "msTransition"]
            }
        };
    e.fn[h] = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var f;
            if (f = e.data(this, h)) {
                if (f[a]) return f[a].apply(f, b);
                e.error("Method " + a + " does not exist on jQuery.swinxyswipe")
            } else e.data(this, h, new j(this, a))
        })
    };
    e.fn[h].providers = {}
})(jQuery);
(function(e) {
    e.fn.swinxyswipe.providers.html = function(e, t, j) {
        j.current = 1;
        j.total = j.jq.children().length
    }
})(jQuery);
(function(e) {
    function p(e, h) {
        for (var a = ""; 0 < h;) h & 1 && (a += e), h >>= 1, e += e;
        return a
    }
    var t = {
        total: null,
        current: null,
        request: null,
        loaded: null,
        preload: 1,
        autofree: 8
    };
    e.fn.swinxyswipe.providers.ajax = function(j, h, a, f) {
        function n(c) {
            var g;
            A(c);
            for (var k = c - 1; k >= (1 < (g = c - f.preload) ? g : 1); --k) A(k);
            for (k = c + 1; k <= ((g = c + f.preload) < a.total ? g : a.total); ++k) A(k);
            if (m.length > f.autofree)
                for (; m.length > f.autofree;) c = m.shift(), c >= a.current - f.preload && c <= a.current + f.preload ? m.push(c) : (b[c] = !1, a.jq.children()[c - 1].innerHTML = "",
                    e(a.jq.children()[c - 1]).addClass("sxy-page-blank"))
        }

        function A(c) {
            if (!b[c]) {
                var g = e(a.jq.children()[c - 1]);
                g.removeClass("sxy-page-blank").addClass("sxy-page-loading");
                b[c] = !0;
                m.push(c);
                e.get(f.request(c), null, function(b) {
                    f.loaded && (b = f.loaded(c, b));
                    a.jq.children()[c - 1].innerHTML = b;
                    g.removeClass("sxy-page-loading")
                }, "html")
            }
        }
        j = h.jq.width();
        var b = [],
            m = [];
        this.page = n;
        f = e.extend({}, t, f);
        a.current = f.current;
        a.total = f.total;
        b[a.current] = !0;
        1 < a.current && a.jq.prepend(p('<li class="sxy-page-blank" style="width: ' +
            j + 'px"></li>', a.current - 1));
        a.current < a.total && a.jq.append(p('<li class="sxy-page-blank" style="width: ' + j + 'px"></li>', a.total - a.current));
        n(a.current)
    }
})(jQuery);
