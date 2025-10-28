import React, { useState, useCallback } from 'react';
import { AGENTS as INITIAL_AGENTS } from './constants';
import { generateCommentsForAgent } from './services/geminiService';
import type { AgentName, AgentStatus, Comment, Agent } from './types';
import AgentEditorList from './components/AgentCard';
import CommentView from './components/CommentView';
import FileUploader from './components/FileUploader';
import { BotMessageSquare } from './components/icons';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [articleText, setArticleText] = useState<string>('');
  const [agents, setAgents] = useState<Record<AgentName, Agent>>(INITIAL_AGENTS);
  const [executionOrder, setExecutionOrder] = useState<AgentName[]>(
    Object.keys(INITIAL_AGENTS) as AgentName[]
  );
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentName, AgentStatus>>(
    () => Object.keys(INITIAL_AGENTS).reduce((acc, key) => {
      acc[key as AgentName] = { status: 'idle' };
      return acc;
    }, {} as Record<AgentName, AgentStatus>)
  );
  const [mergedComments, setMergedComments] = useState<Comment[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setVideoFile(file);
    setMergedComments(null);
    setError(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!videoFile) {
      setError('Please select a video file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMergedComments([]);
    setAgentStatuses(
      Object.keys(agents).reduce((acc, key) => {
        acc[key as AgentName] = { status: 'idle' };
        return acc;
      }, {} as Record<AgentName, AgentStatus>)
    );

    let accumulatedComments: Comment[] = [];
    
    for (const agentId of executionOrder) {
      const agent = agents[agentId];
      setAgentStatuses(prev => ({ ...prev, [agentId]: { status: 'loading' } }));
      
      try {
        const newComments = await generateCommentsForAgent(
          agent,
          videoFile.name,
          articleText,
          accumulatedComments
        );
        
        const commentsWithId = newComments.map(c => ({ ...c, agentId: agent.id }));
        
        accumulatedComments = [...accumulatedComments, ...commentsWithId];
        
        setMergedComments(prev => 
          [...(prev || []), ...commentsWithId].sort((a, b) => a.time.localeCompare(b.time))
        );
        
        setAgentStatuses(prev => ({ ...prev, [agentId]: { status: 'success' } }));

      } catch (e) {
        console.error(`Error with ${agent.name}:`, e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        setAgentStatuses(prev => ({
          ...prev,
          [agentId]: { status: 'error', error: errorMessage },
        }));
        setError(`Execution stopped due to an error with ${agent.name}.`);
        setIsLoading(false);
        return; 
      }
    }

    setIsLoading(false);
  }, [videoFile, articleText, agents, executionOrder]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500">
            NicoNico Multi-Agent Comment Generator
          </h1>
          <p className="mt-2 text-gray-400">
            AI agents collaborate to create Niconico-style video comments.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-2">1. Upload Media</h2>
            <div className="space-y-6">
              <FileUploader onFileChange={handleFileChange} />
              <div>
                <label htmlFor="article" className="block text-sm font-medium text-gray-300 mb-2">
                  Optional: Paste an article for context
                </label>
                <textarea
                  id="article"
                  rows={6}
                  value={articleText}
                  onChange={(e) => setArticleText(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Paste article content here..."
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-2">2. Configure Agents & Order</h2>
            <AgentEditorList
              agents={agents}
              setAgents={setAgents}
              executionOrder={executionOrder}
              setExecutionOrder={setExecutionOrder}
              statuses={agentStatuses}
            />
            <div className="mt-6">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !videoFile}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                <BotMessageSquare className="w-6 h-6" />
                {isLoading ? 'Agents are thinking...' : 'Generate Comments'}
              </button>
              {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            </div>
          </div>
        </main>
        
        {mergedComments && mergedComments.length > 0 && (
          <section className="mt-8 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
             <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-2">3. Merged Comment Timeline</h2>
             <CommentView comments={mergedComments} />
          </section>
        )}
      </div>
       <footer className="text-center p-4 text-gray-500 text-sm">
        Built by a world-class senior frontend React engineer with expertise in Gemini API.
      </footer>
    </div>
  );
};

export default App;