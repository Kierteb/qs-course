/**
 * chunk-types.js — Shared utilities for all 7 chunk types
 * QS Learning Platform
 *
 * Requires: progress.js, spaced-repetition.js to be loaded first.
 *
 * Each module page must define these globals before calling initModulePage():
 *   MODULE_ID    — string, e.g. '01'
 *   CHUNK_LIST   — array of chunk ID strings, e.g. ['01-01', '01-02', ...]
 *
 * Optional globals (define only for modules that contain those chunk types):
 *   CHUNK_WE_CONFIG   — worked example configs, keyed by chunkId
 *   CHUNK_KC_CONFIG   — knowledge check configs, keyed by chunkId
 *   CHUNK_BOQ_EXERCISE_CONFIG — BoQ exercise configs, keyed by chunkId
 */

// ============================================================
// Shared Module Metadata
// ============================================================

const MODULES_META = [
  { id: '01', title: 'How QS Works in Civil & Groundworks',     chunks: 6  },
  { id: '02', title: 'Reading a Bill of Quantities',            chunks: 8  },
  { id: '03', title: 'Understanding Measurements & Units',      chunks: 6  },
  { id: '04', title: 'Labour Pricing',                          chunks: 8  },
  { id: '05', title: 'Plant & Equipment Pricing',               chunks: 8  },
  { id: '06', title: 'Materials Pricing',                       chunks: 7  },
  { id: '07', title: 'Earthworks & Excavation Pricing',         chunks: 9  },
  { id: '08', title: 'Drainage & Utilities Pricing',            chunks: 10 },
  { id: '09', title: 'Concrete & Structures Pricing',           chunks: 8  },
  { id: '10', title: 'Roads, Hardstanding & Surfacing',         chunks: 7  },
  { id: '11', title: 'Preliminaries, Overheads & Profit',       chunks: 8  },
  { id: '12', title: 'Putting It Together: Pricing a Tender',   chunks: 8  },
];

// ============================================================
// Page Initialisation
// ============================================================

/**
 * Full module page init. Call this from each module's inline init().
 */
function initModulePage() {
  updateStreak();
  renderModuleSidebar();
  renderTopbarProgress();
  applyChunkStates();
  checkSRBanner();
}

// ============================================================
// Sidebar & Topbar
// ============================================================

function renderModuleSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  nav.innerHTML = '';
  MODULES_META.forEach(mod => {
    const unlocked = isModuleUnlocked(mod.id);
    const prog = getModuleProgress(mod.id);
    const li = document.createElement('li');
    li.className = 'sidebar__nav-item'
      + (mod.id === MODULE_ID ? ' active' : '')
      + (unlocked ? '' : ' locked');

    if (unlocked) {
      li.innerHTML = `
        <a href="../modules/module-${mod.id}.html">
          <span class="sidebar__module-num">${mod.id}</span>
          <span class="sidebar__module-name">${mod.title}</span>
          <span class="sidebar__module-progress">${prog.completed}/${prog.total}</span>
        </a>`;
    } else {
      li.innerHTML = `
        <button disabled>
          <span class="sidebar__module-num">${mod.id}</span>
          <span class="sidebar__module-name">${mod.title}</span>
          <span class="sidebar__lock-icon">&#128274;</span>
        </button>`;
    }
    nav.appendChild(li);
  });
}

function renderTopbarProgress() {
  const overall = getOverallProgress();
  const pct = overall.total > 0 ? Math.round((overall.completed / overall.total) * 100) : 0;
  const fill = document.getElementById('topbar-progress-fill');
  const label = document.getElementById('topbar-progress-label');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = `${overall.completed} / ${overall.total} chunks`;
}

// ============================================================
// Chunk State Management
// ============================================================

function applyChunkStates() {
  let foundFirstIncomplete = false;

  CHUNK_LIST.forEach(chunkId => {
    const el = document.getElementById('chunk-' + chunkId);
    if (!el) return;
    const complete = isChunkComplete(MODULE_ID, chunkId);

    if (complete) {
      el.classList.remove('chunk--locked', 'chunk--active');
      el.classList.add('chunk--complete');
      _setMarkCompleteButtonDone(chunkId);
      restoreInteractiveState(chunkId);
    } else if (!foundFirstIncomplete) {
      el.classList.remove('chunk--locked', 'chunk--complete');
      el.classList.add('chunk--active');
      foundFirstIncomplete = true;
    } else {
      el.classList.add('chunk--locked');
      el.classList.remove('chunk--active', 'chunk--complete');
    }
  });

  _updateModuleProgressDisplay();

  if (isModuleComplete(MODULE_ID)) {
    const banner = document.getElementById('module-complete');
    if (banner) banner.style.display = 'block';
  }
}

function _setMarkCompleteButtonDone(chunkId) {
  const btn = document.querySelector(`button.mark-complete-btn[data-chunk="${chunkId}"]`);
  if (btn) {
    btn.textContent = '✓ Complete';
    btn.disabled = true;
    btn.style.opacity = '0.5';
  }
}

function _updateModuleProgressDisplay() {
  const prog = getModuleProgress(MODULE_ID);
  const pct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
  const fillEl = document.getElementById('module-progress-fill');
  const textEl = document.getElementById('module-progress-text');
  if (fillEl) fillEl.style.width = pct + '%';
  if (textEl) textEl.textContent = `Chunk ${prog.completed} of ${prog.total}`;
}

/**
 * Restore interactive widget state for chunks already complete on page load.
 * Reads CHUNK_WE_CONFIG, CHUNK_KC_CONFIG, CHUNK_BOQ_EXERCISE_CONFIG globals.
 */
function restoreInteractiveState(chunkId) {
  // Worked example — reveal all steps
  const weConfig = (typeof CHUNK_WE_CONFIG !== 'undefined') && CHUNK_WE_CONFIG[chunkId];
  if (weConfig) {
    const container = document.getElementById('steps-' + chunkId);
    if (container) {
      container.querySelectorAll('.step').forEach(step => {
        step.classList.add('step--revealed');
        const trigger = step.querySelector('.step__trigger');
        if (trigger) trigger.disabled = true;
      });
    }
  }

  // Knowledge check — dim options, show "previously answered" note
  const kcConfig = (typeof CHUNK_KC_CONFIG !== 'undefined') && CHUNK_KC_CONFIG[chunkId];
  if (kcConfig) {
    const opts = document.getElementById('kc-options-' + chunkId);
    if (opts) {
      opts.querySelectorAll('.kc-option').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('kc-option--dimmed');
      });
    }
    const feedbackEl = document.getElementById('kc-feedback-' + chunkId);
    if (feedbackEl && !feedbackEl.innerHTML.trim()) {
      feedbackEl.style.display = 'block';
      feedbackEl.className = 'kc-feedback kc-feedback--correct';
      feedbackEl.innerHTML = '<em style="color: var(--text-dim)">This question was answered in a previous session.</em>';
    }
  }

  // BoQ exercise — show completed note
  const boqConfig = (typeof CHUNK_BOQ_EXERCISE_CONFIG !== 'undefined') && CHUNK_BOQ_EXERCISE_CONFIG[chunkId];
  if (boqConfig) {
    const submitBtn = document.getElementById('boq-submit-' + chunkId);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitted';
    }
    const inputs = document.querySelectorAll(`#chunk-${chunkId} .boq-rate-input`);
    inputs.forEach(inp => inp.disabled = true);
  }

  // BoQ decode exercise — show completed note
  const decodeEl = document.getElementById('boq-decode-' + chunkId);
  if (decodeEl) {
    const submitBtn = decodeEl.querySelector('.boq-decode-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitted';
    }
    decodeEl.querySelectorAll('.kc-option').forEach(btn => {
      btn.disabled = true;
      btn.classList.add('kc-option--dimmed');
    });
  }

  // Numeric exercise — show completed note
  const numericEl = document.getElementById('numeric-exercise-' + chunkId);
  if (numericEl) {
    const submitBtn = numericEl.querySelector('.numeric-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitted';
    }
    numericEl.querySelectorAll('.numeric-input').forEach(inp => inp.disabled = true);
  }
}

// ============================================================
// Mark Complete Handler
// ============================================================

function handleMarkComplete(chunkId) {
  markChunkComplete(MODULE_ID, chunkId);

  if (isModuleComplete(MODULE_ID)) {
    if (typeof activateSRQuestionsForModule === 'function') {
      activateSRQuestionsForModule(MODULE_ID);
    }
  }

  applyChunkStates();
  renderModuleSidebar();
  renderTopbarProgress();

  // Scroll to next chunk
  const idx = CHUNK_LIST.indexOf(chunkId);
  if (idx >= 0 && idx < CHUNK_LIST.length - 1) {
    const next = document.getElementById('chunk-' + CHUNK_LIST[idx + 1]);
    if (next) setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  if (isModuleComplete(MODULE_ID)) {
    setTimeout(() => {
      const banner = document.getElementById('module-complete');
      if (banner) {
        banner.style.display = 'block';
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }
}

// ============================================================
// Type 3: Worked Example — Step Reveal
// ============================================================

/**
 * Reveal a step in a worked example chunk.
 * Reads CHUNK_WE_CONFIG[chunkId].totalSteps to know when to unlock the complete button.
 *
 * @param {string} chunkId
 * @param {number} stepNum    - 1-based
 */
function revealStep(chunkId, stepNum) {
  const config = (typeof CHUNK_WE_CONFIG !== 'undefined') && CHUNK_WE_CONFIG[chunkId];
  const totalSteps = config ? config.totalSteps : stepNum;

  const stepEl = document.getElementById(`step-${chunkId}-${stepNum}`);
  if (!stepEl) return;
  stepEl.classList.add('step--revealed');
  const trigger = stepEl.querySelector('.step__trigger');
  if (trigger) trigger.disabled = true;

  // Unlock next step
  const nextStep = document.getElementById(`step-${chunkId}-${stepNum + 1}`);
  if (nextStep) {
    const nextTrigger = nextStep.querySelector('.step__trigger');
    if (nextTrigger) nextTrigger.disabled = false;
  }

  // All steps revealed — enable mark complete
  if (stepNum === totalSteps) {
    const btn = document.getElementById(`complete-btn-${chunkId}`);
    if (btn) btn.disabled = false;
  }
}

// ============================================================
// Type 6: Knowledge Check
// ============================================================

/**
 * Handle a multiple-choice knowledge check answer.
 * Reads CHUNK_KC_CONFIG[chunkId] for correct answer and explanations.
 *
 * Config shape:
 * {
 *   correctIdx: number,
 *   correctExplanation: string (HTML),
 *   incorrectExplanations: string[] (one per option, null for correct option)
 * }
 *
 * @param {string} chunkId
 * @param {number} selectedIdx - 0-based index of selected option
 */
function selectKCOption(chunkId, selectedIdx) {
  const config = (typeof CHUNK_KC_CONFIG !== 'undefined') && CHUNK_KC_CONFIG[chunkId];
  if (!config) return;

  const { correctIdx, correctExplanation, incorrectExplanations } = config;
  const container = document.getElementById('kc-options-' + chunkId);
  const feedbackEl = document.getElementById('kc-feedback-' + chunkId);
  if (!container) return;

  const buttons = container.querySelectorAll('.kc-option');
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIdx) btn.classList.add('kc-option--correct');
    else if (idx === selectedIdx) btn.classList.add('kc-option--incorrect');
    else btn.classList.add('kc-option--dimmed');
  });

  const correct = selectedIdx === correctIdx;
  if (feedbackEl) {
    feedbackEl.style.display = 'block';
    feedbackEl.className = 'kc-feedback ' + (correct ? 'kc-feedback--correct' : 'kc-feedback--incorrect');

    if (correct) {
      feedbackEl.innerHTML = `<strong style="color:var(--success)">Correct.</strong> ${correctExplanation}`;
    } else {
      const extra = incorrectExplanations && incorrectExplanations[selectedIdx]
        ? ' ' + incorrectExplanations[selectedIdx]
        : '';
      feedbackEl.innerHTML = `<strong style="color:var(--error)">Not quite.</strong>${extra} The correct answer is highlighted above. ${correctExplanation}`;
    }
  }

  // Enable mark complete after one attempt (right or wrong)
  const btn = document.getElementById('complete-btn-' + chunkId);
  if (btn) btn.disabled = false;
}

// ============================================================
// Type 4: Rate Builder — Live Interactive Calculator
// ============================================================

/**
 * Wire up a rate builder widget for live calculation.
 *
 * HTML structure expected:
 *   <div class="rate-builder" id="rb-{id}">
 *     <input class="rate-builder__input" data-key="keyName" type="number" value="...">
 *     ...
 *     <!-- Optional formula display spans: data-formula-key="keyName" -->
 *     <span class="rate-builder__result-value" id="rb-{id}-result"></span>
 *   </div>
 *
 * @param {string} containerId     - e.g. 'rb-04-04'
 * @param {function} calculateFn   - receives object of { key: value } from inputs, returns number
 * @param {string} [outputPrefix]  - e.g. '£'
 * @param {string} [outputSuffix]  - e.g. '/m'
 */
function initRateBuilder(containerId, calculateFn, outputPrefix = '£', outputSuffix = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const inputs = container.querySelectorAll('.rate-builder__input');
  const resultEl = container.querySelector('.rate-builder__result-value');

  function recalculate() {
    const vals = {};
    inputs.forEach(input => {
      vals[input.dataset.key] = parseFloat(input.value) || 0;
      // Update formula display spans
      const span = container.querySelector(`[data-formula-key="${input.dataset.key}"]`);
      if (span) span.textContent = input.value;
    });

    const result = calculateFn(vals);
    if (resultEl) {
      if (!isFinite(result) || isNaN(result) || result <= 0) {
        resultEl.textContent = '—';
      } else {
        resultEl.textContent = outputPrefix + result.toFixed(2) + outputSuffix;
      }
    }
  }

  inputs.forEach(input => input.addEventListener('input', recalculate));
  recalculate();
}

// ============================================================
// Type 5: BoQ Rate Entry Exercise
// ============================================================

/**
 * Grade a BoQ rate entry exercise and show per-row feedback.
 * Reads CHUNK_BOQ_EXERCISE_CONFIG[chunkId].
 *
 * Config shape:
 * {
 *   items: [
 *     {
 *       ref: string,           // item reference, used as input ID suffix
 *       correctRate: number,
 *       tolerance: number,     // fraction, e.g. 0.15 for ±15%
 *       explanation: string,   // shown in feedback
 *       unit: string,
 *       qty: number,
 *     }
 *   ]
 * }
 *
 * @param {string} chunkId
 */
function submitBoQRateExercise(chunkId) {
  const config = (typeof CHUNK_BOQ_EXERCISE_CONFIG !== 'undefined') && CHUNK_BOQ_EXERCISE_CONFIG[chunkId];
  if (!config) return;

  const submitBtn = document.getElementById('boq-submit-' + chunkId);
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitted'; }

  let correctCount = 0;
  let acceptableCount = 0;
  const feedbackItems = [];

  config.items.forEach(item => {
    const input = document.getElementById(`boq-input-${chunkId}-${item.ref}`);
    const totalCell = document.getElementById(`boq-total-${chunkId}-${item.ref}`);
    const resultCell = document.getElementById(`boq-result-${chunkId}-${item.ref}`);

    if (!input) return;
    input.disabled = true;

    const userRate = parseFloat(input.value);
    const result = (typeof evaluateRate === 'function')
      ? evaluateRate(userRate, item.correctRate, item.tolerance || 0.15)
      : 'incorrect';

    if (result === 'correct') correctCount++;
    if (result === 'acceptable') acceptableCount++;

    input.classList.add(result);

    if (totalCell) {
      const total = isNaN(userRate) ? '—' : '£' + (userRate * item.qty).toFixed(0);
      totalCell.textContent = total;
    }
    if (resultCell) {
      resultCell.textContent = result === 'correct' ? '✓' : result === 'acceptable' ? '~' : '✗';
      resultCell.style.color = result === 'correct'
        ? 'var(--success)' : result === 'acceptable'
        ? 'var(--warning)' : 'var(--error)';
    }

    feedbackItems.push({ result, item, userRate });
  });

  // Show feedback panel
  const feedbackPanel = document.getElementById('boq-feedback-' + chunkId);
  if (feedbackPanel) {
    const total = config.items.length;
    const inRange = correctCount + acceptableCount;
    feedbackPanel.style.display = 'block';
    feedbackPanel.innerHTML = `
      <p class="boq-score">${inRange} / ${total} items within acceptable range</p>
      <div class="boq-feedback">
        ${feedbackItems.map(({ result, item, userRate }) => `
          <div class="boq-feedback__item boq-feedback__item--${result}">
            <strong>${item.ref}</strong> —
            Your rate: <span class="text-mono">£${isNaN(userRate) ? '—' : userRate.toFixed(2)}</span>
            &nbsp;|&nbsp; Correct range: <span class="text-mono">£${(item.correctRate * 0.85).toFixed(0)}–${(item.correctRate * 1.15).toFixed(0)}</span><br>
            <span style="color: var(--text-secondary); font-size: var(--text-sm);">${item.explanation}</span>
          </div>
        `).join('')}
      </div>`;
  }

  // Enable mark complete regardless of score
  const completeBtn = document.getElementById('complete-btn-' + chunkId);
  if (completeBtn) completeBtn.disabled = false;
}

// ============================================================
// Type 5b: BoQ Decode Exercise (Module 02 style)
// ============================================================

/**
 * Grade a BoQ decode exercise where each question is a standalone MC.
 * Answers tracked in window._decodeAnswers[exerciseId].
 *
 * @param {string} exerciseId
 * @param {Array}  questions  - array of { correctIdx, explanation }
 * @param {string} chunkId    - for enabling mark-complete button
 */
function submitBoQDecodeExercise(exerciseId, questions, chunkId) {
  const answers = window._decodeAnswers && window._decodeAnswers[exerciseId];
  if (!answers) return;

  let score = 0;
  const feedbackHtml = [];

  questions.forEach((q, qi) => {
    const selected = answers[qi];
    const correct = selected === q.correctIdx;
    if (correct) score++;

    // Style the options for this question
    const qContainer = document.getElementById(`${exerciseId}-q${qi}`);
    if (qContainer) {
      qContainer.querySelectorAll('.kc-option').forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correctIdx) btn.classList.add('kc-option--correct');
        else if (i === selected) btn.classList.add('kc-option--incorrect');
        else btn.classList.add('kc-option--dimmed');
      });
    }

    feedbackHtml.push(`
      <div class="boq-feedback__item boq-feedback__item--${correct ? 'correct' : 'incorrect'}">
        <strong>Item ${qi + 1}:</strong> ${correct ? '✓ Correct' : '✗ Incorrect'} —
        <span style="color: var(--text-secondary); font-size: var(--text-sm);">${q.explanation}</span>
      </div>`);
  });

  const submitBtn = document.getElementById('submit-' + exerciseId);
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitted'; }

  const feedbackPanel = document.getElementById('feedback-' + exerciseId);
  if (feedbackPanel) {
    feedbackPanel.style.display = 'block';
    feedbackPanel.innerHTML = `
      <p class="boq-score">${score} / ${questions.length} correct</p>
      <div class="boq-feedback">${feedbackHtml.join('')}</div>`;
  }

  const completeBtn = document.getElementById('complete-btn-' + chunkId);
  if (completeBtn) completeBtn.disabled = false;
}

/**
 * Record a decode exercise answer selection.
 * @param {string} exerciseId
 * @param {number} questionIdx
 * @param {number} selectedIdx
 */
function selectDecodeAnswer(exerciseId, questionIdx, selectedIdx) {
  if (!window._decodeAnswers) window._decodeAnswers = {};
  if (!window._decodeAnswers[exerciseId]) window._decodeAnswers[exerciseId] = {};
  window._decodeAnswers[exerciseId][questionIdx] = selectedIdx;

  // Visual: mark selected option
  const qContainer = document.getElementById(`${exerciseId}-q${questionIdx}`);
  if (qContainer) {
    qContainer.querySelectorAll('.kc-option').forEach((btn, i) => {
      btn.classList.toggle('kc-option--selected', i === selectedIdx);
    });
  }

  // Enable submit when all questions answered
  const submitBtn = document.getElementById('submit-' + exerciseId);
  if (submitBtn) {
    const answered = Object.keys(window._decodeAnswers[exerciseId]).length;
    // Total questions derived from how many q-containers exist
    const total = document.querySelectorAll(`[id^="${exerciseId}-q"]`).length;
    if (answered >= total) submitBtn.disabled = false;
  }
}

// ============================================================
// Type 5c: Numeric Exercise (Module 03 style)
// ============================================================

/**
 * Grade a numeric input exercise.
 * Reads CHUNK_NUMERIC_EXERCISE_CONFIG[chunkId].
 *
 * Config shape:
 * {
 *   questions: [
 *     {
 *       id: string,           // used as input element suffix
 *       correctAnswer: number,
 *       tolerance: number,    // fraction, e.g. 0.05 for ±5%
 *       unit: string,
 *       explanation: string,
 *     }
 *   ]
 * }
 *
 * @param {string} chunkId
 */
function submitNumericExercise(chunkId) {
  const config = (typeof CHUNK_NUMERIC_EXERCISE_CONFIG !== 'undefined')
    && CHUNK_NUMERIC_EXERCISE_CONFIG[chunkId];
  if (!config) return;

  let correct = 0;
  const feedbackHtml = [];

  config.questions.forEach(q => {
    const input = document.getElementById(`numeric-${chunkId}-${q.id}`);
    const resultEl = document.getElementById(`numeric-result-${chunkId}-${q.id}`);
    if (!input) return;
    input.disabled = true;

    const userVal = parseFloat(input.value);
    const tolerance = q.tolerance || 0.05;
    const isCorrect = !isNaN(userVal)
      && Math.abs(userVal - q.correctAnswer) / q.correctAnswer <= tolerance;

    if (isCorrect) correct++;
    input.classList.add(isCorrect ? 'correct' : 'incorrect');

    if (resultEl) {
      resultEl.textContent = isCorrect ? '✓' : '✗';
      resultEl.style.color = isCorrect ? 'var(--success)' : 'var(--error)';
    }

    feedbackHtml.push(`
      <div class="boq-feedback__item boq-feedback__item--${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect
          ? `<strong style="color:var(--success)">Correct.</strong>`
          : `<strong style="color:var(--error)">Not quite.</strong>
             Your answer: <span class="text-mono">${isNaN(userVal) ? '—' : userVal} ${q.unit}</span>
             &nbsp;|&nbsp; Correct: <span class="text-mono">${q.correctAnswer} ${q.unit}</span>`}
        <br><span style="color: var(--text-secondary); font-size: var(--text-sm);">${q.explanation}</span>
      </div>`);
  });

  const submitBtn = document.getElementById('numeric-submit-' + chunkId);
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitted'; }

  const feedbackPanel = document.getElementById('numeric-feedback-' + chunkId);
  if (feedbackPanel) {
    feedbackPanel.style.display = 'block';
    feedbackPanel.innerHTML = `
      <p class="boq-score">${correct} / ${config.questions.length} correct</p>
      <div class="boq-feedback">${feedbackHtml.join('')}</div>`;
  }

  const completeBtn = document.getElementById('complete-btn-' + chunkId);
  if (completeBtn) completeBtn.disabled = false;
}

// ============================================================
// Type 7: SR Prompt & Overlay
// ============================================================

function checkSRBanner() {
  if (typeof getDueQuestions !== 'function') return;
  const due = getDueQuestions();
  if (due.length > 0) {
    const countEl = document.getElementById('sr-banner-count');
    if (countEl) countEl.textContent =
      `${due.length} recap question${due.length > 1 ? 's' : ''} due`;
    const banner = document.getElementById('sr-banner');
    if (banner) banner.style.display = 'flex';
  }
}

function dismissSRBanner() {
  const banner = document.getElementById('sr-banner');
  if (banner) banner.style.display = 'none';
}

let _srQueue = [];
let _srCurrentIdx = 0;

function openSROverlay() {
  _srQueue = typeof getDueQuestions === 'function' ? getDueQuestions() : [];
  if (_srQueue.length === 0) return;
  _srCurrentIdx = 0;
  const overlay = document.getElementById('sr-overlay');
  if (overlay) overlay.style.display = 'flex';
  _renderSRCard();
}

function closeSROverlay() {
  const overlay = document.getElementById('sr-overlay');
  if (overlay) overlay.style.display = 'none';
  dismissSRBanner();
  // Also dismiss the dashboard-style notification if present
  const dashNotif = document.getElementById('sr-notification');
  if (dashNotif) dashNotif.style.display = 'none';
}

function _renderSRCard() {
  const q = _srQueue[_srCurrentIdx];
  const card = document.getElementById('sr-card');
  const counter = document.getElementById('sr-counter');
  if (!card || !q) return;
  if (counter) counter.textContent = `${_srCurrentIdx + 1} of ${_srQueue.length}`;

  const optionsHTML = q.options.map((opt, i) =>
    `<button class="kc-option" onclick="answerSR(${i})" id="sr-opt-${i}">
      <span class="kc-option__letter">${String.fromCharCode(65 + i)}</span>${opt}
    </button>`
  ).join('');

  const isLast = _srCurrentIdx >= _srQueue.length - 1;
  card.innerHTML = `
    <p class="sr-card__source">Module ${q.moduleSource}</p>
    <p class="sr-card__question">${q.question}</p>
    <div class="sr-card__options">${optionsHTML}</div>
    <div id="sr-feedback" style="display:none; margin-top:16px;"></div>
    <div class="sr-card__footer">
      <span></span>
      <button class="btn btn--primary btn--small" id="sr-next-btn" style="display:none"
        onclick="nextSRQuestion()">${isLast ? 'Finish Review' : 'Next Question'}</button>
    </div>`;
}

function answerSR(selectedIdx) {
  const q = _srQueue[_srCurrentIdx];
  if (!q) return;
  const correct = selectedIdx === q.correctIndex;
  if (typeof recordSRAnswer === 'function') recordSRAnswer(q.id, correct);

  for (let i = 0; i < q.options.length; i++) {
    const btn = document.getElementById(`sr-opt-${i}`);
    if (!btn) continue;
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add('kc-option--correct');
    else if (i === selectedIdx) btn.classList.add('kc-option--incorrect');
    else btn.classList.add('kc-option--dimmed');
  }

  const fb = document.getElementById('sr-feedback');
  if (fb) {
    fb.style.display = 'block';
    fb.className = 'kc-feedback ' + (correct ? 'kc-feedback--correct' : 'kc-feedback--incorrect');
    fb.innerHTML = (correct
      ? '<strong style="color:var(--success)">Correct.</strong> '
      : '<strong style="color:var(--error)">Not quite.</strong> ') + q.explanation;
  }
  const nextBtn = document.getElementById('sr-next-btn');
  if (nextBtn) nextBtn.style.display = 'inline-flex';
}

function nextSRQuestion() {
  _srCurrentIdx++;
  if (_srCurrentIdx >= _srQueue.length) {
    closeSROverlay();
  } else {
    _renderSRCard();
  }
}
