import React, { useState } from 'react';
import type { Comment } from '../types';
import { AGENTS } from '../constants';

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
          className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
        >
          <i className="fa-regular fa-copy w-4 h-4"></i>
          {copyStatus}
        </button>
      </div>
      <div className="bg-slate-100 rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono text-sm border border-slate-200">
        <div className="grid grid-cols-[auto_auto_1fr] gap-x-4 items-start">
          {comments.map((comment, index) => {
            const agent = comment.agentId ? AGENTS[comment.agentId] : null;
            return (
              <React.Fragment key={index}>
                <span className="text-slate-500 text-right">{comment.time}</span>
                <span className={`font-bold text-${agent?.color || 'slate-400'}`}>{agent?.icon || '⁇'}</span>
                <span className="text-slate-800 break-words">{comment.comment}</span>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentView;