(function () {
  var buttons = document.querySelectorAll(".tab-btn");
  var panels = document.querySelectorAll(".tab-panel");

  function activate(name) {
    buttons.forEach(function (btn) {
      var on = btn.getAttribute("data-tab") === name;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(function (panel) {
      var on = panel.id === "panel-" + name;
      panel.classList.toggle("active", on);
    });
    if (name === "resources" && window.location.hash) {
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activate(btn.getAttribute("data-tab"));
    });
  });

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-copy");
      var el = document.getElementById(id);
      if (!el) return;
      var text = el.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = "Copy"; }, 1500);
        });
      } else {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try { document.execCommand("copy"); } catch (e) {}
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1500);
      }
    });
  });

  function tabForHash(hash) {
    if (!hash) return null;
    var id = hash.replace(/^#/, "");
    var el = document.getElementById(id);
    if (!el) return null;
    var panel = el.closest(".tab-panel");
    if (!panel || !panel.id) return null;
    return panel.id.replace(/^panel-/, "");
  }

  function handleHashLink(e, a) {
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;
    var id = href.slice(1);
    var el = document.getElementById(id);
    if (!el) return;
    var tab = tabForHash(href);
    if (tab) activate(tab);
    e.preventDefault();
    history.replaceState(null, "", href);
    requestAnimationFrame(function () {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) { handleHashLink(e, a); });
  });

  window.addEventListener("hashchange", function () {
    var tab = tabForHash(window.location.hash);
    if (tab) activate(tab);
    var id = (window.location.hash || "").replace(/^#/, "");
    var el = id ? document.getElementById(id) : null;
    if (el) {
      requestAnimationFrame(function () {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });

  var initial = tabForHash(window.location.hash);
  if (initial) activate(initial);
})();
