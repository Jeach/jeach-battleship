/*
 jquery.layout 1.4.3
 $Date: 2014-08-30 08:00:00 (Sat, 30 Aug 2014) $
 $Rev: 1.0403 $

 Copyright (c) 2014 Kevin Dalman (http://jquery-dev.com)
 Based on work by Fabrizio Balliano (http://www.fabrizioballiano.net)

 Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.

 SEE: http://layout.jquery-dev.com/LICENSE.txt

 Changelog: http://layout.jquery-dev.com/changelog.cfm

 Docs: http://layout.jquery-dev.com/documentation.html
 Tips: http://layout.jquery-dev.com/tips.html
 Help: http://groups.google.com/group/jquery-ui-layout
*/
(function (d) {
    var ua = Math.min, E = Math.max, ka = Math.floor, U = function (e) { return "string" === d.type(e) }, ha = function (e, t) { if (d.isArray(t)) for (var m = 0, q = t.length; m < q; m++) { var x = t[m]; try { U(x) && (x = eval(x)), d.isFunction(x) && x(e) } catch (n) { } } }; d.layout = {
        version: "1.4.3", revision: 1.0403, browser: {}, effects: {
            slide: { all: { duration: "fast" }, north: { direction: "up" }, south: { direction: "down" }, east: { direction: "right" }, west: { direction: "left" } }, drop: {
                all: { duration: "slow" }, north: { direction: "up" }, south: { direction: "down" }, east: { direction: "right" },
                west: { direction: "left" }
            }, scale: { all: { duration: "fast" } }, blind: {}, clip: {}, explode: {}, fade: {}, fold: {}, puff: {}, size: { all: { easing: "swing" } }
        }, config: {
            optionRootKeys: "effects panes north south west east center".split(" "), allPanes: ["north", "south", "west", "east", "center"], borderPanes: ["north", "south", "west", "east"], oppositeEdge: { north: "south", south: "north", east: "west", west: "east" }, offscreenCSS: { left: "-99999px", right: "auto" }, offscreenReset: "offscreenReset", hidden: { visibility: "hidden" }, visible: { visibility: "visible" },
            resizers: { cssReq: { position: "absolute", padding: 0, margin: 0, fontSize: "1px", textAlign: "left", overflow: "hidden" }, cssDemo: { background: "#DDD", border: "none" } }, togglers: { cssReq: { position: "absolute", display: "block", padding: 0, margin: 0, overflow: "hidden", textAlign: "center", fontSize: "1px", cursor: "pointer", zIndex: 1 }, cssDemo: { background: "#AAA" } }, content: { cssReq: { position: "relative" }, cssDemo: { overflow: "auto", padding: "10px" }, cssDemoPane: { overflow: "hidden", padding: 0 } }, panes: {
                cssReq: { position: "absolute", margin: 0 }, cssDemo: {
                    padding: "10px",
                    background: "#FFF", border: "1px solid #BBB", overflow: "auto"
                }
            }, north: { side: "top", sizeType: "Height", dir: "horz", cssReq: { top: 0, bottom: "auto", left: 0, right: 0, width: "auto" } }, south: { side: "bottom", sizeType: "Height", dir: "horz", cssReq: { top: "auto", bottom: 0, left: 0, right: 0, width: "auto" } }, east: { side: "right", sizeType: "Width", dir: "vert", cssReq: { left: "auto", right: 0, top: "auto", bottom: "auto", height: "auto" } }, west: { side: "left", sizeType: "Width", dir: "vert", cssReq: { left: 0, right: "auto", top: "auto", bottom: "auto", height: "auto" } },
            center: { dir: "center", cssReq: { left: "auto", right: "auto", top: "auto", bottom: "auto", height: "auto", width: "auto" } }
        }, callbacks: {}, getParentPaneElem: function (e) { e = d(e); if (e = e.data("layout") || e.data("parentLayout")) { e = e.container; if (e.data("layoutPane")) return e; e = e.closest("." + d.layout.defaults.panes.paneClass); if (e.data("layoutPane")) return e } return null }, getParentPaneInstance: function (e) { return (e = d.layout.getParentPaneElem(e)) ? e.data("layoutPane") : null }, getParentLayoutInstance: function (e) {
            return (e = d.layout.getParentPaneElem(e)) ?
                e.data("parentLayout") : null
        }, getEventObject: function (d) { return "object" === typeof d && d.stopPropagation ? d : null }, parsePaneName: function (e) { var t = d.layout.getEventObject(e); t && (t.stopPropagation(), e = d(this).data("layoutEdge")); e && !/^(west|east|north|south|center)$/.test(e) && (d.layout.msg('LAYOUT ERROR - Invalid pane-name: "' + e + '"'), e = "error"); return e }, plugins: { draggable: !!d.fn.draggable, effects: { core: !!d.effects, slide: d.effects && (d.effects.slide || d.effects.effect && d.effects.effect.slide) } }, onCreate: [],
        onLoad: [], onReady: [], onDestroy: [], onUnload: [], afterOpen: [], afterClose: [], scrollbarWidth: function () { return window.scrollbarWidth || d.layout.getScrollbarSize("width") }, scrollbarHeight: function () { return window.scrollbarHeight || d.layout.getScrollbarSize("height") }, getScrollbarSize: function (e) {
            var t = d('<div style="position: absolute; top: -10000px; left: -10000px; width: 100px; height: 100px; border: 0; overflow: scroll;"></div>').appendTo("body"), m = { width: t.outerWidth - t[0].clientWidth, height: 100 - t[0].clientHeight };
            t.remove(); window.scrollbarWidth = m.width; window.scrollbarHeight = m.height; return e.match(/^(width|height)$/) ? m[e] : m
        }, disableTextSelection: function () { var e = d(document); d.fn.disableSelection && (e.data("textSelectionInitialized") || e.on("mouseup", d.layout.enableTextSelection).data("textSelectionInitialized", !0), e.data("textSelectionDisabled") || e.disableSelection().data("textSelectionDisabled", !0)) }, enableTextSelection: function () {
            var e = d(document); d.fn.enableSelection && e.data("textSelectionDisabled") && e.enableSelection().data("textSelectionDisabled",
                !1)
        }, showInvisibly: function (d, t) { if (d && d.length && (t || "none" === d.css("display"))) { var m = d[0].style, m = { display: m.display || "", visibility: m.visibility || "" }; d.css({ display: "block", visibility: "hidden" }); return m } return {} }, getElementDimensions: function (e, t) {
            var m = { css: {}, inset: {} }, q = m.css, x = { bottom: 0 }, n = d.layout.cssNum, z = Math.round, C = e.offset(), F, L, N; m.offsetLeft = C.left; m.offsetTop = C.top; t || (t = {}); d.each(["Left", "Right", "Top", "Bottom"], function (n, r) {
                F = q["border" + r] = d.layout.borderWidth(e, r); L = q["padding" +
                    r] = d.layout.cssNum(e, "padding" + r); N = r.toLowerCase(); m.inset[N] = 0 <= t[N] ? t[N] : L; x[N] = m.inset[N] + F
            }); q.width = z(e.width()); q.height = z(e.height()); q.top = n(e, "top", !0); q.bottom = n(e, "bottom", !0); q.left = n(e, "left", !0); q.right = n(e, "right", !0); m.outerWidth = z(e.outerWidth()); m.outerHeight = z(e.outerHeight()); m.innerWidth = E(0, m.outerWidth - x.left - x.right); m.innerHeight = E(0, m.outerHeight - x.top - x.bottom); m.layoutWidth = z(e.innerWidth()); m.layoutHeight = z(e.innerHeight()); return m
        }, getElementStyles: function (d, t) {
            var m =
                {}, q = d[0].style, x = t.split(","), n = ["Top", "Bottom", "Left", "Right"], z = ["Color", "Style", "Width"], C, F, L, E, A, r; for (E = 0; E < x.length; E++)if (C = x[E], C.match(/(border|padding|margin)$/)) for (A = 0; 4 > A; A++)if (F = n[A], "border" === C) for (r = 0; 3 > r; r++)L = z[r], m[C + F + L] = q[C + F + L]; else m[C + F] = q[C + F]; else m[C] = q[C]; return m
        }, cssWidth: function (e, t) {
            if (0 >= t) return 0; var m = d.layout.browser, m = m.boxModel ? m.boxSizing ? e.css("boxSizing") : "content-box" : "border-box", q = d.layout.borderWidth, x = d.layout.cssNum, n = t; "border-box" !== m && (n -= q(e,
                "Left") + q(e, "Right")); "content-box" === m && (n -= x(e, "paddingLeft") + x(e, "paddingRight")); return E(0, n)
        }, cssHeight: function (e, t) { if (0 >= t) return 0; var m = d.layout.browser, m = m.boxModel ? m.boxSizing ? e.css("boxSizing") : "content-box" : "border-box", q = d.layout.borderWidth, x = d.layout.cssNum, n = t; "border-box" !== m && (n -= q(e, "Top") + q(e, "Bottom")); "content-box" === m && (n -= x(e, "paddingTop") + x(e, "paddingBottom")); return E(0, n) }, cssNum: function (e, t, m) {
            e.jquery || (e = d(e)); var q = d.layout.showInvisibly(e); t = d.css(e[0], t, !0); m =
                m && "auto" == t ? t : Math.round(parseFloat(t) || 0); e.css(q); return m
        }, borderWidth: function (e, t) { e.jquery && (e = e[0]); var m = "border" + t.substr(0, 1).toUpperCase() + t.substr(1); return "none" === d.css(e, m + "Style", !0) ? 0 : Math.round(parseFloat(d.css(e, m + "Width", !0)) || 0) }, isMouseOverElem: function (e, t) { var m = d(t || this), q = m.offset(), x = q.top, q = q.left, n = q + m.outerWidth(), m = x + m.outerHeight(), z = e.pageX, C = e.pageY; return d.layout.browser.msie && 0 > z && 0 > C || z >= q && z <= n && C >= x && C <= m }, msg: function (e, t, m, q) {
            d.isPlainObject(e) && window.debugData ?
                ("string" === typeof t ? (q = m, m = t) : "object" === typeof m && (q = m, m = null), m = m || "log( <object> )", q = d.extend({ sort: !1, returnHTML: !1, display: !1 }, q), !0 === t || q.display ? debugData(e, m, q) : window.console && console.log(debugData(e, m, q))) : t ? alert(e) : window.console ? console.log(e) : (t = d("#layoutLogger"), t.length || (t = d('<div id="layoutLogger" style="position: ' + (d.support.fixedPosition ? "fixed" : "absolute") + '; top: 5px; z-index: 999999; max-width: 25%; overflow: hidden; border: 1px solid #000; border-radius: 5px; background: #FBFBFB; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><div style="font-size: 13px; font-weight: bold; padding: 5px 10px; background: #F6F6F6; border-radius: 5px 5px 0 0; cursor: move;"><span style="float: right; padding-left: 7px; cursor: pointer;" title="Remove Console" onclick="$(this).closest(\'#layoutLogger\').remove()">X</span>Layout console.log</div><ul style="font-size: 13px; font-weight: none; list-style: none; margin: 0; padding: 0 0 2px;"></ul></div>').appendTo("body"),
                    t.css("left", d(window).width() - t.outerWidth() - 5), d.ui.draggable && t.draggable({ handle: ":first-child" })), t.children("ul").append('<li style="padding: 4px 10px; margin: 0; border-top: 1px solid #CCC;">' + e.replace(/\</g, "&lt;").replace(/\>/g, "&gt;") + "</li>"))
        }
    }; (function () {
        var e = navigator.userAgent.toLowerCase(), t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || 0 > e.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) ||
            [], e = t[1] || "", t = t[2] || 0, m = "msie" === e, q = document.compatMode, x = d.support, n = void 0 !== x.boxSizing ? x.boxSizing : x.boxSizingReliable, z = !m || !q || "CSS1Compat" === q || x.boxModel || !1, C = d.layout.browser = { version: t, safari: "webkit" === e, webkit: "chrome" === e, msie: m, isIE6: m && 6 == t, boxModel: z, boxSizing: !("function" === typeof n ? !n() : !n) }; e && (C[e] = !0); z || q || d(function () { C.boxModel = x.boxModel })
    })(); d.layout.defaults = {
        name: "", containerClass: "ui-layout-container", inset: null, scrollToBookmarkOnLoad: !0, resizeWithWindow: !0, resizeWithWindowDelay: 200,
        resizeWithWindowMaxDelay: 0, maskPanesEarly: !1, onresizeall_start: null, onresizeall_end: null, onload_start: null, onload_end: null, onunload_start: null, onunload_end: null, initPanes: !0, showErrorMessages: !0, showDebugMessages: !1, zIndex: null, zIndexes: { pane_normal: 0, content_mask: 1, resizer_normal: 2, pane_sliding: 100, pane_animate: 1E3, resizer_drag: 1E4 }, errors: {
            pane: "pane", selector: "selector", addButtonError: "Error Adding Button\nInvalid ", containerMissing: "UI Layout Initialization Error\nThe specified layout-container does not exist.",
            centerPaneMissing: "UI Layout Initialization Error\nThe center-pane element does not exist.\nThe center-pane is a required element.", noContainerHeight: "UI Layout Initialization Warning\nThe layout-container \"CONTAINER\" has no height.\nTherefore the layout is 0-height and hence 'invisible'!", callbackError: "UI Layout Callback Error\nThe EVENT callback is not a valid function."
        }, panes: {
            applyDemoStyles: !1, closable: !0, resizable: !0, slidable: !0, initClosed: !1, initHidden: !1, contentSelector: ".ui-layout-content",
            contentIgnoreSelector: ".ui-layout-ignore", findNestedContent: !1, paneClass: "ui-layout-pane", resizerClass: "ui-layout-resizer", togglerClass: "ui-layout-toggler", buttonClass: "ui-layout-button", minSize: 0, maxSize: 0, spacing_open: 6, spacing_closed: 6, togglerLength_open: 50, togglerLength_closed: 50, togglerAlign_open: "center", togglerAlign_closed: "center", togglerContent_open: "", togglerContent_closed: "", resizerDblClickToggle: !0, autoResize: !0, autoReopen: !0, resizerDragOpacity: 1, maskContents: !1, maskObjects: !1, maskZindex: null,
            resizingGrid: !1, livePaneResizing: !1, liveContentResizing: !1, liveResizingTolerance: 1, sliderCursor: "pointer", slideTrigger_open: "click", slideTrigger_close: "mouseleave", slideDelay_open: 300, slideDelay_close: 300, hideTogglerOnSlide: !1, preventQuickSlideClose: d.layout.browser.webkit, preventPrematureSlideClose: !1, tips: { Open: "Open", Close: "Close", Resize: "Resize", Slide: "Slide Open", Pin: "Pin", Unpin: "Un-Pin", noRoomToOpen: "Not enough room to show this panel.", minSizeWarning: "Panel has reached its minimum size", maxSizeWarning: "Panel has reached its maximum size" },
            showOverflowOnHover: !1, enableCursorHotkey: !0, customHotkeyModifier: "SHIFT", fxName: "slide", fxSpeed: null, fxSettings: {}, fxOpacityFix: !0, animatePaneSizing: !1, children: null, containerSelector: "", initChildren: !0, destroyChildren: !0, resizeChildren: !0, triggerEventsOnLoad: !1, triggerEventsDuringLiveResize: !0, onshow_start: null, onshow_end: null, onhide_start: null, onhide_end: null, onopen_start: null, onopen_end: null, onclose_start: null, onclose_end: null, onresize_start: null, onresize_end: null, onsizecontent_start: null, onsizecontent_end: null,
            onswap_start: null, onswap_end: null, ondrag_start: null, ondrag_end: null
        }, north: { paneSelector: ".ui-layout-north", size: "auto", resizerCursor: "n-resize", customHotkey: "" }, south: { paneSelector: ".ui-layout-south", size: "auto", resizerCursor: "s-resize", customHotkey: "" }, east: { paneSelector: ".ui-layout-east", size: 200, resizerCursor: "e-resize", customHotkey: "" }, west: { paneSelector: ".ui-layout-west", size: 200, resizerCursor: "w-resize", customHotkey: "" }, center: { paneSelector: ".ui-layout-center", minWidth: 0, minHeight: 0 }
    }; d.layout.optionsMap =
    {
        layout: "name instanceKey stateManagement effects inset zIndexes errors zIndex scrollToBookmarkOnLoad showErrorMessages maskPanesEarly outset resizeWithWindow resizeWithWindowDelay resizeWithWindowMaxDelay onresizeall onresizeall_start onresizeall_end onload onload_start onload_end onunload onunload_start onunload_end".split(" "), center: "paneClass contentSelector contentIgnoreSelector findNestedContent applyDemoStyles triggerEventsOnLoad showOverflowOnHover maskContents maskObjects liveContentResizing containerSelector children initChildren resizeChildren destroyChildren onresize onresize_start onresize_end onsizecontent onsizecontent_start onsizecontent_end".split(" "),
        noDefault: ["paneSelector", "resizerCursor", "customHotkey"]
    }; d.layout.transformData = function (e, t) { var m = t ? { panes: {}, center: {} } : {}, q, x, n, z, C, F, E; if ("object" !== typeof e) return m; for (x in e) for (q = m, C = e[x], n = x.split("__"), E = n.length - 1, F = 0; F <= E; F++)z = n[F], F === E ? d.isPlainObject(C) ? q[z] = d.layout.transformData(C) : q[z] = C : (q[z] || (q[z] = {}), q = q[z]); return m }; d.layout.backwardCompatibility = {
        map: {
            applyDefaultStyles: "applyDemoStyles", childOptions: "children", initChildLayout: "initChildren", destroyChildLayout: "destroyChildren",
            resizeChildLayout: "resizeChildren", resizeNestedLayout: "resizeChildren", resizeWhileDragging: "livePaneResizing", resizeContentWhileDragging: "liveContentResizing", triggerEventsWhileDragging: "triggerEventsDuringLiveResize", maskIframesOnResize: "maskContents", useStateCookie: "stateManagement.enabled", "cookie.autoLoad": "stateManagement.autoLoad", "cookie.autoSave": "stateManagement.autoSave", "cookie.keys": "stateManagement.stateKeys", "cookie.name": "stateManagement.cookie.name", "cookie.domain": "stateManagement.cookie.domain",
            "cookie.path": "stateManagement.cookie.path", "cookie.expires": "stateManagement.cookie.expires", "cookie.secure": "stateManagement.cookie.secure", noRoomToOpenTip: "tips.noRoomToOpen", togglerTip_open: "tips.Close", togglerTip_closed: "tips.Open", resizerTip: "tips.Resize", sliderTip: "tips.Slide"
        }, renameOptions: function (e) {
            function t(d, n) { for (var m = d.split("."), t = m.length - 1, q = { branch: e, key: m[t] }, r = 0, p; r < t; r++)p = m[r], q.branch = void 0 == q.branch[p] ? n ? q.branch[p] = {} : {} : q.branch[p]; return q } var m = d.layout.backwardCompatibility.map,
                q, x, n, z; for (z in m) q = t(z), n = q.branch[q.key], void 0 !== n && (x = t(m[z], !0), x.branch[x.key] = n, delete q.branch[q.key])
        }, renameAllOptions: function (e) { var t = d.layout.backwardCompatibility.renameOptions; t(e); e.defaults && ("object" !== typeof e.panes && (e.panes = {}), d.extend(!0, e.panes, e.defaults), delete e.defaults); e.panes && t(e.panes); d.each(d.layout.config.allPanes, function (d, q) { e[q] && t(e[q]) }); return e }
    }; d.fn.layout = function (e) {
        function t(a) {
            if (!a) return !0; var b = a.keyCode; if (33 > b) return !0; var c = {
                38: "north", 40: "south",
                37: "west", 39: "east"
            }, g = a.shiftKey, f = a.ctrlKey, u, h, l, k; f && 37 <= b && 40 >= b && r[c[b]].enableCursorHotkey ? k = c[b] : (f || g) && d.each(n.borderPanes, function (a, c) { u = r[c]; h = u.customHotkey; l = u.customHotkeyModifier; if ((g && "SHIFT" == l || f && "CTRL" == l || f && g) && h && b === (isNaN(h) || 9 >= h ? h.toUpperCase().charCodeAt(0) : h)) return k = c, !1 }); if (!k || !w[k] || !r[k].closable || p[k].isHidden) return !0; ca(k); a.stopPropagation(); return a.returnValue = !1
        } function m(a) {
            if (H()) {
                this && this.tagName && (a = this); var b; U(a) ? b = w[a] : d(a).data("layoutRole") ?
                    b = d(a) : d(a).parents().each(function () { if (d(this).data("layoutRole")) return b = d(this), !1 }); if (b && b.length) {
                        var c = b.data("layoutEdge"); a = p[c]; a.cssSaved && q(c); if (a.isSliding || a.isResizing || a.isClosed) a.cssSaved = !1; else {
                            var g = { zIndex: r.zIndexes.resizer_normal + 1 }, f = {}, u = b.css("overflow"), h = b.css("overflowX"), l = b.css("overflowY"); "visible" != u && (f.overflow = u, g.overflow = "visible"); h && !h.match(/(visible|auto)/) && (f.overflowX = h, g.overflowX = "visible"); l && !l.match(/(visible|auto)/) && (f.overflowY = h, g.overflowY =
                                "visible"); a.cssSaved = f; b.css(g); d.each(n.allPanes, function (a, b) { b != c && q(b) })
                        }
                    }
            }
        } function q(a) { if (H()) { this && this.tagName && (a = this); var b; U(a) ? b = w[a] : d(a).data("layoutRole") ? b = d(a) : d(a).parents().each(function () { if (d(this).data("layoutRole")) return b = d(this), !1 }); if (b && b.length) { a = b.data("layoutEdge"); a = p[a]; var c = a.cssSaved || {}; a.isSliding || a.isResizing || b.css("zIndex", r.zIndexes.pane_normal); b.css(c); a.cssSaved = !1 } } } var x = d.layout.browser, n = d.layout.config, z = d.layout.cssWidth, C = d.layout.cssHeight,
            F = d.layout.getElementDimensions, L = d.layout.getElementStyles, N = d.layout.getEventObject, A = d.layout.parsePaneName, r = d.extend(!0, {}, d.layout.defaults); r.effects = d.extend(!0, {}, d.layout.effects); var p = { id: "layout" + d.now(), initialized: !1, paneResizing: !1, panesSliding: {}, container: { innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0, layoutWidth: 0, layoutHeight: 0 }, north: { childIdx: 0 }, south: { childIdx: 0 }, east: { childIdx: 0 }, west: { childIdx: 0 }, center: { childIdx: 0 } }, R = { north: null, south: null, east: null, west: null, center: null },
                J = { data: {}, set: function (a, b, c) { J.clear(a); J.data[a] = setTimeout(b, c) }, clear: function (a) { var b = J.data; b[a] && (clearTimeout(b[a]), delete b[a]) } }, S = function (a, b, c) { var g = r; (g.showErrorMessages && !c || c && g.showDebugMessages) && d.layout.msg(g.name + " / " + a, !1 !== b); return !1 }, D = function (a, b, c) {
                    var g = b && U(b), f = g ? p[b] : p, u = g ? r[b] : r, h = r.name, l = a + (a.match(/_/) ? "" : "_end"), k = l.match(/_end$/) ? l.substr(0, l.length - 4) : "", s = u[l] || u[k], e = "NC", n = [], m = g ? w[b] : 0; if (g && !m) return e; g || "boolean" !== d.type(b) || (c = b, b = ""); if (s) try {
                        U(s) &&
                            (s.match(/,/) ? (n = s.split(","), s = eval(n[0])) : s = eval(s)), d.isFunction(s) && (e = n.length ? s(n[1]) : g ? s(b, w[b], f, u, h) : s(B, f, u, h))
                    } catch (t) { S(r.errors.callbackError.replace(/EVENT/, d.trim((b || "") + " " + l)), !1), "string" === d.type(t) && string.length && S("Exception:  " + t, !1) } c || !1 === e || (g ? (u = r[b], f = p[b], m.triggerHandler("layoutpane" + l, [b, m, f, u, h]), k && m.triggerHandler("layoutpane" + k, [b, m, f, u, h])) : (v.triggerHandler("layout" + l, [B, f, u, h]), k && v.triggerHandler("layout" + k, [B, f, u, h]))); g && "onresize_end" === a && Fa(b + "", !0);
                    return e
                }, Ga = function (a) { if (!x.mozilla) { var b = w[a]; "IFRAME" === p[a].tagName ? b.css(n.hidden).css(n.visible) : b.find("IFRAME").css(n.hidden).css(n.visible) } }, la = function (a) { var b = w[a]; a = n[a].dir; b = { minWidth: 1001 - z(b, 1E3), minHeight: 1001 - C(b, 1E3) }; "horz" === a && (b.minSize = b.minHeight); "vert" === a && (b.minSize = b.minWidth); return b }, Va = function (a, b, c) {
                    var g = a; U(a) ? g = w[a] : a.jquery || (g = d(a)); a = C(g, b); g.css({ height: a, visibility: "visible" }); 0 < a && 0 < g.innerWidth() ? c && g.data("autoHidden") && (g.show().data("autoHidden",
                        !1), x.mozilla || g.css(n.hidden).css(n.visible)) : c && !g.data("autoHidden") && g.hide().data("autoHidden", !0)
                }, V = function (a, b, c) {
                    c || (c = n[a].dir); U(b) && b.match(/%/) && (b = "100%" === b ? -1 : parseInt(b, 10) / 100); if (0 === b) return 0; if (1 <= b) return parseInt(b, 10); var g = r, f = 0; "horz" == c ? f = y.innerHeight - (w.north ? g.north.spacing_open : 0) - (w.south ? g.south.spacing_open : 0) : "vert" == c && (f = y.innerWidth - (w.west ? g.west.spacing_open : 0) - (w.east ? g.east.spacing_open : 0)); if (-1 === b) return f; if (0 < b) return ka(f * b); if ("center" == a) return 0;
                    c = "horz" === c ? "height" : "width"; g = w[a]; a = "height" === c ? M[a] : !1; var f = d.layout.showInvisibly(g), u = g.css(c), h = a ? a.css(c) : 0; g.css(c, "auto"); a && a.css(c, "auto"); b = "height" === c ? g.outerHeight() : g.outerWidth(); g.css(c, u).css(f); a && a.css(c, h); return b
                }, W = function (a, b) { var c = w[a], g = r[a], f = p[a], d = b ? g.spacing_open : 0, g = b ? g.spacing_closed : 0; return !c || f.isHidden ? 0 : f.isClosed || f.isSliding && b ? g : "horz" === n[a].dir ? c.outerHeight() + d : c.outerWidth() + d }, P = function (a, b) {
                    if (H()) {
                        var c = r[a], g = p[a], f = n[a], d = f.dir; f.sizeType.toLowerCase();
                        var f = void 0 != b ? b : g.isSliding, h = c.spacing_open, l = n.oppositeEdge[a], k = p[l], s = w[l], e = !s || !1 === k.isVisible || k.isSliding ? 0 : "horz" == d ? s.outerHeight() : s.outerWidth(), l = (!s || k.isHidden ? 0 : r[l][!1 !== k.isClosed ? "spacing_closed" : "spacing_open"]) || 0, k = "horz" == d ? y.innerHeight : y.innerWidth, s = la("center"), s = "horz" == d ? E(r.center.minHeight, s.minHeight) : E(r.center.minWidth, s.minWidth), f = k - h - (f ? 0 : V("center", s, d) + e + l), d = g.minSize = E(V(a, c.minSize), la(a).minSize), f = g.maxSize = ua(c.maxSize ? V(a, c.maxSize) : 1E5, f), g = g.resizerPosition =
                            {}, h = y.inset.top, e = y.inset.left, l = y.innerWidth, k = y.innerHeight, c = c.spacing_open; switch (a) { case "north": g.min = h + d; g.max = h + f; break; case "west": g.min = e + d; g.max = e + f; break; case "south": g.min = h + k - f - c; g.max = h + k - d - c; break; case "east": g.min = e + l - f - c, g.max = e + l - d - c }
                    }
                }, va = function (a, b) {
                    var c = d(a), g = c.data("layoutRole"), f = c.data("layoutEdge"), u = r[f][g + "Class"], f = "-" + f, h = c.hasClass(u + "-closed") ? "-closed" : "-open", l = "-closed" === h ? "-open" : "-closed", h = u + "-hover " + (u + f + "-hover ") + (u + h + "-hover ") + (u + f + h + "-hover "); b &&
                        (h += u + l + "-hover " + (u + f + l + "-hover ")); "resizer" == g && c.hasClass(u + "-sliding") && (h += u + "-sliding-hover " + (u + f + "-sliding-hover ")); return d.trim(h)
                }, wa = function (a, b) { var c = d(b || this); a && "toggler" === c.data("layoutRole") && a.stopPropagation(); c.addClass(va(c)) }, T = function (a, b) { var c = d(b || this); c.removeClass(va(c, !0)) }, Ha = function (a) { a = d(this).data("layoutEdge"); var b = p[a]; d(document); b.isResizing || p.paneResizing || r.maskPanesEarly && ia(a, { resizing: !0 }) }, Ia = function (a, b) {
                    var c = b || this, g = d(c).data("layoutEdge"),
                        f = g + "ResizerLeave"; d(document); J.clear(g + "_openSlider"); J.clear(f); b ? r.maskPanesEarly && !p.paneResizing && ma() : J.set(f, function () { Ia(a, c) }, 200)
                }, H = function () { return p.initialized || p.creatingLayout ? !0 : na() }, na = function (a) {
                    var b = r; if (!v.is(":visible")) return !a && x.webkit && "BODY" === v[0].tagName && setTimeout(function () { na(!0) }, 50), !1; if (!Ja("center").length) return S(b.errors.centerPaneMissing); p.creatingLayout = !0; d.extend(y, F(v, b.inset)); Wa(); b.scrollToBookmarkOnLoad && (a = self.location, a.hash && a.replace(a.hash));
                    B.hasParentLayout ? b.resizeWithWindow = !1 : b.resizeWithWindow && d(window).bind("resize." + I, Xa); delete p.creatingLayout; p.initialized = !0; ha(B, d.layout.onReady); D("onload_end"); return !0
                }, xa = function (a, b) {
                    var c = A.call(this, a), g = w[c]; if (g) {
                        var f = M[c], u = p[c], h = r[c], l = r.stateManagement || {}, h = b ? h.children = b : h.children; if (d.isPlainObject(h)) h = [h]; else if (!h || !d.isArray(h)) return; d.each(h, function (a, b) {
                            d.isPlainObject(b) && (b.containerSelector ? g.find(b.containerSelector) : f || g).each(function () {
                                var a = d(this), f = a.data("layout");
                                if (!f) { Ka({ container: a, options: b }, u); if (l.includeChildren && p.stateData[c]) { var f = (p.stateData[c].children || {})[b.instanceKey], g = b.stateManagement || (b.stateManagement = { autoLoad: !0 }); !0 === g.autoLoad && f && (g.autoSave = !1, g.includeChildren = !0, g.autoLoad = d.extend(!0, {}, f)) } (f = a.layout(b)) && oa(c, f) }
                            })
                        })
                    }
                }, Ka = function (a, b) {
                    var c = a.container, g = a.options, f = g.stateManagement, d = g.instanceKey || c.data("layoutInstanceKey"); d || (d = (f && f.cookie ? f.cookie.name : "") || g.name); d = d ? d.replace(/[^\w-]/gi, "_").replace(/_{2,}/g,
                        "_") : "layout" + ++b.childIdx; g.instanceKey = d; c.data("layoutInstanceKey", d); return d
                }, oa = function (a, b) { var c = w[a], g = R[a], f = p[a]; d.isPlainObject(g) && (d.each(g, function (a, b) { b.destroyed && delete g[a] }), d.isEmptyObject(g) && (g = R[a] = null)); b || g || (b = c.data("layout")); b && (b.hasParentLayout = !0, c = b.options, Ka(b, f), g || (g = R[a] = {}), g[c.instanceKey] = b.container.data("layout")); B[a].children = R[a]; b || xa(a) }, Xa = function () {
                    var a = r, b = Number(a.resizeWithWindowDelay); 10 > b && (b = 100); J.clear("winResize"); J.set("winResize",
                        function () { J.clear("winResize"); J.clear("winResizeRepeater"); var b = F(v, a.inset); b.innerWidth === y.innerWidth && b.innerHeight === y.innerHeight || da() }, b); J.data.winResizeRepeater || La()
                }, La = function () { var a = Number(r.resizeWithWindowMaxDelay); 0 < a && J.set("winResizeRepeater", function () { La(); da() }, a) }, Ma = function () { D("onunload_start"); ha(B, d.layout.onUnload); D("onunload_end") }, Na = function (a) {
                    a = a ? a.split(",") : n.borderPanes; d.each(a, function (a, c) {
                        var g = r[c]; if (g.enableCursorHotkey || g.customHotkey) return d(document).bind("keydown." +
                            I, t), !1
                    })
                }, Ya = function () {
                    function a(a) {
                        var b = r[a], c = r.panes; b.fxSettings || (b.fxSettings = {}); c.fxSettings || (c.fxSettings = {}); d.each(["_open", "_close", "_size"], function (f, g) {
                            var h = "fxName" + g, u = "fxSpeed" + g, l = "fxSettings" + g, e = b[h] = b[h] || c[h] || b.fxName || c.fxName || "none", p = d.effects && (d.effects[e] || d.effects.effect && d.effects.effect[e]); "none" !== e && r.effects[e] && p || (e = b[h] = "none"); e = r.effects[e] || {}; h = e.all || null; e = e[a] || null; b[u] = b[u] || c[u] || b.fxSpeed || c.fxSpeed || null; b[l] = d.extend(!0, {}, h, e, c.fxSettings,
                                b.fxSettings, c[l], b[l])
                        }); delete b.fxName; delete b.fxSpeed; delete b.fxSettings
                    } var b, c, g, f, u, h; e = d.layout.transformData(e, !0); e = d.layout.backwardCompatibility.renameAllOptions(e); if (!d.isEmptyObject(e.panes)) { b = d.layout.optionsMap.noDefault; f = 0; for (u = b.length; f < u; f++)g = b[f], delete e.panes[g]; b = d.layout.optionsMap.layout; f = 0; for (u = b.length; f < u; f++)g = b[f], delete e.panes[g] } b = d.layout.optionsMap.layout; var l = d.layout.config.optionRootKeys; for (g in e) f = e[g], 0 > d.inArray(g, l) && 0 > d.inArray(g, b) && (e.panes[g] ||
                        (e.panes[g] = d.isPlainObject(f) ? d.extend(!0, {}, f) : f), delete e[g]); d.extend(!0, r, e); d.each(n.allPanes, function (f, l) { n[l] = d.extend(!0, {}, n.panes, n[l]); c = r.panes; h = r[l]; if ("center" === l) for (b = d.layout.optionsMap.center, f = 0, u = b.length; f < u; f++)g = b[f], e.center[g] || !e.panes[g] && h[g] || (h[g] = c[g]); else h = r[l] = d.extend(!0, {}, c, h), a(l), h.resizerClass || (h.resizerClass = "ui-layout-resizer"), h.togglerClass || (h.togglerClass = "ui-layout-toggler"); h.paneClass || (h.paneClass = "ui-layout-pane") }); f = e.zIndex; l = r.zIndexes;
                    0 < f && (l.pane_normal = f, l.content_mask = E(f + 1, l.content_mask), l.resizer_normal = E(f + 2, l.resizer_normal)); delete r.panes
                }, Ja = function (a) { a = r[a].paneSelector; if ("#" === a.substr(0, 1)) return v.find(a).eq(0); var b = v.children(a).eq(0); return b.length ? b : v.children("form:first").children(a).eq(0) }, Wa = function (a) { A(a); d.each(n.allPanes, function (a, c) { Oa(c, !0) }); ya(); d.each(n.borderPanes, function (a, c) { w[c] && p[c].isVisible && (P(c), X(c)) }); Y("center"); d.each(n.allPanes, function (a, c) { Pa(c) }) }, Oa = function (a, b) {
                    if (b ||
                        H()) {
                        var c = r[a], g = p[a], f = n[a], d = f.dir, h = "center" === a, l = {}, k = w[a], e, ba; k ? za(a, !1, !0, !1) : M[a] = !1; k = w[a] = Ja(a); if (k.length) {
                            k.data("layoutCSS") || k.data("layoutCSS", L(k, "position,top,left,bottom,right,width,height,overflow,zIndex,display,backgroundColor,padding,margin,border")); B[a] = { name: a, pane: w[a], content: M[a], options: r[a], state: p[a], children: R[a] }; k.data({ parentLayout: B, layoutPane: B[a], layoutEdge: a, layoutRole: "pane" }).css(f.cssReq).css("zIndex", r.zIndexes.pane_normal).css(c.applyDemoStyles ? f.cssDemo :
                                {}).addClass(c.paneClass + " " + c.paneClass + "-" + a).bind("mouseenter." + I, wa).bind("mouseleave." + I, T); f = {
                                    hide: "", show: "", toggle: "", close: "", open: "", slideOpen: "", slideClose: "", slideToggle: "", size: "sizePane", sizePane: "sizePane", sizeContent: "", sizeHandles: "", enableClosable: "", disableClosable: "", enableSlideable: "", disableSlideable: "", enableResizable: "", disableResizable: "", swapPanes: "swapPanes", swap: "swapPanes", move: "swapPanes", removePane: "removePane", remove: "removePane", createChildren: "", resizeChildren: "",
                                    resizeAll: "resizeAll", resizeLayout: "resizeAll"
                                }; for (ba in f) k.bind("layoutpane" + ba.toLowerCase() + "." + I, B[f[ba] || ba]); Aa(a, !1); h || (e = g.size = V(a, c.size), h = V(a, c.minSize) || 1, ba = V(a, c.maxSize) || 1E5, 0 < e && (e = E(ua(e, ba), h)), g.autoResize = c.autoResize, g.isClosed = !1, g.isSliding = !1, g.isResizing = !1, g.isHidden = !1, g.pins || (g.pins = [])); g.tagName = k[0].tagName; g.edge = a; g.noRoom = !1; g.isVisible = !0; Qa(a); "horz" === d ? l.height = C(k, e) : "vert" === d && (l.width = z(k, e)); k.css(l); "horz" != d && Y(a, !0); p.initialized && (ya(a), Na(a));
                            c.initClosed && c.closable && !c.initHidden ? Z(a, !0, !0) : c.initHidden || c.initClosed ? Ba(a) : g.noRoom || k.css("display", "block"); k.css("visibility", "visible"); c.showOverflowOnHover && k.hover(m, q); p.initialized && Pa(a)
                        } else w[a] = !1
                    }
                }, Pa = function (a) { var b = w[a], c = p[a], g = r[a]; b && (b.data("layout") && oa(a, b.data("layout")), c.isVisible && (p.initialized ? da() : ea(a), g.triggerEventsOnLoad ? D("onresize_end", a) : Fa(a, !0)), g.initChildren && g.children && xa(a)) }, Qa = function (a) {
                    a = a ? a.split(",") : n.borderPanes; d.each(a, function (a, c) {
                        var g =
                            w[c], f = G[c], d = p[c], h = n[c].side, l = {}; if (g) { switch (c) { case "north": l.top = y.inset.top; l.left = y.inset.left; l.right = y.inset.right; break; case "south": l.bottom = y.inset.bottom; l.left = y.inset.left; l.right = y.inset.right; break; case "west": l.left = y.inset.left; break; case "east": l.right = y.inset.right }g.css(l); f && d.isClosed ? f.css(h, y.inset[h]) : f && !d.isHidden && f.css(h, y.inset[h] + W(c)) }
                    })
                }, ya = function (a) {
                    a = a ? a.split(",") : n.borderPanes; d.each(a, function (a, c) {
                        var g = w[c]; G[c] = !1; K[c] = !1; if (g) {
                            var g = r[c], f = p[c], u = "#" ===
                                g.paneSelector.substr(0, 1) ? g.paneSelector.substr(1) : "", h = g.resizerClass, l = g.togglerClass, k = "-" + c, e = B[c], m = e.resizer = G[c] = d("<div></div>"), e = e.toggler = g.closable ? K[c] = d("<div></div>") : !1; !f.isVisible && g.slidable && m.attr("title", g.tips.Slide).css("cursor", g.sliderCursor); m.attr("id", u ? u + "-resizer" : "").data({ parentLayout: B, layoutPane: B[c], layoutEdge: c, layoutRole: "resizer" }).css(n.resizers.cssReq).css("zIndex", r.zIndexes.resizer_normal).css(g.applyDemoStyles ? n.resizers.cssDemo : {}).addClass(h + " " + h + k).hover(wa,
                                    T).hover(Ha, Ia).mousedown(d.layout.disableTextSelection).mouseup(d.layout.enableTextSelection).appendTo(v); d.fn.disableSelection && m.disableSelection(); g.resizerDblClickToggle && m.bind("dblclick." + I, ca); e && (e.attr("id", u ? u + "-toggler" : "").data({ parentLayout: B, layoutPane: B[c], layoutEdge: c, layoutRole: "toggler" }).css(n.togglers.cssReq).css(g.applyDemoStyles ? n.togglers.cssDemo : {}).addClass(l + " " + l + k).hover(wa, T).bind("mouseenter", Ha).appendTo(m), g.togglerContent_open && d("<span>" + g.togglerContent_open + "</span>").data({
                                        layoutEdge: c,
                                        layoutRole: "togglerContent"
                                    }).data("layoutRole", "togglerContent").data("layoutEdge", c).addClass("content content-open").css("display", "none").appendTo(e), g.togglerContent_closed && d("<span>" + g.togglerContent_closed + "</span>").data({ layoutEdge: c, layoutRole: "togglerContent" }).addClass("content content-closed").css("display", "none").appendTo(e), Ra(c)); Za(c); f.isVisible ? Ca(c) : (pa(c), aa(c, !0))
                        }
                    }); fa()
                }, Aa = function (a, b) {
                    if (H()) {
                        var c = r[a], g = c.contentSelector, f = B[a], d = w[a], h; g && (h = f.content = M[a] = c.findNestedContent ?
                            d.find(g).eq(0) : d.children(g).eq(0)); h && h.length ? (h.data("layoutRole", "content"), h.data("layoutCSS") || h.data("layoutCSS", L(h, "height")), h.css(n.content.cssReq), c.applyDemoStyles && (h.css(n.content.cssDemo), d.css(n.content.cssDemoPane)), d.css("overflowX").match(/(scroll|auto)/) && d.css("overflow", "hidden"), p[a].content = {}, !1 !== b && ea(a)) : f.content = M[a] = !1
                    }
                }, Za = function (a) {
                    var b = d.layout.plugins.draggable; a = a ? a.split(",") : n.borderPanes; d.each(a, function (a, f) {
                        var u = r[f]; if (!b || !w[f] || !u.resizable) return u.resizable =
                            !1, !0; var h = p[f], e = r.zIndexes, k = n[f], s = "horz" == k.dir ? "top" : "left", m = G[f], O = u.resizerClass, t = 0, q, y, x = O + "-drag", z = O + "-" + f + "-drag", C = O + "-dragging", B = O + "-" + f + "-dragging", A = O + "-dragging-limit", E = O + "-" + f + "-dragging-limit", F = !1; h.isClosed || m.attr("title", u.tips.Resize).css("cursor", u.resizerCursor); m.draggable({
                                containment: v[0], axis: "horz" == k.dir ? "y" : "x", delay: 0, distance: 1, grid: u.resizingGrid, helper: "clone", opacity: u.resizerDragOpacity, addClasses: !1, zIndex: e.resizer_drag, start: function (a, b) {
                                    u = r[f]; h = p[f];
                                    y = u.livePaneResizing; if (!1 === D("ondrag_start", f)) return !1; h.isResizing = !0; p.paneResizing = f; J.clear(f + "_closeSlider"); P(f); q = h.resizerPosition; t = b.position[s]; m.addClass(x + " " + z); F = !1; ia(f, { resizing: !0 })
                                }, drag: function (a, b) {
                                    F || (b.helper.addClass(C + " " + B).css({ right: "auto", bottom: "auto" }).children().css("visibility", "hidden"), F = !0, h.isSliding && w[f].css("zIndex", e.pane_sliding)); var g = 0; b.position[s] < q.min ? (b.position[s] = q.min, g = -1) : b.position[s] > q.max && (b.position[s] = q.max, g = 1); g ? (b.helper.addClass(A +
                                        " " + E), window.defaultStatus = 0 < g && f.match(/(north|west)/) || 0 > g && f.match(/(south|east)/) ? u.tips.maxSizeWarning : u.tips.minSizeWarning) : (b.helper.removeClass(A + " " + E), window.defaultStatus = ""); y && Math.abs(b.position[s] - t) >= u.liveResizingTolerance && (t = b.position[s], c(a, b, f))
                                }, stop: function (a, b) { d("body").enableSelection(); window.defaultStatus = ""; m.removeClass(x + " " + z); h.isResizing = !1; p.paneResizing = !1; c(a, b, f, !0) }
                            })
                    }); var c = function (a, b, c, d) {
                        var e = b.position, k = n[c]; a = r[c]; b = p[c]; var s; switch (c) {
                            case "north": s =
                                e.top; break; case "west": s = e.left; break; case "south": s = y.layoutHeight - e.top - a.spacing_open; break; case "east": s = y.layoutWidth - e.left - a.spacing_open
                        }s -= y.inset[k.side]; d ? (!1 !== D("ondrag_end", c) && qa(c, s, !1, !0), ma(!0), b.isSliding && ia(c, { resizing: !0 })) : Math.abs(s - b.size) < a.liveResizingTolerance || (qa(c, s, !1, !0), Q.each(Sa))
                    }
                }, Sa = function () { var a = d(this), b = a.data("layoutMask"), b = p[b]; "IFRAME" == b.tagName && b.isVisible && a.css({ top: b.offsetTop, left: b.offsetLeft, width: b.outerWidth, height: b.outerHeight }) }, ia = function (a,
                    b) { var c = n[a], g = ["center"], f = r.zIndexes, u = d.extend({ objectsOnly: !1, animation: !1, resizing: !0, sliding: p[a].isSliding }, b), h, e; u.resizing && g.push(a); u.sliding && g.push(n.oppositeEdge[a]); "horz" === c.dir && (g.push("west"), g.push("east")); d.each(g, function (a, b) { e = p[b]; h = r[b]; e.isVisible && (h.maskObjects || !u.objectsOnly && h.maskContents) && $a(b).each(function () { Sa.call(this); this.style.zIndex = e.isSliding ? f.pane_sliding + 1 : f.pane_normal + 1; this.style.display = "block" }) }) }, ma = function (a) {
                        if (a || !p.paneResizing) Q.hide();
                        else if (!a && !d.isEmptyObject(p.panesSliding)) { a = Q.length - 1; for (var b, c; 0 <= a; a--)c = Q.eq(a), b = c.data("layoutMask"), r[b].maskObjects || c.hide() }
                    }, $a = function (a) {
                        for (var b = d([]), c, g = 0, f = Q.length; g < f; g++)c = Q.eq(g), c.data("layoutMask") === a && (b = b.add(c)); if (b.length) return b; b = w[a]; c = p[a]; var g = r[a], f = r.zIndexes, u, h, e, k, s; if (g.maskContents || g.maskObjects) {
                            for (s = 0; s < (g.maskObjects ? 2 : 1); s++)u = g.maskObjects && 0 == s, h = document.createElement(u ? "iframe" : "div"), e = d(h).data("layoutMask", a), h.className = "ui-layout-mask ui-layout-mask-" +
                                a, k = h.style, k.background = "#FFF", k.position = "absolute", k.display = "block", u ? (h.src = "about:blank", h.frameborder = 0, k.border = 0, k.opacity = 0, k.filter = "Alpha(Opacity='0')") : (k.opacity = .001, k.filter = "Alpha(Opacity='1')"), "IFRAME" == c.tagName ? (k.zIndex = f.pane_normal + 1, v.append(h)) : (e.addClass("ui-layout-mask-inside-pane"), k.zIndex = g.maskZindex || f.content_mask, k.top = 0, k.left = 0, k.width = "100%", k.height = "100%", b.append(h)), Q = Q.add(h); a = Q
                        } else a = d([]); return a
                    }, za = function (a, b, c, g) {
                        if (H()) {
                            a = A.call(this, a); var f =
                                w[a], u = M[a], h = G[a], e = K[a]; f && d.isEmptyObject(f.data()) && (f = !1); u && d.isEmptyObject(u.data()) && (u = !1); h && d.isEmptyObject(h.data()) && (h = !1); e && d.isEmptyObject(e.data()) && (e = !1); f && f.stop(!0, !0); var k = r[a], s = R[a], p = d.isPlainObject(s) && !d.isEmptyObject(s); g = void 0 !== g ? g : k.destroyChildren; p && g && (d.each(s, function (a, b) { b.destroyed || b.destroy(!0); b.destroyed && delete s[a] }), d.isEmptyObject(s) && (s = R[a] = null, p = !1)); f && b && !p ? f.remove() : f && f[0] && (b = k.paneClass, g = b + "-" + a, b = [b, b + "-open", b + "-closed", b + "-sliding",
                                    g, g + "-open", g + "-closed", g + "-sliding"], d.merge(b, va(f, !0)), f.removeClass(b.join(" ")).removeData("parentLayout").removeData("layoutPane").removeData("layoutRole").removeData("layoutEdge").removeData("autoHidden").unbind("." + I), p && u ? (u.width(u.width()), d.each(s, function (a, b) { b.resizeAll() })) : u && u.css(u.data("layoutCSS")).removeData("layoutCSS").removeData("layoutRole"), f.data("layout") || f.css(f.data("layoutCSS")).removeData("layoutCSS")); e && e.remove(); h && h.remove(); B[a] = w[a] = M[a] = G[a] = K[a] = !1; c || da()
                        }
                    },
                ra = function (a) { var b = w[a], c = b[0].style; r[a].useOffscreenClose ? (b.data(n.offscreenReset) || b.data(n.offscreenReset, { left: c.left, right: c.right }), b.css(n.offscreenCSS)) : b.hide().removeData(n.offscreenReset) }, Ta = function (a) { var b = w[a]; a = r[a]; var c = n.offscreenCSS, g = b.data(n.offscreenReset), f = b[0].style; b.show().removeData(n.offscreenReset); a.useOffscreenClose && g && (f.left == c.left && (f.left = g.left), f.right == c.right && (f.right = g.right)) }, Ba = function (a, b) {
                    if (H()) {
                        var c = A.call(this, a), g = r[c], f = p[c], d = w[c], h = G[c];
                        "center" === c || !d || f.isHidden || p.initialized && !1 === D("onhide_start", c) || (f.isSliding = !1, delete p.panesSliding[c], h && h.hide(), !p.initialized || f.isClosed ? (f.isClosed = !0, f.isHidden = !0, f.isVisible = !1, p.initialized || ra(c), Y("horz" === n[c].dir ? "" : "center"), (p.initialized || g.triggerEventsOnLoad) && D("onhide_end", c)) : (f.isHiding = !0, Z(c, !1, b)))
                    }
                }, sa = function (a, b, c, g) {
                    if (H()) {
                        a = A.call(this, a); var f = p[a], d = w[a]; "center" !== a && d && f.isHidden && !1 !== D("onshow_start", a) && (f.isShowing = !0, f.isSliding = !1, delete p.panesSliding[a],
                            !1 === b ? Z(a, !0) : ga(a, !1, c, g))
                    }
                }, ca = function (a, b) { if (H()) { var c = N(a), g = A.call(this, a), f = p[g]; c && c.stopImmediatePropagation(); f.isHidden ? sa(g) : f.isClosed ? ga(g, !!b) : Z(g) } }, ab = function (a, b) { var c = p[a]; ra(a); c.isClosed = !0; c.isVisible = !1; b && pa(a) }, Z = function (a, b, c, g) {
                    function f() { k.isMoving = !1; aa(d, !0); var a = n.oppositeEdge[d]; p[a].noRoom && (P(a), X(a)); g || !p.initialized && !e.triggerEventsOnLoad || (m || D("onclose_end", d), m && D("onshow_end", d), O && D("onhide_end", d)) } var d = A.call(this, a); if ("center" !== d) if (!p.initialized &&
                        w[d]) ab(d, !0); else if (H()) {
                            var h = w[d], e = r[d], k = p[d], s, m, O; v.queue(function (a) {
                                if (!h || !e.closable && !k.isShowing && !k.isHiding || !b && k.isClosed && !k.isShowing) return a(); var g = !k.isShowing && !1 === D("onclose_start", d); m = k.isShowing; O = k.isHiding; delete k.isShowing; delete k.isHiding; if (g) return a(); s = !c && !k.isClosed && "none" != e.fxName_close; k.isMoving = !0; k.isClosed = !0; k.isVisible = !1; O ? k.isHidden = !0 : m && (k.isHidden = !1); k.isSliding ? ja(d, !1) : Y("horz" === n[d].dir ? "" : "center", !1); pa(d); s ? (ta(d, !0), h.hide(e.fxName_close,
                                    e.fxSettings_close, e.fxSpeed_close, function () { ta(d, !1); k.isClosed && f(); a() })) : (ra(d), f(), a())
                            })
                        }
                }, pa = function (a) {
                    if (G[a]) {
                        var b = G[a], c = K[a], g = r[a], f = p[a], e = n[a].side, h = g.resizerClass, l = g.togglerClass, k = "-" + a; b.css(e, y.inset[e]).removeClass(h + "-open " + h + k + "-open").removeClass(h + "-sliding " + h + k + "-sliding").addClass(h + "-closed " + h + k + "-closed"); f.isHidden && b.hide(); g.resizable && d.layout.plugins.draggable && b.draggable("disable").removeClass("ui-state-disabled").css("cursor", "default").attr("title", "");
                        c && (c.removeClass(l + "-open " + l + k + "-open").addClass(l + "-closed " + l + k + "-closed").attr("title", g.tips.Open), c.children(".content-open").hide(), c.children(".content-closed").css("display", "block")); Da(a, !1); p.initialized && fa()
                    }
                }, ga = function (a, b, c, d) {
                    function f() { k.isMoving = !1; Ga(e); k.isSliding || Y("vert" == n[e].dir ? "center" : "", !1); Ca(e) } if (H()) {
                        var e = A.call(this, a), h = w[e], l = r[e], k = p[e], s, m; "center" !== e && v.queue(function (a) {
                            if (!h || !l.resizable && !l.closable && !k.isShowing || k.isVisible && !k.isSliding) return a();
                            if (k.isHidden && !k.isShowing) a(), sa(e, !0); else {
                                k.autoResize && k.size != l.size ? $(e, l.size, !0, !0, !0) : P(e, b); var p = D("onopen_start", e); if ("abort" === p) return a(); "NC" !== p && P(e, b); if (k.minSize > k.maxSize) return Da(e, !1), !d && l.tips.noRoomToOpen && alert(l.tips.noRoomToOpen), a(); b ? ja(e, !0) : k.isSliding ? ja(e, !1) : l.slidable && aa(e, !1); k.noRoom = !1; X(e); m = k.isShowing; delete k.isShowing; s = !c && k.isClosed && "none" != l.fxName_open; k.isMoving = !0; k.isVisible = !0; k.isClosed = !1; m && (k.isHidden = !1); s ? (ta(e, !0), h.show(l.fxName_open,
                                    l.fxSettings_open, l.fxSpeed_open, function () { ta(e, !1); k.isVisible && f(); a() })) : (Ta(e), f(), a())
                            }
                        })
                    }
                }, Ca = function (a, b) {
                    var c = w[a], g = G[a], f = K[a], e = r[a], h = p[a], l = n[a].side, k = e.resizerClass, s = e.togglerClass, m = "-" + a; g.css(l, y.inset[l] + W(a)).removeClass(k + "-closed " + k + m + "-closed").addClass(k + "-open " + k + m + "-open"); h.isSliding ? g.addClass(k + "-sliding " + k + m + "-sliding") : g.removeClass(k + "-sliding " + k + m + "-sliding"); T(0, g); e.resizable && d.layout.plugins.draggable ? g.draggable("enable").css("cursor", e.resizerCursor).attr("title",
                        e.tips.Resize) : h.isSliding || g.css("cursor", "default"); f && (f.removeClass(s + "-closed " + s + m + "-closed").addClass(s + "-open " + s + m + "-open").attr("title", e.tips.Close), T(0, f), f.children(".content-closed").hide(), f.children(".content-open").css("display", "block")); Da(a, !h.isSliding); d.extend(h, F(c)); p.initialized && (fa(), ea(a, !0)); !b && (p.initialized || e.triggerEventsOnLoad) && c.is(":visible") && (D("onopen_end", a), h.isShowing && D("onshow_end", a), p.initialized && D("onresize_end", a))
                }, Ua = function (a) {
                    function b() {
                        f.isClosed ?
                            f.isMoving || ga(d, !0) : ja(d, !0)
                    } if (H()) { var c = N(a), d = A.call(this, a), f = p[d]; a = r[d].slideDelay_open; "center" !== d && (c && c.stopImmediatePropagation(), f.isClosed && c && "mouseenter" === c.type && 0 < a ? J.set(d + "_openSlider", b, a) : b()) }
                }, Ea = function (a) {
                    function b() { f.isClosed ? ja(g, !1) : f.isMoving || Z(g) } if (H()) {
                        var c = N(a), g = A.call(this, a); a = r[g]; var f = p[g], e = f.isMoving ? 1E3 : 300; "center" === g || f.isClosed || f.isResizing || ("click" === a.slideTrigger_close ? b() : a.preventQuickSlideClose && f.isMoving || a.preventPrematureSlideClose &&
                            c && d.layout.isMouseOverElem(c, w[g]) || (c ? J.set(g + "_closeSlider", b, E(a.slideDelay_close, e)) : b()))
                    }
                }, ta = function (a, b) {
                    var c = w[a], d = p[a], f = r[a], e = r.zIndexes; b ? (ia(a, { animation: !0, objectsOnly: !0 }), c.css({ zIndex: e.pane_animate }), "south" == a ? c.css({ top: y.inset.top + y.innerHeight - c.outerHeight() }) : "east" == a && c.css({ left: y.inset.left + y.innerWidth - c.outerWidth() })) : (ma(), c.css({ zIndex: d.isSliding ? e.pane_sliding : e.pane_normal }), "south" == a ? c.css({ top: "auto" }) : "east" != a || c.css("left").match(/\-99999/) || c.css({ left: "auto" }),
                        x.msie && f.fxOpacityFix && "slide" != f.fxName_open && c.css("filter") && 1 == c.css("opacity") && c[0].style.removeAttribute("filter"))
                }, aa = function (a, b) {
                    var c = r[a], d = G[a], f = c.slideTrigger_open.toLowerCase(); if (d && (!b || c.slidable)) {
                        f.match(/mouseover/) ? f = c.slideTrigger_open = "mouseenter" : f.match(/(click|dblclick|mouseenter)/) || (f = c.slideTrigger_open = "click"); if (c.resizerDblClickToggle && f.match(/click/)) d[b ? "unbind" : "bind"]("dblclick." + I, ca); d[b ? "bind" : "unbind"](f + "." + I, Ua).css("cursor", b ? c.sliderCursor : "default").attr("title",
                            b ? c.tips.Slide : "")
                    }
                }, ja = function (a, b) {
                    function c(b) { J.clear(a + "_closeSlider"); b.stopPropagation() } var d = r[a], f = p[a], e = r.zIndexes, h = d.slideTrigger_close.toLowerCase(), l = b ? "bind" : "unbind", k = w[a], s = G[a]; J.clear(a + "_closeSlider"); b ? (f.isSliding = !0, p.panesSliding[a] = !0, aa(a, !1)) : (f.isSliding = !1, delete p.panesSliding[a]); k.css("zIndex", b ? e.pane_sliding : e.pane_normal); s.css("zIndex", b ? e.pane_sliding + 2 : e.resizer_normal); h.match(/(click|mouseleave)/) || (h = d.slideTrigger_close = "mouseleave"); s[l](h, Ea); "mouseleave" ===
                        h && (k[l]("mouseleave." + I, Ea), s[l]("mouseenter." + I, c), k[l]("mouseenter." + I, c)); b ? "click" !== h || d.resizable || (s.css("cursor", b ? d.sliderCursor : "default"), s.attr("title", b ? d.tips.Close : "")) : J.clear(a + "_closeSlider")
                }, X = function (a, b, c, g) {
                    b = r[a]; var f = p[a], e = n[a], h = w[a], l = G[a], k = "vert" === e.dir, s = !1; if ("center" === a || k && f.noVerticalRoom) (s = 0 <= f.maxHeight) && f.noRoom ? (Ta(a), l && l.show(), f.isVisible = !0, f.noRoom = !1, k && (f.noVerticalRoom = !1), Ga(a)) : s || f.noRoom || (ra(a), l && l.hide(), f.isVisible = !1, f.noRoom = !0); "center" !==
                        a && (f.minSize <= f.maxSize ? (f.size > f.maxSize ? $(a, f.maxSize, c, !0, g) : f.size < f.minSize ? $(a, f.minSize, c, !0, g) : l && f.isVisible && h.is(":visible") && (c = f.size + y.inset[e.side], d.layout.cssNum(l, e.side) != c && l.css(e.side, c)), f.noRoom && (f.wasOpen && b.closable ? b.autoReopen ? ga(a, !1, !0, !0) : f.noRoom = !1 : sa(a, f.wasOpen, !0, !0))) : f.noRoom || (f.noRoom = !0, f.wasOpen = !f.isClosed && !f.isSliding, f.isClosed || (b.closable ? Z(a, !0, !0) : Ba(a, !0))))
                }, qa = function (a, b, c, d, f) {
                    if (H()) {
                        a = A.call(this, a); var e = r[a], h = p[a]; f = f || e.livePaneResizing &&
                            !h.isResizing; "center" !== a && (h.autoResize = !1, $(a, b, c, d, f))
                    }
                }, $ = function (a, b, c, g, f) {
                    function e() {
                        for (var a = "width" === q ? s.outerWidth() : s.outerHeight(), a = [{ pane: h, count: 1, target: b, actual: a, correct: b === a, attempt: b, cssSize: J }], g = a[0], l = {}, u = "Inaccurate size after resizing the " + h + "-pane."; !g.correct;) {
                            l = { pane: h, count: g.count + 1, target: b }; l.attempt = g.actual > b ? E(0, g.attempt - (g.actual - b)) : E(0, g.attempt + (b - g.actual)); l.cssSize = ("horz" == n[h].dir ? C : z)(w[h], l.attempt); s.css(q, l.cssSize); l.actual = "width" == q ? s.outerWidth() :
                                s.outerHeight(); l.correct = b === l.actual; 1 === a.length && (S(u, !1, !0), S(g, !1, !0)); S(l, !1, !0); if (3 < a.length) break; a.push(l); g = a[a.length - 1]
                        } k.size = b; d.extend(k, F(s)); k.isVisible && s.is(":visible") && (m && m.css(t, b + y.inset[t]), ea(h)); !c && !x && p.initialized && k.isVisible && D("onresize_end", h); c || (k.isSliding || Y("horz" == n[h].dir ? "" : "center", x, f), fa()); g = n.oppositeEdge[h]; b < I && p[g].noRoom && (P(g), X(g, !1, c)); 1 < a.length && S(u + "\nSee the Error Console for details.", !0, !0)
                    } if (H()) {
                        var h = A.call(this, a), l = r[h], k = p[h], s =
                            w[h], m = G[h], t = n[h].side, q = n[h].sizeType.toLowerCase(), x = k.isResizing && !l.triggerEventsDuringLiveResize, B = !0 !== g && l.animatePaneSizing, I, J; "center" !== h && v.queue(function (a) {
                                P(h); I = k.size; b = V(h, b); b = E(b, V(h, l.minSize)); b = ua(b, k.maxSize); if (b < k.minSize) a(), X(h, !1, c); else {
                                    if (!f && b === I) return a(); k.newSize = b; !c && p.initialized && k.isVisible && D("onresize_start", h); J = ("horz" == n[h].dir ? C : z)(w[h], b); if (B && s.is(":visible")) {
                                        var g = d.layout.effects.size[h] || d.layout.effects.size.all, g = l.fxSettings_size.easing ||
                                            g.easing, m = r.zIndexes, t = {}; t[q] = J + "px"; k.isMoving = !0; s.css({ zIndex: m.pane_animate }).show().animate(t, l.fxSpeed_size, g, function () { s.css({ zIndex: k.isSliding ? m.pane_sliding : m.pane_normal }); k.isMoving = !1; delete k.newSize; e(); a() })
                                    } else s.css(q, J), delete k.newSize, s.is(":visible") ? e() : k.size = b, a()
                                }
                            })
                    }
                }, Y = function (a, b, c) {
                    a = (a ? a : "east,west,center").split(","); d.each(a, function (a, f) {
                        if (w[f]) {
                            var e = r[f], h = p[f], l = w[f], k = !0, s = {}, m = d.layout.showInvisibly(l), n = {
                                top: W("north", !0), bottom: W("south", !0), left: W("west",
                                    !0), right: W("east", !0), width: 0, height: 0
                            }; n.width = y.innerWidth - n.left - n.right; n.height = y.innerHeight - n.bottom - n.top; n.top += y.inset.top; n.bottom += y.inset.bottom; n.left += y.inset.left; n.right += y.inset.right; d.extend(h, F(l)); if ("center" === f) {
                                if (!c && h.isVisible && n.width === h.outerWidth && n.height === h.outerHeight) return l.css(m), !0; d.extend(h, la(f), { maxWidth: n.width, maxHeight: n.height }); s = n; h.newWidth = s.width; h.newHeight = s.height; s.width = z(l, s.width); s.height = C(l, s.height); k = 0 <= s.width && 0 <= s.height; if (!p.initialized &&
                                    e.minWidth > n.width) { var e = e.minWidth - h.outerWidth, n = r.east.minSize || 0, t = r.west.minSize || 0, q = p.east.size, v = p.west.size, B = q, A = v; 0 < e && p.east.isVisible && q > n && (B = E(q - n, q - e), e -= q - B); 0 < e && p.west.isVisible && v > t && (A = E(v - t, v - e), e -= v - A); if (0 === e) { q && q != n && $("east", B, !0, !0, c); v && v != t && $("west", A, !0, !0, c); Y("center", b, c); l.css(m); return } }
                            } else {
                                h.isVisible && !h.noVerticalRoom && d.extend(h, F(l), la(f)); if (!c && !h.noVerticalRoom && n.height === h.outerHeight) return l.css(m), !0; s.top = n.top; s.bottom = n.bottom; h.newSize = n.height;
                                s.height = C(l, n.height); h.maxHeight = s.height; k = 0 <= h.maxHeight; k || (h.noVerticalRoom = !0)
                            } k ? (!b && p.initialized && D("onresize_start", f), l.css(s), "center" !== f && fa(f), !h.noRoom || h.isClosed || h.isHidden || X(f), h.isVisible && (d.extend(h, F(l)), p.initialized && ea(f))) : !h.noRoom && h.isVisible && X(f); l.css(m); delete h.newSize; delete h.newWidth; delete h.newHeight; if (!h.isVisible) return !0; "center" === f && (h = x.isIE6 || !x.boxModel, w.north && (h || "IFRAME" == p.north.tagName) && w.north.css("width", z(w.north, y.innerWidth)), w.south &&
                                (h || "IFRAME" == p.south.tagName) && w.south.css("width", z(w.south, y.innerWidth))); !b && p.initialized && D("onresize_end", f)
                        }
                    })
                }, da = function (a) {
                    A(a); if (v.is(":visible")) if (p.initialized) {
                        if (!0 === a && d.isPlainObject(r.outset) && v.css(r.outset), d.extend(y, F(v, r.inset)), y.outerHeight) {
                            !0 === a && Qa(); if (!1 === D("onresizeall_start")) return !1; var b, c, g; d.each(["south", "north", "east", "west"], function (a, b) { w[b] && (c = r[b], g = p[b], g.autoResize && g.size != c.size ? $(b, c.size, !0, !0, !0) : (P(b), X(b, !1, !0, !0))) }); Y("", !0, !0); fa();
                            d.each(n.allPanes, function (a, c) { (b = w[c]) && p[c].isVisible && D("onresize_end", c) }); D("onresizeall_end")
                        }
                    } else na()
                }, Fa = function (a, b) { var c = A.call(this, a); r[c].resizeChildren && (b || oa(c), c = R[c], d.isPlainObject(c) && d.each(c, function (a, b) { b.destroyed || b.resizeAll() })) }, ea = function (a, b) {
                    if (H()) {
                        var c = A.call(this, a), c = c ? c.split(",") : n.allPanes; d.each(c, function (a, c) {
                            function d(a) { return E(m.css.paddingBottom, parseInt(a.css("marginBottom"), 10) || 0) } function e() {
                                var a = r[c].contentIgnoreSelector, a = k.nextAll().not(".ui-layout-mask").not(a ||
                                    ":lt(0)"), b = a.filter(":visible"), g = b.filter(":last"); q = { top: k[0].offsetTop, height: k.outerHeight(), numFooters: a.length, hiddenFooters: a.length - b.length, spaceBelow: 0 }; q.spaceAbove = q.top; q.bottom = q.top + q.height; q.spaceBelow = g.length ? g[0].offsetTop + g.outerHeight() - q.bottom + d(g) : d(k)
                            } var l = w[c], k = M[c], n = r[c], m = p[c], q = m.content; if (!l || !k || !l.is(":visible")) return !0; if (!k.length && (Aa(c, !1), !k)) return; if (!1 !== D("onsizecontent_start", c)) {
                                if (!m.isMoving && !m.isResizing || n.liveContentResizing || b || void 0 == q.top) e(),
                                    0 < q.hiddenFooters && "hidden" === l.css("overflow") && (l.css("overflow", "visible"), e(), l.css("overflow", "hidden")); l = m.innerHeight - (q.spaceAbove - m.css.paddingTop) - (q.spaceBelow - m.css.paddingBottom); k.is(":visible") && q.height == l || (Va(k, l, !0), q.height = l); p.initialized && D("onsizecontent_end", c)
                            }
                        })
                    }
                }, fa = function (a) {
                    a = (a = A.call(this, a)) ? a.split(",") : n.borderPanes; d.each(a, function (a, c) {
                        var g = r[c], f = p[c], e = w[c], h = G[c], l = K[c], k; if (e && h) {
                            var m = n[c].dir, q = f.isClosed ? "_closed" : "_open", t = g["spacing" + q], v = g["togglerAlign" +
                                q], q = g["togglerLength" + q], x; if (0 === t) h.hide(); else {
                                    f.noRoom || f.isHidden || h.show(); "horz" === m ? (x = y.innerWidth, f.resizerLength = x, e = d.layout.cssNum(e, "left"), h.css({ width: z(h, x), height: C(h, t), left: -9999 < e ? e : y.inset.left })) : (x = e.outerHeight(), f.resizerLength = x, h.css({ height: C(h, x), width: z(h, t), top: y.inset.top + W("north", !0) })); T(g, h); if (l) {
                                        if (0 === q || f.isSliding && g.hideTogglerOnSlide) { l.hide(); return } l.show(); if (!(0 < q) || "100%" === q || q > x) q = x, v = 0; else if (U(v)) switch (v) {
                                            case "top": case "left": v = 0; break; case "bottom": case "right": v =
                                                x - q; break; default: v = ka((x - q) / 2)
                                        } else e = parseInt(v, 10), v = 0 <= v ? e : x - q + e; if ("horz" === m) { var B = z(l, q); l.css({ width: B, height: C(l, t), left: v, top: 0 }); l.children(".content").each(function () { k = d(this); k.css("marginLeft", ka((B - k.outerWidth()) / 2)) }) } else { var A = C(l, q); l.css({ height: A, width: z(l, t), top: v, left: 0 }); l.children(".content").each(function () { k = d(this); k.css("marginTop", ka((A - k.outerHeight()) / 2)) }) } T(0, l)
                                    } p.initialized || !g.initHidden && !f.isHidden || (h.hide(), l && l.hide())
                                }
                        }
                    })
                }, Ra = function (a) {
                    if (H()) {
                        var b =
                            A.call(this, a); a = K[b]; var c = r[b]; a && (c.closable = !0, a.bind("click." + I, function (a) { a.stopPropagation(); ca(b) }).css("visibility", "visible").css("cursor", "pointer").attr("title", p[b].isClosed ? c.tips.Open : c.tips.Close).show())
                    }
                }, Da = function (a, b) { d.layout.plugins.buttons && d.each(p[a].pins, function (c, g) { d.layout.buttons.setPinState(B, d(g), a, b) }) }, v = d(this).eq(0); if (!v.length) return S(r.errors.containerMissing); if (v.data("layoutContainer") && v.data("layout")) return v.data("layout"); var w = {}, M = {}, G = {}, K = {},
                    Q = d([]), y = p.container, I = p.id, B = {
                        options: r, state: p, container: v, panes: w, contents: M, resizers: G, togglers: K, hide: Ba, show: sa, toggle: ca, open: ga, close: Z, slideOpen: Ua, slideClose: Ea, slideToggle: function (a) { a = A.call(this, a); ca(a, !0) }, setSizeLimits: P, _sizePane: $, sizePane: qa, sizeContent: ea, swapPanes: function (a, b) {
                            function c(a) { var b = w[a], c = M[a]; return b ? { pane: a, P: b ? b[0] : !1, C: c ? c[0] : !1, state: d.extend(!0, {}, p[a]), options: d.extend(!0, {}, r[a]) } : !1 } function g(a, b) {
                                if (a) {
                                    var c = a.P, f = a.C, e = a.pane, g = n[b], h = d.extend(!0,
                                        {}, p[b]), m = r[b], q = { resizerCursor: m.resizerCursor }; d.each(["fxName", "fxSpeed", "fxSettings"], function (a, b) { q[b + "_open"] = m[b + "_open"]; q[b + "_close"] = m[b + "_close"]; q[b + "_size"] = m[b + "_size"] }); w[b] = d(c).data({ layoutPane: B[b], layoutEdge: b }).css(n.hidden).css(g.cssReq); M[b] = f ? d(f) : !1; r[b] = d.extend(!0, {}, a.options, q); p[b] = d.extend(!0, {}, a.state); c.className = c.className.replace(new RegExp(m.paneClass + "-" + e, "g"), m.paneClass + "-" + b); ya(b); g.dir != n[e].dir ? (c = l[b] || 0, P(b), c = E(c, p[b].minSize), qa(b, c, !0, !0)) : G[b].css(g.side,
                                            y.inset[g.side] + (p[b].isVisible ? W(b) : 0)); a.state.isVisible && !h.isVisible ? Ca(b, !0) : (pa(b), aa(b, !0)); a = null
                                }
                            } if (H()) {
                                var f = A.call(this, a); p[f].edge = b; p[b].edge = f; if (!1 === D("onswap_start", f) || !1 === D("onswap_start", b)) p[f].edge = f, p[b].edge = b; else {
                                    var e = c(f), h = c(b), l = {}; l[f] = e ? e.state.size : 0; l[b] = h ? h.state.size : 0; w[f] = !1; w[b] = !1; p[f] = {}; p[b] = {}; K[f] && K[f].remove(); K[b] && K[b].remove(); G[f] && G[f].remove(); G[b] && G[b].remove(); G[f] = G[b] = K[f] = K[b] = !1; g(e, b); g(h, f); e = h = l = null; w[f] && w[f].css(n.visible); w[b] &&
                                        w[b].css(n.visible); da(); D("onswap_end", f); D("onswap_end", b)
                                }
                            }
                        }, showMasks: ia, hideMasks: ma, initContent: Aa, addPane: Oa, removePane: za, createChildren: xa, refreshChildren: oa, enableClosable: Ra, disableClosable: function (a, b) { if (H()) { var c = A.call(this, a), d = K[c]; d && (r[c].closable = !1, p[c].isClosed && ga(c, !1, !0), d.unbind("." + I).css("visibility", b ? "hidden" : "visible").css("cursor", "default").attr("title", "")) } }, enableSlidable: function (a) {
                            if (H()) {
                                a = A.call(this, a); var b = G[a]; b && b.data("draggable") && (r[a].slidable = !0,
                                    p[a].isClosed && aa(a, !0))
                            }
                        }, disableSlidable: function (a) { if (H()) { a = A.call(this, a); var b = G[a]; b && (r[a].slidable = !1, p[a].isSliding ? Z(a, !1, !0) : (aa(a, !1), b.css("cursor", "default").attr("title", ""), T(null, b[0]))) } }, enableResizable: function (a) { if (H()) { a = A.call(this, a); var b = G[a], c = r[a]; b && b.data("draggable") && (c.resizable = !0, b.draggable("enable"), p[a].isClosed || b.css("cursor", c.resizerCursor).attr("title", c.tips.Resize)) } }, disableResizable: function (a) {
                            if (H()) {
                                a = A.call(this, a); var b = G[a]; b && b.data("draggable") &&
                                    (r[a].resizable = !1, b.draggable("disable").css("cursor", "default").attr("title", ""), T(null, b[0]))
                            }
                        }, allowOverflow: m, resetOverflow: q, destroy: function (a, b) {
                            d(window).unbind("." + I); d(document).unbind("." + I); "object" === typeof a ? A(a) : b = a; v.clearQueue().removeData("layout").removeData("layoutContainer").removeClass(r.containerClass).unbind("." + I); Q.remove(); d.each(n.allPanes, function (a, c) { za(c, !1, !0, b) }); v.data("layoutCSS") && !v.data("layoutRole") && v.css(v.data("layoutCSS")).removeData("layoutCSS"); "BODY" ===
                                y.tagName && (v = d("html")).data("layoutCSS") && v.css(v.data("layoutCSS")).removeData("layoutCSS"); ha(B, d.layout.onDestroy); Ma(); for (var c in B) c.match(/^(container|options)$/) || delete B[c]; B.destroyed = !0; return B
                        }, initPanes: H, resizeAll: da, runCallbacks: D, hasParentLayout: !1, children: R, north: !1, south: !1, west: !1, east: !1, center: !1
                    }; return "cancel" === function () {
                        Ya(); var a = r, b = p; b.creatingLayout = !0; ha(B, d.layout.onCreate); if (!1 === D("onload_start")) return "cancel"; var c = v[0], e = d("html"), f = y.tagName = c.tagName,
                            m = y.id = c.id, h = y.className = c.className, c = r, l = c.name, k = {}, n = v.data("parentLayout"), q = v.data("layoutEdge"), t = n && q, w = d.layout.cssNum, z; y.selector = v.selector.split(".slice")[0]; y.ref = (c.name ? c.name + " layout / " : "") + f + (m ? "#" + m : h ? ".[" + h + "]" : ""); y.isBody = "BODY" === f; t || y.isBody || (f = v.closest("." + d.layout.defaults.panes.paneClass), n = f.data("parentLayout"), q = f.data("layoutEdge"), t = n && q); v.data({ layout: B, layoutContainer: I }).addClass(c.containerClass); f = { destroy: "", initPanes: "", resizeAll: "resizeAll", resize: "resizeAll" };
                        for (l in f) v.bind("layout" + l.toLowerCase() + "." + I, B[f[l] || l]); t && (B.hasParentLayout = !0, n.refreshChildren(q, B)); v.data("layoutCSS") || (y.isBody ? (v.data("layoutCSS", d.extend(L(v, "position,margin,padding,border"), { height: v.css("height"), overflow: v.css("overflow"), overflowX: v.css("overflowX"), overflowY: v.css("overflowY") })), e.data("layoutCSS", d.extend(L(e, "padding"), { height: "auto", overflow: e.css("overflow"), overflowX: e.css("overflowX"), overflowY: e.css("overflowY") }))) : v.data("layoutCSS", L(v, "position,margin,padding,border,top,bottom,left,right,width,height,overflow,overflowX,overflowY")));
                        try {
                            k = { overflow: "hidden", overflowX: "hidden", overflowY: "hidden" }; v.css(k); c.inset && !d.isPlainObject(c.inset) && (z = parseInt(c.inset, 10) || 0, c.inset = { top: z, bottom: z, left: z, right: z }); if (y.isBody) c.outset ? d.isPlainObject(c.outset) || (z = parseInt(c.outset, 10) || 0, c.outset = { top: z, bottom: z, left: z, right: z }) : c.outset = { top: w(e, "paddingTop"), bottom: w(e, "paddingBottom"), left: w(e, "paddingLeft"), right: w(e, "paddingRight") }, e.css(k).css({ height: "100%", border: "none", padding: 0, margin: 0 }), x.isIE6 ? (v.css({
                                width: "100%", height: "100%",
                                border: "none", padding: 0, margin: 0, position: "relative"
                            }), c.inset || (c.inset = F(v).inset)) : (v.css({ width: "auto", height: "auto", margin: 0, position: "absolute" }), v.css(c.outset)), d.extend(y, F(v, c.inset)); else { var A = v.css("position"); A && A.match(/(fixed|absolute|relative)/) || v.css("position", "relative"); v.is(":visible") && (d.extend(y, F(v, c.inset)), 1 > y.innerHeight && S(c.errors.noContainerHeight.replace(/CONTAINER/, y.ref))) } w(v, "minWidth") && v.parent().css("overflowX", "auto"); w(v, "minHeight") && v.parent().css("overflowY",
                                "auto")
                        } catch (C) { } Na(); d(window).bind("unload." + I, Ma); ha(B, d.layout.onLoad); a.initPanes && na(); delete b.creatingLayout; return p.initialized
                    }() ? null : B
    }
})(jQuery);