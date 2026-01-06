import { useMemo, useState } from 'react';
import { FINGER_COLORS, KEY_FINGER_MAP } from '../../../data/typingChapters';

// Keyboard layouts
const KEYBOARD_LAYOUTS = {
  qwerty: {
    name: 'QWERTY',
    rows: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
      [' '],
    ]
  },
  dvorak: {
    name: 'Dvorak',
    rows: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']'],
      ["'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '=', '\\'],
      ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-'],
      [';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z'],
      [' '],
    ]
  },
  azerty: {
    name: 'AZERTY',
    rows: [
      ['²', '&', 'é', '"', "'", '(', '-', 'è', '_', 'ç', 'à', ')', '='],
      ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '^', '$', '*'],
      ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'ù'],
      ['w', 'x', 'c', 'v', 'b', 'n', ',', ';', ':', '!'],
      [' '],
    ]
  },
  colemak: {
    name: 'Colemak',
    rows: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      ['q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y', ';', '[', ']', '\\'],
      ['a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o', "'"],
      ['z', 'x', 'c', 'v', 'b', 'k', 'm', ',', '.', '/'],
      [' '],
    ]
  }
};

const SPECIAL_KEYS = {
  ' ': { label: 'Space', width: 'space' },
  '\\': { label: '\\', width: 'normal' },
};

// Home row keys for QWERTY - adapt for other layouts
const getHomeRowKeys = (layout) => {
  switch (layout) {
    case 'dvorak': return ['a', 'o', 'e', 'u', 'h', 't', 'n', 's'];
    case 'azerty': return ['q', 's', 'd', 'f', 'j', 'k', 'l', 'm'];
    case 'colemak': return ['a', 'r', 's', 't', 'n', 'e', 'i', 'o'];
    default: return ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
  }
};

const VirtualKeyboard = ({
  currentKey = '',
  focusKeys = [],
  pressedKey = '',
  showFingerColors = true,
  compact = false,
  layout = 'qwerty',
  onLayoutChange = null,
  showLayoutSelector = false,
  highContrast = false,
  largeKeys = false,
  showErrorKeys = false,
  errorKeys = []
}) => {
  const [internalLayout, setInternalLayout] = useState(layout);
  const activeLayout = onLayoutChange ? layout : internalLayout;
  const keyboardData = KEYBOARD_LAYOUTS[activeLayout] || KEYBOARD_LAYOUTS.qwerty;
  const homeRowKeys = getHomeRowKeys(activeLayout);

  const handleLayoutChange = (newLayout) => {
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    } else {
      setInternalLayout(newLayout);
    }
  };

  const getKeyStyle = useMemo(() => (key) => {
    const lowerKey = key.toLowerCase();
    const finger = KEY_FINGER_MAP[lowerKey];
    const isHomeRow = homeRowKeys.includes(lowerKey);
    const isFocusKey = focusKeys.includes(lowerKey);
    const isCurrentKey = currentKey.toLowerCase() === lowerKey;
    const isPressed = pressedKey.toLowerCase() === lowerKey;
    const isErrorKey = showErrorKeys && errorKeys.includes(lowerKey);

    let backgroundColor = highContrast ? 'var(--bg-primary)' : 'var(--bg-tertiary)';
    let borderColor = highContrast ? 'var(--text-primary)' : 'var(--border-color)';
    let color = 'var(--text-primary)';
    let boxShadow = 'none';
    let transform = 'none';

    // Finger color coding
    if (showFingerColors && finger && FINGER_COLORS[finger]) {
      backgroundColor = `${FINGER_COLORS[finger]}20`;
      borderColor = FINGER_COLORS[finger];
    }

    // Focus key highlighting
    if (isFocusKey) {
      backgroundColor = `${FINGER_COLORS[finger] || 'var(--accent-primary)'}40`;
      boxShadow = `0 0 8px ${FINGER_COLORS[finger] || 'var(--accent-primary)'}60`;
    }

    // Error key highlighting
    if (isErrorKey) {
      backgroundColor = 'rgba(239, 68, 68, 0.3)';
      borderColor = '#EF4444';
      boxShadow = '0 0 8px rgba(239, 68, 68, 0.5)';
    }

    // Current key to press
    if (isCurrentKey) {
      backgroundColor = 'var(--warning)';
      color = 'white';
      boxShadow = '0 0 15px var(--warning), 0 0 30px var(--warning)';
      transform = 'scale(1.1)';
    }

    // Key being pressed
    if (isPressed) {
      backgroundColor = 'var(--success)';
      color = 'white';
      transform = 'scale(0.95)';
      boxShadow = '0 0 10px var(--success)';
    }

    return { backgroundColor, borderColor, color, boxShadow, transform };
  }, [currentKey, focusKeys, pressedKey, showFingerColors, homeRowKeys, highContrast, showErrorKeys, errorKeys]);

  return (
    <div className={`virtual-keyboard ${compact ? 'compact' : ''} ${largeKeys ? 'large-keys' : ''} ${highContrast ? 'high-contrast' : ''}`}>
      {/* Layout Selector */}
      {showLayoutSelector && (
        <div className="layout-selector">
          {Object.entries(KEYBOARD_LAYOUTS).map(([key, data]) => (
            <button
              key={key}
              className={`layout-btn ${activeLayout === key ? 'active' : ''}`}
              onClick={() => handleLayoutChange(key)}
            >
              {data.name}
            </button>
          ))}
        </div>
      )}

      {/* Keyboard */}
      <div className="keyboard-container">
        {keyboardData.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => {
              const special = SPECIAL_KEYS[key];
              const style = getKeyStyle(key);
              const isHomeRow = homeRowKeys.includes(key.toLowerCase());

              return (
                <div
                  key={key}
                  className={`keyboard-key ${special?.width || 'normal'} ${isHomeRow ? 'home-key' : ''}`}
                  style={style}
                >
                  <span className="key-label">
                    {special?.label || key.toUpperCase()}
                  </span>
                  {isHomeRow && <span className="home-dot" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger Legend */}
      {showFingerColors && (
        <div className="finger-legend">
          {Object.entries(FINGER_COLORS).map(([finger, color]) => (
            <div key={finger} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: color }} />
              <span className="legend-label">
                {finger.replace(/([A-Z])/g, ' $1').replace('left', 'L').replace('right', 'R')}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
                .virtual-keyboard {
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-lg);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .virtual-keyboard.compact {
                    padding: var(--spacing-md);
                    gap: var(--spacing-sm);
                }

                .virtual-keyboard.high-contrast {
                    background: var(--bg-primary);
                    border: 2px solid var(--text-primary);
                }

                /* Layout Selector */
                .layout-selector {
                    display: flex;
                    gap: var(--spacing-xs);
                    justify-content: center;
                    padding-bottom: var(--spacing-sm);
                    border-bottom: 1px solid var(--border-color);
                }

                .layout-btn {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: var(--text-xs);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .layout-btn:hover {
                    border-color: var(--accent-primary);
                }

                .layout-btn.active {
                    background: var(--accent-primary);
                    color: white;
                    border-color: var(--accent-primary);
                }

                /* Keyboard Container */
                .keyboard-container {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    align-items: center;
                }

                .compact .keyboard-container {
                    gap: 4px;
                }
                
                .keyboard-row {
                    display: flex;
                    gap: 4px;
                    justify-content: center;
                }
                
                .compact .keyboard-row {
                    gap: 3px;
                }
                
                .keyboard-key {
                    min-width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: var(--text-sm);
                    position: relative;
                    transition: all 0.15s ease;
                    cursor: default;
                    user-select: none;
                }

                .large-keys .keyboard-key {
                    min-width: 50px;
                    height: 50px;
                    font-size: var(--text-md);
                }
                
                .compact .keyboard-key {
                    min-width: 28px;
                    height: 28px;
                    font-size: 10px;
                }
                
                .keyboard-key.space {
                    min-width: 240px;
                }

                .large-keys .keyboard-key.space {
                    min-width: 300px;
                }
                
                .compact .keyboard-key.space {
                    min-width: 160px;
                }
                
                .home-key {
                    position: relative;
                }
                
                .home-dot {
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 3px;
                    background: var(--text-muted);
                    border-radius: 2px;
                }

                .large-keys .home-dot {
                    width: 8px;
                    height: 4px;
                }
                
                .compact .home-dot {
                    width: 4px;
                    height: 2px;
                    bottom: 2px;
                }
                
                .key-label {
                    position: relative;
                    z-index: 1;
                }
                
                /* Finger Legend */
                .finger-legend {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                    justify-content: center;
                    padding-top: var(--spacing-md);
                    border-top: 1px solid var(--border-color);
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }
                
                .legend-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 3px;
                }

                /* Animations */
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 10px currentColor; }
                    50% { box-shadow: 0 0 20px currentColor; }
                }
                
                @media (max-width: 768px) {
                    .virtual-keyboard {
                        padding: var(--spacing-sm);
                    }
                    
                    .keyboard-key {
                        min-width: 26px;
                        height: 32px;
                        font-size: 9px;
                    }
                    
                    .keyboard-key.space {
                        min-width: 140px;
                    }
                    
                    .finger-legend {
                        display: none;
                    }

                    .layout-selector {
                        flex-wrap: wrap;
                    }
                }
            `}</style>
    </div>
  );
};

export default VirtualKeyboard;
