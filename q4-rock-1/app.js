const S=[
{k:"ICP research",ic:"🎯",in:"Our five ICPs (the people we serve best), Trinity Cornelius ICP facts, ideas advisors drop in Zoom Team Chat or forward by email.",
 ai:"AI turns ICP facts and advisor ideas into ready to rank topic cards (Trinity CMO cards, scaffolded through Ability Path B).",
 out:"A stack of topic cards, each with a clear title, ICP, and track.",
 nb:"An advisor hears the same question from three prospects and drops it in the intake channel. It becomes a topic card aimed at a matching ICP.",
 ec:"A client asks how their plan handles a family change. It becomes a card for the existing client track."},
{k:"Topic poll",ic:"🗳️",in:"Topic cards plus a companion one pager with the full card details.",
 ai:"AI drafts poll titles and the one pager so strategists can vote fast.",
 out:"Force ranked topics from our wealth strategists, 2 to 3 weeks before the content month.",
 nb:"Strategists vote in the new business Zoom Workplace Poll.",ec:"A separate poll for existing client topics. Never combined into one."},
{k:"Lock",ic:"🔒",in:"Poll results.",ai:"AI builds the brief list for each locked topic.",out:"The month's topics locked per track, each with a brief.",
 nb:"Top ranked prospect topics locked for the month.",ec:"Top ranked client topics locked, tagged so they can be reused later."},
{k:"Create",ic:"🎙️",in:"Locked topics and briefs.",ai:"AI helps with outlines, show notes, clips, and supporting pieces from each recording.",
 out:"Weekly recordings and the content cut from them. The target is 23 pieces a week.",
 nb:"Record the podcast episode, then cut it into supporting content.",ec:"Record the live stream, then cut it into supporting content."},
{k:"Publish",ic:"🚀",in:"Finished content.",ai:"AI helps package each piece for its channel.",out:"Content live on our channels, boosted by rebuilt paid media and retargeting.",
 nb:"Website, newsletter, podcast, supporting content, plus paid media and retargeting.",ec:"Website gateway to Family Office 360, newsletter, live stream, and later the in portal Education Center."},
{k:"Newsletter",ic:"✉️",in:"The month's published pieces.",ai:"AI pulls the best of the month into a newsletter brief.",out:"A newsletter that sends people back to the content.",
 nb:"Prospects get the highlights and a single next step.",ec:"Clients get the highlights tied to their plan."},
{k:"Scorecard",ic:"📊",in:"Performance per piece and per track, plus what sales hears from prospects.",ai:"AI helps compile the numbers so the scorecard is ready every week.",
 out:"A weekly scorecard, a month end measure for each track, and feedback into next month's cards.",
 nb:"Sales tells marketing which topics started real conversations.",ec:"We see which topics clients engaged with most."}];
let i=0,t="nb";const f=document.getElementById("flow"),p=document.getElementById("panel");
S.forEach((s,n)=>{const li=document.createElement("li");li.innerHTML=`<button><span class="ic">${s.ic}</span><span class="n">${n+1}</span>${s.k}</button>`;li.onclick=()=>go(n);f.appendChild(li)});
function go(n){i=Math.max(0,Math.min(S.length-1,n));const s=S[i];
[...f.children].forEach((c,k)=>c.className=k<i?"done":k==i?"cur":"");
p.classList.remove("show");void p.offsetWidth;p.classList.add("show");
p.innerHTML=`<h2><span>${s.ic}</span> Step ${i+1}: ${s.k}</h2><div class="cols">
<div class="c"><h3>Goes in</h3><p>${s.in}</p></div><div class="c ai"><h3>What happens + AI</h3><p>${s.ai}</p></div><div class="c"><h3>Comes out</h3><p>${s.out}</p></div></div>
<div class="ex"><b>Example (${t=="nb"?"new business":"existing clients"}):</b> ${s[t]}</div>`;
document.getElementById("count").textContent=`${i+1} / ${S.length}`;
document.getElementById("next").textContent=i==S.length-1?"Back to start":"Next step";}
document.getElementById("next").onclick=()=>go(i==S.length-1?0:i+1);document.getElementById("prev").onclick=()=>go(i-1);
document.querySelectorAll(".tr").forEach(b=>b.onclick=()=>{t=b.dataset.t;document.querySelectorAll(".tr").forEach(x=>x.classList.toggle("on",x==b));go(i)});
document.addEventListener("keydown",e=>{if(e.key=="ArrowRight"||e.key==" "){e.preventDefault();go(i+1)}if(e.key=="ArrowLeft")go(i-1)});go(0);
