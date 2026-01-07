import { useState, useRef } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const GstInvoiceGenerator = () => {
    const [invoiceData, setInvoiceData] = useState({
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        sellerLogo: '',
        sellerName: '',
        sellerAddress: '',
        sellerGstin: '',
        sellerEmail: '',
        sellerPhone: '',
        buyerName: '',
        buyerAddress: '',
        buyerGstin: '',
        buyerEmail: '',
        buyerPhone: '',
        items: [{ description: '', hsn: '', quantity: 1, rate: 0, gstRate: 18 }],
        notes: ''
    });
    const [generatedInvoice, setGeneratedInvoice] = useState(null);
    const invoiceRef = useRef(null);
    const fileInputRef = useRef(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'gst-invoice-generator')
        .slice(0, 3);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024) {
                alert('Logo file size should be less than 500KB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setInvoiceData({ ...invoiceData, sellerLogo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setInvoiceData({ ...invoiceData, sellerLogo: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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
                    {/* Logo Upload Section */}
                    <div className="form-section">
                        <h3>Business Logo (Optional)</h3>
                        <div className="logo-upload-section">
                            {invoiceData.sellerLogo ? (
                                <div className="logo-preview">
                                    <img src={invoiceData.sellerLogo} alt="Business Logo" />
                                    <button
                                        type="button"
                                        className="remove-logo-btn"
                                        onClick={removeLogo}
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="logo-upload-box">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleLogoUpload}
                                        id="logo-upload"
                                        className="file-input-hidden"
                                    />
                                    <label htmlFor="logo-upload" className="logo-upload-label">
                                        <span className="upload-icon">📁</span>
                                        <span>Click to upload logo</span>
                                        <span className="upload-hint">PNG, JPG or WebP (max 500KB)</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

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
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={invoiceData.sellerEmail}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, sellerEmail: e.target.value })}
                                    placeholder="seller@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={invoiceData.sellerPhone}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, sellerPhone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
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
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={invoiceData.buyerEmail}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, buyerEmail: e.target.value })}
                                    placeholder="buyer@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={invoiceData.buyerPhone}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, buyerPhone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
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

                    {/* Notes */}
                    <div className="form-section">
                        <h3>Notes (Optional)</h3>
                        <textarea
                            className="form-textarea"
                            value={invoiceData.notes}
                            onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                            placeholder="Additional notes or payment terms..."
                            rows="3"
                        />
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
                    <div className="invoice-document" id="invoice-to-print">
                        {/* Invoice Header with Logo */}
                        <div className="invoice-header">
                            <div className="header-left">
                                {generatedInvoice.sellerLogo ? (
                                    <img
                                        src={generatedInvoice.sellerLogo}
                                        alt="Business Logo"
                                        className="invoice-logo"
                                    />
                                ) : (
                                    <h2 className="tax-invoice-title">TAX INVOICE</h2>
                                )}
                                <p className="seller-name-header">{generatedInvoice.sellerName}</p>
                            </div>
                            <div className="invoice-meta">
                                <p><strong>Invoice No:</strong> {generatedInvoice.invoiceNo}</p>
                                <p><strong>Date:</strong> {generatedInvoice.invoiceDate}</p>
                                {generatedInvoice.dueDate && <p><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>}
                            </div>
                        </div>

                        {/* Parties Section */}
                        <div className="parties-section">
                            <div className="party-box">
                                <h4>From (Seller)</h4>
                                <p><strong>{generatedInvoice.sellerName}</strong></p>
                                {generatedInvoice.sellerAddress && <p>{generatedInvoice.sellerAddress}</p>}
                                {generatedInvoice.sellerGstin && <p>GSTIN: {generatedInvoice.sellerGstin}</p>}
                                {generatedInvoice.sellerEmail && <p>📧 {generatedInvoice.sellerEmail}</p>}
                                {generatedInvoice.sellerPhone && <p>📞 {generatedInvoice.sellerPhone}</p>}
                            </div>
                            <div className="party-box">
                                <h4>To (Buyer)</h4>
                                <p><strong>{generatedInvoice.buyerName}</strong></p>
                                {generatedInvoice.buyerAddress && <p>{generatedInvoice.buyerAddress}</p>}
                                {generatedInvoice.buyerGstin && <p>GSTIN: {generatedInvoice.buyerGstin}</p>}
                                {generatedInvoice.buyerEmail && <p>📧 {generatedInvoice.buyerEmail}</p>}
                                {generatedInvoice.buyerPhone && <p>📞 {generatedInvoice.buyerPhone}</p>}
                            </div>
                        </div>

                        {/* Items Table */}
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

                        {/* Totals */}
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

                        {/* Notes */}
                        {generatedInvoice.notes && (
                            <div className="invoice-notes">
                                <strong>Notes:</strong>
                                <p>{generatedInvoice.notes}</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="invoice-footer">
                            <div className="signature-section">
                                <p>Authorized Signature: _______________________</p>
                            </div>
                            <p className="footer-note">This is a computer-generated invoice.</p>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-primary" onClick={printInvoice}>
                            🖨️ Print / Download PDF
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
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        /* Logo Upload Styles */
        .logo-upload-section {
          max-width: 300px;
        }

        .logo-preview {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-primary);
          border-radius: var(--radius);
          border: 2px dashed var(--platinum);
        }

        .logo-preview img {
          max-width: 150px;
          max-height: 60px;
          object-fit: contain;
        }

        .remove-logo-btn {
          background: var(--error);
          color: white;
          border: none;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: var(--text-sm);
        }

        .remove-logo-btn:hover {
          opacity: 0.9;
        }

        .logo-upload-box {
          border: 2px dashed var(--platinum);
          border-radius: var(--radius);
          padding: var(--spacing-lg);
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .logo-upload-box:hover {
          border-color: var(--yinmn-blue);
        }

        .file-input-hidden {
          display: none;
        }

        .logo-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          cursor: pointer;
        }

        .upload-icon {
          font-size: 2rem;
        }

        .upload-hint {
          font-size: var(--text-sm);
          color: var(--text-muted);
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

        /* Invoice Preview - A4 Format */
        .invoice-preview {
          max-width: 800px;
          margin: 0 auto;
        }

        .invoice-document {
          background: white;
          color: #333;
          padding: 40px;
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-lg);
          /* A4 aspect ratio: 1:1.414 */
          width: 100%;
          max-width: 794px;
          min-height: 1123px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #2b4c7e;
          padding-bottom: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .invoice-logo {
          max-width: 180px;
          max-height: 70px;
          object-fit: contain;
        }

        .tax-invoice-title {
          color: #2b4c7e;
          font-size: 1.8rem;
          margin: 0;
        }

        .seller-name-header {
          font-size: var(--text-lg);
          font-weight: 600;
          color: #555;
          margin: 0;
        }

        .invoice-meta {
          text-align: right;
        }

        .invoice-meta p {
          margin: 4px 0;
          font-size: var(--text-sm);
          color: #555;
        }

        .parties-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .party-box {
          background: #f8f9fa;
          padding: var(--spacing-md);
          border-radius: var(--radius);
          border-left: 4px solid #2b4c7e;
        }

        .party-box h4 {
          color: #2b4c7e;
          font-size: var(--text-sm);
          text-transform: uppercase;
          margin-bottom: var(--spacing-sm);
          letter-spacing: 0.5px;
        }

        .party-box p {
          margin: 4px 0;
          font-size: var(--text-sm);
          color: #333;
        }

        .invoice-table {
          width: 100%;
          margin-bottom: var(--spacing-lg);
          border-collapse: collapse;
        }

        .invoice-table th,
        .invoice-table td {
          padding: 12px 10px;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
        }

        .invoice-table th {
          background: #2b4c7e;
          color: white;
          font-weight: 600;
          font-size: var(--text-sm);
        }

        .invoice-table td {
          font-size: var(--text-sm);
          color: #333;
        }

        .invoice-table tbody tr:nth-child(even) {
          background: #f8f9fa;
        }

        .invoice-totals {
          max-width: 300px;
          margin-left: auto;
          background: #f8f9fa;
          padding: var(--spacing-md);
          border-radius: var(--radius);
        }

        .total-line {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: var(--text-sm);
          color: #333;
        }

        .total-line.grand {
          border-top: 2px solid #2b4c7e;
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          font-weight: 700;
          font-size: var(--text-lg);
          color: #2b4c7e;
        }

        .invoice-notes {
          margin-top: var(--spacing-lg);
          padding: var(--spacing-md);
          background: #fff8e1;
          border-radius: var(--radius);
          border-left: 4px solid #ffc107;
        }

        .invoice-notes strong {
          color: #333;
        }

        .invoice-notes p {
          margin: 8px 0 0 0;
          color: #555;
          font-size: var(--text-sm);
        }

        .invoice-footer {
          margin-top: auto;
          padding-top: var(--spacing-xl);
        }

        .signature-section {
          margin-bottom: var(--spacing-lg);
          text-align: right;
        }

        .signature-section p {
          color: #555;
          font-size: var(--text-sm);
        }

        .footer-note {
          text-align: center;
          color: #999;
          font-size: var(--text-xs);
          border-top: 1px solid #dee2e6;
          padding-top: var(--spacing-md);
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
        }

        /* Print Styles - A4 Format */
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          /* Hide everything */
          body * {
            visibility: hidden;
          }
          
          /* Show only invoice document */
          #invoice-to-print,
          #invoice-to-print * {
            visibility: visible;
          }
          
          /* Position and size for A4 */
          #invoice-to-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            min-height: auto;
            background: white !important;
            padding: 10mm !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          /* Hide action buttons */
          .action-buttons {
            display: none !important;
          }

          /* Reset invoice preview */
          .invoice-preview {
            position: static;
            max-width: none;
            margin: 0;
          }
          
          /* Ensure colors print */
          .invoice-table th {
            background: #2b4c7e !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .party-box {
            background: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice-totals {
            background: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice-notes {
            background: #fff8e1 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice-table tbody tr:nth-child(even) {
            background: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Prevent page breaks */
          .invoice-document {
            page-break-inside: avoid;
          }
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }

          .parties-section {
            grid-template-columns: 1fr;
          }

          .invoice-document {
            padding: 20px;
            min-height: auto;
          }

          .invoice-header {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .invoice-meta {
            text-align: left;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default GstInvoiceGenerator;
