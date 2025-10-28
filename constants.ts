
import type { Agent, AgentId } from './types';

export const AGENTS: Record<AgentId, Omit<Agent, 'prompt'>> = {
  gal: {
    id: 'gal',
    name: 'Gal Agent',
    icon: '💋',
    description: 'Intuitive and emotional. Gets to the heart of the matter with style.',
    color: 'pink-400',
    targetCommentCount: 100,
  },
  professor: {
    id: 'professor',
    name: 'Professor Agent',
    icon: '👨‍🏫',
    description: 'Logical and analytical. Provides context and factual explanations.',
    color: 'blue-400',
    targetCommentCount: 30,
  },
  comedian: {
    id: 'comedian',
    name: 'Comedian Agent',
    icon: '😂',
    description: 'Humorous and witty. Finds the funny moments and makes jokes.',
    color: 'orange-400',
    targetCommentCount: 100,
  },
  otaku: {
    id: 'otaku',
    name: 'Otaku Agent',
    icon: '🤓',
    description: 'Deep dives with anime/game knowledge and points out tropes.',
    color: 'purple-500',
    targetCommentCount: 100,
  },
  tsundere: {
    id: 'tsundere',
    name: 'Tsundere Agent',
    icon: '츤',
    description: "Acts tough, but secretly impressed. 'It's not like I like it or anything!'",
    color: 'red-500',
    targetCommentCount: 100,
  },
  commentator: {
    id: 'commentator',
    name: 'Commentator Agent',
    icon: '🎙️',
    description: 'Narrates the action with high energy, like a sports announcer.',
    color: 'teal-500',
    targetCommentCount: 100,
  },
  aizuchi: {
    id: 'aizuchi',
    name: 'Aizuchi Agent',
    icon: '👏',
    description: 'Adds timely interjections and reactions to liven up the conversation.',
    color: 'yellow-500',
    targetCommentCount: 100,
  },
  yajiuma: {
    id: 'yajiuma',
    name: 'Onlooker Agent',
    icon: '👀',
    description: 'Acts like a curious bystander, heckling and asking questions from the crowd.',
    color: 'lime-500',
    targetCommentCount: 100,
  },
};