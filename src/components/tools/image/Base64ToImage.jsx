import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const Base64ToImage = () => {
    const [base64, setBase64] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'base64-to-image').slice(0, 3);

    const convert = () => {
        if (!base64.trim()) { setError('Enter Base64 string'); return; }
        setError('');
        try {
            let src = base64.trim();
            if (!src.startsWith('data:image')) src = 'data:image/png;base64,' + src;
            setImage(src);
        } catch (e) { setError('Invalid Base64 string'); }
    };

    const download = () => {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = image;
        link.click();
    };

    const faqs = [
        { question: 'What Base64 format should I use?', answer: 'You can paste just the Base64 string, or include the data URI prefix (data:image/png;base64,...). The tool handles both formats.' },
        { question: 'What image formats are supported?', answer: 'Base64 can represent any image format: PNG, JPG, GIF, WebP, SVG, etc. The format is indicated in the data URI prefix.' }
    ];

    const seoContent = (<><h2>Base64 to Image Converter</h2><p>Convert Base64 encoded strings back to viewable and downloadable images. Useful for debugging or extracting embedded images.</p></>);

    return (
        <ToolLayout title="Base64 to Image Converter" description="Convert Base64 strings to images. Decode and download Base64 encoded images." keywords={['base64 to image', 'base64 decoder', 'image decoder', 'data URI']} category="image" categoryName="Image & Design" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Paste Base64 String</label><textarea className="form-input" value={base64} onChange={(e) => setBase64(e.target.value)} rows={6} placeholder="data:image/png;base64,iVBORw0KGgo..." /></div>
                {error && <p className="error">{error}</p>}
                <button className="btn btn-primary btn-lg" onClick={convert}>Convert to Image</button>
                {image && (
                    <div className="result-box">
                        <div className="image-preview"><img src={image} alt="Converted" onError={() => setError('Invalid Base64 image')} /></div>
                        <button className="btn btn-secondary" onClick={download}>⬇️ Download Image</button>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto;text-align:center}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);font-family:var(--font-mono);font-size:var(--text-xs)}.error{color:var(--error);margin-bottom:var(--spacing-md)}.image-preview{margin-bottom:var(--spacing-md);padding:var(--spacing-lg);background:var(--bg-secondary);border-radius:var(--radius)}.image-preview img{max-width:100%;max-height:400px}`}</style>
        </ToolLayout>
    );
};

export default Base64ToImage;
