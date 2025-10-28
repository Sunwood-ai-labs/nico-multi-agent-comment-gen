
export type AgentName = 'gal' | 'professor' | 'comedian';

export interface Comment {
  time: string;
  command: string;
  comment: string;
  agentId?: AgentName;
}

export interface Agent {
  id: AgentName;
  name: string;
  icon: string;
  description: string;
  color: string;
  prompt: string;
}

export interface AgentStatus {
    status: 'idle' | 'loading' | 'success' | 'error';
    error?: string;
}
