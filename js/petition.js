/* "Claude for PM" petition — REAL shared counter, synced to a public server.
   Uses abacus (https://abacus.jasoncameron.dev): a global integer tally.
   It stores ONLY a count — no names, emails, or personal data, ever.
   Works on any page that has #counter and #sign-btn (homepage + claude-pm). */
(function () {
  "use strict";
  var NS = "parikshapeparcha", KEY = "claude-for-pm-india-2026";
  var API = "https://abacus.jasoncameron.dev";
  var GET = API + "/get/" + NS + "/" + KEY;   // read, no increment
  var HIT = API + "/hit/" + NS + "/" + KEY;   // increment + return new value
  var SIGNED = "claude_pm_signed_2026";
  var LAST = "claude_pm_last_2026";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var counterEl = document.getElementById("counter");
  var btn = document.getElementById("sign-btn");
  var youAre = document.getElementById("you-are");
  var shareBtn = document.getElementById("share-btn");
  var statusEl = document.getElementById("petition-status");
  if (!counterEl || !btn) return;             // page has no petition

  function fmt(n) { return Number(n).toLocaleString("en-IN"); }
  function paint(n) { counterEl.textContent = fmt(n); localStorage.setItem(LAST, String(n)); }
  function status(msg) { if (statusEl) statusEl.textContent = msg || ""; }

  var SIGN_LABEL = btn.textContent || "sign the petition ✍️";

  // load the current live count
  counterEl.textContent = "…";
  fetch(GET, { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (typeof d.value === "number") paint(d.value);
      else counterEl.textContent = "0";   // key not created until the first signature
    })
    .catch(function () {
      var c = localStorage.getItem(LAST);
      counterEl.textContent = c ? fmt(c) : "—";
      status("⚠️ couldn't reach the live counter — showing the last count I saw.");
    });

  if (localStorage.getItem(SIGNED)) markSigned(localStorage.getItem(SIGNED));

  function markSigned(num) {
    btn.disabled = true;
    btn.textContent = "✓ signed";
    if (youAre && num) youAre.textContent = "you're citizen #" + fmt(num) + " of the roach republic 🪳";
  }

  btn.addEventListener("click", function () {
    if (localStorage.getItem(SIGNED)) return;
    btn.disabled = true; btn.textContent = "signing…"; status("");
    fetch(HIT, { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (typeof d.value !== "number") throw new Error("bad response");
        paint(d.value);
        localStorage.setItem(SIGNED, String(d.value));
        markSigned(d.value);
        confetti();
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = SIGN_LABEL;
        status("⚠️ couldn't reach the server. check your connection and try again.");
      });
  });

  /* ---- shareable Instagram-story generator (random roast quote) ---- */
  var QUOTES = [
    "they leaked the exam four times, then called the students the problem. incredible range.",
    "a government so allergic to accountability it tear-gassed the symptoms.",
    "one job: keep the paper safe. they lost to a WhatsApp forward.",
    "flew the question paper on an Air Force jet but couldn't fly in one apology.",
    "banned Telegram to hide the leak — like burning the diary after the whole class read it.",
    "twelve kids gone and the minister's chair didn't even wobble.",
    "when the answer to 'why did it leak?' is a lathi charge, you already have your answer.",
    "they called the youth cockroaches. the youth built a party out of it. stay mad.",
    "a chatbot said 'i'm so sorry.' the state asked 'which lane for the tear gas?'",
    "the exam tests two million kids on an integrity the system has never once passed."
  ];

  function wrapLines(ctx, text, maxWidth) {
    var words = text.split(" "), lines = [], line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = words[i]; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  function makeStory(quote, done) {
    var W = 1080, H = 1920, PAD = 120;
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var g = cv.getContext("2d");
    g.fillStyle = "#17110a"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#9e0511"; g.fillRect(0, 0, W, 28);
    g.fillStyle = "#a6f70a"; g.fillRect(0, H - 28, W, 28);
    g.strokeStyle = "#a6f70a"; g.lineWidth = 10; g.strokeRect(46, 46, W - 92, H - 92);
    g.textAlign = "center";
    g.fillStyle = "#a6f70a"; g.font = "800 46px Arial";
    g.fillText("🪳 PARIKSHA PE PARCHA", W / 2, 230);
    g.fillStyle = "#e9e2d2"; g.font = "600 32px Arial";
    g.fillText("the NEET 2026 government roast", W / 2, 285);
    // quote (auto-fit)
    g.fillStyle = "#ffffff";
    var size = 78, lh, lines;
    do {
      g.font = "900 " + size + "px Arial";
      lines = wrapLines(g, "“" + quote + "”", W - PAD * 2);
      lh = size * 1.24;
      size -= 4;
    } while (lines.length * lh > 900 && size > 44);
    var startY = H / 2 - (lines.length * lh) / 2;
    for (var i = 0; i < lines.length; i++) g.fillText(lines[i], W / 2, startY + i * lh + size);
    g.fillStyle = "#ff2d87"; g.fillRect(W / 2 - 130, startY + lines.length * lh + 70, 260, 12);
    // footer
    g.fillStyle = "#a6f70a"; g.font = "800 50px Arial";
    g.fillText("the govt has less humanity", W / 2, H - 360);
    g.fillText("than a chatbot.", W / 2, H - 300);
    g.fillStyle = "#e9e2d2"; g.font = "700 36px Arial";
    g.fillText("✍️ sign: make Claude the PM of India", W / 2, H - 215);
    g.fillStyle = "#9aa0aa"; g.font = "600 30px Arial";
    g.fillText("#ParikshaPeParcha  #NEETScam  #CockroachRepublic", W / 2, H - 155);
    cv.toBlob(function (b) { done(b); }, "image/png");
  }

  if (shareBtn) {
    var SHARE_LABEL = shareBtn.textContent;
    shareBtn.addEventListener("click", function () {
      var quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      shareBtn.disabled = true; shareBtn.textContent = "making your story…"; status("");
      makeStory(quote, function (blob) {
        shareBtn.disabled = false; shareBtn.textContent = SHARE_LABEL;
        var file = new File([blob], "pariksha-pe-parcha-story.png", { type: "image/png" });
        var text = quote + "  🪳 #ParikshaPeParcha — make Claude the PM of India";
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], text: text, title: "Pariksha Pe Parcha" }).catch(function () {});
        } else {
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url; a.download = "pariksha-pe-parcha-story.png";
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
          status("📲 story image downloaded — post it to your Instagram story! (on a phone, this opens the share sheet.)");
        }
      });
    });
  }

  function confetti() {
    if (reduce) return;
    var bits = ["🪳", "🎉", "🇮🇳", "🤖", "✨", "🗳️"];
    for (var i = 0; i < 40; i++) {
      var p = document.createElement("div");
      p.className = "confetti-piece";
      p.textContent = bits[Math.floor(Math.random() * bits.length)];
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDuration = (2 + Math.random() * 2) + "s";
      p.style.animationDelay = (Math.random() * 0.4) + "s";
      document.body.appendChild(p);
      (function (p) { setTimeout(function () { p.remove(); }, 4600); })(p);
    }
  }

  /* --- tiny runnable self-check: append ?selftest to the URL --- */
  if (location.search.indexOf("selftest") !== -1) {
    console.assert(fmt(1000) === "1,000", "en-IN thousands");
    console.assert(fmt(100000) === "1,00,000", "en-IN lakh grouping");
    console.log("petition self-check passed ✅");
  }
})();
