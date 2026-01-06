import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

// Zodiac data
const ZODIAC_SIGNS = [
    { name: 'Capricorn', symbol: '♑', emoji: '🐐', start: [12, 22], end: [1, 19] },
    { name: 'Aquarius', symbol: '♒', emoji: '🌊', start: [1, 20], end: [2, 18] },
    { name: 'Pisces', symbol: '♓', emoji: '🐟', start: [2, 19], end: [3, 20] },
    { name: 'Aries', symbol: '♈', emoji: '🐏', start: [3, 21], end: [4, 19] },
    { name: 'Taurus', symbol: '♉', emoji: '🐂', start: [4, 20], end: [5, 20] },
    { name: 'Gemini', symbol: '♊', emoji: '👯', start: [5, 21], end: [6, 20] },
    { name: 'Cancer', symbol: '♋', emoji: '🦀', start: [6, 21], end: [7, 22] },
    { name: 'Leo', symbol: '♌', emoji: '🦁', start: [7, 23], end: [8, 22] },
    { name: 'Virgo', symbol: '♍', emoji: '👸', start: [8, 23], end: [9, 22] },
    { name: 'Libra', symbol: '♎', emoji: '⚖️', start: [9, 23], end: [10, 22] },
    { name: 'Scorpio', symbol: '♏', emoji: '🦂', start: [10, 23], end: [11, 21] },
    { name: 'Sagittarius', symbol: '♐', emoji: '🏹', start: [11, 22], end: [12, 21] },
];

const CHINESE_ZODIAC = [
    { name: 'Rat', emoji: '🐀' },
    { name: 'Ox', emoji: '🐂' },
    { name: 'Tiger', emoji: '🐅' },
    { name: 'Rabbit', emoji: '🐇' },
    { name: 'Dragon', emoji: '🐉' },
    { name: 'Snake', emoji: '🐍' },
    { name: 'Horse', emoji: '🐴' },
    { name: 'Goat', emoji: '🐐' },
    { name: 'Monkey', emoji: '🐵' },
    { name: 'Rooster', emoji: '🐓' },
    { name: 'Dog', emoji: '🐕' },
    { name: 'Pig', emoji: '🐷' },
];

const getZodiacSign = (month, day) => {
    for (const sign of ZODIAC_SIGNS) {
        const [startMonth, startDay] = sign.start;
        const [endMonth, endDay] = sign.end;

        if (startMonth === endMonth) {
            if (month === startMonth && day >= startDay && day <= endDay) return sign;
        } else if (startMonth > endMonth) {
            // Capricorn case (Dec-Jan)
            if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return sign;
        } else {
            if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return sign;
        }
    }
    return ZODIAC_SIGNS[0];
};

const getChineseZodiac = (year) => {
    const startYear = 1900; // Year of the Rat
    const index = (year - startYear) % 12;
    return CHINESE_ZODIAC[index >= 0 ? index : index + 12];
};

const AgeCalculator = () => {
    const [birthDate, setBirthDate] = useState('');
    const [result, setResult] = useState(null);
    const [countdown, setCountdown] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'typing' && t.id !== 'age-calculator').slice(0, 3);

    // Update countdown every second
    useEffect(() => {
        if (!result) return;

        const interval = setInterval(() => {
            const now = new Date();
            const birth = new Date(birthDate);
            let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());

            if (nextBirthday <= now) {
                nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
            }

            const diff = nextBirthday - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds, nextAge: result.years + 1 });
        }, 1000);

        return () => clearInterval(interval);
    }, [result, birthDate]);

    const calculate = () => {
        if (!birthDate) { alert('Please select birth date'); return; }
        const birth = new Date(birthDate);
        const today = new Date();

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;

        // Zodiac signs
        const zodiac = getZodiacSign(birth.getMonth() + 1, birth.getDate());
        const chineseZodiac = getChineseZodiac(birth.getFullYear());

        // Milestones
        const milestones = [];
        const tenThousandDays = 10000 - totalDays;
        if (tenThousandDays > 0) {
            const date = new Date(today);
            date.setDate(date.getDate() + tenThousandDays);
            milestones.push({ name: '10,000 Days', remaining: tenThousandDays, date: date.toLocaleDateString() });
        }
        const twentyThousandDays = 20000 - totalDays;
        if (twentyThousandDays > 0 && twentyThousandDays < 36500) {
            const date = new Date(today);
            date.setDate(date.getDate() + twentyThousandDays);
            milestones.push({ name: '20,000 Days', remaining: twentyThousandDays, date: date.toLocaleDateString() });
        }

        setResult({
            years, months, days, totalDays, totalWeeks, totalMonths, totalHours,
            zodiac, chineseZodiac, milestones
        });
    };

    const faqs = [
        { question: 'How is age calculated?', answer: 'Age is calculated by subtracting birth date from today, considering years, months, and days separately for accuracy.' },
        { question: 'What is chronological age?', answer: 'Chronological age is your actual age based on birth date, as opposed to biological age which reflects health and fitness.' }
    ];

    const seoContent = (<><h2>Age Calculator</h2><p>Calculate your exact age with zodiac signs, birthday countdown, and life milestones.</p></>);

    return (
        <ToolLayout title="Age Calculator" description="Calculate exact age in years, months, and days from birth date." keywords={['age calculator', 'birthday calculator', 'age in days', 'how old am I', 'zodiac sign']} category="typing" categoryName="Typing & Education" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="age-calculator">
                <div className="input-section">
                    <label className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        className="form-input"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    <button className="btn btn-primary btn-lg" onClick={calculate}>Calculate Age</button>
                </div>

                {result && (
                    <div className="result-section">
                        {/* Main Age Display */}
                        <div className="age-display">
                            <div className="age-main">
                                <span className="age-number">{result.years}</span>
                                <span className="age-label">years</span>
                            </div>
                            <div className="age-detail">
                                <span className="age-number">{result.months}</span>
                                <span className="age-label">months</span>
                            </div>
                            <div className="age-detail">
                                <span className="age-number">{result.days}</span>
                                <span className="age-label">days</span>
                            </div>
                        </div>

                        {/* Birthday Countdown */}
                        {countdown && (
                            <div className="countdown-section">
                                <h3>🎂 Next Birthday (Age {countdown.nextAge})</h3>
                                <div className="countdown-grid">
                                    <div className="countdown-item">
                                        <span className="countdown-value">{countdown.days}</span>
                                        <span className="countdown-label">Days</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
                                        <span className="countdown-label">Hours</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
                                        <span className="countdown-label">Mins</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="countdown-value">{String(countdown.seconds).padStart(2, '0')}</span>
                                        <span className="countdown-label">Secs</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Zodiac Signs */}
                        <div className="zodiac-section">
                            <div className="zodiac-card">
                                <span className="zodiac-emoji">{result.zodiac.emoji}</span>
                                <span className="zodiac-symbol">{result.zodiac.symbol}</span>
                                <span className="zodiac-name">{result.zodiac.name}</span>
                                <span className="zodiac-type">Western Zodiac</span>
                            </div>
                            <div className="zodiac-card chinese">
                                <span className="zodiac-emoji">{result.chineseZodiac.emoji}</span>
                                <span className="zodiac-name">{result.chineseZodiac.name}</span>
                                <span className="zodiac-type">Chinese Zodiac</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat">
                                <span className="stat-value">{result.totalDays.toLocaleString()}</span>
                                <span className="stat-label">Days Lived</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{result.totalWeeks.toLocaleString()}</span>
                                <span className="stat-label">Weeks</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{result.totalMonths}</span>
                                <span className="stat-label">Months</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{result.totalHours.toLocaleString()}</span>
                                <span className="stat-label">Hours</span>
                            </div>
                        </div>

                        {/* Milestones */}
                        {result.milestones.length > 0 && (
                            <div className="milestones-section">
                                <h3>🎯 Upcoming Milestones</h3>
                                <div className="milestones-list">
                                    {result.milestones.map((m, i) => (
                                        <div key={i} className="milestone">
                                            <span className="milestone-name">{m.name}</span>
                                            <span className="milestone-info">{m.remaining.toLocaleString()} days away ({m.date})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .age-calculator {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .input-section {
                    text-align: center;
                    margin-bottom: var(--spacing-xl);
                }

                .input-section .form-input {
                    max-width: 250px;
                    margin: 0 auto var(--spacing-md);
                }

                .result-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }

                .age-display {
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    gap: var(--spacing-lg);
                    padding: var(--spacing-xl);
                    background: var(--gradient-primary);
                    border-radius: var(--radius-lg);
                    color: white;
                }

                .age-main .age-number {
                    font-size: var(--text-5xl);
                    font-weight: 700;
                }

                .age-detail .age-number {
                    font-size: var(--text-2xl);
                    font-weight: 700;
                }

                .age-label {
                    display: block;
                    font-size: var(--text-sm);
                    opacity: 0.8;
                }

                .countdown-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    text-align: center;
                }

                .countdown-section h3 {
                    margin: 0 0 var(--spacing-md);
                    font-size: var(--text-md);
                }

                .countdown-grid {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-md);
                }

                .countdown-item {
                    padding: var(--spacing-md);
                    background: var(--bg-primary);
                    border-radius: var(--radius);
                    min-width: 70px;
                }

                .countdown-value {
                    display: block;
                    font-size: var(--text-2xl);
                    font-weight: 700;
                    font-family: var(--font-mono);
                    color: var(--accent-primary);
                }

                .countdown-label {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }

                .zodiac-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-md);
                }

                .zodiac-card {
                    padding: var(--spacing-lg);
                    background: linear-gradient(135deg, #8B5CF6, #6366F1);
                    border-radius: var(--radius);
                    color: white;
                    text-align: center;
                }

                .zodiac-card.chinese {
                    background: linear-gradient(135deg, #EF4444, #DC2626);
                }

                .zodiac-emoji {
                    display: block;
                    font-size: 40px;
                    margin-bottom: var(--spacing-xs);
                }

                .zodiac-symbol {
                    display: block;
                    font-size: var(--text-2xl);
                }

                .zodiac-name {
                    display: block;
                    font-size: var(--text-lg);
                    font-weight: 700;
                }

                .zodiac-type {
                    display: block;
                    font-size: var(--text-xs);
                    opacity: 0.8;
                    margin-top: var(--spacing-xs);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-sm);
                }

                .stat {
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    text-align: center;
                }

                .stat-value {
                    display: block;
                    font-size: var(--text-lg);
                    font-weight: 700;
                }

                .stat-label {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }

                .milestones-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                }

                .milestones-section h3 {
                    margin: 0 0 var(--spacing-md);
                    font-size: var(--text-md);
                }

                .milestones-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .milestone {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--spacing-sm);
                    background: var(--bg-primary);
                    border-radius: var(--radius-sm);
                }

                .milestone-name {
                    font-weight: 600;
                }

                .milestone-info {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }

                @media (max-width: 600px) {
                    .age-display {
                        flex-direction: column;
                        align-items: center;
                        gap: var(--spacing-sm);
                    }

                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .countdown-grid {
                        flex-wrap: wrap;
                    }

                    .countdown-item {
                        min-width: 60px;
                    }
                }
            `}</style>
        </ToolLayout>
    );
};

export default AgeCalculator;
