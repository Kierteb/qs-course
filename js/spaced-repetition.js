/**
 * spaced-repetition.js — SR algorithm, state management, and question bank
 * QS Learning Platform
 */

const SR_KEY = 'qs_sr_state';

// ============================================================
// Question Bank
// ============================================================
// 5 questions per module, added as each module is built.
// Each question: { id, moduleSource, question, type, options,
//   correctIndex, explanation }
// State (interval, nextReview, easeFactor, timesAnswered,
//   timesCorrect) is stored separately in localStorage.

const QUESTION_BANK = [

  // ── Module 01 ──────────────────────────────────────────────
  {
    id: 'q-01-01',
    moduleSource: '01',
    question: 'What is the difference between measured works and preliminary items in a BoQ?',
    type: 'multiple-choice',
    options: [
      'Measured works are the permanent works priced by unit rate; preliminaries cover site establishment, supervision, and management costs',
      'Measured works are priced as lump sums; preliminaries are priced per unit',
      'Measured works cover labour only; preliminaries cover plant and materials',
      'There is no difference — both describe the same category of work',
    ],
    correctIndex: 0,
    explanation: 'Measured works are the physical, quantified items in the BoQ — priced at a unit rate multiplied by a quantity. Preliminaries (Class A in CESMM4) cover the costs of running the site: welfare, offices, supervision, insurances, bonds, and management.',
  },
  {
    id: 'q-01-02',
    moduleSource: '01',
    question: 'What does a provisional sum represent in a civil engineering BoQ?',
    type: 'multiple-choice',
    options: [
      'A fixed allowance for work that cannot be fully defined at tender stage',
      'The contractor\'s profit allowance built into the tender',
      'The total value of all measured earthworks items',
      'A deduction applied when the contractor underperforms',
    ],
    correctIndex: 0,
    explanation: 'A provisional sum is an allowance for work that cannot be fully specified at tender. The actual cost is settled during the contract — it is not a fixed price. Defined provisional sums have a rough scope; undefined ones are genuinely unknown.',
  },
  {
    id: 'q-01-03',
    moduleSource: '01',
    question: 'In the pricing hierarchy, what sits between a unit rate and the tender total?',
    type: 'multiple-choice',
    options: [
      'Section totals for each part of the BoQ',
      'The overhead and profit percentage',
      'The PC sum allowances',
      'The dayworks schedule',
    ],
    correctIndex: 0,
    explanation: 'The hierarchy is: Unit Rate × Quantity = Item Total → Section Total → Tender Total (plus prelims and OH&P). Section totals group related items — earthworks, drainage, concrete — before they are summed to the tender total.',
  },
  {
    id: 'q-01-04',
    moduleSource: '01',
    question: 'What should you do if you find what appears to be an error in a BoQ before tender?',
    type: 'multiple-choice',
    options: [
      'Raise a query via the tender query process and price the item as written in the meantime',
      'Price it as you think it should be and note the correction in your submission',
      'Ignore it and price exactly what is written without comment',
      'Withdraw from the tender immediately',
    ],
    correctIndex: 0,
    explanation: 'Always raise BoQ errors via the formal tender query process. Price the item as written unless you receive a formal instruction otherwise — silently correcting the BoQ creates contractual problems.',
  },
  {
    id: 'q-01-05',
    moduleSource: '01',
    question: 'What does "dayworks" mean in a civil engineering contract?',
    type: 'multiple-choice',
    options: [
      'Work instructed and paid on actual time, labour, plant, and materials used — not a unit rate',
      'Work completed during daylight hours as opposed to night shifts',
      'Daily output targets agreed at the start of a contract',
      'A summary of work completed each day for programme purposes',
    ],
    correctIndex: 0,
    explanation: 'Dayworks is a method of valuing work where the contractor is reimbursed for actual resources used (labour, plant, materials) plus an agreed percentage for overhead and profit. It is used where work cannot be measured and valued in the normal way.',
  },

  // ── Module 02 ──────────────────────────────────────────────
  {
    id: 'q-02-01',
    moduleSource: '02',
    question: 'What does CESMM4 stand for?',
    type: 'multiple-choice',
    options: [
      'Civil Engineering Standard Method of Measurement, 4th Edition',
      'Construction Estimation and Site Measurement Manual, 4th Edition',
      'Civil Engineering Site Management Manual, version 4',
      'Contracted Engineering Standard for Material Measurement, 4th Edition',
    ],
    correctIndex: 0,
    explanation: 'CESMM4 — Civil Engineering Standard Method of Measurement, 4th Edition — defines how civil engineering work is measured and described in a Bill of Quantities.',
  },
  {
    id: 'q-02-02',
    moduleSource: '02',
    question: 'Which CESMM4 class covers earthworks?',
    type: 'multiple-choice',
    options: ['Class E', 'Class D', 'Class F', 'Class G'],
    correctIndex: 0,
    explanation: 'Class E is Earthworks in CESMM4, covering excavation, filling, and disposal.',
  },
  {
    id: 'q-02-03',
    moduleSource: '02',
    question: 'Which CESMM4 class covers pipe runs specifically?',
    type: 'multiple-choice',
    options: ['Class I', 'Class J', 'Class K', 'Class L'],
    correctIndex: 0,
    explanation: 'Class I is Pipework: Pipes — pipe runs measured by type, nominal bore, and depth band. Class J covers fittings, Class K covers manholes, Class L covers pipe supports and protection.',
  },
  {
    id: 'q-02-04',
    moduleSource: '02',
    question: 'Which CESMM4 class covers manholes and chambers?',
    type: 'multiple-choice',
    options: ['Class K', 'Class I', 'Class J', 'Class L'],
    correctIndex: 0,
    explanation: 'Class K is Pipework: Manholes & Ancillaries. Each manhole or chamber is a separately priced item, measured by number (nr), with depth captured in the item description.',
  },
  {
    id: 'q-02-05',
    moduleSource: '02',
    question: 'What section of a BoQ should always be read before pricing any item?',
    type: 'multiple-choice',
    options: ['The Preambles', 'The Appendices', 'Class A — General Items', 'The Tender Summary'],
    correctIndex: 0,
    explanation: 'The Preambles define how items are measured, what is included in rates, and any project-specific rules. They can modify standard CESMM4 coverage rules — skipping them is one of the most common and expensive tendering mistakes.',
  },

  // ── Module 03 ──────────────────────────────────────────────
  {
    id: 'q-03-01',
    moduleSource: '03',
    question: 'Excavated clay bulks by approximately what percentage?',
    type: 'multiple-choice',
    options: ['10%', '25%', '40%', '50%'],
    correctIndex: 1,
    explanation: 'Clay typically bulks by 20–30%. Use 25% as the standard tender figure for typical cohesive clay. Sandy soils bulk less; rock bulks more. Always state the material type alongside the factor.',
  },
  {
    id: 'q-03-02',
    moduleSource: '03',
    question: 'Granular fill compacts by approximately what percentage when placed and compacted?',
    type: 'multiple-choice',
    options: ['2–5%', '10–15%', '25–30%', '40%'],
    correctIndex: 1,
    explanation: 'Granular fill shrinks by 10–15% when compacted. You need to order approximately 12% more tonnes than the net m³ in the BoQ to achieve the specified compacted volume.',
  },
  {
    id: 'q-03-03',
    moduleSource: '03',
    question: 'If you have 100 m³ net of clay excavation, approximately how many m³ loose will you cart away?',
    type: 'multiple-choice',
    options: ['100 m³', '110 m³', '125 m³', '150 m³'],
    correctIndex: 2,
    explanation: '100 m³ × 1.25 = 125 m³ loose. The 25% bulking factor means every m³ dug becomes 1.25 m³ to dispose of. This directly drives your wagon count, disposal cost, and programme.',
  },
  {
    id: 'q-03-04',
    moduleSource: '03',
    question: 'What unit is used to measure manholes in a CESMM4 BoQ?',
    type: 'multiple-choice',
    options: ['Linear metres (m)', 'Cubic metres (m³)', 'Number (nr)', 'Tonnes (t)'],
    correctIndex: 2,
    explanation: 'Manholes in Class K are measured by number (nr). Each manhole is a separate item; depth is captured in the item description, not as a separate linear measurement.',
  },
  {
    id: 'q-03-05',
    moduleSource: '03',
    question: 'What unit is used to measure pipe runs in a CESMM4 BoQ?',
    type: 'multiple-choice',
    options: ['Cubic metres (m³)', 'Linear metres (m)', 'Number (nr)', 'Square metres (m²)'],
    correctIndex: 1,
    explanation: 'Pipe runs in Class I are always measured in linear metres (m). The depth tranche, pipe material, and nominal bore appear in the description. Your per-metre rate must account for all work in the trench.',
  },

  // ── Module 04 ──────────────────────────────────────────────
  {
    id: 'q-04-01',
    moduleSource: '04',
    question: 'Which of the following is a complete list of components in a contractor\'s all-in labour rate, beyond basic pay?',
    type: 'multiple-choice',
    options: [
      'Employer\'s NI, holiday pay, pension, CITB levy, and insurance loading',
      'Basic pay and pension only',
      'Basic pay, overtime, and a 10% uplift',
      'Employer\'s NI only — all other costs are the operative\'s responsibility',
    ],
    correctIndex: 0,
    explanation: 'The all-in rate to the contractor includes: employer\'s NI (13.8%), auto-enrolment pension, holiday pay accrual, CITB levy (0.35% for PAYE employees), insurance loading, and a small productivity allowance. Each component must be calculated individually — never use a rough percentage uplift.',
  },
  {
    id: 'q-04-02',
    moduleSource: '04',
    question: 'A drainage gang of 3 operatives has an all-in cost of £84/hr. They lay 28 m of pipe per 8-hour day. What is the labour cost per metre of pipe laid?',
    type: 'multiple-choice',
    options: ['£12.00/m', '£18.00/m', '£24.00/m', '£32.00/m'],
    correctIndex: 2,
    explanation: '(3 operatives × £84/hr all-in cost is for the gang, so: £84/hr × 8 hrs) ÷ 28 m = £672 ÷ 28 = £24.00/m. The formula is: (Gang all-in rate × Hours per day) ÷ Daily output.',
  },
  {
    id: 'q-04-03',
    moduleSource: '04',
    question: 'What does CPCS stand for in the context of plant operators?',
    type: 'multiple-choice',
    options: [
      'Construction Plant Competence Scheme',
      'Civil Project Contract Standards',
      'Contractor Personnel Certification Service',
      'Construction Project Compliance System',
    ],
    correctIndex: 0,
    explanation: 'CPCS — Construction Plant Competence Scheme — is the card scheme that certifies plant operators. An operator with a CPCS card commands a higher all-in rate than an uncertified operative. Most civil contracts require CPCS-certified operators for excavators and other plant.',
  },
  {
    id: 'q-04-04',
    moduleSource: '04',
    question: 'Why might a drainage gang\'s daily output be significantly lower than the standard benchmark?',
    type: 'multiple-choice',
    options: [
      'Deep trench, poor ground conditions, restricted access, or adverse weather',
      'Output rates never vary — benchmarks are always achievable',
      'Only if the gang size is reduced below 3 operatives',
      'Only on night shifts where lighting is required',
    ],
    correctIndex: 0,
    explanation: 'Output rates are highly contextual. Deep trenches (3 m+) require more excavation time and shoring. Poor ground (running sand, groundwater) slows all operations. Restricted access limits plant manoeuvre. Always frame output rates as benchmarks under average conditions, not absolutes.',
  },
  {
    id: 'q-04-05',
    moduleSource: '04',
    question: 'Where should site foreman cost be priced in a civil tender?',
    type: 'multiple-choice',
    options: [
      'In the unit rates for the measured works sections',
      'In preliminaries (Class A), not buried in unit rates',
      'In the dayworks schedule',
      'Split 50/50 between unit rates and preliminaries',
    ],
    correctIndex: 1,
    explanation: 'Site foreman and site manager costs are preliminaries costs — they supervise the whole site, not individual work items. Burying them in unit rates distorts those rates and makes it impossible to price properly when the programme changes. Always price supervision in Class A.',
  },

];

// ============================================================
// SR State Management
// ============================================================

/**
 * Load SR state from localStorage, merging in any questions newly added
 * to the bank since the state was last saved.
 */
function loadSRState() {
  let state = {};
  const raw = localStorage.getItem(SR_KEY);

  if (raw) {
    try { state = JSON.parse(raw); } catch (e) { state = {}; }
  }

  // Ensure every question in the bank has a state entry.
  // This handles the case where questions are added after a user's first session.
  let needsSave = !raw;
  QUESTION_BANK.forEach(q => {
    if (!state[q.id]) {
      state[q.id] = {
        interval: 1,
        nextReview: null,
        easeFactor: 2.5,
        timesAnswered: 0,
        timesCorrect: 0,
      };
      needsSave = true;
    }
  });

  if (needsSave) saveSRState(state);
  return state;
}

function saveSRState(state) {
  localStorage.setItem(SR_KEY, JSON.stringify(state));
}

/**
 * Get all questions due for review today, from completed modules only.
 * @returns {Array} question objects ready to display
 */
function getDueQuestions() {
  const state = loadSRState();
  const today = new Date().toISOString().slice(0, 10);

  return QUESTION_BANK.filter(q => {
    if (!isModuleComplete(q.moduleSource)) return false;
    const qState = state[q.id];
    if (!qState || !qState.nextReview) return false;
    return qState.nextReview <= today;
  });
}

/**
 * Record an answer and update the review interval.
 * @param {string}  questionId
 * @param {boolean} correct
 */
function recordSRAnswer(questionId, correct) {
  const state = loadSRState();
  let qState = state[questionId];
  if (!qState) {
    // Guard: create entry if somehow missing
    qState = { interval: 1, nextReview: null, easeFactor: 2.5, timesAnswered: 0, timesCorrect: 0 };
    state[questionId] = qState;
  }

  qState.timesAnswered++;
  if (correct) qState.timesCorrect++;

  let newInterval;
  if (!correct) {
    newInterval = 1;
  } else if (qState.timesCorrect === 1) {
    newInterval = 3;
  } else if (qState.timesCorrect === 2) {
    newInterval = 7;
  } else {
    newInterval = Math.min(Math.round(qState.interval * qState.easeFactor), 30);
  }

  qState.interval = newInterval;
  const next = new Date();
  next.setDate(next.getDate() + newInterval);
  qState.nextReview = next.toISOString().slice(0, 10);

  saveSRState(state);
}

/**
 * Activate SR questions for a module when it is completed for the first time.
 * Sets nextReview to tomorrow for any question not yet activated.
 * @param {string} moduleId
 */
function activateSRQuestionsForModule(moduleId) {
  const state = loadSRState();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  QUESTION_BANK
    .filter(q => q.moduleSource === moduleId)
    .forEach(q => {
      if (!state[q.id]) {
        state[q.id] = { interval: 1, easeFactor: 2.5, timesAnswered: 0, timesCorrect: 0 };
      }
      if (!state[q.id].nextReview) {
        state[q.id].nextReview = tomorrowStr;
      }
    });

  saveSRState(state);
}

/**
 * Return SR stats for a given module (for diagnostics / admin use).
 * @param {string} moduleId
 * @returns {{ total: number, activated: number, mastered: number }}
 */
function getSRStatsForModule(moduleId) {
  const state = loadSRState();
  const questions = QUESTION_BANK.filter(q => q.moduleSource === moduleId);
  const activated = questions.filter(q => state[q.id]?.nextReview).length;
  const mastered  = questions.filter(q => (state[q.id]?.timesCorrect || 0) >= 3).length;
  return { total: questions.length, activated, mastered };
}
