import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const PasswordGenerator = () => {
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true, excludeSimilar: false });
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState('');
    const [history, setHistory] = useState([]);
    const [mode, setMode] = useState('random'); // 'random' or 'passphrase'
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'password-generator').slice(0, 3);

    // Word list for passphrase
    const words = ['apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'galaxy', 'harbor', 'island', 'jungle',
        'knight', 'lemon', 'mountain', 'night', 'ocean', 'planet', 'queen', 'river', 'sunset', 'thunder',
        'umbrella', 'valley', 'window', 'yellow', 'zebra', 'anchor', 'bridge', 'castle', 'diamond', 'engine',
        'falcon', 'garden', 'horizon', 'ivory', 'jasmine', 'kingdom', 'lantern', 'marble', 'nebula', 'oracle',
        'phoenix', 'quartz', 'rainbow', 'silver', 'tiger', 'universe', 'velvet', 'whisper', 'xenon', 'yogurt'];

    const generate = () => {
        let pwd = '';

        if (mode === 'passphrase') {
            const wordCount = Math.max(3, Math.min(8, Math.floor(length / 4)));
            const selectedWords = [];
            for (let i = 0; i < wordCount; i++) {
                selectedWords.push(words[Math.floor(Math.random() * words.length)]);
            }
            pwd = selectedWords.join('-');
        } else {
            let chars = '';
            if (options.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (options.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
            if (options.numbers) chars += '0123456789';
            if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

            if (options.excludeSimilar) {
                chars = chars.replace(/[0O1lI]/g, '');
            }

            if (!chars) {
                toast.warning('Select at least one character option');
                return;
            }

            for (let i = 0; i < length; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }

        setPassword(pwd);

        // Add to history (keep last 5)
        setHistory(prev => [pwd, ...prev.slice(0, 4)]);

        // Calculate strength
        let score = 0;
        if (pwd.length >= 12) score++;
        if (pwd.length >= 16) score++;
        if (pwd.length >= 20) score++;
        if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^a-zA-Z0-9]/.test(pwd)) score++;

        const strengthLevel = score <= 2 ? 'Weak' : score <= 3 ? 'Moderate' : score <= 4 ? 'Strong' : 'Very Strong';
        setStrength(strengthLevel);
        toast.success('Password generated!');
    };

    const faqs = [
        { question: 'What makes a strong password?', answer: 'Strong passwords are 12+ characters with mixed case, numbers, and symbols. Avoid dictionary words, personal info, and patterns.' },
        { question: 'What is a passphrase?', answer: 'A passphrase uses random words separated by dashes, making it easier to remember while still being secure. Example: "dragon-sunset-ocean"' }
    ];

    const seoContent = (<><h2>Password Generator</h2><p>Generate strong, secure passwords or memorable passphrases. Customize length and character types. Create unique passwords for all your accounts.</p></>);

    const strengthColors = {
        'Weak': '#ef4444',
        'Moderate': '#f59e0b',
        'Strong': '#22c55e',
        'Very Strong': '#3b82f6'
    };

    return (
        <ToolLayout title="Password Generator" description="Generate strong, secure passwords with custom length and character options." keywords={['password generator', 'secure password', 'random password', 'strong password', 'passphrase']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                {/* Mode Toggle */}
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${mode === 'random' ? 'active' : ''}`}
                        onClick={() => setMode('random')}
                    >
                        🔐 Random Password
                    </button>
                    <button
                        className={`mode-btn ${mode === 'passphrase' ? 'active' : ''}`}
                        onClick={() => setMode('passphrase')}
                    >
                        📝 Passphrase
                    </button>
                </div>

                {/* Length Slider */}
                <div className="form-group">
                    <label className="form-label">
                        Length: <span className="length-value">{length}</span>
                    </label>
                    <input
                        type="range"
                        min="8"
                        max="64"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="range-slider"
                    />
                    <div className="range-labels">
                        <span>8</span>
                        <span>64</span>
                    </div>
                </div>

                {/* Options for Random Mode */}
                {mode === 'random' && (
                    <div className="options">
                        <label className="option-item">
                            <input type="checkbox" checked={options.upper} onChange={(e) => setOptions({ ...options, upper: e.target.checked })} />
                            <span className="option-text">Uppercase (A-Z)</span>
                        </label>
                        <label className="option-item">
                            <input type="checkbox" checked={options.lower} onChange={(e) => setOptions({ ...options, lower: e.target.checked })} />
                            <span className="option-text">Lowercase (a-z)</span>
                        </label>
                        <label className="option-item">
                            <input type="checkbox" checked={options.numbers} onChange={(e) => setOptions({ ...options, numbers: e.target.checked })} />
                            <span className="option-text">Numbers (0-9)</span>
                        </label>
                        <label className="option-item">
                            <input type="checkbox" checked={options.symbols} onChange={(e) => setOptions({ ...options, symbols: e.target.checked })} />
                            <span className="option-text">Symbols (!@#$%)</span>
                        </label>
                        <label className="option-item full-width">
                            <input type="checkbox" checked={options.excludeSimilar} onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })} />
                            <span className="option-text">Exclude similar characters (0, O, 1, l, I)</span>
                        </label>
                    </div>
                )}

                <button className="btn btn-primary btn-lg generate-btn" onClick={generate}>
                    🎲 Generate {mode === 'random' ? 'Password' : 'Passphrase'}
                </button>

                {password && (
                    <div className="result-box">
                        <div className="password-display">
                            <code className="password-text">{password}</code>
                            <CopyButton text={password} label="" size="sm" successMessage="Password copied!" />
                        </div>
                        <div className="strength-bar">
                            <div
                                className="strength-fill"
                                style={{
                                    width: `${strength === 'Weak' ? 25 : strength === 'Moderate' ? 50 : strength === 'Strong' ? 75 : 100}%`,
                                    background: strengthColors[strength]
                                }}
                            />
                        </div>
                        <div className="strength-label" style={{ color: strengthColors[strength] }}>
                            {strength === 'Weak' && '⚠️'}
                            {strength === 'Moderate' && '👍'}
                            {strength === 'Strong' && '💪'}
                            {strength === 'Very Strong' && '🔒'}
                            {strength}
                        </div>
                    </div>
                )}

                {/* Password History */}
                {history.length > 1 && (
                    <div className="history-section">
                        <h4 className="section-title">Recent Passwords</h4>
                        <div className="history-list">
                            {history.slice(1).map((pwd, idx) => (
                                <div key={idx} className="history-item">
                                    <code className="history-password">{pwd}</code>
                                    <CopyButton text={pwd} label="" size="sm" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .tool-form { max-width: 500px; margin: 0 auto; }
                .mode-toggle {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }
                .mode-btn {
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    background: var(--bg-secondary);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .mode-btn.active {
                    border-color: var(--yinmn-blue);
                    background: rgba(72, 86, 150, 0.1);
                    color: var(--yinmn-blue);
                }
                .mode-btn:hover:not(.active) {
                    border-color: var(--yinmn-blue);
                }
                .form-group { margin-bottom: var(--spacing-lg); }
                .form-label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: var(--spacing-sm);
                    font-weight: 500;
                }
                .length-value {
                    background: var(--yinmn-blue);
                    color: white;
                    padding: 2px 10px;
                    border-radius: 20px;
                    font-size: var(--text-sm);
                }
                .range-slider {
                    width: 100%;
                    height: 8px;
                    -webkit-appearance: none;
                    background: linear-gradient(to right, #ef4444, #f59e0b, #22c55e, #3b82f6);
                    border-radius: 4px;
                    outline: none;
                }
                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 3px solid var(--yinmn-blue);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
                .range-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    margin-top: var(--spacing-xs);
                }
                .options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }
                .option-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-sm);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .option-item:hover {
                    background: var(--platinum);
                }
                .option-item.full-width {
                    grid-column: span 2;
                }
                .option-text {
                    font-size: var(--text-sm);
                }
                .generate-btn {
                    width: 100%;
                    padding: var(--spacing-md);
                    font-size: var(--text-lg);
                }
                .result-box {
                    margin-top: var(--spacing-lg);
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                }
                .password-display {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-md);
                }
                .password-text {
                    flex: 1;
                    font-size: var(--text-lg);
                    background: white;
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-radius: var(--radius);
                    word-break: break-all;
                    font-family: var(--font-mono, monospace);
                }
                .strength-bar {
                    height: 6px;
                    background: var(--platinum);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: var(--spacing-sm);
                }
                .strength-fill {
                    height: 100%;
                    transition: width 0.3s, background 0.3s;
                }
                .strength-label {
                    text-align: center;
                    font-weight: 600;
                }
                .history-section {
                    margin-top: var(--spacing-xl);
                }
                .section-title {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    margin-bottom: var(--spacing-sm);
                }
                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }
                .history-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                }
                .history-password {
                    flex: 1;
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `}</style>
        </ToolLayout>
    );
};

export default PasswordGenerator;
