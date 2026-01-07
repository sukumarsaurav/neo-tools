import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { ResultActions } from './shared';

// State code mappings for GSTIN
const STATE_CODES = {
    '01': 'Jammu & Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '05': 'Uttarakhand',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '10': 'Bihar',
    '11': 'Sikkim',
    '12': 'Arunachal Pradesh',
    '13': 'Nagaland',
    '14': 'Manipur',
    '15': 'Mizoram',
    '16': 'Tripura',
    '17': 'Meghalaya',
    '18': 'Assam',
    '19': 'West Bengal',
    '20': 'Jharkhand',
    '21': 'Odisha',
    '22': 'Chhattisgarh',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '25': 'Daman & Diu',
    '26': 'Dadra & Nagar Haveli',
    '27': 'Maharashtra',
    '28': 'Andhra Pradesh (Old)',
    '29': 'Karnataka',
    '30': 'Goa',
    '31': 'Lakshadweep',
    '32': 'Kerala',
    '33': 'Tamil Nadu',
    '34': 'Puducherry',
    '35': 'Andaman & Nicobar Islands',
    '36': 'Telangana',
    '37': 'Andhra Pradesh',
    '38': 'Ladakh',
    '97': 'Other Territory',
    '99': 'Centre Jurisdiction'
};

// PAN Entity type mappings
const PAN_ENTITY_TYPES = {
    'A': 'Association of Persons (AOP)',
    'B': 'Body of Individuals (BOI)',
    'C': 'Company',
    'F': 'Firm/LLP',
    'G': 'Government',
    'H': 'Hindu Undivided Family (HUF)',
    'J': 'Artificial Juridical Person',
    'L': 'Local Authority',
    'P': 'Individual (Person)',
    'T': 'Trust'
};

// Luhn mod 36 characters for GSTIN checksum
const GSTIN_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const PanGstinValidator = () => {
    const [mode, setMode] = useState('pan'); // pan or gstin
    const [input, setInput] = useState('');
    const [batchInput, setBatchInput] = useState('');
    const [showBatch, setShowBatch] = useState(false);
    const [result, setResult] = useState(null);
    const [batchResults, setBatchResults] = useState([]);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'pan-gstin-validator')
        .slice(0, 3);

    // Real-time validation
    useEffect(() => {
        if (input.trim()) {
            if (mode === 'pan') {
                validatePan(input.trim().toUpperCase());
            } else {
                validateGstin(input.trim().toUpperCase());
            }
        } else {
            setResult(null);
        }
    }, [input, mode]);

    // PAN Validation
    const validatePan = (pan) => {
        const errors = [];
        const warnings = [];
        let isValid = true;
        let entityType = null;
        let entityCode = null;

        // Length check
        if (pan.length !== 10) {
            errors.push(`PAN must be exactly 10 characters (current: ${pan.length})`);
            isValid = false;
        }

        if (pan.length >= 10) {
            // Format check: AAAPL1234C
            const panRegex = /^[A-Z]{3}[ABCFGHLJPT][A-Z][0-9]{4}[A-Z]$/;

            if (!panRegex.test(pan)) {
                // Detailed format validation
                if (!/^[A-Z]{3}/.test(pan.slice(0, 3))) {
                    errors.push('First 3 characters must be letters (A-Z)');
                    isValid = false;
                }

                const fourthChar = pan[3];
                if (!/[ABCFGHLJPT]/.test(fourthChar)) {
                    errors.push(`4th character "${fourthChar}" is invalid. Must be one of: A, B, C, F, G, H, J, L, P, T`);
                    isValid = false;
                }

                if (!/[A-Z]/.test(pan[4])) {
                    errors.push('5th character must be a letter (A-Z), typically first letter of surname');
                    isValid = false;
                }

                if (!/[0-9]{4}/.test(pan.slice(5, 9))) {
                    errors.push('Characters 6-9 must be digits (0-9)');
                    isValid = false;
                }

                if (!/[A-Z]/.test(pan[9])) {
                    errors.push('10th character must be a letter (A-Z) - check digit');
                    isValid = false;
                }
            }

            // Extract entity type
            entityCode = pan[3];
            entityType = PAN_ENTITY_TYPES[entityCode] || 'Unknown';
        }

        setResult({
            type: 'pan',
            value: pan,
            isValid,
            errors,
            warnings,
            details: {
                entityCode,
                entityType,
                surnameInitial: pan[4],
                sequenceNumber: pan.slice(5, 9),
                checkDigit: pan[9]
            }
        });
    };

    // GSTIN Validation with Luhn mod 36 checksum
    const validateGstin = (gstin) => {
        const errors = [];
        const warnings = [];
        let isValid = true;
        let stateCode = null;
        let stateName = null;
        let embeddedPan = null;
        let entityNumber = null;

        // Length check
        if (gstin.length !== 15) {
            errors.push(`GSTIN must be exactly 15 characters (current: ${gstin.length})`);
            isValid = false;
        }

        if (gstin.length >= 15) {
            // Format: 22AAAAA0000A1Z5
            const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/;

            // State code validation
            stateCode = gstin.slice(0, 2);
            stateName = STATE_CODES[stateCode];
            if (!stateName) {
                errors.push(`Invalid state code "${stateCode}". Must be between 01-37 or 97, 99`);
                isValid = false;
            }

            // Extract embedded PAN
            embeddedPan = gstin.slice(2, 12);

            // Validate embedded PAN format
            const panCheck = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(embeddedPan);
            if (!panCheck) {
                errors.push('Characters 3-12 must form a valid PAN format');
                isValid = false;
            }

            // Entity number (13th character)
            entityNumber = gstin[12];

            // 14th character must be 'Z'
            if (gstin[13] !== 'Z') {
                errors.push(`14th character must be "Z" (found: "${gstin[13]}")`);
                isValid = false;
            }

            // Checksum validation (Luhn mod 36)
            const calculatedChecksum = calculateGstinChecksum(gstin.slice(0, 14));
            const providedChecksum = gstin[14];

            if (calculatedChecksum !== providedChecksum) {
                errors.push(`Checksum mismatch: Expected "${calculatedChecksum}", got "${providedChecksum}"`);
                isValid = false;
            }
        }

        // PAN entity type from embedded PAN
        const panEntityCode = embeddedPan ? embeddedPan[3] : null;
        const panEntityType = panEntityCode ? PAN_ENTITY_TYPES[panEntityCode] : null;

        setResult({
            type: 'gstin',
            value: gstin,
            isValid,
            errors,
            warnings,
            details: {
                stateCode,
                stateName,
                embeddedPan,
                entityNumber,
                panEntityCode,
                panEntityType,
                checkDigit: gstin[14]
            }
        });
    };

    // Calculate GSTIN checksum using Luhn mod 36
    const calculateGstinChecksum = (gstin14) => {
        let sum = 0;
        for (let i = 0; i < 14; i++) {
            const char = gstin14[i];
            const charValue = GSTIN_CHARS.indexOf(char);
            const factor = (i % 2 === 0) ? 1 : 2;
            let addend = charValue * factor;
            addend = Math.floor(addend / 36) + (addend % 36);
            sum += addend;
        }
        const remainder = sum % 36;
        const checkDigit = (36 - remainder) % 36;
        return GSTIN_CHARS[checkDigit];
    };

    // Batch validation
    const validateBatch = () => {
        const lines = batchInput.split('\n').filter(line => line.trim());
        const results = lines.map(line => {
            const value = line.trim().toUpperCase();
            if (mode === 'pan') {
                // Quick PAN validation
                const panRegex = /^[A-Z]{3}[ABCFGHLJPT][A-Z][0-9]{4}[A-Z]$/;
                const isValid = value.length === 10 && panRegex.test(value);
                return { value, isValid, type: 'pan', entityType: isValid ? PAN_ENTITY_TYPES[value[3]] : null };
            } else {
                // Quick GSTIN validation
                const isValid = value.length === 15 &&
                    STATE_CODES[value.slice(0, 2)] &&
                    value[13] === 'Z' &&
                    calculateGstinChecksum(value.slice(0, 14)) === value[14];
                return {
                    value,
                    isValid,
                    type: 'gstin',
                    stateName: STATE_CODES[value.slice(0, 2)]
                };
            }
        });
        setBatchResults(results);
    };

    // Generate copy text
    const getCopyText = () => {
        if (!result) return '';
        if (result.type === 'pan') {
            return `PAN Validation Result
========================
PAN: ${result.value}
Status: ${result.isValid ? '✓ Valid' : '✗ Invalid'}
Entity Type: ${result.details.entityType}
${result.errors.length > 0 ? '\nErrors:\n' + result.errors.join('\n') : ''}`;
        } else {
            return `GSTIN Validation Result
========================
GSTIN: ${result.value}
Status: ${result.isValid ? '✓ Valid' : '✗ Invalid'}
State: ${result.details.stateName} (${result.details.stateCode})
Embedded PAN: ${result.details.embeddedPan}
Entity Type: ${result.details.panEntityType}
${result.errors.length > 0 ? '\nErrors:\n' + result.errors.join('\n') : ''}`;
        }
    };

    const faqs = [
        {
            question: 'What is a PAN number?',
            answer: 'PAN (Permanent Account Number) is a 10-digit alphanumeric identifier issued by the Income Tax Department. It\'s mandatory for financial transactions like opening bank accounts, buying property, and filing income tax returns.'
        },
        {
            question: 'What does each character in PAN represent?',
            answer: 'PAN format is AAAPL1234C: First 3 chars are alphabetic sequence, 4th char indicates entity type (P=Person, C=Company, etc.), 5th char is first letter of surname/name, next 4 are sequence numbers, last is an alphabetic check digit.'
        },
        {
            question: 'What is a GSTIN?',
            answer: 'GSTIN (Goods and Services Tax Identification Number) is a 15-digit unique identification number assigned to every registered taxpayer under GST. It contains state code, PAN, entity number, and a check digit.'
        },
        {
            question: 'How is GSTIN structured?',
            answer: 'GSTIN format: First 2 digits = State code, Next 10 digits = PAN of the taxpayer, 13th digit = Entity number (1-9 or A-Z), 14th digit is always "Z", 15th digit = Check digit calculated using Luhn mod 36 algorithm.'
        },
        {
            question: 'Can I find out PAN from GSTIN?',
            answer: 'Yes! Characters 3-12 of a GSTIN contain the PAN number of the business or individual. Our validator automatically extracts and displays this information.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is PAN/GSTIN Validator?</h2>
            <p>
                Our PAN and GSTIN Validator instantly checks the format and validity of Indian tax identification
                numbers. It verifies structure, entity types, state codes, and calculates checksums to ensure
                complete accuracy of your tax records.
            </p>

            <h2>PAN Number Format</h2>
            <p>PAN (Permanent Account Number) follows this structure:</p>
            <ul>
                <li><strong>Characters 1-3:</strong> Alphabetic series (AAA to ZZZ)</li>
                <li><strong>Character 4:</strong> Entity type identifier</li>
                <li><strong>Character 5:</strong> First letter of surname/name</li>
                <li><strong>Characters 6-9:</strong> Sequential numbers (0001 to 9999)</li>
                <li><strong>Character 10:</strong> Alphabetic check digit</li>
            </ul>

            <h2>GSTIN Structure</h2>
            <p>GSTIN (GST Identification Number) has 15 characters:</p>
            <ul>
                <li><strong>Digits 1-2:</strong> State code (01 to 37)</li>
                <li><strong>Characters 3-12:</strong> PAN of the entity</li>
                <li><strong>Character 13:</strong> Entity number within state</li>
                <li><strong>Character 14:</strong> Always "Z" (reserved)</li>
                <li><strong>Character 15:</strong> Check digit (Luhn mod 36)</li>
            </ul>

            <h2>Entity Type Codes</h2>
            <ul>
                <li><strong>P:</strong> Individual (Person)</li>
                <li><strong>C:</strong> Company</li>
                <li><strong>H:</strong> Hindu Undivided Family (HUF)</li>
                <li><strong>F:</strong> Firm / Limited Liability Partnership</li>
                <li><strong>T:</strong> Trust</li>
                <li><strong>A:</strong> Association of Persons</li>
                <li><strong>B:</strong> Body of Individuals</li>
                <li><strong>G:</strong> Government</li>
                <li><strong>J:</strong> Artificial Juridical Person</li>
                <li><strong>L:</strong> Local Authority</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="PAN & GSTIN Validator"
            description="Validate Indian PAN and GSTIN numbers instantly. Check format, verify checksums, extract entity types and state codes."
            keywords={['PAN validator', 'GSTIN validator', 'GST number check', 'PAN format check', 'GSTIN checksum', 'tax ID validator']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Mode Toggle */}
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${mode === 'pan' ? 'active' : ''}`}
                        onClick={() => { setMode('pan'); setInput(''); setResult(null); }}
                    >
                        <span className="mode-icon">🆔</span>
                        <span className="mode-text">
                            <strong>PAN Validation</strong>
                            <small>10-character format</small>
                        </span>
                    </button>
                    <button
                        className={`mode-btn ${mode === 'gstin' ? 'active' : ''}`}
                        onClick={() => { setMode('gstin'); setInput(''); setResult(null); }}
                    >
                        <span className="mode-icon">📋</span>
                        <span className="mode-text">
                            <strong>GSTIN Validation</strong>
                            <small>15-character format</small>
                        </span>
                    </button>
                </div>

                {/* Single Input */}
                <div className="input-section">
                    <label className="form-label">
                        Enter {mode === 'pan' ? 'PAN' : 'GSTIN'} Number
                    </label>
                    <input
                        type="text"
                        className={`form-input large-input ${result ? (result.isValid ? 'valid' : 'invalid') : ''}`}
                        value={input}
                        onChange={(e) => setInput(e.target.value.toUpperCase())}
                        placeholder={mode === 'pan' ? 'e.g., ABCPD1234E' : 'e.g., 27AAPFU0939F1ZV'}
                        maxLength={mode === 'pan' ? 10 : 15}
                        style={{ fontFamily: 'monospace', fontSize: '1.5rem', letterSpacing: '2px' }}
                    />
                </div>

                {/* Validation Result */}
                {result && (
                    <div className={`result-box ${result.isValid ? 'valid-result' : 'invalid-result'}`}>
                        <div className="result-header">
                            <span className={`status-badge ${result.isValid ? 'valid' : 'invalid'}`}>
                                {result.isValid ? '✓ Valid' : '✗ Invalid'}
                            </span>
                            <span className="result-type">{mode === 'pan' ? 'PAN' : 'GSTIN'}</span>
                        </div>

                        {/* Errors */}
                        {result.errors.length > 0 && (
                            <div className="errors-list">
                                {result.errors.map((error, i) => (
                                    <div key={i} className="error-item">❌ {error}</div>
                                ))}
                            </div>
                        )}

                        {/* Details */}
                        <div className="details-grid">
                            {mode === 'pan' ? (
                                <>
                                    <div className="detail-item">
                                        <span className="detail-label">Entity Type</span>
                                        <span className="detail-value">{result.details.entityType}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Entity Code</span>
                                        <span className="detail-value">{result.details.entityCode}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Name Initial</span>
                                        <span className="detail-value">{result.details.surnameInitial}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Sequence</span>
                                        <span className="detail-value">{result.details.sequenceNumber}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="detail-item full-width">
                                        <span className="detail-label">State</span>
                                        <span className="detail-value">{result.details.stateName} ({result.details.stateCode})</span>
                                    </div>
                                    <div className="detail-item full-width">
                                        <span className="detail-label">Embedded PAN</span>
                                        <span className="detail-value" style={{ fontFamily: 'monospace' }}>{result.details.embeddedPan}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Entity Type</span>
                                        <span className="detail-value">{result.details.panEntityType}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Entity Number</span>
                                        <span className="detail-value">{result.details.entityNumber}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle={`${mode === 'pan' ? 'PAN' : 'GSTIN'} Validation Result`}
                            shareText={`${mode === 'pan' ? 'PAN' : 'GSTIN'} ${result.value}: ${result.isValid ? 'Valid' : 'Invalid'}`}
                            toolName="pan-gstin-validator"
                        />
                    </div>
                )}

                {/* Batch Validation Toggle */}
                <div className="batch-section">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowBatch(!showBatch)}
                    >
                        {showBatch ? '← Single Validation' : '📋 Batch Validation'}
                    </button>

                    {showBatch && (
                        <div className="batch-content">
                            <label className="form-label">
                                Enter multiple {mode === 'pan' ? 'PAN' : 'GSTIN'} numbers (one per line)
                            </label>
                            <textarea
                                className="form-textarea"
                                value={batchInput}
                                onChange={(e) => setBatchInput(e.target.value.toUpperCase())}
                                placeholder={mode === 'pan'
                                    ? 'ABCPD1234E\nXYZPC5678F\nMNOPH9012G'
                                    : '27AAPFU0939F1ZV\n29AAACH1234L1Z9'
                                }
                                rows={5}
                            />
                            <button className="btn btn-primary" onClick={validateBatch}>
                                Validate All
                            </button>

                            {/* Batch Results */}
                            {batchResults.length > 0 && (
                                <div className="batch-results">
                                    <div className="batch-summary">
                                        <span className="valid-count">✓ {batchResults.filter(r => r.isValid).length} Valid</span>
                                        <span className="invalid-count">✗ {batchResults.filter(r => !r.isValid).length} Invalid</span>
                                    </div>
                                    <div className="batch-list">
                                        {batchResults.map((r, i) => (
                                            <div key={i} className={`batch-item ${r.isValid ? 'valid' : 'invalid'}`}>
                                                <span className="batch-value">{r.value}</span>
                                                <span className="batch-status">{r.isValid ? '✓' : '✗'}</span>
                                                {r.isValid && (
                                                    <span className="batch-info">
                                                        {r.type === 'pan' ? r.entityType : r.stateName}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Examples */}
                <div className="examples-section">
                    <h4>Try Examples</h4>
                    <div className="example-buttons">
                        {mode === 'pan' ? (
                            <>
                                <button className="example-btn" onClick={() => setInput('ABCPD1234E')}>
                                    ABCPD1234E <small>(Individual)</small>
                                </button>
                                <button className="example-btn" onClick={() => setInput('AAACH1234L')}>
                                    AAACH1234L <small>(HUF)</small>
                                </button>
                                <button className="example-btn" onClick={() => setInput('AABCU9603R')}>
                                    AABCU9603R <small>(Company)</small>
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="example-btn" onClick={() => setInput('27AAPFU0939F1ZV')}>
                                    27AAPFU0939F1ZV <small>(Maharashtra)</small>
                                </button>
                                <button className="example-btn" onClick={() => setInput('29AAACH1234L1Z9')}>
                                    29AAACH1234L1Z9 <small>(Karnataka)</small>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .tool-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .mode-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition);
          text-align: left;
          font-family: inherit;
        }

        .mode-btn:hover {
          border-color: var(--yinmn-blue);
        }

        .mode-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
        }

        .mode-icon {
          font-size: 2rem;
        }

        .mode-text {
          display: flex;
          flex-direction: column;
        }

        .mode-text strong {
          color: var(--text-dark);
          font-size: var(--text-base);
        }

        .mode-text small {
          color: var(--text-muted);
          font-size: var(--text-xs);
        }

        .input-section {
          margin-bottom: var(--spacing-xl);
        }

        .large-input {
          text-align: center;
          text-transform: uppercase;
        }

        .large-input.valid {
          border-color: var(--success);
          background: rgba(16, 185, 129, 0.05);
        }

        .large-input.invalid {
          border-color: var(--error);
          background: rgba(239, 68, 68, 0.05);
        }

        .result-box {
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-xl);
        }

        .valid-result {
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid var(--success);
        }

        .invalid-result {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid var(--error);
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .status-badge {
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .status-badge.valid {
          background: var(--success);
          color: white;
        }

        .status-badge.invalid {
          background: var(--error);
          color: white;
        }

        .result-type {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .errors-list {
          margin-bottom: var(--spacing-md);
        }

        .error-item {
          padding: var(--spacing-sm);
          background: rgba(239, 68, 68, 0.1);
          border-radius: var(--radius-sm);
          font-size: var(--text-sm);
          color: var(--error);
          margin-bottom: var(--spacing-xs);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .detail-item {
          background: var(--bg-primary);
          padding: var(--spacing-md);
          border-radius: var(--radius);
        }

        .detail-item.full-width {
          grid-column: span 2;
        }

        .detail-label {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .detail-value {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-dark);
        }

        .batch-section {
          margin-bottom: var(--spacing-xl);
        }

        .batch-content {
          margin-top: var(--spacing-md);
        }

        .form-textarea {
          width: 100%;
          padding: var(--spacing-md);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          font-family: monospace;
          font-size: var(--text-base);
          resize: vertical;
          margin-bottom: var(--spacing-md);
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .batch-results {
          margin-top: var(--spacing-md);
        }

        .batch-summary {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-md);
        }

        .valid-count {
          color: var(--success);
          font-weight: 600;
        }

        .invalid-count {
          color: var(--error);
          font-weight: 600;
        }

        .batch-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .batch-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          margin-bottom: var(--spacing-xs);
        }

        .batch-item.valid {
          border-left: 3px solid var(--success);
        }

        .batch-item.invalid {
          border-left: 3px solid var(--error);
        }

        .batch-value {
          font-family: monospace;
          flex: 1;
        }

        .batch-status {
          font-weight: bold;
        }

        .batch-item.valid .batch-status {
          color: var(--success);
        }

        .batch-item.invalid .batch-status {
          color: var(--error);
        }

        .batch-info {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .examples-section {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
        }

        .examples-section h4 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .example-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .example-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-primary);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          font-family: monospace;
          transition: all var(--transition);
        }

        .example-btn:hover {
          border-color: var(--yinmn-blue);
          background: rgba(72, 86, 150, 0.1);
        }

        .example-btn small {
          display: block;
          font-family: var(--font-primary);
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        @media (max-width: 480px) {
          .mode-toggle {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .detail-item.full-width {
            grid-column: span 1;
          }

          .example-buttons {
            flex-direction: column;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default PanGstinValidator;
