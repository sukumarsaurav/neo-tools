import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const ListSorter = () => {
    const [text, setText] = useState('');
    const [sortType, setSortType] = useState('az');
    const [removeEmpty, setRemoveEmpty] = useState(true);
    const [removeDuplicates, setRemoveDuplicates] = useState(false);
    const [trimItems, setTrimItems] = useState(true);
    const [addNumbers, setAddNumbers] = useState(false);
    const [prefix, setPrefix] = useState('');
    const [suffix, setSuffix] = useState('');
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'list-sorter').slice(0, 3);

    const result = useMemo(() => {
        if (!text.trim()) return { text: '', stats: null };

        let items = text.split('\n');
        const originalCount = items.length;

        // Trim items
        if (trimItems) {
            items = items.map(item => item.trim());
        }

        // Remove empty items
        if (removeEmpty) {
            items = items.filter(item => item !== '');
        }

        // Remove duplicates
        const duplicatesRemoved = removeDuplicates ? items.length - [...new Set(items)].length : 0;
        if (removeDuplicates) {
            items = [...new Set(items)];
        }

        // Sort
        switch (sortType) {
            case 'az':
                items.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
                break;
            case 'za':
                items.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
                break;
            case 'short':
                items.sort((a, b) => a.length - b.length);
                break;
            case 'long':
                items.sort((a, b) => b.length - a.length);
                break;
            case 'random':
                for (let i = items.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [items[i], items[j]] = [items[j], items[i]];
                }
                break;
            case 'reverse':
                items.reverse();
                break;
        }

        // Add prefix/suffix
        if (prefix || suffix) {
            items = items.map(item => `${prefix}${item}${suffix}`);
        }

        // Add numbers
        if (addNumbers) {
            items = items.map((item, idx) => `${idx + 1}. ${item}`);
        }

        return {
            text: items.join('\n'),
            stats: {
                original: originalCount,
                final: items.length,
                duplicatesRemoved
            }
        };
    }, [text, sortType, removeEmpty, removeDuplicates, trimItems, addNumbers, prefix, suffix]);

    const faqs = [
        { question: 'How does sorting work?', answer: 'Enter one item per line. Choose a sort method and the list will be reordered accordingly. A-Z sorts alphabetically ignoring case.' },
        { question: 'Can I add numbers to the list?', answer: 'Yes! Check the "Number items" option to add sequential numbers (1. 2. 3.) before each item.' }
    ];

    const seoContent = (<><h2>List Sorter</h2><p>Sort, shuffle, and organize lists. Sort alphabetically, by length, or randomly. Remove duplicates and empty lines.</p></>);

    return (
        <ToolLayout title="List Sorter" description="Sort lists alphabetically, by length, or randomly. Remove duplicates and format lists." keywords={['list sorter', 'alphabetize list', 'sort text', 'organize list']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Enter list (one item per line)</label>
                    <ClearButton onClear={() => setText('')} hasContent={text.length > 0} size="sm" />
                </div>
                <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Apple&#10;Banana&#10;Cherry&#10;Date&#10;..." />

                <div className="sort-options">
                    <h4 className="section-title">Sort Method</h4>
                    <div className="sort-buttons">
                        <button className={`sort-btn ${sortType === 'az' ? 'active' : ''}`} onClick={() => setSortType('az')}>
                            A → Z
                        </button>
                        <button className={`sort-btn ${sortType === 'za' ? 'active' : ''}`} onClick={() => setSortType('za')}>
                            Z → A
                        </button>
                        <button className={`sort-btn ${sortType === 'short' ? 'active' : ''}`} onClick={() => setSortType('short')}>
                            Short → Long
                        </button>
                        <button className={`sort-btn ${sortType === 'long' ? 'active' : ''}`} onClick={() => setSortType('long')}>
                            Long → Short
                        </button>
                        <button className={`sort-btn ${sortType === 'random' ? 'active' : ''}`} onClick={() => setSortType('random')}>
                            🎲 Shuffle
                        </button>
                        <button className={`sort-btn ${sortType === 'reverse' ? 'active' : ''}`} onClick={() => setSortType('reverse')}>
                            ↕ Reverse
                        </button>
                    </div>
                </div>

                <div className="options-grid">
                    <label className={`option-item ${removeEmpty ? 'active' : ''}`}>
                        <input type="checkbox" checked={removeEmpty} onChange={(e) => setRemoveEmpty(e.target.checked)} />
                        <span>Remove empty lines</span>
                    </label>
                    <label className={`option-item ${removeDuplicates ? 'active' : ''}`}>
                        <input type="checkbox" checked={removeDuplicates} onChange={(e) => setRemoveDuplicates(e.target.checked)} />
                        <span>Remove duplicates</span>
                    </label>
                    <label className={`option-item ${trimItems ? 'active' : ''}`}>
                        <input type="checkbox" checked={trimItems} onChange={(e) => setTrimItems(e.target.checked)} />
                        <span>Trim whitespace</span>
                    </label>
                    <label className={`option-item ${addNumbers ? 'active' : ''}`}>
                        <input type="checkbox" checked={addNumbers} onChange={(e) => setAddNumbers(e.target.checked)} />
                        <span>Number items</span>
                    </label>
                </div>

                <div className="prefix-suffix">
                    <div className="form-group">
                        <label className="form-label">Prefix</label>
                        <input type="text" className="form-input small" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g., - " />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Suffix</label>
                        <input type="text" className="form-input small" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="e.g., ," />
                    </div>
                </div>

                {result.stats && (
                    <div className="stats-bar">
                        <span className="stat-item">
                            📋 {result.stats.original} items → {result.stats.final} items
                        </span>
                        {result.stats.duplicatesRemoved > 0 && (
                            <span className="stat-item removed">
                                🗑️ {result.stats.duplicatesRemoved} duplicates removed
                            </span>
                        )}
                    </div>
                )}

                {result.text && (
                    <div className="result-section">
                        <div className="result-header">
                            <label className="form-label">Sorted List</label>
                            <div className="result-actions">
                                <CopyButton text={result.text} label="Copy" size="sm" />
                                <DownloadButton content={result.text} filename="sorted-list.txt" label="Download" size="sm" />
                            </div>
                        </div>
                        <textarea className="form-input result-textarea" value={result.text} readOnly rows={8} />
                    </div>
                )}
            </div>
            <style>{`
                .tool-form { max-width: 700px; margin: 0 auto; }
                .input-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                }
                .form-input {
                    width: 100%;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    font-size: var(--text-base);
                    transition: border-color 0.2s;
                    resize: vertical;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                .form-input.small {
                    max-width: 150px;
                }
                .sort-options {
                    margin: var(--spacing-lg) 0;
                }
                .section-title {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    margin-bottom: var(--spacing-sm);
                }
                .sort-buttons {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: var(--spacing-sm);
                }
                .sort-btn {
                    padding: var(--spacing-sm);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    background: var(--bg-secondary);
                    cursor: pointer;
                    font-size: var(--text-sm);
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .sort-btn.active {
                    border-color: var(--yinmn-blue);
                    background: rgba(72, 86, 150, 0.1);
                    color: var(--yinmn-blue);
                }
                .sort-btn:hover:not(.active) {
                    border-color: var(--yinmn-blue);
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-md);
                }
                .option-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-sm);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    cursor: pointer;
                    font-size: var(--text-sm);
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }
                .option-item.active {
                    background: rgba(72, 86, 150, 0.1);
                    border-color: var(--yinmn-blue);
                }
                .prefix-suffix {
                    display: flex;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }
                .stats-bar {
                    display: flex;
                    gap: var(--spacing-lg);
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-md);
                    font-size: var(--text-sm);
                }
                .stat-item.removed { color: #22c55e; }
                .result-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                }
                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                }
                .result-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .result-textarea {
                    background: white;
                }
                @media(max-width: 768px) {
                    .sort-buttons { grid-template-columns: repeat(3, 1fr); }
                    .options-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media(max-width: 480px) {
                    .sort-buttons { grid-template-columns: repeat(2, 1fr); }
                    .options-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default ListSorter;
