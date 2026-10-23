import React from 'react';
import { X, Printer, Download, ShieldCheck, ShieldAlert, Award } from 'lucide-react';

export default function ReportModal({
  isOpen,
  onClose,
  contractTitle,
  vendor,
  analytics,
  clauses
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const reportData = {
      contractTitle,
      vendor,
      generatedAt: new Date().toISOString(),
      analytics,
      clauses: clauses.map((c) => ({
        number: c.number,
        title: c.title,
        severity: c.severity,
        multiLabels: c.multiLabels,
        explainableSpans: c.explainableSpans,
        originalText: c.originalText,
        redlineText: c.suggestedRedline,
        reviewStatus: c.reviewStatus
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-risk-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 840, maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award size={20} style={{ color: 'var(--accent-indigo)' }} />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                Executive Contract Risk Audit Certificate
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Certified Legal-AI Risk Assessment & Mitigation Roadmap
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadJson}>
              <Download size={14} /> JSON
            </button>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.3rem'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ background: '#F8FAFC' }}>
          <div className="printable-report-container">
            {/* Certificate Header Banner */}
            <div className="report-header-banner">
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)' }}>
                  Clause Guard &bull; LexiRisk Sentinel &trade;
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
                  Domain-Adapted Legal Transformer Risk Audit Certificate (CUAD Dataset Trained)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                  Date: {new Date().toLocaleDateString()} &bull; Classification Engine: LegalBERT-CUAD v3.4 (510 Contracts, 13k Annotations)
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
                  Contract Risk Rating
                </div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color:
                      analytics.grade === 'F'
                        ? '#EF4444'
                        : analytics.grade === 'D'
                        ? '#F97316'
                        : '#10B981'
                  }}
                >
                  Grade {analytics.grade} ({analytics.overallScore}/100)
                </div>
              </div>
            </div>

            {/* Contract Subject Info */}
            <div
              style={{
                background: '#F1F5F9',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: '1rem',
                fontSize: '0.82rem'
              }}
            >
              <div>
                <div style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 600 }}>DOCUMENT TITLE</div>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{contractTitle}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 600 }}>COUNTERPARTY / VENDOR</div>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>{vendor}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 600 }}>TOTAL CLAUSES</div>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>
                  {analytics.totalClauses} analyzed ({analytics.criticalCount} Critical)
                </div>
              </div>
            </div>

            {/* Risk Summary Statement */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                Executive Assessment Summary
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                Automated multi-label clause classification identified{' '}
                <b>{analytics.criticalCount} critical risk clauses</b> and{' '}
                <b>{analytics.highCount} high risk clauses</b> with significant financial, IP, or compliance exposure.
                A total of <b>{analytics.mitigatedCount} clauses</b> have been counter-drafted with recommended redlines.
              </p>
            </div>

            {/* Clause Findings Inventory Table */}
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.6rem' }}>
              Clause Risk Inventory & Redline Roadmap
            </h4>

            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ width: '12%' }}>Clause</th>
                  <th style={{ width: '22%' }}>Detected Categories</th>
                  <th style={{ width: '14%' }}>Severity</th>
                  <th style={{ width: '52%' }}>Recommended Redline / Action</th>
                </tr>
              </thead>
              <tbody>
                {clauses.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>
                      #{c.number} {c.title}
                    </td>
                    <td>
                      {c.multiLabels?.map((l) => l.shortLabel).join(', ') || 'Standard'}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          color:
                            c.severity === 'CRITICAL'
                              ? '#EF4444'
                              : c.severity === 'HIGH'
                              ? '#EA580C'
                              : c.severity === 'MEDIUM'
                              ? '#CA8A04'
                              : '#16A34A'
                        }}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#334155' }}>
                      {c.reviewStatus === 'MITIGATED' ? (
                        <div style={{ color: '#16A34A' }}>
                          <b>Mitigated:</b> {c.suggestedRedline}
                        </div>
                      ) : (
                        c.legalRationale
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature / Certification Block */}
            <div
              style={{
                marginTop: '2rem',
                borderTop: '1px solid #CBD5E1',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: '#64748B'
              }}
            >
              <div>LexiRisk Sentinel Automated Legal Review Engine &bull; Confidential</div>
              <div>Page 1 of 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
