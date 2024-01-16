import React, { useState, useRef, useEffect } from 'react';
import './ChipInput.css';

interface Chip {
  name: string;
  email: string;
  id: number;
  color: string;
  isHighlighted?: boolean;
}

interface ChipInputProps {
  initialItems: Chip[];
}

const ChipInput: React.FC<ChipInputProps> = ({ initialItems }) => {
  const [chips, setChips] = useState<Chip[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Chip[]>([]);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const [suggestionListPosition, setSuggestionListPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSuggestionPosition = () => {
      if (suggestionsRef.current && inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const suggestionsRect = suggestionsRef.current.getBoundingClientRect();
  
        setSuggestionListPosition({
          top: inputRect.bottom,
          left: inputRect.left,
        });
  
        
        if (inputRect.bottom + suggestionsRect.height > window.innerHeight) {
          setSuggestionListPosition({
            top: inputRect.top - suggestionsRect.height,
            left: inputRect.left,
          });
        }
      }
    };
  
    window.addEventListener('resize', updateSuggestionPosition);
  
    return () => {
      window.removeEventListener('resize', updateSuggestionPosition);
    };
  }, [isSuggestionVisible, inputValue]);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    showSuggestions();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && inputValue === '') {
      if (chips.length > 0 && !chips.some(chip => chip.isHighlighted)) {
        const updatedChips = chips.map((chip, index) => ({
          ...chip,
          isHighlighted: index === chips.length - 1,
        }));
        setChips(updatedChips);
        event.preventDefault();
      } else {
        removeHighlightedChip();
      }
    }
  };

  const removeHighlightedChip = () => {
    const updatedChips = chips.filter(chip => !chip.isHighlighted);
    setChips(updatedChips);
  };

  const addChip = (chip: Chip) => {
    setChips([...chips, chip]);
    setInputValue('');
    hideSuggestions();
  };

  const removeChip = (chipId: number) => {
    setChips(chips.filter(chip => chip.id !== chipId));
  };

  const highlightMatch = (text: string, searchValue: string): string => {
    if (!searchValue) return text;
    const regex = new RegExp(searchValue, 'gi');
    return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
  };

  const showSuggestions = () => {
    setSuggestions(
      initialItems.filter(
        item =>
          (item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            item.email.toLowerCase().includes(inputValue.toLowerCase())) &&
          !chips.some(chip => chip.id === item.id)
      )
    );
    setIsSuggestionVisible(true);
  };

  const hideSuggestions = () => {
    setSuggestions([]);
    setIsSuggestionVisible(false);
  };

  const handleInputClick = () => {
    showSuggestions();
  };

  return (
    <div className="chip-input-wrapper">
      <h2 className="heading">Pick Users</h2>
      <div className="chip-input-container" onClick={() => inputRef.current?.focus()}>
        {chips.map(chip => (
          <div
            key={chip.id}
            className={`chip ${chip.isHighlighted ? 'highlight-blue' : ''}`}
            onClick={() => removeChip(chip.id)}
          >
            <span className="chip-icon" style={{ backgroundColor: chip.color }} />
            <span className="chip-name">{chip.name}</span>
            <span className="chip-remove">×</span>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={handleInputClick}
          className="chip-input-field"
          placeholder="Add new user..."
          style={{ position: 'relative' }}
        />
      </div>
      {isSuggestionVisible && suggestions.length > 0 && (
        <ul
          className="suggestions-list"
          ref={suggestionsRef}
          style={{
            top: suggestionListPosition.top,
            left: suggestionListPosition.left,
            position: 'absolute',
          }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => addChip(suggestion)}
            >
              <span className="suggestion-icon" style={{ backgroundColor: suggestion.color }} />
              <div className="suggestion-text">
                <span
                  className="suggestion-name"
                  dangerouslySetInnerHTML={{ __html: highlightMatch(suggestion.name, inputValue) }}
                />
                <span className="suggestion-email">{suggestion.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChipInput;