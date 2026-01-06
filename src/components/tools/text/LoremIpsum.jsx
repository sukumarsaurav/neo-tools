import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const LoremIpsum = () => {
    const [count, setCount] = useState(3);
    const [type, setType] = useState('paragraphs');
    const [style, setStyle] = useState('classic');
    const [format, setFormat] = useState('plain');
    const [result, setResult] = useState('');
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'lorem-ipsum').slice(0, 3);

    const textStyles = {
        classic: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' '),
        hipster: 'artisan pour-over aesthetic vinyl sustainable farm-to-table mustache brooklyn messenger bag whatever freegan tattooed lomo fixie semiotics polaroid cold-pressed thundercats chartreuse normcore direct trade blue bottle kinfolk subway tile beard squid next level craft beer vexillologist.'.split(' '),
        corporate: 'synergy leverage scalable enterprise solution bandwidth stakeholder paradigm proactive metrics optimize streamline deliverables actionable insights value proposition core competency best practices innovation thought leadership ROI engagement platform ecosystem agile framework implementation strategy benchmark analytics transformation digital alignment integration sustainability ecosystem'.split(' '),
        tech: 'blockchain API microservices kubernetes docker container serverless machine learning artificial intelligence neural network cloud native devops agile scrum deployment pipeline infrastructure automation integration testing CI/CD repository framework library module component interface backend frontend full-stack responsive progressive'.split(' ')
    };

    const generate = () => {
        const n = parseInt(count);
        if (n < 1 || n > 100) {
            toast.warning('Please enter a number between 1 and 100');
            return;
        }

        const loremWords = textStyles[style];
        let output = '';

        const generateSentence = () => {
            const len = Math.floor(Math.random() * 10) + 5;
            const words = [];
            for (let j = 0; j < len; j++) {
                words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
            }
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            return words.join(' ') + '.';
        };

        const generateParagraph = () => {
            const sentences = Math.floor(Math.random() * 4) + 3;
            const para = [];
            for (let i = 0; i < sentences; i++) {
                para.push(generateSentence());
            }
            return para.join(' ');
        };

        if (type === 'words') {
            const words = [];
            for (let i = 0; i < n; i++) {
                words.push(loremWords[i % loremWords.length]);
            }
            output = words.join(' ');
        } else if (type === 'sentences') {
            const sentences = [];
            for (let i = 0; i < n; i++) {
                sentences.push(generateSentence());
            }
            output = sentences.join(' ');
        } else if (type === 'paragraphs') {
            const paragraphs = [];
            for (let p = 0; p < n; p++) {
                paragraphs.push(generateParagraph());
            }
            output = paragraphs.join('\n\n');
        } else if (type === 'list') {
            const items = [];
            for (let i = 0; i < n; i++) {
                items.push(generateSentence());
            }
            output = items.map(item => `• ${item}`).join('\n');
        }

        // Apply format
        if (format === 'html' && type === 'paragraphs') {
            output = output.split('\n\n').map(p => `<p>${p}</p>`).join('\n');
        } else if (format === 'html' && type === 'list') {
            const items = output.split('\n').map(item => `  <li>${item.substring(2)}</li>`).join('\n');
            output = `<ul>\n${items}\n</ul>`;
        } else if (format === 'markdown' && type === 'list') {
            output = output.split('\n').map(item => `- ${item.substring(2)}`).join('\n');
        }

        setResult(output.trim());
        toast.success('Text generated!');
    };

    const faqs = [
        { question: 'What is Lorem Ipsum?', answer: 'Lorem Ipsum is placeholder text used in design and publishing since the 1500s. It helps visualize layouts without meaningful content distracting.' },
        { question: 'Why use Lorem Ipsum?', answer: 'It provides natural-looking text distribution. Using "content here" repeated looks unnatural. Lorem Ipsum mimics real text patterns.' }
    ];

    const seoContent = (<><h2>Lorem Ipsum Generator</h2><p>Generate Lorem Ipsum placeholder text for your designs and mockups. Choose from classic, hipster, corporate, or tech styles.</p></>);

    return (
        <ToolLayout title="Lorem Ipsum Generator" description="Generate Lorem Ipsum placeholder text. Create paragraphs, sentences, or words in different styles." keywords={['Lorem Ipsum generator', 'placeholder text', 'dummy text', 'filler text']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="controls-grid">
                    <div className="form-group">
                        <label className="form-label">Amount</label>
                        <input type="number" className="form-input" value={count} onChange={(e) => setCount(e.target.value)} min="1" max="100" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="paragraphs">Paragraphs</option>
                            <option value="sentences">Sentences</option>
                            <option value="words">Words</option>
                            <option value="list">Bullet List</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Style</label>
                        <select className="form-select" value={style} onChange={(e) => setStyle(e.target.value)}>
                            <option value="classic">📜 Classic Lorem</option>
                            <option value="hipster">🧔 Hipster</option>
                            <option value="corporate">💼 Corporate</option>
                            <option value="tech">💻 Tech</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Format</label>
                        <select className="form-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                            <option value="plain">Plain Text</option>
                            <option value="html">HTML</option>
                            <option value="markdown">Markdown</option>
                        </select>
                    </div>
                </div>

                <button className="btn btn-primary btn-lg generate-btn" onClick={generate}>
                    ✨ Generate
                </button>

                {result && (
                    <div className="result-box">
                        <div className="result-header">
                            <span className="result-title">Generated Text</span>
                            <div className="result-actions">
                                <CopyButton text={result} label="Copy" size="sm" />
                                <DownloadButton content={result} filename={`lorem-${style}.txt`} label="Download" size="sm" />
                                <ClearButton onClear={() => setResult('')} hasContent={true} label="Clear" size="sm" />
                            </div>
                        </div>
                        <textarea className="form-input result-textarea" value={result} readOnly rows={10} />
                    </div>
                )}
            </div>
            <style>{`
                .tool-form { max-width: 700px; margin: 0 auto; }
                .controls-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }
                .form-group { display: flex; flex-direction: column; }
                .form-label {
                    font-weight: 500;
                    margin-bottom: var(--spacing-xs);
                }
                .form-input, .form-select {
                    width: 100%;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    font-size: var(--text-base);
                    transition: border-color 0.2s;
                }
                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                .generate-btn {
                    width: 100%;
                    padding: var(--spacing-md);
                    font-size: var(--text-lg);
                }
                .result-box {
                    margin-top: var(--spacing-lg);
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                }
                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                }
                .result-title {
                    font-weight: 600;
                }
                .result-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .result-textarea {
                    background: white;
                    font-family: ${format === 'html' || format === 'markdown' ? 'var(--font-mono, monospace)' : 'inherit'};
                }
                @media(max-width: 480px) {
                    .controls-grid { grid-template-columns: 1fr; }
                    .result-header { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default LoremIpsum;
