// src/components/admin/stats-dashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageCircle, 
  Crown, 
  TrendingUp, 
  Eye, 
  DollarSign, 
  Zap, 
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";

interface StatsData {
  totalUsers: number;
  totalMessages: number;
  premiumUsers: number;
  activeToday: number;
  freeMessagesUsed: number;
  freeMessagesTotal: number;
  conversionRate: number;
  avgMessagesPerUser: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueGrowth: number;
  userGrowth: number;
  recentActivity: Array<{
    emoji: string;
    message: string;
    time: string;
    type: 'signup' | 'premium' | 'message' | 'reveal';
  }>;
  topUsers: Array<{
    username: string;
    messages: number;
    isPremium: boolean;
  }>;
  messageTrends: Array<{
    date: string;
    messages: number;
    signups: number;
  }>;
}

interface StatsDashboardProps {
  compact?: boolean;
}

export function StatsDashboard({ compact = false }: StatsDashboardProps) {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalMessages: 0,
    premiumUsers: 0,
    activeToday: 0,
    freeMessagesUsed: 0,
    freeMessagesTotal: 0,
    conversionRate: 0,
    avgMessagesPerUser: 0,
    revenueToday: 0,
    revenueThisWeek: 0,
    revenueGrowth: 0,
    userGrowth: 0,
    recentActivity: [],
    topUsers: [],
    messageTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadStats = async () => {
    setRefreshing(true);
    
    // Simulate API call with realistic data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockStats: StatsData = {
      totalUsers: 1247,
      totalMessages: 8563,
      premiumUsers: 89,
      activeToday: 234,
      freeMessagesUsed: 4231,
      freeMessagesTotal: 5000,
      conversionRate: 7.1,
      avgMessagesPerUser: 6.8,
      revenueToday: 45.50,
      revenueThisWeek: 315.75,
      revenueGrowth: 12.5,
      userGrowth: 8.2,
      recentActivity: [
        { emoji: "🎉", message: "New user @taylorswift13 signed up", time: "2 minutes ago", type: 'signup' },
        { emoji: "💎", message: "User @charlidamelio upgraded to premium", time: "5 minutes ago", type: 'premium' },
        { emoji: "💌", message: "15 messages sent in the last hour", time: "10 minutes ago", type: 'message' },
        { emoji: "👀", message: "3 reveals purchased by @therock", time: "15 minutes ago", type: 'reveal' },
        { emoji: "🚀", message: "User @kyliejenner shared their link 5 times", time: "20 minutes ago", type: 'signup' }
      ],
      topUsers: [
        { username: "@therock", messages: 142, isPremium: true },
        { username: "@kyliejenner", messages: 128, isPremium: true },
        { username: "@selenagomez", messages: 115, isPremium: false },
        { username: "@justinbieber", messages: 98, isPremium: true },
        { username: "@arianagrande", messages: 87, isPremium: false }
      ],
      messageTrends: [
        { date: "Mon", messages: 234, signups: 45 },
        { date: "Tue", messages: 345, signups: 67 },
        { date: "Wed", messages: 278, signups: 52 },
        { date: "Thu", messages: 412, signups: 89 },
        { date: "Fri", messages: 389, signups: 76 },
        { date: "Sat", messages: 523, signups: 98 },
        { date: "Sun", messages: 467, signups: 84 }
      ]
    };
    
    setStats(mockStats);
    setLoading(false);
    setRefreshing(false);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const exportData = () => {
    // Simulate data export
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lol-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      {!compact && (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Real-time insights about your LOL app</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <Button
              onClick={loadStats}
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              onClick={exportData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className={`grid gap-6 ${compact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {/* Total Users */}
        <Card className="p-6 transition-all duration-300 border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 ${getGrowthColor(stats.userGrowth)}`}>
              {getGrowthIcon(stats.userGrowth)}
              <span className="text-sm font-semibold">{Math.abs(stats.userGrowth)}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-gray-600">Total Users</p>
          </div>
          {!compact && (
            <div className="mt-2 text-xs text-gray-500">
              {stats.activeToday} active today
            </div>
          )}
        </Card>

        {/* Total Messages */}
        <Card className="p-6 transition-all duration-300 border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalMessages.toLocaleString()}</p>
            <p className="text-gray-600">Messages Sent</p>
          </div>
          {!compact && (
            <div className="mt-2 text-xs text-gray-500">
              {stats.avgMessagesPerUser} per user
            </div>
          )}
        </Card>

        {/* Premium Users */}
        <Card className="p-6 transition-all duration-300 border-green-200 bg-white/80 backdrop-blur-sm hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 ${getGrowthColor(stats.conversionRate)}`}>
              {getGrowthIcon(stats.conversionRate)}
              <span className="text-sm font-semibold">{stats.conversionRate}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.premiumUsers}</p>
            <p className="text-gray-600">Premium Users</p>
          </div>
          {!compact && (
            <div className="mt-2 text-xs text-gray-500">
              {stats.conversionRate}% conversion
            </div>
          )}
        </Card>

        {/* Revenue */}
        <Card className="p-6 transition-all duration-300 border-orange-200 bg-white/80 backdrop-blur-sm hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 ${getGrowthColor(stats.revenueGrowth)}`}>
              {getGrowthIcon(stats.revenueGrowth)}
              <span className="text-sm font-semibold">{Math.abs(stats.revenueGrowth)}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">${stats.revenueThisWeek.toFixed(2)}</p>
            <p className="text-gray-600">Revenue This Week</p>
          </div>
          {!compact && (
            <div className="mt-2 text-xs text-gray-500">
              ${stats.revenueToday} today
            </div>
          )}
        </Card>
      </div>

      {!compact && (
        <>
          {/* Second Row - Detailed Metrics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Message Limits Usage */}
            <Card className="p-6 border-purple-200 bg-white/80 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                <Eye className="w-5 h-5 text-purple-500" />
                Message Limits Usage
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-gray-600">Free messages used:</span>
                    <span className="font-semibold text-purple-600">
                      {stats.freeMessagesUsed.toLocaleString()}/{stats.freeMessagesTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div 
                      className="h-3 transition-all duration-1000 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${(stats.freeMessagesUsed / stats.freeMessagesTotal) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {Math.round((stats.freeMessagesUsed / stats.freeMessagesTotal) * 100)}% of free message limits used
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="p-3 text-center rounded-lg bg-purple-50">
                    <div className="text-lg font-bold text-purple-600">{stats.activeToday}</div>
                    <div className="text-sm text-gray-600">Active Today</div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-blue-50">
                    <div className="text-lg font-bold text-blue-600">{stats.avgMessagesPerUser}</div>
                    <div className="text-sm text-gray-600">Avg per User</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Revenue Breakdown */}
            <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                <DollarSign className="w-5 h-5 text-green-500" />
                Revenue Analytics
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-green-50">
                    <div className="text-lg font-bold text-green-600">${stats.revenueToday}</div>
                    <div className="text-sm text-gray-600">Today</div>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <div className="text-lg font-bold text-purple-600">${stats.revenueThisWeek}</div>
                    <div className="text-sm text-gray-600">This Week</div>
                  </div>
                </div>
                
                <div className="p-3 text-white rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">${(stats.revenueThisWeek * 4.33).toFixed(0)}</div>
                      <div className="text-green-100">Projected Monthly</div>
                    </div>
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Third Row - Charts and Lists */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Activity */}
            <Card className="p-6 border-gray-200 bg-white/80 backdrop-blur-sm lg:col-span-2">
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                <Zap className="w-5 h-5 text-yellow-500" />
                Recent Activity
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-80">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
                    <div className="flex items-center justify-center w-8 h-8 text-sm text-white rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                      {activity.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'premium' ? 'bg-green-100 text-green-800' :
                      activity.type === 'message' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'reveal' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.type}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Users */}
            <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                <Crown className="w-5 h-5 text-yellow-500" />
                Top Users
              </h3>
              <div className="space-y-3">
                {stats.topUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 text-xs text-white rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.messages} messages</p>
                      </div>
                    </div>
                    {user.isPremium && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Message Trends Chart */}
          <Card className="p-6 border-purple-200 bg-white/80 backdrop-blur-sm">
            <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Message Trends This Week
            </h3>
            <div className="flex items-end justify-between h-40 gap-2">
              {stats.messageTrends.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full transition-all duration-500 rounded-t-lg bg-gradient-to-t from-purple-500 to-pink-500 hover:opacity-80"
                    style={{ height: `${(day.messages / 600) * 100}%` }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-600">{day.date}</div>
                  <div className="text-xs font-semibold text-gray-800">{day.messages}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}