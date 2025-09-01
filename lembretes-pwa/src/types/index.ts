export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dateTime: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  streak: number; // Quantos dias consecutivos
  lastCompletedDate?: Date;
  isRecurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  notificationEnabled: boolean;
}

export interface ReminderInput {
  title: string;
  description?: string;
  dateTime: Date;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  notificationEnabled?: boolean;
}

export interface AppState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export type Theme = 'light' | 'dark' | 'auto';

export interface AppSettings {
  theme: Theme;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  language: 'pt' | 'en';
}
