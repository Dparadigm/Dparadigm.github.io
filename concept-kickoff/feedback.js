/* Feedback button and modal. Sends to the same ntfy topic as board submissions, marked as feedback:
 * Title "Board feedback: <title>", Tags "feedback", JSON body with kind "feedback" (never "submit" or "start"). */
(function(){
  var TOPIC_URL = "https://ntfy.sh/paradigm-concept-kickoff-atlas";
  var ABOUT = ["Board", "Submissions", "A submitted opportunity"];
  function el(t, c, x){ var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; }
  function clean(s){ return String(s == null ? "" : s).replace(/[\u2013\u2014]/g, "-").trim(); }
  function hasD(){ try { return !!new URLSearchParams(location.search).get("d"); } catch (e) { return false; } }
  function opportunityLabel(){
    var t = document.getElementById("title");
    return (hasD() && t) ? clean(t.textContent) : "";
  }
  function defaultAbout(){
    if (hasD()) return ABOUT[2];
    var sub = document.getElementById("tab-submitted");
    if (sub && !sub.hidden) return ABOUT[1];
    if (document.getElementById("allSubs") && !document.getElementById("allSubs").hidden) return ABOUT[1];
    return ABOUT[0];
  }
  /* Header values must be Latin-1; use RFC 2047 encoding (ntfy supports it) for anything else. */
  function headerSafe(s){
    if (/^[\x20-\x7e]*$/.test(s)) return s;
    return "=?UTF-8?B?" + btoa(unescape(encodeURIComponent(s))) + "?=";
  }
  var opener = null, backdrop = null;
  function close(){
    if (!backdrop) return;
    document.removeEventListener("keydown", onKey, true);
    backdrop.parentNode.removeChild(backdrop);
    backdrop = null;
    document.body.style.overflow = "";
    if (opener) opener.focus();
  }
  function focusables(){
    return Array.prototype.filter.call(backdrop.querySelectorAll("button, input, select, textarea, a[href]"), function(n){ return !n.disabled && n.offsetParent !== null; });
  }
  function onKey(e){
    if (!backdrop) return;
    if (e.key === "Escape" || e.key === "Esc"){ e.preventDefault(); close(); return; }
    if (e.key === "Tab"){
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }
  function field(id, label, input, required, optional){
    var w = el("div", "field");
    var l = el("label", "fl", label); l.htmlFor = id;
    if (required){ var r = el("span", "fb-req", "*"); r.setAttribute("aria-hidden", "true"); l.appendChild(r); }
    if (optional) l.appendChild(el("span", "opt", "(optional)"));
    input.id = id;
    w.appendChild(l); w.appendChild(input);
    var err = el("p", "fb-err"); err.id = id + "-err"; err.hidden = true;
    w.appendChild(err);
    return { wrap: w, input: input, err: err };
  }
  function open(){
    if (backdrop) return;
    opener = document.activeElement;
    backdrop = el("div", "fb-backdrop");
    var dlg = el("div", "fb-dialog");
    dlg.setAttribute("role", "dialog");
    dlg.setAttribute("aria-modal", "true");
    dlg.setAttribute("aria-labelledby", "fbTitle");
    var h = el("h2", null, "Feedback"); h.id = "fbTitle";
    dlg.appendChild(h);
    dlg.appendChild(el("p", "fb-sub", "Tell us what works, what is confusing, or what to add."));
    var x = el("button", "fb-x", "\u00d7"); x.type = "button"; x.setAttribute("aria-label", "Close feedback");
    x.addEventListener("click", close);
    dlg.appendChild(x);
    var form = document.createElement("form"); form.noValidate = true;
    var sel = document.createElement("select");
    var def = defaultAbout();
    ABOUT.forEach(function(a){ var o = el("option", null, a); o.value = a; if (a === def) o.selected = true; sel.appendChild(o); });
    var fAbout = field("fbAbout", "About", sel);
    var tIn = document.createElement("input"); tIn.type = "text"; tIn.maxLength = 120; tIn.autocomplete = "off"; tIn.required = true;
    var fTitle = field("fbTitleIn", "Title", tIn, true);
    var ta = document.createElement("textarea"); ta.required = true; ta.maxLength = 4000;
    var fText = field("fbText", "Feedback", ta, true);
    var nIn = document.createElement("input"); nIn.type = "text"; nIn.maxLength = 80; nIn.autocomplete = "name"; nIn.required = true;
    var fName = field("fbName", "Name", nIn, true);
    [fAbout, fTitle, fText, fName].forEach(function(f){ form.appendChild(f.wrap); });
    var status = el("p", "fb-status"); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    form.appendChild(status);
    var acts = el("div", "fb-actions");
    var send = el("button", "go", "Send feedback"); send.type = "submit";
    var cancel = el("button", "reset", "Cancel"); cancel.type = "button"; cancel.addEventListener("click", close);
    acts.appendChild(send); acts.appendChild(cancel);
    form.appendChild(acts);
    dlg.appendChild(form);
    function setErr(f, msg){
      f.err.textContent = msg || ""; f.err.hidden = !msg;
      if (msg){ f.input.setAttribute("aria-invalid", "true"); f.input.setAttribute("aria-describedby", f.err.id); }
      else { f.input.removeAttribute("aria-invalid"); f.input.removeAttribute("aria-describedby"); }
    }
    [fTitle, fText, fName].forEach(function(f){ f.input.addEventListener("input", function(){ if (clean(f.input.value)) setErr(f, ""); }); });
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var title = clean(tIn.value), text = clean(ta.value), name = clean(nIn.value);
      setErr(fTitle, title ? "" : "Add a short title.");
      setErr(fText, text ? "" : "Add your feedback.");
      setErr(fName, name ? "" : "Add your name.");
      if (!title){ tIn.focus(); return; }
      if (!text){ ta.focus(); return; }
      if (!name){ nIn.focus(); return; }
      var about = sel.value;
      var payload = { kind: "feedback", about: about, title: title, feedback: text, name: name,
        opportunity: about === ABOUT[2] ? opportunityLabel() : "", page: location.href, at: new Date().toISOString() };
      send.disabled = true; cancel.disabled = true;
      status.className = "fb-status"; status.textContent = "Sending\u2026";
      var ctrl = (typeof AbortController !== "undefined") ? new AbortController() : null;
      var timer = setTimeout(function(){ if (ctrl) ctrl.abort(); }, 12000);
      fetch(TOPIC_URL, {
        method: "POST",
        headers: { "Title": headerSafe("Board feedback: " + title), "Tags": "feedback,speech_balloon", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function(r){
        clearTimeout(timer);
        if (!r.ok) throw new Error("HTTP " + r.status);
        dlg.removeChild(form);
        var done = el("div", "fb-thanks");
        done.appendChild(el("p", null, "Thanks. Your feedback was sent."));
        var ok = el("button", "go", "Close"); ok.type = "button"; ok.addEventListener("click", close);
        done.appendChild(ok);
        dlg.appendChild(done);
        h.textContent = "Feedback sent";
        ok.focus();
      }).catch(function(){
        clearTimeout(timer);
        send.disabled = false; cancel.disabled = false;
        status.className = "fb-status bad";
        status.textContent = "Could not send right now. Your text is still here; check your connection and try again.";
        send.focus();
      });
    });
    backdrop.appendChild(dlg);
    backdrop.addEventListener("mousedown", function(e){ if (e.target === backdrop) close(); });
    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey, true);
    tIn.focus();
  }
  function init(){
    var f = document.querySelector("footer");
    if (!f || f.querySelector(".fb-open")) return;
    var txt = clean(f.textContent);
    f.textContent = "";
    f.classList.add("fb-footer");
    f.appendChild(el("span", "fb-brand", txt));
    var b = el("button", "fb-open", "Feedback"); b.type = "button";
    b.setAttribute("aria-haspopup", "dialog");
    b.addEventListener("click", open);
    f.appendChild(b);
  }
  window.ckOpenFeedback = open;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
