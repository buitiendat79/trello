import React, { useState } from 'react';

interface Card {
  id?: number;
  board: string;
  content: string;
}

interface Props {
  cards: Card[];
  onAdd: (content: string) => void;
  onCardClick: (card: Card) => void;
}

const InprocessBoard: React.FC<Props> = ({ cards, onAdd, onCardClick }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input); 
      setInput('');
    }
  };

  return (
    <div className="bg-gray-200 rounded-xl shadow-xl w-80 p-4">
      <h2 className="text-lg font-bold mb-4 text-black">In-Process</h2>

      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-md border-solid shadow-md p-2 mb-2 text-black cursor-pointer"
          onClick={() => onCardClick(card)}  
        >
          {card.content}
        </div>
      ))}

      <input
        type="text"
        className="w-full border rounded-md px-2 py-1 text-sm mt-2"
        placeholder="Nhập tiêu đề hoặc dán liên kết"
        value={input}
        onChange={(e) => setInput(e.target.value)} 
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleAdd} 
          className="bg-blue-600 text-white text-sm px-4 py-1 rounded-md"
        >
          Thêm thẻ
        </button>
        <button onClick={() => setInput('')} className="text-xl">✕</button>
      </div>
    </div>
  );
};

export default InprocessBoard;
