// Tucson 2026 plan data — accurate from potato plans
window.TUCSON = {
  weeks: [
    {w:1, start:"Sep 14", phase:"Base", mpw:"30–34", mpwMid:32, long:"14–15 E", quality:"Light T 20–25′", key:"Re-entry threshold without VO2 hammer"},
    {w:2, start:"Sep 21", phase:"Base", mpw:"33–37", mpwMid:35, long:"15–16 E", quality:"T / cruise + strides", key:"First MLR 10–11 + intro I dose"},
    {w:3, start:"Sep 28", phase:"Base", mpw:"35–39", mpwMid:37, long:"16 E + last 2 @ M_B", quality:"First MP taste", key:"Last 2 mi of long at 7:42"},
    {w:4, start:"Oct 5", phase:"Specific", mpw:"38–42", mpwMid:40, long:"16–17 w/ 4–5 MP", quality:"Continuous MP midweek", key:"Canova/Pfitz continuous stimulus"},
    {w:5, start:"Oct 12", phase:"Specific", mpw:"40–44", mpwMid:42, long:"17–18 w/ 6 MP", quality:"I session (VO2)", key:"Limited VO2max dose"},
    {w:6, start:"Oct 19", phase:"Specific", mpw:"42–46", mpwMid:44, long:"18 w/ 7–8 MP", quality:"T continuous 30–35′", key:"Growing MP inside long"},
    {w:7, start:"Oct 26", phase:"Specific", mpw:"40–44", mpwMid:42, long:"16 E (cutback)", quality:"Maintain 1 quality", key:"Recovery week — hold, don’t smash"},
    {w:8, start:"Nov 2", phase:"Specific", mpw:"44–48", mpwMid:46, long:"18–19 w/ 8–10 MP", quality:"Big continuous MP", key:"M_B → M_A progression"},
    {w:9, start:"Nov 9", phase:"Peak", mpw:"46–50", mpwMid:48, long:"19–20 w/ 10–12 MP", quality:"Peak specific", key:"Highest specific load"},
    {w:10, start:"Nov 16", phase:"Peak", mpw:"48–52", mpwMid:50, long:"18–20 w/ 10–12 MP", quality:"Peak volume week", key:"Reassess A vs B after this"},
    {w:11, start:"Nov 23", phase:"Peak→taper", mpw:"42–46", mpwMid:44, long:"14–16 w/ 6–8 MP", quality:"Start volume drop", key:"Bosquet volume cut begins"},
    {w:12, start:"Nov 30", phase:"Taper", mpw:"35–40", mpwMid:37.5, long:"10–12 w/ 3–4 MP", quality:"Keep intensity sparks", key:"Volume ↓ keep intensity"},
    {w:13, start:"Dec 7", phase:"Race", mpw:"25–32", mpwMid:28.5, long:"Race 26.2 Sun", quality:"Tue short T/MP", key:"Open controlled — A only if 10K feels like B"}
  ],
  evidence: [
    {id:"E01", title:"VDOT / race equivalency", claim:"HM 1:38:51 ≈ VDOT 46–47; Eugene 3:27:53 ≈ 44–45; 3:15 ≈ 47. HM→marathon often optimistic without durability.", source:"Daniels Running Formula · Scudamore 2018 JSCR", conf:"moderate", detail:"Official Daniels tables frame the gap. Scudamore: VDOT can underestimate lab VO2max; threshold paces still usable."},
    {id:"E02", title:"Goal honesty / prediction error", claim:"Extrapolating HM→marathon overestimates without specific training. Blake’s HM predicts closer to ~3:19–3:22.", source:"Oficial-Casado 2025 Front Physiol · Vickers & Vertosick 2016", conf:"mod-strong", detail:"Valencia cohort VDOT MAE ~7.9%. Training-aware models beat pure distance-equivalence."},
    {id:"E03", title:"Volume progression", claim:"Sudden spikes raise distance injury risk. Practice ≤10%/wk average; ban >~25–30% jumps after travel.", source:"Damsted 2018 SR · Nielsen 2014 · Buist 2008 RCT", conf:"moderate", detail:"Buist RCT: 10% vs 24% — no injury difference. Rigid 10% is not magic; huge jumps still risky."},
    {id:"E04", title:"Weekly volume & structure", claim:"Sub-elite ~3:15 plans cluster mid–high volume; peak long ~30–32 km; pyramidal TID.", source:"Knopp/Dohmen 2024 · 92-plan analysis", conf:"moderate", detail:"Final-12-wk means: high ~108 km/wk, mid ~59, low ~43. Peak long converges across groups."},
    {id:"E06", title:"MP continuous stimulus", claim:"Time near MP (continuous tempo / MP in longs) is the race-specific adaptation.", source:"Canova · Daniels M · Pfitzinger", conf:"expert", detail:"Progressive continuous stimulus ~90–105% MP in specific phase — scaled for Blake, not elite special blocks."},
    {id:"E09", title:"Easy-day discipline", claim:"Most volume must stay easy (≥75–80% low intensity). Gray-zone creep kills adaptation.", source:"Haugen 2022 · Seiler 80/20", conf:"strong", detail:"Potato rule: easy means conversational. Eugene easies at 8:15 @ HR~158 were gray-zone."},
    {id:"E10", title:"Taper", claim:"Cut volume ~41–60%, keep intensity & frequency. Best ES ~2-wk; recreational ~3-wk ~2.6% faster.", source:"Bosquet 2007 MSSE MA · Wang 2023 · Smyth 2021", conf:"strong", detail:"Maintain intensity sparks while volume drops exponentially into race week."},
    {id:"E11", title:"Carb fueling", claim:"60–90 g CHO/h for efforts >~2.5 h; gut trainable (~2 wk ↓ discomfort ~47%).", source:"ACSM 2016 · Jeukendrup 2017 · Martinez 2023", conf:"strong", detail:"Race target 60–90 g/h on long + MP — not elite 120 unless gut-trained."},
    {id:"E12", title:"Strength / plyos", claim:"~2×/wk heavy RT ± plyos improve economy. Do not oversell injury prevention.", source:"Blagrove 2018 SR · 2024 RE/RRI MAs", conf:"mod-strong", detail:"Economy/TT determinants improve; VO2max typically unchanged. RRI prevention: no clear pooled reduction."},
    {id:"E13", title:"HRV / Oura gating", claim:"HRV-guided intensity can improve VO2max vs fixed plans. Never red-smash for ego.", source:"Granero-Gallegos HRV MA · Walsh 2021 · COACH_LOOP", conf:"mod-strong", detail:"Combine Oura readiness + Body Battery + RPE. Red = rest or easy jog."},
    {id:"E14", title:"Injury risk & goal jumps", claim:"~136 lb × rising mpw + 13-min PR→A jump = protect tissues; don’t buy 3:15 with tendon debt.", source:"van Poppel SR · Nielsen · Damsted", conf:"moderate", detail:"Abort-up to B if recurring niggle, 2 failed key sessions, or red streak ≥3 days."},
    {id:"E15", title:"Midweek medium-long", claim:"MLR 10–14 midweek + long supports volume without one-day overload.", source:"Pfitzinger Advanced Marathoning", conf:"expert", detail:"Zero MLR≥10 across all prior Blake builds — the Tucson volume unlock."}
  ],
  races: {
    debut: {name:"Debut Marathon", date:"2024-10-06", result:"4:27:00", peak:38.9, avg:30.9, long:22.4, mlr:0, quality:10, qpw:0.83, note:"Longest long, worst result", pr:false},
    newport: {name:"Newport Marathon", date:"2025-06-01", result:"3:42:06", peak:48.6, avg:36.9, long:20.0, mlr:0, quality:17, qpw:1.42, note:"Highest named quality density; boom-bust valleys", pr:false},
    portland: {name:"Portland Marathon", date:"2025-10-05", result:"3:40:43", peak:46.6, avg:37.2, long:20.0, mlr:0, quality:14, qpw:1.17, note:"Most longs ≥16 (8); only ~1.5 min faster than Newport", pr:false},
    eugene: {name:"Eugene Marathon PR", date:"2026-04-26", result:"3:27:53", peak:45.9, avg:31.5, long:20.0, mlr:0, quality:4, qpw:0.33, note:"Fastest engine + HM tune-up + 2×20; gray-zone easies", pr:true}
  }
};
