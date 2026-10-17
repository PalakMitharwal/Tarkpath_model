const $ = s => document.querySelector(s);

let S;
try {
  S = JSON.parse(localStorage.getItem('tp'));
} catch (e) {}

S = S || {
  user: '',
  level: '',
  lang: 'Python',
  done: [],
  solved: 0,
  hints: 0,
  runs: 0,
  pass: 0,
  step: 0,
  hint: 0,
  n: {}
};

const save = () => {
  try {
    localStorage.setItem('tp', JSON.stringify(S));
  } catch (e) {}
};

const cap = s => s[0].toUpperCase() + s.slice(1);

const esc = s => String(s).replace(/[&<>"]/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}[c]));

const BEG = [
  ['b1', 'What is coding?', 'How computers follow instructions'],
  ['b2', 'A short history', 'How languages evolved'],
  ['b3', 'Meet the languages', 'C, C++ and Python at a glance'],
  ['b4', 'Variables and data types', 'Store and name information'],
  ['b5', 'Conditions and loops', 'Decide and repeat'],
  ['b6', 'Algorithms and pseudocode', 'Plan the logic before the code']
];

const MED = [
  ['m1', 'Arrays and strings', 'Work with collections'],
  ['m2', 'Searching and sorting', 'Find and order data'],
  ['m3', 'Problem-solving patterns', 'Spot reusable approaches'],
  ['m4', 'Debugging', 'Find wrong approaches fast'],
  ['m5', 'Time and space', 'Intro to complexity'],
  ['m6', 'Mini projects', 'Interview-style challenges']
];

const ADV = [
  ['a1', 'Advanced data structures', 'Trees, graphs, heaps'],
  ['a2', 'Optimisation', 'Make good solutions faster'],
  ['a3', 'Many approaches', 'Compare ways to solve'],
  ['a4', 'Competitive challenges', 'Timed problem sets'],
  ['a5', 'Mock interviews', 'Practise under pressure'],
  ['a6', 'Real-world projects', 'Complex scenarios']
];

const LV = {
  beginner: {
    n: 'Beginner',
    t: 'Start from zero. Chapters unlock one by one so your foundation stays strong.',
    d: BEG,
    c: '#58d5ff'
  },
  medium: {
    n: 'Medium',
    t: 'Build problem-solving skill. Every topic is open, explore freely.',
    d: MED,
    c: '#3d7bff'
  },
  advanced: {
    n: 'Advanced',
    t: 'Optimise and think deeper. Every topic is open, explore freely.',
    d: ADV,
    c: '#8f6bff'
  }
};

const Q = [
  [
    'What comes next: 2, 4, 8, 16, ?',
    ['18', '24', '32', '20'],
    2
  ],
  [
    'A loop adds 1+2+3+4+5 starting from 0. Final total?',
    ['10', '15', '12', '5'],
    1
  ],
  [
    'Best first step on a new problem?',
    [
      'Write code immediately',
      'Understand inputs, outputs and constraints',
      'Search for a solution',
      'Copy a similar answer'
    ],
    1
  ]
];

const ST = [
  'Understand',
  'Think',
  'Pseudocode',
  'Code',
  'Test',
  'Review'
];

const HT = [
  'Which two numbers can you compare first?',
  'Keep a variable holding the largest so far.',
  'Compare it with the third number, then return it.'
];

const START = {
  Python: 'def largest(a, b, c):\n    # write your logic\n    pass',
  C: 'int largest(int a, int b, int c) {\n    /* write your logic */\n}',
  'C++': 'int largest(int a, int b, int c) {\n    // write your logic\n}'
};

const hints = () =>
  S.hint
    ? HT.slice(0, S.hint)
        .map((h, i) => `<p><b>Hint ${i + 1}.</b> ${h}</p>`)
        .join('')
    : '<p class="mut">Stuck? Ask for a hint. We never show the full solution first.</p>';

const ta = (i, ph, def) =>
  `<textarea ${i == 3 ? 'id="code"' : ''}
    class="${i == 3 ? 'mono' : ''}"
    placeholder="${ph}"
    oninput="A.note(${i},this.value)">${esc(
      S.n && S.n[i] != null ? S.n[i] : (def || '')
    )}</textarea>`;

const R = {
  home: () => `
    <section class="hero">
      <div>
        <span class="pill">Logical thinking first. Syntax second.</span>
        <h1>Learn to <em>think</em>, not just type code.</h1>
        <p>
          Tarkpath guides beginners from "where do I even start?"
          to solving problems on their own, with hints instead of answers.
        </p>
        <div class="row">
          <a class="btn" href="#/${S.user ? 'dash' : 'login'}">Get started</a>
          <a class="btn ghost" href="#/${S.user ? 'guide' : 'login'}">Explore guidance</a>
        </div>
        <div class="row stats">
          <div><b>3</b>levels</div>
          <div><b>6</b>step workspace</div>
          <div><b>1</b>goal: independence</div>
        </div>
      </div>
      <img class="logo" src="assets/logo.png" alt="Tarkpath crystal emblem">
    </section>

    <section class="sec">
      <h2>Why Tarkpath is different</h2>
      <div class="grid3">
        ${[
          ['Think first', 'Understand, break down and plan before any code.'],
          ['Hints, not answers', 'Progressive hints build independent reasoning.'],
          ['Sequential foundations', 'Beginner chapters unlock one by one.'],
          ['Three real levels', 'Beginner, Medium and Advanced with distinct questions.'],
          ['Built-in guidance', 'Roadmaps, weak topics and next steps.'],
          ['Honest progress', 'Accuracy, hints and mistakes, not just counts.']
        ].map(x => `
          <div class="card">
            <h3>${x[0]}</h3>
            <p>${x[1]}</p>
          </div>
        `).join('')}
      </div>

      <h2>The journey</h2>
      <div class="flow">
        ${[
          'Sign up',
          'Assessment',
          'Suggested level',
          'Dashboard',
          'Guided workspace',
          'Progress and guidance'
        ].map((x, i) => `
          <div><i>${i + 1}</i>${x}</div>
        `).join('')}
      </div>
    </section>
  `,

  login: () => `
    <section class="narrow card">
      <h2>Welcome to Tarkpath</h2>
      <p class="mut">
        Demo sign-in: nothing is checked and nothing leaves your browser.
      </p>
      <input id="nm" placeholder="Your name">
      <input id="em" placeholder="Email (optional)">
      <select id="lg">
        <option>Python</option>
        <option>C</option>
        <option>C++</option>
      </select>
      <button class="btn" onclick="A.login()">Continue to assessment</button>
    </section>
  `,

  assess: () => `
    <section class="narrow card">
      <h2>Quick diagnostic</h2>
      <p class="mut">
        Three questions. This only suggests a starting point,
        you can choose any level.
      </p>

      ${Q.map((q, i) => `
        <div class="q">
          <b>${i + 1}. ${q[0]}</b>
          ${q[1].map((o, j) => `
            <label>
              <input type="radio" name="q${i}" value="${j}">
              ${o}
            </label>
          `).join('')}
        </div>
      `).join('')}

      <div class="row">
        <button class="btn" onclick="A.score()">See my result</button>
        <a class="btn ghost" href="#/dash">Skip</a>
      </div>
    </section>
  `,

  result: () => {
    const s = S.score || 0;
    const l = S.level || 'beginner';

    return `
      <section class="narrow card">
        <span class="pill">Assessment result</span>
        <h2>You scored ${s} / 3</h2>
        <p>
          We suggest the <b>${LV[l].n}</b> level as a starting point.
          It is a recommendation, not a limit.
        </p>
        <div class="row">
          ${Object.keys(LV).map(k => `
            <a
              class="btn ${k == l ? '' : 'ghost'} sm"
              href="#/dash"
              onclick="A.pick('${k}')"
            >
              ${LV[k].n}${k == l ? ' (suggested)' : ''}
            </a>
          `).join('')}
        </div>
      </section>
    `;
  },

  dash: () => {
    const dn = S.done.length;
    const acc = S.runs ? Math.round(S.pass / S.runs * 100) + '%' : '-';
    const l = S.level || 'beginner';

    const nx =
      l == 'beginner' && dn < 6
        ? `Continue with chapter ${dn + 1}: ${BEG[dn][1]}.`
        : 'Pick a topic and try a guided problem in the workspace.';

    return `
      <section class="sec">
        <div class="row between">
          <div>
            <span class="pill">Dashboard</span>
            <h1 class="h2">Hello, ${esc(S.user)}</h1>
          </div>
          <a class="btn" href="#/level/${l}">Continue learning</a>
        </div>

        <div class="grid4">
          ${[
            ['Level', cap(l)],
            ['Language', S.lang],
            ['Chapters done', dn + ' / 6'],
            ['Accuracy', acc],
            ['Solved', S.solved],
            ['Hints used', S.hints],
            ['Test runs', S.runs],
            ['Streak', '3 days (demo)']
          ].map(x => `
            <div class="card st">
              <small>${x[0]}</small>
              <b>${x[1]}</b>
            </div>
          `).join('')}
        </div>

        <div class="card">
          <h3>Beginner progress</h3>
          <div class="bar">
            <i style="width:${dn / 6 * 100}%"></i>
          </div>
          <p>${dn} of 6 chapters complete</p>
        </div>

        <h2>Choose your level</h2>

        <div class="grid3">
          ${Object.keys(LV).map(k => `
            <a
              class="card lv"
              style="--c:${LV[k].c}"
              href="#/level/${k}"
              onclick="A.pick('${k}')"
            >
              <h3>${LV[k].n}</h3>
              <p>${LV[k].t}</p>
            </a>
          `).join('')}
        </div>

        <div class="grid2">
          <div class="card">
            <h3>Weak topics (sample data)</h3>
            ${[
              ['Loops and conditions', 45],
              ['Edge cases', 30],
              ['Pseudocode', 60]
            ].map(w => `
              <p>${w[0]}</p>
              <div class="bar">
                <i style="width:${w[1]}%"></i>
              </div>
            `).join('')}
          </div>

          <div class="card">
            <h3>Recommended next step</h3>
            <p>${nx}</p>
            <div class="row">
              <a class="btn sm" href="#/guide">Open Guidance Centre</a>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  level: k => {
    k = LV[k] ? k : 'beginner';

    const L = LV[k];
    const seq = k == 'beginner';

    return `
      <section class="sec">
        <div class="tabs">
          ${Object.keys(LV).map(x => `
            <a
              href="#/level/${x}"
              class="${x == k ? 'on' : ''}"
              onclick="A.pick('${x}')"
            >${LV[x].n}</a>
          `).join('')}
        </div>

        <h1 class="h2">${L.n} level</h1>
        <p class="mut">${L.t}</p>

        <div class="grid3">
          ${L.d.map((c, i) => {
            const dn = S.done.includes(c[0]);
            const lock =
              seq && i > 0 && !S.done.includes(L.d[i - 1][0]);

            return `
              <div class="card ch ${lock ? 'lock' : ''} ${dn ? 'dn' : ''}">
                <small>${seq ? 'Chapter' : 'Topic'} ${i + 1}</small>
                <h3>${c[1]}</h3>
                <p>${c[2]}</p>

                ${lock
                  ? '<span class="tag">Locked: finish the previous chapter</span>'
                  : `
                    <div class="row">
                      <a class="btn sm" href="#/solve" onclick="A.start()">Practise</a>
                      ${seq
                        ? dn
                          ? '<span class="tag ok">Completed</span>'
                          : `<button class="btn sm ghost" onclick="A.done('${c[0]}')">Mark complete</button>`
                        : ''
                      }
                    </div>
                  `
                }
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  },

  solve: () => {
    const i = S.step;

    const body = [
      `
        <p><b>Problem.</b> Given three numbers, return the largest one.</p>
        <p class="mut">Example: 4, 9, 2 gives 9.</p>
        ${ta(0, 'Inputs? Output? Constraints? Write them in your own words.')}
      `,
      ta(1, 'Break the problem into small steps. What do you compare first?'),
      ta(2, 'Write plain steps, no syntax. First: take a, b and c'),
      `
        <select onchange="A.lang(this.value)">
          ${['Python', 'C', 'C++'].map(l => `
            <option ${l == S.lang ? 'selected' : ''}>${l}</option>
          `).join('')}
        </select>
        ${ta(3, '', START[S.lang])}
      `,
      `
        <button class="btn sm" onclick="A.run()">Run test cases</button>
        <div id="res" class="mut"><p>Demo runner: results appear here.</p></div>
      `,
      `
        <ol>
          <li>Start with the first number as the largest.</li>
          <li>Compare with the second, update if bigger.</li>
          <li>Compare with the third, update if bigger.</li>
          <li>Return it. Equal numbers still work.</li>
        </ol>
      `
    ][i];

    return `
      <section class="sec">
        <span class="pill">Guided workspace</span>
        <h1 class="h2">Largest of three numbers</h1>

        <div class="steps">
          ${ST.map((s, j) => `
            <div class="${j == i ? 'on' : j < i ? 'dn' : ''}">
              <i>${j + 1}</i>${s}
            </div>
          `).join('')}
        </div>

        <div class="grid2w">
          <div class="card">
            <h3>Step ${i + 1}: ${ST[i]}</h3>
            ${body}

            <div class="row">
              ${i
                ? '<button class="btn ghost sm" onclick="A.step(-1)">Back</button>'
                : ''
              }

              ${i < 5
                ? '<button class="btn sm" onclick="A.step(1)">Next</button>'
                : '<button class="btn sm" onclick="A.finish()">Finish problem</button>'
              }
            </div>
          </div>

          <div class="card">
            <h3>Hints</h3>
            <div id="hints">${hints()}</div>
            <div class="row">
              <button class="btn ghost sm" onclick="A.hint()">Show next hint</button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  guide: () => {
    const road = [
      'Foundations',
      'Logic building',
      'Patterns',
      'Optimisation'
    ];

    const ix = {
      beginner: 0,
      medium: 2,
      advanced: 3
    }[S.level || 'beginner'];

    return `
      <section class="sec">
        <span class="pill">Guidance Centre</span>
        <h1 class="h2">Where to next?</h1>

        <div class="flow">
          ${road.map((x, i) => `
            <div class="${i == ix ? 'on' : ''}">
              <i>${i + 1}</i>${x}
            </div>
          `).join('')}
        </div>

        <div class="grid3">
          ${[
            ['Beginner', 'Step-by-step explanations and basic problem solving.'],
            ['Medium', 'Patterns, debugging and choosing approaches.'],
            ['Advanced', 'Optimisation, complexity and interview prep.']
          ].map(g => `
            <div class="card">
              <h3>${g[0]} guidance</h3>
              <p>${g[1]}</p>
            </div>
          `).join('')}
        </div>

        <div class="grid2">
          <div class="card">
            <h3>AI learning mentor (demo)</h3>

            <div id="chat" class="chat">
              <p class="bot">
                Hi! Tell me where you are stuck.
                I will guide you, not hand you the answer.
              </p>
            </div>

            <div class="row">
              <input
                id="ask"
                placeholder="e.g. I am stuck on loops"
                onkeydown="if(event.key=='Enter')A.ask()"
              >
              <button class="btn sm" onclick="A.ask()">Ask</button>
            </div>
          </div>

          <div class="card">
            <h3>Language guidance</h3>
            <p>
              Python reads close to plain English, great for logic first.
              C and C++ teach how memory works. No language is best for everyone.
            </p>

            <h3 style="margin-top:14px">Career paths</h3>
            <div class="chips">
              ${[
                'Software development',
                'Data science',
                'AI and ML',
                'Cybersecurity'
              ].map(c => `<span>${c}</span>`).join('')}
            </div>
            <p>Informational only, not a guarantee of any outcome.</p>
          </div>
        </div>
      </section>
    `;
  }
};

const A = {
  login() {
    S.user = $('#nm').value.trim() || 'Student';
    S.lang = $('#lg').value;
    save();
    location.hash = '#/assess';
  },

  out() {
    S.user = '';
    save();
  },

  pick(k) {
    S.level = k;
    save();
  },

  score() {
    const s = Q.filter((q, i) => {
      const c = document.querySelector(`input[name=q${i}]:checked`);
      return c && +c.value === q[2];
    }).length;

    S.score = s;
    S.level = s < 2 ? 'beginner' : s == 2 ? 'medium' : 'advanced';

    save();
    location.hash = '#/result';
  },

  done(id) {
    if (!S.done.includes(id)) S.done.push(id);

    save();
    toast('Chapter complete. Next one unlocked.');
    go(true);
  },

  start() {
    S.step = 0;
    S.hint = 0;
    S.n = {};
    save();
  },

  step(d) {
    S.step = Math.max(0, Math.min(5, S.step + d));
    save();
    go(true);
  },

  note(i, v) {
    S.n = S.n || {};
    S.n[i] = v;
    save();
  },

  lang(l) {
    S.lang = l;
    if (S.n) delete S.n[3];
    save();
    go(true);
  },

  hint() {
    if (S.hint < 3) {
      S.hint++;
      S.hints++;
      save();
    }

    $('#hints').innerHTML = hints();
  },

  run() {
    const c =
      ($('#code') && $('#code').value) ||
      (S.n && S.n[3]) ||
      '';

    const ok = c.length > 45 && /(if|max|>|\?)/.test(c);

    S.runs++;
    if (ok) S.pass++;

    save();

    const T = [
      ['4, 9, 2', '9'],
      ['7, 7, 1', '7'],
      ['-3, -8, -1', '-1']
    ];

    $('#res').innerHTML = `
      <table>
        <tr>
          <th>Input</th>
          <th>Expected</th>
          <th>Result</th>
        </tr>

        ${T.map(t => `
          <tr>
            <td>${t[0]}</td>
            <td>${t[1]}</td>
            <td class="${ok ? 'ok' : 'bad'}">
              ${ok ? 'Passed' : 'Failed'}
            </td>
          </tr>
        `).join('')}
      </table>

      <p class="${ok ? 'ok' : 'bad'}">
        ${ok
          ? 'All tests passed. Move on to Review.'
          : 'Not yet. Try comparing two numbers at a time and use a hint if needed.'
        }
      </p>
    `;
  },

  finish() {
    S.solved++;
    save();
    toast('Problem solved. Great reasoning!');
    location.hash = '#/dash';
  },

  ask() {
    const i = $('#ask');
    const q = i.value.trim();

    if (!q) return;

    const l = q.toLowerCase();

    const r =
      /stuck|start/.test(l)
        ? 'Start small: what are the inputs, and what output do you expect?'
        : /debug|error|bug/.test(l)
        ? 'Read the error line by line. Which line does it point to, and what did you expect there?'
        : /pseudo/.test(l)
        ? 'Write plain steps with no syntax. What is the very first thing your program must do?'
        : /answer|solution|code/.test(l)
        ? 'I will not hand over the final code, but we can build it together. What is your first idea?'
        : 'Good question. What have you tried so far, and where exactly does it break?';

    const c = $('#chat');

    c.insertAdjacentHTML(
      'beforeend',
      `<p class="me">${esc(q)}</p><p class="bot">${r}</p>`
    );

    c.scrollTop = c.scrollHeight;
    i.value = '';
  }
};

function toast(m) {
  const t = $('#toast');
  t.textContent = m;
  t.className = 'show';

  setTimeout(() => t.className = '', 2400);
}

function nav(r) {
  const L = [
    ['dash', 'Dashboard'],
    ['level', 'Levels'],
    ['solve', 'Workspace'],
    ['guide', 'Guidance']
  ];

  $('#nav').innerHTML = `
    <a class="brand" href="#/home">
      <span class="mark">
        <img src="assets/logo.png" alt="">
      </span>
      <b>Tarkpath</b>
    </a>

    <nav>
      ${S.user
        ? L.map(x => `
            <a
              href="#/${x[0] == 'level'
                ? 'level/' + (S.level || 'beginner')
                : x[0]
              }"
              class="${r == x[0] ? 'on' : ''}"
            >${x[1]}</a>
          `).join('') +
          '<a href="#/home" onclick="A.out()">Log out</a>'
        : '<a class="btn sm" href="#/login">Log in</a>'
      }
    </nav>
  `;
}

function go(keep) {
  const h = (location.hash || '#/home').slice(2).split('/');
  const r = R[h[0]] ? h[0] : 'home';

  if (
    !S.user &&
    ['dash', 'level', 'solve', 'guide', 'result', 'assess'].includes(r)
  ) {
    location.hash = '#/login';
    return;
  }

  nav(r);
  $('#app').innerHTML = R[r](h[1]);

  if (!keep) scrollTo(0, 0);
}

addEventListener('hashchange', () => go());
go();