const form = document.querySelector('#form');
const roomInputs = document.querySelector('#inputs');
const roomRows = document.querySelector('#rows');
const page = document.querySelector('#page');
const preview = document.querySelector('.preview');

let rooms = [{
  list: 'Mar Jo Rie\nAshley Olalia',
  type: 'Deluxe balcony mountain view',
  pack: '—',
  count: 2,
  rate: 2000000,
  bed: '—'
}];

const iconPaths = {
  user: '<circle cx="12" cy="8" r="3.5"></circle><path d="M4.5 20c.9-3.6 3.5-5.5 7.5-5.5s6.6 1.9 7.5 5.5"></path>',
  moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"></path>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"></rect><path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17"></path>',
  clock: '<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7v5l3.5 2"></path>',
  building: '<path d="M4.5 20.5h15M6.5 20.5V5.5h11v15M9 8.5h1M14 8.5h1M9 12h1M14 12h1M10.5 20.5v-4h3v4"></path>',
  wallet: '<path d="M4.5 7.5h14a1.5 1.5 0 0 1 1.5 1.5v9a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h11"></path><path d="M4 8.5h15.5v5H16a2 2 0 0 1 0-4h3.5"></path><circle cx="16" cy="11.5" r=".5" fill="currentColor" stroke="none"></circle>',
  clipboard: '<rect x="5.5" y="4.5" width="13" height="16" rx="2"></rect><path d="M9 4.5v-1h6v1M9 9h6M9 13h6M9 17h4"></path>',
  bell: '<path d="M18 10a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.5h17C20.5 17 18 17 18 10ZM10 21h4"></path>',
  shield: '<path d="M12 3.5 19 6v5.3c0 4.4-2.9 7.5-7 9.2-4.1-1.7-7-4.8-7-9.2V6l7-2.5Z"></path><path d="m9 12 2 2 4-4"></path>'
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function icon(name, className = '') {
  return `<svg class="${escapeHtml(className)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || ''}</svg>`;
}

function formatNumber(value) {
  const number = Number(value);
  return new Intl.NumberFormat('en-US').format(Number.isFinite(number) ? number : 0);
}

function formatDate(value) {
  if (!value) return '';

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function setText(id, value) {
  document.querySelector(`#${id}`).textContent = value;
}

function valuesFromForm() {
  return Object.fromEntries(new FormData(form));
}

function getNightCount(checkIn, checkOut) {
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);

  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(0, Math.round((end - start) / 86400000));
}

function roomRate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function renderIcons() {
  const icons = {
    bookingIcon: 'calendar',
    guestIcon: 'user',
    moonIcon: 'moon',
    checkinIcon: 'calendar',
    checkoutIcon: 'calendar',
    inTimeIcon: 'clock',
    outTimeIcon: 'clock',
    buildingIcon: 'building',
    totalIcon: 'wallet',
    walletIcon: 'wallet',
    clipboardIcon: 'clipboard',
    servicesIcon: 'bell',
    policyIcon: 'shield'
  };

  Object.entries(icons).forEach(([id, name]) => {
    document.querySelector(`#${id}`).innerHTML = icon(name, 'sheet-icon');
  });
}

function renderRoomEditors() {
  roomInputs.innerHTML = rooms.map((room, index) => `
    <div class="room">
      <button class="delete-room" type="button" data-remove-room="${index}" aria-label="Remove room ${index + 1}">× Remove</button>
      <b>Room ${index + 1}</b>
      <textarea data-room-index="${index}" data-room-key="list" aria-label="Guest list">${escapeHtml(room.list)}</textarea>
      <input data-room-index="${index}" data-room-key="type" value="${escapeHtml(room.type)}" aria-label="Room type">
      <div class="two">
        <input data-room-index="${index}" data-room-key="count" type="number" min="1" value="${escapeHtml(room.count)}" aria-label="Number of adults">
        <input data-room-index="${index}" data-room-key="rate" type="number" min="0" value="${escapeHtml(room.rate)}" aria-label="Room rate">
      </div>
    </div>
  `).join('');

  roomInputs.querySelectorAll('[data-room-key]').forEach(input => {
    input.addEventListener('input', event => {
      const { roomIndex, roomKey } = event.currentTarget.dataset;
      rooms[roomIndex][roomKey] = event.currentTarget.value;
      updatePreview();
    });
  });

  roomInputs.querySelectorAll('[data-remove-room]').forEach(button => {
    button.addEventListener('click', event => {
      if (rooms.length === 1) return;
      rooms.splice(Number(event.currentTarget.dataset.removeRoom), 1);
      renderRoomEditors();
      updatePreview();
    });
  });
}

function updatePreview() {
  const values = valuesFromForm();
  const nights = getNightCount(values.in, values.out);

  setText('introGuest', values.guest);
  setText('guest', values.guest);
  setText('nights', nights);
  setText('checkin', formatDate(values.in));
  setText('checkout', formatDate(values.out));
  setText('inTime', values.inTime);
  setText('outTime', values.outTime);

  roomRows.innerHTML = rooms.map((room, index) => {
    const adults = `${room.count || 0} adults`;
    return `<tr>
      <td><span class="text-clamp">${String(index + 1).padStart(2, '0')}</span></td>
      <td><span class="text-clamp">1</span></td>
      <td><span class="text-clamp">${escapeHtml(room.list)}</span></td>
      <td><span class="text-clamp">${escapeHtml(room.type)}</span></td>
      <td><span class="text-clamp">${escapeHtml(room.pack)}</span></td>
      <td><span class="text-clamp">${escapeHtml(adults)}</span></td>
      <td><span class="text-clamp">${escapeHtml(formatNumber(roomRate(room.rate)))}</span></td>
      <td><span class="text-clamp">${escapeHtml(room.bed || '—')}</span></td>
    </tr>`;
  }).join('');

  setText('total', formatNumber(rooms.reduce((sum, room) => sum + roomRate(room.rate), 0)));
  setText('deposit', formatNumber(values.deposit));
  document.querySelector('#services').innerHTML = (values.services || '')
    .split(/\r?\n/)
    .filter(line => line.trim())
    .map(line => `<span>• ${escapeHtml(line)}</span>`)
    .join('');
  document.querySelector('#policy').innerHTML = escapeHtml(values.policy);
}

async function capturePage() {
  requireExportDependencies();
  const originalTransform = page.style.transform;
  const originalMarginBottom = page.style.marginBottom;

  page.style.transform = 'none';
  page.style.marginBottom = '0';

  try {
    return await window.html2canvas(page, { scale: 2, useCORS: true });
  } finally {
    page.style.transform = originalTransform;
    page.style.marginBottom = originalMarginBottom;
  }
}

function requireExportDependencies(needsPdf = false) {
  if (typeof window.html2canvas !== 'function') {
    throw new Error('html2canvas is unavailable. Check your internet connection and try again.');
  }

  if (needsPdf && typeof window.jspdf?.jsPDF !== 'function') {
    throw new Error('jsPDF is unavailable. Check your internet connection and try again.');
  }
}

function showExportError(error) {
  const status = document.querySelector('#exportStatus');
  status.textContent = `Export failed: ${error instanceof Error ? error.message : 'Please try again.'}`;
}

function clearPagePresentationStyles() {
  page.style.removeProperty('transform');
  page.style.removeProperty('margin-bottom');
}

function exportFileBase() {
  const values = valuesFromForm();
  const guest = (values.guest || 'guest')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-');
  return `${guest || 'guest'}_${values.in || 'check-in'}`;
}

function downloadCanvas(canvas, extension) {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `${exportFileBase()}.${extension}`;
  link.click();
}

document.querySelector('#add').addEventListener('click', () => {
  rooms.push({ list: '', type: '', pack: '—', count: 1, rate: 0, bed: '—' });
  renderRoomEditors();
  updatePreview();
});

form.addEventListener('input', updatePreview);
form.addEventListener('change', updatePreview);

document.querySelector('#png').addEventListener('click', async () => {
  try {
    downloadCanvas(await capturePage(), 'png');
  } catch (error) {
    showExportError(error);
  }
});

document.querySelector('#pdf').addEventListener('click', async () => {
  try {
    requireExportDependencies(true);
    const canvas = await capturePage();
    const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
    pdf.save(`${exportFileBase()}.pdf`);
  } catch (error) {
    showExportError(error);
  }
});

renderIcons();
renderRoomEditors();
updatePreview();

const activePointers = new Map();
let fitScale = 1;
let zoomScale = 1;
let panX = 0;
let panY = 0;
let dragStart;
let pinchStart;

function isMobilePreview() {
  return window.matchMedia('(max-width: 1024px)').matches;
}

function renderGesture() {
  page.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
  page.style.marginBottom = `${1074 * (zoomScale - 1)}px`;
}

function resetGesture() {
  if (!isMobilePreview()) {
    page.style.transform = '';
    page.style.marginBottom = '';
    return;
  }

  const previewStyle = window.getComputedStyle(preview);
  const availableWidth = preview.clientWidth
    - Number.parseFloat(previewStyle.paddingLeft)
    - Number.parseFloat(previewStyle.paddingRight);
  fitScale = Math.min(1, Math.max(0.1, availableWidth / 760));
  zoomScale = fitScale;
  panX = 0;
  panY = 0;
  renderGesture();
}

function pointerDistance() {
  const [first, second] = activePointers.values();
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function pointerMidpoint() {
  const [first, second] = activePointers.values();
  return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
}

function startPinch() {
  if (activePointers.size !== 2) return;
  pinchStart = {
    distance: pointerDistance(),
    scale: zoomScale,
    panX,
    panY,
    midpoint: pointerMidpoint()
  };
}

preview.addEventListener('pointerdown', event => {
  if (!isMobilePreview()) return;

  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  preview.setPointerCapture(event.pointerId);

  if (activePointers.size === 1) {
    dragStart = { x: event.clientX - panX, y: event.clientY - panY };
  } else if (activePointers.size === 2) {
    startPinch();
  }
});

preview.addEventListener('pointermove', event => {
  if (!activePointers.has(event.pointerId) || !isMobilePreview()) return;

  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (activePointers.size === 1 && dragStart) {
    panX = event.clientX - dragStart.x;
    panY = event.clientY - dragStart.y;
  } else if (activePointers.size === 2 && pinchStart) {
    const nextScale = Math.max(fitScale, Math.min(2.5, pinchStart.scale * pointerDistance() / pinchStart.distance));
    const midpoint = pointerMidpoint();
    const localX = (pinchStart.midpoint.x - pinchStart.panX) / pinchStart.scale;
    const localY = (pinchStart.midpoint.y - pinchStart.panY) / pinchStart.scale;

    zoomScale = nextScale;
    panX = midpoint.x - localX * nextScale;
    panY = midpoint.y - localY * nextScale;
  }

  renderGesture();
});

['pointerup', 'pointercancel'].forEach(type => {
  preview.addEventListener(type, event => {
    activePointers.delete(event.pointerId);
    dragStart = undefined;
    pinchStart = undefined;

    if (activePointers.size === 1) {
      const [pointer] = activePointers.values();
      dragStart = { x: pointer.x - panX, y: pointer.y - panY };
    } else if (activePointers.size === 2) {
      startPinch();
    }
  });
});

window.addEventListener('resize', resetGesture);
window.addEventListener('beforeprint', clearPagePresentationStyles);
resetGesture();
