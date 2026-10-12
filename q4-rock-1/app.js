const S=[
{hil:"Advisors bring the real client questions, and the marketing team reviews the topic ideas.",k:"Who we're talking to",ic:"🎯",in:"A short description of the kinds of people we serve best (our ideal clients). Plus ideas from our advisors, shared in a Zoom chat or by forwarding an email.",
 ai:"AI reads through the questions and ideas the team sends in, groups similar ones together, and suggests topic ideas. Each idea gets a short title and says who it is for.",
 out:"A pile of topic ideas, each one aimed at a real kind of person we help.",
 nb:"An advisor keeps hearing the same question from people who are not clients yet. They drop it in the Zoom chat. It becomes a topic card.",
 ec:"A client asks how their plan works after a new baby. That question becomes a topic card for our current clients."},
{hil:"Our advisors and wealth strategists vote. AI does not pick.",k:"Ask the team what to talk about",ic:"🗳️",in:"The topic cards, plus a one page summary with more detail on each.",
 ai:"AI helps write short, clear poll choices and the one page summary, so voting takes a few minutes.",
 out:"Our wealth strategists vote in a quick Zoom poll. We get a ranked list, about 2 to 3 weeks before the month starts.",real:1,
 nb:"October's real poll for future clients asked strategists to rank topics like \"Policy Loans Without Interrupting Growth\" and \"The Paid-Off House Question\".",
 ec:"Current clients get their own separate poll, so their topics are picked just for them."},
{hil:"The marketing team makes the final pick.",k:"Pick the topics",ic:"🔒",in:"The poll results.",ai:"AI helps write a brief for each winner. A brief is a short plan: the main point, who it is for, and what to cover.",
 out:"The month's topics are locked in. No more changing them, so the team can get to work.",
 nb:"The top voted topics for future clients become the month's plan.",ec:"The top voted topics for current clients become their plan, labeled so we can find and reuse them later."},
{hil:"A person reviews and edits everything AI drafts before it goes out. Advisors check that it is accurate and compliant.",k:"Make the content",ic:"🎙️",in:"The chosen topics and their briefs.",ai:"AI helps with outlines, episode notes, short video clips, and smaller posts made from each recording.",
 out:"Each week, one recording becomes many smaller pieces: clips, posts, and articles. The goal is 23 pieces a week.",
 nb:"We record a podcast episode. Then we cut it into short clips and posts.",ec:"We hold a live video session for clients. Then we cut it into short clips and posts."},
{hil:"The marketing team approves what gets posted and where.",k:"Share it",ic:"🚀",in:"The finished pieces.",ai:"AI helps shape each piece for the place it will appear.",
 out:"The content goes live where people will see it: our website, the newsletter, the podcast, and social media. We also pay for ads so more of the right people see it, and show reminder ads to people who already visited our site.",
 nb:"Someone hears a clip, visits our website, and later sees a reminder ad that brings them back.",ec:"Clients find it on the client side of our website, the front door to Family Office 360, and later inside the client portal."},
{hil:"A person writes and approves the final newsletter.",k:"Send the newsletter",ic:"✉️",in:"Everything we published that month.",ai:"AI helps pull the best of the month into one easy email.",out:"A newsletter that points people back to the full content.",
 nb:"Future clients get a few highlights and one clear next step.",ec:"Clients get the highlights that relate to their own plan."},
{hil:"The team reads the results and decides what to do next.",k:"See what worked",ic:"📊",in:"How many people watched, read, or clicked each piece. Plus what our salespeople hear in real conversations.",ai:"AI helps gather the numbers so the weekly report card is ready on time.",
 out:"A simple weekly report card (we call it a scorecard). At month end we look back, and the lessons shape next month's topics.",
 nb:"A salesperson says, \"Three people asked me about policy loans this week.\" That topic gets more attention next month.",ec:"We see which topics clients opened and watched the most, and do more like them."}];
let i=0,t="nb";const f=document.getElementById("flow"),p=document.getElementById("panel");
S.forEach((s,n)=>{const li=document.createElement("li");li.innerHTML=`<button><span class="ic">${s.ic}</span><span class="n">${n+1}</span>${s.k}</button>`;li.onclick=()=>go(n);f.appendChild(li)});
function go(n){i=Math.max(0,Math.min(S.length-1,n));const s=S[i];
[...f.children].forEach((c,k)=>c.className=k<i?"done":k==i?"cur":"");
p.classList.remove("show");void p.offsetWidth;p.classList.add("show");
p.innerHTML=`<h2><span>${s.ic}</span> Step ${i+1}: ${s.k}</h2><div class="cols">
<div class="c"><h3>What we start with</h3><p>${s.in}</p></div><div class="c ai"><h3>How AI helps</h3><p>${s.ai}</p></div><div class="c"><h3>What we end up with</h3><p>${s.out}</p></div></div>
<div class="hil"><span class="hi">🧑‍💼</span><div><b>Human in the loop</b><p>${s.hil}</p></div></div>${s.real?`<div class="real"><h3>See a real one</h3><div class="shots"><a href="../october-topic-poll/" target="_blank"><img src="${IMG.oct}" alt="October 2026 new business poll page"><span>The real October poll page</span></a><a href="../monthly-content-topics/#poll" target="_blank"><img src="${IMG.how}" alt="Two Zoom Workplace Polls explainer"><span>How our two polls work</span></a></div></div>`:""}<div class="ex"><b>Example (${t=="nb"?"future clients":"current clients"}):</b> ${s[t]}</div>`;
document.getElementById("count").textContent=`${i+1} / ${S.length}`;
document.getElementById("next").textContent=i==S.length-1?"Back to start":"Next step";}
document.getElementById("next").onclick=()=>go(i==S.length-1?0:i+1);document.getElementById("prev").onclick=()=>go(i-1);
document.querySelectorAll(".tr").forEach(b=>b.onclick=()=>{t=b.dataset.t;document.querySelectorAll(".tr").forEach(x=>x.classList.toggle("on",x==b));go(i)});
document.addEventListener("keydown",e=>{if(e.key=="ArrowRight"||e.key==" "){e.preventDefault();go(i+1)}if(e.key=="ArrowLeft")go(i-1)});go(0);
