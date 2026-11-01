# ESC-C-APE: The Last Bug (MERN + React Three Fiber)

A 3D C-programming escape room for five teams. Answers, the access code and the timer live on the server, so students cannot read them from the browser.

## Stack
- React 18 + React Three Fiber (three.js) + Vite: client in `client/`
- Node + Express: game server in `server/`
- MongoDB (Mongoose) when `MONGO_URI` is set, otherwise a local JSON file (`server/data.json`). The file mode needs no database and is the safest choice for one laptop.

## Run it (organiser laptop)
1. Install Node.js 18 or newer.
2. In this folder: `npm run setup` (installs everything once, needs internet).
3. `npm run build` (only needed if you change the client; a built copy is already included in `client/dist`).
4. `npm start`, then open http://localhost:5000
5. Other devices on the same Wi-Fi can open http://YOUR-LAPTOP-IP:5000

Access code: every team uses the previous-room access code **KEY8610** (not case sensitive). To change it set `ENTRY_PASS`, or `TEAM1_PASS` to `TEAM5_PASS` for per-team access codes. Other options: `PORT`, `MONGO_URI`, `ADMIN_PASS` (organiser password, default `organiser2026`, change it), `DATA_FILE`.

## Running the event
1. Team enters access code KEY8610, picks its team number (tell each team which number to pick, 1 to 5), types a team name, presses Start mission. A team number that is already in use cannot be taken by a different team name; use Reset in the organiser dashboard if a team picked the wrong number.
2. Rules screen, then a 3-2-1 countdown. The 10 minute clock starts only at GO.
3. Solve the three terminals in any order. Once all three are answered correctly, the vault unlocks automatically.
4. Result screen shows score and time left. Press Home or Next team for the next team.
5. Organiser: your organiser login is saved on the server, so restarting the server does not log you out (if a login ever expires you are sent back to the login form with a message). Open `#organiser` (link at the bottom of the home screen). The dashboard shows every team's status, current question, terminal progress, wrong attempts, score and time. Reset one team with its Reset button. "New event" erases all five teams (asks for confirmation and the word RESET).

The dashboard and the scoreboard read the same server data, so Reset (one team) or New event (all teams) clears the scoreboard automatically within about 2 seconds. A team that is playing when it is reset returns to the home screen with a message. For a projector, open `#scoreboard` (button "Open live scoreboard" in the dashboard); it refreshes by itself.

## Rules built in
Two attempts per question. Wrong attempt: minus 5 points and 1 minute. Two wrong attempts on a question end the mission. One hint per question (minus 3 points). The vault unlocks automatically after all three questions are solved. The clock keeps running throughout the mission. Debug questions: enter the SUM of faulty line numbers; syntax and logic errors both count.

## What is different from the earlier HTML version
New: server-side answer checking and timing (timestamps, survives refresh and background tabs), per-team progress that is saved on the server, organiser dashboard, scoreboard sorted by escaped, score, time left, 5 fixed teams, sound effects with an on/off button, a 3D fallback backdrop if WebGL or three.js fails, and richer 3D: blast-door entry, shutters opening per solved terminal, vault door swing, alarm lights, spark bursts, camera shake on wrong answers and a golden treasure chamber finale.
Questions and answers are unchanged and were re-verified.

## Animations (all 3D)
Entry: blast doors slide open and the camera flies in. Play: floating C keywords, alarm lights, hover glow on terminals, a visual energy pulse from each solved terminal to its lamp on the vault wall, shutters opening, spark bursts, red flash and camera shake on a wrong answer, alarm strobe on failure.
Vault: when all three terminals are solved the terminals sink into the floor, the wheel spins, eight bolts retract, a shockwave ring spreads, the door swings open with light beams and sparks, then the camera flies into a golden chamber with a spinning trophy, confetti and fireworks. The congratulations screen appears over it.

## Honest limitations
- All teams share one access code, so the team number is chosen by the team. A team that knows another team's name could rejoin that run.
- The access code is a plain environment value; use a private laptop.
- The JSON file store is single-machine. For several servers use MongoDB.
- The game was tested automatically in headless Chromium (software WebGL) and the server API with scripts, not on a real GPU or phone; test once on the event laptop and projector first.
- Hint text appears after a hint is used and the explanation after a question ends, both sent by the server only at that moment.
