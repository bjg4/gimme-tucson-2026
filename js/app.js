// Interactive coach dashboard behaviors
(function () {
  const D = window.TUCSON;
  if (!D) return;

  // --- Volume chart (canvas 2D, no Chart.js required) ---
  function initChart() {
    const el = document.getElementById("volChart");
    if (!el) return;
    if (typeof Chart !== "undefined") {
      const labels = D.weeks.map((w) => "W" + w.w);
      const data = D.weeks.map((w) => w.mpwMid);
      const ctx = el.getContext("2d");
      const grad = ctx.createLinearGradient(0, 0, 0, 210);
      grad.addColorStop(0, "rgba(198, 122, 69, 0.5)");
      grad.addColorStop(1, "rgba(94, 200, 216, 0.02)");
      new Chart(el, {
        type: "line",
        data: { labels, datasets: [{ data, borderColor: "#e8955a", backgroundColor: grad, borderWidth: 2.5, pointBackgroundColor: "#7ee0ef", pointBorderColor: "#0a0e14", pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 7, fill: true, tension: 0.38 }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { backgroundColor: "#162029", titleColor: "#7ee0ef", bodyColor: "#e8d5b7", borderColor: "rgba(94,200,216,0.3)", borderWidth: 1, callbacks: { afterLabel: (c) => D.weeks[c.dataIndex].phase + " · " + D.weeks[c.dataIndex].long } } },
          scales: {
            x: { grid: { color: "rgba(232,213,183,0.06)" }, ticks: { color: "#8a7a66", font: { size: 11 } } },
            y: { min: 20, max: 55, grid: { color: "rgba(232,213,183,0.06)" }, ticks: { color: "#8a7a66", font: { size: 11 }, callback: (v) => v + " mi" } }
          },
          onClick: (_e, els) => { if (els[0]) setWeek(els[0].index); }
        }
      });
      return;
    }

    const labels = D.weeks.map((w) => "W" + w.w);
    const data = D.weeks.map((w) => w.mpwMid);
    const ctx = el.getContext("2d");
    const parent = el.parentElement;
    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth || 600;
      const h = 210;
      el.width = Math.floor(w * dpr);
      el.height = Math.floor(h * dpr);
      el.style.width = w + "px";
      el.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const pad = { l: 36, r: 12, t: 16, b: 28 };
      const ymin = 20, ymax = 55;
      const n = data.length;
      const x = (i) => pad.l + ((w - pad.l - pad.r) * i) / (n - 1);
      const y = (v) => pad.t + (h - pad.t - pad.b) * (1 - (v - ymin) / (ymax - ymin));
      // grid
      ctx.strokeStyle = "rgba(232,213,183,0.08)";
      ctx.fillStyle = "#8a7a66";
      ctx.font = "11px DM Sans, system-ui, sans-serif";
      ctx.textAlign = "right";
      [25, 35, 45, 55].forEach((tick) => {
        const yy = y(tick);
        ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(w - pad.r, yy); ctx.stroke();
        ctx.fillText(tick + "", pad.l - 6, yy + 4);
      });
      // fill
      const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
      grad.addColorStop(0, "rgba(198,122,69,0.45)");
      grad.addColorStop(1, "rgba(94,200,216,0.02)");
      ctx.beginPath();
      data.forEach((v, i) => i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v)));
      ctx.lineTo(x(n - 1), h - pad.b);
      ctx.lineTo(x(0), h - pad.b);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      // line
      ctx.beginPath();
      data.forEach((v, i) => i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v)));
      ctx.strokeStyle = "#e8955a";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.stroke();
      // points + labels
      ctx.textAlign = "center";
      data.forEach((v, i) => {
        ctx.beginPath();
        ctx.arc(x(i), y(v), 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#7ee0ef";
        ctx.fill();
        ctx.strokeStyle = "#0a0e14";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#8a7a66";
        ctx.fillText(labels[i], x(i), h - 8);
      });
      el._pts = data.map((v, i) => ({ x: x(i), y: y(v), i }));
    }
    draw();
    window.addEventListener("resize", draw);
    el.addEventListener("click", (ev) => {
      const rect = el.getBoundingClientRect();
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      let best = null, bd = 1e9;
      (el._pts || []).forEach((p) => {
        const d = (p.x - mx) ** 2 + (p.y - my) ** 2;
        if (d < bd) { bd = d; best = p; }
      });
      if (best && bd < 400) setWeek(best.i);
    });
  }

  // --- Week timeline ---
  let weekIdx = 0;
  const rail = document.getElementById("week-rail");
  const scrub = document.getElementById("week-scrub");
  const detail = document.getElementById("week-detail");
  const phasePills = document.getElementById("phase-pills");

  function renderRail() {
    if (!rail) return;
    rail.innerHTML = D.weeks.map((w, i) =>
      `<button type="button" class="week-btn${i === weekIdx ? " active" : ""}" data-i="${i}" aria-pressed="${i === weekIdx}">
        <span class="dot"></span>W${w.w}
      </button>`
    ).join("");
    rail.querySelectorAll(".week-btn").forEach((btn) => {
      btn.addEventListener("click", () => setWeek(+btn.dataset.i));
    });
  }

  function setWeek(i) {
    weekIdx = Math.max(0, Math.min(D.weeks.length - 1, i));
    const w = D.weeks[weekIdx];
    renderRail();
    if (scrub) scrub.value = weekIdx;
    if (detail) {
      detail.innerHTML = `
        <div class="panel">
          <div class="chip-row">
            <span class="chip phase">${w.phase}</span>
            <span class="chip">Week ${w.w}</span>
            <span class="chip">${w.start}</span>
          </div>
          <div class="week-hero-stat" style="margin-top:0.85rem">${w.mpw} <span style="font-size:1rem;color:var(--sand-mute)">mpw</span></div>
          <div class="week-meta"><strong>Long:</strong> ${w.long}</div>
          <div class="week-meta"><strong>Quality:</strong> ${w.quality}</div>
        </div>
        <div class="panel">
          <div class="eyebrow" style="margin-bottom:0.5rem">Key session</div>
          <p style="margin:0;font-family:Fraunces,Georgia,serif;font-size:1.35rem;line-height:1.25;color:var(--sand)">${w.key}</p>
          <p style="margin:0.85rem 0 0;font-size:0.85rem;color:var(--sand-mute)">Click chart points or scrub the rail · phases filter weeks</p>
        </div>`;
    }
    if (phasePills) {
      const root = w.phase.split("→")[0].replace("Peak→taper","Peak");
      phasePills.querySelectorAll(".phase-pill").forEach((p) => {
        const ph = p.dataset.phase;
        const match = (ph === "Peak" && w.phase.includes("Peak")) || w.phase === ph || w.phase.startsWith(ph + "→");
        p.classList.toggle("active", match);
      });
    }
  }

  if (scrub) {
    scrub.max = D.weeks.length - 1;
    scrub.addEventListener("input", () => setWeek(+scrub.value));
  }

  if (phasePills) {
    phasePills.querySelectorAll(".phase-pill").forEach((p) => {
      p.addEventListener("click", () => {
        const ph = p.dataset.phase;
        if (ph === "All") { setWeek(weekIdx); return; }
        const idx = D.weeks.findIndex((w) => w.phase === ph || w.phase.startsWith(ph) || (ph === "Peak" && w.phase.includes("Peak")));
        if (idx >= 0) setWeek(idx);
      });
    });
  }

  renderRail();
  setWeek(0);

  // --- Evidence filter + expand ---
  const evList = document.getElementById("ev-list");
  const filters = document.getElementById("ev-filters");
  let confFilter = "all";

  function confClass(c) {
    if (c === "strong") return "strong";
    if (c === "expert") return "expert";
    if (c === "mod-strong") return "mod-strong";
    return "moderate";
  }
  function confLabel(c) {
    if (c === "mod-strong") return "mod–strong";
    return c;
  }

  function renderEvidence() {
    if (!evList) return;
    const items = D.evidence.filter((e) => confFilter === "all" || e.conf === confFilter);
    evList.innerHTML = items.map((e) => `
      <button type="button" class="ev" data-id="${e.id}" aria-expanded="false">
        <div class="ev-id">${e.id}</div>
        <div>
          <div class="ev-title">${e.title}</div>
          <div class="ev-claim">${e.claim}</div>
          <div class="ev-detail"><strong style="color:var(--cyan)">Source:</strong> ${e.source}<br/><br/>${e.detail}</div>
        </div>
        <span class="badge ${confClass(e.conf)}">${confLabel(e.conf)}</span>
      </button>`).join("");
    evList.querySelectorAll(".ev").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = btn.classList.contains("open");
        evList.querySelectorAll(".ev").forEach((b) => {
          b.classList.remove("open");
          b.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          btn.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  if (filters) {
    filters.querySelectorAll(".filter-btn").forEach((b) => {
      b.addEventListener("click", () => {
        confFilter = b.dataset.conf;
        filters.querySelectorAll(".filter-btn").forEach((x) => x.classList.toggle("active", x === b));
        renderEvidence();
      });
    });
  }
  renderEvidence();

  // --- Course tabs ---
  const tabs = document.getElementById("map-tabs");
  if (tabs) {
    tabs.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.dataset.map;
        tabs.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
        document.querySelectorAll(".map-pane").forEach((p) => p.classList.toggle("active", p.id === "map-" + id));
      });
    });
  }

  // --- Postmortem race compare ---
  const raceToggles = document.getElementById("race-toggles");
  const compareGrid = document.getElementById("compare-grid");
  const selected = new Set(["eugene", "portland"]);

  function renderCompare() {
    if (!compareGrid) return;
    const keys = ["debut", "newport", "portland", "eugene"].filter((k) => selected.has(k));
    if (!keys.length) {
      compareGrid.innerHTML = `<div class="panel" style="color:var(--sand-mute)">Select at least one race to compare.</div>`;
      return;
    }
    compareGrid.innerHTML = keys.map((k) => {
      const r = D.races[k];
      return `<article class="compare-card${r.pr ? " pr" : ""}">
        <div class="compare-name">${r.name}</div>
        <div class="compare-time">${r.result}</div>
        <div class="compare-metrics">
          <span><strong style="color:var(--sand)">${r.date}</strong></span>
          <span>Peak ${r.peak} · avg ${r.avg} mpw</span>
          <span>Peak long ${r.long} mi · MLR≥10: ${r.mlr}</span>
          <span>Named quality ${r.quality} (${r.qpw}/wk)</span>
          <span style="color:var(--sand-mute)">${r.note}</span>
        </div>
      </article>`;
    }).join("");
  }

  if (raceToggles) {
    raceToggles.querySelectorAll(".race-tog").forEach((btn) => {
      const k = btn.dataset.race;
      btn.classList.toggle("active", selected.has(k));
      btn.addEventListener("click", () => {
        if (selected.has(k)) selected.delete(k);
        else selected.add(k);
        btn.classList.toggle("active", selected.has(k));
        renderCompare();
      });
    });
  }
  renderCompare();

  // Chart after DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChart);
  } else {
    initChart();
  }
})();
