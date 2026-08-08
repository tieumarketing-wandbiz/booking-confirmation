const form = document.querySelector('#form');
const inputs = document.querySelector('#inputs');
const rows = document.querySelector('#rows');
const page = document.querySelector('#page');
const previewSurface = document.querySelector('.preview');
const language = document.querySelector('#lang');
const addRoom = document.querySelector('#add');
const pngButton = document.querySelector('#png');
const pdfButton = document.querySelector('#pdf');

const fields = {
  greetingGuest: document.querySelector('#greetingGuest'),
  guest: document.querySelector('#guest'),
  nights: document.querySelector('#nights'),
  checkin: document.querySelector('#checkin'),
  checkout: document.querySelector('#checkout'),
  inTime: document.querySelector('#inTime'),
  outTime: document.querySelector('#outTime'),
  total: document.querySelector('#total'),
  deposit: document.querySelector('#deposit'),
  services: document.querySelector('#services'),
  policy: document.querySelector('#policy')
};

let rooms = [{
  list: 'Mar Jo Rie\nAshley Olalia',
  type: 'Deluxe balcony mountain view',
  pack: '—',
  count: 2,
  rate: 2000000,
  bed: '—'
}];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Number(value) || 0);
}

function getNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  return Math.max(0, Math.round((end - start) / 86400000));
}

function renderRoomEditors() {
  inputs.innerHTML = rooms.map((room, index) => `
    <div class="room">
      <button class="delete-room" type="button" data-remove-room="${index}">× Xoá phòng</button>
      <b>Phòng ${index + 1}</b>
      <textarea data-room="${index}" data-key="list">${escapeHtml(room.list)}</textarea>
      <input data-room="${index}" data-key="type" value="${escapeHtml(room.type)}">
      <div class="two">
        <input data-room="${index}" data-key="count" type="number" value="${escapeHtml(room.count)}">
        <input data-room="${index}" data-key="rate" type="number" value="${escapeHtml(room.rate)}">
      </div>
    </div>`).join('');

  inputs.querySelectorAll('[data-room][data-key]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const target = event.currentTarget;
      rooms[Number(target.dataset.room)][target.dataset.key] = target.value;
      updatePreview();
    });
  });

  inputs.querySelectorAll('[data-remove-room]').forEach((button) => {
    button.addEventListener('click', () => {
      if (rooms.length === 1) return;
      rooms.splice(Number(button.dataset.removeRoom), 1);
      renderRoomEditors();
      updatePreview();
    });
  });
}

function renderServices(value) {
  fields.services.innerHTML = String(value || '')
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => `<span>• ${escapeHtml(line)}</span>`)
    .join('');
}

function updatePreview() {
  const values = Object.fromEntries(new FormData(form));
  const nights = getNights(values.in, values.out);
  const total = rooms.reduce((sum, room) => sum + (Number(room.rate) || 0), 0);

  fields.greetingGuest.textContent = values.guest || '';
  fields.guest.textContent = values.guest || '';
  fields.nights.textContent = String(nights);
  fields.checkin.textContent = values.in || '';
  fields.checkout.textContent = values.out || '';
  fields.inTime.textContent = values.inTime || '';
  fields.outTime.textContent = values.outTime || '';
  fields.total.textContent = `${formatNumber(total)} VND`;
  fields.deposit.textContent = `${formatNumber(values.deposit)} VND`;
  fields.policy.textContent = values.policy || '';
  renderServices(values.services);

  rows.innerHTML = rooms.map((room, index) => `
    <div class="room-row">
      <span>${index + 1}</span>
      <span>1</span>
      <span class="room-guests">${escapeHtml(room.list || '')}</span>
      <span class="room-type">${escapeHtml(room.type || '')}</span>
      <span>${escapeHtml(room.pack || '—')}</span>
      <span>${escapeHtml(room.count || 0)}</span>
      <span>${formatNumber(room.rate)}</span>
      <span>${escapeHtml(room.bed || '—')}</span>
    </div>`).join('');
}

addRoom.addEventListener('click', () => {
  rooms.push({ list: '', type: '', pack: '—', count: 1, rate: 0, bed: '—' });
  renderRoomEditors();
  updatePreview();
});

form.addEventListener('input', updatePreview);
form.addEventListener('change', updatePreview);
language.addEventListener('change', updatePreview);

function exportFileBase() {
  const values = new FormData(form);
  const guest = (values.get('guest') || 'khach-hang')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-');
  return `${guest}_${values.get('in') || 'ngay-nhan'}`;
}

async function capturePage() {
  if (!window.html2canvas) throw new Error('html2canvas is not loaded');
  const previousTransform = page.style.transform;
  const previousMarginBottom = page.style.marginBottom;
  page.style.transform = '';
  page.style.marginBottom = '';
  try {
    return await window.html2canvas(page, { scale: 2, useCORS: true, backgroundColor: null });
  } finally {
    page.style.transform = previousTransform;
    page.style.marginBottom = previousMarginBottom;
  }
}

pngButton.addEventListener('click', async () => {
  const canvas = await capturePage();
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `${exportFileBase()}.png`;
  link.click();
});

pdfButton.addEventListener('click', async () => {
  const canvas = await capturePage();
  const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
  pdf.save(`${exportFileBase()}.pdf`);
});

const previewButton = document.createElement('button');
previewButton.type = 'button';
previewButton.className = 'mobile-preview-button';
previewButton.textContent = '▣ Xem preview toàn màn';
document.querySelector('.actions').before(previewButton);

const closePreviewButton = document.createElement('button');
closePreviewButton.type = 'button';
closePreviewButton.className = 'close-preview-button';
closePreviewButton.textContent = '× Đóng';
previewSurface.prepend(closePreviewButton);

previewButton.addEventListener('click', () => {
  document.body.classList.add('preview-mode');
  resetPreviewScale();
  window.scrollTo(0, 0);
});

closePreviewButton.addEventListener('click', () => {
  document.body.classList.remove('preview-mode');
  resetPreviewScale();
});

let previewScale = 1;
let fitScale = 1;

function isSmallViewport() {
  return window.matchMedia('(max-width: 1024px)').matches;
}

function renderPreviewScale() {
  page.style.transform = isSmallViewport() ? `scale(${previewScale})` : '';
  page.style.marginBottom = isSmallViewport()
    ? `${page.offsetHeight * (previewScale - 1)}px`
    : '';
}

function resetPreviewScale() {
  if (!isSmallViewport()) {
    previewScale = 1;
    page.style.transform = '';
    page.style.marginBottom = '';
    return;
  }
  fitScale = Math.min(1, (window.innerWidth - 16) / 760);
  previewScale = fitScale;
  renderPreviewScale();
}

const pointers = new Map();
let pinchStart = null;

function pointerDistance() {
  const points = [...pointers.values()];
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
}

previewSurface.addEventListener('pointerdown', (event) => {
  if (!isSmallViewport()) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  previewSurface.setPointerCapture(event.pointerId);
  if (pointers.size === 2) pinchStart = { distance: pointerDistance(), scale: previewScale };
});

previewSurface.addEventListener('pointermove', (event) => {
  if (!pointers.has(event.pointerId) || !isSmallViewport()) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2 && pinchStart) {
    previewScale = Math.max(fitScale, Math.min(2.5, pinchStart.scale * pointerDistance() / pinchStart.distance));
    renderPreviewScale();
  }
});

['pointerup', 'pointercancel'].forEach((eventName) => {
  previewSurface.addEventListener(eventName, (event) => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = null;
  });
});

window.addEventListener('resize', resetPreviewScale);

const printButton = document.createElement('button');
printButton.type = 'button';
printButton.id = 'print';
printButton.textContent = 'In';
document.querySelector('.actions').append(printButton);
printButton.addEventListener('click', () => window.print());

renderRoomEditors();
updatePreview();
resetPreviewScale();
