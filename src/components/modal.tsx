import React, { useState, useEffect } from 'react';

interface Task {
  id?: number;
  board: string;
  content: string;
  description?: string;
  comments?: string[];
  assignedTo?: string[];
}

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id?: number) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onUpdate, onDelete }) => {
  const [description, setDescription] = useState(task.description || '');
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<string[]>(task.comments || []);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.content);
  const [showMembersMenu, setShowMembersMenu] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string[]>(task.assignedTo || []);
  const [members, setMembers] = useState<{ id: number, name: string }[]>([]);
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(task.board);

  const boardMap: Record<string, string> = {
    'TODO': 'todo',
    'In-Process': 'inprocess',
    'Done': 'done'
  };

  const boardDisplayMap: Record<string, string> = {
    'todo': 'TODO',
    'inprocess': 'In-Process',
    'done': 'Done'
  };

  useEffect(() => {
    fetch('http://localhost:3000/members')
      .then(res => res.json())
      .then(setMembers);
  }, []);

  const handleUpdate = async (updatedFields = {}) => {
    const updatedTask: Task = {
      ...task,
      content: title,
      description,
      comments,
      assignedTo,
      board: selectedBoard,
      ...updatedFields,
    };

    try {
      await fetch(`http://localhost:3000/cards/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      onUpdate(updatedTask);
    } catch (error) {
      console.error('Lỗi khi cập nhật task:', error);
    }
  };

  const handleAddComment = () => {
    if (commentInput.trim()) {
      const newComments = [...comments, commentInput.trim()];
      setComments(newComments);
      setCommentInput('');
      handleUpdate({ comments: newComments });
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    handleUpdate();
  };

  const toggleAssignMember = (member: string) => {
    let newAssigned: string[];
    if (assignedTo.includes(member)) {
      newAssigned = assignedTo.filter(m => m !== member);
    } else {
      newAssigned = [...assignedTo, member];
    }
    setAssignedTo(newAssigned);
    handleUpdate({ assignedTo: newAssigned });
  };

  const handleBoardSelect = (board: string) => {
    setSelectedBoard(board);
    setShowBoardMenu(false);
    handleUpdate({ board });
  };

  const removeAssignedMember = (member: string) => {
    const newAssigned = assignedTo.filter(m => m !== member);
    setAssignedTo(newAssigned);
    handleUpdate({ assignedTo: newAssigned });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl relative flex">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:scale-125 transform transition-transform duration-200"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex-1 pr-6">
          {isEditingTitle ? (
            <input
              type="text"
              className="text-2xl font-semibold text-black mb-1 w-full border border-gray-300 rounded-md px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              autoFocus
            />
          ) : (
            <h2
              className="text-2xl font-semibold text-black mb-1 cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
            </h2>
          )}

          <p className="text-gray-600 mb-1">
            trong danh sách
            <span
              className="font-semibold px-2 py-0.5 bg-blue-100 rounded cursor-pointer ml-1"
              onClick={() => setShowBoardMenu(!showBoardMenu)}
            >
              {boardDisplayMap[selectedBoard] || selectedBoard}
            </span>
          </p>

          {showBoardMenu && (
            <div className="absolute top-12 left-0 bg-white border rounded shadow-lg z-10">
              {["TODO", "In-Process", "Done"].map((boardName) => (
                <div
                  key={boardName}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleBoardSelect(boardMap[boardName])}
                >
                  {boardName}
                </div>
              ))}
            </div>
          )}

          {assignedTo.length > 0 && (
            <p className="text-sm text-gray-800 mb-4">
              <span className="font-semibold">Thành viên:</span>
              {assignedTo.map((member, index) => (
                <span key={index} className="mr-2 inline-block">
                  {member}
                  <button onClick={() => removeAssignedMember(member)} className="text-red-500 ml-1">✕</button>
                </span>
              ))}
            </p>
          )}

          <div className="mb-4">
            <label className="font-semibold text-sm text-gray-700 mb-1 block">Mô tả</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-2 py-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="font-semibold text-sm text-gray-700 mb-1 block">Bình luận</label>
            <input
              className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Viết bình luận..."
            />
            <button
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
              onClick={handleAddComment}
            >
              Thêm
            </button>
          </div>

          <div className="mt-4">
            {comments.map((cmt, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded mb-2">{cmt}</div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-start gap-3 mt-12 relative">
          <button
            className="bg-yellow-400 text-white px-4 py-2 rounded font-semibold relative"
            onClick={() => setShowMembersMenu(prev => !prev)}
          >
            Thành viên
          </button>

          {showMembersMenu && (
            <div className="absolute top-12 left-0 bg-white border rounded shadow-lg z-10">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${assignedTo.includes(member.name) ? 'bg-blue-100 font-semibold' : ''}`}
                  onClick={() => toggleAssignMember(member.name)}
                >
                  {member.name}
                </div>
              ))}
            </div>
          )}

          <button
            className="bg-green-500 text-white px-4 py-2 rounded font-semibold"
            onClick={handleAddComment}
          >
            Hoàn thành
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded font-semibold"
            onClick={() => onDelete(task.id)}
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
