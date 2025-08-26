# Multi-Platform UI Implementation Guide

## Desktop Application (Electron + React + TypeScript)

### Project Structure for Desktop App

```
axiom-desktop/
├── src/
│   ├── main/                   # Electron main process
│   │   ├── main.ts
│   │   ├── preload.ts
│   │   ├── ipc-handlers.ts
│   │   └── auto-updater.ts
│   ├── renderer/               # React renderer process
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── styles/
│   ├── shared/                 # Shared types and utilities
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
├── assets/
├── build/
├── dist/
├── package.json
├── electron-builder.yml
└── forge.config.js
```

### Main Electron Process

```typescript
// src/main/main.ts
import { app, BrowserWindow, ipcMain, shell, Menu, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import isDev from 'electron-is-dev'
import { setupIpcHandlers } from './ipc-handlers'
import { AxiomBot } from '../shared/types/bots'

class AxiomDesktopApp {
  private mainWindow: BrowserWindow | null = null
  private bots: Map<string, AxiomBot> = new Map()

  constructor() {
    this.createWindow = this.createWindow.bind(this)
    this.setupApp()
  }

  private setupApp() {
    app.whenReady().then(() => {
      this.createWindow()
      this.setupMenu()
      this.setupAutoUpdater()
      setupIpcHandlers(this.bots)

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow()
        }
      })
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'hiddenInset',
      frame: process.platform === 'darwin',
      show: false,
      icon: path.join(__dirname, '../assets/icon.png')
    })

    // Load the app
    const startUrl = isDev 
      ? 'http://localhost:3000' 
      : `file://${path.join(__dirname, '../build/index.html')}`
    
    this.mainWindow.loadURL(startUrl)

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
      
      if (isDev) {
        this.mainWindow?.webContents.openDevTools()
      }
    })

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })
  }

  private setupMenu() {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'Axiom',
        submenu: [
          {
            label: 'About Axiom',
            click: () => {
              dialog.showMessageBox(this.mainWindow!, {
                type: 'info',
                title: 'About Axiom',
                message: 'Axiom Bot Platform',
                detail: 'Version 2.5.0\nNext-generation AI automation platform'
              })
            }
          },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Bots',
        submenu: [
          {
            label: 'Start All Bots',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: () => {
              this.mainWindow?.webContents.send('start-all-bots')
            }
          },
          {
            label: 'Stop All Bots',
            accelerator: 'CmdOrCtrl+Shift+X',
            click: () => {
              this.mainWindow?.webContents.send('stop-all-bots')
            }
          },
          { type: 'separator' },
          {
            label: 'Bot Manager',
            accelerator: 'CmdOrCtrl+B',
            click: () => {
              this.mainWindow?.webContents.send('navigate-to', '/bots')
            }
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }

  private setupAutoUpdater() {
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify()
      
      autoUpdater.on('update-available', () => {
        dialog.showMessageBox(this.mainWindow!, {
          type: 'info',
          title: 'Update Available',
          message: 'A new version is available. It will be downloaded in the background.',
          buttons: ['OK']
        })
      })

      autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox(this.mainWindow!, {
          type: 'info',
          title: 'Update Ready',
          message: 'Update downloaded. Application will restart to apply the update.',
          buttons: ['Restart Now', 'Later']
        }).then((result) => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall()
          }
        })
      })
    }
  }
}

new AxiomDesktopApp()
```

### Desktop-Specific Components

```typescript
// src/renderer/components/desktop/SystemTray.tsx
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  Battery, 
  Monitor,
  Activity
} from 'lucide-react'

interface SystemStats {
  cpu: number
  memory: number
  disk: number
  network: {
    upload: number
    download: number
  }
  battery?: number
}

export const SystemTray: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const updateStats = async () => {
      try {
        const systemStats = await window.electronAPI.getSystemStats()
        setStats(systemStats)
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to get system stats:', error)
        setIsConnected(false)
      }
    }

    updateStats()
    const interval = setInterval(updateStats, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!stats) {
    return (
      <div className="bg-background-secondary rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-border-light rounded mb-2"></div>
          <div className="h-4 bg-border-light rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-secondary rounded-lg p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">System Status</h3>
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-accent-green' : 'bg-accent-red'}`}></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Cpu className="h-5 w-5 text-primary-500" />}
          label="CPU"
          value={`${stats.cpu}%`}
          progress={stats.cpu}
        />
        <StatCard
          icon={<Monitor className="h-5 w-5 text-accent-purple" />}
          label="Memory"
          value={`${stats.memory}%`}
          progress={stats.memory}
        />
        <StatCard
          icon={<HardDrive className="h-5 w-5 text-accent-orange" />}
          label="Disk"
          value={`${stats.disk}%`}
          progress={stats.disk}
        />
        {stats.battery && (
          <StatCard
            icon={<Battery className="h-5 w-5 text-accent-green" />}
            label="Battery"
            value={`${stats.battery}%`}
            progress={stats.battery}
          />
        )}
      </div>

      <div className="border-t border-border-light pt-4">
        <div className="flex items-center space-x-2 mb-2">
          <Wifi className="h-4 w-4 text-primary-500" />
          <span className="text-sm font-medium text-text-primary">Network</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-text-secondary">Upload:</span>
            <span className="ml-1 text-text-primary">{formatBytes(stats.network.upload)}/s</span>
          </div>
          <div>
            <span className="text-text-secondary">Download:</span>
            <span className="ml-1 text-text-primary">{formatBytes(stats.network.download)}/s</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const StatCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: string
  progress: number
}> = ({ icon, label, value, progress }) => {
  const getProgressColor = (value: number) => {
    if (value < 50) return 'bg-accent-green'
    if (value < 80) return 'bg-accent-orange'
    return 'bg-accent-red'
  }

  return (
    <div className="bg-background-primary rounded-lg p-3">
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-text-primary">{label}</span>
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-text-secondary">{value}</span>
      </div>
      <div className="w-full bg-border-light rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${getProgressColor(progress)}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
```

## Mobile Application (React Native + TypeScript)

### Project Structure for Mobile App

```
axiom-mobile/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── navigation/
│   │   └── bots/
│   ├── screens/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── bots/
│   │   └── settings/
│   ├── navigation/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   └── styles/
├── android/
├── ios/
├── assets/
├── package.json
└── app.json
```

### Mobile Navigation Setup

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { 
  Home, 
  Bot, 
  BarChart3, 
  Settings, 
  DollarSign 
} from 'lucide-react-native'
import { useAuth } from '../hooks/useAuth'

// Screens
import LoginScreen from '../screens/auth/LoginScreen'
import SignupScreen from '../screens/auth/SignupScreen'
import DashboardScreen from '../screens/dashboard/DashboardScreen'
import BotsScreen from '../screens/bots/BotsScreen'
import BotDetailScreen from '../screens/bots/BotDetailScreen'
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen'
import SettingsScreen from '../screens/settings/SettingsScreen'
import EarningsScreen from '../screens/earnings/EarningsScreen'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
)

const BotsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="BotsList" 
      component={BotsScreen}
      options={{ title: 'Your Bots' }}
    />
    <Stack.Screen 
      name="BotDetail" 
      component={BotDetailScreen}
      options={({ route }) => ({ title: route.params?.botName || 'Bot Details' })}
    />
  </Stack.Navigator>
)

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        switch (route.name) {
          case 'Dashboard':
            return <Home size={size} color={color} />
          case 'Bots':
            return <Bot size={size} color={color} />
          case 'Analytics':
            return <BarChart3 size={size} color={color} />
          case 'Earnings':
            return <DollarSign size={size} color={color} />
          case 'Settings':
            return <Settings size={size} color={color} />
          default:
            return null
        }
      },
      tabBarActiveTintColor: '#0ea5e9',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: '#e2e8f0',
        paddingTop: 8,
        paddingBottom: 8,
        height: 80
      }
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Bots" component={BotsStack} />
    <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    <Tab.Screen name="Earnings" component={EarningsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
)

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  )
}
```

### Mobile-Optimized Components

```typescript
// src/components/bots/MobileBotCard.tsx
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Bot, TrendingUp, DollarSign } from 'lucide-react-native'
import { ProgressBar } from '../ui/ProgressBar'

interface MobileBotCardProps {
  bot: {
    id: string
    name: string
    type: string
    status: 'active' | 'inactive' | 'error'
    dailyRevenue: number
    efficiency: number
  }
  onPress: () => void
}

export const MobileBotCard: React.FC<MobileBotCardProps> = ({ bot, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'inactive': return '#94a3b8'
      case 'error': return '#ef4444'
      default: return '#94a3b8'
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.botInfo}>
          <View style={styles.iconContainer}>
            <Bot size={24} color="#0ea5e9" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.botName}>{bot.name}</Text>
            <Text style={styles.botType}>{bot.type}</Text>
          </View>
        </View>
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(bot.status) }
          ]}
        >
          <Text style={styles.statusText}>{bot.status}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <DollarSign size={16} color="#10b981" />
          <View style={styles.metricText}>
            <Text style={styles.metricLabel}>Daily Revenue</Text>
            <Text style={styles.metricValue}>${bot.dailyRevenue}</Text>
          </View>
        </View>
        <View style={styles.metric}>
          <TrendingUp size={16} color="#8b5cf6" />
          <View style={styles.metricText}>
            <Text style={styles.metricLabel}>Efficiency</Text>
            <Text style={styles.metricValue}>{bot.efficiency}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Performance</Text>
        <ProgressBar 
          progress={bot.efficiency} 
          color="#0ea5e9"
          backgroundColor="#e2e8f0"
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  botName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  botType: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricText: {
    marginLeft: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
})
```

### Push Notifications Setup

```typescript
// src/services/NotificationService.ts
import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-async-storage/async-storage'

export class NotificationService {
  static async initialize() {
    // Request permission for iOS
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.log('Authorization status:', authStatus)
      await this.setupNotifications()
    }
  }

  static async setupNotifications() {
    // Configure push notifications
    PushNotification.configure({
      onRegister: async (token) => {
        console.log('TOKEN:', token)
        await this.saveTokenToServer(token.token)
      },

      onNotification: (notification) => {
        console.log('NOTIFICATION:', notification)
        
        // Handle notification tap
        if (notification.userInteraction) {
          this.handleNotificationTap(notification)
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    })

    // Handle background messages
    messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', remoteMessage)
      
      // Show local notification
      PushNotification.localNotification({
        title: remoteMessage.notification?.title || 'Axiom Bot Update',
        message: remoteMessage.notification?.body || 'Your bot has an update',
        data: remoteMessage.data,
      })
    })

    // Handle notification when app is opened from background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage)
      this.handleNotificationTap(remoteMessage)
    })

    // Handle notification when app is opened from quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage)
          this.handleNotificationTap(remoteMessage)
        }
      })
  }

  static async saveTokenToServer(token: string) {
    try {
      const userId = await AsyncStorage.getItem('userId')
      if (userId) {
        await fetch('/api/users/update-fcm-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            fcmToken: token,
          }),
        })
      }
    } catch (error) {
      console.error('Error saving token to server:', error)
    }
  }

  static handleNotificationTap(notification: any) {
    // Navigate based on notification data
    const { type, botId, screen } = notification.data || {}
    
    switch (type) {
      case 'bot_update':
        // Navigate to bot details
        break
      case 'revenue_alert':
        // Navigate to earnings screen
        break
      case 'system_alert':
        // Navigate to settings/system screen
        break
      default:
        // Navigate to dashboard
        break
    }
  }

  static async sendBotNotification(botId: string, message: string, type: string) {
    PushNotification.localNotification({
      title: 'Bot Update',
      message: message,
      data: {
        type: 'bot_update',
        botId: botId,
        notificationType: type,
      },
      actions: ['View Bot', 'Dismiss'],
    })
  }

  static async sendRevenueAlert(amount: number, period: string) {
    PushNotification.localNotification({
      title: 'Revenue Milestone! 🎉',
      message: `You've earned $${amount} ${period}!`,
      data: {
        type: 'revenue_alert',
        amount: amount,
        period: period,
      },
      actions: ['View Earnings', 'Dismiss'],
    })
  }
}
```

### Offline Support

```typescript
// src/services/OfflineService.ts
import NetInfo from '@react-native-netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BotData, AnalyticsData } from '../types'

export class OfflineService {
  private static isOnline = true
  private static pendingActions: any[] = []

  static async initialize() {
    // Monitor network status
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline
      this.isOnline = state.isConnected || false

      if (wasOffline && this.isOnline) {
        // Back online - sync pending actions
        this.syncPendingActions()
      }
    })

    // Load pending actions from storage
    await this.loadPendingActions()
  }

  static async cacheBotData(bots: BotData[]) {
    try {
      await AsyncStorage.setItem('cached_bots', JSON.stringify(bots))
      await AsyncStorage.setItem('cache_timestamp', Date.now().toString())
    } catch (error) {
      console.error('Error caching bot data:', error)
    }
  }

  static async getCachedBotData(): Promise<BotData[] | null> {
    try {
      const cachedBots = await AsyncStorage.getItem('cached_bots')
      if (cachedBots) {
        return JSON.parse(cachedBots)
      }
    } catch (error) {
      console.error('Error getting cached bot data:', error)
    }
    return null
  }

  static async cacheAnalyticsData(analytics: AnalyticsData) {
    try {
      await AsyncStorage.setItem('cached_analytics', JSON.stringify(analytics))
    } catch (error) {
      console.error('Error caching analytics data:', error)
    }
  }

  static async getCachedAnalyticsData(): Promise<AnalyticsData | null> {
    try {
      const cachedAnalytics = await AsyncStorage.getItem('cached_analytics')
      if (cachedAnalytics) {
        return JSON.parse(cachedAnalytics)
      }
    } catch (error) {
      console.error('Error getting cached analytics data:', error)
    }
    return null
  }

  static async queueAction(action: any) {
    this.pendingActions.push({
      ...action,
      timestamp: Date.now(),
    })
    await this.savePendingActions()

    if (this.isOnline) {
      await this.syncPendingActions()
    }
  }

  private static async syncPendingActions() {
    if (this.pendingActions.length === 0) return

    console.log(`Syncing ${this.pendingActions.length} pending actions...`)

    const actionsToSync = [...this.pendingActions]
    this.pendingActions = []

    for (const action of actionsToSync) {
      try {
        await this.executeAction(action)
      } catch (error) {
        console.error('Error syncing action:', error)
        // Re-queue failed actions
        this.pendingActions.push(action)
      }
    }

    await this.savePendingActions()
  }

  private static async executeAction(action: any) {
    switch (action.type) {
      case 'start_bot':
        await fetch(`/api/bots/${action.botId}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        break
      case 'stop_bot':
        await fetch(`/api/bots/${action.botId}/stop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        break
      case 'update_settings':
        await fetch(`/api/bots/${action.botId}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.settings),
        })
        break
      default:
        console.warn('Unknown action type:', action.type)
    }
  }

  private static async savePendingActions() {
    try {
      await AsyncStorage.setItem('pending_actions', JSON.stringify(this.pendingActions))
    } catch (error) {
      console.error('Error saving pending actions:', error)
    }
  }

  private static async loadPendingActions() {
    try {
      const pendingActions = await AsyncStorage.getItem('pending_actions')
      if (pendingActions) {
        this.pendingActions = JSON.parse(pendingActions)
      }
    } catch (error) {
      console.error('Error loading pending actions:', error)
    }
  }

  static getConnectionStatus() {
    return this.isOnline
  }
}
```

This comprehensive multi-platform implementation provides native desktop and mobile applications with offline support, push notifications, and platform-specific optimizations while maintaining consistency with the web platform's design and functionality.
