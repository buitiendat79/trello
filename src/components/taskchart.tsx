import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Card {
  id?: string | number;
  board: string;
  content: string;
}

interface Props {
  boards: {
    todo: Card[];
    inprocess: Card[];
    done: Card[];
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const TabPieChart: React.FC<Props> = ({ boards }) => {
  const data = [
    { name: 'Todo', value: boards.todo.length },
    { name: 'In Process', value: boards.inprocess.length },
    { name: 'Done', value: boards.done.length },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TabPieChart;
