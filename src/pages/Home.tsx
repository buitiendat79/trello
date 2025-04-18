import React, { useEffect, useState } from 'react';
import TodoBoard from '../components/todo';
import InprocessBoard from '../components/inprocess';
import DoneBoard from './../components/done';
import TaskModal from './../components/modal';
import TabPieChart from '../components/taskchart';

interface Card {
  id?: string | number;
  board: string;
  content: string;
  description?: string;
  comments?: string[];
}

const Home = () => {
  const [boards, setBoards] = useState<{
    todo: Card[];
    inprocess: Card[];
    done: Card[];
  }>({
    todo: [],
    inprocess: [],
    done: [],
  });

  const [selectedTask, setSelectedTask] = useState<Card | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/cards')
      .then(res => res.json())
      .then((data: Card[]) => {
        const grouped = {
          todo: data.filter(card => card.board === 'todo'),
          inprocess: data.filter(card => card.board === 'inprocess'),
          done: data.filter(card => card.board === 'done'),
        };
        setBoards(grouped);
      });
  }, []);

  const addCard = (board: string, content: string) => {
    const newCard: Card = {
      board,
      content,
      description: '',
      comments: [],
    };

    fetch('http://localhost:3000/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCard),
    })
      .then(res => res.json())
      .then(createdCard => {
        setBoards(prev => ({
          ...prev,
          [board]: [...prev[board], createdCard],
        }));
      });
  };

  const updateCard = (updatedCard: Card) => {
    fetch(`http://localhost:3000/cards/${updatedCard.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCard),
    }).then(() => {
      setBoards(prev => {
        const newBoards = {
          todo: prev.todo.filter(card => card.id !== updatedCard.id),
          inprocess: prev.inprocess.filter(card => card.id !== updatedCard.id),
          done: prev.done.filter(card => card.id !== updatedCard.id),
        };

        if (newBoards[updatedCard.board]) {
          newBoards[updatedCard.board].push(updatedCard);
        }

        return newBoards;
      });
    });
  };

  const deleteCard = (id?: string | number) => {
    if (!id) return;

    fetch(`http://localhost:3000/cards/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setBoards(prev => {
        const newBoards = { ...prev };
        (['todo', 'inprocess', 'done'] as const).forEach(board => {
          newBoards[board] = newBoards[board].filter(card => card.id !== id);
        });
        return newBoards;
      });
      setSelectedTask(null);
    });
  };

  return (
    <div className="flex gap-4 p-4 bg-blue-100 min-h-screen">
      {/* Wrapper chứa 3 board */}
      <div className="flex gap-4 flex-grow">
        <TodoBoard
          cards={boards.todo}
          onAdd={content => addCard('todo', content)}
          onCardClick={setSelectedTask}
        />
        <InprocessBoard
          cards={boards.inprocess}
          onAdd={content => addCard('inprocess', content)}
          onCardClick={setSelectedTask}
        />
        <DoneBoard
          cards={boards.done}
          onAdd={content => addCard('done', content)}
          onCardClick={setSelectedTask}
        />
      </div>

      {/* Pie Chart nằm ở khu vực bên phải */}
      <div className="w-[450px] bg-white rounded-xl shadow p-4">
        <TabPieChart boards={boards} />
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateCard}
          onDelete={deleteCard}
        />
      )}
    </div>
  );
};

export default Home;
