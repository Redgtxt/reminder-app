import React, { useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import { HomeScreen, CreateReminderScreen } from './src/screens';
import { Reminder } from './src/types';

type Screen = 'home' | 'create' | 'edit';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  const handleCreateReminder = () => {
    setSelectedReminder(null);
    setCurrentScreen('create');
  };

  const handleEditReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setCurrentScreen('edit');
  };

  const handleSaveReminder = (reminder: Reminder) => {
    setSelectedReminder(null);
    setCurrentScreen('home');
  };

  const handleCancel = () => {
    setSelectedReminder(null);
    setCurrentScreen('home');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onCreateReminder={handleCreateReminder}
            onEditReminder={handleEditReminder}
          />
        );

      case 'create':
      case 'edit':
        return (
          <CreateReminderScreen
            reminder={selectedReminder}
            onSave={handleSaveReminder}
            onCancel={handleCancel}
          />
        );

      default:
        return (
          <HomeScreen
            onCreateReminder={handleCreateReminder}
            onEditReminder={handleEditReminder}
          />
        );
    }
  };

  return (
    <>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#FAFAFA"
      />
      {renderCurrentScreen()}
    </>
  );
}
