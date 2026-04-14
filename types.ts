
export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

export enum SecurityMode {
  VULNERABLE = 'VULNERABLE',
  PROTECTED = 'PROTECTED'
}

export interface KeyPosition {
  char: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export interface HackerEntry {
  id: string;
  timestamp: string;
  x: number;
  y: number;
  perceivedKey?: string; // What the hacker thinks it is
  actualKey?: string;    // Only available in vulnerable mode or for demo truth
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface EntropyScore {
  score: number; // 0-100
  label: string;
}
