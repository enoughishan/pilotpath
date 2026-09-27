export function downloadContract({ contract, challenge, startup }) {
  const win = window.open('', '_blank', 'width=900,height=1000');
  if (!win) {
    alert('Please allow popups to download contracts.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${contract.id} — Pilot Agreement</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0B1F3A;
          font-size: 12.5px;
          line-height: 1.55;
          max-width: 780px;
          margin: 32px auto;
          padding: 0 40px;
        }
        .letterhead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px double #0B1F3A;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .emblem {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #0B1F3A;
          display: grid;
          place-items: center;
          color: #fff;
          font-weight: 800;
          font-size: 22px;
        }
        .letterhead-text { text-align: center; flex: 1; }
        .letterhead-text b { display: block; font-size: 16px; font-weight: 800; letter-spacing: 0.02em; }
        .letterhead-text span { display: block; font-size: 12px; color: #475569; margin-top: 2px; }
        .letterhead-text small { display: block; font-size: 10.5px; color: #94A3B8; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.1em; }

        h1 { font-size: 20px; font-weight: 800; margin: 0 0 4px; letter-spacing: -0.02em; }
        .subtitle { color: #64748B; font-size: 12px; margin-bottom: 24px; }

        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 24px;
          padding: 16px;
          background: #F1F5F9;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .meta-item { display: flex; justify-content: space-between; font-size: 12px; }
        .meta-item b { color: #0B1F3A; }
        .meta-item span { color: #475569; }

        .section { margin-bottom: 22px; page-break-inside: avoid; }
        .section h2 {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #1B4D89;
          border-bottom: 1px solid #CBD5E1;
          padding-bottom: 6px;
          margin: 0 0 10px;
        }
        .section p { margin: 0 0 8px; text-align: justify; }

        .signature {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px dashed #CBD5E1;
        }
        .signature-block { text-align: center; }
        .signature-line {
          border-top: 1px solid #0B1F3A;
          margin-top: 60px;
          padding-top: 8px;
          font-size: 11px;
        }
        .signature-block b { display: block; font-size: 12px; margin-bottom: 2px; }
        .signature-block span { font-size: 10.5px; color: #64748B; }

        .footer {
          margin-top: 40px;
          padding-top: 16px;
          border-top: 1px solid #CBD5E1;
          font-size: 10px;
          color: #94A3B8;
          text-align: center;
          line-height: 1.6;
        }

        @media print {
          body { margin: 0; padding: 0 40px; }
          .no-print { display: none !important; }
        }

        .print-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #0B1F3A;
          color: #fff;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
          font-size: 12px;
        }
        .print-bar button {
          background: #fff;
          color: #0B1F3A;
          border: none;
          padding: 8px 18px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }
        @media print { .print-bar { display: none !important; } }
      </style>
    </head>
    <body>
      <div class="print-bar no-print">
        <span>Contract ${contract.id} — Preview</span>
        <button onclick="window.print()">Save as PDF / Print</button>
      </div>

      <div style="height:40px"></div>

      <div class="letterhead">
        <div class="emblem">उ</div>
        <div class="letterhead-text">
          <b>GOVERNMENT OF MAHARASHTRA</b>
          <span>महाराष्ट्र शासन · Innovation Procurement Portal (उद्भव)</span>
          <small>Pilot Agreement</small>
        </div>
        <div style="width:60px"></div>
      </div>

      <h1>${contract.id} — Pilot Agreement</h1>
      <div class="subtitle">
        ${challenge?.title || 'Innovation Pilot'} · ${challenge?.district || ''}, Maharashtra
      </div>

      <div class="meta-grid">
        <div class="meta-item"><span>Contract ID</span><b>${contract.id}</b></div>
        <div class="meta-item"><span>Challenge</span><b>${challenge?.id || '—'}</b></div>
        <div class="meta-item"><span>Vendor</span><b>${startup?.name || '—'}</b></div>
        <div class="meta-item"><span>Department</span><b>${challenge?.dept || '—'}</b></div>
        <div class="meta-item"><span>Contract value</span><b>₹${(contract.value || 0).toLocaleString('en-IN')}</b></div>
        <div class="meta-item"><span>Start date</span><b>${formatDate(contract.start)}</b></div>
        <div class="meta-item"><span>End date</span><b>${formatDate(contract.end)}</b></div>
        <div class="meta-item"><span>Signed on</span><b>${formatDate(contract.signedAt)}</b></div>
        <div class="meta-item"><span>Status</span><b>${contract.status}</b></div>
      </div>

      <div class="section">
        <h2>1. Parties</h2>
        <p>
          This Pilot Agreement ("Agreement") is entered into between the <b>Government of Maharashtra</b>,
          represented by the ${challenge?.dept || 'concerned Department'} ("Department"), and
          <b>${startup?.name || 'the Vendor'}</b> ("Vendor"), for the purpose of executing a controlled
          innovation pilot under the उद्भव (Udbhav) programme.
        </p>
      </div>

      <div class="section">
        <h2>2. Scope</h2>
        <p>${challenge?.outcome || 'The Vendor shall implement the proposed solution within the agreed geography and duration, in accordance with the milestones set out in Schedule A.'}</p>
      </div>

      <div class="section">
        <h2>3. Intellectual Property</h2>
        <p>${contract.ipClause}</p>
      </div>

      <div class="section">
        <h2>4. Data Ownership &amp; Sharing</h2>
        <p>${contract.dataClause}</p>
      </div>

      <div class="section">
        <h2>5. Security &amp; Compliance</h2>
        <p>${contract.securityClause}</p>
      </div>

      <div class="section">
        <h2>6. Payment Terms</h2>
        <p>
          Payments shall be released against the achievement of pre-defined milestones, subject to
          verification of evidence and independent validation. No payment shall be released in the
          absence of required evidence.
        </p>
      </div>

      <div class="section">
        <h2>7. Termination</h2>
        <p>${contract.termination}</p>
      </div>

      <div class="signature">
        <div class="signature-block">
          <b>For Government of Maharashtra</b>
          <span>${challenge?.dept || 'Concerned Department'}</span>
          <div class="signature-line">Authorised Signatory</div>
        </div>
        <div class="signature-block">
          <b>For ${startup?.name || 'Vendor'}</b>
          <span>${startup?.district || ''}, Maharashtra</span>
          <div class="signature-line">Authorised Signatory</div>
        </div>
      </div>

      <div class="footer">
        This is a computer-generated document. Digitally signed copies are retained in the उद्भव platform.<br />
        Document generated on ${new Date().toLocaleString('en-IN')} · Page 1 of 1
      </div>
    </body>
    </html>
  `;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}