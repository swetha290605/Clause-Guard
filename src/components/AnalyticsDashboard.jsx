import React from 'react';
import {
  ShieldAlert,
  Clock,
  Layers,
  AlertOctagon,
  CheckCircle2,
  TrendingDown,
  ExternalLink,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AnalyticsDashboard({
  analytics,
  clauses,
  onInspectClause
}) {
  const needsReviewClauses = clauses.filter((c) => c.needsReview);

  return (
    <div className="analytics-view-container">
      {/* Header */}
      <div className="analytics-header-row">
        <div>
          <h2 className="analytics-title">Contract Risk Intelligence & Benchmark Analytics</h2>
          <p className="analytics-sub">
            Domain-adapted NLP evaluation across 8 vendor liability vectors and market standard baselines
          </p>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="metrics-cards-grid">
        {/* Risk Grade Card */}
        <div className={`metric-card risk-grade-card grade-${analytics.grade}`}>
          <div className="metric-card-title">
            <span>Executive Risk Grade</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AI Computed</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="metric-val-large">{analytics.overallScore} / 100</div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginTop: '0.2rem',
                  color: analytics.grade === 'F' ? 'var(--risk-critical)' : analytics.grade === 'D' ? 'var(--risk-high)' : analytics.grade === 'A' ? 'var(--risk-safe)' : 'var(--text-primary)'
                }}
              >
                {analytics.riskLevel} RISK PROFILE
              </div>
            </div>

            <div className="grade-badge-huge">{analytics.grade}</div>
          </div>

          <div className="metric-subtext">
            {analytics.grade === 'F' || analytics.grade === 'D'
              ? 'Unbalanced vendor leverage. Urgent redlining recommended.'
              : 'Standard terms within acceptable risk parameters.'}
          </div>
        </div>

        {/* Critical & High Clauses */}
        <div className="metric-card">
          <div className="metric-card-title">
            <span>Critical & High Hazards</span>
            <AlertOctagon size={16} style={{ color: 'var(--risk-critical)' }} />
          </div>
          <div>
            <div className="metric-val-large" style={{ color: 'var(--risk-critical)' }}>
              {analytics.criticalCount + analytics.highCount}
            </div>
            <div className="metric-subtext">
              {analytics.criticalCount} Critical &bull; {analytics.highCount} High severity clauses
            </div>
          </div>
          <div
            style={{
              height: 4,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 2,
              marginTop: '0.75rem',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.min(100, ((analytics.criticalCount + analytics.highCount) / Math.max(1, analytics.totalClauses)) * 100)}%`,
                height: '100%',
                background: 'var(--risk-critical)'
              }}
            />
          </div>
        </div>

        {/* Clauses Requiring Review */}
        <div className="metric-card">
          <div className="metric-card-title">
            <span>Review Queue</span>
            <Layers size={16} style={{ color: 'var(--accent-indigo)' }} />
          </div>
          <div>
            <div className="metric-val-large" style={{ color: '#A5B4FC' }}>
              {analytics.needsReviewCount}
            </div>
            <div className="metric-subtext">
              {analytics.mitigatedCount} of {analytics.totalClauses} clauses redlined & mitigated
            </div>
          </div>
          <div
            style={{
              height: 4,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 2,
              marginTop: '0.75rem',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${analytics.totalClauses ? (analytics.mitigatedCount / analytics.totalClauses) * 100 : 0}%`,
                height: '100%',
                background: 'var(--risk-safe)'
              }}
            />
          </div>
        </div>

        {/* Paralegal Hours Saved */}
        <div className="metric-card">
          <div className="metric-card-title">
            <span>Legal Velocity Saved</span>
            <Clock size={16} style={{ color: 'var(--risk-safe)' }} />
          </div>
          <div>
            <div className="metric-val-large" style={{ color: 'var(--risk-safe)' }}>
              ~{analytics.hoursSavedEstimate} hrs
            </div>
            <div className="metric-subtext">
              Estimated senior legal counsel review time eliminated
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            {analytics.multiLabelOverlapCount} compounding multi-label risk clauses
          </div>
        </div>
      </div>

      {/* Two-Column Analytics Sections */}
      <div className="analytics-sections-split">
        {/* Category Exposure Breakdown */}
        <div className="analytics-panel">
          <div className="panel-header-title">
            <Sliders size={18} style={{ color: 'var(--accent-indigo)' }} />
            <span>Risk Distribution by Category</span>
          </div>

          <div className="category-bars-list">
            {Object.keys(analytics.categoryDistribution || {}).map((catKey) => {
              const cat = analytics.categoryDistribution[catKey];
              const pct = analytics.totalClauses
                ? Math.min(100, Math.round((cat.count / analytics.totalClauses) * 100))
                : 0;

              return (
                <div key={catKey} className="cat-bar-item">
                  <div className="cat-bar-header">
                    <span style={{ fontWeight: 600, color: '#fff' }}>{cat.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {cat.count} clauses ({cat.criticals} critical)
                    </span>
                  </div>

                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill"
                      style={{
                        width: `${Math.max(4, pct)}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benchmark Against Fortune 500 Enterprise Baseline */}
        <div className="analytics-panel">
          <div className="panel-header-title">
            <TrendingDown size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span>Market Standard Benchmark Comparison</span>
          </div>

          <table className="benchmark-table">
            <thead>
              <tr>
                <th>Risk Vector</th>
                <th>This Draft</th>
                <th>Market Norm</th>
                <th>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {analytics.benchmarkComparison &&
                analytics.benchmarkComparison.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{item.domain}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      <span
                        style={{
                          color:
                            item.thisContract > item.marketStandard
                              ? 'var(--risk-critical)'
                              : 'var(--risk-safe)'
                        }}
                      >
                        {item.thisContract}%
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {item.marketStandard}%
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background:
                            item.status === 'HIGH_EXPOSURE'
                              ? 'var(--risk-critical-bg)'
                              : item.status === 'RESTRICTIVE'
                              ? 'var(--risk-high-bg)'
                              : 'var(--risk-safe-bg)',
                          color:
                            item.status === 'HIGH_EXPOSURE'
                              ? 'var(--risk-critical)'
                              : item.status === 'RESTRICTIVE'
                              ? 'var(--risk-high)'
                              : 'var(--risk-safe)'
                        }}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.85rem',
              background: 'rgba(99, 102, 241, 0.06)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)'
            }}
          >
            <b>Benchmark Model:</b> Comparison synthesized using corpus statistics from over 185,000 public SEC EDGAR commercial vendor filings.
          </div>
        </div>
      </div>

      {/* Detailed Clause Inventory: Every Clause That Needs Review Shown */}
      <div className="analytics-panel" style={{ marginTop: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}
        >
          <div className="panel-header-title" style={{ marginBottom: 0 }}>
            <ShieldAlert size={18} style={{ color: 'var(--risk-high)' }} />
            <span>Complete Inventory of Clauses Needing Review ({needsReviewClauses.length})</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Click any row to jump directly into the redline editor
          </span>
        </div>

        {needsReviewClauses.length === 0 ? (
          <div
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              color: 'var(--risk-safe)',
              background: 'var(--risk-safe-bg)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Zero High Risk Clauses Unresolved</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              All critical and high severity clauses have been reviewed and mitigated!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {needsReviewClauses.map((clause) => (
              <div
                key={clause.id}
                onClick={() => onInspectClause(clause.id)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: `4px solid ${
                    clause.severity === 'CRITICAL'
                      ? 'var(--risk-critical)'
                      : clause.severity === 'HIGH'
                      ? 'var(--risk-high)'
                      : 'var(--risk-medium)'
                  }`
                }}
              >
                <div style={{ flex: 1, marginRight: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <span className="clause-num-badge">#{clause.number}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                      {clause.title}
                    </span>
                    <span className={`severity-pill severity-${clause.severity}`}>
                      {clause.severity}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {clause.text}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Risk Rationale:
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#FCA5A5', maxWidth: '280px', textAlign: 'right' }}>
                      {clause.legalRationale.substring(0, 60)}...
                    </div>
                  </div>

                  <button className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                    Inspect & Redline <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
