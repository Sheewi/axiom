import React from 'react';
import Head from 'next/head';
import GeminiChat from '../components/GeminiChat';
import ProjectBuilder from '../components/ProjectBuilder';

export default function GeminiStudio() {
  return (
    <>
      <Head>
        <title>Gemini AI Studio - Project Builder</title>
        <meta name="description" content="AI-Powered Project Generation with Gemini" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4">
              Gemini AI <span className="text-purple-400">Studio</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Let Gemini AI build your entire project based on your prompts and requirements
            </p>
          </header>

          {/* AI Project Builder */}
          <div className="mb-12">
            <ProjectBuilder />
          </div>

          {/* Gemini AI Chat */}
          <div className="mb-12">
            <GeminiChat />
          </div>

          {/* Back to Dashboard */}
          <div className="text-center">
            <a 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <span>← Back to Command Center</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
