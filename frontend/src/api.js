
// const API = window.__API__ || 'https://online-csc-service-bookings.onrender.com/api';
const API = import.meta.env.VITE_API_URL;

// Existing functions
export async function getServices() {
  const r = await fetch(`${API}/services`);
  return r.json();
}

export async function createRequest(formData) {
  const r = await fetch(`${API}/requests`, { method: 'POST', body: formData });
  return r.json();
}

export async function trackRequest(requestId, phone) {
  const r = await fetch(`${API}/requests/track?requestId=${encodeURIComponent(requestId)}&phone=${encodeURIComponent(phone)}`);
  return r.json();
}

export async function adminLogin(email, password) {
  const r = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return r.json();
}

// --- Admin Requests ---
export async function adminListRequests(token) {
  const r = await fetch(`${API}/admin/requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return r.json();
}

export async function adminUpdateStatus(token, id, status) {
  const r = await fetch(`${API}/admin/requests/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  return r.json();
}

// --- Admin Services ---
export async function adminListServices(token) {
  const r = await fetch(`${API}/admin/services`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return r.json();
}

export async function adminCreateService(token, data) {
  const r = await fetch(`${API}/admin/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return r.json();
}

export async function adminDeleteService(token, id) {
  const r = await fetch(`${API}/admin/services/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return r.json();
}
