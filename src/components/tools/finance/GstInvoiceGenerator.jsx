import { useState, useRef } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const GstInvoiceGenerator = () => {
    const [invoiceData, setInvoiceData] = useState({
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        sellerName: '',
        sellerAddress: '',
        sellerGstin: '',
        buyerName: '',
        buyerAddress: '',
        buyerGstin: '',
        items: [{ description: '', hsn: '', quantity: 1, rate: 0, gstRate: 18 }],
        notes: ''
    });
    const [generatedInvoice, setGeneratedInvoice] = useState(null);
    const invoiceRef = useRef(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'gst-invoice-generator')
        .slice(0, 3);

    const updateItem = (index, field, value) => {
        const newItems = [...invoiceData.items];
        newItems[index][field] = value;
        setInvoiceData({ ...invoiceData, items: newItems });
    };

    const addItem = () => {
        setInvoiceData({
            ...invoiceData,
            items: [...invoiceData.items, { description: '', hsn: '', quantity: 1, rate: 0, gstRate: 18 }]
        });
    };

    const removeItem = (index) => {
        if (invoiceData.items.length > 1) {
            const newItems = invoiceData.items.filter((_, i) => i !== index);
            setInvoiceData({ ...invoiceData, items: newItems });
        }
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalCgst = 0;
        let totalSgst = 0;

        invoiceData.items.forEach(item => {
            const itemTotal = item.quantity * item.rate;
            const gstAmount = (itemTotal * item.gstRate) / 100;
            subtotal += itemTotal;
            totalCgst += gstAmount / 2;
            totalSgst += gstAmount / 2;
        });

        return {
            subtotal: subtotal.toFixed(2),
            cgst: totalCgst.toFixed(2),
            sgst: totalSgst.toFixed(2),
            total: (subtotal + totalCgst + totalSgst).toFixed(2)
        };
    };

    const generateInvoice = () => {
        if (!invoiceData.sellerName || !invoiceData.buyerName || !invoiceData.invoiceNo) {
            alert('Please fill in required fields: Invoice No, Seller Name, and Buyer Name');
            return;
        }

        const totals = calculateTotals();
        setGeneratedInvoice({ ...invoiceData, totals });
    };

    const printInvoice = () => {
        window.print();
    };

    const faqs = [
        {
            question: 'What is a GST Invoice?',
            answer: 'A GST Invoice is a legal document issued by a registered seller to a buyer. It contains details of goods/services sold, GST charged, and is mandatory for claiming Input Tax Credit (ITC).'
        },
        {
            question: 'What are mandatory fields in a GST Invoice?',
            answer: 'Mandatory fields include: Invoice number, Invoice date, Supplier & buyer name and address, GSTIN of both parties, HSN/SAC code, Description and quantity of goods/services, Taxable value, GST rate and amount (CGST, SGST or IGST), and Total amount.'
        },
        {
            question: 'What is the difference between CGST+SGST and IGST?',
            answer: 'For intra-state transactions (within same state), CGST and SGST are charged equally (e.g., 9% each for 18% GST). For inter-state transactions, IGST is charged at the full rate (e.g., 18%).'
        },
        {
            question: 'What is HSN/SAC code?',
            answer: 'HSN (Harmonized System of Nomenclature) code is used for goods, while SAC (Services Accounting Code) is used for services. These codes help classify products/services for GST purposes.'
        },
        {
            question: 'How long should GST invoices be retained?',
            answer: 'GST invoices must be retained for at least 6 years from the due date of filing annual return for that year. Digital copies are equally valid if maintained properly.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is a GST Invoice Generator?</h2>
            <p>
                A GST Invoice Generator is a free online tool that helps businesses create professional,
                GST-compliant invoices instantly. Our tool automatically calculates CGST, SGST, and total
                amounts, ensuring your invoices meet all legal requirements for Input Tax Credit claims.
            </p>

            <h2>Why Use Our GST Invoice Generator?</h2>
            <ul>
                <li><strong>Free & Fast:</strong> Generate unlimited invoices at no cost</li>
                <li><strong>GST Compliant:</strong> Includes all mandatory fields as per GST law</li>
                <li><strong>Auto Calculation:</strong> Automatically calculates GST amounts</li>
                <li><strong>Print Ready:</strong> Professional format ready for printing</li>
                <li><strong>Multiple Items:</strong> Add unlimited line items to invoices</li>
            </ul>

            <h2>GST Invoice Requirements</h2>
            <p>
                As per GST rules, a tax invoice must contain the following information:
            </p>
            <ol>
                <li>Name, address, and GSTIN of the supplier</li>
                <li>A consecutive serial number (unique for each financial year)</li>
                <li>Date of issue</li>
                <li>Name, address, and GSTIN of the recipient (if registered)</li>
                <li>HSN code for goods or SAC code for services</li>
                <li>Description of goods or services</li>
                <li>Quantity and unit of goods</li>
                <li>Taxable value considering discounts</li>
                <li>GST rate and amount (CGST, SGST/UTGST or IGST)</li>
                <li>Place of supply if different from location</li>
                <li>Signature or digital signature of supplier</li>
            </ol>

            <h2>Types of GST Invoices</h2>
            <ul>
                <li><strong>Tax Invoice:</strong> Issued for taxable supply of goods/services</li>
                <li><strong>Bill of Supply:</strong> For exempt goods or composition dealers</li>
                <li><strong>Debit Note:</strong> When taxable value increases post-invoice</li>
                <li><strong>Credit Note:</strong> When taxable value decreases post-invoice</li>
            </ul>
        </>
    );

    const totals = calculateTotals();

    return (
        <ToolLayout
            title="GST Invoice Generator"
            description="Generate professional GST-compliant invoices for free. Auto-calculate CGST, SGST, and create print-ready tax invoices instantly."
            keywords={['GST invoice generator', 'tax invoice generator', 'GST bill maker', 'online invoice generator', 'free GST invoice', 'tax invoice format']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            {!generatedInvoice ? (
                <div className="invoice-form">
                    {/* Invoice Details */}
                    <div className="form-section">
                        <h3>Invoice Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Invoice Number *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={invoiceData.invoiceNo}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNo: e.target.value })}
                                    placeholder="e.g., INV-2024-001"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Invoice Date *</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={invoiceData.invoiceDate}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Due Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={invoiceData.dueDate}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seller Details */}
                    <div className="form-section">
                        <h3>Seller Details (Your Business)</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Business Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={invoiceData.sellerName}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, sellerName: e.target.value })}
                                    placeholder="Your Business Name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">GSTIN</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={invoiceData.sellerGstin}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, sellerGstin: e.target.value })}
                                    placeholder="e.g., 22AAAAA0000A1Z5"
                                    maxLength="15"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <textarea
                                className="form-textarea"
                                value={invoiceData.sellerAddress}
                                onChange={(e) => setInvoiceData({ ...invoiceData, sellerAddress: e.target.value })}
                                placeholder="Complete address with PIN code"
                                rows="2"
                            />
                        </div>
                    </div>

                    {/* Buyer Details */}
                    <div className="form-section">
                        <h3>Buyer Details (Bill To)</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Buyer Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={invoiceData.buyerName}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, buyerName: e.target.value })}
                                    placeholder="Buyer Name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Buyer GSTIN</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={invoiceData.buyerGstin}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, buyerGstin: e.target.value })}
                                    placeholder="e.g., 22AAAAA0000A1Z5"
                                    maxLength="15"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <textarea
                                className="form-textarea"
                                value={invoiceData.buyerAddress}
                                onChange={(e) => setInvoiceData({ ...invoiceData, buyerAddress: e.target.value })}
                                placeholder="Complete address with PIN code"
                                rows="2"
                            />
                        </div>
                    </div>

                    {/* Items */}
                    <div className="form-section">
                        <h3>Items / Services</h3>
                        {invoiceData.items.map((item, index) => (
                            <div key={index} className="item-row">
                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <label className="form-label">Description</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={item.description}
                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                            placeholder="Item description"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">HSN/SAC</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={item.hsn}
                                            onChange={(e) => updateItem(index, 'hsn', e.target.value)}
                                            placeholder="Code"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Qty</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                            min="1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Rate (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={item.rate}
                                            onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">GST %</label>
                                        <select
                                            className="form-select"
                                            value={item.gstRate}
                                            onChange={(e) => updateItem(index, 'gstRate', parseFloat(e.target.value))}
                                        >
                                            <option value="0">0%</option>
                                            <option value="5">5%</option>
                                            <option value="12">12%</option>
                                            <option value="18">18%</option>
                                            <option value="28">28%</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Amount</label>
                                        <div className="amount-display">
                                            ₹{(item.quantity * item.rate).toFixed(2)}
                                        </div>
                                    </div>
                                    {invoiceData.items.length > 1 && (
                                        <button
                                            className="remove-item-btn"
                                            onClick={() => removeItem(index)}
                                            type="button"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button className="btn btn-secondary" onClick={addItem} type="button">
                            + Add Item
                        </button>
                    </div>

                    {/* Totals Preview */}
                    <div className="totals-preview">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>₹{totals.subtotal}</span>
                        </div>
                        <div className="total-row">
                            <span>CGST:</span>
                            <span>₹{totals.cgst}</span>
                        </div>
                        <div className="total-row">
                            <span>SGST:</span>
                            <span>₹{totals.sgst}</span>
                        </div>
                        <div className="total-row grand-total">
                            <span>Grand Total:</span>
                            <span>₹{totals.total}</span>
                        </div>
                    </div>

                    <button className="btn btn-primary btn-lg" onClick={generateInvoice}>
                        Generate Invoice
                    </button>
                </div>
            ) : (
                <div className="invoice-preview" ref={invoiceRef}>
                    <div className="invoice-document">
                        <div className="invoice-header">
                            <h2>TAX INVOICE</h2>
                            <div className="invoice-meta">
                                <p><strong>Invoice No:</strong> {generatedInvoice.invoiceNo}</p>
                                <p><strong>Date:</strong> {generatedInvoice.invoiceDate}</p>
                                {generatedInvoice.dueDate && <p><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>}
                            </div>
                        </div>

                        <div className="parties-section">
                            <div className="party-box">
                                <h4>From (Seller)</h4>
                                <p><strong>{generatedInvoice.sellerName}</strong></p>
                                {generatedInvoice.sellerAddress && <p>{generatedInvoice.sellerAddress}</p>}
                                {generatedInvoice.sellerGstin && <p>GSTIN: {generatedInvoice.sellerGstin}</p>}
                            </div>
                            <div className="party-box">
                                <h4>To (Buyer)</h4>
                                <p><strong>{generatedInvoice.buyerName}</strong></p>
                                {generatedInvoice.buyerAddress && <p>{generatedInvoice.buyerAddress}</p>}
                                {generatedInvoice.buyerGstin && <p>GSTIN: {generatedInvoice.buyerGstin}</p>}
                            </div>
                        </div>

                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Description</th>
                                    <th>HSN/SAC</th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                    <th>GST</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generatedInvoice.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.description}</td>
                                        <td>{item.hsn}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.rate}</td>
                                        <td>{item.gstRate}%</td>
                                        <td>₹{(item.quantity * item.rate).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="invoice-totals">
                            <div className="total-line">
                                <span>Subtotal:</span>
                                <span>₹{generatedInvoice.totals.subtotal}</span>
                            </div>
                            <div className="total-line">
                                <span>CGST:</span>
                                <span>₹{generatedInvoice.totals.cgst}</span>
                            </div>
                            <div className="total-line">
                                <span>SGST:</span>
                                <span>₹{generatedInvoice.totals.sgst}</span>
                            </div>
                            <div className="total-line grand">
                                <span>Grand Total:</span>
                                <span>₹{generatedInvoice.totals.total}</span>
                            </div>
                        </div>

                        <div className="invoice-footer">
                            <p>This is a computer-generated invoice.</p>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-primary" onClick={printInvoice}>
                            🖨️ Print Invoice
                        </button>
                        <button className="btn btn-secondary" onClick={() => setGeneratedInvoice(null)}>
                            ← Edit Invoice
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        .invoice-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-section {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-lg);
        }

        .form-section h3 {
          margin-bottom: var(--spacing-md);
          font-size: var(--text-lg);
        }

        .form-row {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .form-group {
          flex: 1;
        }

        .form-textarea {
          width: 100%;
          padding: var(--spacing-sm);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          font-family: inherit;
          resize: vertical;
        }

        .item-row {
          background: var(--bg-primary);
          padding: var(--spacing-md);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-md);
          position: relative;
        }

        .amount-display {
          padding: var(--spacing-sm);
          background: var(--bg-tertiary);
          border-radius: var(--radius);
          font-weight: 600;
          text-align: center;
        }

        .remove-item-btn {
          position: absolute;
          top: var(--spacing-sm);
          right: var(--spacing-sm);
          background: var(--error);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 12px;
        }

        .totals-preview {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-lg);
          max-width: 300px;
          margin-left: auto;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-xs) 0;
        }

        .total-row.grand-total {
          border-top: 2px solid var(--platinum);
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          font-weight: 700;
          font-size: var(--text-lg);
        }

        .invoice-preview {
          max-width: 800px;
          margin: 0 auto;
        }

        .invoice-document {
          background: white;
          padding: var(--spacing-xl);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-lg);
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid var(--yinmn-blue);
          padding-bottom: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .invoice-header h2 {
          color: var(--yinmn-blue);
        }

        .invoice-meta p {
          margin: 0;
          font-size: var(--text-sm);
        }

        .parties-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .party-box {
          background: var(--bg-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius);
        }

        .party-box h4 {
          color: var(--text-muted);
          font-size: var(--text-sm);
          margin-bottom: var(--spacing-sm);
        }

        .party-box p {
          margin: var(--spacing-xs) 0;
          font-size: var(--text-sm);
        }

        .invoice-table {
          width: 100%;
          margin-bottom: var(--spacing-lg);
        }

        .invoice-table th,
        .invoice-table td {
          padding: var(--spacing-sm);
          text-align: left;
          border-bottom: 1px solid var(--platinum);
        }

        .invoice-table th {
          background: var(--yinmn-blue);
          color: white;
        }

        .invoice-totals {
          max-width: 300px;
          margin-left: auto;
        }

        .total-line {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-xs) 0;
        }

        .total-line.grand {
          border-top: 2px solid var(--platinum);
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          font-weight: 700;
          font-size: var(--text-lg);
          color: var(--yinmn-blue);
        }

        .invoice-footer {
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--platinum);
          text-align: center;
          color: var(--text-muted);
          font-size: var(--text-sm);
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
        }

        @media print {
          /* Hide everything outside the invoice */
          body * {
            visibility: hidden;
          }
          
          /* Show the invoice document and its contents */
          .invoice-document,
          .invoice-document * {
            visibility: visible;
          }
          
          /* Position the invoice at the top-left for proper printing */
          .invoice-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 20mm !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          
          /* Hide action buttons */
          .action-buttons {
            display: none !important;
          }
          
          /* Hide the invoice preview wrapper styling */
          .invoice-preview {
            position: static;
            max-width: none;
            margin: 0;
          }
          
          /* Ensure proper colors for printing */
          .invoice-table th {
            background: #2b4c7e !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .party-box {
            background: #f5f5f5 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }

          .parties-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default GstInvoiceGenerator;
