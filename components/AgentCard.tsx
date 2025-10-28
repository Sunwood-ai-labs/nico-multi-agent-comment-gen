import React, { useState, useRef } from 'react';
import type { Agent, AgentName, AgentStatus } from '../types';

interface AgentEditorListProps {
  agents: Record<AgentName, Agent>;
  setAgents: React.Dispatch<React.SetStateAction<Record<AgentName, Agent>>>;
  executionOrder: AgentName[];
  setExecutionOrder: React.Dispatch<React.SetStateAction<AgentName[]>>;
  statuses: Record<AgentName, AgentStatus>;
}

const AgentEditorList: React.FC<AgentEditorListProps> = ({ agents, setAgents, executionOrder, setExecutionOrder, statuses }) => {
  const [editingAgentId, setEditingAgentId] = useState<AgentName | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newOrder = [...executionOrder];
    const [reorderedItem] = newOrder.splice(dragItem.current, 1);
    newOrder.splice(dragOverItem.current, 0, reorderedItem);
    setExecutionOrder(newOrder);
    dragItem.current = null;
    dragOverItem.current = null;
  };
  
  const handlePromptChange = (agentId: AgentName, newPrompt: string) => {
    setAgents(prev => ({
      ...prev,
      [agentId]: { ...prev[agentId], prompt: newPrompt }
    }));
  };

  const statusIndicator = (status: AgentStatus) => {
    switch (status.status) {
      case 'loading': return <i className="fa-solid fa-spinner fa-spin text-slate-500"></i>;
      case 'success': return <i className="fa-solid fa-check-circle text-green-500"></i>;
      case 'error': return <i className="fa-solid fa-times-circle text-red-500"></i>;
      default: return null;
    }
  };

  return (
    <div className="space-y-3">
      {executionOrder.map((agentId, index) => {
        const agent = agents[agentId];
        const status = statuses[agentId];
        const isEditing = editingAgentId === agentId;

        return (
          <div
            key={agentId}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="bg-white border border-slate-200 rounded-lg transition-shadow duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center p-3 cursor-grab">
              <i className="fa-solid fa-grip-vertical w-5 h-5 text-slate-400 mr-3"></i>
              <div className="text-2xl mr-3">{agent.icon}</div>
              <div className="flex-grow">
                <h3 className={`font-semibold text-slate-800`}>{agent.name}</h3>
                <p className="text-xs text-slate-500">{agent.description}</p>
              </div>
              <div className="h-6 w-6 flex items-center justify-center mr-2">
                {statusIndicator(status)}
              </div>
              <button
                onClick={() => setEditingAgentId(isEditing ? null : agentId)}
                className="p-2 rounded-full hover:bg-slate-100"
                aria-label={isEditing ? 'Close prompt editor' : 'Open prompt editor'}
              >
                <i className={`fa-solid fa-chevron-down text-slate-500 transition-transform duration-300 ${isEditing ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {isEditing && (
              <div className="p-4 border-t border-slate-200">
                <label htmlFor={`prompt-${agentId}`} className="block text-sm font-medium text-slate-700 mb-2">
                  Edit Prompt for {agent.name}
                </label>
                <textarea
                  id={`prompt-${agentId}`}
                  value={agent.prompt}
                  onChange={(e) => handlePromptChange(agentId, e.target.value)}
                  className="w-full h-48 bg-slate-50 border border-slate-300 rounded-md p-2 text-sm text-slate-800 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition font-mono"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AgentEditorList;