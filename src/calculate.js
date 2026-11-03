export const example = { shares: 100000000, holding: 1000000, income: 20000000, currency: 'USD', events: [{ type: 'issue', shares: 10000000 }, { type: 'rsu', shares: 5000000 }] };
const types = new Set(['issue', 'rsu', 'exercise', 'buyback']);
export function calculate(input) {
  const { shares, holding, income, events = [], currency = 'USD' } = input;
  if (!Number.isSafeInteger(shares) || shares <= 0) throw new Error('Initial shares must be a positive safe integer.');
  if (!Number.isSafeInteger(holding) || holding < 0 || holding > shares) throw new Error('Holding must be an integer between zero and initial shares.');
  if (!Number.isFinite(income)) throw new Error('Income must be finite; losses are allowed.');
  if (!Array.isArray(events)) throw new Error('Events must be an array.');
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('Use a three-letter currency label.');
  let total = shares;
  const row = (step, type) => ({ step, type, shares: total, holding, ownershipPct: holding / total * 100, simpleEps: income / total, shareGrowthPct: (total / shares - 1) * 100, ownershipDilutionPct: (1 - shares / total) * 100, ownershipChangePp: holding / shares * 100 - holding / total * 100 });
  const rows = [row(0, 'initial')];
  events.forEach((event, i) => {
    if (!types.has(event.type) || !Number.isSafeInteger(event.shares) || event.shares <= 0) throw new Error(`Event ${i + 1}: use a known type and positive integer shares.`);
    if (event.type === 'buyback' && event.shares > total - holding) throw new Error(`Event ${i + 1}: buyback exceeds shares held by other shareholders.`);
    total += event.type === 'buyback' ? -event.shares : event.shares;
    if (!Number.isSafeInteger(total) || total <= 0) throw new Error(`Event ${i + 1}: resulting share count is invalid.`);
    rows.push(row(i + 1, event.type));
  });
  return { currency, assumptions: ['Fixed holder share count', 'Constant period income', 'End-of-period shares, not weighted-average', 'Full exercise, not treasury stock method', 'Not statutory diluted EPS'], rows };
}
