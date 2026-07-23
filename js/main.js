/* Shared behaviors: mobile nav, count-up stats, animated meters, roach easter egg.
   No dependencies. Degrades gracefully with prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- mobile hamburger nav ---- */
  var burger = document.querySelector(".burger");
  var links = document.getElementById("navlinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu after tapping a link (mobile)
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- count-up numbers ----
     <span class="num" data-to="2.27" data-suffix="M" data-decimals="2">0</span> */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute("data-to")) || 0;
    var dec = el.hasAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var render = function (v) { el.textContent = prefix + v.toFixed(dec) + suffix; };
    if (reduce || to === 0) { render(to); return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);       // ease-out cubic
      render(to * eased);
      if (p < 1) requestAnimationFrame(step); else render(to);
    }
    requestAnimationFrame(step);
  }

  /* ---- reveal-on-scroll for counters + meters ---- */
  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var t = en.target;
          if (t.matches(".num[data-to]")) animateCount(t);
          if (t.matches(".bar")) { var fill = t.querySelector("span"); if (fill) fill.style.width = (t.getAttribute("data-fill") || 0) + "%"; }
          io.unobserve(t);
        });
      }, { threshold: 0.4 })
    : null;

  /* ---- dynamic day counters: data-since="YYYY-MM-DD" -> live day count ---- */
  document.querySelectorAll("[data-since]").forEach(function (el) {
    var start = new Date(el.getAttribute("data-since") + "T00:00:00");
    var days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
    el.setAttribute("data-to", days);
    el.textContent = "0";
  });

  document.querySelectorAll(".num[data-to], .bar").forEach(function (el) {
    if (io) io.observe(el);
    else if (el.matches(".num[data-to]")) animateCount(el);
    else { var f = el.querySelector("span"); if (f) f.style.width = (el.getAttribute("data-fill") || 0) + "%"; }
  });

  /* ---- scroll reveal: pop elements in as they enter view ---- */
  var revealEls = document.querySelectorAll(".card, .crime, .promise, figure.illus, .tnode, .ev-card, .stat, .meter-row, .tldr, .photo-slot");
  if ("IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (Math.min(i % 6, 5) * 55) + "ms";
      ro.observe(el);
    });
  }

  /* ---- youtube facade: click the thumbnail to play (avoids error 153) ----
     inline iframe when hosted; opens YouTube directly when run from file:// */
  document.querySelectorAll(".embed[data-yt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-yt");
      if (location.protocol === "file:") {
        window.open("https://www.youtube.com/watch?v=" + id, "_blank", "noopener");
        return;
      }
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = btn.getAttribute("aria-label") || "YouTube video";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.setAttribute("allowfullscreen", "");
      f.referrerPolicy = "strict-origin-when-cross-origin";
      btn.innerHTML = "";
      btn.appendChild(f);
      btn.style.cursor = "default";
    });
  });

  /* ---- easter egg: roaches scuttle across screen ---- */
  window.releaseRoaches = function (n) {
    if (reduce) return;
    n = n || 12;
    for (var i = 0; i < n; i++) {
      (function (i) {
        setTimeout(function () {
          var r = document.createElement("div");
          r.className = "egg-roach";
          r.textContent = "🪳";
          r.style.bottom = (4 + Math.random() * 60) + "px";
          r.style.animationDuration = (2.5 + Math.random() * 2.5) + "s";
          r.style.fontSize = (1.2 + Math.random() * 1.6) + "rem";
          document.body.appendChild(r);
          r.addEventListener("animationend", function () { r.remove(); });
        }, i * 120);
      })(i);
    }
  };
  var mascot = document.querySelector("[data-roach-trigger]");
  if (mascot) mascot.addEventListener("click", function () { window.releaseRoaches(14); });

  // Konami code -> infestation
  var seq = [38,38,40,40,37,39,37,39,66,65], pos = 0;
  document.addEventListener("keydown", function (e) {
    pos = (e.keyCode === seq[pos]) ? pos + 1 : 0;
    if (pos === seq.length) { window.releaseRoaches(40); pos = 0; }
  });
})();
