/**
 * spaced-repetition.js — SR algorithm and question bank
 * QS Learning Platform
 *
 * Phase 4 implementation. Stub provided so dashboard loads cleanly.
 */

const SR_KEY = 'qs_sr_state';

// ============================================================
// Question Bank
// ============================================================
// Questions are added per module as content is built.
// Each question: { id, moduleSource, question, type, options,
//   correctIndex, explanation, interval, nextReview,
//   easeFactor, timesAnswered, timesCorrect }

const QUESTION_BANK = [
  // Module 01
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
    explanation: 'Measured works are the physical, quantified items in the BoQ — priced at a unit rate multiplied by a quantity. Preliminaries (Class A in CESMM4) cover the costs of running the site rather than the permanent works themselves: welfare, offices, supervision, insurances, bonds, and management.',
  },
  {
    id: 'q-01-02',
    moduleSource: '01',
    question: 'What does a provisional sum represent in a civil engineering BoQ?',
    type: 'multiple-choice',
    options: [
      'A fixed sum included for work that cannot be fully defined at tender stage',
      'The contractor\'s profit allowance built into the tender',
      'The total value of all measured earthworks items',
      'A deduction applied when the contractor underperforms',
    ],
    correctIndex: 0,
    explanation: 'A provisional sum is a defined or undefined allowance included in the BoQ for work that cannot be fully specified at tender. The actual cost is settled during the contract — it is not a fixed price.',
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
      'Raise a query with the client or their QS via the tender query process and price the item as described in the meantime',
      'Price it as you think it should be and note the correction in your submission',
      'Ignore it and price what is written',
      'Withdraw from the tender immediately',
    ],
    correctIndex: 0,
    explanation: 'Always raise BoQ errors via the formal tender query process. Price the item as written unless you receive a formal instruction to do otherwise — do not silently "correct" the BoQ, as this can create contractual problems later.',
  },
  {
    id: 'q-01-05',
    moduleSource: '01',
    question: 'What does "dayworks" mean in a civil engineering contract?',
    type: 'multiple-choice',
    options: [
      'Work instructed and paid on the basis of actual time, labour, plant, and materials used — rather than a unit rate',
      'Work completed during daylight hours as opposed to night shifts',
      'The daily output targets agreed at the start of a contract',
      'A summary of work completed each day for programme purposes',
    ],
    correctIndex: 0,
    explanation: 'Dayworks is a method of valuing work where the contractor is reimbursed for actual resources used (labour, plant, materials) plus an agreed percentage for overhead and profit. It is used where work cannot be measured and valued in the normal way.',
  },

  // Module 03
  {
    id: 'q-03-01',
    moduleSource: '03',
    question: 'Excavated clay bulks by approximately what percentage?',
    type: 'multiple-choice',
    options: ['10%', '25%', '40%', '50%'],
    correctIndex: 1,
    explanation: 'Clay typically bulks by 20–30%. Use 25% as the teaching and standard tender figure for typical cohesive clay. Sandy soils bulk less; rock bulks more. Always state the material type alongside the factor.',
  },
  {
    id: 'q-03-02',
    moduleSource: '03',
    question: 'Granular fill compacts by approximately what percentage when placed and compacted?',
    type: 'multiple-choice',
    options: ['2–5%', '10–15%', '25–30%', '40%'],
    correctIndex: 1,
    explanation: 'Granular fill shrinks by 10–15% when compacted. This means you need to order approximately 12% more tonnes than the net m³ in the BoQ to fill the specified volume after compaction.',
  },
  {
    id: 'q-03-03',
    moduleSource: '03',
    question: 'If you have 100 m³ net of clay excavation, approximately how many m³ loose will you cart away?',
    type: 'multiple-choice',
    options: ['100 m³', '110 m³', '125 m³', '150 m³'],
    correctIndex: 2,
    explanation: '100 m³ × 1.25 = 125 m³ loose. The 25% bulking factor means every m³ dug becomes 1.25 m³ to dispose of. This drives your wagon count, disposal cost, and road sweeper requirement.',
  },
  {
    id: 'q-03-04',
    moduleSource: '03',
    question: 'What unit is used to measure manholes in a CESMM4 BoQ?',
    type: 'multiple-choice',
    options: ['Linear metres (m)', 'Cubic metres (m³)', 'Number (nr)', 'Tonnes (t)'],
    correctIndex: 2,
    explanation: 'Manholes in Class K are measured by number (nr). Each manhole is a separate item. The depth band appears in the item description, not as a separate linear measurement.',
  },
  {
    id: 'q-03-05',
    moduleSource: '03',
    question: 'What unit is used to measure pipe runs in a CESMM4 BoQ?',
    type: 'multiple-choice',
    options: ['Cubic metres (m³)', 'Linear metres (m)', 'Number (nr)', 'Square metres (m²)'],
    correctIndex: 1,
    explanation: 'Pipe runs in Class I are always measured in linear metres (m). The depth tranche, pipe material, and nominal bore appear in the description. The overall rate per metre must account for all the work in the trench.',
  },

  // Module 02
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
    explanation: 'CESMM4 — Civil Engineering Standard Method of Measurement, 4th Edition — is the standard document that defines how civil engineering work is measured and described in a Bill of Quantities.',
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
    question: 'Which CESMM4 class covers pipes specifically?',
    type: 'multiple-choice',
    options: ['Class I', 'Class J', 'Class K', 'Class L'],
    correctIndex: 0,
    explanation: 'Class I is Pipework: Pipes — covering pipe runs measured by type, nominal bore, and depth band. Do not confuse with Class J (fittings), Class K (manholes), or Class L (supports and protection).',
  },
  {
    id: 'q-02-04',
    moduleSource: '02',
    question: 'Which CESMM4 class covers manholes and chambers?',
    type: 'multiple-choice',
    options: ['Class K', 'Class I', 'Class J', 'Class L'],
    correctIndex: 0,
    explanation: 'Class K is Pipework: Manholes & Ancillaries. Each manhole or chamber is a separately priced item, measured by type and depth band.',
  },
  {
    id: 'q-02-05',
    moduleSource: '02',
    question: 'What section of a BoQ should always be read before pricing any item?',
    type: 'multiple-choice',
    options: ['The Preambles', 'The Appendices', 'Class A — General Items', 'The Tender Summary'],
    correctIndex: 0,
    explanation: 'The Preambles section defines how items are measured, what is included in rates, and any project-specific measurement rules. Reading the preambles before pricing prevents mispricing items where the coverage rules have been modified.',
  },
];

// ============================================================
// SR State Management
// ============================================================

function loadSRState() {
  const raw = localStorage.getItem(SR_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return initSRState();
}

function initSRState() {
  const state = {};
  QUESTION_BANK.forEach(q => {
    state[q.id] = {
      interval: 1,
      nextReview: null,
      easeFactor: 2.5,
      timesAnswered: 0,
      timesCorrect: 0,
    };
  });
  saveSRState(state);
  return state;
}

function saveSRState(state) {
  localStorage.setItem(SR_KEY, JSON.stringify(state));
}

/**
 * Get questions due for review today, from completed modules only.
 * @returns {Array} array of question objects
 */
function getDueQuestions() {
  const state = loadSRState();
  const today = new Date().toISOString().slice(0, 10);

  return QUESTION_BANK.filter(q => {
    // Only show questions from completed modules
    if (!isModuleComplete(q.moduleSource)) return false;
    const qState = state[q.id];
    if (!qState) return false;
    if (!qState.nextReview) return false; // Not yet answered
    return qState.nextReview <= today;
  });
}

/**
 * Record an answer and update interval.
 * @param {string} questionId
 * @param {boolean} correct
 */
function recordSRAnswer(questionId, correct) {
  const state = loadSRState();
  const qState = state[questionId];
  if (!qState) return;

  qState.timesAnswered++;
  if (correct) qState.timesCorrect++;

  const today = new Date();
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
  const next = new Date(today);
  next.setDate(next.getDate() + newInterval);
  qState.nextReview = next.toISOString().slice(0, 10);

  saveSRState(state);
}

/**
 * Mark all questions for a module as due for their first review.
 * Called when a module is completed for the first time.
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
      if (!state[q.id]) state[q.id] = { interval: 1, easeFactor: 2.5, timesAnswered: 0, timesCorrect: 0 };
      if (!state[q.id].nextReview) {
        state[q.id].nextReview = tomorrowStr;
      }
    });

  saveSRState(state);
}
