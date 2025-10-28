
import React, { useState } from 'react';
import type { Comment } from '../types';
import { AGENTS } from '../constants';
import { ClipboardCopy } from './icons';

interface CommentViewProps {
  comments: Comment[];
}

const CommentView: React.FC<CommentViewProps> = ({ comments }) => {
  const [copyStatus, setCopyStatus] = useState('Copy JSON');

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(comments, null, 2))
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy JSON'), 2000);
      })
      .catch(err => {
        setCopyStatus('Failed to copy');
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <ClipboardCopy className="w-5 h-5" />
          {copyStatus}
        </button>
      </div>
      <div className="bg-gray-900/50 rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono text-sm border border-gray-700">
        <div className="grid grid-cols-[auto_auto_1fr] gap-x-4 items-start">
          {comments.map((comment, index) => {
            const agent = comment.agentId ? AGENTS[comment.agentId] : null;
            return (
              <React.Fragment key={index}>
                <span className="text-gray-500 text-right">{comment.time}</span>
                <span className={`font-bold text-${agent?.color || 'gray-400'}`}>{agent?.icon || '⁇'}</span>
                <span className="text-gray-200 break-words">{comment.comment}</span>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentView;
