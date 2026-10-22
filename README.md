# ESC-C-APE: The Last Bug — Five-Team Edition

A cinematic C-programming escape-room website for five teams. Each team gets three team-specific questions, a 10-minute timer, and one key digit for each correct answer. The three recovered digits form that team’s final vault code. Ocean Navy is the default theme.

## Deploy
Upload all files and the complete `assets/` folder to the root of your GitHub repository. Vercel can redeploy automatically after commit.

## Access
The organizer passcode is checked by the front-end start form and is not shown on the home page. For a public static website, a front-end passcode is a convenience gate, not strong security: anyone inspecting client-side JavaScript can discover it.

## Question note
All five Q2 challenges now use explicitly numbered C snippets. Teams identify the lines with syntax or logic/output errors, add those line numbers, and submit the sum. The factorial question includes a comment explaining factorial. The website awards the configured key digit when the correct sum is entered.

Organizer answer key for Q2: Team 1 = 33 (lines 02, 03, 05, 06, 07, 10); Team 2 = 23 (lines 02, 06, 07, 08); Team 3 = 14 (lines 06, 08); Team 4 = 6 (line 06); Team 5 = 6 (line 06).

Note: the front-end answer values are visible to anyone who inspects client-side JavaScript. For a public static website, the passcode is a convenience gate, not strong security.