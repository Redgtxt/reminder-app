import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Reminder } from '../types';
import { Button, Card } from '../components';
import { storageService } from '../services/storage';
import { dateUtils } from '../utils/dateUtils';
import { theme } from '../styles/theme';
import globalStyles from '../styles/globalStyles';

export interface HomeScreenProps {
  onCreateReminder: () => void;
  onEditReminder: (reminder: Reminder) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onCreateReminder,
  onEditReminder,
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReminders = async () => {
    try {
      const savedReminders = await storageService.getReminders();
      setReminders(savedReminders.sort((a, b) => 
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      ));
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os lembretes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    Alert.alert(
      'Excluir Lembrete',
      'Tem certeza que deseja excluir este lembrete?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteReminder(reminderId);
              setReminders(prev => prev.filter(r => r.id !== reminderId));
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o lembrete');
            }
          },
        },
      ]
    );
  };

  const handleToggleComplete = async (reminder: Reminder) => {
    try {
      const now = new Date();
      const updatedReminder: Reminder = {
        ...reminder,
        isCompleted: !reminder.isCompleted,
        lastCompletedDate: !reminder.isCompleted ? now : reminder.lastCompletedDate,
        updatedAt: now,
      };

      // Recalcular streak se necessário
      if (!reminder.isCompleted) {
        // Aqui você adicionaria lógica mais complexa para calcular streak
        updatedReminder.streak = reminder.streak + 1;
      }

      await storageService.saveReminder(updatedReminder);
      setReminders(prev =>
        prev.map(r => (r.id === reminder.id ? updatedReminder : r))
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o lembrete');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReminders();
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const renderReminderCard = ({ item: reminder }: { item: Reminder }) => {
    const reminderDate = new Date(reminder.dateTime);
    const isPast = dateUtils.isPast(reminderDate);
    const isToday = dateUtils.isToday(reminderDate);
    const isTomorrow = dateUtils.isTomorrow(reminderDate);

    let dateText = dateUtils.formatDateTime(reminderDate);
    if (isToday) {
      dateText = `Hoje às ${dateUtils.formatTime(reminderDate)}`;
    } else if (isTomorrow) {
      dateText = `Amanhã às ${dateUtils.formatTime(reminderDate)}`;
    }

    return (
      <Card
        style={[
          styles.reminderCard,
          reminder.isCompleted && styles.completedCard,
          isPast && !reminder.isCompleted && styles.overdueCard,
        ].filter(Boolean)}
        onPress={() => onEditReminder(reminder)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={[
              styles.reminderTitle,
              reminder.isCompleted && styles.completedTitle,
            ]}>
              {reminder.title}
            </Text>
            
            <Text style={[
              styles.reminderDate,
              isPast && !reminder.isCompleted && styles.overdueDate,
              isToday && styles.todayDate,
            ]}>
              {dateText}
            </Text>
            
            {reminder.description && (
              <Text style={styles.reminderDescription} numberOfLines={2}>
                {reminder.description}
              </Text>
            )}
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[
                styles.completeButton,
                reminder.isCompleted && styles.completedButton,
              ]}
              onPress={() => handleToggleComplete(reminder)}
            >
              <Text style={[
                styles.completeButtonText,
                reminder.isCompleted && styles.completedButtonText,
              ]}>
                {reminder.isCompleted ? '✓' : '○'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {(reminder.streak > 0 || reminder.isRecurring) && (
          <View style={styles.cardFooter}>
            {reminder.streak > 0 && (
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>
                  🔥 {reminder.streak} dias consecutivos
                </Text>
              </View>
            )}
            
            {reminder.isRecurring && (
              <View style={styles.recurringContainer}>
                <Text style={styles.recurringText}>
                  🔄 {reminder.recurringType === 'daily' ? 'Diário' :
                       reminder.recurringType === 'weekly' ? 'Semanal' :
                       'Mensal'}
                </Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReminder(reminder.id)}
        >
          <Text style={styles.deleteButtonText}>🗑</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Nenhum lembrete ainda</Text>
      <Text style={styles.emptyStateSubtitle}>
        Crie seu primeiro lembrete para começar a acompanhar suas tarefas
      </Text>
      <Button
        title="Criar Lembrete"
        onPress={onCreateReminder}
        style={styles.emptyStateButton}
      />
    </View>
  );

  const upcomingReminders = reminders.filter(r => !r.isCompleted && !dateUtils.isPast(new Date(r.dateTime)));
  const overdueReminders = reminders.filter(r => !r.isCompleted && dateUtils.isPast(new Date(r.dateTime)));
  const completedReminders = reminders.filter(r => r.isCompleted);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={globalStyles.h1}>Meus Lembretes</Text>
          <Button
            title="+ Novo"
            onPress={onCreateReminder}
            size="small"
            style={styles.headerButton}
          />
        </View>

        {/* Statistics */}
        {reminders.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{upcomingReminders.length}</Text>
              <Text style={styles.statLabel}>Próximos</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, overdueReminders.length > 0 && styles.overdueNumber]}>
                {overdueReminders.length}
              </Text>
              <Text style={styles.statLabel}>Atrasados</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completedReminders.length}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
          </View>
        )}

        {/* Reminders List */}
        <FlatList
          data={reminders}
          renderItem={renderReminderCard}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={reminders.length === 0 ? styles.emptyListContainer : undefined}
          ListEmptyComponent={renderEmptyState}
          onRefresh={onRefresh}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  headerButton: {
    paddingHorizontal: theme.spacing.md,
  },

  // Statistics
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.primary,
  },
  overdueNumber: {
    color: theme.colors.error,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  },

  // List
  list: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  // Reminder Card
  reminderCard: {
    position: 'relative',
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  cardActions: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  reminderTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },

  reminderDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  },
  overdueDate: {
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeight.medium,
  },
  todayDate: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },

  reminderDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.primary,
  },

  // Complete button
  completeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  completedButton: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  completeButtonText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  completedButtonText: {
    color: theme.colors.textInverse,
  },

  // Delete button
  deleteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: theme.typography.fontSize.sm,
    opacity: 0.6,
  },

  // Card footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  streakContainer: {
    flex: 1,
  },
  streakText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
  },
  recurringContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  recurringText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing['2xl'],
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.primary,
  },
  emptyStateSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily.primary,
  },
  emptyStateButton: {
    paddingHorizontal: theme.spacing.xl,
  },
});

export default HomeScreen;
