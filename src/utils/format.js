export const uid = (p = 'ID') => p + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();

export const fmtINR = (n) => {
  if (n == null) return '—';
  const s = Math.round(n).toString();
  if (s.length <= 3) return '₹' + s;
  const last3 = s.slice(-3), rest = s.slice(0, -3);
  return '₹' + rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
};

export const fmtLakh = (n) => '₹' + (n / 100000).toFixed(n % 100000 === 0 ? 0 : 1) + 'L';

export const fmtDate = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const fmtDateTime = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ', ' +
         dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const timeAgo = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
};

export const initials = (name) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));