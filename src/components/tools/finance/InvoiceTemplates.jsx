import React from 'react';

// Template 1: Classic Professional (Blue theme)
export const ClassicTemplate = ({ invoiceData, totals }) => (
    <div className="invoice-template template-classic" id="invoice-to-print">
        <style>{`
            .template-classic {
                background: white;
                color: #333;
                padding: 40px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                min-height: 1123px;
            }
            .template-classic .inv-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 3px solid #2b4c7e;
                padding-bottom: 20px;
                margin-bottom: 25px;
            }
            .template-classic .header-left {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .template-classic .inv-logo {
                max-width: 180px;
                max-height: 70px;
                object-fit: contain;
            }
            .template-classic .tax-title {
                color: #2b4c7e;
                font-size: 1.8rem;
                margin: 0;
                font-weight: 700;
            }
            .template-classic .seller-name {
                font-size: 1.1rem;
                font-weight: 600;
                color: #555;
                margin: 0;
            }
            .template-classic .inv-meta {
                text-align: right;
            }
            .template-classic .inv-meta p {
                margin: 4px 0;
                font-size: 0.9rem;
                color: #555;
            }
            .template-classic .parties {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 25px;
                margin-bottom: 25px;
            }
            .template-classic .party-box {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #2b4c7e;
            }
            .template-classic .party-box h4 {
                color: #2b4c7e;
                font-size: 0.75rem;
                text-transform: uppercase;
                margin: 0 0 10px 0;
                letter-spacing: 0.5px;
            }
            .template-classic .party-box p {
                margin: 4px 0;
                font-size: 0.85rem;
                color: #333;
            }
            .template-classic .inv-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 25px;
            }
            .template-classic .inv-table th {
                background: #2b4c7e;
                color: white;
                padding: 12px 10px;
                text-align: left;
                font-size: 0.85rem;
                font-weight: 600;
            }
            .template-classic .inv-table td {
                padding: 12px 10px;
                border-bottom: 1px solid #dee2e6;
                font-size: 0.85rem;
            }
            .template-classic .inv-table tbody tr:nth-child(even) {
                background: #f8f9fa;
            }
            .template-classic .inv-totals {
                max-width: 300px;
                margin-left: auto;
                background: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
            }
            .template-classic .total-line {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 0.9rem;
            }
            .template-classic .total-line.grand {
                border-top: 2px solid #2b4c7e;
                margin-top: 10px;
                padding-top: 10px;
                font-weight: 700;
                font-size: 1.1rem;
                color: #2b4c7e;
            }
            .template-classic .inv-notes {
                margin-top: 25px;
                padding: 15px;
                background: #fff8e1;
                border-radius: 6px;
                border-left: 4px solid #ffc107;
            }
            .template-classic .inv-notes strong {
                color: #333;
                font-size: 0.85rem;
            }
            .template-classic .inv-notes p {
                margin: 8px 0 0 0;
                color: #555;
                font-size: 0.85rem;
            }
            .template-classic .inv-footer {
                margin-top: auto;
                padding-top: 30px;
            }
            .template-classic .signature {
                text-align: right;
                margin-bottom: 20px;
            }
            .template-classic .signature p {
                color: #555;
                font-size: 0.85rem;
            }
            .template-classic .footer-note {
                text-align: center;
                color: #999;
                font-size: 0.75rem;
                border-top: 1px solid #dee2e6;
                padding-top: 15px;
            }
            @media print {
                .template-classic {
                    padding: 10mm !important;
                    min-height: auto;
                }
                .template-classic .inv-table th {
                    background: #2b4c7e !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .template-classic .party-box,
                .template-classic .inv-totals,
                .template-classic .inv-table tbody tr:nth-child(even) {
                    background: #f8f9fa !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `}</style>

        <div className="inv-header">
            <div className="header-left">
                {invoiceData.sellerLogo ? (
                    <img src={invoiceData.sellerLogo} alt="Logo" className="inv-logo" />
                ) : (
                    <h2 className="tax-title">TAX INVOICE</h2>
                )}
                <p className="seller-name">{invoiceData.sellerName}</p>
            </div>
            <div className="inv-meta">
                <p><strong>Invoice No:</strong> {invoiceData.invoiceNo}</p>
                <p><strong>Date:</strong> {invoiceData.invoiceDate}</p>
                {invoiceData.dueDate && <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>}
            </div>
        </div>

        <div className="parties">
            <div className="party-box">
                <h4>From (Seller)</h4>
                <p><strong>{invoiceData.sellerName}</strong></p>
                {invoiceData.sellerAddress && <p>{invoiceData.sellerAddress}</p>}
                {invoiceData.sellerGstin && <p>GSTIN: {invoiceData.sellerGstin}</p>}
                {invoiceData.sellerEmail && <p>📧 {invoiceData.sellerEmail}</p>}
                {invoiceData.sellerPhone && <p>📞 {invoiceData.sellerPhone}</p>}
            </div>
            <div className="party-box">
                <h4>To (Buyer)</h4>
                <p><strong>{invoiceData.buyerName}</strong></p>
                {invoiceData.buyerAddress && <p>{invoiceData.buyerAddress}</p>}
                {invoiceData.buyerGstin && <p>GSTIN: {invoiceData.buyerGstin}</p>}
                {invoiceData.buyerEmail && <p>📧 {invoiceData.buyerEmail}</p>}
                {invoiceData.buyerPhone && <p>📞 {invoiceData.buyerPhone}</p>}
            </div>
        </div>

        <table className="inv-table">
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
                {invoiceData.items.map((item, index) => (
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

        <div className="inv-totals">
            <div className="total-line"><span>Subtotal:</span><span>₹{totals.subtotal}</span></div>
            <div className="total-line"><span>CGST:</span><span>₹{totals.cgst}</span></div>
            <div className="total-line"><span>SGST:</span><span>₹{totals.sgst}</span></div>
            <div className="total-line grand"><span>Grand Total:</span><span>₹{totals.total}</span></div>
        </div>

        {invoiceData.notes && (
            <div className="inv-notes">
                <strong>Notes:</strong>
                <p>{invoiceData.notes}</p>
            </div>
        )}

        <div className="inv-footer">
            <div className="signature"><p>Authorized Signature: _______________________</p></div>
            <p className="footer-note">This is a computer-generated invoice.</p>
        </div>
    </div>
);

// Template 2: Modern Minimal (Monochrome)
export const ModernTemplate = ({ invoiceData, totals }) => (
    <div className="invoice-template template-modern" id="invoice-to-print">
        <style>{`
            .template-modern {
                background: white;
                color: #1a1a1a;
                padding: 50px;
                font-family: 'Inter', 'Helvetica Neue', sans-serif;
                min-height: 1123px;
            }
            .template-modern .inv-header {
                margin-bottom: 50px;
            }
            .template-modern .inv-number {
                font-size: 3rem;
                font-weight: 200;
                color: #1a1a1a;
                margin: 0 0 10px 0;
                letter-spacing: -2px;
            }
            .template-modern .inv-label {
                font-size: 0.7rem;
                text-transform: uppercase;
                letter-spacing: 3px;
                color: #888;
                margin-bottom: 30px;
            }
            .template-modern .header-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            .template-modern .inv-logo {
                max-width: 150px;
                max-height: 60px;
                object-fit: contain;
            }
            .template-modern .inv-meta {
                text-align: right;
            }
            .template-modern .inv-meta p {
                margin: 3px 0;
                font-size: 0.85rem;
                color: #666;
            }
            .template-modern .parties {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 60px;
                margin-bottom: 40px;
            }
            .template-modern .party-box h4 {
                font-size: 0.65rem;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: #999;
                margin: 0 0 15px 0;
            }
            .template-modern .party-box p {
                margin: 5px 0;
                font-size: 0.9rem;
                color: #333;
                line-height: 1.6;
            }
            .template-modern .inv-table {
                width: 100%;
                margin-bottom: 40px;
            }
            .template-modern .inv-table th {
                text-align: left;
                padding: 15px 10px;
                font-size: 0.7rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #999;
                border-bottom: 1px solid #eee;
                font-weight: 500;
            }
            .template-modern .inv-table td {
                padding: 20px 10px;
                font-size: 0.9rem;
                border-bottom: 1px solid #f5f5f5;
            }
            .template-modern .inv-totals {
                max-width: 280px;
                margin-left: auto;
            }
            .template-modern .total-line {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                font-size: 0.9rem;
                color: #666;
            }
            .template-modern .total-line.grand {
                border-top: 1px solid #1a1a1a;
                margin-top: 15px;
                padding-top: 15px;
                font-weight: 600;
                font-size: 1.2rem;
                color: #1a1a1a;
            }
            .template-modern .inv-notes {
                margin-top: 40px;
                padding: 20px 0;
                border-top: 1px solid #eee;
            }
            .template-modern .inv-notes strong {
                font-size: 0.7rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #999;
            }
            .template-modern .inv-notes p {
                margin: 10px 0 0 0;
                color: #666;
                font-size: 0.85rem;
            }
            .template-modern .inv-footer {
                margin-top: auto;
                padding-top: 50px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }
            .template-modern .signature p {
                color: #999;
                font-size: 0.8rem;
            }
            .template-modern .footer-note {
                color: #ccc;
                font-size: 0.7rem;
            }
            @media print {
                .template-modern { padding: 10mm !important; min-height: auto; }
            }
        `}</style>

        <div className="inv-header">
            <div className="header-row">
                <div>
                    <p className="inv-label">Invoice</p>
                    <h1 className="inv-number">{invoiceData.invoiceNo}</h1>
                </div>
                <div className="inv-meta">
                    {invoiceData.sellerLogo && <img src={invoiceData.sellerLogo} alt="Logo" className="inv-logo" />}
                    <p><strong>{invoiceData.sellerName}</strong></p>
                    <p>Date: {invoiceData.invoiceDate}</p>
                    {invoiceData.dueDate && <p>Due: {invoiceData.dueDate}</p>}
                </div>
            </div>
        </div>

        <div className="parties">
            <div className="party-box">
                <h4>Billed From</h4>
                <p><strong>{invoiceData.sellerName}</strong></p>
                {invoiceData.sellerAddress && <p>{invoiceData.sellerAddress}</p>}
                {invoiceData.sellerGstin && <p>GSTIN: {invoiceData.sellerGstin}</p>}
                {invoiceData.sellerEmail && <p>{invoiceData.sellerEmail}</p>}
                {invoiceData.sellerPhone && <p>{invoiceData.sellerPhone}</p>}
            </div>
            <div className="party-box">
                <h4>Billed To</h4>
                <p><strong>{invoiceData.buyerName}</strong></p>
                {invoiceData.buyerAddress && <p>{invoiceData.buyerAddress}</p>}
                {invoiceData.buyerGstin && <p>GSTIN: {invoiceData.buyerGstin}</p>}
                {invoiceData.buyerEmail && <p>{invoiceData.buyerEmail}</p>}
                {invoiceData.buyerPhone && <p>{invoiceData.buyerPhone}</p>}
            </div>
        </div>

        <table className="inv-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>GST</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
            </thead>
            <tbody>
                {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                        <td>{item.description}</td>
                        <td>{item.hsn}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.rate}</td>
                        <td>{item.gstRate}%</td>
                        <td style={{ textAlign: 'right' }}>₹{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="inv-totals">
            <div className="total-line"><span>Subtotal</span><span>₹{totals.subtotal}</span></div>
            <div className="total-line"><span>CGST</span><span>₹{totals.cgst}</span></div>
            <div className="total-line"><span>SGST</span><span>₹{totals.sgst}</span></div>
            <div className="total-line grand"><span>Total</span><span>₹{totals.total}</span></div>
        </div>

        {invoiceData.notes && (
            <div className="inv-notes">
                <strong>Notes</strong>
                <p>{invoiceData.notes}</p>
            </div>
        )}

        <div className="inv-footer">
            <div className="signature"><p>Signature: _______________________</p></div>
            <p className="footer-note">Computer generated invoice</p>
        </div>
    </div>
);

// Template 3: Bold Corporate
export const CorporateTemplate = ({ invoiceData, totals }) => (
    <div className="invoice-template template-corporate" id="invoice-to-print">
        <style>{`
            .template-corporate {
                background: white;
                color: #333;
                font-family: 'Arial', sans-serif;
                min-height: 1123px;
            }
            .template-corporate .inv-header {
                background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
                color: white;
                padding: 30px 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .template-corporate .header-left h1 {
                margin: 0;
                font-size: 1.8rem;
                font-weight: 700;
            }
            .template-corporate .header-left p {
                margin: 5px 0 0 0;
                opacity: 0.9;
                font-size: 0.9rem;
            }
            .template-corporate .inv-logo {
                max-width: 150px;
                max-height: 60px;
                object-fit: contain;
                filter: brightness(0) invert(1);
            }
            .template-corporate .inv-meta {
                text-align: right;
            }
            .template-corporate .inv-meta .inv-no {
                font-size: 1.5rem;
                font-weight: 700;
                margin: 0;
            }
            .template-corporate .inv-meta p {
                margin: 3px 0;
                font-size: 0.85rem;
                opacity: 0.9;
            }
            .template-corporate .inv-body {
                padding: 30px 40px;
            }
            .template-corporate .parties {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 30px;
            }
            .template-corporate .party-box {
                background: #f0f4f8;
                padding: 20px;
                border-radius: 8px;
            }
            .template-corporate .party-box h4 {
                color: #1e3a5f;
                font-size: 0.8rem;
                text-transform: uppercase;
                margin: 0 0 12px 0;
                font-weight: 700;
            }
            .template-corporate .party-box p {
                margin: 5px 0;
                font-size: 0.9rem;
            }
            .template-corporate .inv-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 25px;
            }
            .template-corporate .inv-table th {
                background: #1e3a5f;
                color: white;
                padding: 15px 12px;
                text-align: left;
                font-size: 0.85rem;
                font-weight: 700;
            }
            .template-corporate .inv-table td {
                padding: 15px 12px;
                font-size: 0.9rem;
                border-bottom: 1px solid #e2e8f0;
            }
            .template-corporate .inv-table tbody tr:nth-child(odd) {
                background: #f7fafc;
            }
            .template-corporate .inv-totals {
                max-width: 320px;
                margin-left: auto;
                background: #f0f4f8;
                padding: 20px;
                border-radius: 8px;
            }
            .template-corporate .total-line {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                font-size: 0.95rem;
            }
            .template-corporate .total-line.grand {
                background: #1e3a5f;
                color: white;
                margin: 15px -20px -20px -20px;
                padding: 15px 20px;
                border-radius: 0 0 8px 8px;
                font-weight: 700;
                font-size: 1.1rem;
            }
            .template-corporate .inv-notes {
                margin-top: 25px;
                padding: 15px 20px;
                background: #fffbeb;
                border-left: 4px solid #f59e0b;
                border-radius: 0 8px 8px 0;
            }
            .template-corporate .inv-footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
            }
            .template-corporate .footer-note {
                color: #718096;
                font-size: 0.75rem;
            }
            @media print {
                .template-corporate .inv-header {
                    background: #1e3a5f !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .template-corporate .inv-table th,
                .template-corporate .total-line.grand {
                    background: #1e3a5f !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .template-corporate .party-box,
                .template-corporate .inv-totals,
                .template-corporate .inv-table tbody tr:nth-child(odd) {
                    background: #f0f4f8 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `}</style>

        <div className="inv-header">
            <div className="header-left">
                {invoiceData.sellerLogo ? (
                    <img src={invoiceData.sellerLogo} alt="Logo" className="inv-logo" />
                ) : (
                    <h1>TAX INVOICE</h1>
                )}
                <p>{invoiceData.sellerName}</p>
            </div>
            <div className="inv-meta">
                <p className="inv-no">#{invoiceData.invoiceNo}</p>
                <p>Date: {invoiceData.invoiceDate}</p>
                {invoiceData.dueDate && <p>Due: {invoiceData.dueDate}</p>}
            </div>
        </div>

        <div className="inv-body">
            <div className="parties">
                <div className="party-box">
                    <h4>From</h4>
                    <p><strong>{invoiceData.sellerName}</strong></p>
                    {invoiceData.sellerAddress && <p>{invoiceData.sellerAddress}</p>}
                    {invoiceData.sellerGstin && <p>GSTIN: {invoiceData.sellerGstin}</p>}
                    {invoiceData.sellerEmail && <p>✉ {invoiceData.sellerEmail}</p>}
                    {invoiceData.sellerPhone && <p>☎ {invoiceData.sellerPhone}</p>}
                </div>
                <div className="party-box">
                    <h4>Bill To</h4>
                    <p><strong>{invoiceData.buyerName}</strong></p>
                    {invoiceData.buyerAddress && <p>{invoiceData.buyerAddress}</p>}
                    {invoiceData.buyerGstin && <p>GSTIN: {invoiceData.buyerGstin}</p>}
                    {invoiceData.buyerEmail && <p>✉ {invoiceData.buyerEmail}</p>}
                    {invoiceData.buyerPhone && <p>☎ {invoiceData.buyerPhone}</p>}
                </div>
            </div>

            <table className="inv-table">
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
                    {invoiceData.items.map((item, index) => (
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

            <div className="inv-totals">
                <div className="total-line"><span>Subtotal:</span><span>₹{totals.subtotal}</span></div>
                <div className="total-line"><span>CGST:</span><span>₹{totals.cgst}</span></div>
                <div className="total-line"><span>SGST:</span><span>₹{totals.sgst}</span></div>
                <div className="total-line grand"><span>TOTAL:</span><span>₹{totals.total}</span></div>
            </div>

            {invoiceData.notes && (
                <div className="inv-notes">
                    <strong>Notes:</strong> {invoiceData.notes}
                </div>
            )}

            <div className="inv-footer">
                <p>Authorized Signature: _______________________</p>
                <p className="footer-note">Computer generated invoice</p>
            </div>
        </div>
    </div>
);

// Template 4: Elegant Gradient
export const ElegantTemplate = ({ invoiceData, totals }) => (
    <div className="invoice-template template-elegant" id="invoice-to-print">
        <style>{`
            .template-elegant {
                background: white;
                color: #333;
                padding: 40px;
                font-family: 'Georgia', serif;
                min-height: 1123px;
            }
            .template-elegant .inv-header {
                text-align: center;
                padding-bottom: 30px;
                margin-bottom: 30px;
                border-bottom: 2px solid transparent;
                border-image: linear-gradient(90deg, #667eea, #764ba2) 1;
            }
            .template-elegant .inv-logo {
                max-width: 180px;
                max-height: 70px;
                object-fit: contain;
                margin-bottom: 15px;
            }
            .template-elegant .tax-title {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 2rem;
                margin: 0 0 10px 0;
                letter-spacing: 3px;
            }
            .template-elegant .seller-name {
                font-size: 1.1rem;
                color: #666;
                font-style: italic;
            }
            .template-elegant .inv-meta {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin-top: 20px;
            }
            .template-elegant .inv-meta p {
                margin: 0;
                font-size: 0.9rem;
                color: #555;
            }
            .template-elegant .parties {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 30px;
            }
            .template-elegant .party-box {
                background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .template-elegant .party-box h4 {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0 0 12px 0;
            }
            .template-elegant .party-box p {
                margin: 5px 0;
                font-size: 0.9rem;
            }
            .template-elegant .inv-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            .template-elegant .inv-table th {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 12px;
                text-align: left;
                font-size: 0.85rem;
                font-weight: 600;
            }
            .template-elegant .inv-table th:first-child {
                border-radius: 8px 0 0 0;
            }
            .template-elegant .inv-table th:last-child {
                border-radius: 0 8px 0 0;
            }
            .template-elegant .inv-table td {
                padding: 14px 12px;
                font-size: 0.9rem;
                border-bottom: 1px solid #eee;
            }
            .template-elegant .inv-totals {
                max-width: 300px;
                margin-left: auto;
                background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
                padding: 20px;
                border-radius: 12px;
            }
            .template-elegant .total-line {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                font-size: 0.95rem;
            }
            .template-elegant .total-line.grand {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 15px -20px -20px -20px;
                padding: 15px 20px;
                border-radius: 0 0 12px 12px;
                font-weight: 700;
                font-size: 1.1rem;
            }
            .template-elegant .inv-notes {
                margin-top: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #fef9f3 0%, #fff5eb 100%);
                border-radius: 12px;
                border: 1px solid #f0e6d8;
            }
            .template-elegant .inv-footer {
                margin-top: 40px;
                text-align: center;
            }
            .template-elegant .signature {
                margin-bottom: 20px;
            }
            .template-elegant .footer-note {
                color: #999;
                font-size: 0.8rem;
                font-style: italic;
            }
            @media print {
                .template-elegant { padding: 10mm !important; min-height: auto; }
                .template-elegant .inv-table th,
                .template-elegant .total-line.grand {
                    background: #667eea !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .template-elegant .party-box,
                .template-elegant .inv-totals {
                    background: #f5f7fa !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `}</style>

        <div className="inv-header">
            {invoiceData.sellerLogo && <img src={invoiceData.sellerLogo} alt="Logo" className="inv-logo" />}
            <h2 className="tax-title">TAX INVOICE</h2>
            <p className="seller-name">{invoiceData.sellerName}</p>
            <div className="inv-meta">
                <p><strong>Invoice:</strong> {invoiceData.invoiceNo}</p>
                <p><strong>Date:</strong> {invoiceData.invoiceDate}</p>
                {invoiceData.dueDate && <p><strong>Due:</strong> {invoiceData.dueDate}</p>}
            </div>
        </div>

        <div className="parties">
            <div className="party-box">
                <h4>✦ From</h4>
                <p><strong>{invoiceData.sellerName}</strong></p>
                {invoiceData.sellerAddress && <p>{invoiceData.sellerAddress}</p>}
                {invoiceData.sellerGstin && <p>GSTIN: {invoiceData.sellerGstin}</p>}
                {invoiceData.sellerEmail && <p>✉ {invoiceData.sellerEmail}</p>}
                {invoiceData.sellerPhone && <p>✆ {invoiceData.sellerPhone}</p>}
            </div>
            <div className="party-box">
                <h4>✦ To</h4>
                <p><strong>{invoiceData.buyerName}</strong></p>
                {invoiceData.buyerAddress && <p>{invoiceData.buyerAddress}</p>}
                {invoiceData.buyerGstin && <p>GSTIN: {invoiceData.buyerGstin}</p>}
                {invoiceData.buyerEmail && <p>✉ {invoiceData.buyerEmail}</p>}
                {invoiceData.buyerPhone && <p>✆ {invoiceData.buyerPhone}</p>}
            </div>
        </div>

        <table className="inv-table">
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
                {invoiceData.items.map((item, index) => (
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

        <div className="inv-totals">
            <div className="total-line"><span>Subtotal:</span><span>₹{totals.subtotal}</span></div>
            <div className="total-line"><span>CGST:</span><span>₹{totals.cgst}</span></div>
            <div className="total-line"><span>SGST:</span><span>₹{totals.sgst}</span></div>
            <div className="total-line grand"><span>Grand Total:</span><span>₹{totals.total}</span></div>
        </div>

        {invoiceData.notes && (
            <div className="inv-notes">
                <strong>Notes:</strong>
                <p style={{ margin: '8px 0 0 0' }}>{invoiceData.notes}</p>
            </div>
        )}

        <div className="inv-footer">
            <div className="signature"><p>Authorized Signature: _______________________</p></div>
            <p className="footer-note">~ This is a computer-generated invoice ~</p>
        </div>
    </div>
);

// Template 5: Compact Simple
export const CompactTemplate = ({ invoiceData, totals }) => (
    <div className="invoice-template template-compact" id="invoice-to-print">
        <style>{`
            .template-compact {
                background: white;
                color: #333;
                padding: 25px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                min-height: 1123px;
            }
            .template-compact .inv-header {
                display: flex;
                justify-content: space-between;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }
            .template-compact .header-left {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .template-compact .inv-logo {
                max-width: 80px;
                max-height: 40px;
                object-fit: contain;
            }
            .template-compact .tax-title {
                font-size: 16px;
                font-weight: 700;
                margin: 0;
            }
            .template-compact .inv-meta {
                text-align: right;
            }
            .template-compact .inv-meta p {
                margin: 2px 0;
            }
            .template-compact .parties {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px dashed #999;
            }
            .template-compact .party-box h4 {
                font-size: 11px;
                text-transform: uppercase;
                margin: 0 0 5px 0;
                text-decoration: underline;
            }
            .template-compact .party-box p {
                margin: 2px 0;
                font-size: 11px;
            }
            .template-compact .inv-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
            }
            .template-compact .inv-table th,
            .template-compact .inv-table td {
                border: 1px solid #333;
                padding: 6px 8px;
                text-align: left;
                font-size: 11px;
            }
            .template-compact .inv-table th {
                background: #eee;
                font-weight: 700;
            }
            .template-compact .inv-totals {
                max-width: 250px;
                margin-left: auto;
                border: 1px solid #333;
            }
            .template-compact .total-line {
                display: flex;
                justify-content: space-between;
                padding: 5px 10px;
                border-bottom: 1px solid #ccc;
            }
            .template-compact .total-line:last-child {
                border-bottom: none;
            }
            .template-compact .total-line.grand {
                background: #333;
                color: white;
                font-weight: 700;
            }
            .template-compact .inv-notes {
                margin-top: 15px;
                padding: 8px;
                border: 1px dashed #999;
                font-size: 11px;
            }
            .template-compact .inv-footer {
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                color: #666;
            }
            @media print {
                .template-compact { padding: 8mm !important; min-height: auto; }
                .template-compact .inv-table th {
                    background: #eee !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .template-compact .total-line.grand {
                    background: #333 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `}</style>

        <div className="inv-header">
            <div className="header-left">
                {invoiceData.sellerLogo && <img src={invoiceData.sellerLogo} alt="Logo" className="inv-logo" />}
                <div>
                    <h2 className="tax-title">TAX INVOICE</h2>
                    <p style={{ margin: '2px 0' }}>{invoiceData.sellerName}</p>
                </div>
            </div>
            <div className="inv-meta">
                <p><strong>No:</strong> {invoiceData.invoiceNo}</p>
                <p><strong>Date:</strong> {invoiceData.invoiceDate}</p>
                {invoiceData.dueDate && <p><strong>Due:</strong> {invoiceData.dueDate}</p>}
            </div>
        </div>

        <div className="parties">
            <div className="party-box">
                <h4>Seller</h4>
                <p><strong>{invoiceData.sellerName}</strong></p>
                {invoiceData.sellerAddress && <p>{invoiceData.sellerAddress}</p>}
                {invoiceData.sellerGstin && <p>GSTIN: {invoiceData.sellerGstin}</p>}
                {invoiceData.sellerEmail && <p>E: {invoiceData.sellerEmail}</p>}
                {invoiceData.sellerPhone && <p>T: {invoiceData.sellerPhone}</p>}
            </div>
            <div className="party-box">
                <h4>Buyer</h4>
                <p><strong>{invoiceData.buyerName}</strong></p>
                {invoiceData.buyerAddress && <p>{invoiceData.buyerAddress}</p>}
                {invoiceData.buyerGstin && <p>GSTIN: {invoiceData.buyerGstin}</p>}
                {invoiceData.buyerEmail && <p>E: {invoiceData.buyerEmail}</p>}
                {invoiceData.buyerPhone && <p>T: {invoiceData.buyerPhone}</p>}
            </div>
        </div>

        <table className="inv-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>GST%</th>
                    <th>Amt</th>
                </tr>
            </thead>
            <tbody>
                {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.description}</td>
                        <td>{item.hsn}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.rate}</td>
                        <td>{item.gstRate}</td>
                        <td>₹{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="inv-totals">
            <div className="total-line"><span>Subtotal:</span><span>₹{totals.subtotal}</span></div>
            <div className="total-line"><span>CGST:</span><span>₹{totals.cgst}</span></div>
            <div className="total-line"><span>SGST:</span><span>₹{totals.sgst}</span></div>
            <div className="total-line grand"><span>TOTAL:</span><span>₹{totals.total}</span></div>
        </div>

        {invoiceData.notes && (
            <div className="inv-notes">
                <strong>Notes:</strong> {invoiceData.notes}
            </div>
        )}

        <div className="inv-footer">
            <p>Signature: _______________</p>
            <p>Computer generated</p>
        </div>
    </div>
);

// Template metadata for selection UI
export const templateList = [
    {
        id: 'classic',
        name: 'Classic Professional',
        description: 'Traditional blue theme',
        component: ClassicTemplate,
        color: '#2b4c7e'
    },
    {
        id: 'modern',
        name: 'Modern Minimal',
        description: 'Clean monochrome design',
        component: ModernTemplate,
        color: '#1a1a1a'
    },
    {
        id: 'corporate',
        name: 'Bold Corporate',
        description: 'Strong business style',
        component: CorporateTemplate,
        color: '#1e3a5f'
    },
    {
        id: 'elegant',
        name: 'Elegant Gradient',
        description: 'Purple-blue gradient',
        component: ElegantTemplate,
        color: '#667eea'
    },
    {
        id: 'compact',
        name: 'Compact Simple',
        description: 'Dense minimal layout',
        component: CompactTemplate,
        color: '#333333'
    }
];
