const stages = [
  {
    file: "LEVEL_01.C", kicker: "LEVEL 01 / CONDITIONAL LOGIC", title: "The Access Filter",
    description: "Two filters and a weighted update guard the first file. Check every condition before changing count.",
    code: `int values[] = {5, 12, 9, 18, 21, 14, 6};\nint i, count = 0;\nfor (i = 0; i < 7; i++) {\n    if (values[i] >= 10 && values[i] % 2 == 0 && values[i] % 3 == 0)\n        count += values[i] / 3;\n}\nprintf("%d", count);`,
    question: "What value is printed?", label: "ENTER THE COUNT", placeholder: "Trace each accepted value...", answer: ["10"],
    hint: "A value must be at least 10, even, and divisible by 3. Add one-third of each value that passes all three checks.", success: "Access filter passed.", points: 15, digit: "7"
  },
  {
    file: "LEVEL_02.C", kicker: "LEVEL 02 / LOOP TRACE", title: "The Loop Checkpoint",
    description: "The loop skips by two, but each pass follows a different update rule. Trace the values in order.",
    code: `int i, total = 0;\nfor (i = 1; i <= 9; i += 2) {\n    if (i % 3 == 0)\n        total += i * 2;\n    else\n        total += i;\n}\nprintf("%d", total);`,
    question: "What final value does total contain?", label: "ENTER THE TOTAL", placeholder: "Calculate each loop pass...", answer: ["37"],
    hint: "The loop visits 1, 3, 5, 7, and 9. Double only the values divisible by 3; add the others normally.", success: "Loop checkpoint cleared.", points: 20, digit: "3"
  },
  {
    file: "LEVEL_03.C", kicker: "LEVEL 03 / NESTED LOOPS", title: "The Pairing Protocol",
    description: "A pair is valid only when the second number is larger and their sum is even. Count every valid pair exactly once.",
    code: `int i, j, count = 0;\nfor (i = 1; i <= 4; i++) {\n    for (j = 1; j <= 5; j++) {\n        if (j > i && (i + j) % 2 == 0)\n            count++;\n    }\n}\nprintf("%d", count);`,
    question: "How many valid pairs are counted?", label: "ENTER THE COUNT", placeholder: "Trace the nested loops...", answer: ["4"],
    hint: "For each i, consider only j values greater than i, then keep pairs whose sum is even.", success: "Pairing protocol defeated.", points: 25, digit: "6"
  },
  {
    file: "LEVEL_04.C", kicker: "LEVEL 04 / CODE REVIEW", title: "The Snippet Showdown",
    description: "Both snippets look plausible. Only one counts values that are even and within the inclusive range 1 through 20.",
    choice: true,
    snippets: [
      { label: "SNIPPET A · main.c", code: `if (value >= 1 && value <= 20 && value % 2 == 0)\n    count++;` },
      { label: "SNIPPET B · main.c", code: `if (value >= 1 || value <= 20 && value % 2 == 0)\n    count++;` }
    ],
    question: "Which snippet correctly checks all three requirements? Enter A or B.", label: "CHOOSE A OR B", placeholder: "A or B...", answer: ["a"],
    hint: "The value must satisfy the lower bound, the upper bound, and the even-number test at the same time.", success: "Code review passed.", points: 30, digit: "4"
  },
  {
    file: "LEVEL_05.C", kicker: "LEVEL 05 / INCREMENT AMBUSH", title: "The Increment Ambush",
    description: "Post-increment changes x after its old value is used. On even-numbered passes, y is also reduced by one.",
    code: `int x = 2, y = 0, i;\nfor (i = 0; i < 4; i++) {\n    y += x++;\n    if (i % 2 == 0) y--;\n}\nprintf("%d %d", x, y);`,
    question: "What two values are printed, in order: x then y?", label: "ENTER BOTH VALUES", placeholder: "Trace x and y separately...", answer: ["6 12", "6,12", "6  12"],
    hint: "For each pass, add the current x to y before x increases. Then subtract one when i is 0 or 2.", success: "Increment ambush disarmed.", points: 35, digit: "8"
  },
  {
    file: "LEVEL_06.C", kicker: "LEVEL 06 / ARRAY REASONING", title: "The Return Signal",
    description: "Each array element follows one of three paths. Trace the conditions in order; only the first matching branch runs for each element.",
    code: `int a[] = {5, 12, 7, 18, 9, 4};\nint i, total = 0;\nfor (i = 0; i < 6; i++) {\n    if (a[i] % 3 == 0)\n        total += a[i] / 3;\n    else if (a[i] > 7)\n        total += 2;\n    else\n        total -= 1;\n}\nprintf("%d", total);`,
    question: "What value is printed in total after all six elements are processed?", label: "ENTER THE TOTAL", placeholder: "Follow each branch...", answer: ["10"],
    hint: "For each number, first test divisibility by 3. Only if that fails, test whether it is greater than 7; otherwise subtract 1.", success: "Return signal located.", points: 40, digit: "2"
  },
  {
    file: "LEVEL_07.C", kicker: "LEVEL 07 / WHILE LOOP", title: "The Digit Interrogation",
    description: "A damaged counter processes one digit at a time. Remember that % 10 extracts the last digit and / 10 removes it using integer division.",
    code: `int n = 5832, digit, total = 0;\nwhile (n > 0) {\n    digit = n % 10;\n    if (digit % 2 == 0)\n        total += digit;\n    else\n        total -= digit;\n    n /= 10;\n}\nprintf("%d", total);`,
    question: "What value is printed after every digit has been processed?", label: "ENTER THE FINAL TOTAL", placeholder: "Trace the digits from right to left...", answer: ["2"],
    hint: "The digits are processed from right to left. Add even digits to total and subtract odd digits, then remove the last digit with n /= 10.", success: "Digit interrogation complete.", points: 45, digit: "1"
  },
  {
    file: "LEVEL_08.C", kicker: "LEVEL 08 / WRITE THE CODE", title: "The Final Patch", multiline: true,
    description: "Write a nested-loop solution that prints a four-row star staircase. The inner loop controls stars; the outer loop controls rows.",
    code: `/* Required output: */\n*\n**\n***\n****\n\n// Write the C code that prints this pattern`,
    question: "Write the nested for-loops and printf statements needed to print the four-line pattern exactly.", label: "ENTER YOUR C CODE", placeholder: "Write the outer loop, inner loop, and newline...", answer: [
      'for(i=1;i<=4;i++){for(j=1;j<=i;j++)printf(\"*\");printf(\"\\n\");}',
      'for(i=1;i<=4;i++){for(j=1;j<=i;j++)printf(\"*\");printf(\"\\n\");}',
      'for(i=1;i<=4;i++){for(j=0;j<i;j++)printf(\"*\");printf(\"\\n\");}'
    ],
    hint: "Use an outer loop for row numbers 1 through 4. For each row, print one star per column up to that row, then print a newline.", success: "Pattern generated. All eight keys recovered.", points: 50, digit: "5"
  }
];

const $ = (id) => document.getElementById(id);
let currentStage = 0, score = 0, hintsUsed = 0, remaining = 25 * 60, timerId = null;
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
  const passcode = $("roomPasscode").value.trim().toUpperCase();
  if (!team) { $("teamName").setCustomValidity("Enter your team name before starting."); $("teamName").reportValidity(); $("teamName").focus(); return; }
  if (passcode !== "BUG2026") { $("roomPasscode").setCustomValidity("Incorrect passcode. Ask the previous room organizer for the access passcode."); $("roomPasscode").reportValidity(); $("roomPasscode").focus(); return; }
  $("roomPasscode").setCustomValidity("");
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
  let answerField = $("answerInput");
  if (s.multiline && answerField.tagName !== "TEXTAREA") {
    const area = document.createElement("textarea"); area.id = "answerInput"; area.name = "answerInput"; area.rows = 5; area.maxLength = 1800; area.spellcheck = false; area.required = true; area.setAttribute("aria-label", "Enter your C code in up to five lines"); answerField.replaceWith(area); answerField = area;
  } else if (!s.multiline && answerField.tagName !== "INPUT") {
    const input = document.createElement("input"); input.id = "answerInput"; input.name = "answerInput"; input.autocomplete = "off"; input.spellcheck = false; input.required = true; answerField.replaceWith(input); answerField = input;
  }
  $("questionText").textContent = s.question; $("answerLabel").textContent = s.label; answerField.placeholder = s.multiline ? "Line 1\nLine 2\nLine 3\nLine 4\nLine 5" : s.placeholder; answerField.value = "";
  answerField.disabled = false; $("answerForm").querySelector("button").disabled = false; $("answerForm").querySelector("button").textContent = "SUBMIT ↵";
  answerField.classList.toggle("code-answer", !!s.multiline);
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
  const s = stages[currentStage], rawValue = $("answerInput").value, value = normalize(rawValue); if (!value) return;
  const patternCode = s.multiline && /for\s*\(\s*(?:int\s+)?i\s*=\s*1\s*;\s*i\s*<=\s*4\s*;\s*i\+\+\s*\)[\s\S]*for\s*\(\s*(?:int\s+)?j\s*=\s*(?:1|0)\s*;\s*j\s*<=?\s*i\s*;\s*j\+\+\s*\)[\s\S]*printf\s*\(\s*"\*"\s*\)[\s\S]*printf\s*\(\s*"\\n"\s*\)/i.test(rawValue);
  if (s.multiline ? patternCode : s.answer.map(normalize).includes(value)) {
    completed[currentStage] = true; score += s.points; $("fileStatus").textContent = "CLEARED";
    showFeedback("Correct! Key acquired.", "success"); $("answerInput").disabled = true; $("answerForm").querySelector("button").disabled = true; $("answerForm").querySelector("button").textContent = "CLEARED ✓"; $("hintBtn").disabled = true;
    $("stagePoints").textContent = "LEVEL CLEARED"; updateSidebar(); playTone(880, .16); revealKeyThenContinue();
  } else {
    const roasts = ["Not quite. Recheck both conditions.", "Trace each loop pass carefully.", "List the pairs that satisfy the condition.", "Remember: zero is not positive.", "Compare each value with the one before it.", "Extract the last digit with % 10, then remove it with / 10.", "Use an outer loop for rows and an inner loop for stars."];
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
  $("timerBar").style.width = `${remaining / (25 * 60) * 100}%`; if (remaining <= 180) $("timer").classList.add("danger"); if (remaining === 0) endMission("time");
}
function showFinalVault() {
  if (finished) return;
  hideNotepadForEnd();
  $("puzzlePanel").innerHTML = `<div class="panel-heading"><span class="status-dot"></span> FINAL ACCESS TERMINAL <span class="heading-code">LOCKED</span></div><div class="puzzle-inner"><div class="puzzle-kicker">FINAL CHALLENGE / VAULT ACCESS</div><h2>The Escape Vault</h2><p>All eight keys recovered. Assemble your team's keys in the order earned and enter the resulting eight-digit escape code.</p><div class="code-window"><div class="code-title"><span>vault_access.c</span><span>AUTH REQUIRED</span></div><pre>/* Enter the code your team assembled */\nint access_granted = 0;</pre></div><form id="vaultForm"><label for="vaultInput">EIGHT-DIGIT ESCAPE CODE</label><div class="answer-row"><input id="vaultInput" maxlength="8" inputmode="numeric" pattern="[0-9]{8}" placeholder="Enter your code" autocomplete="off" required /><button class="submit-btn" type="submit">UNLOCK ↵</button></div></form><div class="feedback" id="vaultFeedback" role="status">Two attempts available.</div><div class="puzzle-actions"><span class="stage-points">KEYS MUST BE IN EARNED ORDER</span><span class="stage-points" id="attemptsLeft">2 ATTEMPTS</span></div></div>`;
  $("vaultForm").addEventListener("submit", (e) => { e.preventDefault(); const value = $("vaultInput").value.trim(); if (value === escapeCode) { score += 30; const timeBonus = remaining > 0 ? Math.round((remaining / (25 * 60)) * 15) : 0; score += timeBonus; revealCorrectCode(timeBonus); } else { vaultAttempts--; $("attemptsLeft").textContent = `${vaultAttempts} ATTEMPT${vaultAttempts === 1 ? "" : "S"} LEFT`; if (vaultAttempts <= 0) { endMission("attempts"); return; } $("vaultFeedback").textContent = "Code not accepted. One attempt remains."; $("vaultFeedback").className = "feedback error"; $("vaultInput").value = ""; $("vaultInput").focus(); playTone(170, .2); } });
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
$("roomPasscode").addEventListener("input", () => { const pos = $("roomPasscode").selectionStart; $("roomPasscode").value = $("roomPasscode").value.toUpperCase(); try { $("roomPasscode").setSelectionRange(pos, pos); } catch (_) {} $("roomPasscode").setCustomValidity(""); });
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

const themeNames = ["DARK", "LIGHT", "BLUE LIGHT", "HORROR", "OCEAN", "AMBER"];
let activeTheme = 0;
const themePalette = $("themePalette");
const themeToggle = $("themeToggle");
function applyTheme(index) {
  activeTheme = index;
  document.body.classList.remove("light-theme", "blue-light-theme", "horror-theme", "ocean-theme", "amber-theme");
  if (themeNames[index] === "LIGHT") document.body.classList.add("light-theme");
  if (themeNames[index] === "BLUE LIGHT") document.body.classList.add("blue-light-theme");
  if (themeNames[index] === "HORROR") document.body.classList.add("horror-theme");
  if (themeNames[index] === "OCEAN") document.body.classList.add("ocean-theme");
  if (themeNames[index] === "AMBER") document.body.classList.add("amber-theme");
  document.querySelector('meta[name="theme-color"]').setAttribute("content", ["#07110f", "#f4faf6", "#eef5ff", "#16090d", "#071a2c", "#1d1608"][index]);
  document.querySelectorAll(".theme-swatch").forEach(button => {
    const selected = Number(button.dataset.theme) === index;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}
function closeThemePalette() { themePalette.classList.add("hidden"); themeToggle.setAttribute("aria-expanded", "false"); }
themeToggle.addEventListener("click", () => {
  const opening = themePalette.classList.contains("hidden");
  themePalette.classList.toggle("hidden", !opening);
  themeToggle.setAttribute("aria-expanded", String(opening));
});
document.querySelectorAll(".theme-swatch").forEach(button => button.addEventListener("click", () => {
  applyTheme(Number(button.dataset.theme));
  closeThemePalette();
}));
document.addEventListener("click", event => {
  if (!event.target.closest(".theme-picker-wrap")) closeThemePalette();
});
document.addEventListener("keydown", event => { if (event.key === "Escape") closeThemePalette(); });
applyTheme(0);
