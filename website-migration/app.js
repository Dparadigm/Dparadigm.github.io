document.getElementById("shield").src=(window.IMG||{}).shield||"";
const D={ag:"A Trinity agent, like the Copywriter, writes the first draft. A person always approves it.",pp:"Rachel or someone on the team writes or edits content directly in Sanity."};
const S=[
{k:"Draft",sub:"someone starts a piece",ic:"✍️",in:"A topic or brief, like a podcast episode transcript.",ag_do:"The Copywriter agent writes the draft straight into Sanity.",pp_do:"A team member writes or edits the piece in Sanity's simple editor.",out:"A first draft of the content.",ag:"The Copywriter turns a Riverside transcript into a blog post draft.",pp:"Rachel updates a headline on the book site."},
{k:"Saved",sub:"stored as a draft in Sanity",ic:"💾",in:"The new or edited content.",ag_do:"Sanity saves it as a draft. Nothing is live yet.",pp_do:"Sanity saves it as a draft. Nothing is live yet.",out:"A draft waiting for review.",ag:"The post waits in Sanity, clearly marked as a draft.",pp:"The headline change waits as a draft."},
{k:"Approve",sub:"Rachel previews and publishes",ic:"✅",in:"The draft.",ag_do:"Rachel previews it on the real page design, then publishes or sends it back.",pp_do:"The writer previews it on the real page design and publishes.",out:"Published, approved content.",hil:"Rachel decides what goes live.",ag:"Rachel tweaks one line and clicks Publish.",pp:"Rachel checks the preview and clicks Publish."},
{k:"Rebuild",sub:"nightly, only if something changed",ic:"🌙",in:"Everything published that day.",ag_do:"Each night a check looks for new published content. If there is any, the site rebuilds.",pp_do:"Each night a check looks for new published content. If there is any, the site rebuilds.",out:"A fresh version of the site.",ag:"Tonight's check finds the new post and rebuilds the site.",pp:"Tonight's check finds the headline change and rebuilds."},
{k:"Live",sub:"same URLs, no downtime",ic:"🌐",in:"The fresh version.",ag_do:"The new version replaces the old one in a single switch. The old one stays up until then.",pp_do:"The new version replaces the old one in a single switch. The old one stays up until then.",out:"Updated live site at the same web addresses.",ag:"By morning, the post is live on paradigmlife.net.",pp:"By morning, the new headline is live."}];
let i=0,t="ag";const f=document.getElementById("flow"),p=document.getElementById("panel");
S.forEach((s,n)=>{const li=document.createElement("li");li.innerHTML=`<button><span class="ic">${s.ic}</span><span class="n">${n+1}</span>${s.k}</button>`;li.onclick=()=>go(n);f.appendChild(li)});
function go(n){i=Math.max(0,Math.min(S.length-1,n));const s=S[i];
[...f.children].forEach((c,k)=>c.className=k<i?"done":k==i?"cur":"");
p.classList.remove("show");void p.offsetWidth;p.classList.add("show");
p.innerHTML=`<h2><span>${s.ic}</span> Step ${i+1}: ${s.k} <small>${s.sub}</small></h2><div class="cols">
<div class="c"><h3>What we start with</h3><p>${s.in}</p></div><div class="c ai"><h3>What happens</h3><p>${s[t+"_do"]}</p></div><div class="c"><h3>What we end up with</h3><p>${s.out}</p></div></div>
${s.hil?`<div class="hil"><span class="hi">🧑‍💼</span><div><b>Human in the loop</b><p>${s.hil}</p></div></div>`:""}<div class="ex"><b>Example (${t=="ag"?"agent":"person"}):</b> ${s[t]}</div>`;
document.getElementById("tdesc").textContent=D[t];document.getElementById("count").textContent=`${i+1} / ${S.length}`;
document.getElementById("next").textContent=i==S.length-1?"Back to start":"Next step";}
document.getElementById("next").onclick=()=>go(i==S.length-1?0:i+1);document.getElementById("prev").onclick=()=>go(i-1);
document.querySelectorAll(".tr").forEach(b=>b.onclick=()=>{t=b.dataset.t;document.querySelectorAll(".tr").forEach(x=>x.classList.toggle("on",x==b));go(i)});
go(0);
