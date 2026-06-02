import React from 'react';
import './Divider.css';

interface DividerProps {
  label?: string;
}

const Divider: React.FC<DividerProps> = ({ label }) => {
  return (
    <div className="ui-divider" role="separator" aria-label={label}>
      <span className="ui-divider-line" />
      {label && <span className="ui-divider-label">{label}</span>}
      <span className="ui-divider-line" />
    </div>
  );
};

export default Divider;
