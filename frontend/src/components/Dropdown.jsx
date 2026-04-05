import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Dropdown = ({ value, onChange, options, placeholder = 'Select...', placement = 'bottom', style = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || { label: placeholder, value: '' };

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', ...style }}>
      <button
        type="button"
        className="form-input"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: 'var(--bg-primary)',
          borderColor: isOpen ? 'var(--accent-blue)' : 'var(--border-color)',
          boxShadow: isOpen ? '0 0 0 3px rgba(59, 130, 246, 0.15)' : 'none',
          textAlign: 'left',
          width: '100%',
          padding: '0.75rem 1rem',
        }}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <span style={{ color: value === '' ? 'var(--text-muted)' : 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {selectedOption.label}
        </span>
        <ChevronDown 
          size={16} 
          color="var(--text-muted)" 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s',
            flexShrink: 0,
            marginLeft: '0.5rem'
          }} 
        />
      </button>

      {isOpen && (
        <ul
          className="glass-card"
          style={{
            position: 'absolute',
            ...(placement === 'top' ? { bottom: 'calc(100% + 0.5rem)' } : { top: 'calc(100% + 0.5rem)' }),
            left: 0,
            zIndex: 100,
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '0.5rem',
            listStyle: 'none',
            margin: 0,
            minWidth: '100%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          }}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={{
                padding: '0.625rem 0.875rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: option.value === value ? 'var(--accent-blue)' : 'var(--text-primary)',
                background: option.value === value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                transition: 'background 0.2s, color 0.2s',
                fontSize: '0.875rem',
                fontWeight: option.value === value ? 600 : 400,
                marginBottom: '0.125rem'
              }}
              onMouseEnter={(e) => {
                if (option.value !== value) e.currentTarget.style.background = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                if (option.value !== value) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>{option.label}</span>
              {option.value === value && <Check size={14} style={{ flexShrink: 0, marginLeft: '0.5rem' }} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
