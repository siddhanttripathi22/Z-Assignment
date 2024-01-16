
import React from 'react';
import ChipInput from './components/ChipInput';

interface Chip {
  name: string;
  email: string;
  id: number;
  color: string;
}

const generateColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`;
  return color;
};

const userData = [
  { name: 'John', email: 'john@example.com' },
  { name: 'Mary', email: 'mary@example.com' },
  { name: 'Michael', email: 'michael@example.com' },
  { name: 'Sarah', email: 'sarah@example.com' },
  { name: 'David', email: 'david@example.com' },
  { name: 'Jennifer', email: 'jennifer@example.com' },
  { name: 'James', email: 'james@example.com' },
  { name: 'Elizabeth', email: 'elizabeth@example.com' },
  { name: 'William', email: 'william@example.com' },
  { name: 'Emily', email: 'emily@example.com' },
  {name:'Siddhant',email:'siddhanttripathi22@gmail.com'}
];


const initialChips: Chip[] = userData.map((user, index) => ({
  name: user.name,
  email: user.email,
  id: index,
  color: generateColor(user.name)
}));

const App: React.FC = () => {
  return (
    <div className="App">
      <ChipInput initialItems={initialChips} />
    </div>
  );
};

export default App;