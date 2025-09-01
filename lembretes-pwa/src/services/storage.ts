import { Platform } from 'react-native';
import { Reminder, AppSettings } from '../types';

// Chaves para armazenamento
const STORAGE_KEYS = {
  REMINDERS: '@lembretes_pwa:reminders',
  SETTINGS: '@lembretes_pwa:settings',
  USER_DATA: '@lembretes_pwa:user_data',
} as const;

// Interface para Web Storage
interface WebStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

// Implementação para Web usando localStorage
const createWebStorage = (): WebStorage => ({
  getItem: async (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  
  setItem: async (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  
  removeItem: async (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
  
  getAllKeys: async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return Object.keys(window.localStorage);
    }
    return [];
  },
});

// Implementação simples para React Native (memoria temporariamente)
const createNativeStorage = (): WebStorage => {
  let memoryStorage: { [key: string]: string } = {};
  
  return {
    getItem: async (key: string) => {
      return memoryStorage[key] || null;
    },
    
    setItem: async (key: string, value: string) => {
      memoryStorage[key] = value;
    },
    
    removeItem: async (key: string) => {
      delete memoryStorage[key];
    },
    
    getAllKeys: async () => {
      return Object.keys(memoryStorage);
    },
  };
};

// Storage unificado
const storage = Platform.OS === 'web' ? createWebStorage() : createNativeStorage();

class StorageService {
  // Operações gerais
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await storage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
      throw new Error(`Failed to save ${key} to storage`);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await storage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      throw new Error(`Failed to remove ${key} from storage`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await storage.getAllKeys();
      const appKeys = keys.filter((key: string) => key.startsWith('@lembretes_pwa:'));
      
      for (const key of appKeys) {
        await storage.removeItem(key);
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  // Operações específicas para lembretes
  async saveReminders(reminders: Reminder[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.REMINDERS, reminders);
  }

  async getReminders(): Promise<Reminder[]> {
    const reminders = await this.getItem<Reminder[]>(STORAGE_KEYS.REMINDERS);
    return reminders || [];
  }

  async saveReminder(reminder: Reminder): Promise<void> {
    const reminders = await this.getReminders();
    const existingIndex = reminders.findIndex(r => r.id === reminder.id);
    
    if (existingIndex >= 0) {
      reminders[existingIndex] = reminder;
    } else {
      reminders.push(reminder);
    }
    
    await this.saveReminders(reminders);
  }

  async deleteReminder(reminderId: string): Promise<void> {
    const reminders = await this.getReminders();
    const filteredReminders = reminders.filter(r => r.id !== reminderId);
    await this.saveReminders(filteredReminders);
  }

  async getReminderById(reminderId: string): Promise<Reminder | null> {
    const reminders = await this.getReminders();
    return reminders.find(r => r.id === reminderId) || null;
  }

  // Operações para configurações
  async saveSettings(settings: AppSettings): Promise<void> {
    await this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  async getSettings(): Promise<AppSettings> {
    const settings = await this.getItem<AppSettings>(STORAGE_KEYS.SETTINGS);
    
    const defaultSettings: AppSettings = {
      theme: 'auto',
      notificationsEnabled: true,
      soundEnabled: true,
      language: 'pt',
    };
    
    return settings ? { ...defaultSettings, ...settings } : defaultSettings;
  }

  async exportData(): Promise<string> {
    try {
      const reminders = await this.getReminders();
      const settings = await this.getSettings();
      
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: { reminders, settings },
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (importData.version && importData.data) {
        const { reminders, settings } = importData.data;
        
        if (reminders) await this.saveReminders(reminders);
        if (settings) await this.saveSettings(settings);
        
        return true;
      }
      
      throw new Error('Invalid data format');
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
export default storageService;
