/* Feedback is paused for now. No data is sent anywhere. */
(function(){
  function init(){
    var f = document.querySelector("footer");
    if (!f || f.querySelector(".fb-paused")) return;
    var txt = String(f.textContent || "").trim();
    f.textContent = "";
    f.classList.add("fb-footer");
    var brand = document.createElement("span"); brand.className = "fb-brand"; brand.textContent = txt;
    var note = document.createElement("span"); note.className = "fb-paused"; note.textContent = "Feedback is paused for now.";
    f.appendChild(brand); f.appendChild(note);
  }
  window.ckOpenFeedback = function(){};
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
