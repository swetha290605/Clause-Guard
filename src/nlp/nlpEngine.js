// Domain-Adapted Legal Transformer Inference Simulation Engine
// Models fine-tuned LegalBERT / RoBERTa-Legal multi-label classification
// and token-level explainable span extraction with attention weights.

export const RISK_CATEGORIES = {
  INDEMNITY: {
    id: 'INDEMNITY',
    label: 'Indemnification & Defense',
    shortLabel: 'Indemnity',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    description: 'Obligation to compensate and defend against third-party claims or damages.',
    typicalVendorTrap: 'Uncapped, one-way obligation for buyer with no reciprocal vendor indemnity.'
  },
  LIABILITY_CAP: {
    id: 'LIABILITY_CAP',
    label: 'Limitation of Liability',
    shortLabel: 'Liability Cap',
    color: '#F97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    border: 'rgba(249, 115, 22, 0.3)',
    description: 'Caps on aggregate financial exposure and waivers of consequential damages.',
    typicalVendorTrap: 'Extreme low caps (e.g., 1 month of fees) or complete waiver of indirect damages for vendor only.'
  },
  TERMINATION: {
    id: 'TERMINATION',
    label: 'Termination & Auto-Renewal',
    shortLabel: 'Termination',
    color: '#EAB308',
    bg: 'rgba(234, 179, 8, 0.12)',
    border: 'rgba(234, 179, 8, 0.3)',
    description: 'Exit rights, convenience termination, and renewal opt-out windows.',
    typicalVendorTrap: 'Evergreen auto-renewal with narrow 15-day notice windows and non-refundable prepayments.'
  },
  IP_RIGHTS: {
    id: 'IP_RIGHTS',
    label: 'Intellectual Property & Ownership',
    shortLabel: 'IP Rights',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    border: 'rgba(236, 72, 153, 0.3)',
    description: 'Ownership of deliverables, customer data, and feedback rights.',
    typicalVendorTrap: 'Broad grant of customer IP, perpetual rights to train AI models on customer data.'
  },
  DATA_PRIVACY: {
    id: 'DATA_PRIVACY',
    label: 'Data Privacy & Breach Notice',
    shortLabel: 'Data & Security',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.3)',
    description: 'Protection of PII, security compliance (SOC 2, GDPR), and breach response.',
    typicalVendorTrap: 'Delayed breach notification (>72 hours), no right to audit security controls.'
  },
  WARRANTIES: {
    id: 'WARRANTIES',
    label: 'Warranties & "As-Is" Disclaimers',
    shortLabel: 'Warranties',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.3)',
    description: 'Guarantees regarding service availability, fitness for purpose, and performance.',
    typicalVendorTrap: 'Complete disclaimer of implied warranties with "sole and exclusive remedy" limited to re-performance.'
  },
  UNILATERAL_CHANGE: {
    id: 'UNILATERAL_CHANGE',
    label: 'Unilateral Modifications',
    shortLabel: 'Unilateral Terms',
    color: '#F43F5E',
    bg: 'rgba(244, 63, 94, 0.12)',
    border: 'rgba(244, 63, 94, 0.3)',
    description: 'Vendor ability to modify pricing, SLA, or terms without customer consent.',
    typicalVendorTrap: 'Updates effective immediately upon posting to website with continued use deemed acceptance.'
  },
  GOVERNING_LAW: {
    id: 'GOVERNING_LAW',
    label: 'Governing Law & Disputes',
    shortLabel: 'Dispute Law',
    color: '#64748B',
    bg: 'rgba(100, 116, 139, 0.12)',
    border: 'rgba(100, 116, 139, 0.3)',
    description: 'Jurisdiction, venue, arbitration clauses, and waiver of jury trials.',
    typicalVendorTrap: 'Foreign exclusive jurisdiction and mandatory arbitration excluding emergency injunctions.'
  },
  PAYMENT: {
    id: 'PAYMENT',
    label: 'Payment & Fees',
    shortLabel: 'Payment',
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.12)',
    border: 'rgba(217, 119, 6, 0.3)',
    description: 'Payment terms, retainers, fee increases, non-refundable prepayments, and payment acceleration.',
    typicalVendorTrap: 'Strictly non-refundable fees, upfront retainers forfeited on delay, and unilateral price increases.'
  }
};

// Patterns and rules reflecting domain-adapted legal transformers
const RISK_PATTERNS = [
  {
    category: 'INDEMNITY',
    patterns: [
      /indemnif(y|ies|ication)|hold\s+harmless|defend\s+and\s+hold/i,
      /sole\s+expense|all\s+claims,\s+damages|attorney('s)?\s+fees/i,
      /without\s+limitation/i
    ],
    spans: [
      { trigger: /shall\s+defend,\s*indemnify\s+and\s+hold\s+harmless\s+vendor[^.;]*/i, weight: 0.96 },
      { trigger: /indemnify\s+and\s+hold\s+harmless[^.;]*/i, weight: 0.91 },
      { trigger: /without\s+limitation\s+reasonable\s+attorneys['']?\s+fees/i, weight: 0.88 },
      { trigger: /at\s+customer['']?s\s+sole\s+cost\s+and\s+expense/i, weight: 0.85 }
    ],
    rationale: 'One-sided customer indemnification creates unbounded financial exposure for vendor-side operational or IP claims.',
    redlineSuggest: (text) => {
      return text.replace(
        /Customer\s+shall\s+defend,\s*indemnify\s+and\s+hold\s+harmless\s+Vendor[^.]*\./gi,
        'Each party ("Indemnifying Party") shall defend, indemnify, and hold harmless the other party from third-party claims arising from gross negligence, willful misconduct, or material breach of this Agreement, subject to the mutual liability caps herein.'
      );
    }
  },
  {
    category: 'LIABILITY_CAP',
    patterns: [
      /limitation\s+of\s+liability|in\s+no\s+event\s+shall|aggregate\s+liability/i,
      /exceed\s+the\s+amount(s)?\s+paid|fees\s+paid\s+in\s+the\s+preceding/i,
      /consequential|indirect|punitive|lost\s+profits/i
    ],
    spans: [
      { trigger: /in\s+no\s+event\s+shall\s+vendor['']?s\s+aggregate\s+liability\s+exceed[^.;]*/i, weight: 0.95 },
      { trigger: /fees\s+paid\s+(by\s+customer\s+)?in\s+the\s+(one|1|three|3|six|6)\s+month(s)?\s+preceding/i, weight: 0.93 },
      { trigger: /exceed\s+(\$0|\$100|\$1,000|the\s+total\s+fees\s+paid\s+hereunder)/i, weight: 0.89 },
      { trigger: /waiver\s+of\s+consequential,\s*indirect\s+or\s+punitive\s+damages/i, weight: 0.82 }
    ],
    rationale: 'Severe aggregate liability caps (e.g. 1-3 months of fees) prevent recovering real damages from major vendor outages or data loss.',
    redlineSuggest: (text) => {
      return text.replace(
        /(fees\s+paid\s+in\s+the\s+(?:preceding\s+)?(?:one|1|three|3)\s+month(?:s)?|one\s+hundred\s+dollars|\$100)/gi,
        'the total fees paid or payable by Customer in the preceding twelve (12) months, or $1,000,000, whichever is greater'
      );
    }
  },
  {
    category: 'TERMINATION',
    patterns: [
      /terminate\s+for\s+convenience|automatic(ally)?\s+renew|renewal\s+term/i,
      /written\s+notice\s+at\s+least|non-refundable|forfeited/i,
      /lock-in|minimum\s+commitment/i
    ],
    spans: [
      { trigger: /automatically\s+renew\s+for\s+successive\s+(one|1|two|2|three|3)[\s-]year\s+periods/i, weight: 0.92 },
      { trigger: /written\s+notice\s+at\s+least\s+(60|90|120)\s+days\s+prior/i, weight: 0.88 },
      { trigger: /all\s+fees\s+paid\s+are\s+strictly\s+non-refundable/i, weight: 0.94 },
      { trigger: /vendor\s+may\s+terminate\s+for\s+convenience\s+upon\s+(five|5|ten|10)\s+days/i, weight: 0.90 }
    ],
    rationale: 'Evergreen auto-renewal with long advance notice periods or non-refundable clauses creates operational lock-in and budget waste.',
    redlineSuggest: (text) => {
      return text.replace(
        /all\s+fees\s+paid\s+are\s+strictly\s+non-refundable/gi,
        'upon termination without cause, Vendor shall promptly issue a pro-rata refund of any prepaid, unearned fees'
      ).replace(
        /at\s+least\s+(60|90|120)\s+days/gi,
        'at least thirty (30) days'
      );
    }
  },
  {
    category: 'IP_RIGHTS',
    patterns: [
      /intellectual\s+property|proprietary\s+rights|work(s)?\s+for\s+hire/i,
      /ownership\s+of\s+deliverables|customer\s+data|feedback|grant\s+of\s+license/i,
      /irrevocable,\s*perpetual,\s*royalty-free/i
    ],
    spans: [
      { trigger: /vendor\s+shall\s+own\s+all\s+right,\s*title\s+and\s+interest\s+in\s+and\s+to\s+deliverables/i, weight: 0.96 },
      { trigger: /irrevocable,\s*perpetual,\s*royalty-free,\s*worldwide\s+license\s+to\s+use/i, weight: 0.91 },
      { trigger: /perpetual\s+right\s+to\s+use\s+customer\s+data\s+for\s+machine\s+learning/i, weight: 0.95 },
      { trigger: /deemed\s+vendor['']?s\s+exclusive\s+property/i, weight: 0.87 }
    ],
    rationale: 'Vendor claims ownership over customer-funded work products and extracts perpetual rights to exploit proprietary customer data.',
    redlineSuggest: (text) => {
      return text.replace(
        /Vendor\s+shall\s+own\s+all\s+right,\s*title\s+and\s+interest\s+in\s+and\s+to\s+all\s+deliverables/gi,
        'Customer shall solely own all right, title, and interest in and to all custom deliverables, while Vendor retains ownership of pre-existing core tools'
      );
    }
  },
  {
    category: 'DATA_PRIVACY',
    patterns: [
      /data\s+protection|personal\s+data|gdpr|breach\s+notification/i,
      /security\s+incident|commercially\s+reasonable\s+efforts|audit\s+rights/i,
      /within\s+\d+\s+business\s+days/i
    ],
    spans: [
      { trigger: /notify\s+customer\s+within\s+(thirty|30|fourteen|14|seven|7)\s+days\s+of\s+confirming\s+a\s+breach/i, weight: 0.94 },
      { trigger: /customer\s+shall\s+have\s+no\s+right\s+to\s+audit/i, weight: 0.92 },
      { trigger: /vendor\s+disclaims\s+all\s+liability\s+for\s+unauthorized\s+access/i, weight: 0.96 }
    ],
    rationale: 'Breach notification windows exceeding 72 hours violate GDPR Article 33 and expose the organization to regulatory fines.',
    redlineSuggest: (text) => {
      return text.replace(
        /within\s+(thirty|30|fourteen|14|seven|7)\s+days/gi,
        'within seventy-two (72) hours'
      );
    }
  },
  {
    category: 'WARRANTIES',
    patterns: [
      /as\s+is|without\s+warranty|merchantability|fitness\s+for\s+a\s+particular/i,
      /sole\s+and\s+exclusive\s+remedy|disclaim(s)?\s+all\s+warranties/i
    ],
    spans: [
      { trigger: /provided\s+strictly\s+["']as\s+is["']\s+and\s+["']as\s+available["']/i, weight: 0.93 },
      { trigger: /disclaims\s+all\s+warranties,\s*(express|implied|statutory)/i, weight: 0.89 },
      { trigger: /customer['']?s\s+sole\s+and\s+exclusive\s+remedy\s+shall\s+be/i, weight: 0.86 }
    ],
    rationale: 'Total "As-Is" disclaimers remove any legal guarantee that the vendor\'s service or software functions according to specifications.',
    redlineSuggest: (text) => {
      return text.replace(
        /provided\s+strictly\s+["']as\s+is["']/gi,
        'Vendor warrants that the Services will perform materially in accordance with applicable documentation and specifications'
      );
    }
  },
  {
    category: 'UNILATERAL_CHANGE',
    patterns: [
      /modify\s+these\s+terms|sole\s+discretion|effective\s+immediately/i,
      /without\s+prior\s+notice|upon\s+posting\s+to\s+website/i
    ],
    spans: [
      { trigger: /reserve(s)?\s+the\s+right\s+to\s+modify\s+these\s+terms\s+at\s+any\s+time/i, weight: 0.95 },
      { trigger: /effective\s+immediately\s+upon\s+posting/i, weight: 0.93 },
      { trigger: /at\s+vendor['']?s\s+sole\s+and\s+absolute\s+discretion/i, weight: 0.89 }
    ],
    rationale: 'Unilateral modification clauses give the vendor power to alter service levels, pricing, or rights mid-contract without approval.',
    redlineSuggest: (text) => {
      return text.replace(
        /Vendor\s+reserves\s+the\s+right\s+to\s+modify\s+these\s+terms\s+at\s+any\s+time[^.]*\./gi,
        'No modification or amendment to this Agreement shall be effective unless made in writing and signed by authorized representatives of both parties.'
      );
    }
  },
  {
    category: 'GOVERNING_LAW',
    patterns: [
      /governing\s+law|jurisdiction|venue|binding\s+arbitration/i,
      /waives\s+any\s+right\s+to\s+jury\s+trial|class\s+action\s+waiver/i
    ],
    spans: [
      { trigger: /exclusive\s+jurisdiction\s+of\s+the\s+courts\s+of\s+foreign[^.;]*/i, weight: 0.88 },
      { trigger: /waives\s+any\s+right\s+to\s+a\s+jury\s+trial/i, weight: 0.82 },
      { trigger: /exclusive\s+venue\s+shall\s+be\s+in\s+the\s+state\s+of\s+delaware/i, weight: 0.75 }
    ],
    rationale: 'Exclusive remote or foreign venue increases litigation costs and disadvantages the customer during contract disputes.',
    redlineSuggest: (text) => {
      return text.replace(
        /exclusive\s+jurisdiction\s+of\s+the\s+courts\s+of\s+[^.]*\./gi,
        'governed by the laws of the State of New York, without regard to conflict of laws principles, with mutual submission to local federal courts.'
      );
    }
  },
  {
    category: 'PAYMENT',
    patterns: [
      /non-refundable|upfront\s+retainer|accelerat(e|ion)|immediately\s+due\s+and\s+payable/i,
      /fees\s+paid\s+are\s+strictly\s+non-refundable|invoicing|payment\s+schedule/i
    ],
    spans: [
      { trigger: /all\s+fees\s+paid\s+are\s+strictly\s+non-refundable\s+under\s+any\s+circumstances/i, weight: 0.95 },
      { trigger: /non-refundable\s+upfront\s+retainer\s+of\s+[^.;]*/i, weight: 0.92 },
      { trigger: /remaining\s+milestones\s+shall\s+accelerate\s+and\s+become\s+immediately\s+due/i, weight: 0.94 }
    ],
    rationale: 'Non-refundable fee clauses and automatic payment acceleration impose severe financial forfeiture even if vendor fails to deliver.',
    redlineSuggest: (text) => {
      return text.replace(
        /all\s+fees\s+paid\s+are\s+strictly\s+non-refundable\s+under\s+any\s+circumstances[^.]*\./gi,
        'Fees paid for uncompleted milestones or degraded services shall be promptly refunded on a pro-rata basis upon termination.'
      ).replace(
        /all\s+remaining\s+milestones\s+shall\s+accelerate\s+and\s+become\s+immediately\s+due\s+and\s+payable/gi,
        'parties shall resolve any project delays in good faith before adjusting milestone schedules'
      );
    }
  }
];

/**
 * Groups analyzed clauses into human legal categories
 */
export function groupClausesByCategory(clauses) {
  const groups = [
    {
      id: 'liabilities',
      shortTitle: 'Liabilities',
      title: 'Liabilities & Indemnity',
      icon: 'Shield',
      color: '#EF4444',
      categories: ['LIABILITY_CAP', 'INDEMNITY'],
      description: 'Liability caps, uncapped indemnification, and consequential damages waivers',
      cuadRefs: ['Indemnification (#37)', 'Cap on Liability (#19)', 'Uncapped Liability (#18)', 'Liquidated Damages (#20)']
    },
    {
      id: 'payment',
      shortTitle: 'Payment & Fees',
      title: 'Payment & Fees',
      icon: 'CreditCard',
      color: '#D97706',
      categories: ['PAYMENT'],
      description: 'Non-refundable upfront retainers, fee accelerations, and billing lock-ins',
      cuadRefs: ['Price Restrictions (#34)', 'Minimum Commitment (#35)', 'Revenue/Profit Sharing (#33)']
    },
    {
      id: 'termination',
      shortTitle: 'Termination',
      title: 'Termination & Auto-Renewal',
      icon: 'Clock',
      color: '#EAB308',
      categories: ['TERMINATION'],
      description: 'Evergreen auto-renewal traps, notice windows, and convenience exits',
      cuadRefs: ['Notice to Terminate Renewal (#7)', 'Termination for Convenience (#38)', 'Renewal Term (#6)']
    },
    {
      id: 'privacy',
      shortTitle: 'Data Privacy',
      title: 'Data Privacy & Security',
      icon: 'Lock',
      color: '#8B5CF6',
      categories: ['DATA_PRIVACY'],
      description: 'Delayed breach reporting (>72h), security audit right denials',
      cuadRefs: ['Audit Rights (#17)', 'Post-Termination Services (#16)']
    },
    {
      id: 'ip',
      shortTitle: 'IP & Ownership',
      title: 'Intellectual Property & Ownership',
      icon: 'Sparkles',
      color: '#EC4899',
      categories: ['IP_RIGHTS'],
      description: 'Work-for-hire forfeitures, deliverables ownership, and customer data use',
      cuadRefs: ['Ownership of IP (#8)', 'License Grant (#9)', 'Irrevocable/Perpetual License (#14)']
    },
    {
      id: 'warranties',
      shortTitle: 'Warranties',
      title: 'Warranties & Disclaimers',
      icon: 'AlertCircle',
      color: '#06B6D4',
      categories: ['WARRANTIES'],
      description: '"As-Is" disclaimers, implied warranty waivers, and exclusive remedy exclusions',
      cuadRefs: ['Warranty Duration (#21)', 'Fitness for Purpose']
    },
    {
      id: 'changes',
      shortTitle: 'Modifications',
      title: 'Unilateral Modifications',
      icon: 'Sliders',
      color: '#F43F5E',
      categories: ['UNILATERAL_CHANGE'],
      description: 'Mid-term modifications to pricing or SLAs without customer consent',
      cuadRefs: ['Change of Control (#31)', 'Anti-Assignment (#32)']
    },
    {
      id: 'disputes',
      shortTitle: 'Disputes & Law',
      title: 'Governing Law & Disputes',
      icon: 'Scale',
      color: '#64748B',
      categories: ['GOVERNING_LAW'],
      description: 'Foreign exclusive venue, mandatory arbitration, and jury trial waivers',
      cuadRefs: ['Governing Law (#40)', 'Covenant Not to Sue (#23)']
    }
  ];

  return groups.map((g) => {
    const matchingClauses = clauses.filter((c) => {
      return c.multiLabels && c.multiLabels.some((lbl) => g.categories.includes(lbl.category));
    });

    const criticalClauses = matchingClauses.filter(
      (c) => c.severity === 'CRITICAL' && c.reviewStatus !== 'MITIGATED'
    );
    const highClauses = matchingClauses.filter(
      (c) => c.severity === 'HIGH' && c.reviewStatus !== 'MITIGATED'
    );
    const mediumClauses = matchingClauses.filter(
      (c) => c.severity === 'MEDIUM' && c.reviewStatus !== 'MITIGATED'
    );
    const flaggedClauses = matchingClauses.filter(
      (c) => (c.severity === 'CRITICAL' || c.severity === 'HIGH' || c.severity === 'MEDIUM') && c.reviewStatus !== 'MITIGATED'
    );

    const fixedClauses = matchingClauses.filter((c) => c.reviewStatus === 'MITIGATED');

    const highestSeverity =
      criticalClauses.length > 0
        ? 'CRITICAL'
        : highClauses.length > 0
        ? 'HIGH'
        : mediumClauses.length > 0
        ? 'MEDIUM'
        : fixedClauses.length > 0
        ? 'MITIGATED'
        : 'SAFE';

    return {
      ...g,
      clauses: matchingClauses,
      flaggedCount: flaggedClauses.length,
      criticalCount: criticalClauses.length,
      highCount: highClauses.length,
      mediumCount: mediumClauses.length,
      highestSeverity,
      fixedCount: fixedClauses.length,
      hasRisks: flaggedClauses.length > 0
    };
  });
}

/**
 * Splits contract raw text into numbered, structured clauses/paragraphs
 */
export function segmentContractClauses(rawText) {
  if (!rawText || !rawText.trim()) return [];

  // Split by double newline or numbered section headings (e.g., "1.", "Section 2", "ARTICLE III")
  const rawParagraphs = rawText
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 25);

  return rawParagraphs.map((para, index) => {
    // Detect clause title if available (e.g. "Section 4. Indemnification: ...")
    const titleMatch = para.match(/^(?:(?:Section|Article|Clause)\s*[\d\.\w]+[:\-\s]+)?([A-Z][A-Za-z\s,\/&]{3,40})(?:\:|\.|\—|\n)/);
    let title = titleMatch ? titleMatch[1].trim() : `Clause ${index + 1}`;
    if (title.length > 35) {
      title = `Clause ${index + 1}`;
    }

    return {
      id: `clause-${index + 1}`,
      number: index + 1,
      title: title,
      text: para,
      originalText: para,
      reviewed: false,
      reviewStatus: 'NEEDS_REVIEW' // 'NEEDS_REVIEW' | 'MITIGATED' | 'ACCEPTED_RISK'
    };
  });
}

/**
 * Performs Multi-Label Classification & Token Span Extraction on a single clause
 */
export function analyzeClause(clause) {
  const text = clause.text;
  const labels = [];
  const spans = [];
  let maxSeverityScore = 0;
  let recommendedRewrite = null;
  let legalRationale = '';

  RISK_PATTERNS.forEach((rule) => {
    let matchCount = 0;
    let confidenceBase = 0.5;

    // Test primary category triggers
    rule.patterns.forEach((pattern) => {
      if (pattern.test(text)) {
        matchCount++;
      }
    });

    if (matchCount > 0) {
      // Find exact explainable risk spans
      const matchedSpans = [];
      rule.spans.forEach((spanRule) => {
        const match = text.match(spanRule.trigger);
        if (match) {
          matchedSpans.push({
            text: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            attentionWeight: spanRule.weight,
            category: rule.category
          });
        }
      });

      // Compute multi-label confidence score
      const confidence = Math.min(
        0.98,
        0.65 + matchCount * 0.08 + (matchedSpans.length > 0 ? 0.12 : 0)
      );

      // Determine severity based on category and confidence
      let severity = 'LOW';
      let sevScore = 1;
      if (['INDEMNITY', 'LIABILITY_CAP', 'IP_RIGHTS'].includes(rule.category)) {
        if (confidence >= 0.85) {
          severity = 'CRITICAL';
          sevScore = 4;
        } else {
          severity = 'HIGH';
          sevScore = 3;
        }
      } else if (['TERMINATION', 'DATA_PRIVACY', 'UNILATERAL_CHANGE'].includes(rule.category)) {
        if (confidence >= 0.80) {
          severity = 'HIGH';
          sevScore = 3;
        } else {
          severity = 'MEDIUM';
          sevScore = 2;
        }
      } else {
        severity = confidence >= 0.75 ? 'MEDIUM' : 'LOW';
        sevScore = confidence >= 0.75 ? 2 : 1;
      }

      if (sevScore > maxSeverityScore) {
        maxSeverityScore = sevScore;
      }

      labels.push({
        category: rule.category,
        label: RISK_CATEGORIES[rule.category].label,
        shortLabel: RISK_CATEGORIES[rule.category].shortLabel,
        color: RISK_CATEGORIES[rule.category].color,
        confidence: Number(confidence.toFixed(2)),
        severity: severity,
        matchedSpansCount: matchedSpans.length
      });

      matchedSpans.forEach((s) => spans.push(s));

      if (!recommendedRewrite) {
        recommendedRewrite = rule.redlineSuggest(text);
        legalRationale = rule.rationale;
      }
    }
  });

  // Assign overall clause severity
  let overallSeverity = 'SAFE';
  if (maxSeverityScore === 4) overallSeverity = 'CRITICAL';
  else if (maxSeverityScore === 3) overallSeverity = 'HIGH';
  else if (maxSeverityScore === 2) overallSeverity = 'MEDIUM';
  else if (maxSeverityScore === 1) overallSeverity = 'LOW';

  // If no redline was generated, default to original
  if (!recommendedRewrite || recommendedRewrite === text) {
    recommendedRewrite = text;
  }

  // Deduplicate and sort spans by start index
  spans.sort((a, b) => a.startIndex - b.startIndex);

  return {
    ...clause,
    severity: overallSeverity,
    riskScore: maxSeverityScore * 25, // 0 - 100
    multiLabels: labels,
    explainableSpans: spans,
    legalRationale: legalRationale || 'No adverse risk triggers detected. Standard contractual boilerplate.',
    suggestedRedline: recommendedRewrite,
    needsReview: ['CRITICAL', 'HIGH'].includes(overallSeverity),
    reviewStatus: ['CRITICAL', 'HIGH', 'MEDIUM'].includes(overallSeverity) ? 'NEEDS_REVIEW' : 'VERIFIED_SAFE'
  };
}

/**
 * Computes deep analytics across all analyzed clauses in the contract
 */
export function computeContractAnalytics(clauses) {
  const total = clauses.length;
  if (total === 0) {
    return {
      overallScore: 0,
      grade: 'A',
      riskLevel: 'LOW',
      totalClauses: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      safeCount: 0,
      needsReviewCount: 0,
      mitigatedCount: 0,
      categoryDistribution: {},
      benchmarkComparison: [],
      hoursSavedEstimate: 0,
      multiLabelOverlapCount: 0
    };
  }

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let safeCount = 0;
  let needsReviewCount = 0;
  let mitigatedCount = 0;
  let multiLabelOverlapCount = 0;

  const categoryDistribution = {};
  Object.keys(RISK_CATEGORIES).forEach((cat) => {
    categoryDistribution[cat] = {
      ...RISK_CATEGORIES[cat],
      count: 0,
      criticals: 0,
      avgConfidence: 0
    };
  });

  clauses.forEach((c) => {
    if (c.severity === 'CRITICAL') criticalCount++;
    else if (c.severity === 'HIGH') highCount++;
    else if (c.severity === 'MEDIUM') mediumCount++;
    else safeCount++;

    if (c.reviewStatus === 'NEEDS_REVIEW') needsReviewCount++;
    if (c.reviewStatus === 'MITIGATED') mitigatedCount++;

    if (c.multiLabels && c.multiLabels.length > 1) {
      multiLabelOverlapCount++;
    }

    if (c.multiLabels) {
      c.multiLabels.forEach((label) => {
        if (categoryDistribution[label.category]) {
          categoryDistribution[label.category].count++;
          if (label.severity === 'CRITICAL') {
            categoryDistribution[label.category].criticals++;
          }
        }
      });
    }
  });

  // Calculate Weighted Risk Score (0 = Clean/Safe, 100 = Critical Toxic Contract)
  // Higher weight on unresolved critical & high clauses
  const activeCritical = clauses.filter((c) => c.severity === 'CRITICAL' && c.reviewStatus !== 'MITIGATED').length;
  const activeHigh = clauses.filter((c) => c.severity === 'HIGH' && c.reviewStatus !== 'MITIGATED').length;
  const activeMedium = clauses.filter((c) => c.severity === 'MEDIUM' && c.reviewStatus !== 'MITIGATED').length;

  const rawScore = Math.min(
    100,
    Math.round(
      (activeCritical * 30 + activeHigh * 18 + activeMedium * 7) / Math.max(1, total * 0.35)
    )
  );

  let grade = 'A';
  let riskLevel = 'LOW';
  if (rawScore >= 75) {
    grade = 'F';
    riskLevel = 'CRITICAL';
  } else if (rawScore >= 55) {
    grade = 'D';
    riskLevel = 'HIGH';
  } else if (rawScore >= 35) {
    grade = 'C';
    riskLevel = 'MODERATE';
  } else if (rawScore >= 18) {
    grade = 'B';
    riskLevel = 'BALANCED';
  } else {
    grade = 'A';
    riskLevel = 'MINIMAL';
  }

  // Benchmark against Enterprise Fortune 500 Market Standard
  const benchmarkComparison = [
    {
      domain: 'Indemnity Exposure',
      thisContract: Math.min(100, categoryDistribution.INDEMNITY.count * 35),
      marketStandard: 25,
      status: categoryDistribution.INDEMNITY.criticals > 0 ? 'HIGH_EXPOSURE' : 'ACCEPTABLE'
    },
    {
      domain: 'Liability Protection',
      thisContract: Math.min(100, categoryDistribution.LIABILITY_CAP.count * 30),
      marketStandard: 30,
      status: categoryDistribution.LIABILITY_CAP.criticals > 0 ? 'HIGH_EXPOSURE' : 'ACCEPTABLE'
    },
    {
      domain: 'Data & Privacy Terms',
      thisContract: Math.min(100, categoryDistribution.DATA_PRIVACY.count * 25),
      marketStandard: 20,
      status: categoryDistribution.DATA_PRIVACY.criticals > 0 ? 'HIGH_EXPOSURE' : 'ACCEPTABLE'
    },
    {
      domain: 'Termination Flexibility',
      thisContract: Math.min(100, categoryDistribution.TERMINATION.count * 30),
      marketStandard: 15,
      status: categoryDistribution.TERMINATION.count > 1 ? 'RESTRICTIVE' : 'ACCEPTABLE'
    },
    {
      domain: 'IP Ownership Safety',
      thisContract: Math.min(100, categoryDistribution.IP_RIGHTS.count * 40),
      marketStandard: 10,
      status: categoryDistribution.IP_RIGHTS.criticals > 0 ? 'HIGH_EXPOSURE' : 'ACCEPTABLE'
    }
  ];

  // Estimated paralegal review time saved (e.g. 15 min per clause)
  const hoursSavedEstimate = Number(((total * 12) / 60).toFixed(1));

  return {
    overallScore: rawScore,
    grade,
    riskLevel,
    totalClauses: total,
    criticalCount,
    highCount,
    mediumCount,
    safeCount,
    needsReviewCount,
    mitigatedCount,
    multiLabelOverlapCount,
    categoryDistribution,
    benchmarkComparison,
    hoursSavedEstimate
  };
}
