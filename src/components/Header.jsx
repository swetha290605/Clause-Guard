import React from 'react';
import { ShieldCheck, UploadCloud, Download, Check } from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';

export default function Header({
  onOpenUpload,
  onDownloadClean,
  contractId,
  onSelectSample,
  flaggedCount
}) {
  return (
    <header className="light-glass-header">
      <div className="header-brand">
        <div className="brand-icon">
          <ShieldCheck size={18} />
        </div>
        <span className="brand-name">Clause Guard</span>
      </div>

      {/* Contract Quick Selector */}
      <div className="contract-switcher-row">
        {SAMPLE_CONTRACTS.map((sample) => {
          const isActive = contractId === sample.id;
          return (
            <button
              key={sample.id}
              className={`switcher-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSample(sample.id)}
            >
              {sample.id === 'cloud-saas-msa' && 'SaaS Agreement'}
              {sample.id === 'it-services-sow' && 'Consulting SOW'}
              {sample.id === 'vendor-dpa' && 'Privacy DPA'}
              {sample.id === 'balanced-nda' && 'Mutual NDA'}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="header-actions-row">
        <button className="btn-light-secondary" onClick={onOpenUpload}>
          <UploadCloud size={15} />
          <span>Upload</span>
        </button>

        <button className="btn-light-primary" onClick={onDownloadClean} title="Download clean contract text">
          <Download size={15} />
          <span>Download Fixed Contract</span>
        </button>
      </div>
    </header>
  );
}
