import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Axiom AI Ecosystem</title>
        <meta name="description" content="Advanced Multi-Bot AI Platform for Web Scripting and Java Development" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4">
              Axiom AI <span className="text-blue-400">Ecosystem</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced Multi-Bot AI Platform designed for Web Scripting and Advanced Java Scripting classes
            </p>
          </header>

          {/* Dashboard Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Bot Management Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  🤖
                </div>
                <h3 className="text-xl font-semibold text-white">Bot Management</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Create and manage AI bots with different capabilities and frameworks
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Active Bots:</span>
                  <span className="text-green-400">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bot Types:</span>
                  <span className="text-blue-400">5</span>
                </div>
              </div>
            </div>

            {/* Firebase Integration Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                  🔥
                </div>
                <h3 className="text-xl font-semibold text-white">Firebase Services</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Cloud database, authentication, and serverless functions
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Functions:</span>
                  <span className="text-green-400">9</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Collections:</span>
                  <span className="text-blue-400">4</span>
                </div>
              </div>
            </div>

            {/* Java Integration Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  ☕
                </div>
                <h3 className="text-xl font-semibold text-white">Java Integration</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Advanced Java scripting with Maven and Gradle support
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">JDK Version:</span>
                  <span className="text-green-400">17</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Build Tools:</span>
                  <span className="text-blue-400">Maven + Gradle</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <section className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Technology Stack</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Frontend</h4>
                <p className="text-gray-300 text-sm">Next.js 13, React 18, TailwindCSS</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-green-400 mb-2">Backend</h4>
                <p className="text-gray-300 text-sm">Firebase Functions, Node.js</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Database</h4>
                <p className="text-gray-300 text-sm">Firestore, Cloud Storage</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-orange-400 mb-2">Languages</h4>
                <p className="text-gray-300 text-sm">JavaScript, Java, Python</p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Create New Bot
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                View Analytics
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Run Java Script
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Firebase Console
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
