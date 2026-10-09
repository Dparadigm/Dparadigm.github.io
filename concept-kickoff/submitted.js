/* Submitted opportunities tab. Reads window.CK_SUBMISSIONS (submissions.js). */
(function(){
  var TZ = "America/Denver";
  function clean(s){ return String(s == null ? "" : s).replace(/[\u2013\u2014]/g, "-").trim(); }
  function el(t, c, x){ var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; }
  function dayKey(iso){
    var d = new Date(iso);
    var p = new Intl.DateTimeFormat("en-CA", {timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"}).format(d);
    return p;
  }
  function dayLabel(iso){
    return new Intl.DateTimeFormat("en-US", {timeZone: TZ, weekday: "long", month: "short", day: "numeric", year: "numeric"}).format(new Date(iso));
  }
  function timeLabel(iso){
    return new Intl.DateTimeFormat("en-US", {timeZone: TZ, hour: "numeric", minute: "2-digit"}).format(new Date(iso)) + " MT";
  }
  function field(label, value){
    var row = el("div", "sub-field");
    row.appendChild(el("div", "fl", label));
    var v = clean(value);
    var val = el("div", "sub-val" + (v ? "" : " missing"), v || "not given");
    row.appendChild(val);
    return row;
  }
  function shareUrl(d){
    try {
      var b64 = btoa(unescape(encodeURIComponent(JSON.stringify(d))));
      return "/ck/?d=" + b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    } catch (e) { return ""; }
  }
  function norm(e){
    var d = (e && e.d) || {};
    return { at: d.a || "", scribe: d.s || "", department: d.d || "", problem: d.p || "",
      whoBenefits: d.w || "", firstMilestone: d.m || "", url: d.k ? shareUrl(d) : "" };
  }
  window.ckShareUrl = shareUrl;
  window.renderSubmitted = function(host){
    var list = (window.CK_SUBMISSIONS || []).map(norm);
    host.innerHTML = "";
    var intro = el("section", "out sub-intro");
    intro.appendChild(el("div", "lbl", "Submitted opportunities"));
    var p = el("p", null, "");
    p.appendChild(el("span", "sub-total", String(list.length)));
    p.appendChild(document.createTextNode(list.length === 1 ? " opportunity submitted through the board since Sep 21, 2026" : " opportunities submitted through the board since Sep 21, 2026"));
    intro.appendChild(p);
    host.appendChild(intro);
    if (!list.length){ host.appendChild(el("p", "note", "No submissions yet.")); return; }
    var groups = {}, order = [];
    list.forEach(function(s){
      var k = s.at ? dayKey(s.at) : "unknown";
      if (!groups[k]){ groups[k] = []; order.push(k); }
      groups[k].push(s);
    });
    order.sort(function(a, b){ return a < b ? 1 : a > b ? -1 : 0; });
    order.forEach(function(k){
      var items = groups[k].sort(function(a, b){ return (a.at || "") < (b.at || "") ? -1 : 1; });
      var sec = el("section", "board sub-day");
      var hd = el("div", "sub-day-hd");
      hd.appendChild(el("h2", null, k === "unknown" ? "Date not given" : dayLabel(items[0].at)));
      hd.appendChild(el("span", "pill", items.length + (items.length === 1 ? " submission" : " submissions")));
      sec.appendChild(hd);
      var grid = el("div", "sub-grid");
      items.forEach(function(s){
        var card = el("article", "sub-card");
        var top = el("div", "sub-card-top");
        var who = el("div", "sub-who", clean(s.scribe) || "not given");
        top.appendChild(who);
        var meta = el("div", "pills");
        if (clean(s.department)) meta.appendChild(el("span", "pill", clean(s.department)));
        if (s.at) meta.appendChild(el("span", "pill sub-time", timeLabel(s.at)));
        top.appendChild(meta);
        card.appendChild(top);
        var job = el("div", "sub-field");
        job.appendChild(el("div", "fl", "Job to be done / problem"));
        var jv = clean(s.problem);
        var jobVal = el("div", "sub-val sub-job" + (jv ? "" : " missing"));
        if (jv && s.url){
          var a = el("a", null, jv); a.href = s.url; a.target = "_blank"; a.rel = "noopener";
          jobVal.appendChild(a);
        } else {
          jobVal.textContent = jv || "not given";
        }
        job.appendChild(jobVal);
        card.appendChild(job);
        card.appendChild(field("Who benefits", s.whoBenefits));
        card.appendChild(field("First milestone", s.firstMilestone));
        if (s.url){
          var act = el("div", "sub-actions");
          var open = el("a", "sub-link", "Open full submission"); open.href = s.url; open.target = "_blank"; open.rel = "noopener";
          act.appendChild(open);
          card.appendChild(act);
        }
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      host.appendChild(sec);
    });
  };
  window.initCkTabs = function(){
    var tabs = document.querySelectorAll(".ck-tab");
    if (!tabs.length) return;
    var panels = { board: document.getElementById("tab-board"), submitted: document.getElementById("tab-submitted") };
    var count = document.getElementById("subCount");
    if (count) count.textContent = String((window.CK_SUBMISSIONS || []).length);
    var rendered = false;
    function show(name){
      if (!panels[name]) name = "board";
      Object.keys(panels).forEach(function(k){ if (panels[k]) panels[k].hidden = (k !== name); });
      Array.prototype.forEach.call(tabs, function(t){
        var on = t.getAttribute("data-tab") === name;
        t.classList.toggle("on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      if (name === "submitted" && !rendered){ window.renderSubmitted(panels.submitted); rendered = true; }
    }
    Array.prototype.forEach.call(tabs, function(t){
      t.addEventListener("click", function(){
        var name = t.getAttribute("data-tab");
        if (history.replaceState) history.replaceState(null, "", name === "submitted" ? "#submitted" : location.pathname + location.search);
        show(name);
      });
    });
    window.addEventListener("hashchange", function(){ show(location.hash === "#submitted" ? "submitted" : "board"); });
    show(location.hash === "#submitted" ? "submitted" : "board");
  };
})();
