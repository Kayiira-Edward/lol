// src/app/(dashboard)/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { Users, MessageCircle, Crown, TrendingUp, Eye } from "lucide-react";
import { useRealtimeStats } from '@/hooks/use-realtime-stats';

export default function AdminPage() {
  const { stats, loading } = useRealtimeStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="pt-8 mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            <GradientText>Admin Dashboard</GradientText> 👑
          </h1>
          <p className="text-lg text-gray-600">
            Real-time analytics for your LOL app
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-purple-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalMessages}</p>
                <p className="text-gray-600">Messages Sent</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.premiumUsers}</p>
                <p className="text-gray-600">Premium Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-orange-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.activeToday}</p>
                <p className="text-gray-600">Active Today</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6 border-purple-200 bg-white/80 backdrop-blur-sm">
            <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold">
              <Eye className="w-5 h-5 text-purple-500" />
              Message Limits Usage
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-600">Free messages used:</span>
                  <span className="font-semibold text-purple-600">
                    {stats.freeMessagesUsed}/{stats.freeMessagesTotal}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 transition-all rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${(stats.freeMessagesUsed / stats.freeMessagesTotal) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {Math.round((stats.freeMessagesUsed / stats.freeMessagesTotal) * 100)}% of free message limits used
              </p>
            </div>
          </Card>

          <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <h3 className="mb-4 text-xl font-semibold">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-semibold text-green-600">{stats.conversionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Messages/User</span>
                <span className="font-semibold text-blue-600">{stats.avgMessagesPerUser}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Revenue Today</span>
                <span className="font-semibold text-green-600">${stats.revenueToday}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mt-6 border-gray-200 bg-white/80 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-semibold">Recent Activity</h3>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8 text-sm text-white rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  {activity.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}