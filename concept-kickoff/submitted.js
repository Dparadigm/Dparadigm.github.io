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
    return new Intl.DateTimeFormat("en-US", {timeZone: TZ, weekday: "long", month: "long", day: "numeric", year: "numeric"}).format(new Date(iso));
  }
  function benefitChips(text){
    var out = [], seen = {};
    clean(text).split(/\s*(?:,|\/|&|\band\b)\s*/i).forEach(function(part){
      var t = part.replace(/^\d+[.)]\s*/, "").replace(/[.;:]+$/, "").trim();
      if (!t) return;
      t = t.charAt(0).toUpperCase() + t.slice(1);
      var key = t.toLowerCase();
      if (seen[key]) return;
      seen[key] = 1; out.push(t);
    });
    return out;
  }
  /* Filter groups: raw chip text (lowercase) to a clean group. Chips keep their own text. */
  var BENEFIT_GROUPS = {
    "client": "Clients", "clients": "Clients", "the client": "Clients", "the clients": "Clients",
    "agent": "Agents", "agents": "Agents",
    "asst": "Assistants", "assistant": "Assistants", "assistants": "Assistants",
    "cx": "CX", "cx team": "CX",
    "compliance": "Compliance",
    "contracting": "Contracting",
    "accounting": "Accounting",
    "sales": "Sales", "sales team": "Sales",
    "marketing": "Marketing", "marketing department": "Marketing",
    "underwriting": "Underwriting",
    "licensing": "Licensing",
    "lead": "Leads", "leads": "Leads",
    "sd": "SD",
    "advisor": "Advisors", "advisors": "Advisors",
    "his team staff": "Team staff",
    "everyone": "Everyone"
  };
  function benefitGroups(chips){
    var out = [];
    chips.forEach(function(c){
      var g = BENEFIT_GROUPS[c.toLowerCase()] || c;
      if (out.indexOf(g) < 0) out.push(g);
    });
    return out;
  }
  /* Platform filter: data tag 'platforms' on each entry, plus a text rule so new entries get tagged too. */
  var PLATFORMS = ["Portal"];
  var PLATFORM_RULES = { "Portal": /\bportal\b|family office 360|\bfo ?360\b/i };
  var CONTAINERS = ["AI Agent", "AI Automated Workflow"];
  var TOOLS = ["CRM / HubSpot","Ninety.io","Email","Slack / Zoom chat","Spreadsheet","Data and metrics feeds","Marketing / Metricool","Other system"];
  var CHIPS = {
    trigger: ["Time-based / schedule","Inbound / form submit","Manual start","Threshold / alert","Meeting / cadence"],
    input: ["Who / which record","Date range or window","Source systems","Criteria / rules","Named owner or assignee"],
    action: ["Pull or gather data","Draft or generate output","Update a system of record","Notify a person","Publish / refresh a view"],
    handoff: ["A named person","A named team / role","Ops / leadership","The person who started it"]
  };
  function allText(d){
    function pick(list, idx){ return (idx || []).map(function(i){ return list[i] || ""; }); }
    return [d.s, d.d, d.p, d.w, d.m, CONTAINERS[d.c], CHIPS.trigger[d.r], CHIPS.handoff[d.h]]
      .concat(pick(TOOLS, d.t), pick(CHIPS.input, d.i), pick(CHIPS.action, d.x)).join(" \n ");
  }
  function platformsFor(e, d){
    var out = (e && e.platforms) ? e.platforms.slice() : [];
    var text = allText(d);
    PLATFORMS.forEach(function(pf){ if (out.indexOf(pf) < 0 && PLATFORM_RULES[pf] && PLATFORM_RULES[pf].test(text)) out.push(pf); });
    return out;
  }
  var FILTER_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2.2" fill="#fff"/><circle cx="15" cy="12" r="2.2" fill="#fff"/><circle cx="7" cy="18" r="2.2" fill="#fff"/></svg>';
  function hashSync(){ return !!document.getElementById("tab-submitted"); }
  function readHashList(key){
    var h = location.hash || "";
    var q = h.indexOf("?");
    if (q < 0) return [];
    var v = new URLSearchParams(h.slice(q + 1)).get(key);
    return v ? v.split(",").map(function(x){ return x.trim(); }).filter(Boolean) : [];
  }
  function writeHashFilters(sel){
    if (!hashSync() || !history.replaceState) return;
    var parts = [];
    if (sel.benefits.length) parts.push("benefits=" + sel.benefits.map(encodeURIComponent).join(","));
    if (sel.platform.length) parts.push("platform=" + sel.platform.map(encodeURIComponent).join(","));
    var h = "#submitted" + (parts.length ? "?" + parts.join("&") : "");
    history.replaceState(null, "", location.pathname + location.search + h);
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
    var r = { at: d.a || "", scribe: d.s || "", department: d.d || "", problem: d.p || "",
      whoBenefits: d.w || "", firstMilestone: d.m || "", url: d.k ? shareUrl(d) : "" };
    r.chips = benefitChips(r.whoBenefits);
    r.groups = benefitGroups(r.chips);
    r.platforms = platformsFor(e, d);
    return r;
  }
  window.ckShareUrl = shareUrl;
  window.renderSubmitted = function(host){
    var list = (window.CK_SUBMISSIONS || []).map(norm);
    host.innerHTML = "";
    var intro = el("section", "out sub-intro");
    intro.appendChild(el("div", "lbl", "Submitted opportunities"));
    var introRow = el("div", "sub-intro-row");
    var p = el("p", "sub-intro-text", "");
    var totalEl = el("span", "sub-total", String(list.length));
    var totalTxt = document.createTextNode("");
    p.appendChild(totalEl);
    p.appendChild(totalTxt);
    introRow.appendChild(p);
    intro.appendChild(introRow);
    host.appendChild(intro);
    function setTotal(shown){
      var all = list.length;
      if (shown === all){
        totalEl.textContent = String(all);
        totalTxt.textContent = all === 1 ? " opportunity submitted through the board since Sep 21, 2026" : " opportunities submitted through the board since Sep 21, 2026";
      } else {
        totalEl.textContent = String(shown);
        totalTxt.textContent = " of " + all + " opportunities match the filter";
      }
    }
    setTotal(list.length);
    if (!list.length){ host.appendChild(el("p", "note", "No submissions yet.")); return; }
    /* Filter control */
    var counts = {};
    list.forEach(function(s){ s.groups.forEach(function(g){ counts[g] = (counts[g] || 0) + 1; }); });
    var groupNames = Object.keys(counts).sort(function(a, b){ return counts[b] - counts[a] || (a < b ? -1 : 1); });
    var pcounts = {};
    PLATFORMS.forEach(function(pf){ pcounts[pf] = 0; });
    list.forEach(function(s){ s.platforms.forEach(function(pf){ if (pf in pcounts) pcounts[pf]++; }); });
    var selected = {
      benefits: readHashList("benefits").filter(function(g){ return counts[g]; }),
      platform: readHashList("platform").filter(function(pf){ return pf in pcounts; })
    };
    function nSelected(){ return selected.benefits.length + selected.platform.length; }
    var fwrap = el("div", "sub-filter");
    var fbtn = el("button", "sub-filter-btn");
    fbtn.type = "button";
    fbtn.setAttribute("aria-haspopup", "true");
    fbtn.setAttribute("aria-expanded", "false");
    fbtn.setAttribute("aria-controls", "subFilterPanel");
    fbtn.setAttribute("aria-label", "Filter submissions");
    fbtn.title = "Filter";
    fbtn.innerHTML = FILTER_ICON;
    var badge = el("span", "sub-filter-badge", "");
    badge.setAttribute("aria-hidden", "true");
    fbtn.appendChild(badge);
    var panel = el("div", "sub-filter-panel");
    panel.id = "subFilterPanel";
    panel.hidden = true;
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", "Filters");
    var phd = el("div", "sub-filter-hd");
    phd.appendChild(el("span", "lbl", "Filters"));
    var clearBtn = el("button", "sub-filter-clear", "Clear");
    clearBtn.type = "button";
    phd.appendChild(clearBtn);
    panel.appendChild(phd);
    var opts = el("div", "sub-filter-opts");
    var boxes = [];
    /* Sections with more than COLLAPSE_AT options get a toggle and start collapsed; smaller ones stay open. */
    var COLLAPSE_AT = 3;
    var secTitles = [];
    function addSection(key, title, names, cnt){
      var sec = el("fieldset", "sub-filter-sec");
      var legend = el("legend", "sub-filter-legend");
      var titleEl = el("span", "sub-filter-sec-title", title);
      secTitles.push({ key: key, title: title, el: titleEl });
      var body = el("div", "sub-filter-sec-body");
      body.id = "subf-body-" + key;
      if (names.length > COLLAPSE_AT){
        sec.classList.add("collapsible");
        var tg = el("button", "sub-filter-sec-toggle");
        tg.type = "button";
        tg.setAttribute("aria-expanded", "false");
        tg.setAttribute("aria-controls", body.id);
        tg.appendChild(el("span", "sub-chev", ""));
        tg.appendChild(titleEl);
        legend.appendChild(tg);
        body.hidden = true;
        tg.addEventListener("click", function(){
          var now = tg.getAttribute("aria-expanded") !== "true";
          tg.setAttribute("aria-expanded", now ? "true" : "false");
          body.hidden = !now;
        });
      } else {
        legend.appendChild(titleEl);
      }
      sec.appendChild(legend);
      names.forEach(function(g, i){
        var lab = el("label", "sub-filter-opt");
        var cb = document.createElement("input");
        cb.type = "checkbox"; cb.value = g; cb.id = "subf-" + key + "-" + i;
        cb.setAttribute("data-key", key);
        cb.checked = selected[key].indexOf(g) >= 0;
        lab.appendChild(cb);
        lab.appendChild(el("span", "sub-filter-name", g));
        lab.appendChild(el("span", "sub-filter-count", String(cnt[g])));
        body.appendChild(lab);
        boxes.push(cb);
        cb.addEventListener("change", function(){
          selected[key] = boxes.filter(function(b){ return b.checked && b.getAttribute("data-key") === key; }).map(function(b){ return b.value; });
          applyFilter();
        });
      });
      sec.appendChild(body);
      opts.appendChild(sec);
    }
    addSection("benefits", "Who benefits", groupNames, counts);
    addSection("platform", "Platform", PLATFORMS, pcounts);
    panel.appendChild(opts);
    fwrap.appendChild(fbtn);
    fwrap.appendChild(panel);
    introRow.appendChild(fwrap);
    function openPanel(open){
      panel.hidden = !open;
      fbtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open){
        var first = Array.prototype.filter.call(opts.querySelectorAll("button, input"), function(n){ return n.offsetParent !== null; })[0];
        if (first) first.focus();
      }
    }
    fbtn.addEventListener("click", function(){ openPanel(panel.hidden); });
    clearBtn.addEventListener("click", function(){
      boxes.forEach(function(b){ b.checked = false; });
      selected = { benefits: [], platform: [] };
      applyFilter();
      fbtn.focus();
    });
    document.addEventListener("click", function(e){
      if (!panel.hidden && !fwrap.contains(e.target)) openPanel(false);
    });
    fwrap.addEventListener("keydown", function(e){
      if ((e.key === "Escape" || e.key === "Esc") && !panel.hidden){ e.preventDefault(); openPanel(false); fbtn.focus(); }
    });
    var daySections = [];
    var groups = {}, order = [];
    list.forEach(function(s){
      var k = s.at ? dayKey(s.at) : "unknown";
      if (!groups[k]){ groups[k] = []; order.push(k); }
      groups[k].push(s);
    });
    order.sort(function(a, b){ return a < b ? 1 : a > b ? -1 : 0; });
    order.forEach(function(k, idx){
      var items = groups[k].sort(function(a, b){ return (a.at || "") < (b.at || "") ? -1 : 1; });
      var sec = el("section", "board sub-day");
      var open = idx === 0;
      var panelId = "sub-day-" + k;
      var h2 = el("h2", "sub-day-h");
      var btn = el("button", "sub-day-hd");
      btn.type = "button";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-controls", panelId);
      btn.appendChild(el("span", "sub-caret", ""));
      btn.appendChild(el("span", "sub-day-title", k === "unknown" ? "Date not given" : dayLabel(items[0].at)));
      var dayPill = el("span", "pill", items.length + (items.length === 1 ? " submission" : " submissions"));
      btn.appendChild(dayPill);
      var dayRec = { sec: sec, pill: dayPill, cards: [] };
      daySections.push(dayRec);
      h2.appendChild(btn);
      sec.appendChild(h2);
      var grid = el("div", "sub-grid");
      grid.id = panelId;
      grid.hidden = !open;
      if (!open) sec.classList.add("collapsed");
      (function(btn, grid, sec){
        btn.addEventListener("click", function(){
          var now = btn.getAttribute("aria-expanded") !== "true";
          btn.setAttribute("aria-expanded", now ? "true" : "false");
          grid.hidden = !now;
          sec.classList.toggle("collapsed", !now);
        });
      })(btn, grid, sec);
      items.forEach(function(s){
        var card = el("article", "sub-card");
        dayRec.cards.push({ el: card, groups: s.groups, platforms: s.platforms });
        var top = el("div", "sub-card-top");
        var whoBox = el("div", "sub-who-box");
        whoBox.appendChild(el("div", "sub-who-lbl", "Scribe / Team"));
        whoBox.appendChild(el("div", "sub-who", clean(s.scribe) || "not given"));
        if (clean(s.department)) whoBox.appendChild(el("div", "sub-dept", clean(s.department)));
        top.appendChild(whoBox);
        var meta = el("div", "pills sub-benefits");
        meta.setAttribute("aria-label", "Who benefits");
        s.chips.forEach(function(b){ meta.appendChild(el("span", "pill", b)); });
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
          var lnk = el("a", "sub-link", "Open full submission"); lnk.href = s.url; lnk.target = "_blank"; lnk.rel = "noopener";
          act.appendChild(lnk);
          card.appendChild(act);
        }
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      host.appendChild(sec);
    });
    var noMatch = el("p", "note sub-nomatch", "No submissions match the filter.");
    noMatch.hidden = true;
    host.appendChild(noMatch);
    function applyFilter(){
      var shown = 0;
      daySections.forEach(function(d){
        var n = 0;
        d.cards.forEach(function(c){
          var okB = !selected.benefits.length || c.groups.some(function(g){ return selected.benefits.indexOf(g) >= 0; });
          var okP = !selected.platform.length || c.platforms.some(function(pf){ return selected.platform.indexOf(pf) >= 0; });
          var ok = okB && okP;
          c.el.hidden = !ok;
          if (ok) n++;
        });
        d.sec.hidden = n === 0;
        d.pill.textContent = n + (n === 1 ? " submission" : " submissions");
        shown += n;
      });
      setTotal(shown);
      noMatch.hidden = shown !== 0;
      var n = nSelected();
      badge.textContent = n ? String(n) : "";
      badge.hidden = !n;
      fbtn.classList.toggle("on", n > 0);
      fbtn.setAttribute("aria-label", "Filter submissions" + (n ? ", " + n + " selected" : ""));
      secTitles.forEach(function(t){
        var k = selected[t.key].length;
        t.el.textContent = t.title + (k ? " (" + k + ")" : "");
      });
      writeHashFilters(selected);
    }
    applyFilter();
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
        if (history.replaceState) history.replaceState(null, "", name === "submitted" ? (location.hash.indexOf("#submitted") === 0 ? location.hash : "#submitted") : location.pathname + location.search);
        show(name);
      });
    });
    function fromHash(){ return location.hash.indexOf("#submitted") === 0 ? "submitted" : "board"; }
    window.addEventListener("hashchange", function(){ show(fromHash()); });
    show(fromHash());
  };
})();
