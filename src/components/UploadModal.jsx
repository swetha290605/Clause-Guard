import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';
import { parseContractFile } from '../utils/documentParser';

export default function UploadModal({ isOpen, onClose, onContractLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = async (file) => {
    if (!file) return;
    try {
      setErrorMsg('');
      const parsed = await parseContractFile(file);
      onContractLoaded({
        id: `uploaded-${Date.now()}`,
        title: parsed.fileName,
        vendor: 'Uploaded Document',
        type: parsed.format,
        rawText: parsed.text
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error parsing document.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="light-modal-overlay" onClick={onClose}>
      <div className="light-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="light-modal-header">
          <div>
            <h3 className="modal-title">Upload Contract</h3>
            <p className="modal-subtitle">PDF, Word (DOCX), or plain text file</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="light-modal-body">
          {errorMsg && (
            <div className="upload-error-pill">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div
            className={`light-dropzone ${isDragging ? 'is-dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="dropzone-icon-circle">
              <UploadCloud size={24} />
            </div>
            <div className="dropzone-prompt">
              <b>Click to browse</b> or drag and drop your agreement here
            </div>
            <div className="dropzone-hint">Supports PDF, DOCX, TXT</div>
          </div>
        </div>
      </div>
    </div>
  );
}
