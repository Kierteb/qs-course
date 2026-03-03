/**
 * progress.js — Progress tracking and localStorage logic
 * QS Learning Platform
 */

const PROGRESS_KEY = 'qs_progress';

// Module chunk totals (must match MODULES array in each page)
const MODULE_CHUNK_TOTALS = {
  '01': 6,
  '02': 8,
  '03': 6,
  '04': 8,
  '05': 8,
  '06': 7,
  '07': 9,
  '08': 10,
  '09': 8,
  '10': 7,
  '11': 8,
  '12': 8,
};

/**
 * Load progress from localStorage, initialising if needed.
 */
function loadProgress() {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      // Corrupt data — reset
    }
  }
  return initProgress();
}

/**
 * Initialise a fresh progress object.
 */
function initProgress() {
  const modules = {};
  Object.keys(MODULE_CHUNK_TOTALS).forEach(id => {
    modules[id] = {
      unlocked: id === '01',
      complete: false,
      chunks: {},
    };
  });
  const progress = {
    lastSession: null,
    streak: 0,
    modules,
  };
  saveProgress(progress);
  return progress;
}

/**
 * Save progress object to localStorage.
 */
function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

/**
 * Mark a specific chunk as complete.
 * @param {string} moduleId - e.g. '01'
 * @param {string} chunkId  - e.g. '01-03'
 */
function markChunkComplete(moduleId, chunkId) {
  const progress = loadProgress();
  if (!progress.modules[moduleId]) return;

  progress.modules[moduleId].chunks[chunkId] = {
    complete: true,
    completedAt: new Date().toISOString(),
  };

  // Check if module is now complete
  const total = MODULE_CHUNK_TOTALS[moduleId] || 0;
  const completedCount = Object.values(progress.modules[moduleId].chunks)
    .filter(c => c.complete).length;

  if (completedCount >= total) {
    progress.modules[moduleId].complete = true;
    // Unlock next module
    const nextId = String(parseInt(moduleId, 10) + 1).padStart(2, '0');
    if (progress.modules[nextId]) {
      progress.modules[nextId].unlocked = true;
    }
  }

  saveProgress(progress);
}

/**
 * Check if a module is unlocked.
 * @param {string} moduleId
 * @returns {boolean}
 */
function isModuleUnlocked(moduleId) {
  const progress = loadProgress();
  return progress.modules[moduleId]?.unlocked === true;
}

/**
 * Check if a module is complete (all chunks marked).
 * @param {string} moduleId
 * @returns {boolean}
 */
function isModuleComplete(moduleId) {
  const progress = loadProgress();
  return progress.modules[moduleId]?.complete === true;
}

/**
 * Check if a specific chunk is complete.
 * @param {string} moduleId
 * @param {string} chunkId
 * @returns {boolean}
 */
function isChunkComplete(moduleId, chunkId) {
  const progress = loadProgress();
  return progress.modules[moduleId]?.chunks[chunkId]?.complete === true;
}

/**
 * Get overall progress across all modules.
 * @returns {{ completed: number, total: number }}
 */
function getOverallProgress() {
  const progress = loadProgress();
  let completed = 0;
  let total = 0;
  Object.keys(MODULE_CHUNK_TOTALS).forEach(id => {
    total += MODULE_CHUNK_TOTALS[id];
    const mod = progress.modules[id];
    if (mod) {
      completed += Object.values(mod.chunks).filter(c => c.complete).length;
    }
  });
  return { completed, total };
}

/**
 * Get progress for a specific module.
 * @param {string} moduleId
 * @returns {{ completed: number, total: number }}
 */
function getModuleProgress(moduleId) {
  const progress = loadProgress();
  const total = MODULE_CHUNK_TOTALS[moduleId] || 0;
  const mod = progress.modules[moduleId];
  const completed = mod
    ? Object.values(mod.chunks).filter(c => c.complete).length
    : 0;
  return { completed, total };
}

/**
 * Update the session streak.
 * Increments if last session was yesterday, resets if more than 1 day ago,
 * does nothing if already logged today.
 */
function updateStreak() {
  const progress = loadProgress();
  const today = new Date().toISOString().slice(0, 10);

  if (progress.lastSession === today) return; // Already counted today

  if (progress.lastSession) {
    const last = new Date(progress.lastSession);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      progress.streak += 1;
    } else if (diffDays > 1) {
      progress.streak = 1;
    }
  } else {
    progress.streak = 1;
  }

  progress.lastSession = today;
  saveProgress(progress);
}

/**
 * Reset all progress (intended for a deliberate settings action only).
 */
function resetAllProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}
