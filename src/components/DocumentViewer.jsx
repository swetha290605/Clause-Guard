import React from 'react';
import { Search, Check, ChevronRight } from 'lucide-react';

export default function DocumentViewer({
  clauses,
  selectedClauseId,
  onSelectClause,
  filterMode,
  setFilterMode,
  searchQuery,
  setSearchQuery
}) {
  const filteredClauses = clauses.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = c.text.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      if (!matchText && !matchTitle) return false;
    }

    if (filterMode === 'FLAGGED') {
      return (c.severity === 'CRITICAL' || c.severity === 'HIGH') && c.reviewStatus !== 'MITIGATED';
    }
    if (filterMode === 'FIXED') {
      return c.reviewStatus === 'MITIGATED';
    }
    return true;
  });

  const flaggedCount = clauses.filter(
    (c) => (c.severity === 'CRITICAL' || c.severity === 'HIGH') && c.reviewStatus !== 'MITIGATED'
  ).length;

  const fixedCount = clauses.filter((c) => c.reviewStatus === 'MITIGATED').length;

  return (
    <div className="light-glass-panel doc-viewer-panel">
      {/* Top Filter & Search */}
      <div className="doc-viewer-topbar">
        <div className="filter-pill-group">
          <button
            className={`tab-pill ${filterMode === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterMode('ALL')}
          >
            All ({clauses.length})
          </button>
          <button
            className={`tab-pill pill-flagged ${filterMode === 'FLAGGED' ? 'active' : ''}`}
            onClick={() => setFilterMode('FLAGGED')}
          >
            Flagged ({flaggedCount})
          </button>
          <button
            className={`tab-pill pill-fixed ${filterMode === 'FIXED' ? 'active' : ''}`}
            onClick={() => setFilterMode('FIXED')}
          >
            Fixed ({fixedCount})
          </button>
        </div>

        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search contract..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Clauses List */}
      <div className="clauses-list">
        {filteredClauses.map((clause) => {
          const isSelected = selectedClauseId === clause.id;
          const isMitigated = clause.reviewStatus === 'MITIGATED';
          const hasRisk = (clause.severity === 'CRITICAL' || clause.severity === 'HIGH') && !isMitigated;

          return (
            <div
              key={clause.id}
              className={`clause-item-card ${isSelected ? 'selected' : ''} ${
                isMitigated ? 'is-fixed' : hasRisk ? 'is-flagged' : 'is-safe'
              }`}
              onClick={() => onSelectClause(clause.id)}
            >
              <div className="clause-item-header">
                <div className="clause-item-title-group">
                  <span className="clause-num">#{clause.number}</span>
                  <span className="clause-item-title">{clause.title}</span>
                </div>

                <span
                  className={`status-chip ${
                    isMitigated ? 'chip-fixed' : hasRisk ? 'chip-flagged' : 'chip-safe'
                  }`}
                >
                  {isMitigated ? 'Fixed' : hasRisk ? 'Flagged' : 'Safe'}
                </span>
              </div>

              <div className="clause-item-preview">
                {isMitigated ? (
                  <span className="preview-fixed-text">{clause.text}</span>
                ) : (
                  <span>{clause.text}</span>
                )}
              </div>

              <div className="clause-item-footer">
                <span className="action-hint">
                  {isSelected ? 'Currently Viewing' : 'Click to Review'}
                </span>
                <ChevronRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
