import { useState, useCallback, useMemo } from 'react';
import { diffLines, diffWords, diffChars } from 'diff';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const DiffChecker = () => {
    const [leftText, setLeftText] = useState('');
    const [rightText, setRightText] = useState('');
    const [diffMode, setDiffMode] = useState('lines');
    const [showStats, setShowStats] = useState(true);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'diff-checker').slice(0, 3);

    const diffResult = useMemo(() => {
        if (!leftText && !rightText) return null;

        let diff;
        switch (diffMode) {
            case 'words':
                diff = diffWords(leftText, rightText);
                break;
            case 'chars':
                diff = diffChars(leftText, rightText);
                break;
            default:
                diff = diffLines(leftText, rightText);
        }
        return diff;
    }, [leftText, rightText, diffMode]);

    const stats = useMemo(() => {
        if (!diffResult) return null;

        let added = 0, removed = 0, unchanged = 0;

        diffResult.forEach(part => {
            const count = diffMode === 'lines'
                ? part.value.split('\n').filter(Boolean).length
                : part.value.length;

            if (part.added) added += count;
            else if (part.removed) removed += count;
            else unchanged += count;
        });

        return { added, removed, unchanged, total: added + removed + unchanged };
    }, [diffResult, diffMode]);

    const clear = useCallback(() => {
        setLeftText('');
        setRightText('');
    }, []);

    const swap = useCallback(() => {
        const temp = leftText;
        setLeftText(rightText);
        setRightText(temp);
    }, [leftText, rightText]);

    const loadSample = () => {
        setLeftText(`function greet(name) {
    console.log("Hello, " + name);
    return name;
}

const users = ["Alice", "Bob", "Charlie"];

users.forEach(function(user) {
    greet(user);
});`);
        setRightText(`function greet(name, greeting = "Hello") {
    console.log(greeting + ", " + name + "!");
    return { name, greeting };
}

const users = ["Alice", "Bob", "Charlie", "Diana"];

users.forEach((user) => {
    greet(user, "Welcome");
});

// Added logging
console.log("Greeted all users");`);
    };

    const faqs = [
        { question: 'What comparison modes are available?', answer: 'We offer three modes: line-by-line (best for code), word-by-word (for text documents), and character-by-character (for detailed comparison).' },
        { question: 'How are differences highlighted?', answer: 'Added content is shown in green, removed content in red, and unchanged content in normal text color.' },
        { question: 'Can I compare large files?', answer: 'Yes, the tool can handle large texts, though very large files may take a moment to process. We recommend keeping inputs under 100KB for best performance.' }
    ];

    const seoContent = (
        <>
            <h2>Text Diff Checker</h2>
            <p>Compare two texts and visualize the differences. Perfect for code reviews, document versioning, and identifying changes between files.</p>
            <h3>Features</h3>
            <ul>
                <li><strong>Multiple Modes:</strong> Compare by lines, words, or characters</li>
                <li><strong>Visual Highlighting:</strong> Clear color coding for additions and deletions</li>
                <li><strong>Statistics:</strong> See counts of added, removed, and unchanged content</li>
                <li><strong>Swap Function:</strong> Easily reverse the comparison direction</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Text Diff Checker"
            description="Compare two texts and find differences. Visualize changes with line, word, or character comparison."
            keywords={['diff checker', 'text compare', 'code diff', 'compare text', 'find differences']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="controls-bar">
                    <div className="mode-selector">
                        <button
                            className={`mode-btn ${diffMode === 'lines' ? 'active' : ''}`}
                            onClick={() => setDiffMode('lines')}
                        >
                            📝 Lines
                        </button>
                        <button
                            className={`mode-btn ${diffMode === 'words' ? 'active' : ''}`}
                            onClick={() => setDiffMode('words')}
                        >
                            📖 Words
                        </button>
                        <button
                            className={`mode-btn ${diffMode === 'chars' ? 'active' : ''}`}
                            onClick={() => setDiffMode('chars')}
                        >
                            🔤 Characters
                        </button>
                    </div>
                    <div className="action-btns">
                        <button className="link-btn" onClick={loadSample}>Load Sample</button>
                        <button className="btn btn-sm" onClick={swap}>⇄ Swap</button>
                        <button className="btn btn-sm btn-outline" onClick={clear}>🗑️ Clear</button>
                    </div>
                </div>

                <div className="input-grid">
                    <div className="input-section">
                        <label className="form-label">Original Text</label>
                        <textarea
                            className="form-input mono"
                            value={leftText}
                            onChange={(e) => setLeftText(e.target.value)}
                            rows={12}
                            placeholder="Paste original text here..."
                            spellCheck={false}
                        />
                    </div>
                    <div className="input-section">
                        <label className="form-label">Modified Text</label>
                        <textarea
                            className="form-input mono"
                            value={rightText}
                            onChange={(e) => setRightText(e.target.value)}
                            rows={12}
                            placeholder="Paste modified text here..."
                            spellCheck={false}
                        />
                    </div>
                </div>

                {stats && showStats && (
                    <div className="stats-bar">
                        <div className="stat added">
                            <span className="stat-icon">+</span>
                            <span className="stat-value">{stats.added}</span>
                            <span className="stat-label">Added</span>
                        </div>
                        <div className="stat removed">
                            <span className="stat-icon">−</span>
                            <span className="stat-value">{stats.removed}</span>
                            <span className="stat-label">Removed</span>
                        </div>
                        <div className="stat unchanged">
                            <span className="stat-icon">=</span>
                            <span className="stat-value">{stats.unchanged}</span>
                            <span className="stat-label">Unchanged</span>
                        </div>
                        <button
                            className="toggle-stats"
                            onClick={() => setShowStats(false)}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {diffResult && (
                    <div className="diff-output">
                        <div className="diff-header">
                            <h3>Differences</h3>
                            {!showStats && (
                                <button className="link-btn" onClick={() => setShowStats(true)}>
                                    Show Stats
                                </button>
                            )}
                        </div>
                        <div className="diff-content mono">
                            {diffResult.map((part, idx) => (
                                <span
                                    key={idx}
                                    className={`diff-part ${part.added ? 'added' : part.removed ? 'removed' : ''}`}
                                >
                                    {part.value}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {!diffResult && (leftText || rightText) && (
                    <div className="empty-state">
                        Enter text in both fields to see differences
                    </div>
                )}
            </div>

            <style>{`
                .tool-form { max-width: 1200px; margin: 0 auto; }
                .controls-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: var(--spacing-md); }
                .mode-selector { display: flex; gap: var(--spacing-sm); background: var(--ghost-white); padding: var(--spacing-xs); border-radius: var(--radius); }
                .mode-btn { padding: var(--spacing-xs) var(--spacing-md); border: 2px solid transparent; background: transparent; border-radius: var(--radius); font-weight: 500; cursor: pointer; transition: all 0.2s; font-size: var(--text-sm); }
                .mode-btn:hover { background: white; }
                .mode-btn.active { background: white; border-color: var(--yinmn-blue); color: var(--yinmn-blue); }
                .action-btns { display: flex; gap: var(--spacing-sm); align-items: center; }
                .link-btn { background: none; border: none; color: var(--yinmn-blue); cursor: pointer; font-size: var(--text-sm); text-decoration: underline; }
                .btn-sm { padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--text-sm); border-radius: var(--radius); cursor: pointer; border: 2px solid var(--platinum); background: var(--ghost-white); }
                .btn-sm:hover { background: var(--platinum); }
                .btn-outline { background: transparent; }
                .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg); }
                @media (max-width: 768px) { .input-grid { grid-template-columns: 1fr; } }
                .form-label { display: block; font-weight: 600; color: var(--jet); margin-bottom: var(--spacing-sm); }
                .form-input { width: 100%; padding: var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-base); transition: border-color 0.2s; resize: vertical; }
                .form-input:focus { outline: none; border-color: var(--yinmn-blue); }
                .form-input.mono { font-family: var(--font-mono); font-size: var(--text-sm); line-height: 1.5; }
                .stats-bar { display: flex; justify-content: center; gap: var(--spacing-xl); padding: var(--spacing-md); background: var(--ghost-white); border-radius: var(--radius); margin-bottom: var(--spacing-lg); position: relative; }
                .stat { display: flex; align-items: center; gap: var(--spacing-sm); }
                .stat-icon { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 700; font-size: var(--text-sm); }
                .stat.added .stat-icon { background: #dcfce7; color: #16a34a; }
                .stat.removed .stat-icon { background: #fee2e2; color: #dc2626; }
                .stat.unchanged .stat-icon { background: #e5e7eb; color: #6b7280; }
                .stat-value { font-weight: 700; font-size: var(--text-lg); }
                .stat-label { font-size: var(--text-sm); color: var(--dim-gray); }
                .toggle-stats { position: absolute; right: var(--spacing-md); background: none; border: none; color: var(--dim-gray); cursor: pointer; font-size: var(--text-sm); }
                .diff-output { background: white; border: 2px solid var(--platinum); border-radius: var(--radius); overflow: hidden; }
                .diff-header { display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); border-bottom: 1px solid var(--platinum); background: var(--ghost-white); }
                .diff-header h3 { margin: 0; font-size: var(--text-base); }
                .diff-content { padding: var(--spacing-lg); white-space: pre-wrap; word-break: break-word; line-height: 1.6; font-size: var(--text-sm); max-height: 500px; overflow-y: auto; }
                .diff-part { transition: background 0.2s; }
                .diff-part.added { background: #dcfce7; color: #166534; text-decoration: none; }
                .diff-part.removed { background: #fee2e2; color: #991b1b; text-decoration: line-through; }
                .empty-state { text-align: center; padding: var(--spacing-xl); color: var(--dim-gray); background: var(--ghost-white); border-radius: var(--radius); }
                .mono { font-family: var(--font-mono); }
            `}</style>
        </ToolLayout>
    );
};

export default DiffChecker;
