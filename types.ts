

// Fix: Removed self-referencing import that caused declaration conflicts.
// The import of AgentName from constants.ts was removed to resolve a circular dependency.
// AgentId is the canonical type for agent identifiers.

export type GeminiModel = 'gemini-2.5-flash' | 'gemini-2.5-pro';

export type AgentId = 'gal' | 'professor' | 'comedian' | 'otaku' | 'tsundere' | 'commentator' | 'aizuchi' | 'yajiuma';

export interface Comment {
  time: string;
  command: string;
  comment: string;
  agentId?: AgentId;
}

export interface Agent {
  id: AgentId;
  name: string;
  icon: string;
  description: string;
  color: string;
  prompt: string;
  targetCommentCount: number;
}

export interface AgentStatus {
    status: 'idle' | 'loading' | 'success' | 'error';
    error?: string;
}