import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomDropdown({ label, value, options, onChange, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  function handleSelect(val) {
    onChange(val);
    setIsOpen(false);
  }

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      {label && <span className="dropdown-label">{label}</span>}
      <button
        type="button"
        className={`dropdown-trigger ${isOpen ? "active" : ""}`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="trigger-content">
          {Icon && <Icon size={16} className="dropdown-static-icon" />}
          {!Icon && selectedOption.icon && (
            <selectedOption.icon size={16} className="option-icon" />
          )}
          <span className="selected-label">{selectedOption.label}</span>
        </div>
        <ChevronDown size={14} className={`chevron ${isOpen ? "rotated" : ""}`} />
      </button>

      {isOpen && (
        <div className="dropdown-menu-portal glass-card" role="listbox">
          <div className="dropdown-menu-inner">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                className={`dropdown-item ${value === option.value ? "selected" : ""}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.icon && <option.icon size={16} className="option-icon" />}
                <div className="option-label-group">
                  <span className="option-label">{option.label}</span>
                  {option.description && (
                    <span className="option-desc">{option.description}</span>
                  )}
                </div>
                {value === option.value && (
                  <div className="selection-indicator">
                    <div className="selection-dot" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
