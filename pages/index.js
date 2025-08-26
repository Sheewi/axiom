import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  Bot,
  TrendingUp,
  DollarSign,
  Activity,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Globe,
  Server,
  Database,
  Cpu,
  Monitor,
  Network
} from 'lucide-react';

// Real-time data simulation (replace with actual API calls)
const useRealTimeData = () => {
  const [data, setData] = useState({
    systemHealth: {
      overall: 95,
      bots: { active: 18, total: 19, offline: 1 },
      apis: { healthy: 12, total: 14, failing: 2 },
      latency: 145
    },
    financial: {
      dailyRevenue: 2847.52,
      monthlyRevenue: 48962.31,
      burnRate: 812.45,
      netProfit: 36149.86,
      roi: 445.2
    },
    bots: [
      { id: 'scout', name: 'Scout/Crawler', status: 'active', revenue: 1247.32, efficiency: 94 },
      { id: 'creator', name: 'Creator Bot', status: 'active', revenue: 856.21, efficiency: 91 },
      { id: 'subbie', name: 'Subbie', status: 'active', revenue: 456.78, efficiency: 88 },
      { id: 'appy', name: 'Appy Deployer', status: 'warning', revenue: 287.21, efficiency: 76 },
      { id: 'chain', name: 'Chain Crypto', status: 'active', revenue: 892.45, efficiency: 97 }
    ],
    alerts: [
      { id: 1, type: 'warning', message: 'Appy deployment latency increased', time: '2 min ago' },
      { id: 2, type: 'success', message: 'Scout found 12 new affiliate opportunities', time: '5 min ago' },
      { id: 3, type: 'info', message: 'Creator generated 24 articles', time: '8 min ago' }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        systemHealth: {
          ...prev.systemHealth,
          latency: prev.systemHealth.latency + Math.floor(Math.random() * 20 - 10)
        },
        financial: {
          ...prev.financial,
          dailyRevenue: prev.financial.dailyRevenue + Math.random() * 10
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

export default function AxiomCommandCenter() {
  const data = useRealTimeData();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <Head>
        <title>Axiom Command Center - Ecosystem Dashboard</title>
        <meta name="description" content="Advanced AI Ecosystem Command & Control Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-6">
          
          {/* Command Center Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Axiom <span className="text-blue-400">Command Center</span>
                </h1>
                <p className="text-lg text-gray-300">
                  Ecosystem Health & Performance Dashboard
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${data.systemHealth.overall > 90 ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
                  <span className="text-white font-semibold">System Health: {data.systemHealth.overall}%</span>
                </div>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              </div>
            </div>
          </motion.header>

          {/* Layer 1: Executive Overview - The "Bridge" */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Executive Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Net Profit */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-8 w-8 text-green-400" />
                  <span className="text-sm text-green-400 font-semibold">+12.3%</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Net Profit</h3>
                <p className="text-3xl font-bold text-green-400">${data.financial.netProfit.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mt-2">Monthly Total</p>
              </div>

              {/* System Health */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-8 w-8 text-blue-400" />
                  <div className={`w-4 h-4 rounded-full ${data.systemHealth.overall > 90 ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">System Health</h3>
                <p className="text-3xl font-bold text-blue-400">{data.systemHealth.overall}%</p>
                <p className="text-sm text-gray-400 mt-2">All Systems</p>
              </div>

              {/* Active Assets */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <Bot className="h-8 w-8 text-purple-400" />
                  <span className="text-sm text-purple-400 font-semibold">{data.systemHealth.bots.active}/{data.systemHealth.bots.total}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Active Bots</h3>
                <p className="text-3xl font-bold text-purple-400">{data.systemHealth.bots.active}</p>
                <p className="text-sm text-gray-400 mt-2">Operational</p>
              </div>

              {/* ROI Efficiency */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-400" />
                  <span className="text-sm text-orange-400 font-semibold">+{data.financial.roi}%</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">ROI Efficiency</h3>
                <p className="text-3xl font-bold text-orange-400">{data.financial.roi}%</p>
                <p className="text-sm text-gray-400 mt-2">Revenue vs Expenses</p>
              </div>
            </div>
          </motion.section>

          {/* Layer 2: Bot Performance & Network Graph */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            
            {/* Bot Performance Panel */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-bold text-white mb-4">🤖 Bot Ecosystem Status</h2>
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="space-y-4">
                  {data.bots.map((bot, index) => (
                    <motion.div
                      key={bot.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusBg(bot.status)}`}></div>
                        <div>
                          <h4 className="text-white font-semibold">{bot.name}</h4>
                          <p className={`text-sm ${getStatusColor(bot.status)}`}>
                            {bot.status === 'active' ? 'Operational' : bot.status === 'warning' ? 'Warning' : 'Error'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">${bot.revenue.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">{bot.efficiency}% efficiency</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Real-time Alerts & Events */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">🚨 Live Event Stream</h2>
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 h-80 overflow-y-auto">
                <div className="space-y-3">
                  {data.alerts.map((alert) => (
                    <div key={alert.id} className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-start space-x-3">
                        {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />}
                        {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />}
                        {alert.type === 'info' && <Activity className="h-4 w-4 text-blue-400 mt-0.5" />}
                        <div>
                          <p className="text-white text-sm">{alert.message}</p>
                          <p className="text-gray-400 text-xs mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Layer 3: System Metrics & Performance */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">📊 System Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <Server className="h-6 w-6 text-blue-400" />
                  <span className="text-sm text-blue-400">API Health</span>
                </div>
                <p className="text-2xl font-bold text-white">{data.systemHealth.apis.healthy}/{data.systemHealth.apis.total}</p>
                <p className="text-sm text-gray-400">Services Online</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  <span className="text-sm text-yellow-400">Latency</span>
                </div>
                <p className="text-2xl font-bold text-white">{data.systemHealth.latency}ms</p>
                <p className="text-sm text-gray-400">Average Response</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                  <span className="text-sm text-green-400">Daily Revenue</span>
                </div>
                <p className="text-2xl font-bold text-white">${data.financial.dailyRevenue.toFixed(0)}</p>
                <p className="text-sm text-gray-400">Real-time</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <Database className="h-6 w-6 text-purple-400" />
                  <span className="text-sm text-purple-400">Burn Rate</span>
                </div>
                <p className="text-2xl font-bold text-white">${data.financial.burnRate.toFixed(0)}</p>
                <p className="text-sm text-gray-400">Monthly</p>
              </div>
            </div>
          </motion.section>

          {/* Command Controls */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6">⚡ Command Controls</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>Deploy New Bot</span>
              </button>
              <a 
                href="/gemini-studio"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>Gemini AI Studio</span>
              </a>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics Deep Dive</span>
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Firebase Console</span>
              </button>
            </div>
          </motion.section>
        </div>
      </main>
    </>
  );
}
