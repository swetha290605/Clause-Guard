// Realistic Enterprise Vendor Sample Contracts with diverse risk profiles

export const SAMPLE_CONTRACTS = [
  {
    id: 'cloud-saas-msa',
    title: 'Enterprise Cloud SaaS Master Services Agreement',
    vendor: 'ApexCloud Infrastructure Inc.',
    type: 'SaaS Agreement (MSA)',
    expectedRisk: 'HIGH RISK',
    badgeColor: '#EF4444',
    description: 'Aggressive vendor draft with unlimited customer indemnification, 1-month liability cap, and unilateral modification rights.',
    rawText: `MASTER SERVICES AGREEMENT

Section 1. Provision of Services.
Vendor agrees to provide Customer with access to the ApexCloud platform subject to the terms and conditions set forth herein. Services shall be made available on a subscription basis during the agreed Term.

Section 2. Fees and Invoicing.
Customer shall pay all undisputed fees specified in the applicable Order Form within thirty (30) days of the invoice date. All fees paid are strictly non-refundable under any circumstances, even upon early termination or service degradation.

Section 3. Customer Indemnification Obligation.
Customer shall defend, indemnify and hold harmless Vendor, its affiliates, directors, and officers from and against any and all claims, damages, liabilities, costs, and expenses, including without limitation reasonable attorneys' fees, arising out of or related to Customer's use of the Services or alleged infringement of third-party intellectual property.

Section 4. Extreme Limitation of Liability.
In no event shall Vendor's aggregate liability arising out of or related to this Agreement exceed the total fees paid by Customer in the one (1) month preceding the incident giving rise to liability, or $100, whichever is less. Vendor disclaims all liability for consequential, indirect, punitive, or lost profit damages.

Section 5. Warranties and "As-Is" Provision.
The Services, documentation, and all related materials are provided strictly "as is" and "as available". Vendor expressly disclaims all warranties, express, implied, or statutory, including warranties of merchantability and fitness for a particular purpose. Customer's sole and exclusive remedy for defects shall be commercially reasonable attempts at remediation.

Section 6. Term and Automatic Renewal Traps.
This Agreement shall commence on the Effective Date and continue for an initial term of twelve (12) months. Thereafter, this Agreement shall automatically renew for successive one-year periods unless Customer provides written notice of non-renewal at least ninety (90) days prior to the expiration of the then-current term.

Section 7. Unilateral Modification Rights.
Vendor reserves the right to modify these terms, SLA benchmarks, and subscription fees at any time at its sole and absolute discretion. Any modifications shall become effective immediately upon posting to Vendor's public website, and Customer's continued use of the platform shall constitute binding acceptance.

Section 8. Confidentiality and Customer Data.
Each party agrees to hold the other's proprietary information in confidence. However, Customer grants Vendor an irrevocable, perpetual, royalty-free, worldwide license to use Customer Data to train, improve, and benchmark Vendor's generative machine learning models and artificial intelligence algorithms.

Section 9. Governing Law and Exclusive Venue.
This Agreement shall be governed by the laws of the State of Delaware. Any dispute shall be submitted to binding arbitration in Wilmington, Delaware, and Customer hereby waives any right to a jury trial or to participate in class actions.`
  },
  {
    id: 'it-services-sow',
    title: 'IT Professional Services Statement of Work (SOW)',
    vendor: 'GlobalTech Systems Consultancy Ltd.',
    type: 'Consulting & Engineering SOW',
    expectedRisk: 'CRITICAL RISK',
    badgeColor: '#DC2626',
    description: 'High financial exposure draft: customer forfeits deliverable IP, 3-year restrictive covenants, and asymmetric warranty remedies.',
    rawText: `STATEMENT OF WORK & PROFESSIONAL SERVICES AGREEMENT

Article 1. Scope of Work and Deliverables.
Consultant shall render digital transformation engineering and software development services as specified in Exhibit A. All schedules and project milestones represent non-binding estimates only.

Article 2. Forfeiture and Ownership of Deliverables.
Notwithstanding any contrary principle of work-for-hire, Vendor shall own all right, title and interest in and to all deliverables, custom code, architecture diagrams, and software created in the course of performance. Customer is granted only a limited, non-exclusive, revocable license to execute the deliverables internally.

Article 3. Payment Schedule and Retainers.
Customer shall remit a non-refundable upfront retainer of $50,000 prior to project kick-off. In the event Customer halts or delays the project for any reason exceeding five business days, all remaining milestones shall accelerate and become immediately due and payable.

Article 4. Restrictive Covenant and Non-Compete.
During the term of this Agreement and for a period of three (3) years thereafter, Customer shall not directly or indirectly develop, deploy, license, or acquire any software or cloud workflow that competes with or replicates the functionality of Consultant's proprietary delivery methodologies.

Article 5. Disproportionate Indemnity.
Customer shall defend, indemnify and hold harmless Consultant from any third-party claims, regulatory enforcement actions, or data breach liabilities arising from the deployment or operation of the software deliverables, at Customer's sole cost and expense.

Article 6. Limitation of Consultant Liability.
In no event shall Consultant's total liability under this Statement of Work exceed the sum of $1,000. Under no circumstances shall Consultant be liable for lost data, business interruption, or consequential damages resulting from defects in the custom source code delivered hereunder.

Article 7. Termination for Convenience.
Consultant may terminate this Agreement for convenience upon five (5) days prior written notice without penalty or liability. Customer shall have no right to terminate for convenience prior to completion of all billable milestones.

Article 8. Dispute Resolution and Venue.
Any controversy or claim arising out of this SOW shall be resolved by arbitration in Geneva, Switzerland under ICC rules, in the English language, and the costs of arbitration shall be borne entirely by Customer.`
  },
  {
    id: 'vendor-dpa',
    title: 'Enterprise Vendor Data Processing Addendum (DPA)',
    vendor: 'DataStream Analytics Corp.',
    type: 'Data Privacy & Security Addendum',
    expectedRisk: 'HIGH RISK',
    badgeColor: '#F59E0B',
    description: 'Regulatory compliance hazards: 30-day breach notification delay (GDPR breach), waiver of audit rights, and unvetted sub-processors.',
    rawText: `DATA PROCESSING ADDENDUM (DPA)

Section 1. Scope and Processing Roles.
This Addendum governs the processing of Personal Data by Processor on behalf of Controller in connection with the cloud analytics services. Controller warrants that all personal data transferred complies with applicable privacy regulations.

Section 2. Standard of Security and Safeguards.
Processor shall implement commercially reasonable technical and organizational measures to safeguard Personal Data against accidental loss. However, Processor makes no warranty that its cybersecurity controls are impenetrable and disclaims liability for zero-day exploits.

Section 3. Delayed Security Incident and Breach Notification.
In the event of a confirmed security incident or unauthorized acquisition of Personal Data, Processor shall notify Customer within thirty (30) days of confirming a breach and determining that data was exfiltrated. Processor shall have sole discretion in determining whether an incident warrants notification.

Section 4. Sub-processor Appointments.
Customer hereby grants general written authorization for Processor to engage third-party sub-processors worldwide. Processor may replace or add sub-processors at any time without prior written notification to Customer.

Section 5. Denial of Customer Audit Rights.
Customer shall have no right to audit, inspect, or conduct vulnerability penetration testing on Processor's physical facilities, cloud accounts, or security logs. Delivery of a redacted third-party SOC 2 Type II report every two years shall satisfy all verification obligations.

Section 6. Data Return and Deletion.
Upon termination of the Services, Processor shall retain copies of all Customer Personal Data for a period of twelve (12) months in active backups for disaster recovery and operational analytics before initiating routine cryptographic wiping.

Section 7. Allocation of Regulatory Fines.
In the event any supervisory authority levies administrative fines or penalties related to the processing of Personal Data hereunder, Customer agrees to indemnify, defend, and hold harmless Processor for the full amount of such regulatory penalties.`
  },
  {
    id: 'balanced-nda',
    title: 'Standard Balanced Mutual Non-Disclosure Agreement',
    vendor: 'Beacon Point Partners LLC',
    type: 'Mutual NDA',
    expectedRisk: 'LOW / BALANCED',
    badgeColor: '#10B981',
    description: 'Standard, bilateral protective contract with reciprocal confidentiality, mutual obligations, and standard 30-day remedy periods.',
    rawText: `MUTUAL NON-DISCLOSURE AGREEMENT

1. Definition of Confidential Information.
"Confidential Information" means all non-public, proprietary information disclosed by either party ("Disclosing Party") to the other party ("Receiving Party"), whether orally or in writing, that is designated as confidential or reasonably should be understood to be confidential.

2. Standard of Care and Protection.
Each party agrees to protect the Confidential Information of the other party using the same degree of care it uses to protect its own confidential information of like kind, but in no event less than a reasonable degree of care.

3. Exclusions from Confidentiality.
Confidential Information does not include information that: (a) is or becomes publicly known through no breach; (b) was known to Receiving Party prior to disclosure; (c) is independently developed without reference to Confidential Information; or (d) is received from a third party without duty of confidentiality.

4. Term and Duration of Obligations.
This Agreement shall remain in effect for a period of two (2) years from the Effective Date. The confidentiality obligations regarding trade secrets shall survive termination for as long as such information qualifies as a trade secret under applicable law.

5. Permitted Disclosures and Compelled Notice.
Receiving Party may disclose Confidential Information to its employees, contractors, and legal advisors who have a legitimate need to know and are bound by confidentiality obligations at least as restrictive as those herein. In the event of compelled legal process, Receiving Party shall provide prompt written notice to Disclosing Party.

6. Return or Destruction of Materials.
Upon written request by Disclosing Party, Receiving Party shall promptly return or certify destruction of all documents and tangible materials containing Confidential Information, subject to automated system backup cycles.

7. Mutual Remedies and Injunction.
Both parties acknowledge that unauthorized disclosure of Confidential Information may cause irreparable harm for which monetary damages are inadequate. Accordingly, either party shall be entitled to seek injunctive relief in addition to any other remedies available at law.

8. Governing Law and Severability.
This Agreement shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of laws rules. If any provision is held unenforceable, the remaining provisions shall remain in full force and effect.`
  }
];
