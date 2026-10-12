const D={nb:"People who don't work with us yet. We reach them with the podcast, social platforms, our website, content hubs, and ads.",ec:"People we already serve. We reach them with the live stream, newsletter, and portal Education Center."};
const S=[
{k:"Research",sub:"who we serve best",ic:"🎯",in:"<ul><li>Questions prospects ask our strategists, shared in a Zoom chat or forwarded by email.</li><li>Research on the five kinds of people we serve best: what worries them and the words they use.</li><li>What last month's results taught us.</li></ul>",in_ec:"<ul><li>Questions clients ask our strategists, shared in a Zoom chat or forwarded by email.</li><li>Research on the five kinds of people we serve best: what worries them and the words they use.</li><li>What last month's results taught us.</li></ul>",ai:"AI groups similar questions, checks them against the research, and suggests topics.",out:"A short list of topic ideas.",hil:"Strategists bring the questions and feedback. Marketing reviews the ideas.",
 nb:"Prospects keep asking a strategist the same question. It becomes a topic idea.",ec:"A client asks how their plan works after a new baby. That becomes a topic idea."},
{k:"Poll",sub:"the team votes",ic:"🗳️",in:"The topic ideas, with a one page summary.",ai:"AI writes short, clear poll choices.",out:"A ranked list of topics.",hil:"Strategists vote.",real:1,
 nb:"October's real poll ranked topics like \"The Paid-Off House Question\".",ec:"Current clients get their own separate poll."},
{k:"Pick",sub:"lock the month",ic:"🔒",in:"The poll results.",ai:"AI drafts a short plan for each topic.",out:"The month's topics, locked in.",hil:"Marketing makes the final pick.",
 nb:"The top topics for future clients become the plan.",ec:"The top topics for current clients become their plan."},
{k:"Create",sub:"make the content",ic:"🎙️",in:"The chosen topics.",ai:"AI turns one podcast episode into clips, posts, and notes.",ai_ec:"AI turns one live stream into clips and notes.",out:"Many short pieces each week.",out_ec:"Many short pieces from each live stream.",hil:"A person edits and reviews.",
 nb:"We record a podcast episode and cut it into short clips.",ec:"We hold a live stream for clients and cut it into short clips."},
{k:"Publish",sub:"share it",ic:"🚀",in:"The finished pieces.",in_ec:"The live stream replay and clips.",ai:"AI fits each piece to where it will appear.",out:"Content live on our website, podcast, and social media.",out_ec:"The replay and clips live on the client side of our website.",hil:"Marketing approves what goes where.",
 nb:"The podcast and clips go on our website and social media. Ads help new people find them.",ec:"The live stream replay goes on the client side of our website, the front door to Family Office 360."},
{k:"Newsletter",sub:"one easy email",ic:"✉️",in:"The month's best content.",ai:"AI drafts a summary email.",ai_ec:"AI drafts a summary email with live stream highlights.",out:"A newsletter that links back to the content.",
 nb:"Future clients get podcast highlights and one next step.",ec:"Clients get live stream highlights and an invite to the next one."},
{k:"Scorecard",sub:"see what worked",ic:"📊",in:"Views, clicks, and what sales hears.",ai:"AI gathers the numbers each week.",out:"A simple weekly report card.",hil:"The team reviews and decides what's next.",
 nb:"Lots of prospects ask about one topic, so we make more on it.",ec:"Clients watch one topic the most, so we do more like it."}];
let i=0,t="nb";const f=document.getElementById("flow"),p=document.getElementById("panel");
S.forEach((s,n)=>{const li=document.createElement("li");li.innerHTML=`<button><span class="ic">${s.ic}</span><span class="n">${n+1}</span>${s.k}</button>`;li.onclick=()=>go(n);f.appendChild(li)});
function go(n){i=Math.max(0,Math.min(S.length-1,n));const s=S[i];
[...f.children].forEach((c,k)=>c.className=k<i?"done":k==i?"cur":"");
p.classList.remove("show");void p.offsetWidth;p.classList.add("show");
p.innerHTML=`<h2><span>${s.ic}</span> Step ${i+1}: ${s.k} <small>${s.sub}</small></h2><div class="cols">
<div class="c"><h3>What we start with</h3><div class="ci">${s["in_"+t]||s.in}</div></div><div class="c ai"><h3>How AI helps</h3><p>${s["ai_"+t]||s.ai}</p></div><div class="c"><h3>What we end up with</h3><p>${s["out_"+t]||s.out}</p></div></div>
${s.hil?`<div class="hil"><span class="hi">🧑‍💼</span><div><b>Human in the loop</b><p>${s.hil}</p></div></div>`:""}${s.real?`<div class="real"><h3>See a real one</h3><div class="shots"><a href="../october-topic-poll/" target="_blank"><img src="${IMG.oct}" alt="October 2026 new business poll page"><span>The real October poll page</span></a><a href="../monthly-content-topics/#poll" target="_blank"><img src="${IMG.how}" alt="Two Zoom Workplace Polls explainer"><span>How our two polls work</span></a></div></div>`:""}<div class="ex"><b>Example (${t=="nb"?"future clients":"current clients"}):</b> ${s[t]}</div>`;
document.getElementById("tdesc").textContent=D[t];document.getElementById("count").textContent=`${i+1} / ${S.length}`;
document.getElementById("next").textContent=i==S.length-1?"Back to start":"Next step";}
document.getElementById("next").onclick=()=>go(i==S.length-1?0:i+1);document.getElementById("prev").onclick=()=>go(i-1);
document.querySelectorAll(".tr").forEach(b=>b.onclick=()=>{t=b.dataset.t;document.querySelectorAll(".tr").forEach(x=>x.classList.toggle("on",x==b));go(i)});
document.addEventListener("keydown",e=>{if(e.key=="ArrowRight"||e.key==" "){e.preventDefault();go(i+1)}if(e.key=="ArrowLeft")go(i-1)});go(0);
