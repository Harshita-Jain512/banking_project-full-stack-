/* ═══════════════════════════════════════════
   NexBank — Banking App JavaScript
   Connects to Spring Boot REST API at :8080
═══════════════════════════════════════════ */

const API_BASE = 'http://localhost:8080/api/accounts';

// ── State ──────────────────────────────────
let allAccounts = [];
let currentModalAccount = null;

// ── Init ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkApiStatus();
  loadAllAccounts();
  setupCreateFormPreview();
});

// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const section = document.getElementById('section-' + name);
  const navBtn  = document.getElementById('nav-' + name);
  if (section) section.classList.add('active');
  if (navBtn)  navBtn.classList.add('active');
}

// ══════════════════════════════════════════
// API STATUS CHECK
// ══════════════════════════════════════════
async function checkApiStatus() {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  const statApi = document.getElementById('stat-api');
  try {
    const res = await fetch(`${API_BASE}/getAll`, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      dot.className  = 'status-dot online';
      text.textContent = 'API Online';
      if (statApi) statApi.textContent = '🟢 Online';
    } else {
      throw new Error('Non-OK response');
    }
  } catch {
    dot.className  = 'status-dot offline';
    text.textContent = 'API Offline';
    if (statApi) statApi.textContent = '🔴 Offline';
  }
}

// ══════════════════════════════════════════
// LOAD ALL ACCOUNTS
// ══════════════════════════════════════════
async function loadAllAccounts() {
  setSkeletonVisible(true);
  try {
    const res  = await fetch(`${API_BASE}/getAll`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allAccounts = await res.json();
    renderDashboard(allAccounts);
    renderAccountsTable(allAccounts);
    updateStats(allAccounts);
    updateLastUpdated();
  } catch (err) {
    showToast('Failed to load accounts — is the backend running?', 'error');
    setSkeletonVisible(false);
    showEmpty(true);
  }
}

function setSkeletonVisible(show) {
  ['dashboard-skeleton', 'accounts-skeleton'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !show);
  });
  ['dashboard-table', 'accounts-table'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', show);
  });
}

function showEmpty(show) {
  ['dashboard-empty', 'accounts-empty'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !show);
  });
}

function updateStats(accounts) {
  const count = accounts.length;
  const total = accounts.reduce((s, a) => s + (a.balance || 0), 0);
  const avg   = count > 0 ? total / count : 0;

  setText('stat-count',   count);
  setText('stat-balance', formatCurrency(total));
  setText('stat-avg',     formatCurrency(avg));
}

function updateLastUpdated() {
  const now = new Date();
  const el  = document.getElementById('last-updated');
  if (el) el.textContent = 'Last updated: ' + now.toLocaleTimeString();
}

// ══════════════════════════════════════════
// RENDER DASHBOARD TABLE (Top 5)
// ══════════════════════════════════════════
function renderDashboard(accounts) {
  const skeleton = document.getElementById('dashboard-skeleton');
  const table    = document.getElementById('dashboard-table');
  const empty    = document.getElementById('dashboard-empty');
  const body     = document.getElementById('dashboard-table-body');

  if (skeleton) skeleton.classList.add('hidden');

  if (!accounts || accounts.length === 0) {
    if (table) table.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');
  if (table) table.classList.remove('hidden');
  body.innerHTML = accounts.slice(0, 5).map(a => buildAccountRow(a)).join('');
}

// ══════════════════════════════════════════
// RENDER ACCOUNTS TABLE (Full)
// ══════════════════════════════════════════
function renderAccountsTable(accounts) {
  const skeleton = document.getElementById('accounts-skeleton');
  const table    = document.getElementById('accounts-table');
  const empty    = document.getElementById('accounts-empty');
  const body     = document.getElementById('accounts-table-body');

  if (skeleton) skeleton.classList.add('hidden');

  if (!accounts || accounts.length === 0) {
    if (table) table.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');
  if (table) table.classList.remove('hidden');
  body.innerHTML = accounts.map(a => buildAccountRow(a)).join('');
}

function buildAccountRow(a) {
  return `
    <tr>
      <td><span class="account-id">#${a.id}</span></td>
      <td><span class="account-name">${escapeHtml(a.accountHolderName)}</span></td>
      <td><span class="account-balance">${formatCurrency(a.balance)}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon-only" title="View Details" onclick="openModal(${a.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button class="btn btn-success btn-sm" onclick="quickDeposit(${a.id})">Deposit</button>
          <button class="btn btn-warning btn-sm" onclick="quickWithdraw(${a.id})">Withdraw</button>
        </div>
      </td>
    </tr>`;
}

// ══════════════════════════════════════════
// SEARCH / FILTER
// ══════════════════════════════════════════
function filterAccounts() {
  const query    = document.getElementById('search-input').value.toLowerCase().trim();
  const filtered = query
    ? allAccounts.filter(a =>
        String(a.id).includes(query) ||
        (a.accountHolderName || '').toLowerCase().includes(query))
    : allAccounts;
  renderAccountsTable(filtered);
}

// ══════════════════════════════════════════
// CREATE ACCOUNT
// ══════════════════════════════════════════
function setupCreateFormPreview() {
  const nameInput = document.getElementById('create-holder-name');
  const balInput  = document.getElementById('create-balance');
  const preview   = document.getElementById('create-payload-preview');
  if (!nameInput || !balInput || !preview) return;
  const update = () => {
    preview.textContent = JSON.stringify({
      accountHolderName: nameInput.value || '...',
      balance: parseFloat(balInput.value) || 0
    }, null, 2);
  };
  nameInput.addEventListener('input', update);
  balInput.addEventListener('input', update);
}

async function handleCreateAccount(e) {
  e.preventDefault();
  const btn     = document.getElementById('create-submit-btn');
  const name    = document.getElementById('create-holder-name').value.trim();
  const balance = parseFloat(document.getElementById('create-balance').value);

  if (!name) { showToast('Please enter account holder name', 'error'); return; }
  if (isNaN(balance) || balance < 0) { showToast('Please enter a valid balance', 'error'); return; }

  setLoading(btn, true, 'Opening Account...');
  try {
    const res = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountHolderName: name, balance })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status}`);
    }
    const created = await res.json();
    showToast(`✅ Account #${created.id} created for ${created.accountHolderName}!`, 'success');
    document.getElementById('create-form').reset();
    await loadAllAccounts();
    showSection('accounts');
  } catch (err) {
    showToast('Failed to create account: ' + err.message, 'error');
  } finally {
    setLoading(btn, false, 'Open Account', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`);
  }
}

// ══════════════════════════════════════════
// DEPOSIT
// ══════════════════════════════════════════
async function handleDeposit(e) {
  e.preventDefault();
  const btn    = document.getElementById('deposit-submit-btn');
  const id     = document.getElementById('deposit-account-id').value;
  const amount = parseFloat(document.getElementById('deposit-amount').value);

  if (!id || amount <= 0 || isNaN(amount)) {
    showToast('Please enter valid account ID and amount', 'error'); return;
  }

  setLoading(btn, true, 'Processing...');
  try {
    const res = await fetch(`${API_BASE}/${id}/deposit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ammount: amount })  // typo matches backend
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status}`);
    }
    const updated = await res.json();
    showToast(`✅ Deposited ${formatCurrency(amount)} to ${updated.accountHolderName}. New balance: ${formatCurrency(updated.balance)}`, 'success');
    document.getElementById('deposit-form').reset();
    await loadAllAccounts();
  } catch (err) {
    showToast('Deposit failed: ' + err.message, 'error');
  } finally {
    setLoading(btn, false, 'Deposit Funds');
  }
}

// ══════════════════════════════════════════
// WITHDRAW
// ══════════════════════════════════════════
async function handleWithdraw(e) {
  e.preventDefault();
  const btn    = document.getElementById('withdraw-submit-btn');
  const id     = document.getElementById('withdraw-account-id').value;
  const amount = parseFloat(document.getElementById('withdraw-amount').value);

  if (!id || amount <= 0 || isNaN(amount)) {
    showToast('Please enter valid account ID and amount', 'error'); return;
  }

  setLoading(btn, true, 'Processing...');
  try {
    const res = await fetch(`${API_BASE}/${id}/withdraw`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ammount: amount })  // typo matches backend
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status}`);
    }
    const updated = await res.json();
    showToast(`✅ Withdrew ${formatCurrency(amount)} from ${updated.accountHolderName}. New balance: ${formatCurrency(updated.balance)}`, 'success');
    document.getElementById('withdraw-form').reset();
    await loadAllAccounts();
  } catch (err) {
    showToast('Withdrawal failed: ' + err.message, 'error');
  } finally {
    setLoading(btn, false, 'Withdraw Funds');
  }
}

// ══════════════════════════════════════════
// ACCOUNT LOOKUP
// ══════════════════════════════════════════
async function handleLookup(e) {
  e.preventDefault();
  const btn = document.getElementById('lookup-submit-btn');
  const id  = document.getElementById('lookup-account-id').value;
  const resultEl = document.getElementById('lookup-result');

  setLoading(btn, true, 'Searching...');
  resultEl.className = 'lookup-result hidden';

  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Account #${id} not found`);
    const acc = await res.json();
    resultEl.className = 'lookup-result success';
    resultEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:13px;color:var(--text-3)">Account #${acc.id}</span>
          <span class="badge badge-active">Active</span>
        </div>
        <div style="font-size:17px;font-weight:700;color:var(--text)">${escapeHtml(acc.accountHolderName)}</div>
        <div style="font-size:20px;font-weight:800;color:var(--green);font-family:'JetBrains Mono',monospace">${formatCurrency(acc.balance)}</div>
      </div>`;
  } catch (err) {
    resultEl.className = 'lookup-result error';
    resultEl.innerHTML = `<span style="color:var(--red);font-size:14px">❌ ${err.message}</span>`;
  } finally {
    setLoading(btn, false, 'Look Up Account');
  }
}

// ══════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════
async function openModal(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Account not found');
    const acc = await res.json();
    currentModalAccount = acc;

    setText('modal-id',      `#${acc.id}`);
    setText('modal-name',    escapeHtml(acc.accountHolderName));
    setText('modal-balance', formatCurrency(acc.balance));

    document.getElementById('modal-overlay').classList.remove('hidden');
  } catch (err) {
    showToast('Could not load account details: ' + err.message, 'error');
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  currentModalAccount = null;
}

function openTransactionFromModal(type) {
  closeModal();
  showSection('transfer');
  if (currentModalAccount) {
    const idField = document.getElementById(`${type}-account-id`);
    if (idField) { idField.value = currentModalAccount.id; idField.focus(); }
  }
}

// ══════════════════════════════════════════
// QUICK ACTIONS (from table buttons)
// ══════════════════════════════════════════
function quickDeposit(id) {
  showSection('transfer');
  const el = document.getElementById('deposit-account-id');
  if (el) { el.value = id; el.focus(); }
}

function quickWithdraw(id) {
  showSection('transfer');
  const el = document.getElementById('withdraw-account-id');
  if (el) { el.value = id; el.focus(); }
}

// ══════════════════════════════════════════
// REFRESH ALL
// ══════════════════════════════════════════
async function refreshAll() {
  const btn = document.getElementById('refresh-btn');
  btn.classList.add('spinning');
  await checkApiStatus();
  await loadAllAccounts();
  btn.classList.remove('spinning');
  showToast('Data refreshed', 'info');
}

// ══════════════════════════════════════════
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  toast.onclick = () => toast.remove();
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3200);
}

// ══════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount || 0);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setLoading(btn, loading, text, iconHtml = '') {
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 0.7s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> ${text}`;
  } else {
    btn.innerHTML = `${iconHtml} ${text}`.trim();
  }
}

// ── Keyboard: Escape closes modal ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
