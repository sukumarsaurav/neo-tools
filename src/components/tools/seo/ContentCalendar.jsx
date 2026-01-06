import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const ContentCalendar = () => {
    const [keywords, setKeywords] = useState('');
    const [frequency, setFrequency] = useState('weekly');
    const [contentTypes, setContentTypes] = useState(['blog']);
    const [duration, setDuration] = useState(3);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [calendar, setCalendar] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'content-calendar').slice(0, 3);

    const contentTypeOptions = [
        { id: 'blog', label: '📝 Blog Post', icon: '📝' },
        { id: 'video', label: '🎬 Video', icon: '🎬' },
        { id: 'infographic', label: '📊 Infographic', icon: '📊' },
        { id: 'podcast', label: '🎙️ Podcast', icon: '🎙️' },
        { id: 'guide', label: '📖 Ultimate Guide', icon: '📖' },
        { id: 'case-study', label: '📋 Case Study', icon: '📋' }
    ];

    const contentIdeas = {
        blog: ['How to', 'Ultimate Guide to', 'X Tips for', 'Best Practices for', 'Complete Guide to', 'X Mistakes to Avoid in'],
        video: ['Tutorial:', 'Quick Tips:', 'Behind the Scenes:', 'Explainer:', 'Review:', 'Interview about'],
        infographic: ['Statistics:', 'Timeline of', 'Comparison:', 'Process:', 'Checklist:', 'Facts about'],
        podcast: ['Discussion:', 'Expert Talk:', 'Q&A about', 'Deep Dive:', 'Interview with', 'Trends in'],
        guide: ['The Complete Guide to', 'Everything You Need to Know About', 'Master', 'From Zero to Hero:'],
        'case-study': ['How We Achieved', 'Success Story:', 'Results from', 'Lessons from']
    };

    const toggleContentType = (type) => {
        if (contentTypes.includes(type)) {
            if (contentTypes.length > 1) {
                setContentTypes(contentTypes.filter(t => t !== type));
            }
        } else {
            setContentTypes([...contentTypes, type]);
        }
    };

    const generateCalendar = () => {
        const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
        if (keywordList.length === 0) {
            alert('Please enter at least one keyword');
            return;
        }

        const entries = [];
        const start = new Date(startDate);
        let currentDate = new Date(start);
        const endDate = new Date(start);
        endDate.setMonth(endDate.getMonth() + duration);

        const intervalDays = frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30;

        let typeIndex = 0;
        let keywordIndex = 0;

        while (currentDate < endDate) {
            const contentType = contentTypes[typeIndex % contentTypes.length];
            const keyword = keywordList[keywordIndex % keywordList.length];
            const ideaTemplates = contentIdeas[contentType] || contentIdeas.blog;
            const ideaTemplate = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)];

            entries.push({
                date: new Date(currentDate).toISOString().split('T')[0],
                dayOfWeek: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
                contentType,
                keyword,
                title: `${ideaTemplate} ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`,
                status: 'planned'
            });

            currentDate.setDate(currentDate.getDate() + intervalDays);
            typeIndex++;
            keywordIndex++;
        }

        setCalendar(entries);
    };

    const exportCSV = () => {
        if (!calendar) return;
        const headers = ['Date', 'Day', 'Type', 'Keyword', 'Title', 'Status'];
        const csv = [
            headers.join(','),
            ...calendar.map(e => [
                e.date,
                e.dayOfWeek,
                e.contentType,
                `"${e.keyword}"`,
                `"${e.title}"`,
                e.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content-calendar.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportJSON = () => {
        if (!calendar) return;
        const data = {
            settings: { keywords: keywords.split(',').map(k => k.trim()), frequency, contentTypes, duration, startDate },
            entries: calendar
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content-calendar.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const getTypeIcon = (type) => {
        const option = contentTypeOptions.find(o => o.id === type);
        return option ? option.icon : '📝';
    };

    const groupByMonth = (entries) => {
        const groups = {};
        entries.forEach(entry => {
            const monthKey = entry.date.substring(0, 7);
            if (!groups[monthKey]) groups[monthKey] = [];
            groups[monthKey].push(entry);
        });
        return groups;
    };

    const faqs = [
        { question: 'Why do I need a content calendar?', answer: 'A content calendar helps you plan consistently, target keywords strategically, diversify content types, and maintain a regular publishing schedule for better SEO results.' },
        { question: 'How often should I publish content?', answer: 'Quality over quantity. For most sites, 1-4 high-quality posts per week is ideal. New sites may benefit from more frequent publishing initially.' },
        { question: 'How far ahead should I plan?', answer: 'Plan 3-6 months ahead for strategic content. This allows time for research, creation, and seasonal content planning.' }
    ];

    const seoContent = (<><h2>Content Calendar Planner</h2><p>Plan your content strategy with a structured publishing calendar. Generate content ideas based on your target keywords and preferred content types for consistent SEO growth.</p></>);

    return (
        <ToolLayout title="Content Calendar Planner" description="Plan your content strategy with a publishing calendar. Generate content ideas and export to CSV." keywords={['content calendar', 'content planning', 'editorial calendar', 'SEO content', 'blog planner']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="calendar-container">
                <div className="calendar-form">
                    <div className="form-group">
                        <label className="form-label">Target Keywords (comma-separated)</label>
                        <textarea className="form-input" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="SEO tips, content marketing, keyword research, link building, technical SEO" rows={3} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Publishing Frequency</label>
                            <select className="form-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Duration (months)</label>
                            <select className="form-select" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>
                                <option value="1">1 month</option>
                                <option value="3">3 months</option>
                                <option value="6">6 months</option>
                                <option value="12">12 months</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Content Types</label>
                        <div className="content-types">
                            {contentTypeOptions.map(option => (
                                <button key={option.id} className={`type-btn ${contentTypes.includes(option.id) ? 'active' : ''}`} onClick={() => toggleContentType(option.id)}>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={generateCalendar}>📅 Generate Calendar</button>
                </div>

                {calendar && (
                    <div className="calendar-output">
                        <div className="calendar-header">
                            <div>
                                <h3>Your Content Calendar</h3>
                                <p className="calendar-meta">{calendar.length} content pieces planned over {duration} months</p>
                            </div>
                            <div className="export-btns">
                                <button className="btn-export" onClick={exportCSV}>📄 Export CSV</button>
                                <button className="btn-export" onClick={exportJSON}>{ } Export JSON</button>
                            </div>
                        </div>

                        <div className="calendar-stats">
                            <div className="stat">
                                <span className="stat-value">{calendar.length}</span>
                                <span className="stat-label">Total Posts</span>
                            </div>
                            {contentTypes.map(type => (
                                <div key={type} className="stat">
                                    <span className="stat-value">{calendar.filter(c => c.contentType === type).length}</span>
                                    <span className="stat-label">{getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                </div>
                            ))}
                        </div>

                        {Object.entries(groupByMonth(calendar)).map(([month, entries]) => (
                            <div key={month} className="calendar-month">
                                <h4>{new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                                <div className="calendar-entries">
                                    {entries.map((entry, idx) => (
                                        <div key={idx} className="calendar-entry">
                                            <div className="entry-date">
                                                <span className="date-day">{new Date(entry.date).getDate()}</span>
                                                <span className="date-weekday">{entry.dayOfWeek.substring(0, 3)}</span>
                                            </div>
                                            <div className="entry-content">
                                                <div className="entry-type">{getTypeIcon(entry.contentType)} {entry.contentType}</div>
                                                <div className="entry-title">{entry.title}</div>
                                                <div className="entry-keyword">🔑 {entry.keyword}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .calendar-container { max-width: 900px; margin: 0 auto; }
                .calendar-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-md, 16px); }
                .form-input, .form-select { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; }
                .content-types { display: flex; flex-wrap: wrap; gap: var(--spacing-sm, 10px); margin-top: var(--spacing-xs, 8px); }
                .type-btn { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: white; border: 2px solid var(--platinum, #e0e0e0); border-radius: 20px; cursor: pointer; font-size: var(--text-sm, 14px); transition: all 0.2s; }
                .type-btn:hover { border-color: var(--yinmn-blue, #485696); }
                .type-btn.active { background: var(--yinmn-blue, #485696); color: white; border-color: var(--yinmn-blue, #485696); }
                .calendar-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .calendar-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); }
                .calendar-header h3 { margin: 0; }
                .calendar-meta { color: var(--text-muted, #666); font-size: var(--text-sm, 14px); margin-top: 4px; }
                .export-btns { display: flex; gap: var(--spacing-sm, 8px); }
                .btn-export { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); cursor: pointer; }
                .btn-export:hover { background: var(--platinum, #e0e0e0); }
                .calendar-stats { display: flex; flex-wrap: wrap; gap: var(--spacing-md, 16px); padding: var(--spacing-md, 16px); background: linear-gradient(135deg, #667eea15, #764ba215); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-lg, 24px); }
                .stat { text-align: center; min-width: 100px; }
                .stat-value { display: block; font-size: 1.8rem; font-weight: 700; color: var(--yinmn-blue, #485696); }
                .stat-label { font-size: var(--text-sm, 13px); color: var(--text-muted, #666); }
                .calendar-month { margin-bottom: var(--spacing-xl, 32px); }
                .calendar-month h4 { font-size: 1.2rem; margin-bottom: var(--spacing-md, 16px); padding-bottom: var(--spacing-xs, 8px); border-bottom: 2px solid var(--yinmn-blue, #485696); }
                .calendar-entries { display: flex; flex-direction: column; gap: var(--spacing-sm, 12px); }
                .calendar-entry { display: flex; gap: var(--spacing-md, 16px); padding: var(--spacing-md, 16px); background: var(--bg-secondary, #f9f9f9); border-radius: var(--radius, 8px); transition: all 0.2s; }
                .calendar-entry:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); transform: translateX(4px); }
                .entry-date { display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 60px; padding: var(--spacing-sm, 10px); background: var(--yinmn-blue, #485696); color: white; border-radius: var(--radius, 6px); }
                .date-day { font-size: 1.5rem; font-weight: 700; }
                .date-weekday { font-size: var(--text-xs, 11px); text-transform: uppercase; }
                .entry-content { flex: 1; }
                .entry-type { font-size: var(--text-sm, 13px); color: var(--text-muted, #666); margin-bottom: 4px; text-transform: capitalize; }
                .entry-title { font-weight: 600; font-size: 1rem; margin-bottom: 4px; }
                .entry-keyword { font-size: var(--text-sm, 13px); color: var(--yinmn-blue, #485696); }
                @media (max-width: 768px) {
                    .form-row { grid-template-columns: 1fr; }
                    .calendar-header { flex-direction: column; }
                    .calendar-entry { flex-direction: column; }
                    .entry-date { flex-direction: row; gap: var(--spacing-sm, 8px); }
                }
            `}</style>
        </ToolLayout>
    );
};

export default ContentCalendar;
