import { useState, useRef, useCallback, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import '../../../styles/tools.css';

// Generate unique IDs
let idCounter = 0;
const generateId = () => `el_${++idCounter}`;

const SvgEditor = () => {
    // Canvas state
    const [elements, setElements] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeTool, setActiveTool] = useState('select');
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [showGrid, setShowGrid] = useState(true);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

    // Drawing state
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawStart, setDrawStart] = useState(null);
    const [tempElement, setTempElement] = useState(null);

    // Style state
    const [fillColor, setFillColor] = useState('#4a90d9');
    const [strokeColor, setStrokeColor] = useState('#333333');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [fillOpacity, setFillOpacity] = useState(100);
    const [cornerRadius, setCornerRadius] = useState(0);

    // Text state
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [editingText, setEditingText] = useState(null);

    // Layers/history
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Polygon/Star
    const [polygonSides, setPolygonSides] = useState(6);
    const [starPoints, setStarPoints] = useState(5);
    const [starInnerRadius, setStarInnerRadius] = useState(50);

    // Freehand path
    const [currentPath, setCurrentPath] = useState([]);

    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'svg-editor').slice(0, 3);

    // Tool definitions
    const tools = [
        { id: 'select', icon: '👆', name: 'Select', key: 'V' },
        { id: 'rect', icon: '⬜', name: 'Rectangle', key: 'R' },
        { id: 'ellipse', icon: '⬭', name: 'Ellipse', key: 'E' },
        { id: 'line', icon: '╱', name: 'Line', key: 'L' },
        { id: 'polygon', icon: '⬡', name: 'Polygon', key: 'G' },
        { id: 'star', icon: '⭐', name: 'Star', key: 'S' },
        { id: 'text', icon: 'T', name: 'Text', key: 'T' },
        { id: 'brush', icon: '🖌️', name: 'Brush', key: 'B' },
        { id: 'pen', icon: '✒️', name: 'Pen', key: 'P' }
    ];

    // Save to history
    const saveToHistory = useCallback((newElements) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newElements)));
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    // Undo
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setElements(JSON.parse(JSON.stringify(history[historyIndex - 1])));
        }
    }, [history, historyIndex]);

    // Redo
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setElements(JSON.parse(JSON.stringify(history[historyIndex + 1])));
        }
    }, [history, historyIndex]);

    // Get mouse position relative to SVG
    const getMousePos = (e) => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };
        const rect = svg.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / zoom - pan.x,
            y: (e.clientY - rect.top) / zoom - pan.y
        };
    };

    // Create element based on tool
    const createElement = (type, start, end) => {
        const minX = Math.min(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);

        const baseProps = {
            id: generateId(),
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
            opacity: fillOpacity / 100,
            locked: false,
            visible: true
        };

        switch (type) {
            case 'rect':
                return {
                    ...baseProps,
                    type: 'rect',
                    x: minX,
                    y: minY,
                    width,
                    height,
                    rx: cornerRadius
                };
            case 'ellipse':
                return {
                    ...baseProps,
                    type: 'ellipse',
                    cx: minX + width / 2,
                    cy: minY + height / 2,
                    rx: width / 2,
                    ry: height / 2
                };
            case 'line':
                return {
                    ...baseProps,
                    type: 'line',
                    x1: start.x,
                    y1: start.y,
                    x2: end.x,
                    y2: end.y,
                    fill: 'none'
                };
            case 'polygon': {
                const cx = minX + width / 2;
                const cy = minY + height / 2;
                const r = Math.min(width, height) / 2;
                const points = [];
                for (let i = 0; i < polygonSides; i++) {
                    const angle = (i * 2 * Math.PI) / polygonSides - Math.PI / 2;
                    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
                }
                return {
                    ...baseProps,
                    type: 'polygon',
                    points: points.join(' '),
                    cx, cy, r, sides: polygonSides
                };
            }
            case 'star': {
                const cx = minX + width / 2;
                const cy = minY + height / 2;
                const outerR = Math.min(width, height) / 2;
                const innerR = outerR * (starInnerRadius / 100);
                const points = [];
                for (let i = 0; i < starPoints * 2; i++) {
                    const angle = (i * Math.PI) / starPoints - Math.PI / 2;
                    const r = i % 2 === 0 ? outerR : innerR;
                    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
                }
                return {
                    ...baseProps,
                    type: 'polygon',
                    points: points.join(' '),
                    cx, cy, outerR, innerR, starPoints
                };
            }
            default:
                return null;
        }
    };

    // Handle mouse down
    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // Left click only

        const pos = getMousePos(e);

        if (activeTool === 'select') {
            // Check if clicking on an element
            const clickedElement = [...elements].reverse().find(el => {
                if (!el.visible || el.locked) return false;
                return isPointInElement(pos, el);
            });

            if (clickedElement) {
                if (e.shiftKey) {
                    setSelectedIds(prev =>
                        prev.includes(clickedElement.id)
                            ? prev.filter(id => id !== clickedElement.id)
                            : [...prev, clickedElement.id]
                    );
                } else {
                    setSelectedIds([clickedElement.id]);
                }
            } else {
                setSelectedIds([]);
            }
        } else if (activeTool === 'text') {
            // Add text element
            const textEl = {
                id: generateId(),
                type: 'text',
                x: pos.x,
                y: pos.y,
                text: 'Text',
                fontSize,
                fontFamily,
                fill: fillColor,
                stroke: 'none',
                strokeWidth: 0,
                opacity: fillOpacity / 100,
                locked: false,
                visible: true
            };
            const newElements = [...elements, textEl];
            setElements(newElements);
            saveToHistory(newElements);
            setSelectedIds([textEl.id]);
            setEditingText(textEl.id);
        } else if (activeTool === 'brush') {
            setIsDrawing(true);
            setCurrentPath([pos]);
        } else if (['rect', 'ellipse', 'line', 'polygon', 'star'].includes(activeTool)) {
            setIsDrawing(true);
            setDrawStart(pos);
        }
    };

    // Check if point is inside element
    const isPointInElement = (point, el) => {
        switch (el.type) {
            case 'rect':
                return point.x >= el.x && point.x <= el.x + el.width &&
                    point.y >= el.y && point.y <= el.y + el.height;
            case 'ellipse': {
                const dx = (point.x - el.cx) / el.rx;
                const dy = (point.y - el.cy) / el.ry;
                return dx * dx + dy * dy <= 1;
            }
            case 'text':
                return point.x >= el.x && point.x <= el.x + 100 &&
                    point.y >= el.y - el.fontSize && point.y <= el.y;
            case 'line': {
                const d = distToSegment(point, { x: el.x1, y: el.y1 }, { x: el.x2, y: el.y2 });
                return d < 10;
            }
            default:
                return false;
        }
    };

    // Distance to line segment
    const distToSegment = (p, v, w) => {
        const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
        if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
    };

    // Handle mouse move
    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const pos = getMousePos(e);

        if (activeTool === 'brush' && currentPath.length > 0) {
            setCurrentPath(prev => [...prev, pos]);
        } else if (drawStart) {
            const temp = createElement(activeTool, drawStart, pos);
            setTempElement(temp);
        }
    };

    // Handle mouse up
    const handleMouseUp = () => {
        if (!isDrawing) return;

        if (activeTool === 'brush' && currentPath.length > 1) {
            const pathData = `M ${currentPath.map(p => `${p.x} ${p.y}`).join(' L ')}`;
            const brushEl = {
                id: generateId(),
                type: 'path',
                d: pathData,
                fill: 'none',
                stroke: strokeColor,
                strokeWidth,
                opacity: fillOpacity / 100,
                locked: false,
                visible: true
            };
            const newElements = [...elements, brushEl];
            setElements(newElements);
            saveToHistory(newElements);
            setCurrentPath([]);
        } else if (tempElement) {
            const newElements = [...elements, tempElement];
            setElements(newElements);
            saveToHistory(newElements);
            setSelectedIds([tempElement.id]);
            setTempElement(null);
        }

        setIsDrawing(false);
        setDrawStart(null);
    };

    // Delete selected
    const deleteSelected = () => {
        if (selectedIds.length === 0) return;
        const newElements = elements.filter(el => !selectedIds.includes(el.id));
        setElements(newElements);
        saveToHistory(newElements);
        setSelectedIds([]);
        toast.success('Deleted');
    };

    // Duplicate selected
    const duplicateSelected = () => {
        if (selectedIds.length === 0) return;
        const newElements = [...elements];
        selectedIds.forEach(id => {
            const el = elements.find(e => e.id === id);
            if (el) {
                const cloned = { ...el, id: generateId() };
                // Offset the clone
                if (cloned.x !== undefined) cloned.x += 20;
                if (cloned.y !== undefined) cloned.y += 20;
                if (cloned.cx !== undefined) cloned.cx += 20;
                if (cloned.cy !== undefined) cloned.cy += 20;
                if (cloned.x1 !== undefined) { cloned.x1 += 20; cloned.x2 += 20; }
                if (cloned.y1 !== undefined) { cloned.y1 += 20; cloned.y2 += 20; }
                newElements.push(cloned);
            }
        });
        setElements(newElements);
        saveToHistory(newElements);
        toast.success('Duplicated');
    };

    // Move layer
    const moveLayer = (direction) => {
        if (selectedIds.length !== 1) return;
        const idx = elements.findIndex(el => el.id === selectedIds[0]);
        if (idx === -1) return;

        const newElements = [...elements];
        if (direction === 'up' && idx < newElements.length - 1) {
            [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
        } else if (direction === 'down' && idx > 0) {
            [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
        } else if (direction === 'top') {
            const [el] = newElements.splice(idx, 1);
            newElements.push(el);
        } else if (direction === 'bottom') {
            const [el] = newElements.splice(idx, 1);
            newElements.unshift(el);
        }
        setElements(newElements);
        saveToHistory(newElements);
    };

    // Update selected element property
    const updateSelectedProperty = (prop, value) => {
        if (selectedIds.length === 0) return;
        const newElements = elements.map(el => {
            if (selectedIds.includes(el.id)) {
                return { ...el, [prop]: value };
            }
            return el;
        });
        setElements(newElements);
    };

    // Apply style to selected
    const applyStyleToSelected = () => {
        const newElements = elements.map(el => {
            if (selectedIds.includes(el.id)) {
                return {
                    ...el,
                    fill: el.type === 'line' || el.type === 'path' ? 'none' : fillColor,
                    stroke: strokeColor,
                    strokeWidth,
                    opacity: fillOpacity / 100,
                    ...(el.type === 'rect' ? { rx: cornerRadius } : {})
                };
            }
            return el;
        });
        setElements(newElements);
        saveToHistory(newElements);
    };

    // Export as SVG
    const exportSvg = () => {
        const svgContent = generateSvgCode();
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'drawing.svg';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Exported as SVG!');
    };

    // Generate SVG code
    const generateSvgCode = () => {
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize.width}" height="${canvasSize.height}" viewBox="0 0 ${canvasSize.width} ${canvasSize.height}">`;

        elements.filter(el => el.visible).forEach(el => {
            const style = `fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" opacity="${el.opacity}"`;

            switch (el.type) {
                case 'rect':
                    svgContent += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.rx || 0}" ${style}/>`;
                    break;
                case 'ellipse':
                    svgContent += `<ellipse cx="${el.cx}" cy="${el.cy}" rx="${el.rx}" ry="${el.ry}" ${style}/>`;
                    break;
                case 'line':
                    svgContent += `<line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" opacity="${el.opacity}"/>`;
                    break;
                case 'polygon':
                    svgContent += `<polygon points="${el.points}" ${style}/>`;
                    break;
                case 'path':
                    svgContent += `<path d="${el.d}" ${style}/>`;
                    break;
                case 'text':
                    svgContent += `<text x="${el.x}" y="${el.y}" font-size="${el.fontSize}" font-family="${el.fontFamily}" fill="${el.fill}" opacity="${el.opacity}">${el.text}</text>`;
                    break;
            }
        });

        svgContent += '</svg>';
        return svgContent;
    };

    // Export as PNG
    const exportPng = async () => {
        const svgContent = generateSvgCode();
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            const link = document.createElement('a');
            link.download = 'drawing.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            URL.revokeObjectURL(url);
            toast.success('Exported as PNG!');
        };
        img.src = url;
    };

    // Import SVG
    const importSvg = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            // Simple parsing - just display as text for now
            // A full implementation would parse the SVG properly
            toast.info('SVG import is basic - complex SVGs may not import perfectly');

            // Parse basic shapes from SVG
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'image/svg+xml');
            const importedElements = [];

            doc.querySelectorAll('rect').forEach(rect => {
                importedElements.push({
                    id: generateId(),
                    type: 'rect',
                    x: parseFloat(rect.getAttribute('x')) || 0,
                    y: parseFloat(rect.getAttribute('y')) || 0,
                    width: parseFloat(rect.getAttribute('width')) || 100,
                    height: parseFloat(rect.getAttribute('height')) || 100,
                    rx: parseFloat(rect.getAttribute('rx')) || 0,
                    fill: rect.getAttribute('fill') || '#cccccc',
                    stroke: rect.getAttribute('stroke') || 'none',
                    strokeWidth: parseFloat(rect.getAttribute('stroke-width')) || 0,
                    opacity: parseFloat(rect.getAttribute('opacity')) || 1,
                    visible: true,
                    locked: false
                });
            });

            doc.querySelectorAll('ellipse, circle').forEach(el => {
                const isCircle = el.tagName === 'circle';
                importedElements.push({
                    id: generateId(),
                    type: 'ellipse',
                    cx: parseFloat(el.getAttribute('cx')) || 0,
                    cy: parseFloat(el.getAttribute('cy')) || 0,
                    rx: parseFloat(el.getAttribute(isCircle ? 'r' : 'rx')) || 50,
                    ry: parseFloat(el.getAttribute(isCircle ? 'r' : 'ry')) || 50,
                    fill: el.getAttribute('fill') || '#cccccc',
                    stroke: el.getAttribute('stroke') || 'none',
                    strokeWidth: parseFloat(el.getAttribute('stroke-width')) || 0,
                    opacity: parseFloat(el.getAttribute('opacity')) || 1,
                    visible: true,
                    locked: false
                });
            });

            if (importedElements.length > 0) {
                const newElements = [...elements, ...importedElements];
                setElements(newElements);
                saveToHistory(newElements);
                toast.success(`Imported ${importedElements.length} elements`);
            }
        };
        reader.readAsText(file);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if editing text
            if (editingText) return;

            const key = e.key.toLowerCase();

            if (e.ctrlKey || e.metaKey) {
                if (key === 'z') { e.preventDefault(); undo(); }
                if (key === 'y') { e.preventDefault(); redo(); }
                if (key === 'c') { /* copy */ }
                if (key === 'v') { /* paste */ }
                if (key === 'd') { e.preventDefault(); duplicateSelected(); }
            } else {
                if (key === 'v') setActiveTool('select');
                if (key === 'r') setActiveTool('rect');
                if (key === 'e') setActiveTool('ellipse');
                if (key === 'l') setActiveTool('line');
                if (key === 'g') setActiveTool('polygon');
                if (key === 's') setActiveTool('star');
                if (key === 't') setActiveTool('text');
                if (key === 'b') setActiveTool('brush');
                if (key === 'delete' || key === 'backspace') deleteSelected();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editingText, undo, redo, duplicateSelected, deleteSelected]);

    // Initialize history
    useEffect(() => {
        if (history.length === 0) {
            setHistory([[]]);
            setHistoryIndex(0);
        }
    }, []);

    // Render element
    const renderElement = (el) => {
        if (!el.visible) return null;

        const isSelected = selectedIds.includes(el.id);
        const commonProps = {
            key: el.id,
            style: { cursor: activeTool === 'select' ? 'move' : 'default' }
        };

        switch (el.type) {
            case 'rect':
                return (
                    <g {...commonProps}>
                        <rect
                            x={el.x}
                            y={el.y}
                            width={el.width}
                            height={el.height}
                            rx={el.rx}
                            fill={el.fill}
                            stroke={el.stroke}
                            strokeWidth={el.strokeWidth}
                            opacity={el.opacity}
                        />
                        {isSelected && (
                            <rect
                                x={el.x - 2}
                                y={el.y - 2}
                                width={el.width + 4}
                                height={el.height + 4}
                                fill="none"
                                stroke="#0066ff"
                                strokeWidth={1}
                                strokeDasharray="4,4"
                            />
                        )}
                    </g>
                );
            case 'ellipse':
                return (
                    <g {...commonProps}>
                        <ellipse
                            cx={el.cx}
                            cy={el.cy}
                            rx={el.rx}
                            ry={el.ry}
                            fill={el.fill}
                            stroke={el.stroke}
                            strokeWidth={el.strokeWidth}
                            opacity={el.opacity}
                        />
                        {isSelected && (
                            <rect
                                x={el.cx - el.rx - 2}
                                y={el.cy - el.ry - 2}
                                width={el.rx * 2 + 4}
                                height={el.ry * 2 + 4}
                                fill="none"
                                stroke="#0066ff"
                                strokeWidth={1}
                                strokeDasharray="4,4"
                            />
                        )}
                    </g>
                );
            case 'line':
                return (
                    <g {...commonProps}>
                        <line
                            x1={el.x1}
                            y1={el.y1}
                            x2={el.x2}
                            y2={el.y2}
                            stroke={el.stroke}
                            strokeWidth={el.strokeWidth}
                            opacity={el.opacity}
                        />
                        {isSelected && (
                            <>
                                <circle cx={el.x1} cy={el.y1} r={5} fill="#0066ff" />
                                <circle cx={el.x2} cy={el.y2} r={5} fill="#0066ff" />
                            </>
                        )}
                    </g>
                );
            case 'polygon':
                return (
                    <g {...commonProps}>
                        <polygon
                            points={el.points}
                            fill={el.fill}
                            stroke={el.stroke}
                            strokeWidth={el.strokeWidth}
                            opacity={el.opacity}
                        />
                        {isSelected && el.cx && (
                            <circle
                                cx={el.cx}
                                cy={el.cy}
                                r={(el.outerR || el.r) + 5}
                                fill="none"
                                stroke="#0066ff"
                                strokeWidth={1}
                                strokeDasharray="4,4"
                            />
                        )}
                    </g>
                );
            case 'path':
                return (
                    <g {...commonProps}>
                        <path
                            d={el.d}
                            fill={el.fill}
                            stroke={el.stroke}
                            strokeWidth={el.strokeWidth}
                            opacity={el.opacity}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                );
            case 'text':
                return (
                    <g {...commonProps}>
                        {editingText === el.id ? (
                            <foreignObject x={el.x} y={el.y - el.fontSize} width={300} height={el.fontSize + 10}>
                                <input
                                    type="text"
                                    defaultValue={el.text}
                                    autoFocus
                                    style={{
                                        fontSize: el.fontSize,
                                        fontFamily: el.fontFamily,
                                        border: '1px solid #0066ff',
                                        outline: 'none',
                                        background: 'white',
                                        padding: '2px'
                                    }}
                                    onBlur={(e) => {
                                        updateSelectedProperty('text', e.target.value);
                                        setEditingText(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            updateSelectedProperty('text', e.target.value);
                                            setEditingText(null);
                                        }
                                    }}
                                />
                            </foreignObject>
                        ) : (
                            <>
                                <text
                                    x={el.x}
                                    y={el.y}
                                    fontSize={el.fontSize}
                                    fontFamily={el.fontFamily}
                                    fill={el.fill}
                                    opacity={el.opacity}
                                    onDoubleClick={() => {
                                        setSelectedIds([el.id]);
                                        setEditingText(el.id);
                                    }}
                                >
                                    {el.text}
                                </text>
                                {isSelected && (
                                    <rect
                                        x={el.x - 2}
                                        y={el.y - el.fontSize}
                                        width={el.text.length * el.fontSize * 0.6 + 4}
                                        height={el.fontSize + 4}
                                        fill="none"
                                        stroke="#0066ff"
                                        strokeWidth={1}
                                        strokeDasharray="4,4"
                                    />
                                )}
                            </>
                        )}
                    </g>
                );
            default:
                return null;
        }
    };

    const selectedElement = selectedIds.length === 1
        ? elements.find(el => el.id === selectedIds[0])
        : null;

    const faqs = [
        { question: 'What shapes can I create?', answer: 'Rectangles, ellipses, lines, polygons (3-12 sides), stars, text, and freehand paths.' },
        { question: 'How do I edit text?', answer: 'Double-click on text to edit it. Press Enter to confirm.' },
        { question: 'What export formats are available?', answer: 'Export as SVG (vector) or PNG (raster). You can also import existing SVG files.' }
    ];

    const seoContent = (
        <>
            <h2>SVG Editor</h2>
            <p>Create and edit vector graphics in your browser. Draw shapes, add text, customize colors and styles. Export as SVG or PNG. Free online vector editor.</p>
        </>
    );

    return (
        <ToolLayout
            title="SVG Editor"
            description="Create and edit vector graphics. Draw shapes, add text, export as SVG or PNG."
            keywords={['svg editor', 'vector editor', 'draw shapes', 'online illustrator', 'vector graphics']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="svg-editor">
                {/* Toolbar */}
                <div className="editor-toolbar">
                    <div className="tool-group">
                        {tools.map(tool => (
                            <button
                                key={tool.id}
                                className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
                                onClick={() => setActiveTool(tool.id)}
                                title={`${tool.name} (${tool.key})`}
                            >
                                {tool.icon}
                            </button>
                        ))}
                    </div>

                    <div className="tool-group">
                        <button className="tool-btn" onClick={undo} title="Undo (Ctrl+Z)">↩️</button>
                        <button className="tool-btn" onClick={redo} title="Redo (Ctrl+Y)">↪️</button>
                    </div>

                    <div className="tool-group">
                        <button className="tool-btn" onClick={() => setZoom(z => Math.min(3, z + 0.25))}>➕</button>
                        <span className="zoom-display">{Math.round(zoom * 100)}%</span>
                        <button className="tool-btn" onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}>➖</button>
                        <button className="tool-btn" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>🔄</button>
                    </div>

                    <div className="tool-group">
                        <label className="grid-toggle">
                            <input
                                type="checkbox"
                                checked={showGrid}
                                onChange={(e) => setShowGrid(e.target.checked)}
                            />
                            Grid
                        </label>
                    </div>

                    <div className="tool-group export-group">
                        <label className="import-btn">
                            📂 Import
                            <input type="file" accept=".svg" onChange={importSvg} hidden />
                        </label>
                        <button className="btn btn-secondary btn-sm" onClick={exportSvg}>SVG</button>
                        <button className="btn btn-primary btn-sm" onClick={exportPng}>PNG</button>
                    </div>
                </div>

                <div className="editor-main">
                    {/* Layers Panel */}
                    <div className="layers-panel">
                        <h4>Layers</h4>
                        <div className="layers-list">
                            {[...elements].reverse().map(el => (
                                <div
                                    key={el.id}
                                    className={`layer-item ${selectedIds.includes(el.id) ? 'selected' : ''}`}
                                    onClick={() => setSelectedIds([el.id])}
                                >
                                    <button
                                        className="layer-visibility"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateSelectedProperty('visible', !el.visible);
                                            setSelectedIds([el.id]);
                                            setTimeout(() => {
                                                const newEls = elements.map(e => e.id === el.id ? { ...e, visible: !el.visible } : e);
                                                setElements(newEls);
                                            }, 0);
                                        }}
                                    >
                                        {el.visible ? '👁' : '👁‍🗨'}
                                    </button>
                                    <span className="layer-name">{el.type}</span>
                                    <button
                                        className="layer-lock"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newEls = elements.map(e => e.id === el.id ? { ...e, locked: !el.locked } : e);
                                            setElements(newEls);
                                        }}
                                    >
                                        {el.locked ? '🔒' : '🔓'}
                                    </button>
                                </div>
                            ))}
                        </div>
                        {selectedIds.length === 1 && (
                            <div className="layer-actions">
                                <button onClick={() => moveLayer('top')} title="Bring to front">⬆⬆</button>
                                <button onClick={() => moveLayer('up')} title="Bring forward">⬆</button>
                                <button onClick={() => moveLayer('down')} title="Send backward">⬇</button>
                                <button onClick={() => moveLayer('bottom')} title="Send to back">⬇⬇</button>
                            </div>
                        )}
                    </div>

                    {/* Canvas */}
                    <div
                        className="canvas-container"
                        ref={containerRef}
                        onWheel={(e) => {
                            if (e.ctrlKey) {
                                e.preventDefault();
                                setZoom(z => Math.max(0.25, Math.min(3, z - e.deltaY * 0.001)));
                            }
                        }}
                    >
                        <svg
                            ref={svgRef}
                            className="editor-canvas"
                            width={canvasSize.width * zoom}
                            height={canvasSize.height * zoom}
                            viewBox={`${-pan.x} ${-pan.y} ${canvasSize.width} ${canvasSize.height}`}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {/* Background */}
                            <rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill="white" />

                            {/* Grid */}
                            {showGrid && (
                                <g opacity={0.1}>
                                    {Array.from({ length: Math.ceil(canvasSize.width / 20) }, (_, i) => (
                                        <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={canvasSize.height} stroke="#000" strokeWidth={0.5} />
                                    ))}
                                    {Array.from({ length: Math.ceil(canvasSize.height / 20) }, (_, i) => (
                                        <line key={`h${i}`} x1={0} y1={i * 20} x2={canvasSize.width} y2={i * 20} stroke="#000" strokeWidth={0.5} />
                                    ))}
                                </g>
                            )}

                            {/* Elements */}
                            {elements.map(renderElement)}

                            {/* Temp element while drawing */}
                            {tempElement && renderElement({ ...tempElement, id: 'temp' })}

                            {/* Freehand path while drawing */}
                            {currentPath.length > 1 && (
                                <path
                                    d={`M ${currentPath.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}
                        </svg>
                    </div>

                    {/* Properties Panel */}
                    <div className="properties-panel">
                        <h4>Properties</h4>

                        {/* Style options based on tool */}
                        <div className="prop-section">
                            <label>Fill Color</label>
                            <input
                                type="color"
                                value={fillColor}
                                onChange={(e) => setFillColor(e.target.value)}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Stroke Color</label>
                            <input
                                type="color"
                                value={strokeColor}
                                onChange={(e) => setStrokeColor(e.target.value)}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Stroke Width: {strokeWidth}px</label>
                            <input
                                type="range"
                                min={0}
                                max={20}
                                value={strokeWidth}
                                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="prop-section">
                            <label>Opacity: {fillOpacity}%</label>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={fillOpacity}
                                onChange={(e) => setFillOpacity(parseInt(e.target.value))}
                            />
                        </div>

                        {activeTool === 'rect' && (
                            <div className="prop-section">
                                <label>Corner Radius: {cornerRadius}px</label>
                                <input
                                    type="range"
                                    min={0}
                                    max={50}
                                    value={cornerRadius}
                                    onChange={(e) => setCornerRadius(parseInt(e.target.value))}
                                />
                            </div>
                        )}

                        {activeTool === 'polygon' && (
                            <div className="prop-section">
                                <label>Sides: {polygonSides}</label>
                                <input
                                    type="range"
                                    min={3}
                                    max={12}
                                    value={polygonSides}
                                    onChange={(e) => setPolygonSides(parseInt(e.target.value))}
                                />
                            </div>
                        )}

                        {activeTool === 'star' && (
                            <>
                                <div className="prop-section">
                                    <label>Points: {starPoints}</label>
                                    <input
                                        type="range"
                                        min={3}
                                        max={12}
                                        value={starPoints}
                                        onChange={(e) => setStarPoints(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="prop-section">
                                    <label>Inner Radius: {starInnerRadius}%</label>
                                    <input
                                        type="range"
                                        min={10}
                                        max={90}
                                        value={starInnerRadius}
                                        onChange={(e) => setStarInnerRadius(parseInt(e.target.value))}
                                    />
                                </div>
                            </>
                        )}

                        {activeTool === 'text' && (
                            <>
                                <div className="prop-section">
                                    <label>Font Size: {fontSize}px</label>
                                    <input
                                        type="range"
                                        min={8}
                                        max={72}
                                        value={fontSize}
                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="prop-section">
                                    <label>Font</label>
                                    <select
                                        value={fontFamily}
                                        onChange={(e) => setFontFamily(e.target.value)}
                                    >
                                        <option>Arial</option>
                                        <option>Helvetica</option>
                                        <option>Georgia</option>
                                        <option>Times New Roman</option>
                                        <option>Courier New</option>
                                        <option>Verdana</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {selectedIds.length > 0 && (
                            <>
                                <hr />
                                <button className="btn btn-secondary btn-full" onClick={applyStyleToSelected}>
                                    Apply Style
                                </button>
                                <button className="btn btn-secondary btn-full" onClick={duplicateSelected}>
                                    Duplicate
                                </button>
                                <button className="btn btn-danger btn-full" onClick={deleteSelected}>
                                    Delete
                                </button>
                            </>
                        )}

                        {selectedElement && (
                            <>
                                <hr />
                                <h4>Selected: {selectedElement.type}</h4>
                                {selectedElement.type === 'text' && (
                                    <div className="prop-section">
                                        <label>Text</label>
                                        <input
                                            type="text"
                                            value={selectedElement.text}
                                            onChange={(e) => {
                                                const newEls = elements.map(el =>
                                                    el.id === selectedElement.id ? { ...el, text: e.target.value } : el
                                                );
                                                setElements(newEls);
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .svg-editor { display: flex; flex-direction: column; min-height: 600px; }
        
        .editor-toolbar {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm);
          background: var(--bg-secondary);
          border-radius: var(--radius);
          flex-wrap: wrap;
        }
        
        .tool-group {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        
        .tool-btn {
          width: 36px;
          height: 36px;
          border: 1px solid var(--platinum);
          background: white;
          border-radius: var(--radius);
          cursor: pointer;
          font-size: 16px;
          transition: all 0.15s ease;
        }
        
        .tool-btn:hover { border-color: var(--yinmn-blue); }
        .tool-btn.active { background: var(--yinmn-blue); color: white; border-color: var(--yinmn-blue); }
        
        .zoom-display { min-width: 50px; text-align: center; font-size: var(--text-sm); }
        
        .grid-toggle { display: flex; align-items: center; gap: 4px; font-size: var(--text-sm); cursor: pointer; }
        
        .export-group { margin-left: auto; }
        .import-btn { 
          padding: var(--spacing-xs) var(--spacing-sm);
          background: white;
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: var(--text-sm);
        }
        
        .btn-sm { padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--text-sm); }
        .btn-full { width: 100%; margin-top: var(--spacing-xs); }
        .btn-danger { background: #dc3545; color: white; border: none; }
        
        .editor-main {
          display: grid;
          grid-template-columns: 180px 1fr 220px;
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
          flex: 1;
        }
        
        .layers-panel, .properties-panel {
          background: var(--bg-secondary);
          border-radius: var(--radius);
          padding: var(--spacing-md);
          overflow-y: auto;
          max-height: 550px;
        }
        
        .layers-panel h4, .properties-panel h4 { margin-bottom: var(--spacing-sm); font-size: var(--text-sm); }
        
        .layers-list { display: flex; flex-direction: column; gap: 2px; }
        
        .layer-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs);
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: var(--text-sm);
        }
        
        .layer-item.selected { background: #e3f2fd; }
        .layer-visibility, .layer-lock { background: none; border: none; cursor: pointer; font-size: 12px; }
        .layer-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        
        .layer-actions { display: flex; gap: 4px; margin-top: var(--spacing-sm); }
        .layer-actions button { flex: 1; padding: 4px; border: 1px solid var(--platinum); background: white; border-radius: 4px; cursor: pointer; }
        
        .canvas-container {
          background: #e0e0e0;
          border-radius: var(--radius);
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        
        .editor-canvas { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: crosshair; }
        
        .prop-section { margin-bottom: var(--spacing-md); }
        .prop-section label { display: block; font-size: var(--text-sm); margin-bottom: 4px; font-weight: 500; }
        .prop-section input[type="color"] { width: 100%; height: 36px; border: none; border-radius: 4px; cursor: pointer; }
        .prop-section input[type="range"] { width: 100%; }
        .prop-section select, .prop-section input[type="text"] { width: 100%; padding: var(--spacing-xs); border: 1px solid var(--platinum); border-radius: 4px; }
        
        hr { border: none; border-top: 1px solid var(--platinum); margin: var(--spacing-md) 0; }
        
        @media (max-width: 900px) {
          .editor-main { grid-template-columns: 1fr; }
          .layers-panel, .properties-panel { max-height: 200px; }
        }
      `}</style>
        </ToolLayout>
    );
};

export default SvgEditor;
