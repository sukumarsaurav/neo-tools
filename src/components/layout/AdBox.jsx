import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * AdBox - AdSense-safe ad component with route-change reload support
 * 
 * Following AdSense best practices:
 * - Clear "Advertisement" label
 * - Proper margin (24px) and padding (12px)
 * - Never placed near buttons or interactive elements
 * - Responsive sizing
 * - Re-renders on route change to refresh ads
 */
const AdBox = ({
  type = 'display',
  className = '',
  slot = null, // For AdSense integration
  client = null // AdSense client ID (ca-pub-XXXXXXXXXX)
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getAdSize = () => {
    switch (type) {
      case 'top-banner':
        return { minHeight: '90px', name: 'Leaderboard (728x90)' };
      case 'in-content':
        return { minHeight: '250px', name: 'Medium Rectangle (300x250)' };
      case 'in-article':
        return { minHeight: '280px', name: 'In-Article Ad' };
      case 'sidebar':
        return { minHeight: '600px', name: 'Wide Skyscraper (160x600)' };
      case 'anchor':
        return { minHeight: '50px', name: 'Anchor Ad' };
      default:
        return { minHeight: '100px', name: 'Display Ad' };
    }
  };

  const { minHeight, name } = getAdSize();

  // Re-trigger AdSense when route changes
  useEffect(() => {
    if (slot && client) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [currentPath, slot, client]);

  // Render actual AdSense ad if client and slot are provided
  if (slot && client) {
    return (
      <div className={`ad-container ${className}`} key={currentPath}>
        <span className="ad-label">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <style>{adStyles}</style>
      </div>
    );
  }

  // Render placeholder for development/pre-approval
  return (
    <div className={`ad-container ${className}`} key={currentPath}>
      <span className="ad-label">Advertisement</span>
      <div
        className="ad-placeholder"
        style={{ minHeight }}
      >
        <div className="ad-placeholder-content">
          <span className="ad-icon">📢</span>
          <span className="ad-type">{name}</span>
          <span className="ad-note">Ad space reserved</span>
        </div>
      </div>
      <style>{adStyles}</style>
    </div>
  );
};

const adStyles = `
    .ad-container {
      margin: var(--ad-margin, 24px) 0;
      padding: var(--ad-padding, 12px);
      text-align: center;
    }

    .ad-label {
      display: block;
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }

    .ad-placeholder {
      background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
      border: 2px dashed #ddd;
      border-radius: var(--radius, 8px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ad-placeholder-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #999;
    }

    .ad-icon {
      font-size: 24px;
      opacity: 0.5;
    }

    .ad-type {
      font-size: 12px;
      font-weight: 500;
    }

    .ad-note {
      font-size: 10px;
      opacity: 0.7;
    }

    /* Anchor ad specific styles */
    .ad-container.anchor {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0;
      padding: 8px;
      background: var(--bg-primary, #fff);
      border-top: 1px solid var(--platinum, #e0e0e0);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      z-index: 90;
    }

    .ad-container.anchor .ad-label {
      display: none;
    }

    @media (min-width: 769px) {
      .ad-container.anchor {
        display: none;
      }
    }
`;

AdBox.propTypes = {
  type: PropTypes.oneOf(['top-banner', 'in-content', 'in-article', 'sidebar', 'anchor', 'display']),
  className: PropTypes.string,
  slot: PropTypes.string,
  client: PropTypes.string
};

export default AdBox;

