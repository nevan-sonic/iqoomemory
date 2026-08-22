import React from 'react';

export function MobileFrame({ children }) {
  return (
    <div className="desktop-viewport-wrapper">
      {/* Phone Mockup Frame */}
      <div className="phone-mockup-frame">
        {/* Dynamic Island Camera Notch */}
        <div className="origin-os-island">
          <div className="island-camera" />
        </div>

        {/* Inner App Content */}
        {children}
      </div>
    </div>
  );
}
