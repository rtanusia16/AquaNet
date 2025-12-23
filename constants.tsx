
import { Device, Achievement, WaterUsageData, Screen } from './types';

// Centralized navigation items for both Lumina and AquaNet sidebars
export const NAV_ITEMS = [
  { id: Screen.MAIN, label: 'Dashboard', icon: 'fa-house-chimney' },
  { id: Screen.ANALYTICS, label: 'Usage Stats', icon: 'fa-chart-simple' },
  { id: Screen.AI_ASSISTANT, label: 'AquaNode Chat', icon: 'fa-robot' },
  { id: Screen.COMMUNITY, label: 'Social', icon: 'fa-users' },
  { id: Screen.DEVICES, label: 'My Devices', icon: 'fa-microchip' },
  { id: Screen.ACHIEVEMENTS, label: 'Trophies', icon: 'fa-trophy' },
];

export const USAGE_DATA: WaterUsageData[] = [
  { day: 'Mon', amount: 12 },
  { day: 'Tue', amount: 18 },
  { day: 'Wed', amount: 14 },
  { day: 'Thu', amount: 22 },
  { day: 'Fri', amount: 15 },
  { day: 'Sat', amount: 10 },
  { day: 'Sun', amount: 9 },
];

export const MONTH_USAGE_DATA = [
  { day: 'W1', amount: 110 },
  { day: 'W2', amount: 145 },
  { day: 'W3', amount: 95 },
  { day: 'W4', amount: 150 },
];

export const WEEKLY_COMPARISON_DATA = [
  { day: 'Mon', thisWeek: 12, lastWeek: 15 },
  { day: 'Tue', thisWeek: 18, lastWeek: 14 },
  { day: 'Wed', thisWeek: 14, lastWeek: 16 },
  { day: 'Thu', thisWeek: 22, lastWeek: 12 },
  { day: 'Fri', thisWeek: 15, lastWeek: 18 },
  { day: 'Sat', thisWeek: 10, lastWeek: 11 },
  { day: 'Sun', thisWeek: 9, lastWeek: 8 },
];

export const CATEGORY_BREAKDOWN = [
  { name: 'Shower', value: 45, color: '#3b82f6' },
  { name: 'Kitchen', value: 25, color: '#60a5fa' },
  { name: 'Laundry', value: 20, color: '#93c5fd' },
  { name: 'Garden', value: 10, color: '#bfdbfe' },
];

export const CONNECTED_DEVICES: Device[] = [
  { id: 'd1', name: 'Kitchen Pipe Sensor', status: 'Active', lastSync: '2 mins ago', type: 'Sensor' },
  { id: 'd2', name: 'Bathroom Pipe', status: 'Low Battery', lastSync: '12 mins ago', type: 'Sensor' },
  { id: 'd3', name: 'Laundry Sensor', status: 'Active', lastSync: '1 hour ago', type: 'Sensor' },
  { id: 'v1', name: 'Main Valve Control', status: 'Active', lastSync: '1 min ago', type: 'Valve' },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'Leak Detective', icon: 'fa-magnifying-glass', color: 'bg-amber-500', unlocked: true },
  { id: 'a2', title: 'Under Budget', icon: 'fa-check-double', color: 'bg-emerald-500', unlocked: true },
  { id: 'a3', title: 'Community Hero', icon: 'fa-users', color: 'bg-indigo-500', unlocked: false },
  { id: 'a4', title: 'Early Bird', icon: 'fa-sun', color: 'bg-orange-400', unlocked: true },
  { id: 'a5', title: 'Sustainability Pro', icon: 'fa-leaf', color: 'bg-green-500', unlocked: false },
  { id: 'a6', title: 'Valve Master', icon: 'fa-faucet', color: 'bg-blue-400', unlocked: true },
];

export const LEADERBOARD = [
  { rank: 1, name: 'EcoFam_2024', savings: '450L', points: 1250 },
  { rank: 2, name: 'WaterSage', savings: '420L', points: 1180 },
  { rank: 3, name: 'GreenHouse', savings: '390L', points: 1120 },
  { rank: 4, name: 'You (Dev Alpha)', savings: '385L', points: 1100 },
  { rank: 5, name: 'RainCollector', savings: '350L', points: 980 },
];
