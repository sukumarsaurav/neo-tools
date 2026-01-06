import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const DiscountCalculator = () => {
    const [originalPrice, setOriginalPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [discountType, setDiscountType] = useState('percentage');
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'finance' && t.id !== 'discount-calculator').slice(0, 3);

    const calculate = () => {
        const price = parseFloat(originalPrice);
        const disc = parseFloat(discount);
        if (isNaN(price) || isNaN(disc) || price <= 0) { alert('Please enter valid values'); return; }

        let discountAmount, finalPrice, discountPercentage;
        if (discountType === 'percentage') {
            discountAmount = (price * disc) / 100;
            finalPrice = price - discountAmount;
            discountPercentage = disc;
        } else {
            discountAmount = disc;
            finalPrice = price - discountAmount;
            discountPercentage = (discountAmount / price) * 100;
        }

        setResult({ originalPrice: price.toFixed(2), discountAmount: discountAmount.toFixed(2), finalPrice: finalPrice.toFixed(2), discountPercentage: discountPercentage.toFixed(2), saved: discountAmount.toFixed(2) });
    };

    const faqs = [
        { question: 'How to calculate discount percentage?', answer: 'Discount % = (Discount Amount / Original Price) × 100. For example, if original price is ₹1000 and discount is ₹200, then discount % = (200/1000) × 100 = 20%.' },
        { question: 'How to calculate final price after discount?', answer: 'Final Price = Original Price - (Original Price × Discount %/100). Or simply: Final Price = Original Price × (1 - Discount %/100).' },
        { question: 'How to calculate original price from discounted price?', answer: 'Original Price = Discounted Price / (1 - Discount %/100). For example, if discounted price is ₹800 at 20% off: 800 / 0.8 = ₹1000.' }
    ];

    const seoContent = (
        <>
            <h2>Discount Calculator</h2>
            <p>Calculate discounts quickly and accurately. Whether you're shopping during a sale or setting prices for your business, this tool helps you determine the final price after applying discounts.</p>
            <h3>How It Works</h3>
            <ul><li><strong>Percentage Discount:</strong> Enter the discount percentage to calculate the amount saved and final price.</li><li><strong>Flat Amount:</strong> Enter the exact discount amount to see the equivalent percentage and final price.</li></ul>
            <h3>Tips for Smart Shopping</h3>
            <ul><li>Compare discounts across stores before buying</li><li>Consider if the discounted price is still higher than competitors' regular prices</li><li>Watch for "buy more, save more" deals that may not actually benefit you</li></ul>
        </>
    );

    return (
        <ToolLayout title="Discount Calculator" description="Calculate discount amount and final price. Enter percentage or flat discount to see your savings instantly." keywords={['discount calculator', 'sale price calculator', 'percentage off calculator', 'price after discount']} category="finance" categoryName="Financial & Business" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Original Price (₹)</label><input type="number" className="form-input" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="e.g., 1000" min="0" /></div>
                    <div className="form-group"><label className="form-label">Discount</label><input type="number" className="form-input" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder={discountType === 'percentage' ? 'e.g., 20' : 'e.g., 200'} min="0" /></div>
                    <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={discountType} onChange={(e) => setDiscountType(e.target.value)}><option value="percentage">Percentage (%)</option><option value="amount">Flat Amount (₹)</option></select></div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={calculate}>Calculate Discount</button>
                {result && (
                    <div className="result-box">
                        <div className="result-grid">
                            <div className="result-item"><span className="result-label">Original Price</span><span className="result-value">₹{parseInt(result.originalPrice).toLocaleString()}</span></div>
                            <div className="result-item"><span className="result-label">Discount ({result.discountPercentage}%)</span><span className="result-value" style={{ color: 'var(--error)' }}>- ₹{parseInt(result.discountAmount).toLocaleString()}</span></div>
                            <div className="result-item highlight"><span className="result-label">Final Price</span><span className="result-value">₹{parseInt(result.finalPrice).toLocaleString()}</span></div>
                        </div>
                        <p className="savings-note">🎉 You save ₹{parseInt(result.saved).toLocaleString()}!</p>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:600px;margin:0 auto}.form-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--spacing-md)}.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}.result-item{padding:var(--spacing-md);background:var(--bg-secondary);border-radius:var(--radius);text-align:center}.result-item.highlight{grid-column:span 2;background:var(--gradient-accent);color:white}.result-item.highlight .result-label,.result-item.highlight .result-value{color:white}.result-label{display:block;font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--spacing-xs)}.result-value{font-size:var(--text-2xl);font-weight:700;color:var(--text-dark)}.savings-note{text-align:center;margin-top:var(--spacing-md);color:var(--success);font-weight:600;font-size:var(--text-lg)}@media(max-width:480px){.form-row{grid-template-columns:1fr}.result-grid{grid-template-columns:1fr}.result-item.highlight{grid-column:span 1}}`}</style>
        </ToolLayout>
    );
};

export default DiscountCalculator;
