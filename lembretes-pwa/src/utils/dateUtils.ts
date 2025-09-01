// Utilitários para trabalhar com datas e lembretes

export const dateUtils = {
  // Formatação de datas
  formatDate: (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  },

  formatTime: (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  formatDateTime: (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  formatRelativeDate: (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 0) {
      const pastMinutes = Math.abs(diffInMinutes);
      const pastHours = Math.abs(diffInHours);
      const pastDays = Math.abs(diffInDays);

      if (pastMinutes < 60) {
        return `${pastMinutes} min atrás`;
      } else if (pastHours < 24) {
        return `${pastHours}h atrás`;
      } else if (pastDays < 7) {
        return `${pastDays} dias atrás`;
      } else {
        return dateUtils.formatDate(date);
      }
    } else {
      if (diffInMinutes < 60) {
        return `em ${diffInMinutes} min`;
      } else if (diffInHours < 24) {
        return `em ${diffInHours}h`;
      } else if (diffInDays < 7) {
        return `em ${diffInDays} dias`;
      } else {
        return dateUtils.formatDate(date);
      }
    }
  },

  // Verificações de data
  isToday: (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  },

  isTomorrow: (date: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  },

  isYesterday: (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  },

  isPast: (date: Date): boolean => {
    return date.getTime() < new Date().getTime();
  },

  isFuture: (date: Date): boolean => {
    return date.getTime() > new Date().getTime();
  },

  // Manipulação de datas
  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addHours: (date: Date, hours: number): Date => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  },

  addMinutes: (date: Date, minutes: number): Date => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  },

  startOfDay: (date: Date): Date => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  },

  endOfDay: (date: Date): Date => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  },

  // Diferenças entre datas
  daysBetween: (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = dateUtils.startOfDay(date1);
    const secondDate = dateUtils.startOfDay(date2);
    return Math.round((secondDate.getTime() - firstDate.getTime()) / oneDay);
  },

  hoursBetween: (date1: Date, date2: Date): number => {
    const oneHour = 60 * 60 * 1000;
    return Math.round((date2.getTime() - date1.getTime()) / oneHour);
  },

  minutesBetween: (date1: Date, date2: Date): number => {
    const oneMinute = 60 * 1000;
    return Math.round((date2.getTime() - date1.getTime()) / oneMinute);
  },

  // Helpers para lembretes
  getNextOccurrence: (baseDate: Date, type: 'daily' | 'weekly' | 'monthly'): Date => {
    const next = new Date(baseDate);
    const now = new Date();

    switch (type) {
      case 'daily':
        // Se o horário já passou hoje, agendar para amanhã
        if (next.getTime() <= now.getTime()) {
          next.setDate(next.getDate() + 1);
        }
        break;

      case 'weekly':
        // Próxima semana no mesmo dia e horário
        if (next.getTime() <= now.getTime()) {
          next.setDate(next.getDate() + 7);
        }
        break;

      case 'monthly':
        // Próximo mês no mesmo dia e horário
        if (next.getTime() <= now.getTime()) {
          next.setMonth(next.getMonth() + 1);
        }
        break;

      default:
        break;
    }

    return next;
  },

  // Cálculo de streak (dias consecutivos)
  calculateStreak: (completedDates: Date[]): number => {
    if (!completedDates.length) return 0;

    const sortedDates = completedDates
      .map(date => dateUtils.startOfDay(new Date(date)))
      .sort((a, b) => b.getTime() - a.getTime()); // Ordem decrescente (mais recente primeiro)

    const today = dateUtils.startOfDay(new Date());
    const yesterday = dateUtils.addDays(today, -1);

    let streak = 0;
    let checkDate = today;

    // Se não foi completado hoje, verificar se foi ontem
    if (sortedDates[0]?.getTime() === yesterday.getTime()) {
      checkDate = yesterday;
    } else if (sortedDates[0]?.getTime() !== today.getTime()) {
      return 0; // Se não foi completado hoje nem ontem, streak é 0
    }

    // Contar dias consecutivos
    for (const date of sortedDates) {
      if (date.getTime() === checkDate.getTime()) {
        streak++;
        checkDate = dateUtils.addDays(checkDate, -1);
      } else {
        break; // Quebra na sequência
      }
    }

    return streak;
  },

  // Presets comuns
  presets: {
    now: (): Date => new Date(),
    today: (hour: number = 9, minute: number = 0): Date => {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      return date;
    },
    tomorrow: (hour: number = 9, minute: number = 0): Date => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(hour, minute, 0, 0);
      return date;
    },
    nextWeek: (hour: number = 9, minute: number = 0): Date => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      date.setHours(hour, minute, 0, 0);
      return date;
    },
    nextMonth: (hour: number = 9, minute: number = 0): Date => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      date.setHours(hour, minute, 0, 0);
      return date;
    },
  },
};

// Utility para gerar IDs únicos
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Utility para validação
export const validation = {
  isValidDate: (date: any): date is Date => {
    return date instanceof Date && !isNaN(date.getTime());
  },

  isValidTitle: (title: string): boolean => {
    return title.trim().length > 0 && title.trim().length <= 100;
  },

  isValidDescription: (description: string): boolean => {
    return description.length <= 500;
  },

  isFutureDate: (date: Date): boolean => {
    return date.getTime() > new Date().getTime();
  },
};

export default dateUtils;
