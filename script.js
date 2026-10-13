const stages = [
  {
    file: "LEVEL_01.C", kicker: "LEVEL 01 / CONDITIONAL LOGIC", title: "The Access Filter",
    description: "A security check accepts a value only when both conditions are true. Trace the loop carefully.",
    code: `int values[] = {4, 7, 10, 13, 16};\nint i, count = 0;\nfor (i = 0; i < 5; i++) {\n    if (values[i] >= 10 && values[i] % 2 == 0)\n        count++;\n}\nprintf("%d", count);`,
    question: "What value is printed?", label: "ENTER THE COUNT", placeholder: "Final count...", answer: ["2"],
    hint: "Count only values that are both at least 10 and divisible by 2.", success: "Access filter passed.", points: 15, digit: "7"
  },
  {
    file: "LEVEL_02.C", kicker: "LEVEL 02 / LOOP TRACE", title: "The Loop Checkpoint",
    description: "Follow the update expression and the condition. The loop stops as soon as its condition becomes false.",
    code: `int i, total = 0;\nfor (i = 2; i <= 8; i += 2) {\n    total += i / 2;\n}\nprintf("%d", total);`,
    question: "What is the final value of total?", label: "ENTER THE TOTAL", placeholder: "Trace each pass...", answer: ["10"],
    hint: "The loop visits 2, 4, 6, and 8. Add each value after integer-dividing it by 2.", success: "Loop checkpoint cleared.", points: 20, digit: "3"
  },
  {
    file: "LEVEL_03.C", kicker: "LEVEL 03 / NESTED LOOPS", title: "The Pairing Protocol",
    description: "Nested loops build pairs. Only pairs where the first value is smaller than the second are accepted.",
    code: `int i, j, count = 0;\nfor (i = 1; i <= 4; i++) {\n    for (j = 1; j <= 4; j++) {\n        if (i < j) count++;\n    }\n}\nprintf("%d", count);`,
    question: "How many times does count increase?", label: "ENTER THE COUNT", placeholder: "Count the valid pairs...", answer: ["6"],
    hint: "For i=1 there are 3 valid j values; for i=2 there are 2; for i=3 there is 1; for i=4 there are none.", success: "Pairing protocol defeated.", points: 25, digit: "6"
  },
  {
    file: "LEVEL_04.C", kicker: "LEVEL 04 / CODE REVIEW", title: "The Snippet Showdown",
    description: "Two short C snippets solve a real task. Compare them and select the one that counts the number of positive values.",
    choice: true,
    snippets: [
      { label: "SNIPPET A · main.c", code: `if (value > 0)\n    count++;` },
      { label: "SNIPPET B · main.c", code: `if (value >= 0)\n    count++;` }
    ],
    question: "Which snippet counts positive values only? Enter A or B.", label: "CHOOSE A OR B", placeholder: "A or B...", answer: ["a"],
    hint: "Zero is not positive. Check whether the condition includes zero.", success: "Code review passed.", points: 30, digit: "4"
  },
  {
    file: "LEVEL_05.C", kicker: "LEVEL 05 / ARRAY REASONING", title: "The Array Interrogation",
    description: "Walk through the array and update the result only when the current value is greater than the previous value.",
    code: `int a[] = {3, 8, 5, 9, 7};\nint i, count = 0;\nfor (i = 1; i < 5; i++) {\n    if (a[i] > a[i - 1]) count++;\n}\nprintf("%d", count);`,
    question: "How many times does count increase?", label: "ENTER THE COUNT", placeholder: "Compare adjacent values...", answer: ["2"],
    hint: "Compare 8 with 3, 5 with 8, 9 with 5, and 7 with 9.", success: "Array interrogation complete.", points: 35, digit: "8"
  },
  {
    file: "LEVEL_06.C", kicker: "LEVEL 06 / FUNCTION LOGIC", title: "The Return Signal",
    description: "A function returns the first value that meets its condition. If none qualify, it returns -1.",
    code: `int firstMatch(int a[]) {\n    int i;\n    for (i = 0; i < 5; i++) {\n        if (a[i] % 3 == 0 && a[i] > 5)\n            return a[i];\n    }\n    return -1;\n}\n// a = {4, 6, 8, 9, 12}`, 
    question: "What value does firstMatch return for the given array?", label: "ENTER THE RETURN VALUE", placeholder: "Returned value...", answer: ["6"],
    hint: "The function returns immediately at the first value divisible by 3 and greater than 5.", success: "Return signal located.", points: 40, digit: "2"
  },
  {
    file: "LEVEL_07.C", kicker: "LEVEL 07 / WRITE THE CODE", title: "The Final Patch",
    description: "Final level: use an if-else statement to store the larger of two numbers in max.",
    code: `int a = 14, b = 9;\nint max;\n// Use if-else to assign the larger value to max`,
    question: "Write a valid if-else statement that assigns the larger value of a and b to max. Keep it on one line.", label: "ENTER ONE LINE OF C", placeholder: "Write your if-else statement...", answer: ['if(a>b)max=a;else max=b', 'if(a>b)max=a;else max=b;', 'if(a>b){max=a;}else{max=b;}', 'if(a>b){max=a;}else{max=b;}'],
    hint: "Use a comparison in the if condition, then assign a value to max in each branch.", success: "Final patch compiled. All seven keys recovered.", points: 50, digit: "5"
  }
];

const $ = (id) => document.getElementById(id);
let currentStage = 0, score = 0, hintsUsed = 0, remaining = 20 * 60, timerId = null;
let completed = stages.map(() => false), hintShown = stages.map(() => false);
let started = false, finished = false, soundOn = true, audioCtx = null, vaultAttempts = 2, activeTeamName = "";
const escapeCode = stages.map(s => s.digit).join("");
function normalize(value) { return value.trim().toLowerCase().replace(/\s+/g, "").replace(/;$/, ""); }
function playTone(freq = 660, duration = 0.09) {
  if (!soundOn) return;
  try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); const osc = audioCtx.createOscillator(), gain = audioCtx.createGain(); osc.frequency.value = freq; osc.type = "sine"; gain.gain.setValueAtTime(0.06, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration); osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + duration); } catch (_) {}
}
function showFeedback(message, type = "") { const el = $("feedback"); el.textContent = message; el.className = "feedback" + (type ? " " + type : ""); }
function startMission() {
  if (started) return;
  const team = $("teamName").value.trim();
  if (!team) { $("teamName").setCustomValidity("Enter your team name before starting."); $("teamName").reportValidity(); $("teamName").focus(); return; }
  started = true; $("teamName").setCustomValidity(""); activeTeamName = team;
  $("notepadToggle").classList.remove("hidden"); $("notepadPanel").classList.add("hidden"); $("notepadToggle").setAttribute("aria-expanded", "false");
  $("activeTeam").textContent = activeTeamName; $("briefing").classList.add("hidden"); $("game").classList.remove("hidden");
  if ($("leaderNote")) $("leaderNote").classList.add("hidden"); renderStage(0); timerId = setInterval(tick, 1000); playTone(520);
}
function renderStage(index) {
  currentStage = index; const s = stages[index];
  $("fileLabel").textContent = s.file; $("fileStatus").textContent = "IN PROGRESS";
  $("puzzleKicker").textContent = s.kicker; $("puzzleTitle").textContent = s.title; $("puzzleDescription").textContent = s.description;
  const block = $("codeBlock");
  if (s.choice) {
    block.classList.add("snippet-compare");
    block.innerHTML = s.snippets.map((item, i) => `<div class="snippet-card"><div class="snippet-card-title">${item.label}</div><pre>${item.code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></div>`).join("");
  } else { block.classList.remove("snippet-compare"); block.textContent = s.code || "/* Challenge code could not load. Please reset the mission and try again. */"; }
  $("questionText").textContent = s.question; $("answerLabel").textContent = s.label; $("answerInput").placeholder = s.placeholder; $("answerInput").value = "";
  $("answerInput").disabled = false; $("answerForm").querySelector("button").disabled = false; $("answerForm").querySelector("button").textContent = "SUBMIT ↵";
  $("hintBox").classList.toggle("hidden", !hintShown[index]); $("hintBox").textContent = hintShown[index] ? "HINT // " + s.hint : "";
  $("hintBtn").disabled = hintShown[index]; $("hintBtn").style.opacity = $("hintBtn").disabled ? ".45" : "1";
  $("stagePoints").textContent = `${s.points} PTS AVAILABLE`; showFeedback("Ready when your team is."); updateSidebar();
}
function updateSidebar() {
  $("score").textContent = score; $("hintsUsed").textContent = hintsUsed;
  const count = completed.filter(Boolean).length; $("progressText").textContent = `${count} / ${stages.length}`; $("progressBar").style.width = `${count / stages.length * 100}%`;
  document.querySelectorAll(".stage-item").forEach((el, i) => { el.classList.toggle("active", i === currentStage && !finished); el.classList.toggle("complete", completed[i]); el.classList.toggle("locked", i > count && !completed[i]); el.querySelector(".stage-state").textContent = completed[i] ? "✓" : (i <= count ? "●" : "🔒"); });
}
function revealKeyThenContinue() {
  const overlay = $("keyReveal"); $("earnedKey").textContent = stages[currentStage].digit; overlay.classList.remove("hidden");
  setTimeout(() => {
    overlay.classList.add("hidden");
    if (finished) return;
    if (completed.every(Boolean)) showFinalVault();
    else { const next = completed.findIndex(v => !v); renderStage(next); showFeedback(`Level ${next + 1} unlocked. Keep going.`, "success"); }
  }, 1000);
}
function submitAnswer(event) {
  event.preventDefault(); if (finished || completed[currentStage]) return;
  const s = stages[currentStage], value = normalize($("answerInput").value); if (!value) return;
  if (s.answer.map(normalize).includes(value)) {
    completed[currentStage] = true; score += s.points; $("fileStatus").textContent = "CLEARED";
    showFeedback("Correct! Key acquired.", "success"); $("answerInput").disabled = true; $("answerForm").querySelector("button").disabled = true; $("answerForm").querySelector("button").textContent = "CLEARED ✓"; $("hintBtn").disabled = true;
    $("stagePoints").textContent = "LEVEL CLEARED"; updateSidebar(); playTone(880, .16); revealKeyThenContinue();
  } else {
    const roasts = ["Not quite. Recheck both conditions.", "Trace each loop pass carefully.", "List the pairs that satisfy the condition.", "Remember: zero is not positive.", "Compare each value with the one before it.", "The function returns at the first match.", "Compare the two values and check your assignment."];
    showFeedback("✕ " + roasts[currentStage], "error"); playTone(180, .13); $("answerInput").select();
  }
}
function requestHint() {
  if (hintShown[currentStage] || completed[currentStage]) return;
  hintShown[currentStage] = true; hintsUsed++; score = Math.max(0, score - 3); $("hintBox").textContent = "HINT // " + stages[currentStage].hint; $("hintBox").classList.remove("hidden"); $("hintBtn").disabled = true;
  showFeedback("Hint used. 3 points deducted.", "error"); updateSidebar(); playTone(430);
}
function tick() {
  if (finished) return; remaining = Math.max(0, remaining - 1);
  $("timer").textContent = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  $("timerBar").style.width = `${remaining / (20 * 60) * 100}%`; if (remaining <= 180) $("timer").classList.add("danger"); if (remaining === 0) endMission("time");
}
function showFinalVault() {
  if (finished) return;
  hideNotepadForEnd();
  $("puzzlePanel").innerHTML = `<div class="panel-heading"><span class="status-dot"></span> FINAL ACCESS TERMINAL <span class="heading-code">LOCKED</span></div><div class="puzzle-inner"><div class="puzzle-kicker">FINAL CHALLENGE / VAULT ACCESS</div><h2>The Escape Vault</h2><p>All seven keys recovered. Assemble your team's keys in the order earned and enter the resulting seven-digit escape code.</p><div class="code-window"><div class="code-title"><span>vault_access.c</span><span>AUTH REQUIRED</span></div><pre>/* Enter the code your team assembled */\nint access_granted = 0;</pre></div><form id="vaultForm"><label for="vaultInput">SEVEN-DIGIT ESCAPE CODE</label><div class="answer-row"><input id="vaultInput" maxlength="7" inputmode="numeric" pattern="[0-9]{7}" placeholder="Enter your code" autocomplete="off" required /><button class="submit-btn" type="submit">UNLOCK ↵</button></div></form><div class="feedback" id="vaultFeedback" role="status">Two attempts available.</div><div class="puzzle-actions"><span class="stage-points">KEYS MUST BE IN EARNED ORDER</span><span class="stage-points" id="attemptsLeft">2 ATTEMPTS</span></div></div>`;
  $("vaultForm").addEventListener("submit", (e) => { e.preventDefault(); const value = $("vaultInput").value.trim(); if (value === escapeCode) { score += 30; const timeBonus = remaining > 0 ? Math.round((remaining / (20 * 60)) * 15) : 0; score += timeBonus; revealCorrectCode(timeBonus); } else { vaultAttempts--; $("attemptsLeft").textContent = `${vaultAttempts} ATTEMPT${vaultAttempts === 1 ? "" : "S"} LEFT`; if (vaultAttempts <= 0) { endMission("attempts"); return; } $("vaultFeedback").textContent = "Code not accepted. One attempt remains."; $("vaultFeedback").className = "feedback error"; $("vaultInput").value = ""; $("vaultInput").focus(); playTone(170, .2); } });
  $("vaultInput").focus();
}
function revealCorrectCode(timeBonus) {
  finished = true; clearInterval(timerId);
  $("earnedKey").textContent = escapeCode; $("keyReveal").querySelector("span").textContent = "CORRECT ESCAPE CODE"; $("keyReveal").classList.remove("hidden");
  $("codeModal").classList.remove("hidden"); playTone(880, .25); setTimeout(() => playTone(1100, .3), 150);
  setTimeout(() => { $("keyReveal").classList.add("hidden"); $("codeModal").classList.add("hidden"); finishSuccess(timeBonus); }, 3000);
}
function finishSuccess(timeBonus) {
  hideNotepadForEnd(); $("game").classList.add("hidden"); $("finalScreen").classList.remove("hidden");
  $("finalIcon").textContent = "✓"; $("finalIcon").style.color = "var(--green)"; $("finalIcon").style.borderColor = "var(--green)";
  $("finalTitle").textContent = "CONGRATULATIONS!"; $("finalMessage").textContent = `Your team unlocked the vault. ${timeBonus} bonus points earned for time remaining.`;
  populateResults();
}
function endMission(reason) {
  if (finished) return; hideNotepadForEnd(); finished = true; clearInterval(timerId); $("game").classList.add("hidden"); $("finalScreen").classList.remove("hidden");
  $("finalIcon").textContent = "×"; $("finalIcon").style.color = "var(--red)"; $("finalIcon").style.borderColor = "var(--red)";
  if (reason === "time") { $("finalTitle").textContent = "TIME'S UP"; $("finalMessage").textContent = "The timer has ended. Reset the mission when the next team is ready."; }
  else { $("finalTitle").textContent = "VAULT SEALED"; $("finalMessage").textContent = "Both code attempts were used. Reset the mission for the next team."; }
  populateResults();
}
function populateResults() { $("finalTeam").textContent = activeTeamName || $("teamName").value.trim() || "Team"; $("finalScore").textContent = `${score} PTS`; $("finalTime").textContent = $("timer").textContent; if ($("leaderNote")) $("leaderNote").classList.add("hidden"); }
function restartMission() { window.location.href = window.location.pathname; }
$("startBtn").addEventListener("click", startMission); $("teamName").addEventListener("keydown", e => { if (e.key === "Enter") startMission(); });
$("answerForm").addEventListener("submit", submitAnswer); $("hintBtn").addEventListener("click", requestHint); $("restartBtn").addEventListener("click", restartMission);
$("soundToggle").textContent = "SFX: ON";
$("teamName").addEventListener("input", () => $("teamName").setCustomValidity(""));
$("soundToggle").addEventListener("click", () => { soundOn = !soundOn; $("soundToggle").textContent = soundOn ? "SFX: ON" : "SFX: OFF"; if (soundOn) playTone(660); });

function hideNotepadForEnd() {
  const toggle = $("notepadToggle"), panel = $("notepadPanel");
  if (toggle) toggle.classList.add("hidden");
  if (panel) panel.classList.add("hidden");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
}
function setNotepadOpen(open) {
  $("notepadPanel").classList.toggle("hidden", !open);
  $("notepadToggle").setAttribute("aria-expanded", String(open));
  $("notepadToggle").textContent = open ? "✎ CLOSE NOTEPAD" : "✎ TEAM NOTEPAD";
}
$("notepadToggle").addEventListener("click", () => setNotepadOpen($("notepadPanel").classList.contains("hidden")));
$("notepadClose").addEventListener("click", () => setNotepadOpen(false));
$("clearDrawing").addEventListener("click", () => {
  const canvas = $("drawingCanvas"), ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
});
(function setupDrawingBoard() {
  const canvas = $("drawingCanvas"), ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#08794b"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
  let drawing = false;
  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  }
  canvas.addEventListener("pointerdown", event => {
    drawing = true; canvas.setPointerCapture(event.pointerId);
    const p = point(event); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + .1, p.y + .1); ctx.stroke();
  });
  canvas.addEventListener("pointermove", event => {
    if (!drawing) return; const p = point(event); ctx.lineTo(p.x, p.y); ctx.stroke();
  });
  const stop = () => { drawing = false; ctx.beginPath(); };
  canvas.addEventListener("pointerup", stop); canvas.addEventListener("pointercancel", stop); canvas.addEventListener("lostpointercapture", stop);
})();

$("themeToggle").addEventListener("click", () => { const light = document.body.classList.toggle("light-theme"); $("themeToggle").textContent = light ? "☾ DARK MODE" : "☼ LIGHT MODE"; document.querySelector('meta[name="theme-color"]').setAttribute("content", light ? "#f4faf6" : "#07110f"); });
