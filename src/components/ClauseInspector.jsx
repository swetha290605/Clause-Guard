import React, { useState } from 'react';
import { Check, Copy, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClauseInspector({
  clause,
  onApplyRedline,
  onMarkStatus
}) {
  const [copied, setCopied] = useState(false);

  if (!clause) {
    return (
      <div className="light-glass-empty-inspector">
        <p>Select any flagged clause on the left to review and fix it.</p>
      </div>
    );
  }

  const isMitigated = clause.reviewStatus === 'MITIGATED';
  const hasRisk = clause.severity === 'CRITICAL' || clause.severity === 'HIGH';

  const handleCopy = () => {
    if (clause.suggestedRedline) {
      navigator.clipboard.writeText(clause.suggestedRedline);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    onApplyRedline(clause.id);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleRevert = () => {
    onMarkStatus(clause.id, 'NEEDS_REVIEW');
  };

  return (
    <div className="light-glass-panel inspector-panel">
      {/* Header */}
      <div className="inspector-top-row">
        <div>
          <span className="clause-index-tag">Clause {clause.number}</span>
          <h2 className="inspector-heading">{clause.title}</h2>
        </div>

        <span className={`status-chip ${isMitigated ? 'chip-fixed' : hasRisk ? 'chip-flagged' : 'chip-safe'}`}>
          {isMitigated ? 'Fixed' : hasRisk ? 'Flagged' : 'Safe'}
        </span>
      </div>

      <div className="inspector-flow-body">
        {/* Step A: What was flagged */}
        <div className="flow-card flagged-card">
          <div className="flow-card-label text-red">
            <AlertCircle size={14} /> Flagged Language
          </div>
          <div className="flow-card-text">
            {clause.originalText}
          </div>
        </div>

        {/* Step B: The Replacement Fix */}
        {clause.suggestedRedline && (
          <div className="flow-card fix-card">
            <div className="flow-card-header">
              <span className="flow-card-label text-green">
                <Check size={14} /> Suggested Replacement
              </span>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flow-card-text text-fix">
              {clause.suggestedRedline}
            </div>
          </div>
        )}

        {/* Step C: 1-Click Action */}
        <div className="inspector-cta-area">
          {!isMitigated ? (
            <button className="btn-apply-fix" onClick={handleApply}>
              <Check size={18} />
              <span>Apply Fix</span>
            </button>
          ) : (
            <div className="fixed-state-row">
              <div className="fixed-pill">
                <Check size={16} /> Applied to contract
              </div>
              <button className="btn-revert" onClick={handleRevert} title="Revert to original">
                <RotateCcw size={14} /> Revert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
