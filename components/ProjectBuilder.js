// components/ProjectBuilder.js - AI-Powered Project Builder Interface
import React, { useState } from 'react';

export default function ProjectBuilder() {
  const [prompt, setPrompt] = useState('');
  const [projectType, setProjectType] = useState('web');
  const [requirements, setRequirements] = useState([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [projectPlan, setProjectPlan] = useState(null);
  const [newRequirement, setNewRequirement] = useState('');

  const projectTypes = [
    { id: 'web', name: 'Web Application', icon: '🌐' },
    { id: 'api', name: 'REST API', icon: '⚡' },
    { id: 'mobile', name: 'Mobile App', icon: '📱' },
    { id: 'java', name: 'Java Application', icon: '☕' },
    { id: 'firebase', name: 'Firebase Project', icon: '🔥' },
    { id: 'fullstack', name: 'Full Stack', icon: '🚀' }
  ];

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (req) => {
    setRequirements(requirements.filter(r => r !== req));
  };

  const buildProject = async () => {
    if (!prompt.trim()) return;

    setIsBuilding(true);
    try {
      const response = await fetch('/api/gemini/project-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          projectType,
          requirements,
          buildContext: {
            framework: 'next.js',
            styling: 'tailwindcss',
            database: 'firebase',
            deployment: 'vercel'
          }
        })
      });

      if (!response.ok) throw new Error('Failed to build project');

      const data = await response.json();
      setProjectPlan(data.projectPlan);
    } catch (error) {
      console.error('Build error:', error);
      alert('Failed to build project. Please try again.');
    } finally {
      setIsBuilding(false);
    }
  };

  const downloadFile = (file) => {
    const element = document.createElement('a');
    const fileBlob = new Blob([file.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.path.split('/').pop();
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">🏗️</span>
        <h2 className="text-2xl font-bold text-white">AI Project Builder</h2>
        <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Powered by Gemini</span>
      </div>

      {!projectPlan ? (
        <div className="space-y-6">
          {/* Project Prompt */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Describe your project (be as detailed as possible):
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Create a social media dashboard with user authentication, real-time messaging, post creation, and analytics. Include Firebase backend, responsive design, and dark mode support."
              className="w-full h-32 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-white font-semibold mb-2">Project Type:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setProjectType(type.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    projectType === type.id
                      ? 'bg-blue-500 border-blue-400 text-white'
                      : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-white font-semibold mb-2">Additional Requirements:</label>
            <div className="flex space-x-2 mb-2">
              <input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                placeholder="e.g., TypeScript, Redux, Testing"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addRequirement}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req, index) => (
                <span
                  key={index}
                  className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {req}
                  <button
                    onClick={() => removeRequirement(req)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Build Button */}
          <button
            onClick={buildProject}
            disabled={!prompt.trim() || isBuilding}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
          >
            {isBuilding ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Building your project with Gemini AI...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2">🚀</span>
                Build Project with AI
              </div>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Project Analysis */}
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-300 mb-2">✅ Project Analysis</h3>
            <p className="text-gray-300 text-sm">{projectPlan.analysis}</p>
          </div>

          {/* Architecture */}
          {projectPlan.architecture && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">🏗️ Architecture</h3>
              <p className="text-gray-300 text-sm">{projectPlan.architecture}</p>
            </div>
          )}

          {/* Generated Files */}
          {projectPlan.fileStructure && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">📁 Generated Files</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {projectPlan.fileStructure.files?.map((file, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-300 font-mono text-sm">{file.path}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(file.content)}
                          className="text-gray-400 hover:text-white text-xs"
                        >
                          📋 Copy
                        </button>
                        <button
                          onClick={() => downloadFile(file)}
                          className="text-gray-400 hover:text-white text-xs"
                        >
                          📥 Download
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{file.description}</p>
                    <pre className="text-xs text-gray-300 bg-black/20 p-2 rounded overflow-x-auto max-h-32">
                      {file.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commands */}
          {projectPlan.commands && (
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(projectPlan.commands).map(([key, commands]) => (
                <div key={key} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <h4 className="text-white font-semibold mb-2 capitalize">{key}</h4>
                  <div className="space-y-1">
                    {commands.map((cmd, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <code className="text-green-300 text-xs">{cmd}</code>
                        <button
                          onClick={() => copyToClipboard(cmd)}
                          className="text-gray-400 hover:text-white text-xs ml-2"
                        >
                          📋
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Start New Project */}
          <button
            onClick={() => {
              setProjectPlan(null);
              setPrompt('');
              setRequirements([]);
            }}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Build Another Project
          </button>
        </div>
      )}
    </div>
  );
}
