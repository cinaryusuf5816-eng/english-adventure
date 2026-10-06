# E2E results (generated)

Date: 2026-10-06T19:03:53.266Z

Environment: Windows · Node v24.19.0 · 154.0.4258.53 (headless, playwright-core) · package: release/READY_TO_UPLOAD.zip unzipped to tests/.tmp/ready · served at http://127.0.0.1:8211/test-repo/ and http://127.0.0.1:8212/ by scripts/serve.mjs

**133 passed, 0 failed, 0 skipped**

| Area | Test | Expected | Actual | Result |
|---|---|---|---|---|
| Navigation | Home → Week 1 → Words → Learn → Practise → Home | each screen opens with its heading | Present Simple / Present Simple / Words / Learn / Practise / Present Simple | PASS |
| Navigation | Direct link to a Learn step + reload keeps the step | Step 4 of 12 after reload | Step 4 of 12 | PASS |
| Navigation | Back and forward buttons | back returns to step 4, forward to step 5 | Step 4 of 12 / Step 5 of 12 | PASS |
| Navigation | Arrow keys move exactly one step (no stacked listeners after many screens) | ArrowRight from step 1 → step 2 | #/week/week-01/learn/habits/2 | PASS |
| Navigation | All 12 Learn lessons open with ≥ 9 steps each | 12 lessons, each “Step 1 of N” with N ≥ 9 | Step 1 of 10, Step 1 of 10, Step 1 of 10, Step 1 of 12, Step 1 of 10, Step 1 of 10, Step 1 of 12, Step 1 of 11, Step 1 of 12, Step 1 of 10, Step 1 of 10, Step 1 | PASS |
| Navigation | Learn: Reveal shows the change; answer is hidden again on the next step | hidden → shown → next step hidden | true/true/true | PASS |
| Navigation | Teacher notes open in a dialog, Escape closes it and focus returns | dialog open → closed, focus on button | true/true/Teacher notes | PASS |
| Words | Word card: picture first, Show the word, Hide again; All cards view | phrase hidden → visible → hidden; 12 tiles | true watch TV true tiles=12 open=12 | PASS |
| Errors | Unknown week | friendly message + Home link | This week does not exist. | PASS |
| Errors | Unpublished week (Coming soon) cannot open | message “coming soon” | This week is coming soon. | PASS |
| Errors | Broken hash with HTML in it | not-right message, nothing injected | This link is not right. | PASS |
| Errors | Unknown page | Page not found | Page not found. | PASS |
| Errors | Missing week file (HTTP 404) | “file was not found” message, app still usable | The file was not found. | PASS |
| Errors | Broken JSON in the question file | “file is broken” message | The file is broken. | PASS |
| Errors | Missing picture shows a clear “Picture not available” box | no broken image icon; text shown | Picture not available | PASS |
| mcq | Empty answer: Check gives a message and no attempt | message; attempts 0 | Choose or write an answer first. | PASS |
| mcq | Wrong answer: specific hint, can try again; then correct | status correct-retry, firstCorrect false | correct-retry attempts=2 hint=true | PASS |
| mcq | Hint button opens the hint and is recorded | hint visible; hintUsed true | true | PASS |
| mcq | Double click on Check with the right answer adds only one point | attempts 1, status correct-first | correct-first attempts=1 | PASS |
| mcq | Show answer: answer appears, no point, buttons locked | status shown; Check disabled | shown true | PASS |
| mcq | Going back to a finished question keeps its result (no second point) | question 1 still correct-retry and locked | First try: 1 · Done: 3 of 3 | PASS |
| jumbled | Empty answer: Check gives a message and no attempt | message; attempts 0 | Choose or write an answer first. | PASS |
| jumbled | Wrong answer: specific hint, can try again; then correct | status correct-retry, firstCorrect false | correct-retry attempts=2 hint=true | PASS |
| jumbled | Hint button opens the hint and is recorded | hint visible; hintUsed true | true | PASS |
| jumbled | Double click on Check with the right answer adds only one point | attempts 1, status correct-first | correct-first attempts=1 | PASS |
| jumbled | Show answer: answer appears, no point, buttons locked | status shown; Check disabled | shown true | PASS |
| jumbled | Going back to a finished question keeps its result (no second point) | question 1 still correct-retry and locked | First try: 1 · Done: 3 of 3 | PASS |
| fill | Empty answer: Check gives a message and no attempt | message; attempts 0 | Choose or write an answer first. | PASS |
| fill | Wrong answer: specific hint, can try again; then correct | status correct-retry, firstCorrect false | correct-retry attempts=2 hint=true | PASS |
| fill | Hint button opens the hint and is recorded | hint visible; hintUsed true | true | PASS |
| fill | Double click on Check with the right answer adds only one point | attempts 1, status correct-first | correct-first attempts=1 | PASS |
| fill | Show answer: answer appears, no point, buttons locked | status shown; Check disabled | shown true | PASS |
| fill | Going back to a finished question keeps its result (no second point) | question 1 still correct-retry and locked | First try: 1 · Done: 3 of 3 | PASS |
| change | Empty answer: Check gives a message and no attempt | message; attempts 0 | Choose or write an answer first. | PASS |
| change | Wrong answer: specific hint, can try again; then correct | status correct-retry, firstCorrect false | correct-retry attempts=2 hint=true | PASS |
| change | Hint button opens the hint and is recorded | hint visible; hintUsed true | true | PASS |
| change | Double click on Check with the right answer adds only one point | attempts 1, status correct-first | correct-first attempts=1 | PASS |
| change | Show answer: answer appears, no point, buttons locked | status shown; Check disabled | shown true | PASS |
| change | Going back to a finished question keeps its result (no second point) | question 1 still correct-retry and locked | First try: 1 · Done: 3 of 3 | PASS |
| fix | Empty answer: Check gives a message and no attempt | message; attempts 0 | Tap the wrong word first. | PASS |
| fix | Wrong answer: specific hint, can try again; then correct | status correct-retry, firstCorrect false | correct-retry attempts=2 hint=true | PASS |
| fix | Hint button opens the hint and is recorded | hint visible; hintUsed true | true | PASS |
| fix | Double click on Check with the right answer adds only one point | attempts 1, status correct-first | correct-first attempts=1 | PASS |
| fix | Show answer: answer appears, no point, buttons locked | status shown; Check disabled | shown true | PASS |
| fix | Going back to a finished question keeps its result (no second point) | question 1 still correct-retry and locked | First try: 1 · Done: 3 of 3 | PASS |
| decide | Empty answer: Check gives a message and no attempt | message; attempts 0 | Choose or write an answer first. | PASS |
| decide | Wrong answer: specific hint, can try again; then correct | status correct-retry, firstCorrect false | correct-retry attempts=2 hint=true | PASS |
| decide | Hint button opens the hint and is recorded | hint visible; hintUsed true | true | PASS |
| decide | Double click on Check with the right answer adds only one point | attempts 1, status correct-first | correct-first attempts=1 | PASS |
| decide | Show answer: answer appears, no point, buttons locked | status shown; Check disabled | shown true | PASS |
| decide | Going back to a finished question keeps its result (no second point) | question 1 still correct-retry and locked | First try: 1 · Done: 3 of 3 | PASS |
| dialogue | Empty answer: Check gives a message and no attempt | message; attempts 0 | Choose or write an answer first. | PASS |
| dialogue | Wrong answer: specific hint, can try again; then correct | status correct-retry, firstCorrect false | correct-retry attempts=2 hint=true | PASS |
| dialogue | Hint button opens the hint and is recorded | hint visible; hintUsed true | true | PASS |
| dialogue | Double click on Check with the right answer adds only one point | attempts 1, status correct-first | correct-first attempts=1 | PASS |
| dialogue | Show answer: answer appears, no point, buttons locked | status shown; Check disabled | shown true | PASS |
| dialogue | Going back to a finished question keeps its result (no second point) | question 1 still correct-retry and locked | First try: 1 · Done: 3 of 3 | PASS |
| reading | Empty answer: Check gives a message and no attempt | message; attempts 0 | Choose or write an answer first. | PASS |
| reading | Wrong answer: specific hint, can try again; then correct | status correct-retry, firstCorrect false | correct-retry attempts=2 hint=true | PASS |
| reading | Hint button opens the hint and is recorded | hint visible; hintUsed true | true | PASS |
| reading | Double click on Check with the right answer adds only one point | attempts 1, status correct-first | correct-first attempts=1 | PASS |
| reading | Show answer: answer appears, no point, buttons locked | status shown; Check disabled | shown true | PASS |
| reading | Going back to a finished question keeps its result (no second point) | question 1 still correct-retry and locked | First try: 1 · Done: 3 of 3 | PASS |
| mcq | Options are shuffled for display but checked by option id | shown order differs for some questions; right id is right | 12/12 shuffled | PASS |
| mcq | Re-drawing the same question keeps the same option order | same order after reload | c,b,a / c,b,a | PASS |
| Practise | First/last limits and skipping | Previous disabled on Q1; last shows Finish; skipped stays unanswered | prevDisabled=true | PASS |
| Practise | Finish with unanswered questions asks first; results count them as not answered | confirm dialog; results: 3 not answered | asked=true notAnswered=3 | PASS |
| jumbled | Two cards with the same word (“Do … do”) work as two separate cards | both placed; answer correct | placed=5 correct-first | PASS |
| jumbled | Keyboard only: Tab to a card, Enter places it; Undo and tapping a placed card remove it | line count 2 → 1 → 0 | 2 → 1 → 0 | PASS |
| jumbled | Clear empties the sentence; records stay | line empty after Clear | cleared | PASS |
| jumbled | Both correct orders are accepted (“Every day I read a book.”) | correct-first | correct-first | PASS |
| jumbled | A really wrong order is not accepted | status trying | trying | PASS |
| Typed answers | Curly apostrophe, extra spaces and capitals are accepted | “  he DOESN’T   play football ” → correct | correct-first | PASS |
| Typed answers | “does not” is accepted for doesn't | correct | correct-first | PASS |
| Typed answers | don't vs doesn't is still graded | “He don't play football.” → not correct | trying | PASS |
| Typed answers | “dont” without apostrophe is not accepted but the learner is told | trying + note about don't | trying / Not yet. Almost! Write don't with ' . Try again, or tap Show answer. | PASS |
| Typed answers | Fill: “do not” accepted for don't; Enter key checks | correct-first | correct-first | PASS |
| Typed answers | Question with small i shows a gentle tip | correct + tip | Correct! I don't watch TV. Tip: write I with a big letter. | PASS |
| Sessions | Settings from the link: 5 negative questions | 5 questions, all negative | 5 true | PASS |
| Sessions | Resume after leaving | Resume button shows question 2 and opens it | Resume (question 2 of 5) → Question 2 of 5 | PASS |
| Sessions | Retry mistakes makes a new round; first round results unchanged | round 2 with 4 questions; parent kept first-try 1 | first=1 round=2 n=4 | PASS |
| Sessions | Restart activity asks first and starts a new set | confirm → setup screen → new session id | smux1q2r9ihhp → smux1q2ubbx37 | PASS |
| Sessions | Cancel in a confirm dialog changes nothing | same session after Cancel | unchanged | PASS |
| Sessions | New lesson (new class) removes only this week + mode, after a yes | mcq session gone; other app keys kept | session=null other=keep me | PASS |
| Modes | Classroom and Practice keep separate answers | answer shown in Practice is not shown in Classroom | classroom=true cardInClassroom=0 shownBack=1 | PASS |
| Storage | localStorage blocked: lessons still work, note is shown | note visible; practice question can be answered | Saving is off on this device. You can still use every lesson. | PASS |
| Storage | Storage full: app keeps working and says so | “device is full” note; question still checks | This device is full. New progress is not saved, but the lesson works. | PASS |
| Storage | Broken saved data is removed, page still opens | setup screen opens; note about broken data | Some saved progress was broken and was removed. The lesson works. | PASS |
| Storage | Saved session pointing to removed questions does not crash | unknown ids dropped; known question shown | Question 1 of 1 | PASS |
| Week 2 | A template week can be added without code changes; Week 1 progress stays | Week 2 opens; Week 1 saved session still there | cards=2 title=TEST WEEK (not real content) banks=8 resume=1 | PASS |
| Pictures | Every picture used by Week 1 loads (all 21 week images + covers) | naturalWidth > 0 for each | 96 files loaded | PASS |
| Pictures | Images have alt text that does not give answers | all <img> on word grid have alt; none mention “answer” | 12 images | PASS |
| Tools | Full screen button does not break the page (allowed or refused) | page still works after click | clicked | PASS |
| Tools | Copy link without clipboard permission shows the link to select | dialog with the current URL | http://127.0.0.1:8211/test-repo/#/ | PASS |
| Tools | Listen buttons are hidden when there is no English voice, or work when there is | no visible broken speaker button | voices=false visibleButtons=0 | PASS |
| Screens | 1920×1080: no sideways scrolling on 20 screens + every question type | scrollWidth ≤ width everywhere; Check button inside the screen width | ok | PASS |
| Screens | 1920×1080: small buttons are at least 44×44 px | no button smaller than 44 px | 0 small | PASS |
| Screens | 1366×768: no sideways scrolling on 20 screens + every question type | scrollWidth ≤ width everywhere; Check button inside the screen width | ok | PASS |
| Screens | 1366×768: small buttons are at least 44×44 px | no button smaller than 44 px | 0 small | PASS |
| Screens | 1024×768: no sideways scrolling on 20 screens + every question type | scrollWidth ≤ width everywhere; Check button inside the screen width | ok | PASS |
| Screens | 1024×768: small buttons are at least 44×44 px | no button smaller than 44 px | 0 small | PASS |
| Screens | 768×1024: no sideways scrolling on 20 screens + every question type | scrollWidth ≤ width everywhere; Check button inside the screen width | ok | PASS |
| Screens | 768×1024: small buttons are at least 44×44 px | no button smaller than 44 px | 0 small | PASS |
| Screens | 390×844: no sideways scrolling on 20 screens + every question type | scrollWidth ≤ width everywhere; Check button inside the screen width | ok | PASS |
| Screens | 390×844: small buttons are at least 44×44 px | no button smaller than 44 px | 0 small | PASS |
| Modes | Classroom mode: example sentences 32–44 px on a 1920×1080 board | font-size between 32 and 44 | 44px | PASS |
| Games | Reduced motion: Question Door opens with the right question; wrong gives a hint | hint on wrong; door open + answer on right | The door opens! Does Sam play football? — Yes, he does. | PASS |
| Games | Sentence Switch builds correct + / − / ? with he and has | She has breakfast. / She doesn't have breakfast. / Does she have breakfast? | She has breakfast. / She doesn't have breakfast. / Does she have breakfast? / Yes, she does. No, she doesn't. | PASS |
| Games | Memory Match: a right pair stays open, a wrong pair closes again | pair matched; wrong pair closed; 12 cards | cards=12 done=2 open=0 Pairs: 1 of 6 · Turns: 2 | PASS |
| Games | Yes or No?: wrong gives the hint, right short answer is scored once | hint; First try 0 · Done 1 after a wrong first try | First try: 0 · Done: 1 of 20 | PASS |
| Games | Spin and Say: spin gives a sentence that matches the slots (verified forms) | answer hidden → shown, ends with . or ? | I / ? question → Do I smile at friends? | PASS |
| Games | Picture Reveal: open pieces, reveal word and sentence separately, next picture | tiles open; word then sentence; picture 2 | 1 true false He plays football. Picture 2 of 37 | PASS |
| Speak | Speaking card: help and example are optional; Done / Try again need no microphone | help hidden → shown; marks work | For example: Yes, I do. I play football every day. / Well spoken! | PASS |
| Learn | “Now you try” step: wrong → Try again, right → explanation | try-again then Yes! | Try again. / Yes! Sam plays football on Saturday. | PASS |
| Examples | Change Machine: + → − step by step; the ending moves to does | 4 rows, last “Sam doesn't play football.”, rule frame shown | 4 rows · Sam doesn't play football. · frame=true | PASS |
| Examples | Change Machine: has → have in a Does question | “Does she have breakfast?” | Does she have breakfast? | PASS |
| Examples | Change Machine inside a Learn step | Learn 7 step 2 ends with doesn't | He doesn't play football. | PASS |
| Words | Book words set: 10 cards; first card “live in a city” | Card 1 of 10 | Card 1 of 10 · live in a city | PASS |
| Practise | Book words bank (I): 30 questions; a picture question is checked | 30 questions; correct-first | 30 questions | PASS |
| Challenge | Challenge: 15 mixed core questions; results show stars; My Progress ticks Challenge | 15 · stars · 1/1 | 15 · 0 of 3 stars · ✓ Challenge 1/1 | PASS |
| Progress | My Progress and Today's Mission update from real activity | Learn 3/13; first mission done | Learn 3/13 · is-done | PASS |
| Shell | Week picker: Coming soon weeks cannot be chosen; owl tip changes on click | week-02 disabled; tip changes | true · “Read it. Say it. Do it!” → “Mistakes help you learn!” | PASS |
| Shell | Phone: menu button opens the sidebar; a link closes it and navigates | menu opens; Examples opens | true/true | PASS |
| Badges | Finishing a section shows one celebration with the badge; it does not repeat | Word Finder celebration once | Word Finder · again=0 · earned=1 | PASS |
| Certificate | Certificate shows the typed name and badges; the name is not saved | name on certificate; not in storage | Test Explorer · stored=false · badges=7 | PASS |
| Worksheet | Worksheet: chosen activities → numbered questions + matching answer key | 20 questions and 20 answers by default | 20/20 → 28/28, passages=2 | PASS |
| Worksheet | Print view hides the menu and the settings | sidebar + settings hidden in print media | side=false form=false sheet=true | PASS |
| Games | Listen and Choose: without a voice the teacher can show the sentence; wrong → try again; right → scored | teacher text; First try 0 · Done 1 | Mia and Sam go to school. · First try: 0 · Done: 1 of 10 | PASS |
| Paths | Same package works at the domain root (/) as well as /test-repo/ | home + week + practice question load at / | ok | PASS |
| Console | No console errors or warnings from the app during all tests | 0 | 0 | PASS |
| Network | No failed or 4xx/5xx requests (except tests that force a 404) | 0 | 0 | PASS |
| Network | Requests cancelled by quick screen changes (not errors) | info | 0 | PASS |
| Network | Google Fonts reachable (optional; the site falls back to system fonts) | reachable | reachable | PASS |
