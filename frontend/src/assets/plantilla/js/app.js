!function() {
    "use strict";
    try {
      if (sessionStorage.getItem("defaultAttribute")) {
        var t, a, e;
        t = document.documentElement.attributes;
        a = {};
        Object.entries(t).forEach(function(t) {
          var e;
          t[1] && t[1].nodeName && "undefined" != t[1].nodeName && (e = t[1].nodeName, a[e] = t[1].nodeValue);
        });
        if (sessionStorage.getItem("defaultAttribute") !== JSON.stringify(a)) {
          sessionStorage.clear();
          window.location.reload();
        } else {
          e = {};
          e["data-layout"] = sessionStorage.getItem("data-layout");
          e["data-sidebar-size"] = sessionStorage.getItem("data-sidebar-size");
          e["data-bs-theme"] = sessionStorage.getItem("data-bs-theme");
          e["data-layout-width"] = sessionStorage.getItem("data-layout-width");
          e["data-sidebar"] = sessionStorage.getItem("data-sidebar");
          e["data-sidebar-image"] = sessionStorage.getItem("data-sidebar-image");
          e["data-layout-direction"] = sessionStorage.getItem("data-layout-direction");
          e["data-layout-position"] = sessionStorage.getItem("data-layout-position");
          e["data-layout-style"] = sessionStorage.getItem("data-layout-style");
          e["data-topbar"] = sessionStorage.getItem("data-topbar");
          e["data-preloader"] = sessionStorage.getItem("data-preloader");
          Object.keys(e).forEach(function(t) {
            e[t] && document.documentElement.setAttribute(t, e[t]);
          });
        }
      }
    } catch (error) {
      console.error("Error en layout.js:", error);
    }
  }();
  