import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const DatePicker = ({ value, onChange, placement = 'bottom', style = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize with selected date or today
  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    // Sync if value changes externally
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentMonth(d.getMonth());
        setCurrentYear(d.getFullYear());
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    // Format to yyyy-mm-dd
    const yyyy = currentYear;
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange({ target: { value: `${yyyy}-${mm}-${dd}` } });
    setIsOpen(false);
  };

  const setToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    onChange({ target: { value: `${yyyy}-${mm}-${dd}` } });
    setIsOpen(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Generate blank spaces for the first row
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Formatting display text
  const displayText = value ? new Date(value).toLocaleDateString() : 'Select Date';

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
        <span style={{ color: !value ? 'var(--text-muted)' : 'var(--text-primary)' }}>
          {displayText}
        </span>
        <CalendarIcon size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
      </button>

      {isOpen && (
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            ...(placement === 'top' ? { bottom: 'calc(100% + 0.5rem)' } : { top: 'calc(100% + 0.5rem)' }),
            left: 0,
            zIndex: 110,
            padding: '1rem',
            width: '280px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
            color: 'var(--text-primary)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
                <button type="button" onClick={() => setCurrentYear(currentYear - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
                  <ChevronsLeft size={16} />
                </button>
                <button type="button" onClick={handlePrevMonth} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
                  <ChevronLeft size={18} />
                </button>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {monthNames[currentMonth]} {currentYear}
            </span>
            <div style={{ display: 'flex', gap: '2px' }}>
                <button type="button" onClick={handleNextMonth} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
                  <ChevronRight size={18} />
                </button>
                <button type="button" onClick={() => setCurrentYear(currentYear + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
                  <ChevronsRight size={16} />
                </button>
            </div>
          </div>

          {/* Days of week */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '0.5rem', textAlign: 'center' }}>
            {dayNames.map(day => (
              <div key={day} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{day}</div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {blanks.map(blank => (
              <div key={`blank-${blank}`} style={{ height: '32px' }} />
            ))}
            {days.map(day => {
              // Construct string to compare
              const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = value === dStr;
              const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  style={{
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--accent-blue)' : 'transparent',
                    color: isSelected ? 'white' : isToday ? 'var(--accent-blue-light)' : 'var(--text-primary)',
                    fontWeight: isSelected || isToday ? 600 : 400,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); onChange({ target: { value: '' }}); setIsOpen(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-red-light)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
                Clear
            </button>
            <button 
                type="button" 
                onClick={setToday}
                style={{ background: 'none', border: 'none', color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-blue)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--accent-blue-light)'}
            >
                Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
