
import React, { useState } from 'react';
import { generateContentAdvice } from '../services/geminiService';

const Editor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success'>('idle');

  const handleAiAdvice = async () => {
    if (!title || !content) return;
    setIsLoading(true);
    const result = await generateContentAdvice(title, content);
    setAiResponse(result);
    setIsLoading(false);
  };

  const handlePublish = () => {
    setPublishStatus('publishing');
    setTimeout(() => {
      setPublishStatus('success');
      setTimeout(() => setPublishStatus('idle'), 3000);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Publish Studio</h1>
          <p className="text-slate-400">Craft your app listing with Gemini AI optimization</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAiAdvice}
            disabled={isLoading || !title}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            )}
            AI Optimize
          </button>
          <button 
            onClick={handlePublish}
            disabled={publishStatus !== 'idle'}
            className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
              publishStatus === 'success' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-white text-slate-900 hover:bg-slate-100'
            }`}
          >
            {publishStatus === 'publishing' ? (
              <><i className="fa-solid fa-rocket fa-bounce"></i> Publishing...</>
            ) : publishStatus === 'success' ? (
              <><i className="fa-solid fa-check"></i> Published!</>
            ) : (
              <><i className="fa-solid fa-paper-plane"></i> Publish App</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Input Side */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Project Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lumina Vision"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="space-y-2 flex-1 flex flex-col">
            <label className="text-sm font-bold text-slate-300">Description</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about your app's core features..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none h-64 flex-1"
            />
          </div>
        </div>

        {/* AI Output Side */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 overflow-y-auto">
          <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4">
            <i className="fa-solid fa-brain"></i>
            AI Copilot Insights
          </div>
          
          {!aiResponse && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <i className="fa-solid fa-robot text-5xl mb-4"></i>
              <p>Enter details and click Optimize to receive AI content suggestions.</p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              <div className="h-4 bg-slate-800 rounded w-2/3"></div>
              <div className="pt-4">
                <div className="h-4 bg-slate-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-800 rounded w-full mb-2"></div>
              </div>
            </div>
          )}

          {aiResponse && !isLoading && (
            <div className="prose prose-invert max-w-none">
              <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-xl text-slate-300 mb-6 leading-relaxed">
                {aiResponse.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Tone Score</h4>
                  <div className="text-2xl font-bold text-white">94/100</div>
                  <div className="text-xs text-emerald-400">Professional & Dynamic</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">SEO Rank</h4>
                  <div className="text-2xl font-bold text-white">High</div>
                  <div className="text-xs text-indigo-400">Competitive Keywords</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
