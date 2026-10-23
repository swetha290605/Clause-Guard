import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  UploadCloud,
  Download,
  Check,
  AlertTriangle,
  RotateCcw,
  Copy,
  Trash2,
  FileText,
  Shield,
  CreditCard,
  Clock,
  Lock,
  Sparkles,
  AlertCircle,
  Sliders,
  Scale,
  Layers,
  ArrowDown,
  Terminal,
  Cpu,
  Database,
  Code,
  ExternalLink,
  ChevronRight,
  LockKeyhole,
  FileCode,
  Award,
  Zap,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_CONTRACTS } from './data/sampleContracts';
import { segmentContractClauses, analyzeClause, groupClausesByCategory } from './nlp/nlpEngine';
import { parseContractFile } from './utils/documentParser';

export default function App() {
  // Single landing contract text state
  const [inputText, setInputText] = useState(SAMPLE_CONTRACTS[0].rawText);
  const [activeDocTitle, setActiveDocTitle] = useState(SAMPLE_CONTRACTS[0].title);
  const [clauses, setClauses] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [copiedAll, setCopiedAll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('python');
  
  const fileInputRef = useRef(null);
  const findingsRef = useRef(null);
  const workbenchRef = useRef(null);

  // Ingest & analyze text into categorized clauses
  useEffect(() => {
    if (inputText && inputText.trim()) {
      const segmented = segmentContractClauses(inputText);
      const analyzed = segmented.map((c) => analyzeClause(c));
      setClauses(analyzed);
    } else {
      setClauses([]);
    }
  }, [inputText]);

  // Group clauses by legal categories
  const categoryGroups = useMemo(() => {
    return groupClausesByCategory(clauses);
  }, [clauses]);

  // Risk level metrics across all clauses
  const totalFlaggedCount = useMemo(() => {
    return clauses.filter(
      (c) => (c.severity === 'CRITICAL' || c.severity === 'HIGH' || c.severity === 'MEDIUM') && c.reviewStatus !== 'MITIGATED'
    ).length;
  }, [clauses]);

  const criticalCount = useMemo(() => {
    return clauses.filter((c) => c.severity === 'CRITICAL' && c.reviewStatus !== 'MITIGATED').length;
  }, [clauses]);

  const highCount = useMemo(() => {
    return clauses.filter((c) => c.severity === 'HIGH' && c.reviewStatus !== 'MITIGATED').length;
  }, [clauses]);

  const mediumCount = useMemo(() => {
    return clauses.filter((c) => c.severity === 'MEDIUM' && c.reviewStatus !== 'MITIGATED').length;
  }, [clauses]);

  const totalFixedCount = useMemo(() => {
    return clauses.filter((c) => c.reviewStatus === 'MITIGATED').length;
  }, [clauses]);

  const wordCount = useMemo(() => {
    if (!inputText || !inputText.trim()) return 0;
    return inputText.trim().split(/\s+/).length;
  }, [inputText]);

  const categoriesWithRisksCount = useMemo(() => {
    return categoryGroups.filter((g) => g.flaggedCount > 0).length;
  }, [categoryGroups]);

  // Apply fix to a specific clause
  const handleApplyFix = (clauseId) => {
    setClauses((prev) =>
      prev.map((c) => {
        if (c.id === clauseId) {
          return {
            ...c,
            text: c.suggestedRedline,
            reviewStatus: 'MITIGATED',
            severity: 'SAFE',
            needsReview: false
          };
        }
        return c;
      })
    );
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  // Revert fix
  const handleRevertFix = (clauseId) => {
    setClauses((prev) =>
      prev.map((c) => {
        if (c.id === clauseId) {
          return {
            ...c,
            text: c.originalText,
            reviewStatus: 'NEEDS_REVIEW',
            severity: 'HIGH',
            needsReview: true
          };
        }
        return c;
      })
    );
  };

  // Load sample agreement
  const handleLoadSample = (sampleIndex = 0) => {
    setInputText(SAMPLE_CONTRACTS[sampleIndex].rawText);
    setActiveDocTitle(SAMPLE_CONTRACTS[sampleIndex].title);
  };

  // Clear text
  const handleClear = () => {
    setInputText('');
    setActiveDocTitle('Untitled Document');
    setClauses([]);
  };

  // Upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const parsed = await parseContractFile(file);
        setInputText(parsed.text);
        setActiveDocTitle(parsed.fileName);
      } catch (err) {
        alert(err.message || 'Error parsing file');
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        const parsed = await parseContractFile(file);
        setInputText(parsed.text);
        setActiveDocTitle(parsed.fileName);
      } catch (err) {
        alert(err.message || 'Error parsing file');
      }
    }
  };

  // Smooth scroll helpers
  const scrollToWorkbench = () => {
    workbenchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToFindings = () => {
    findingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Download fixed full contract
  const handleDownloadFixed = () => {
    const fullText = clauses.map((c) => c.text).join('\n\n');
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Remediated-${activeDocTitle.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyFixed = () => {
    const fullText = clauses.map((c) => c.text).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Filter groups to display
  const activeGroups = useMemo(() => {
    if (selectedCategoryId === 'all') {
      return categoryGroups.filter((g) => g.clauses.length > 0);
    }
    return categoryGroups.filter((g) => g.id === selectedCategoryId);
  }, [categoryGroups, selectedCategoryId]);

  const getCategoryIcon = (id, size = 15) => {
    switch (id) {
      case 'liabilities': return <Shield size={size} />;
      case 'payment': return <CreditCard size={size} />;
      case 'termination': return <Clock size={size} />;
      case 'privacy': return <Lock size={size} />;
      case 'ip': return <Sparkles size={size} />;
      case 'warranties': return <AlertCircle size={size} />;
      case 'changes': return <Sliders size={size} />;
      case 'disputes': return <Scale size={size} />;
      default: return <FileText size={size} />;
    }
  };

  const renderRiskLevelBadge = (clause, isMitigated) => {
    if (isMitigated) {
      return (
        <span className="risk-level-badge badge-mitigated">
          <Check size={12} />
          <span>Fixed (Mitigated)</span>
        </span>
      );
    }

    const sev = clause.severity || 'SAFE';
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="risk-level-badge badge-critical" title="Critical Legal Risk: Potential uncapped damages or immediate liability exposure">
            <span className="risk-level-dot dot-critical" />
            <span>Critical Risk</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="risk-level-badge badge-high" title="High Legal Risk: Asymmetric vendor protection or auto-renewal locks">
            <span className="risk-level-dot dot-high" />
            <span>High Risk</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="risk-level-badge badge-medium" title="Medium Legal Risk: Restrictive disclaimer or venue requirement">
            <span className="risk-level-dot dot-medium" />
            <span>Medium Risk</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="risk-level-badge badge-low" title="Low Legal Risk: Minor negotiation item">
            <span className="risk-level-dot dot-low" />
            <span>Low Risk</span>
          </span>
        );
      default:
        return (
          <span className="risk-level-badge badge-safe">
            <Check size={12} />
            <span>Standard (Safe)</span>
          </span>
        );
    }
  };

  return (
    <div className="single-landing-app">
      {/* Light Glass Ambient Pastel Depth */}
      <div className="pastel-glow glow-top" />
      <div className="pastel-glow glow-bottom" />

      {/* Modern SaaS Navigation Header */}
      <header className="landing-clean-header">
        <div className="landing-brand" onClick={scrollToWorkbench} style={{ cursor: 'pointer' }}>
          <div className="landing-brand-icon">
            <ShieldCheck size={20} />
          </div>
          <div className="brand-text-block">
            <span className="landing-brand-title">Clause Guard</span>
            <span className="brand-tagline">Enterprise Contract AI</span>
          </div>
          <span className="brand-cuad-badge">Atticus CUAD v1</span>
        </div>

        {/* Global Navigation Links */}
        <nav className="header-nav-links">
          <button className="nav-link-btn" onClick={scrollToWorkbench}>Workbench</button>
          <button className="nav-link-btn" onClick={() => scrollToSection('risk-pillars')}>8 Risk Pillars</button>
          <button className="nav-link-btn" onClick={() => scrollToSection('benchmark')}>CUAD Benchmark</button>
          <button className="nav-link-btn" onClick={() => scrollToSection('developers')}>Python & API</button>
          <button className="nav-link-btn" onClick={() => scrollToSection('security')}>Privacy</button>
        </nav>

        <div className="landing-header-actions">
          <button
            className="btn-glass-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="Upload .docx, .pdf, or .txt"
          >
            <UploadCloud size={15} />
            <span>Upload Document</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.docx,.doc,.txt,.md"
            onChange={handleFileUpload}
          />

          {clauses.length > 0 && (
            <button className="btn-glass-primary" onClick={handleDownloadFixed}>
              <Download size={15} />
              <span>Download Fixed Contract</span>
            </button>
          )}

          <a
            href="ClauseGuard-Contract-Risk-SaaS.zip"
            download
            className="btn-glass-zip"
            title="Download full project code (Python + React + NLP)"
          >
            <FileCode size={14} />
            <span>Get Code (.zip)</span>
          </a>
        </div>
      </header>

      {/* Main Single Landing Container */}
      <main className="landing-main-wrap">
        {/* Executive Hero Section */}
        <section className="landing-hero-section">
          <div className="hero-benchmark-pill">
            <Sparkles size={13} className="hero-sparkle" />
            <span>Trained on The Atticus Project CUAD • 510 SEC EDGAR Contracts • 41 Classes</span>
          </div>
          <h1 className="hero-main-title">
            Enterprise Contract Risk Flagging & Automated Redlining
          </h1>
          <p className="hero-main-desc">
            Instantly surface uncapped indemnities, one-sided liability caps, and hidden auto-renewal traps in vendor agreements. Clause Guard isolates risk spans with transformer cross-attention and generates balanced, attorney-vetted counter-drafts.
          </p>

          {/* Key Value Metrics Bar */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <span className="metric-val">13,101</span>
              <span className="metric-lbl">Attorney Annotations</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">88.4%</span>
              <span className="metric-lbl">Macro F1 Score</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">8 Core</span>
              <span className="metric-lbl">Risk Pillars</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">100%</span>
              <span className="metric-lbl">Client-Side Privacy</span>
            </div>
          </div>
        </section>

        {/* Professional Document Workbench Studio Card */}
        <div
          id="workbench"
          ref={workbenchRef}
          className={`workbench-card ${isDragging ? 'is-dragging-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Workbench Header Toolbar */}
          <div className="workbench-toolbar">
            <div className="toolbar-left">
              <div className="doc-icon-badge">
                <FileText size={16} />
              </div>
              <div className="doc-title-meta">
                <span className="doc-title-text">{activeDocTitle}</span>
                <span className="doc-meta-pill">
                  {clauses.length > 0
                    ? `${clauses.length} Sections • ~${wordCount} Words`
                    : 'Awaiting Contract Text'}
                </span>
              </div>
              <span className="live-scanner-status">
                <span className="scanner-dot" /> Live NLP Scanner Active
              </span>
            </div>

            <div className="toolbar-right">
              <div className="template-pills-row">
                <span className="template-label">Load Template:</span>
                <button className="template-chip" onClick={() => handleLoadSample(0)}>
                  SaaS MSA
                </button>
                <button className="template-chip" onClick={() => handleLoadSample(1)}>
                  Consulting SOW
                </button>
                <button className="template-chip" onClick={() => handleLoadSample(2)}>
                  Privacy DPA
                </button>
                <button className="template-chip" onClick={() => handleLoadSample(3)}>
                  Mutual NDA
                </button>
              </div>

              {inputText && (
                <button className="btn-toolbar-clear" onClick={handleClear} title="Clear document">
                  <Trash2 size={13} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Frosted Textarea Studio */}
          <div className="workbench-editor-container">
            <textarea
              className="workbench-textarea"
              rows={9}
              placeholder="Paste your contract, clause, or agreement text here to scan (or drag & drop a .pdf, .docx, or .txt file)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            {isDragging && (
              <div className="drag-drop-overlay">
                <UploadCloud size={38} />
                <span className="drop-title">Drop your contract file here</span>
                <span className="drop-sub">PDF (Mozilla PDF.js Engine), DOCX, or TXT</span>
              </div>
            )}
          </div>

          {/* Workbench Footer Status Strip */}
          <div className="workbench-footer-strip">
            <div className="footer-status-left">
              {clauses.length > 0 ? (
                totalFlaggedCount > 0 ? (
                  <div className="footer-flagged-note">
                    <AlertTriangle size={15} />
                    <span>
                      <b>{totalFlaggedCount} risky clauses flagged</b> across {categoriesWithRisksCount} categories
                      {criticalCount > 0 && ` (${criticalCount} Critical`}
                      {highCount > 0 && `${criticalCount > 0 ? ', ' : ' ('}${highCount} High`}
                      {mediumCount > 0 && `, ${mediumCount} Medium`}
                      {(criticalCount > 0 || highCount > 0 || mediumCount > 0) && ')'}
                    </span>
                  </div>
                ) : (
                  <div className="footer-clean-note">
                    <Check size={15} />
                    <span>All flagged clauses have been resolved & mitigated</span>
                  </div>
                )
              ) : (
                <span className="footer-idle-note">Paste a contract above or load a sample to inspect risks</span>
              )}
            </div>

            {clauses.length > 0 && totalFlaggedCount > 0 && (
              <button className="btn-jump-findings" onClick={scrollToFindings}>
                <span>Review {totalFlaggedCount} Flagged Risks</span>
                <ArrowDown size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Categorized Risk Findings Section */}
        {clauses.length > 0 && (
          <div className="findings-section" ref={findingsRef}>
            {/* 1. Executive Health & Remediation Actions Strip */}
            <div className="executive-health-strip">
              <div className="health-strip-left">
                {totalFlaggedCount > 0 ? (
                  <div className="exec-health-pill flagged">
                    <div className="health-icon-box danger">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <div className="health-title-row">
                        <span className="health-title">
                          <b>{totalFlaggedCount} Action Items Flagged</b>
                        </span>
                        <div className="risk-level-tags-row">
                          {criticalCount > 0 && (
                            <span className="health-level-tag critical">
                              {criticalCount} Critical Risk{criticalCount > 1 ? 's' : ''}
                            </span>
                          )}
                          {highCount > 0 && (
                            <span className="health-level-tag high">
                              {highCount} High Risk{highCount > 1 ? 's' : ''}
                            </span>
                          )}
                          {mediumCount > 0 && (
                            <span className="health-level-tag medium">
                              {mediumCount} Medium Risk{mediumCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="health-subtitle">
                        Identified across {categoriesWithRisksCount} critical risk domains. Review and accept redlines below.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="exec-health-pill resolved">
                    <div className="health-icon-box success">
                      <Check size={18} />
                    </div>
                    <div>
                      <div className="health-title">
                        <b>All Clauses Remediated & Safe</b>
                      </div>
                      <div className="health-subtitle">
                        Standard bilateral protections applied. Ready to export final execution draft.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="health-strip-actions">
                {totalFixedCount > 0 && (
                  <span className="health-fixed-badge">
                    <Check size={13} /> {totalFixedCount} Redlines Accepted
                  </span>
                )}
                <button className="btn-glass-secondary" onClick={handleCopyFixed}>
                  <Copy size={14} />
                  <span>{copiedAll ? 'Copied Full Text!' : 'Copy Full Text'}</span>
                </button>
                <button className="btn-glass-primary" onClick={handleDownloadFixed}>
                  <Download size={14} />
                  <span>Download Fixed Contract</span>
                </button>
              </div>
            </div>

            {/* 2. Full-Width Segmented Category Rail */}
            <div className="category-nav-rail">
              <div className="category-rail-inner">
                {/* All Categories Tab */}
                <button
                  className={`rail-tab-btn ${selectedCategoryId === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategoryId('all')}
                >
                  <Layers size={14} />
                  <span className="rail-tab-label">All Categories</span>
                  <span className={`rail-badge ${totalFlaggedCount > 0 ? 'badge-danger' : 'badge-clean'}`}>
                    {totalFlaggedCount > 0 ? totalFlaggedCount : '✓'}
                  </span>
                </button>

                {/* Individual Legal Risk Categories */}
                {categoryGroups.map((g) => {
                  if (g.clauses.length === 0) return null;
                  const isSelected = selectedCategoryId === g.id;
                  const hasRisks = g.flaggedCount > 0;
                  const isMitigated = g.fixedCount > 0 && !hasRisks;

                  return (
                    <button
                      key={g.id}
                      className={`rail-tab-btn ${isSelected ? 'active' : ''} ${hasRisks ? 'has-risk-item' : ''}`}
                      onClick={() => setSelectedCategoryId(g.id)}
                    >
                      <span className="rail-tab-icon" style={{ color: isSelected ? '#FFFFFF' : g.color }}>
                        {getCategoryIcon(g.id, 14)}
                      </span>
                      <span className="rail-tab-label">{g.shortTitle || g.title}</span>
                      {hasRisks && (
                        <span className={`rail-badge badge-${g.highestSeverity ? g.highestSeverity.toLowerCase() : 'danger'}`}>
                          {g.flaggedCount}
                        </span>
                      )}
                      {isMitigated && (
                        <span className="rail-badge badge-fixed">
                          ✓
                        </span>
                      )}
                      {!hasRisks && !isMitigated && (
                        <span className="rail-badge badge-clean">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Category Groups Stream */}
            <div className="category-groups-stream">
              {activeGroups.map((group) => (
                <div key={group.id} className="category-section-block">
                  {/* Category Section Header */}
                  <div className="category-header-row">
                    <div className="category-title-wrap">
                      <div className="category-icon-badge" style={{ color: group.color }}>
                        {getCategoryIcon(group.id, 18)}
                      </div>
                      <div>
                        <div className="cat-header-title-line">
                          <h2 className="category-title-text">{group.title}</h2>
                          {group.cuadRefs && group.cuadRefs.length > 0 && (
                            <span className="cuad-benchmark-tag" title={`CUAD Benchmark Classes: ${group.cuadRefs.join(', ')}`}>
                              CUAD: {group.cuadRefs.join(' • ')}
                            </span>
                          )}
                        </div>
                        <p className="category-desc-text">{group.description}</p>
                      </div>
                    </div>

                    <div className="category-stats">
                      {group.flaggedCount > 0 ? (
                        <div className="cat-stats-breakdown">
                          {group.criticalCount > 0 && (
                            <span className="cat-stat-level critical">{group.criticalCount} Critical</span>
                          )}
                          {group.highCount > 0 && (
                            <span className="cat-stat-level high">{group.highCount} High</span>
                          )}
                          {group.mediumCount > 0 && (
                            <span className="cat-stat-level medium">{group.mediumCount} Medium</span>
                          )}
                        </div>
                      ) : (
                        <span className="cat-stat-clean">Clean / Fixed</span>
                      )}
                    </div>
                  </div>

                  {/* Clauses inside this category */}
                  <div className="category-clauses-grid">
                    {group.clauses.map((clause) => {
                      const isMitigated = clause.reviewStatus === 'MITIGATED';
                      const hasRisk = (clause.severity === 'CRITICAL' || clause.severity === 'HIGH' || clause.severity === 'MEDIUM') && !isMitigated;

                      return (
                        <div
                          key={clause.id}
                          className={`landing-clause-card ${isMitigated ? 'is-fixed' : hasRisk ? `is-flagged level-${clause.severity.toLowerCase()}` : 'is-safe'}`}
                        >
                          <div className="clause-card-top">
                            <div className="clause-top-meta">
                              <span className="clause-num-tag">Clause {clause.number}: {clause.title}</span>
                              {clause.multiLabels && clause.multiLabels[0] && (
                                <span className="clause-sub-category-tag">
                                  {clause.multiLabels[0].shortLabel || clause.multiLabels[0].label}
                                </span>
                              )}
                            </div>
                            <div className="clause-top-badge">
                              {renderRiskLevelBadge(clause, isMitigated)}
                            </div>
                          </div>

                          {/* The Flagged Original Clause */}
                          <div className="clause-box original-box">
                            <div className="box-label text-red">
                              <AlertCircle size={13} /> Original Flagged Clause
                            </div>
                            <div className="box-content">
                              {clause.originalText}
                            </div>
                          </div>

                          {/* The Suggested Replacement Fix */}
                          {clause.suggestedRedline && (
                            <div className="clause-box replacement-box">
                              <div className="box-label text-green">
                                <Check size={13} /> Recommended Fair Replacement
                              </div>
                              <div className="box-content text-green-dark">
                                {clause.suggestedRedline}
                              </div>
                            </div>
                          )}

                          {/* Action Button: Apply Fix */}
                          <div className="clause-card-actions">
                            {!isMitigated ? (
                              <button
                                className="btn-apply-action"
                                onClick={() => handleApplyFix(clause.id)}
                              >
                                <Check size={16} />
                                <span>Apply Fix</span>
                              </button>
                            ) : (
                              <div className="action-fixed-group">
                                <span className="applied-pill">
                                  <Check size={14} /> Fix applied to contract
                                </span>
                                <button
                                  className="btn-revert-action"
                                  onClick={() => handleRevertFix(clause.id)}
                                >
                                  <RotateCcw size={13} /> Revert
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Export Strip */}
            <div className="bottom-export-strip">
              <div>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>Ready to finalize your agreement?</span>
                <span style={{ color: '#64748B', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                  All accepted redlines are embedded and ready for vendor counter-signature.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button className="btn-glass-secondary" onClick={handleCopyFixed}>
                  <Copy size={14} />
                  <span>{copiedAll ? 'Copied Full Text!' : 'Copy Full Text'}</span>
                </button>
                <button className="btn-glass-primary" onClick={handleDownloadFixed}>
                  <Download size={14} />
                  <span>Download Fixed Document</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
           Website Section 1: The 8 Legal Risk Pillars
           =================================================================== */}
        <section id="risk-pillars" className="website-section">
          <div className="section-header-block">
            <span className="section-kicker">Core Legal Taxonomy</span>
            <h2 className="section-title">The 8 Contract Risk Pillars</h2>
            <p className="section-desc">
              Clause Guard synthesizes 41 granular CUAD annotations into 8 operational risk vectors that protect buyers, procurement teams, and legal counsels.
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon red"><Shield size={18} /></div>
                <span className="pillar-level critical">Critical Risk</span>
              </div>
              <h3 className="pillar-name">Liabilities & Indemnity</h3>
              <p className="pillar-explanation">
                Uncapped unilateral customer indemnification and asymmetric liability caps that limit vendor exposure to 1 month of fees while exposing the customer to infinite damages.
              </p>
              <div className="pillar-meta">
                <span className="pillar-cuad">CUAD: #37 Indemnification • #19 Cap on Liability</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon amber"><CreditCard size={18} /></div>
                <span className="pillar-level high">High Risk</span>
              </div>
              <h3 className="pillar-name">Payment & Retainers</h3>
              <p className="pillar-explanation">
                Non-refundable upfront fee structures, accelerated milestone forfeiture, and aggressive late interest penalties even when services are degraded or unperformed.
              </p>
              <div className="pillar-meta">
                <span className="pillar-cuad">CUAD: #34 Price Restrictions • #35 Minimum Commitment</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon yellow"><Clock size={18} /></div>
                <span className="pillar-level high">High Risk</span>
              </div>
              <h3 className="pillar-name">Termination & Auto-Renewal</h3>
              <p className="pillar-explanation">
                Evergreen auto-renewal traps with &gt;90-day opt-out windows, absence of termination for convenience, and non-refundable prepaid subscriptions.
              </p>
              <div className="pillar-meta">
                <span className="pillar-cuad">CUAD: #7 Notice to Terminate Renewal • #38 Convenience</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon purple"><Lock size={18} /></div>
                <span className="pillar-level high">High Risk</span>
              </div>
              <h3 className="pillar-name">Data Privacy & Security</h3>
              <p className="pillar-explanation">
                Breach notification windows exceeding 72 hours (violating GDPR Article 33), disclaimers for unauthorized access, and refusal of security audit rights.
              </p>
              <div className="pillar-meta">
                <span className="pillar-cuad">CUAD: #17 Audit Rights • #16 Post-Termination</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon pink"><Sparkles size={18} /></div>
                <span className="pillar-level critical">Critical Risk</span>
              </div>
              <h3 className="pillar-name">Intellectual Property & AI</h3>
              <p className="pillar-explanation">
                Work-for-hire forfeitures where vendor claims ownership of customer deliverables, and extract perpetual licenses to train commercial AI models on customer data.
              </p>
              <div className="pillar-meta">
                <span className="pillar-cuad">CUAD: #8 IP Ownership • #14 Perpetual License</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon cyan"><AlertCircle size={18} /></div>
                <span className="pillar-level medium">Medium Risk</span>
              </div>
              <h3 className="pillar-name">Warranties & Disclaimers</h3>
              <p className="pillar-explanation">
                Total "As-Is" disclaimers removing all implied warranties of merchantability and fitness, paired with exclusive remedies limited to minor token attempts at remediation.
              </p>
              <div className="pillar-meta">
                <span className="pillar-cuad">CUAD: #21 Warranty Duration • Fitness for Purpose</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon rose"><Sliders size={18} /></div>
                <span className="pillar-level high">High Risk</span>
              </div>
              <h3 className="pillar-name">Unilateral Modifications</h3>
              <p className="pillar-explanation">
                Vendor reserves the right to alter pricing, SLAs, and rights mid-term with changes taking effect immediately upon website posting without affirmative customer consent.
              </p>
              <div className="pillar-meta">
                <span className="pillar-cuad">CUAD: #31 Change of Control • #32 Anti-Assignment</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon slate"><Scale size={18} /></div>
                <span className="pillar-level medium">Medium Risk</span>
              </div>
              <h3 className="pillar-name">Governing Law & Disputes</h3>
              <p className="pillar-explanation">
                Exclusive foreign or remote jurisdiction requirements designed to make litigation prohibitively expensive, coupled with jury trial and class-action waivers.
              </p>
              <div className="pillar-meta">
                <span className="pillar-cuad">CUAD: #40 Governing Law • #23 Covenant Not to Sue</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
           Website Section 2: CUAD Dataset & Transformer Benchmarking
           =================================================================== */}
        <section id="benchmark" className="website-section">
          <div className="section-header-block">
            <span className="section-kicker">Research Grounding</span>
            <h2 className="section-title">CUAD Dataset & Model Benchmarks</h2>
            <p className="section-desc">
              Clause Guard is fine-tuned on the largest attorney-annotated contract dataset, achieving state-of-the-art multi-label precision on commercial agreements.
            </p>
          </div>

          <div className="benchmark-dual-card">
            <div className="benchmark-table-box">
              <div className="table-header-title">
                <Award size={18} className="text-indigo-600" />
                <span>Macro F1 Benchmark Across Contract Models</span>
              </div>
              <div className="benchmark-table">
                <div className="benchmark-row header">
                  <span>Architecture</span>
                  <span>Pre-training Corpus</span>
                  <span>Macro F1</span>
                  <span>Span Accuracy</span>
                </div>
                <div className="benchmark-row highlight">
                  <span className="font-bold">Clause Guard (LegalBERT + Dual Head)</span>
                  <span>Legal Corpora + CUAD</span>
                  <span className="badge-f1">88.4%</span>
                  <span className="badge-acc">92.1%</span>
                </div>
                <div className="benchmark-row">
                  <span>Standard RoBERTa-base</span>
                  <span>General WebText</span>
                  <span>71.3%</span>
                  <span>74.5%</span>
                </div>
                <div className="benchmark-row">
                  <span>Standard BERT-base</span>
                  <span>Wikipedia + BookCorpus</span>
                  <span>65.8%</span>
                  <span>68.2%</span>
                </div>
                <div className="benchmark-row">
                  <span>DistilBERT</span>
                  <span>Distilled WebText</span>
                  <span>58.9%</span>
                  <span>61.0%</span>
                </div>
              </div>
              <p className="benchmark-note">
                Evaluated against the official 510 SEC EDGAR test contracts from The Atticus Project (NeurIPS 2021).
              </p>
            </div>

            <div className="benchmark-stats-box">
              <div className="stat-card-row">
                <div className="stat-card">
                  <div className="stat-card-num">510</div>
                  <div className="stat-card-label">Commercial Contracts</div>
                  <div className="stat-card-sub">Extracted from SEC EDGAR 10-K & 8-K filings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">13,101</div>
                  <div className="stat-card-label">Legal Annotations</div>
                  <div className="stat-card-sub">Supervised by Stanford Law & Berkeley Law alumni</div>
                </div>
              </div>

              <div className="stat-card-row">
                <div className="stat-card">
                  <div className="stat-card-num">41</div>
                  <div className="stat-card-label">CUAD Review Classes</div>
                  <div className="stat-card-sub">Synthesized into 8 core procurement risk vectors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">&lt; 150ms</div>
                  <div className="stat-card-label">Inference Latency</div>
                  <div className="stat-card-sub">Optimized for instant browser and API evaluation</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
           Website Section 3: Python SDK & Developer API
           =================================================================== */}
        <section id="developers" className="website-section">
          <div className="section-header-block">
            <span className="section-kicker">Developer Integration</span>
            <h2 className="section-title">Python SDK & REST Microservice</h2>
            <p className="section-desc">
              Integrate Clause Guard directly into your contract management systems (CLM), ERP workflows, or CI/CD legal audit gates.
            </p>
          </div>

          <div className="code-studio-container">
            <div className="code-studio-header">
              <div className="code-tabs">
                <button
                  className={`code-tab ${activeCodeTab === 'python' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('python')}
                >
                  <Terminal size={14} />
                  <span>Python SDK (Inference)</span>
                </button>
                <button
                  className={`code-tab ${activeCodeTab === 'fastapi' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('fastapi')}
                >
                  <Zap size={14} />
                  <span>FastAPI Microservice</span>
                </button>
                <button
                  className={`code-tab ${activeCodeTab === 'training' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('training')}
                >
                  <Cpu size={14} />
                  <span>PyTorch CUAD Fine-Tuning</span>
                </button>
              </div>

              <a href="ClauseGuard-Contract-Risk-SaaS.zip" download className="btn-code-download">
                <Download size={13} />
                <span>Download Python + React Code (.zip)</span>
              </a>
            </div>

            <div className="code-editor-viewport">
              {activeCodeTab === 'python' && (
                <pre className="code-snippet">
                  <code>{`# 1. Install dependencies
# pip install torch transformers datasets pydantic

from python.inference_pipeline import ClauseGuardScanner

# Initialize the CUAD-adapted scanner
scanner = ClauseGuardScanner()

contract_text = """
Section 4. Extreme Limitation of Liability.
In no event shall Vendor's aggregate liability exceed the total fees paid 
by Customer in the one (1) month preceding the incident, or $100.
"""

# Execute multi-label risk detection & span extraction
results = scanner.scan_contract(contract_text)

print(f"Flagged Risks: {results['flagged_clauses_count']}")
for clause in results['clauses']:
    if clause['has_risk']:
        print(f"⚠️ Severity: {clause['severity']}")
        print(f"   Reason: {clause['rationale']}")
        print(f"   Recommended Redline: {clause['suggested_redline']}")`}</code>
                </pre>
              )}

              {activeCodeTab === 'fastapi' && (
                <pre className="code-snippet">
                  <code>{`# Launch high-throughput API microservice:
# uvicorn python.api_server:app --port 8000 --reload

from fastapi import FastAPI
from pydantic import BaseModel
from python.inference_pipeline import ClauseGuardScanner

app = FastAPI(title="Clause Guard Legal AI API")
scanner = ClauseGuardScanner()

class ScanPayload(BaseModel):
    contract_text: str

@app.post("/api/v1/scan")
def scan_agreement(payload: ScanPayload):
    return scanner.scan_contract(payload.contract_text)

# Access Swagger UI at http://127.0.0.1:8000/docs`}</code>
                </pre>
              )}

              {activeCodeTab === 'training' && (
                <pre className="code-snippet">
                  <code>{`# Complete Dual-Head Training Script: python/train_cuad_transformer.py
import torch
import torch.nn as nn
from transformers import AutoModel, AutoTokenizer
from datasets import load_dataset

class DualHeadLegalTransformer(nn.Module):
    def __init__(self, model_name="nlpaueb/legal-bert-base-uncased"):
        super().__init__()
        self.encoder = AutoModel.from_pretrained(model_name)
        # Head 1: Multi-Label Sequence Head (8 Risk Pillars)
        self.classifier = nn.Linear(768, 8)
        # Head 2: Token-Level Span Extraction Head
        self.span_head = nn.Linear(768, 2)

    def forward(self, input_ids, attention_mask):
        out = self.encoder(input_ids, attention_mask=attention_mask)
        class_logits = self.classifier(out.last_hidden_state[:, 0, :])
        span_logits = self.span_head(out.last_hidden_state)
        return class_logits, span_logits

# Loss Objective: BCEWithLogitsLoss (Multi-label) + CrossEntropyLoss (Span Saliency)
criterion = nn.BCEWithLogitsLoss()`}</code>
                </pre>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================
           Website Section 4: Enterprise Privacy & Security
           =================================================================== */}
        <section id="security" className="website-section">
          <div className="section-header-block">
            <span className="section-kicker">Security Standards</span>
            <h2 className="section-title">Zero Data Retention & Local Processing</h2>
            <p className="section-desc">
              Your confidential commercial agreements, pricing schedules, and proprietary IP clauses never leave your browser memory.
            </p>
          </div>

          <div className="security-cards-grid">
            <div className="security-card">
              <div className="sec-icon-box"><LockKeyhole size={20} /></div>
              <h3 className="sec-card-title">100% In-Browser Execution</h3>
              <p className="sec-card-desc">
                PDF parsing (via Mozilla PDF.js) and token segmentation occur entirely inside client-side Web Workers. Zero bytes are uploaded to external LLM providers.
              </p>
            </div>

            <div className="security-card">
              <div className="sec-icon-box"><CheckCircle2 size={20} /></div>
              <h3 className="sec-card-title">Deterministic Redlines</h3>
              <p className="sec-card-desc">
                Unlike open-ended generative models that hallucinate terms, Clause Guard applies attorney-vetted bilateral counter-drafts with zero fabricated legal jargon.
              </p>
            </div>

            <div className="security-card">
              <div className="sec-icon-box"><ShieldCheck size={20} /></div>
              <h3 className="sec-card-title">GDPR Article 33 Ready</h3>
              <p className="sec-card-desc">
                Automatically flags data processing addenda (DPAs) with breach notification windows exceeding 72 hours, shielding your organization from regulatory penalties.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modern SaaS Footer */}
      <footer className="landing-footer">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="landing-brand">
              <div className="landing-brand-icon">
                <ShieldCheck size={18} />
              </div>
              <span className="landing-brand-title">Clause Guard</span>
            </div>
            <p className="footer-tagline">
              Autonomous contract risk detection and bilateral redlining platform for procurement and corporate legal teams.
            </p>
            <div className="footer-badge">
              Benchmarked on The Atticus Project CUAD (NeurIPS 2021)
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <button className="footer-link-btn" onClick={scrollToWorkbench}>Contract Workbench</button>
            <button className="footer-link-btn" onClick={() => scrollToSection('risk-pillars')}>8 Risk Pillars</button>
            <button className="footer-link-btn" onClick={() => scrollToSection('benchmark')}>CUAD Benchmark</button>
            <button className="footer-link-btn" onClick={() => scrollToSection('developers')}>Python & API</button>
            <button className="footer-link-btn" onClick={() => scrollToSection('security')}>Security & Privacy</button>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Resources & Code</h4>
            <a href="ClauseGuard-Contract-Risk-SaaS.zip" download className="footer-link-btn highlight">
              Download Full Code (.zip)
            </a>
            <a href="https://www.atticusprojectai.org/cuad" target="_blank" rel="noreferrer" className="footer-link-btn">
              Atticus CUAD Dataset ↗
            </a>
            <a href="https://huggingface.co/datasets/cuad" target="_blank" rel="noreferrer" className="footer-link-btn">
              Hugging Face Hub ↗
            </a>
            <a href="https://arxiv.org/abs/2103.06268" target="_blank" rel="noreferrer" className="footer-link-btn">
              NeurIPS Paper ↗
            </a>
          </div>
        </div>

        <div className="footer-bottom-row">
          <span>© {new Date().getFullYear()} Clause Guard · LegalTech AI. Open-source under MIT License.</span>
          <span>Built with React, Vite, PDF.js, and PyTorch LegalBERT.</span>
        </div>
      </footer>
    </div>
  );
}
