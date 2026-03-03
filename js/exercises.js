/**
 * exercises.js — BoQ exercise engine and rate calculators
 * QS Learning Platform
 *
 * Phase 5 implementation. Stub provided for file structure completeness.
 */

// ============================================================
// BoQ Exercise Engine
// ============================================================

/**
 * Evaluate a user-entered rate against the correct answer.
 * Returns 'correct', 'acceptable', or 'incorrect'.
 *
 * @param {number} userRate
 * @param {number} correctRate
 * @param {number} tolerance  - fraction (e.g. 0.15 = ±15%)
 * @returns {'correct'|'acceptable'|'incorrect'}
 */
function evaluateRate(userRate, correctRate, tolerance = 0.15) {
  if (isNaN(userRate) || userRate <= 0) return 'incorrect';
  const pct = Math.abs(userRate - correctRate) / correctRate;
  if (pct <= 0.05) return 'correct';      // within 5%
  if (pct <= tolerance) return 'acceptable'; // within tolerance
  return 'incorrect';
}

/**
 * Calculate the total for a BoQ item (rate × quantity).
 * @param {number} rate
 * @param {number} qty
 * @returns {string} formatted to 2dp
 */
function calcItemTotal(rate, qty) {
  if (isNaN(rate) || isNaN(qty)) return '—';
  return (rate * qty).toFixed(2);
}

/**
 * Format a currency value as £X,XXX.XX
 * @param {number} val
 * @returns {string}
 */
function formatCurrency(val) {
  if (isNaN(val)) return '—';
  return '£' + val.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ============================================================
// Rate Builder Engine
// ============================================================

/**
 * Calculate labour cost per unit.
 * Formula: (operatives × hourlyRate × hoursPerDay) / dailyOutput
 *
 * @param {number} operatives
 * @param {number} hourlyRate  - all-in rate per operative per hour
 * @param {number} hoursPerDay
 * @param {number} dailyOutput - units produced per day
 * @returns {number} cost per unit
 */
function calcLabourCostPerUnit(operatives, hourlyRate, hoursPerDay, dailyOutput) {
  if (!dailyOutput || dailyOutput === 0) return 0;
  return (operatives * hourlyRate * hoursPerDay) / dailyOutput;
}

/**
 * Calculate plant cost per unit.
 * Formula: (hireRate + fuelPerDay + operatorCost + insurancePerDay) / dailyOutput
 *
 * @param {number} hireRatePerWeek
 * @param {number} fuelPerDay
 * @param {number} operatorCostPerDay
 * @param {number} insurancePerDay
 * @param {number} dailyOutput
 * @returns {number} cost per unit
 */
function calcPlantCostPerUnit(hireRatePerWeek, fuelPerDay, operatorCostPerDay, insurancePerDay, dailyOutput) {
  if (!dailyOutput || dailyOutput === 0) return 0;
  const dailyHire = hireRatePerWeek / 5;
  return (dailyHire + fuelPerDay + operatorCostPerDay + insurancePerDay) / dailyOutput;
}

/**
 * Calculate material cost per unit including wastage.
 * Formula: (supplyRate / conversionFactor) * (1 + wastage)
 *
 * @param {number} supplyRatePerTonne
 * @param {number} tonnesPerM3        - bulk density conversion
 * @param {number} wastage            - fraction (e.g. 0.10 = 10%)
 * @returns {number} cost per m³
 */
function calcMaterialCostPerM3(supplyRatePerTonne, tonnesPerM3, wastage = 0.10) {
  return supplyRatePerTonne * tonnesPerM3 * (1 + wastage);
}
