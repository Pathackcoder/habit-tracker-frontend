import React from 'react';

const CircularProgressIndicator = ({ percentage = 0, theme = 'light', disabled = false }) => {
  const safePercentage = Number.isFinite(percentage)
    ? Math.max(0, Math.min(100, percentage))
    : 0;

  const activeColor = theme === 'dark' ? '#379AE6' : '#0AB5CB';
  const mutedColor = theme === 'dark' ? '#111827' : '#E2E8F0';
  const disabledColor = theme === 'dark' ? '#0F172A' : '#E5E7EB';

  const background = disabled
    ? disabledColor
    : safePercentage > 0
      ? `conic-gradient(${activeColor} 0% ${safePercentage}%, ${mutedColor} ${safePercentage}% 100%)`
      : mutedColor;

  return (
    <span
      className="absolute inset-[2px] rounded-full transition-all duration-300"
      style={{ background }}
      aria-hidden="true"
    />
  );
};

export default CircularProgressIndicator;
