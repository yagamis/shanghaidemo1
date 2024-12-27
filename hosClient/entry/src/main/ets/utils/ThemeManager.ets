import { StorageUtil } from './StorageUtil';
import { eventBus } from './EventBus';

export interface Theme {
  colorMode: 'light' | 'dark';
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    header: string;
  };
}

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: Theme;

  private lightTheme: Theme = {
    colorMode: 'light',
    colors: {
      primary: '#2196F3',
      background: '#F5F5F5',
      card: '#FFFFFF',
      text: '#333333',
      border: '#EEEEEE',
      header: '#FFFFFF'
    }
  };

  private darkTheme: Theme = {
    colorMode: 'dark',
    colors: {
      primary: '#64B5F6',
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      border: '#333333',
      header: '#1E1E1E'
    }
  };

  private constructor() {
    this.currentTheme = this.lightTheme;
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  async init() {
    const isDark = await StorageUtil.getTheme();
    this.setTheme(isDark ? 'dark' : 'light');
  }

  setTheme(mode: 'light' | 'dark') {
    this.currentTheme = mode === 'dark' ? this.darkTheme : this.lightTheme;
    StorageUtil.setTheme(mode === 'dark');
    eventBus.emit('themeChange', this.currentTheme);
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  isDarkMode(): boolean {
    return this.currentTheme.colorMode === 'dark';
  }
}

export const themeManager = ThemeManager.getInstance(); 