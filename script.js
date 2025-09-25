// ---------- CONFIG ----------
const API_BASE = "https://script.google.com/macros/s/AKfycby6w6-ZXz-biHv59ve0hJMOTR4fJlzP7MM3CGKt0Wn834nuIrCDHmeZEZwXliJKH6nxTA/exec"; // e.g. https://script.google.com/macros/s/ABCDE/exec

// DOM refs
const totalStudentsEl = document.getElementById('totalStudents');
const totalFeesEl = document.getElementById('totalFees');
const hostelPercentEl = document.getElementById('hostelPercent');
const booksIssuedEl = document.getElementById('booksIssued');
const overviewTableBody = document.querySelector('#overviewTable tbody');

const menuEls = document.querySelectorAll('.sidebar li');
const views = {
  overview: document.getElementById('overviewView'),
  admissions: document.getElementById('admissionsView'),
  fee: document.getElementById('feeView'),
  hostel: document.getElementById('hostelView'),
  library: document.getElementById('libraryView')
};
const pageTitle = document.getElementById('pageTitle');

let admissionsData = [];
let feeData = [];
let hostelData = [];
let libraryData = [];

// Charts
let feeChart, hostelChart;

// ---------- UTIL ----------
async function apiGet(params = {}) {
  const url = new URL(API_BASE);
  Object.keys(params).forEach(k => url.searchParams.append(k, params[k]));
  const res = await fetch(url.toString());
  const json = await res.json();
  return json;
}

// ---------- DATA LOAD ----------
async function loadAll() {
  try {
    // Admissions
    const admRes = await apiGet({ sheet: 'Admissions' });
    admissionsData = admRes.ok ? admRes.data : [];

    // Fee
    const feeRes = await apiGet({ sheet: 'Fee' });
    feeData = feeRes.ok ? feeRes.data : [];

    // Hostel
    const hostRes = await apiGet({ sheet: 'Hostel' });
    hostelData = hostRes.ok ? hostRes.data : [];

    // Library
    const libRes = await apiGet({ sheet: 'Library' });
    libraryData = libRes.ok ? libRes.data : [];

    renderOverview();
    renderCharts();
    renderTables();
  } catch (err) {
    console.error('loadAll error', err);
    alert('Failed to load data from backend. Check API_BASE and deployment.');
  }
}

// ---------- RENDER ----------
function renderOverview() {
  totalStudentsEl.textContent = admissionsData.length || 0;

  // compute fees total
  const amountSum = feeData.reduce((s, r) => {
    const a = Number(String(r.Amount || r.amount || 0).toString().replace(/[^\d.-]/g, '')) || 0;
    return s + a;
  }, 0);
  totalFeesEl.textContent = `₹${(amountSum/100).toLocaleString()}k`;

  // hostel occupancy (try from HostelAvailability if exists)
  const avail = getMasterTab('HostelAvailability');
  if (avail && avail.length) {
    // sum capacity and occupied columns if headers present
    const capCol = Object.keys(avail[0]).find(h => /capacity/i.test(h));
    const occCol = Object.keys(avail[0]).find(h => /occupied/i.test(h));
    if (capCol && occCol) {
      const totalCap = avail.reduce((s,r)=>s + Number(r[capCol]||0),0);
      const totalOcc = avail.reduce((s,r)=>s + Number(r[occCol]||0),0);
      const pct = totalCap > 0 ? Math.round((totalOcc/totalCap)*100) : 0;
      hostelPercentEl.textContent = `${pct}%`;
    } else {
      hostelPercentEl.textContent = `${hostelData.length} allocated`;
    }
  } else {
    hostelPercentEl.textContent = `${hostelData.length} allocated`;
  }

  booksIssuedEl.textContent = libraryData.length || 0;

  // recent admissions table
  overviewTableBody.innerHTML = '';
  const recent = admissionsData.slice(0, 20);
  recent.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r['Roll']||r['roll']||''}</td><td>${r['Name']||r['name']||''}</td><td>${r['Course']||r['course']||''}</td><td>${r['Email']||r['email']||''}</td>`;
    overviewTableBody.appendChild(tr);
  });
}

function getMasterTab(name) {
  // small helper to return the correct variable by name
  if (name === 'Admissions') return admissionsData;
  if (name === 'Fee') return feeData;
  if (name === 'Hostel') return hostelData;
  if (name === 'Library') return libraryData;
  return [];
}

function renderTables() {
  // Admissions page
  const admT = document.querySelector('#admissionsTable tbody');
  admT.innerHTML = '';
  admissionsData.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r['Roll']||r['roll']||''}</td><td>${r['Name']||r['name']||''}</td><td>${r['Course']||r['course']||''}</td><td>${r['Email']||r['email']||''}</td>`;
    admT.appendChild(tr);
  });

  // Fee page
  const feeT = document.querySelector('#feeTable tbody');
  feeT.innerHTML = '';
  feeData.forEach(r => {
    const roll = r['Roll']||r['roll']||'';
    const name = r['Name']||r['name']||'';
    const amount = r['Amount']||r['amount']||r['FeeAmount']||'';
    const feeType = r['FeeType']||r['feeType']||r['Fee Type']||r['fee type']||'';
    const paymentMode = r['PaymentMode']||r['paymentMode']||r['Payment Mode']||r['mode']||'';
    const ts = r['Timestamp']||r['timestamp']||r['Time']||'';
    const tr = document.createElement('tr');
    const receiptBtn = `<button data-roll="${roll}" class="downloadReceiptBtn">Download</button>`;
    tr.innerHTML = `<td>${ts}</td><td>${roll}</td><td>${name}</td><td>${feeType}</td><td>${amount}</td><td>${paymentMode}</td><td>${receiptBtn}</td>`;
    feeT.appendChild(tr);
  });

  // hostel page
  const hostT = document.querySelector('#hostelTable tbody');
  hostT.innerHTML = '';
  hostelData.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r['Timestamp']||r['timestamp']||''}</td><td>${r['Roll']||r['roll']||''}</td><td>${r['Name']||r['name']||''}</td><td>${r['Preference']||r['preference']||''}</td><td>${r['AllocatedRoom']||r['Room']||''}</td>`;
    hostT.appendChild(tr);
  });

  // library page
  const libT = document.querySelector('#libraryTable tbody');
  libT.innerHTML = '';
  libraryData.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r['Timestamp']||r['timestamp']||''}</td><td>${r['Roll']||r['roll']||''}</td><td>${r['Name']||r['name']||''}</td><td>${r['BookName']||r['bookName']||r['Book']||''}</td><td>${r['Status']||r['status']||''}</td>`;
    libT.appendChild(tr);
  });

  // Attach listener to download buttons
  document.querySelectorAll('.downloadReceiptBtn').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      const roll = ev.currentTarget.dataset.roll;
      await downloadReceipt(roll);
    });
  });
}

// ---------- CHARTS ----------
function renderCharts() {
  // fees timeline - derive months & sums from feeData
  const monthsMap = {};
  feeData.forEach(r => {
    const ts = r['Timestamp']||r['timestamp']||'';
    const date = new Date(ts);
    const m = isNaN(date.getTime()) ? (r['Month']||'') : date.toLocaleString('default',{month:'short'});
    const amt = Number(String(r['Amount']||r['amount']||0).replace(/[^\d.-]/g,'')) || 0;
    monthsMap[m] = (monthsMap[m]||0) + amt;
  });
  const labels = Object.keys(monthsMap).length ? Object.keys(monthsMap) : ['Jan','Feb','Mar','Apr'];
  const data = labels.map(l => monthsMap[l]|| (Math.random()*100000 + 80000));

  // destroy existing charts if present
  if (feeChart) feeChart.destroy();
  if (hostelChart) hostelChart.destroy();

  const ctx1 = document.getElementById('feeChart').getContext('2d');
  feeChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: 'Fees', data, borderColor: '#4f46e5', backgroundColor:'rgba(79,70,229,0.12)', fill:true }]
    },
    options: { responsive:true, plugins: { legend:{display:false} } }
  });

  const ctx2 = document.getElementById('hostelChart').getContext('2d');
  const occupied = hostelData.length || 60;
  const available = Math.max(0, 100 - occupied);
  hostelChart = new Chart(ctx2, {
    type: 'doughnut',
    data: { labels:['Occupied','Available'], datasets:[{ data:[occupied,available], backgroundColor:['#4f46e5','#e5e7eb'] }] },
    options: { cutout:'70%', plugins:{ legend:{position:'bottom'} } }
  });
}

// ---------- DOWNLOAD RECEIPT ----------
async function downloadReceipt(roll) {
  if (!roll) { alert('Roll missing'); return; }
  try {
    const res = await apiGet({ action:'getReceipt', roll });
    if (!res.ok) { alert('Receipt not found for ' + roll); return; }
    const url = res.url;
    // open in new tab
    window.open(url, '_blank');
  } catch (err) {
    console.error(err);
    alert('Failed to fetch receipt link');
  }
}

// ---------- UI interactivity ----------
menuEls.forEach(li => {
  li.addEventListener('click', () => {
    menuEls.forEach(x=>x.classList.remove('active'));
    li.classList.add('active');
    const view = li.dataset.view;
    Object.keys(views).forEach(k => views[k].style.display = (k===view ? 'block' : 'none'));
    pageTitle.textContent = li.textContent.trim();
  });
});

document.getElementById('refreshBtn').addEventListener('click', loadAll);

// Search simple filter (applies to admissions view)
document.getElementById('globalSearch').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) {
    renderTables(); return;
  }
  // filter admissions table
  const filtered = admissionsData.filter(r => Object.values(r).join(' ').toLowerCase().includes(q));
  const admT = document.querySelector('#admissionsTable tbody');
  admT.innerHTML = '';
  filtered.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r['Roll']||r['roll']||''}</td><td>${r['Name']||r['name']||''}</td><td>${r['Course']||r['course']||''}</td><td>${r['Email']||r['email']||''}</td>`;
    admT.appendChild(tr);
  });
});

// initial load
loadAll();
