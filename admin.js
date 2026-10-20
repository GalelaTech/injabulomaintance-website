(function () {
    'use strict';

    // ── Configuration ──────────────────────────────────────────
    const API_BASE = 'https://galela-solution-backend.onrender.com/api/dashboard';
    const SITE     = 'injabulo';

    // ── Authentication ─────────────────────────────────────────
    let TOKEN = localStorage.getItem('gs_injabulo_token');

    async function login() {
        let password = prompt("🔒 Enter Injabulo Admin Password:");
        if (!password) return false;

        try {
            const res = await fetch(`${API_BASE}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: password })
            });

            if (res.ok) {
                const data = await res.json();
                TOKEN = data.token;
                localStorage.setItem('gs_injabulo_token', TOKEN);
                return true;
            } else {
                alert("Invalid password.");
                return false;
            }
        } catch (err) {
            alert("Login failed. Please check your connection.");
            return false;
        }
    }

    // Helper to attach the Bearer token to every request
    async function apiFetch(url, options = {}) {
        if (!options.headers) options.headers = {};
        options.headers['Authorization'] = `Bearer ${TOKEN}`;
        return fetch(url, options);
    }

    // ── Helpers ────────────────────────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    
    const fmtDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleString('en-ZA', {
            year: 'numeric', month: 'short', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const escapeHtml = (str) => {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    // ── Fetch Data ─────────────────────────────────────────────
    const fetchVisits = async () => {
        const url = `${API_BASE}/visits/?site=${SITE}`;
        const res = await apiFetch(url);
        
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('gs_injabulo_token');
            window.location.reload();
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    };

    // ── Render Visits ──────────────────────────────────────────
    const renderVisits = (results) => {
        const list = $('#visits-list');
        list.innerHTML = results.length ? '' : '<p class="muted">No visits recorded for Injabulo yet.</p>';

        results.forEach(v => {
            const node = document.createElement('details');
            node.className = 'announcement-item'; 
            node.style.display = 'block';
            node.style.cursor = 'pointer';
            
            const summary = `
                <summary style="list-style: none; display: flex; justify-content: space-between; align-items: center;">
                    <span><strong>#${v.id}</strong> · ${escapeHtml(v.path)}</span>
                    <span class="muted" style="font-size: 0.8rem;">${fmtDate(v.created_at)}</span>
                </summary>
            `;

            const detail = `
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #d9e0d4; font-size: 0.85rem;">
                    <p><strong>IP:</strong> ${v.ip}</p>
                    <p><strong>Country:</strong> ${v.country || 'Unknown'}</p>
                    <p><strong>Browser:</strong> ${v.user_agent ? v.user_agent.substring(0, 50) + '...' : 'Unknown'}</p>
                    <button class="icon-btn" data-delete-visit="${v.id}" style="margin-top: 10px; color: #b71c1c;">
                        <i class="fas fa-trash-alt"></i> Delete Log
                    </button>
                </div>
            `;
            
            node.innerHTML = summary + detail;
            list.appendChild(node);
        });
    };

    // ── Load Data ──────────────────────────────────────────────
    const load = async () => {
        const listEl = document.getElementById('visits-list');
        if(listEl) listEl.innerHTML = '<p class="muted">Loading...</p>';

        try {
            const data = await fetchVisits();
            
            // Update the stat card at the top
            document.getElementById('totalVisits').innerText = data.count;
            
            // Render the list
            renderVisits(data.results);
        } catch (err) {
            if(listEl) listEl.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
        }
    };

    // ── Event Listeners (Delete) ───────────────────────────────
    document.addEventListener('click', async (e) => {
        const visitBtn = e.target.closest('[data-delete-visit]');

        if (visitBtn) {
            e.preventDefault();
            if(!confirm('Delete this visit record?')) return;
            
            const id = visitBtn.dataset.deleteVisit;
            
            const res = await apiFetch(`${API_BASE}/visits/${id}/`, { method: 'DELETE' });
            
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('gs_injabulo_token');
                window.location.reload();
                return;
            }
            
            load(); 
        }
    });

    // ── Init ───────────────────────────────────────────────────
    async function init() {
        if (!TOKEN) {
            const success = await login();
            if (!success) {
                document.body.innerHTML = "<h2 style='text-align:center; margin-top:50px;'>Access Denied.</h2>";
                return;
            }
        }
        load();
    }

    init();

})();