// ==========================================
// TARKPATH - Logic Building Learning Platform
// Think. Build. Solve.
// ==========================================

const $ = (selector) => document.querySelector(selector);

// ---------- STATE AND STORAGE ----------

const DEFAULT_STATE = {
    user: "",
    level: "",
    lang: "Python",
    done: [],
    solved: 0,
    hints: 0,
    runs: 0,
    pass: 0,
    step: 0,
    hint: 0,
    score: 0,
    notes: {},
    attempts: {},
    history: []
};

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem("tp"));

        if (!saved || typeof saved !== "object") {
            return { ...DEFAULT_STATE };
        }

        return {
            ...DEFAULT_STATE,
            ...saved,
            done: Array.isArray(saved.done) ? saved.done : [],
            notes: saved.notes && typeof saved.notes === "object"
                ? saved.notes
                : {},
            attempts: saved.attempts && typeof saved.attempts === "object"
                ? saved.attempts
                : {},
            history: Array.isArray(saved.history) ? saved.history : []
        };
    } catch {
        return { ...DEFAULT_STATE };
    }
}

let S = loadState();

const save = () => {
    try {
        localStorage.setItem("tp", JSON.stringify(S));
    } catch (error) {
        console.warn("Progress could not be saved.", error);
    }
};

const cap = (value) =>
    value.charAt(0).toUpperCase() + value.slice(1);

const esc = (value) =>
    String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

// ---------- LEARNING CONTENT ----------

const BEG = [
    ["b1", "What is Coding?", "Understand how computers follow instructions."],
    ["b2", "A Short History", "Discover how programming languages evolved."],
    ["b3", "Meet the Languages", "Explore C, C++ and Python."],
    ["b4", "Variables and Data Types", "Store, name and understand information."],
    ["b5", "Conditions and Loops", "Make decisions and repeat instructions."],
    ["b6", "Algorithms and Pseudocode", "Plan your logic before writing code."]
];

const MED = [
    ["m1", "Arrays and Strings", "Work with collections of information."],
    ["m2", "Searching and Sorting", "Find and organise data efficiently."],
    ["m3", "Problem-Solving Patterns", "Recognise reusable approaches."],
    ["m4", "Debugging", "Find mistakes and correct your reasoning."],
    ["m5", "Time and Space Complexity", "Understand efficiency and trade-offs."],
    ["m6", "Mini Projects", "Apply your skills to practical challenges."]
];

const ADV = [
    ["a1", "Advanced Data Structures", "Explore trees, graphs and heaps."],
    ["a2", "Optimisation", "Improve the efficiency of your solutions."],
    ["a3", "Comparing Approaches", "Evaluate different ways to solve problems."],
    ["a4", "Competitive Programming", "Practise challenging timed problems."],
    ["a5", "Mock Interviews", "Build confidence through interview practice."],
    ["a6", "Real-World Projects", "Solve more complex practical problems."]
];

const LV = {
    beginner: {
        name: "Beginner",
        description: "Start from zero. Complete chapters in sequence to build strong foundations.",
        topics: BEG,
        color: "#58d5ff"
    },
    medium: {
        name: "Medium",
        description: "Build problem-solving skills. Explore topics freely and follow prerequisites.",
        topics: MED,
        color: "#3d7bff"
    },
    advanced: {
        name: "Advanced",
        description: "Practise complex problems, algorithms and optimisation.",
        topics: ADV,
        color: "#8f6bff"
    }
};

const QUESTIONS = [
    {
        question: "What comes next: 2, 4, 8, 16, ?",
        options: ["18", "24", "32", "20"],
        answer: 2
    },
    {
        question: "A loop adds 1 + 2 + 3 + 4 + 5, starting from 0. What is the total?",
        options: ["10", "15", "12", "5"],
        answer: 1
    },
    {
        question: "What should you do first when solving a new programming problem?",
        options: [
            "Write code immediately",
            "Understand inputs, outputs and constraints",
            "Copy an existing solution",
            "Choose a programming language randomly"
        ],
        answer: 1
    }
];

const STEPS = [
    "Understand",
    "Think",
    "Pseudocode",
    "Code",
    "Test",
    "Review"
];

const HINTS = [
    "Start by identifying the three input numbers and the expected output.",
    "Keep a variable containing the largest number found so far.",
    "Compare the current largest number with the remaining numbers.",
    "Think about what should happen when two numbers are equal.",
    "Test your logic using negative numbers and repeated values."
];

const STARTER_CODE = {
    Python: `def largest(a, b, c):
    # Think about the comparison logic
    pass
`,
    C: `int largest(int a, int b, int c) {
    // Write your logic here
    return 0;
}
`,
    "C++": `int largest(int a, int b, int c) {
    // Write your logic here
    return 0;
}
`
};

function getHints() {
    if (S.hint === 0) {
        return `<p class="mut">
            Stuck? Reveal a hint to help you reason through the problem.
            Tarkpath encourages thinking before showing solutions.
        </p>`;
    }

    return HINTS.slice(0, S.hint)
        .map((hint, index) => `
            <p><b>Hint ${index + 1}:</b> ${esc(hint)}</p>
        `)
        .join("");
}

// ---------- REUSABLE UI ----------

function textarea(step, placeholder, defaultValue = "") {
    const value = S.notes[step] ?? defaultValue;
    const id = step === 3 ? 'id="code"' : "";

    return `
        <textarea
            ${id}
            class="${step === 3 ? "mono" : ""}"
            placeholder="${esc(placeholder)}"
            oninput="A.note(${step}, this.value)"
        >${esc(value)}</textarea>
    `;
}

function topicCard(topic, index, level) {
    const [id, title, description] = topic;
    const completed = S.done.includes(id);

    const locked =
        level === "beginner" &&
        index > 0 &&
        !S.done.includes(BEG[index - 1][0]);

    return `
        <article class="card ch ${locked ? "lock" : ""} ${completed ? "dn" : ""}">
            <small>${level === "beginner" ? "Chapter" : "Topic"} ${index + 1}</small>

            <h3>${esc(title)}</h3>
            <p>${esc(description)}</p>

            ${
                locked
                    ? `<span class="tag">Complete the previous chapter to unlock this one.</span>`
                    : `
                        <div class="row">
                            <button
                                class="btn sm"
                                onclick="A.openProblem('${id}')"
                            >
                                Practise
                            </button>

                            ${
                                level === "beginner"
                                    ? completed
                                        ? `<span class="tag ok">Completed</span>`
                                        : `<button class="btn sm ghost"
                                            onclick="A.completeChapter('${id}')">
                                            Mark complete
                                          </button>`
                                    : ""
                            }
                        </div>
                    `
            }
        </article>
    `;
}

// ---------- PAGE RENDERING ----------

const R = {

    home: () => `
        <section class="hero">
            <div>
                <span class="pill">Logical thinking first. Syntax second.</span>

                <h1>Learn to <em>think</em>, not just type code.</h1>

                <p>
                    Tarkpath helps you develop logical thinking,
                    understand problems and build the confidence to
                    solve programming challenges independently.
                </p>

                <div class="row">
                    <a class="btn" href="#/${S.user ? "dash" : "login"}">
                        Get started
                    </a>

                    <a class="btn ghost" href="#/${S.user ? "guide" : "login"}">
                        Explore guidance
                    </a>
                </div>

                <div class="row stats">
                    <div><b>3</b> learning levels</div>
                    <div><b>6</b> problem-solving steps</div>
                    <div><b>1</b> goal: independence</div>
                </div>
            </div>

            <img
                class="logo"
                src="assets/logo.png"
                alt="Tarkpath logo"
            >
        </section>

        <section class="sec">
            <h2>Why Tarkpath is different</h2>

            <div class="grid3">
                ${[
                    ["Think First", "Understand the problem before writing code."],
                    ["Hints, Not Answers", "Develop independent reasoning through progressive hints."],
                    ["Strong Foundations", "Beginner chapters unlock in sequence."],
                    ["Three Learning Levels", "Different learning paths for different skill levels."],
                    ["Personalised Guidance", "Identify what to practise next."],
                    ["Meaningful Progress", "Track attempts, test results and learning milestones."]
                ].map(([title, description]) => `
                    <article class="card">
                        <h3>${title}</h3>
                        <p>${description}</p>
                    </article>
                `).join("")}
            </div>

            <h2>Your learning journey</h2>

            <div class="flow">
                ${[
                    "Sign up",
                    "Diagnostic assessment",
                    "Suggested level",
                    "Learning dashboard",
                    "Guided workspace",
                    "Progress and guidance"
                ].map((item, index) => `
                    <div>
                        <i>${index + 1}</i>
                        ${item}
                    </div>
                `).join("")}
            </div>
        </section>
    `,

    login: () => `
        <section class="narrow card">
            <h2>Welcome to Tarkpath</h2>

            <p class="mut">
                Prototype sign-in. This version stores your profile
                locally in this browser and does not provide secure
                account authentication.
            </p>

            <label for="nm">Your name</label>
            <input id="nm" maxlength="60" placeholder="Enter your name">

            <label for="em">Email (optional)</label>
            <input id="em" type="email" placeholder="Enter your email">

            <label for="lg">Preferred programming language</label>
            <select id="lg">
                <option>Python</option>
                <option>C</option>
                <option>C++</option>
            </select>

            <button class="btn" onclick="A.login()">
                Continue to assessment
            </button>
        </section>
    `,

    assess: () => `
        <section class="narrow card">
            <h2>Let's understand your starting point</h2>

            <p class="mut">
                This short assessment suggests a starting level.
                It is not a final measurement of your ability.
                You can choose a different level later.
            </p>

            ${QUESTIONS.map((question, index) => `
                <div class="q">
                    <b>${index + 1}. ${esc(question.question)}</b>

                    ${question.options.map((option, optionIndex) => `
                        <label>
                            <input
                                type="radio"
                                name="q${index}"
                                value="${optionIndex}"
                            >
                            ${esc(option)}
                        </label>
                    `).join("")}
                </div>
            `).join("")}

            <div class="row">
                <button class="btn" onclick="A.score()">
                    See my recommendation
                </button>

                <a class="btn ghost" href="#/dash">Skip assessment</a>
            </div>
        </section>
    `,

    result: () => {
        const level = S.level || "beginner";

        return `
            <section class="narrow card">
                <span class="pill">Your starting point</span>

                <h2>You scored ${S.score} / ${QUESTIONS.length}</h2>

                <p>
                    We recommend starting with
                    <b>${LV[level].name}</b>.
                    This is only a starting suggestion, not a limit.
                </p>

                <div class="row">
                    ${Object.keys(LV).map((key) => `
                        <button
                            class="btn sm ${key === level ? "" : "ghost"}"
                            onclick="A.pick('${key}'); location.hash='#/dash'"
                        >
                            ${LV[key].name}
                            ${key === level ? "(Suggested)" : ""}
                        </button>
                    `).join("")}
                </div>
            </section>
        `;
    },

    dash: () => {
        const completed = S.done.length;
        const accuracy = S.runs
            ? `${Math.round((S.pass / S.runs) * 100)}%`
            : "No test results yet";

        const level = S.level || "beginner";
        const beginnerIndex = BEG.findIndex(
            (topic) => !S.done.includes(topic[0])
        );

        const nextStep =
            level === "beginner" && beginnerIndex !== -1
                ? `Continue with Chapter ${beginnerIndex + 1}: ${BEG[beginnerIndex][1]}.`
                : "Choose a topic and work through a guided problem.";

        return `
            <section class="sec">
                <div class="row between">
                    <div>
                        <span class="pill">Your Dashboard</span>
                        <h1 class="h2">Hello, ${esc(S.user || "Student")}</h1>
                    </div>

                    <a class="btn" href="#/level/${level}">
                        Continue learning
                    </a>
                </div>

                <div class="grid4">
                    ${[
                        ["Current level", LV[level].name],
                        ["Language", S.lang],
                        ["Beginner chapters", `${completed} / ${BEG.length}`],
                        ["Test accuracy", accuracy],
                        ["Problems marked solved", S.solved],
                        ["Hints revealed", S.hints],
                        ["Test runs requested", S.runs]
                    ].map(([label, value]) => `
                        <div class="card st">
                            <small>${label}</small>
                            <b>${esc(value)}</b>
                        </div>
                    `).join("")}
                </div>

                <div class="card">
                    <h3>Beginner learning progress</h3>

                    <div class="bar">
                        <i style="width:${Math.min(100, completed / BEG.length * 100)}%"></i>
                    </div>

                    <p>${completed} of ${BEG.length} chapters marked complete.</p>
                </div>

                <h2>Choose your learning level</h2>

                <div class="grid3">
                    ${Object.keys(LV).map((key) => `
                        <a
                            class="card lv"
                            style="--c:${LV[key].color}"
                            href="#/level/${key}"
                            onclick="A.pick('${key}')"
                        >
                            <h3>${LV[key].name}</h3>
                            <p>${LV[key].description}</p>
                        </a>
                    `).join("")}
                </div>

                <div class="grid2">
                    <div class="card">
                        <h3>Recommended next step</h3>
                        <p>${esc(nextStep)}</p>

                        <a class="btn sm" href="#/level/${level}">
                            Open learning path
                        </a>
                    </div>

                    <div class="card">
                        <h3>Guidance Centre</h3>
                        <p>
                            Explore learning roadmaps, programming languages,
                            problem-solving advice and career paths.
                        </p>

                        <a class="btn sm" href="#/guide">
                            Open Guidance Centre
                        </a>
                    </div>
                </div>
            </section>
        `;
    },

    level: (key) => {
        key = LV[key] ? key : (S.level || "beginner");

        const level = LV[key];

        return `
            <section class="sec">
                <div class="tabs">
                    ${Object.keys(LV).map((item) => `
                        <a
                            href="#/level/${item}"
                            class="${item === key ? "on" : ""}"
                            onclick="A.pick('${item}')"
                        >
                            ${LV[item].name}
                        </a>
                    `).join("")}
                </div>

                <h1 class="h2">${level.name} Level</h1>
                <p class="mut">${level.description}</p>

                <div class="grid3">
                    ${level.topics.map((topic, index) =>
                        topicCard(topic, index, key)
                    ).join("")}
                </div>
            </section>
        `;
    },

    solve: () => {
        const index = Math.max(0, Math.min(STEPS.length - 1, S.step));

        const content = [
            `
                <p><b>Problem:</b> Given three numbers, find the largest.</p>
                <p class="mut">Example: 4, 9, 2 → 9</p>

                ${textarea(
                    0,
                    "Identify the inputs, expected output and any special cases."
                )}
            `,
            textarea(
                1,
                "Break the problem into small steps. What should you compare first?"
            ),
            textarea(
                2,
                "Write your algorithm in plain English, without programming syntax."
            ),
            `
                <label for="languageSelect">Programming language</label>

                <select
                    id="languageSelect"
                    onchange="A.lang(this.value)"
                >
                    ${["Python", "C", "C++"].map((language) => `
                        <option
                            ${language === S.lang ? "selected" : ""}
                        >${language}</option>
                    `).join("")}
                </select>

                ${textarea(3, "Write your code here.", STARTER_CODE[S.lang])}
            `,
            `
                <p>
                    The actual code execution service is not connected yet.
                    Your code will not be falsely marked as passed.
                </p>

                <button class="btn sm" onclick="A.run()">
                    Check execution status
                </button>

                <div id="res" class="mut"></div>
            `,
            `
                <h4>Review your approach</h4>
                <ol>
                    <li>Start by treating the first number as the current largest.</li>
                    <li>Compare it with the second number.</li>
                    <li>Update the largest number when needed.</li>
                    <li>Compare with the third number.</li>
                    <li>Test equal values, negative values and different orders.</li>
                </ol>

                <p class="mut">
                    Review the reasoning and test the code yourself before
                    marking the problem as completed.
                </p>
            `
        ];

        return `
            <section class="sec">
                <span class="pill">Guided Problem-Solving Workspace</span>

                <h1 class="h2">Largest of Three Numbers</h1>

                <div class="steps">
                    ${STEPS.map((step, stepIndex) => `
                        <div class="${
                            stepIndex === index ? "on" :
                            stepIndex < index ? "dn" : ""
                        }">
                            <i>${stepIndex + 1}</i>
                            ${step}
                        </div>
                    `).join("")}
                </div>

                <div class="grid2w">
                    <div class="card">
                        <h3>Step ${index + 1}: ${STEPS[index]}</h3>

                        ${content[index]}

                        <div class="row">
                            ${
                                index > 0
                                    ? `<button class="btn ghost sm"
                                        onclick="A.step(-1)">Back</button>`
                                    : ""
                            }

                            ${
                                index < STEPS.length - 1
                                    ? `<button class="btn sm"
                                        onclick="A.step(1)">Next step</button>`
                                    : `<button class="btn sm"
                                        onclick="A.finish()">Mark reviewed</button>`
                            }
                        </div>
                    </div>

                    <div class="card">
                        <h3>Progressive hints</h3>

                        <div id="hints">${getHints()}</div>

                        <button
                            class="btn ghost sm"
                            onclick="A.hint()"
                            ${S.hint >= HINTS.length ? "disabled" : ""}
                        >
                            ${S.hint >= HINTS.length ? "All hints revealed" : "Show next hint"}
                        </button>
                    </div>
                </div>
            </section>
        `;
    },

    guide: () => {
        const level = S.level || "beginner";

        const roadmap = [
            "Foundations",
            "Logic building",
            "Problem-solving patterns",
            "Optimisation"
        ];

        const roadmapIndex = {
            beginner: 0,
            medium: 2,
            advanced: 3
        }[level];

        return `
            <section class="sec">
                <span class="pill">Always available</span>

                <h1 class="h2">Guidance Centre</h1>

                <p>
                    Find direction when you are stuck, unsure what to learn
                    next or exploring programming career options.
                </p>

                <div class="flow">
                    ${roadmap.map((item, index) => `
                        <div class="${index === roadmapIndex ? "on" : ""}">
                            <i>${index + 1}</i>
                            ${item}
                        </div>
                    `).join("")}
                </div>

                <div class="grid3">
                    ${[
                        ["Beginner Guidance", "Step-by-step explanations, basic reasoning and foundational concepts."],
                        ["Medium Guidance", "Problem patterns, debugging and choosing suitable approaches."],
                        ["Advanced Guidance", "Complexity analysis, optimisation and interview preparation."]
                    ].map(([title, description]) => `
                        <div class="card">
                            <h3>${title}</h3>
                            <p>${description}</p>
                        </div>
                    `).join("")}
                </div>

                <div class="grid2">
                    <div class="card">
                        <h3>Learning Mentor Preview</h3>

                        <p class="mut">
                            This is a rule-based preview, not a connected AI model.
                        </p>

                        <div id="chat" class="chat" aria-live="polite">
                            <p class="bot">
                                Hi! Tell me where you are stuck.
                                I will help you think through the problem.
                            </p>
                        </div>

                        <div class="row">
                            <input
                                id="ask"
                                maxlength="500"
                                placeholder="e.g. I am stuck on loops"
                                onkeydown="if(event.key==='Enter') A.ask()"
                            >

                            <button class="btn sm" onclick="A.ask()">Ask</button>
                        </div>
                    </div>

                    <div class="card">
                        <h3>Programming Language Guidance</h3>

                        <p>
                            Python has readable syntax and can be a friendly
                            starting point. C and C++ introduce other useful
                            programming concepts. The best choice depends on
                            your learning goals.
                        </p>

                        <h3>Explore Career Paths</h3>

                        <div class="chips">
                            ${[
                                "Software Development",
                                "Data Science",
                                "AI and Machine Learning",
                                "Cybersecurity"
                            ].map((item) => `<span>${item}</span>`).join("")}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
};

// ---------- APPLICATION ACTIONS ----------

const A = {

    login() {
        const name = $("#nm")?.value.trim();
        const email = $("#em")?.value.trim();
        const language = $("#lg")?.value;

        if (!name) {
            alert("Please enter your name to continue.");
            return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        S.user = name.slice(0, 60);
        S.lang = ["Python", "C", "C++"].includes(language)
            ? language
            : "Python";

        save();
        location.hash = "#/assess";
    },

    logout() {
        S.user = "";
        save();
        location.hash = "#/home";
    },

    pick(level) {
        if (!LV[level]) return;

        S.level = level;
        save();
    },

    score() {
        let score = 0;

        QUESTIONS.forEach((question, index) => {
            const selected = document.querySelector(
                `input[name="q${index}"]:checked`
            );

            if (selected && Number(selected.value) === question.answer) {
                score++;
            }
        });

        S.score = score;

        // A short quiz is only a rough recommendation.
        S.level = score <= 1
            ? "beginner"
            : score === 2
                ? "medium"
                : "advanced";

        save();
        location.hash = "#/result";
    },

    completeChapter(id) {
        const index = BEG.findIndex((topic) => topic[0] === id);

        if (index === -1) return;

        if (index > 0 && !S.done.includes(BEG[index - 1][0])) {
            alert("Complete the previous chapter first.");
            return;
        }

        if (!S.done.includes(id)) {
            S.done.push(id);
        }

        save();
        showToast("Chapter marked complete.");
        render(true);
    },

    openProblem(id) {
        S.currentTopic = id;
        S.step = 0;
        S.hint = 0;
        S.notes = {};
        save();

        location.hash = "#/solve";
    },

    step(change) {
        S.step = Math.max(
            0,
            Math.min(STEPS.length - 1, S.step + change)
        );

        save();
        render(true);
    },

    note(index, value) {
        S.notes[index] = value;
        save();
    },

    lang(language) {
        if (!["Python", "C", "C++"].includes(language)) return;

        const codeElement = $("#code");
        const currentCode = codeElement?.value || "";

        S.notes[3] = currentCode;
        S.lang = language;

        // Provide starter code only when the editor is still empty.
        if (!currentCode.trim()) {
            S.notes[3] = STARTER_CODE[language];
        }

        save();
        render(true);
    },

    hint() {
        if (S.hint >= HINTS.length) return;

        S.hint++;
        S.hints++;

        save();

        const hintElement = $("#hints");

        if (hintElement) {
            hintElement.innerHTML = getHints();
        }

        const button = document.querySelector(
            'button[onclick="A.hint()"]'
        );

        if (button && S.hint >= HINTS.length) {
            button.textContent = "All hints revealed";
            button.disabled = true;
        }
    },

    run() {
        S.runs++;
        save();

        const result = $("#res");

        if (!result) return;

        result.innerHTML = `
            <p class="bad">
                Code execution is not connected yet.
                Python, C and C++ code cannot be executed by this demo.
            </p>

            <p>
                A secure backend code runner must be connected before
                Tarkpath can provide real compilation, execution and
                test-case results. No test has been marked as passed.
            </p>
        `;
    },

    finish() {
        // This action records a review, not a verified execution result.
        S.solved++;
        save();

        showToast("Review recorded. Keep practising!");
        location.hash = "#/dash";
    },

    ask() {
        const input = $("#ask");
        const chat = $("#chat");

        if (!input || !chat) return;

        const question = input.value.trim();

        if (!question) return;

        if (question.length > 500) {
            alert("Please keep your question under 500 characters.");
            return;
        }

        const text = question.toLowerCase();

        let response;

        if (/loop|iteration|repeat/.test(text)) {
            response =
                "Think about three things: where the loop starts, " +
                "when it should stop, and what changes after each repetition. " +
                "Can you explain those three parts for your problem?";
        } else if (/array|string|list/.test(text)) {
            response =
                "First identify what each item represents. " +
                "Do you need to visit every item, find a particular item, " +
                "or compare multiple items?";
        } else if (/debug|error|bug/.test(text)) {
            response =
                "Read the error carefully. Identify the line where it occurs, " +
                "the value you expected, and the value you actually received. " +
                "Try the smallest test case that reproduces the issue.";
        } else if (/pseudo|algorithm|logic/.test(text)) {
            response =
                "Pause the syntax for now. Write the steps in plain English. " +
                "What are your inputs, what output do you need, and what " +
                "should happen first?";
        } else if (/answer|solution|code/.test(text)) {
            response =
                "Let's build the solution instead of jumping straight to the answer. " +
                "Tell me your first idea, even if you are unsure whether it is correct.";
        } else {
            response =
                "Let's break the problem down. What have you tried so far, " +
                "what result did you expect, and where exactly are you stuck?";
        }

        const userMessage = document.createElement("p");
        userMessage.className = "me";
        userMessage.textContent = question;

        const botMessage = document.createElement("p");
        botMessage.className = "bot";
        botMessage.textContent = response;

        chat.append(userMessage, botMessage);
        chat.scrollTop = chat.scrollHeight;

        input.value = "";
    }
};

// ---------- NAVIGATION ----------

function showToast(message) {
    const toast = $("#toast");

    if (!toast) {
        console.info(message);
        return;
    }

    toast.textContent = message;
    toast.className = "show";

    setTimeout(() => {
        toast.className = "";
    }, 2400);
}

function navigation(currentRoute) {
    const links = [
        ["dash", "Dashboard"],
        ["level", "Levels"],
        ["solve", "Workspace"],
        ["guide", "Guidance"]
    ];

    const nav = $("#nav");

    if (!nav) return;

    nav.innerHTML = `
        <a class="brand" href="#/home">
            <span class="mark">
                <img src="assets/logo.png" alt="">
            </span>
            <b>Tarkpath</b>
        </a>

        <nav>
            ${
                S.user
                    ? links.map(([route, label]) => {
                        const href = route === "level"
                            ? `#/level/${S.level || "beginner"}`
                            : `#/${route}`;

                        const active =
                            currentRoute === route ? "on" : "";

                        return `
                            <a href="${href}" class="${active}">
                                ${label}
                            </a>
                        `;
                    }).join("") +
                    `<a href="#/home" onclick="A.logout()">Log out</a>`
                    : `<a class="btn sm" href="#/login">Log in</a>`
            }
        </nav>
    `;
}

function render(keepScroll = false) {
    const app = $("#app");

    if (!app) {
        console.error(
            'Tarkpath could not find an element with id="app".'
        );
        return;
    }

    const routeParts = (location.hash || "#/home")
        .slice(2)
        .split("/");

    const route = routeParts[0];
    const argument = routeParts[1];

    const protectedRoutes = [
        "dash",
        "level",
        "solve",
        "guide",
        "result",
        "assess"
    ];

    if (!S.user && protectedRoutes.includes(route)) {
        location.hash = "#/login";
        return;
    }

    const page = R[route] || R.home;

    navigation(route);
    app.innerHTML = page(argument);

    if (!keepScroll) {
        window.scrollTo(0, 0);
    }
}

window.addEventListener("hashchange", () => render());

render();