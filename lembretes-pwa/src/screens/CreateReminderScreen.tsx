import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { Reminder, ReminderInput } from '../types';
import { Button, Input, Card } from '../components';
import { storageService } from '../services/storage';
import { dateUtils, generateId, validation } from '../utils/dateUtils';
import { theme } from '../styles/theme';
import globalStyles from '../styles/globalStyles';

export interface CreateReminderScreenProps {
  reminder?: Reminder | null;
  onSave: (reminder: Reminder) => void;
  onCancel: () => void;
}

export const CreateReminderScreen: React.FC<CreateReminderScreenProps> = ({
  reminder,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ReminderInput>({
    title: '',
    description: '',
    dateTime: new Date(),
    isRecurring: false,
    recurringType: 'daily',
    notificationEnabled: true,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (reminder) {
      setFormData({
        title: reminder.title,
        description: reminder.description || '',
        dateTime: new Date(reminder.dateTime),
        isRecurring: reminder.isRecurring,
        recurringType: reminder.recurringType || 'daily',
        notificationEnabled: reminder.notificationEnabled,
      });
    }
  }, [reminder]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validar título
    if (!validation.isValidTitle(formData.title)) {
      newErrors.title = 'Título é obrigatório e deve ter no máximo 100 caracteres';
    }

    // Validar descrição
    if (formData.description && !validation.isValidDescription(formData.description)) {
      newErrors.description = 'Descrição deve ter no máximo 500 caracteres';
    }

    // Validar data
    if (!validation.isValidDate(formData.dateTime)) {
      newErrors.dateTime = 'Data inválida';
    }

    // Para novos lembretes, verificar se a data não é no passado
    if (!reminder && !validation.isFutureDate(formData.dateTime)) {
      newErrors.dateTime = 'Data deve ser futura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      
      const reminderToSave: Reminder = reminder
        ? {
            ...reminder,
            title: formData.title,
            description: formData.description,
            dateTime: formData.dateTime,
            isRecurring: formData.isRecurring || false,
            recurringType: formData.recurringType,
            notificationEnabled: formData.notificationEnabled || true,
            updatedAt: now,
          }
        : {
            id: generateId(),
            title: formData.title,
            description: formData.description,
            dateTime: formData.dateTime,
            isCompleted: false,
            createdAt: now,
            updatedAt: now,
            streak: 0,
            isRecurring: formData.isRecurring || false,
            recurringType: formData.recurringType,
            notificationEnabled: formData.notificationEnabled || true,
          };

      await storageService.saveReminder(reminderToSave);
      
      Alert.alert(
        'Sucesso!',
        `Lembrete ${reminder ? 'atualizado' : 'criado'} com sucesso`,
        [
          {
            text: 'OK',
            onPress: () => onSave(reminderToSave),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o lembrete');
      console.error('Erro ao salvar lembrete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateTimeChange = (type: 'date' | 'time', value: string) => {
    const currentDate = new Date(formData.dateTime);
    let newDate = new Date(currentDate);

    if (type === 'date') {
      // Esperando formato DD/MM/AAAA
      const [day, month, year] = value.split('/');
      if (day && month && year) {
        newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        newDate.setHours(currentDate.getHours(), currentDate.getMinutes());
      }
    } else if (type === 'time') {
      // Esperando formato HH:MM
      const [hours, minutes] = value.split(':');
      if (hours && minutes) {
        newDate.setHours(parseInt(hours), parseInt(minutes));
      }
    }

    setFormData(prev => ({ ...prev, dateTime: newDate }));
  };

  const formatDateForInput = (date: Date): string => {
    return dateUtils.formatDate(date);
  };

  const formatTimeForInput = (date: Date): string => {
    return dateUtils.formatTime(date);
  };

  const setPresetDateTime = (preset: () => Date) => {
    setFormData(prev => ({ ...prev, dateTime: preset() }));
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Button
            title="Cancelar"
            variant="ghost"
            size="small"
            onPress={onCancel}
          />
          <Text style={globalStyles.h2}>
            {reminder ? 'Editar Lembrete' : 'Novo Lembrete'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título */}
          <Input
            label="Título"
            placeholder="Digite o título do lembrete"
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            error={errors.title}
            required
            maxLength={100}
          />

          {/* Descrição */}
          <Input
            label="Descrição"
            placeholder="Digite uma descrição (opcional)"
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            error={errors.description}
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          {/* Data e Hora */}
          <Card title="Data e Hora" style={styles.dateTimeCard}>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeRow}>
                <Input
                  label="Data"
                  placeholder="DD/MM/AAAA"
                  value={formatDateForInput(formData.dateTime)}
                  onChangeText={(value) => handleDateTimeChange('date', value)}
                  error={errors.dateTime}
                  containerStyle={styles.dateInput}
                />
                
                <Input
                  label="Hora"
                  placeholder="HH:MM"
                  value={formatTimeForInput(formData.dateTime)}
                  onChangeText={(value) => handleDateTimeChange('time', value)}
                  containerStyle={styles.timeInput}
                />
              </View>

              {/* Presets */}
              <View style={styles.presetsContainer}>
                <Text style={styles.presetsLabel}>Presets rápidos:</Text>
                <View style={styles.presetsRow}>
                  <Button
                    title="Hoje 9h"
                    variant="outline"
                    size="small"
                    onPress={() => setPresetDateTime(() => dateUtils.presets.today(9, 0))}
                    style={styles.presetButton}
                  />
                  <Button
                    title="Amanhã 9h"
                    variant="outline"
                    size="small"
                    onPress={() => setPresetDateTime(() => dateUtils.presets.tomorrow(9, 0))}
                    style={styles.presetButton}
                  />
                  <Button
                    title="Próxima semana"
                    variant="outline"
                    size="small"
                    onPress={() => setPresetDateTime(() => dateUtils.presets.nextWeek(9, 0))}
                    style={styles.presetButton}
                  />
                </View>
              </View>
            </View>
          </Card>

          {/* Configurações */}
          <Card title="Configurações" style={styles.settingsCard}>
            {/* Notificações */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Notificações</Text>
                <Text style={styles.settingDescription}>
                  Receber notificação no horário agendado
                </Text>
              </View>
              <Switch
                value={formData.notificationEnabled || false}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, notificationEnabled: value }))
                }
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : theme.colors.surface}
              />
            </View>

            {/* Recorrência */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Lembrete recorrente</Text>
                <Text style={styles.settingDescription}>
                  Repetir automaticamente
                </Text>
              </View>
              <Switch
                value={formData.isRecurring || false}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, isRecurring: value }))
                }
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : theme.colors.surface}
              />
            </View>

            {/* Tipo de recorrência */}
            {formData.isRecurring && (
              <View style={styles.recurringTypeContainer}>
                <Text style={styles.settingTitle}>Frequência</Text>
                <View style={styles.recurringButtons}>
                  <Button
                    title="Diário"
                    variant={formData.recurringType === 'daily' ? 'primary' : 'outline'}
                    size="small"
                    onPress={() => setFormData(prev => ({ ...prev, recurringType: 'daily' }))}
                    style={styles.recurringButton}
                  />
                  <Button
                    title="Semanal"
                    variant={formData.recurringType === 'weekly' ? 'primary' : 'outline'}
                    size="small"
                    onPress={() => setFormData(prev => ({ ...prev, recurringType: 'weekly' }))}
                    style={styles.recurringButton}
                  />
                  <Button
                    title="Mensal"
                    variant={formData.recurringType === 'monthly' ? 'primary' : 'outline'}
                    size="small"
                    onPress={() => setFormData(prev => ({ ...prev, recurringType: 'monthly' }))}
                    style={styles.recurringButton}
                  />
                </View>
              </View>
            )}
          </Card>

          {/* Preview */}
          <Card title="Pré-visualização" style={styles.previewCard}>
            <View style={styles.previewContent}>
              <Text style={styles.previewTitle}>{formData.title || 'Título do lembrete'}</Text>
              {formData.description && (
                <Text style={styles.previewDescription}>{formData.description}</Text>
              )}
              <Text style={styles.previewDateTime}>
                📅 {dateUtils.formatDateTime(formData.dateTime)}
              </Text>
              {formData.isRecurring && (
                <Text style={styles.previewRecurring}>
                  🔄 Repetir {
                    formData.recurringType === 'daily' ? 'diariamente' :
                    formData.recurringType === 'weekly' ? 'semanalmente' :
                    'mensalmente'
                  }
                </Text>
              )}
              {formData.notificationEnabled && (
                <Text style={styles.previewNotification}>
                  🔔 Notificação ativa
                </Text>
              )}
            </View>
          </Card>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={reminder ? 'Salvar Alterações' : 'Criar Lembrete'}
            onPress={handleSave}
            loading={loading}
            disabled={!formData.title.trim()}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerSpacer: {
    width: 80, // Para balancear o botão cancelar
  },

  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  // Data e Hora
  dateTimeCard: {
    marginBottom: theme.spacing.md,
  },
  dateTimeContainer: {
    gap: theme.spacing.md,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  dateInput: {
    flex: 2,
  },
  timeInput: {
    flex: 1,
  },

  // Presets
  presetsContainer: {
    gap: theme.spacing.sm,
  },
  presetsLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.primary,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  presetButton: {
    flex: 1,
  },

  // Configurações
  settingsCard: {
    marginBottom: theme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  },
  settingDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.primary,
  },

  // Recorrência
  recurringTypeContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  recurringButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  recurringButton: {
    flex: 1,
  },

  // Preview
  previewCard: {
    marginBottom: theme.spacing.md,
  },
  previewContent: {
    gap: theme.spacing.xs,
  },
  previewTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.primary,
  },
  previewDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.primary,
  },
  previewDateTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
  },
  previewRecurring: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
  },
  previewNotification: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
  },

  // Footer
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    backgroundColor: theme.colors.surface,
  },
});

export default CreateReminderScreen;
