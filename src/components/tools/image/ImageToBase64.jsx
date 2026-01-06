import { useState, useRef } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const ImageToBase64 = () => {
    const [base64, setBase64] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState(0);

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'image-to-base64').slice(0, 3);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);
        setFileSize(file.size);
        const reader = new FileReader();
        reader.onload = (e) => setBase64(e.target.result);
        reader.readAsDataURL(file);
    };

    const copyBase64 = () => { navigator.clipboard.writeText(base64); alert('Copied!'); };

    const faqs = [
        { question: 'What is Base64?', answer: 'Base64 is a way to encode binary data (like images) as text. This allows images to be embedded directly in HTML or CSS without separate files.' },
        { question: 'When to use Base64 images?', answer: 'For small images, icons, or when you want to reduce HTTP requests. Not recommended for large images as it increases file size by ~33%.' }
    ];

    const seoContent = (<><h2>Image to Base64 Converter</h2><p>Convert images to Base64 encoded strings. Embed images directly in HTML or CSS without external files.</p></>);

    return (
        <ToolLayout title="Image to Base64 Converter" description="Convert images to Base64 encoded strings for embedding in HTML/CSS." keywords={['image to base64', 'base64 converter', 'image encoder', 'data URI']} category="image" categoryName="Image & Design" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="upload-area"><input type="file" accept="image/*" onChange={handleUpload} id="base64-upload" /><label htmlFor="base64-upload"><span>📁</span><span>Drop image or click to upload</span></label></div>
                {base64 && (
                    <div className="result-box">
                        <div className="file-info"><strong>{fileName}</strong> ({(fileSize / 1024).toFixed(2)} KB → {(base64.length / 1024).toFixed(2)} KB as Base64)</div>
                        <div className="preview"><img src={base64} alt="Preview" /></div>
                        <div className="output-box"><textarea value={base64} readOnly rows={6} /><button className="copy-btn" onClick={copyBase64}>📋 Copy Base64</button></div>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.upload-area input{display:none}.upload-area label{display:flex;flex-direction:column;align-items:center;justify-content:center;height:150px;border:3px dashed var(--platinum);border-radius:var(--radius-lg);cursor:pointer}.upload-area label:hover{border-color:var(--yinmn-blue)}.upload-area label span:first-child{font-size:var(--text-3xl);margin-bottom:var(--spacing-sm)}.file-info{margin-bottom:var(--spacing-md);font-size:var(--text-sm)}.preview{margin-bottom:var(--spacing-md);text-align:center}.preview img{max-height:150px;max-width:100%;border-radius:var(--radius)}.output-box{position:relative}.output-box textarea{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);font-family:var(--font-mono);font-size:var(--text-xs);resize:none}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default ImageToBase64;
