import React, { useState, useRef } from 'react';
import type { Agent, AgentName, AgentStatus } from '../types';
import { CheckCircle, XCircle, Loader, GripVertical, ChevronDown } from './icons';

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
      case 'loading': return <Loader className="animate-spin text-gray-400" />;
      case 'success': return <CheckCircle className="text-green-400" />;
      case 'error': return <XCircle className="text-red-400" />;
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
            className="bg-gray-700 rounded-lg transition-shadow duration-300 shadow-md hover:shadow-lg"
          >
            <div className="flex items-center p-3 cursor-grab">
              <GripVertical className="w-5 h-5 text-gray-500 mr-3" />
              <div className="text-2xl mr-3">{agent.icon}</div>
              <div className="flex-grow">
                <h3 className={`font-semibold text-gray-100`}>{agent.name}</h3>
                <p className="text-xs text-gray-400">{agent.description}</p>
              </div>
              <div className="h-6 w-6 flex items-center justify-center mr-2">
                {statusIndicator(status)}
              </div>
              <button
                onClick={() => setEditingAgentId(isEditing ? null : agentId)}
                className="p-1 rounded-full hover:bg-gray-600"
                aria-label={isEditing ? 'Close prompt editor' : 'Open prompt editor'}
              >
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isEditing ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {isEditing && (
              <div className="p-3 border-t border-gray-600">
                <label htmlFor={`prompt-${agentId}`} className="block text-sm font-medium text-gray-300 mb-2">
                  Edit Prompt for {agent.name}
                </label>
                <textarea
                  id={`prompt-${agentId}`}
                  value={agent.prompt}
                  onChange={(e) => handlePromptChange(agentId, e.target.value)}
                  className="w-full h-48 bg-gray-900 border border-gray-500 rounded-md p-2 text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition font-mono"
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
