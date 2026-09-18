var CONTAINERS = ["AI Agent", "AI Automated Workflow"];
var TOOLS = [
  "CRM / HubSpot",
  "Ninety.io",
  "Email",
  "Slack / Zoom chat",
  "Spreadsheet",
  "Data and metrics feeds",
  "Marketing / Metricool",
  "Other system"
];
var CHIPS = {
  trigger: [
    "Time-based / schedule",
    "Inbound / form submit",
    "Manual start",
    "Threshold / alert",
    "Meeting / cadence"
  ],
  input: [
    "Who / which record",
    "Date range or window",
    "Source systems",
    "Criteria / rules",
    "Named owner or assignee"
  ],
  action: [
    "Pull or gather data",
    "Draft or generate output",
    "Update a system of record",
    "Notify a person",
    "Publish / refresh a view"
  ],
  handoff: [
    "A named person",
    "A named team / role",
    "Ops / leadership",
    "The person who started it"
  ]
};
var MULTI = { tools: TOOLS, input: CHIPS.input, action: CHIPS.action };
var DEFS = {
  Container: "The kind of system you are building.",
  Tools: "The systems it is allowed to use. (Select 1-4 tools)",
  Trigger: "What starts the process (Select 1)",
  Input: "The information it captures (Select 1-4 items)",
  Action: "The action it takes (Select 1-4)",
  Handoff: "Who owns it next (Select 1)"
};

var state = {container:null, tools:[], trigger:null, input:[], action:[], handoff:null, selected:null};

function $(id){ return document.getElementById(id); }
function el(t,c,x){ var n=document.createElement(t); if(c) n.className=c; if(x!=null) n.textContent=x; return n; }
function val(id){ return $(id).value.trim(); }

function boardReady(){
  return !!(state.container && state.tools.length>=1 && state.trigger && state.input.length>=1 && state.action.length>=1 && state.handoff);
}
function textReady(){
  return !!(val("scribe") && val("problem") && val("whoBenefits") && val("firstMilestone"));
}
function canSubmit(){
  var ok = textReady() && boardReady();
  $("submit").disabled = !ok;
  return ok;
}

function selectSlot(name){
  state.selected = name;
  document.querySelectorAll(".slot").forEach(function(s){ s.classList.toggle("on", s.dataset.slot===name); });
}
function setContainer(text){ state.container = text; render(); }
function toggleMulti(key, text){
  var arr = state[key];
  var i = arr.indexOf(text);
  if (i>=0) arr.splice(i,1);
  else if (arr.length<4) arr.push(text);
  render();
}
function setBlock(key, text){ state[key]=text; state.selected=null; render(); }
function clearBlock(key, e){
  if (e) e.stopPropagation();
  if (MULTI[key]) state[key]=[];
  else state[key]=null;
  render();
}

function slotBox(key, empty, value, multi){
  var box = el("div", "slot"+(value && (!multi || value.length) ? " filled":""));
  box.dataset.slot = key;
  if (state.selected===key) box.classList.add("on");
  box.addEventListener("click", function(){ selectSlot(key); });
  if (multi){
    if (!value.length) box.appendChild(document.createTextNode(empty));
    else {
      var pills = el("div","pills");
      value.forEach(function(t){
        var p = el("span","pill", t);
        var x = el("button","x","\u00d7");
        x.addEventListener("click", function(ev){ ev.stopPropagation(); toggleMulti(key, t); });
        p.appendChild(x); pills.appendChild(p);
      });
      box.appendChild(pills);
    }
  } else if (!value){
    box.appendChild(document.createTextNode(empty));
  } else {
    var x = el("button","x","\u00d7");
    x.addEventListener("click", function(ev){ clearBlock(key, ev); });
    box.appendChild(x);
    box.appendChild(document.createTextNode(value));
  }
  return box;
}

function leftRow(k, node){
  var r = el("div","row");
  r.appendChild(el("div","k", k));
  r.appendChild(node);
  var wrap = el("div","pair-left");
  wrap.appendChild(r);
  return wrap;
}

function rightGroup(label, kind, items, usedFn){
  var right = el("div","pair-right");
  var g = el("div","grp");
  var lab = el("div","lbl");
  lab.appendChild(el("span","name", label + ":"));
  if (DEFS[label]) lab.appendChild(el("span","def", DEFS[label]));
  g.appendChild(lab);
  var chips = el("div","chips");
  items.forEach(function(t){
    var b = el("button","chip", t);
    b.type="button";
    if (usedFn(t)) b.classList.add("used");
    b.addEventListener("click", function(){ place(kind, t); });
    chips.appendChild(b);
  });
  g.appendChild(chips);
  right.appendChild(g);
  return right;
}

function pair(label, leftNode, kind, items, usedFn){
  var p = el("div","pair");
  p.appendChild(leftRow(label, leftNode));
  p.appendChild(rightGroup(label, kind, items, usedFn));
  return p;
}

function render(){
  var work = $("work");
  work.innerHTML = "";
  work.appendChild(pair("Container", slotBox("container","Select 1 container piece", state.container), "container", CONTAINERS, function(t){ return state.container===t; }));
  work.appendChild(pair("Tools", slotBox("tools","Select 1 to 4 tools", state.tools, true), "tools", TOOLS, function(t){ return state.tools.indexOf(t)>=0; }));
  work.appendChild(pair("Trigger", slotBox("trigger","Select 1 trigger", state.trigger), "trigger", CHIPS.trigger, function(t){ return state.trigger===t; }));
  work.appendChild(pair("Input", slotBox("input","Select 1 to 4 inputs", state.input, true), "input", CHIPS.input, function(t){ return state.input.indexOf(t)>=0; }));
  work.appendChild(pair("Action", slotBox("action","Select 1 to 4 actions", state.action, true), "action", CHIPS.action, function(t){ return state.action.indexOf(t)>=0; }));
  work.appendChild(pair("Handoff", slotBox("handoff","Select 1 handoff", state.handoff), "handoff", CHIPS.handoff, function(t){ return state.handoff===t; }));
  canSubmit();
}

function place(kind, text){
  if (kind==="container"){ setContainer(text); return; }
  if (MULTI[kind]){
    var key = (state.selected && MULTI[state.selected]) ? state.selected : kind;
    if (MULTI[key] && MULTI[key].indexOf(text)>=0) toggleMulti(key, text);
    return;
  }
  var key = (state.selected && CHIPS[state.selected]) ? state.selected : kind;
  if (CHIPS[key] && CHIPS[key].indexOf(text)>=0) setBlock(key, text);
}

function missingBits(){
  var m = [];
  if (!val("scribe")) m.push("scribe");
  if (!val("problem")) m.push("job to be done / problem");
  if (!val("whoBenefits")) m.push("who benefits");
  if (!val("firstMilestone")) m.push("first milestone");
  if (!state.container) m.push("container");
  if (state.tools.length<1) m.push("1 to 4 tools");
  if (!state.trigger) m.push("trigger");
  if (state.input.length<1) m.push("1 to 4 inputs");
  if (state.action.length<1) m.push("1 to 4 actions");
  if (!state.handoff) m.push("handoff");
  return m;
}


function encodePayload(p){
  var json = JSON.stringify(p);
  var b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}

function shareUrlFor(payload){
  var base = location.href.split("?")[0].split("#")[0].replace(/index\.html$/i,"");
  if (base.slice(-1) !== "/") base += "/";
  return base + "view.html?d=" + encodePayload(payload);
}

function formatSummary(p, shareUrl){
  var lines = [];
  lines.push("Concept kickoff");
  if (shareUrl) lines.push("Link: " + shareUrl);
  lines.push("Scribe: " + (p.scribe || ""));
  if (p.department) lines.push("Department / area: " + p.department);
  lines.push("Job to be done / problem: " + (p.problem || ""));
  lines.push("Who benefits: " + (p.whoBenefits || ""));
  lines.push("First milestone: " + (p.firstMilestone || ""));
  lines.push("Container: " + (p.container || ""));
  lines.push("Tools: " + ((p.tools && p.tools.length) ? p.tools.join("; ") : ""));
  lines.push("Trigger: " + (p.trigger || ""));
  lines.push("Input: " + ((p.input && p.input.length) ? p.input.join("; ") : ""));
  lines.push("Action: " + ((p.action && p.action.length) ? p.action.join("; ") : ""));
  lines.push("Handoff: " + (p.handoff || ""));
  return lines.join("\n");
}

function showSummary(payload){
  var url = shareUrlFor(payload);
  window.__conceptShareUrl = url;
  var text = formatSummary(payload, url);
  $("summary").textContent = text;
  window.__conceptSummaryText = text;
  if ($("shareLink")){
    $("shareLink").href = url;
    $("shareLink").textContent = url;
  }
}

function boardPayload(kind){
  return {
    kind: kind,
    at: new Date().toISOString(),
    scribe: val("scribe"),
    department: val("department"),
    problem: val("problem"),
    whoBenefits: val("whoBenefits"),
    firstMilestone: val("firstMilestone"),
    container: state.container,
    tools: state.tools.slice(),
    trigger: state.trigger,
    input: state.input.slice(),
    action: state.action.slice(),
    handoff: state.handoff
  };
}

function pingHandoff(payload){
  var body = JSON.stringify(payload);
  var jobs = [];
  jobs.push(fetch("https://ntfy.sh/paradigm-concept-kickoff-atlas", {
    method: "POST",
    headers: {"Title": (payload.kind||"submit") + " " + (payload.scribe||""), "Tags": "clipboard", "Content-Type": "application/json"},
    body: body
  }).catch(function(){}));
  if (window.HANDOFF_WEBHOOK){
    jobs.push(fetch(window.HANDOFF_WEBHOOK, {method:"POST", headers:{"Content-Type":"application/json"}, body:body, mode:"no-cors"}).catch(function(){}));
  }
  return Promise.all(jobs);
}
window.HANDOFF_WEBHOOK = "";

var started = false;
function maybeStart(){
  if (started) return;
  if (!val("scribe")) return;
  started = true;
  var p = boardPayload("start");
  window.__handoffStart = p;
  pingHandoff(p);
}

["scribe","department","problem","whoBenefits","firstMilestone"].forEach(function(id){
  $(id).addEventListener("input", function(){
    canSubmit();
    if (id==="scribe") maybeStart();
  });
});

$("submit").addEventListener("click", function(){
  var miss = missingBits();
  if (miss.length){
    $("copied").textContent = "Still need: " + miss.join(", ") + ".";
    return;
  }
  var payload = boardPayload("submit");
  payload.id = (payload.scribe||"scribe").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") + "-" + Date.now().toString(36);
  window.__handoffSubmit = payload;
  var slug = payload.id;
  try { localStorage.setItem("concept-kickoff-board-"+slug, JSON.stringify(payload)); } catch (e) {}
  $("submit").disabled = true;
  $("copied").textContent = "Sending\u2026";
  pingHandoff(payload).then(function(){
    $("copied").textContent = "";
    showSummary(payload);
    $("form-block").classList.add("hide");
    $("thanks").classList.add("show");
    window.scrollTo({top:0, behavior:"smooth"});
  });
});

$("copySummary").addEventListener("click", function(){
  var text = window.__conceptSummaryText || ($("summary") && $("summary").textContent) || "";
  if (!text) return;
  function ok(){ $("summaryCopied").textContent = "Copied. Paste into Alley Rally Zoom chat."; }
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(ok).catch(function(){
      var ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) {}
      document.body.removeChild(ta);
    });
  } else {
    var ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); ok(); } catch (e) {}
    document.body.removeChild(ta);
  }
});

$("editAgain").addEventListener("click", function(){
  $("summaryCopied").textContent = "";
  $("thanks").classList.remove("show");
  $("form-block").classList.remove("hide");
  canSubmit();
  window.scrollTo({top:0, behavior:"smooth"});
});

$("reset").addEventListener("click", function(){
  state = {container:null, tools:[], trigger:null, input:[], action:[], handoff:null, selected:null};
  started = false;
  ["scribe","department","problem","whoBenefits","firstMilestone"].forEach(function(id){ $(id).value=""; });
  $("copied").textContent = "";
  if ($("summaryCopied")) $("summaryCopied").textContent = "";
  if ($("summary")) $("summary").textContent = "";
  $("thanks").classList.remove("show");
  $("form-block").classList.remove("hide");
  render();
});

render();