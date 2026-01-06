import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

// Grade scales
const GRADE_SCALES = {
    '4.0': {
        name: '4.0 Scale (US)',
        grades: { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0 }
    },
    '5.0': {
        name: '5.0 Scale',
        grades: { 'A+': 5.0, 'A': 5.0, 'A-': 4.5, 'B+': 4.0, 'B': 3.5, 'B-': 3.0, 'C+': 2.5, 'C': 2.0, 'C-': 1.5, 'D': 1.0, 'F': 0 }
    },
    '10.0': {
        name: '10.0 Scale (India)',
        grades: { 'O': 10.0, 'A+': 9.0, 'A': 8.0, 'B+': 7.0, 'B': 6.0, 'C': 5.0, 'D': 4.0, 'F': 0 }
    }
};

const GpaCalculator = () => {
    const [scale, setScale] = useState('4.0');
    const [semesters, setSemesters] = useState([
        { name: 'Semester 1', courses: [{ name: '', grade: 'A', credits: '' }] }
    ]);
    const [result, setResult] = useState(null);
    const [targetGpa, setTargetGpa] = useState('');
    const [targetResult, setTargetResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'typing' && t.id !== 'gpa-calculator').slice(0, 3);

    const gradePoints = GRADE_SCALES[scale].grades;
    const maxGpa = Math.max(...Object.values(gradePoints));

    const addSemester = () => {
        setSemesters([...semesters, {
            name: `Semester ${semesters.length + 1}`,
            courses: [{ name: '', grade: 'A', credits: '' }]
        }]);
    };

    const removeSemester = (semIndex) => {
        if (semesters.length > 1) {
            setSemesters(semesters.filter((_, i) => i !== semIndex));
        }
    };

    const addCourse = (semIndex) => {
        const updated = [...semesters];
        updated[semIndex].courses.push({ name: '', grade: 'A', credits: '' });
        setSemesters(updated);
    };

    const removeCourse = (semIndex, courseIndex) => {
        const updated = [...semesters];
        if (updated[semIndex].courses.length > 1) {
            updated[semIndex].courses = updated[semIndex].courses.filter((_, i) => i !== courseIndex);
            setSemesters(updated);
        }
    };

    const updateCourse = (semIndex, courseIndex, field, value) => {
        const updated = [...semesters];
        updated[semIndex].courses[courseIndex][field] = value;
        setSemesters(updated);
    };

    const updateSemesterName = (semIndex, name) => {
        const updated = [...semesters];
        updated[semIndex].name = name;
        setSemesters(updated);
    };

    const calculate = () => {
        const semesterResults = semesters.map(sem => {
            let points = 0, credits = 0;
            sem.courses.forEach(c => {
                const cr = parseFloat(c.credits) || 0;
                points += gradePoints[c.grade] * cr;
                credits += cr;
            });
            return {
                name: sem.name,
                gpa: credits > 0 ? (points / credits).toFixed(2) : '0.00',
                credits
            };
        });

        // Calculate CGPA
        let totalPoints = 0, totalCredits = 0;
        semesters.forEach(sem => {
            sem.courses.forEach(c => {
                const cr = parseFloat(c.credits) || 0;
                totalPoints += gradePoints[c.grade] * cr;
                totalCredits += cr;
            });
        });
        const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

        setResult({ semesterResults, cgpa, totalCredits });
    };

    const calculateTarget = () => {
        if (!targetGpa || !result) return;
        const target = parseFloat(targetGpa);
        const current = parseFloat(result.cgpa);
        const currentCredits = result.totalCredits;

        // Calculate credits needed at max GPA to reach target
        // target = (current * currentCredits + maxGpa * x) / (currentCredits + x)
        // target * (currentCredits + x) = current * currentCredits + maxGpa * x
        // target * currentCredits + target * x = current * currentCredits + maxGpa * x
        // target * x - maxGpa * x = current * currentCredits - target * currentCredits
        // x * (target - maxGpa) = currentCredits * (current - target)
        // x = currentCredits * (current - target) / (target - maxGpa)

        if (target > maxGpa) {
            setTargetResult({ possible: false, message: `Target GPA cannot exceed ${maxGpa}` });
        } else if (target <= current) {
            setTargetResult({ possible: true, message: `You've already achieved this GPA!` });
        } else {
            const creditsNeeded = Math.ceil(currentCredits * (target - current) / (maxGpa - target));
            setTargetResult({
                possible: true,
                creditsNeeded,
                message: `You need ${creditsNeeded} more credits with ${maxGpa} GPA to reach ${targetGpa}`
            });
        }
    };

    useEffect(() => {
        if (targetGpa && result) calculateTarget();
    }, [targetGpa, result]);

    const faqs = [
        { question: 'How is GPA calculated?', answer: 'GPA = Sum of (Grade Points × Credit Hours) / Total Credit Hours. Each letter grade has a point value.' },
        { question: 'What is CGPA?', answer: 'CGPA (Cumulative GPA) is your overall GPA across all semesters combined.' }
    ];

    const seoContent = (<><h2>GPA Calculator</h2><p>Calculate semester GPA and cumulative CGPA with multiple grade scales. Track your academic progress.</p></>);

    return (
        <ToolLayout title="GPA Calculator" description="Calculate GPA and CGPA with multiple grade scales and semester support." keywords={['GPA calculator', 'CGPA calculator', 'grade calculator', 'college GPA']} category="typing" categoryName="Typing & Education" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="gpa-calculator">
                {/* Scale Selector */}
                <div className="scale-selector">
                    <label>Grade Scale:</label>
                    {Object.entries(GRADE_SCALES).map(([key, data]) => (
                        <button
                            key={key}
                            className={`scale-btn ${scale === key ? 'active' : ''}`}
                            onClick={() => setScale(key)}
                        >
                            {data.name}
                        </button>
                    ))}
                </div>

                {/* Semesters */}
                {semesters.map((semester, semIndex) => (
                    <div key={semIndex} className="semester-card">
                        <div className="semester-header">
                            <input
                                type="text"
                                className="semester-name"
                                value={semester.name}
                                onChange={(e) => updateSemesterName(semIndex, e.target.value)}
                            />
                            {semesters.length > 1 && (
                                <button className="btn-remove" onClick={() => removeSemester(semIndex)}>×</button>
                            )}
                        </div>

                        <div className="courses-list">
                            {semester.courses.map((course, courseIndex) => (
                                <div key={courseIndex} className="course-row">
                                    <input
                                        type="text"
                                        className="form-input course-name"
                                        placeholder="Course name"
                                        value={course.name}
                                        onChange={(e) => updateCourse(semIndex, courseIndex, 'name', e.target.value)}
                                    />
                                    <select
                                        className="form-select"
                                        value={course.grade}
                                        onChange={(e) => updateCourse(semIndex, courseIndex, 'grade', e.target.value)}
                                    >
                                        {Object.keys(gradePoints).map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        className="form-input credits"
                                        placeholder="Credits"
                                        value={course.credits}
                                        onChange={(e) => updateCourse(semIndex, courseIndex, 'credits', e.target.value)}
                                        min="0"
                                        max="10"
                                    />
                                    {semester.courses.length > 1 && (
                                        <button className="btn-remove-small" onClick={() => removeCourse(semIndex, courseIndex)}>×</button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-secondary btn-sm" onClick={() => addCourse(semIndex)}>
                            + Add Course
                        </button>
                    </div>
                ))}

                <div className="action-buttons">
                    <button className="btn btn-secondary" onClick={addSemester}>+ Add Semester</button>
                    <button className="btn btn-primary" onClick={calculate}>Calculate GPA</button>
                </div>

                {/* Results */}
                {result && (
                    <div className="results-section">
                        {/* CGPA Display */}
                        <div className="cgpa-display">
                            <span className="cgpa-label">Cumulative GPA</span>
                            <span className="cgpa-value">{result.cgpa}</span>
                            <span className="cgpa-credits">{result.totalCredits} Total Credits</span>
                        </div>

                        {/* Semester GPAs */}
                        <div className="semester-gpas">
                            {result.semesterResults.map((sem, i) => (
                                <div key={i} className="semester-gpa-card">
                                    <span className="sem-name">{sem.name}</span>
                                    <span className="sem-gpa">{sem.gpa}</span>
                                    <span className="sem-credits">{sem.credits} credits</span>
                                </div>
                            ))}
                        </div>

                        {/* Target GPA Calculator */}
                        <div className="target-section">
                            <h3>🎯 Target GPA Calculator</h3>
                            <div className="target-input">
                                <label>Target GPA:</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={targetGpa}
                                    onChange={(e) => setTargetGpa(e.target.value)}
                                    placeholder={`Max: ${maxGpa}`}
                                    step="0.1"
                                    min="0"
                                    max={maxGpa}
                                />
                            </div>
                            {targetResult && (
                                <div className={`target-result ${targetResult.possible ? 'success' : 'error'}`}>
                                    {targetResult.message}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .gpa-calculator {
                    max-width: 700px;
                    margin: 0 auto;
                }

                .scale-selector {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                }

                .scale-selector label {
                    font-weight: 600;
                    color: var(--text-muted);
                }

                .scale-btn {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius);
                    font-size: var(--text-sm);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .scale-btn:hover {
                    border-color: var(--accent-primary);
                }

                .scale-btn.active {
                    background: var(--accent-primary);
                    color: white;
                    border-color: var(--accent-primary);
                }

                .semester-card {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-md);
                }

                .semester-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                }

                .semester-name {
                    font-size: var(--text-lg);
                    font-weight: 700;
                    background: none;
                    border: none;
                    border-bottom: 2px solid transparent;
                    padding: var(--spacing-xs);
                    color: var(--text-primary);
                }

                .semester-name:focus {
                    outline: none;
                    border-bottom-color: var(--accent-primary);
                }

                .btn-remove {
                    width: 30px;
                    height: 30px;
                    border: none;
                    background: var(--error);
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: var(--text-lg);
                }

                .courses-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-md);
                }

                .course-row {
                    display: flex;
                    gap: var(--spacing-sm);
                    align-items: center;
                }

                .course-name { flex: 2; }
                .form-select { flex: 1; }
                .credits { flex: 0.7; max-width: 80px; }

                .btn-remove-small {
                    width: 24px;
                    height: 24px;
                    border: none;
                    background: var(--error);
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: var(--text-sm);
                }

                .btn-sm {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    font-size: var(--text-sm);
                }

                .action-buttons {
                    display: flex;
                    gap: var(--spacing-md);
                    justify-content: center;
                    margin-bottom: var(--spacing-xl);
                }

                .results-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }

                .cgpa-display {
                    text-align: center;
                    padding: var(--spacing-xl);
                    background: var(--gradient-primary);
                    border-radius: var(--radius-lg);
                    color: white;
                }

                .cgpa-label {
                    display: block;
                    font-size: var(--text-sm);
                    opacity: 0.8;
                }

                .cgpa-value {
                    display: block;
                    font-size: var(--text-5xl);
                    font-weight: 700;
                    margin: var(--spacing-sm) 0;
                }

                .cgpa-credits {
                    display: block;
                    font-size: var(--text-sm);
                    opacity: 0.8;
                }

                .semester-gpas {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--spacing-md);
                }

                .semester-gpa-card {
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    text-align: center;
                }

                .sem-name {
                    display: block;
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }

                .sem-gpa {
                    display: block;
                    font-size: var(--text-2xl);
                    font-weight: 700;
                    color: var(--accent-primary);
                }

                .sem-credits {
                    display: block;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }

                .target-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                }

                .target-section h3 {
                    margin: 0 0 var(--spacing-md);
                    font-size: var(--text-md);
                }

                .target-input {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-md);
                }

                .target-input label {
                    font-weight: 600;
                }

                .target-input .form-input {
                    max-width: 120px;
                }

                .target-result {
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    font-weight: 600;
                }

                .target-result.success {
                    background: rgba(16, 185, 129, 0.2);
                    color: var(--success);
                }

                .target-result.error {
                    background: rgba(239, 68, 68, 0.2);
                    color: var(--error);
                }

                @media (max-width: 600px) {
                    .course-row {
                        flex-wrap: wrap;
                    }

                    .course-name {
                        flex: 1 1 100%;
                    }

                    .scale-selector {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </ToolLayout>
    );
};

export default GpaCalculator;
