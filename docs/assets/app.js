import { calculate, example } from './calculate.js';
const ja = document.documentElement.lang === 'ja';
const form = document.querySelector('#calculator');
const events = document.querySelector('#events');
const output = document.querySelector('#output');
const error = document.querySelector('#error');
const labels = ja ? ['段階', 'イベント', '総株数', '持分 %', '簡易EPS', '株数増加 %', '持分希薄化 %', '持分低下 pt'] : ['Step', 'Event', 'Total shares', 'Ownership %', 'Simple EPS', 'Share growth %', 'Ownership dilution %', 'Ownership drop pp'];
const typeLabels = ja ? { initial: '開始', issue: '新株発行', rsu: 'RSU権利確定', exercise: '全額行使', buyback: '自社株買い' } : { initial: 'Initial', issue: 'New shares', rsu: 'RSU vesting', exercise: 'Full exercise', buyback: 'Buyback' };
function addEvent(item = { type: 'issue', shares: 1000000 }) {
  const row = document.createElement('div'); row.className = 'event-row';
  const select = document.createElement('select'); select.setAttribute('aria-label', ja ? 'イベント種別' : 'Event type');
  for (const type of ['issue', 'rsu', 'exercise', 'buyback']) { const option = document.createElement('option'); option.value = type; option.textContent = typeLabels[type]; select.append(option); }
  select.value = item.type;
  const input = document.createElement('input'); input.type = 'number'; input.min = '1'; input.step = '1'; input.required = true; input.value = item.shares; input.setAttribute('aria-label', ja ? 'イベント株数' : 'Event shares');
  const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'quiet'; remove.textContent = ja ? '削除' : 'Remove'; remove.onclick = () => row.remove();
  row.append(select, input, remove); events.append(row);
}
function read() {
  return { shares: Number(form.elements.shares.value), holding: Number(form.elements.holding.value), income: Number(form.elements.income.value), currency: form.elements.currency.value.toUpperCase(), events: [...events.children].map(row => ({ type: row.querySelector('select').value, shares: Number(row.querySelector('input').value) })) };
}
function load(input) {
  calculate(input);
  for (const key of ['shares', 'holding', 'income', 'currency']) form.elements[key].value = input[key];
  events.replaceChildren(); input.events.forEach(addEvent); render();
}
function render() {
  error.textContent = ''; output.replaceChildren();
  try {
    const result = calculate(read());
    const table = document.createElement('table'); const caption = document.createElement('caption'); caption.textContent = ja ? `${result.currency}・固定利益・期末株数（法定希薄化後EPSではありません）` : `${result.currency} · constant income · period-end shares (not statutory diluted EPS)`; table.append(caption);
    const tr = document.createElement('tr'); labels.forEach(text => { const th = document.createElement('th'); th.scope = 'col'; th.textContent = text; tr.append(th); }); const thead = document.createElement('thead'); thead.append(tr); table.append(thead);
    const tbody = document.createElement('tbody');
    for (const row of result.rows) { const tr = document.createElement('tr'); [row.step, typeLabels[row.type], row.shares.toLocaleString(), row.ownershipPct.toFixed(6), row.simpleEps.toFixed(6), row.shareGrowthPct.toFixed(6), row.ownershipDilutionPct.toFixed(6), row.ownershipChangePp.toFixed(6)].forEach(value => { const td = document.createElement('td'); td.textContent = value; tr.append(td); }); tbody.append(tr); }
    table.append(tbody); output.append(table);
  } catch (e) { error.textContent = e.message; }
}
form.addEventListener('submit', e => { e.preventDefault(); render(); });
document.querySelector('#add-event').onclick = () => addEvent();
document.querySelector('#example').onclick = () => load(example);
document.querySelector('#save').onclick = () => { try { const input = read(); calculate(input); const url = URL.createObjectURL(new Blob([JSON.stringify(input, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'share-slice-scenario.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); } catch (e) { error.textContent = e.message; } };
document.querySelector('#load').onchange = async e => { try { load(JSON.parse(await e.target.files[0].text())); } catch (err) { error.textContent = err.message; } };
load(example);
