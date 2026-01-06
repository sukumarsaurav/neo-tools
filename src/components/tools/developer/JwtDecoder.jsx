import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const JwtDecoder = () => {
    const [jwt, setJwt] = useState('');
    const [decoded, setDecoded] = useState(null);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'jwt-decoder').slice(0, 3);

    // Base64URL decode function
    const base64UrlDecode = (str) => {
        // Replace URL-safe characters
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad with '=' to make length multiple of 4
        while (base64.length % 4) base64 += '=';
        try {
            return decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
        } catch (e) {
            return atob(base64);
        }
    };

    // Decode JWT
    const decode = () => {
        setError('');
        setDecoded(null);
        setTimeLeft(null);

        if (!jwt.trim()) {
            setError('Please enter a JWT token');
            return;
        }

        const parts = jwt.trim().split('.');
        if (parts.length !== 3) {
            setError('Invalid JWT format. JWT must have 3 parts separated by dots.');
            return;
        }

        try {
            const header = JSON.parse(base64UrlDecode(parts[0]));
            const payload = JSON.parse(base64UrlDecode(parts[1]));
            const signature = parts[2];

            // Calculate expiry info
            let expiryInfo = null;
            if (payload.exp) {
                const expDate = new Date(payload.exp * 1000);
                const now = new Date();
                const diff = expDate - now;
                expiryInfo = {
                    expDate: expDate.toLocaleString(),
                    isExpired: diff < 0,
                    diffMs: diff
                };
            }

            // Calculate issued at info
            let issuedInfo = null;
            if (payload.iat) {
                issuedInfo = new Date(payload.iat * 1000).toLocaleString();
            }

            setDecoded({
                header,
                payload,
                signature,
                expiryInfo,
                issuedInfo,
                headerRaw: parts[0],
                payloadRaw: parts[1]
            });
        } catch (e) {
            setError('Failed to decode JWT: ' + e.message);
        }
    };

    // Update countdown timer
    useEffect(() => {
        if (!decoded?.expiryInfo || decoded.expiryInfo.isExpired) return;

        const updateTimer = () => {
            const now = new Date();
            const expDate = new Date(decoded.payload.exp * 1000);
            const diff = expDate - now;

            if (diff <= 0) {
                setTimeLeft('Expired');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            let timeStr = '';
            if (days > 0) timeStr += `${days}d `;
            if (hours > 0 || days > 0) timeStr += `${hours}h `;
            if (minutes > 0 || hours > 0 || days > 0) timeStr += `${minutes}m `;
            timeStr += `${seconds}s`;

            setTimeLeft(timeStr);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [decoded]);

    const copy = (text, label) => {
        navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
        // Could use toast here in future
    };

    const formatJson = (obj) => JSON.stringify(obj, null, 2);

    const sampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4S5H_YWOgQ5K5N5kPwqzmYaE6QKZR3Xo5VrDj9qsZvM';

    const loadSample = () => {
        setJwt(sampleJwt);
        setDecoded(null);
        setError('');
    };

    const clear = () => {
        setJwt('');
        setDecoded(null);
        setError('');
        setTimeLeft(null);
    };

    const faqs = [
        { question: 'What is a JWT?', answer: 'JSON Web Token (JWT) is a compact, URL-safe token format used for securely transmitting information between parties. It consists of three parts: Header, Payload, and Signature.' },
        { question: 'Is it safe to decode JWT here?', answer: 'Yes! This tool decodes JWT entirely in your browser. No data is sent to any server. However, never share your actual production tokens.' },
        { question: 'What do the claims mean?', answer: 'Common claims: "sub" (subject), "iat" (issued at), "exp" (expiration), "iss" (issuer), "aud" (audience), "nbf" (not before).' }
    ];

    const seoContent = (
        <>
            <h2>JWT Decoder & Validator</h2>
            <p>Decode JSON Web Tokens (JWT) to inspect header, payload, and validate expiration. See claim values and track token expiry with live countdown.</p>
        </>
    );

    return (
        <ToolLayout
            title="JWT Decoder & Validator"
            description="Decode JWT tokens, view header/payload, validate expiry with live countdown"
            keywords={['JWT decoder', 'JWT validator', 'JSON Web Token', 'decode JWT', 'JWT parser']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="jwt-tool">
                <div className="input-section">
                    <label className="form-label">
                        JWT Token
                        <span className="label-actions">
                            <button className="link-btn" onClick={loadSample}>Load Sample</button>
                            <button className="link-btn" onClick={clear}>Clear</button>
                        </span>
                    </label>
                    <textarea
                        className="form-input mono jwt-input"
                        value={jwt}
                        onChange={(e) => setJwt(e.target.value)}
                        placeholder="Paste your JWT token here (eyJhbG...)"
                        rows={4}
                    />
                    <button className="btn btn-primary btn-lg" onClick={decode}>
                        🔓 Decode JWT
                    </button>
                </div>

                {error && <div className="error-box">❌ {error}</div>}

                {decoded && (
                    <div className="decoded-sections">
                        {/* Expiry Status Banner */}
                        {decoded.expiryInfo && (
                            <div className={`expiry-banner ${decoded.expiryInfo.isExpired ? 'expired' : 'valid'}`}>
                                {decoded.expiryInfo.isExpired ? (
                                    <>⚠️ Token Expired on {decoded.expiryInfo.expDate}</>
                                ) : (
                                    <>✅ Valid — Expires in <strong>{timeLeft}</strong> ({decoded.expiryInfo.expDate})</>
                                )}
                            </div>
                        )}

                        {/* Header Section */}
                        <div className="section header-section">
                            <div className="section-header">
                                <h3>📋 Header</h3>
                                <button className="copy-btn" onClick={() => copy(decoded.header, 'Header')}>📋 Copy</button>
                            </div>
                            <div className="section-meta">
                                <span className="tag">Algorithm: <strong>{decoded.header.alg}</strong></span>
                                <span className="tag">Type: <strong>{decoded.header.typ || 'JWT'}</strong></span>
                            </div>
                            <pre className="code-block">{formatJson(decoded.header)}</pre>
                        </div>

                        {/* Payload Section */}
                        <div className="section payload-section">
                            <div className="section-header">
                                <h3>📦 Payload</h3>
                                <button className="copy-btn" onClick={() => copy(decoded.payload, 'Payload')}>📋 Copy</button>
                            </div>
                            <div className="claims-grid">
                                {decoded.issuedInfo && (
                                    <div className="claim">
                                        <span className="claim-key">Issued At (iat)</span>
                                        <span className="claim-value">{decoded.issuedInfo}</span>
                                    </div>
                                )}
                                {decoded.expiryInfo && (
                                    <div className="claim">
                                        <span className="claim-key">Expires (exp)</span>
                                        <span className="claim-value">{decoded.expiryInfo.expDate}</span>
                                    </div>
                                )}
                                {decoded.payload.sub && (
                                    <div className="claim">
                                        <span className="claim-key">Subject (sub)</span>
                                        <span className="claim-value">{decoded.payload.sub}</span>
                                    </div>
                                )}
                                {decoded.payload.iss && (
                                    <div className="claim">
                                        <span className="claim-key">Issuer (iss)</span>
                                        <span className="claim-value">{decoded.payload.iss}</span>
                                    </div>
                                )}
                            </div>
                            <pre className="code-block">{formatJson(decoded.payload)}</pre>
                        </div>

                        {/* Signature Section */}
                        <div className="section signature-section">
                            <div className="section-header">
                                <h3>🔐 Signature</h3>
                                <button className="copy-btn" onClick={() => copy(decoded.signature, 'Signature')}>📋 Copy</button>
                            </div>
                            <p className="signature-note">
                                ⚠️ Signature verification requires the secret key and is done server-side.
                            </p>
                            <pre className="code-block signature-code">{decoded.signature}</pre>
                        </div>

                        {/* Full Token Copy */}
                        <div className="section full-token">
                            <button className="btn btn-secondary" onClick={() => copy(jwt, 'Full Token')}>
                                📋 Copy Full Token
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .jwt-tool {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .input-section {
                    margin-bottom: var(--spacing-lg);
                }

                .form-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                    font-weight: 600;
                }

                .label-actions {
                    display: flex;
                    gap: var(--spacing-md);
                }

                .link-btn {
                    background: none;
                    border: none;
                    color: var(--yinmn-blue);
                    cursor: pointer;
                    font-size: var(--text-sm);
                    text-decoration: underline;
                }

                .link-btn:hover {
                    color: var(--polynesian-blue);
                }

                .jwt-input {
                    width: 100%;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    font-family: var(--font-mono);
                    font-size: var(--text-sm);
                    margin-bottom: var(--spacing-md);
                    resize: vertical;
                }

                .jwt-input:focus {
                    border-color: var(--yinmn-blue);
                    outline: none;
                }

                .error-box {
                    background: rgba(220, 53, 69, 0.1);
                    border: 1px solid var(--error);
                    color: var(--error);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-lg);
                }

                .decoded-sections {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }

                .expiry-banner {
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    font-weight: 500;
                    text-align: center;
                }

                .expiry-banner.valid {
                    background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
                    border: 1px solid var(--success);
                    color: var(--success);
                }

                .expiry-banner.expired {
                    background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05));
                    border: 1px solid var(--error);
                    color: var(--error);
                }

                .section {
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-lg);
                    border-left: 4px solid var(--platinum);
                }

                .header-section {
                    border-left-color: #fc7a1e;
                }

                .payload-section {
                    border-left-color: var(--yinmn-blue);
                }

                .signature-section {
                    border-left-color: #9c27b0;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                }

                .section-header h3 {
                    margin: 0;
                    font-size: var(--text-lg);
                }

                .copy-btn {
                    background: var(--yinmn-blue);
                    color: white;
                    border: none;
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border-radius: var(--radius);
                    cursor: pointer;
                    font-size: var(--text-xs);
                    transition: all 0.2s ease;
                }

                .copy-btn:hover {
                    background: var(--polynesian-blue);
                    transform: translateY(-1px);
                }

                .section-meta {
                    display: flex;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-md);
                    flex-wrap: wrap;
                }

                .tag {
                    background: rgba(72, 86, 150, 0.1);
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border-radius: var(--radius);
                    font-size: var(--text-sm);
                }

                .claims-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-md);
                }

                .claim {
                    background: rgba(255, 255, 255, 0.5);
                    padding: var(--spacing-sm);
                    border-radius: var(--radius);
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .claim-key {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }

                .claim-value {
                    font-weight: 500;
                    font-size: var(--text-sm);
                    word-break: break-all;
                }

                .code-block {
                    background: #1e1e1e;
                    color: #d4d4d4;
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    font-family: var(--font-mono);
                    font-size: var(--text-sm);
                    overflow-x: auto;
                    margin: 0;
                    white-space: pre-wrap;
                    word-break: break-all;
                }

                .signature-note {
                    color: var(--text-muted);
                    font-size: var(--text-sm);
                    margin-bottom: var(--spacing-sm);
                }

                .signature-code {
                    word-break: break-all;
                }

                .full-token {
                    text-align: center;
                    background: transparent;
                    border: none;
                    padding: 0;
                }

                @media (max-width: 640px) {
                    .form-label {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--spacing-xs);
                    }

                    .claims-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </ToolLayout>
    );
};

export default JwtDecoder;
