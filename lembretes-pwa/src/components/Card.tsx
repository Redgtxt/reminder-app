import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../styles/theme';

export interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  onPress,
  variant = 'default',
  padding = 'medium',
  style,
  titleStyle,
  subtitleStyle,
  header,
  footer,
  disabled = false,
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    styles[padding],
    disabled && styles.disabled,
    style,
  ];

  const titleStyles = [
    styles.title,
    titleStyle,
  ];

  const subtitleStyles = [
    styles.subtitle,
    subtitleStyle,
  ];

  const renderContent = () => (
    <View style={styles.container}>
      {header && (
        <View style={styles.header}>
          {header}
        </View>
      )}
      
      {title && (
        <Text style={titleStyles}>
          {title}
        </Text>
      )}
      
      {subtitle && (
        <Text style={subtitleStyles}>
          {subtitle}
        </Text>
      )}
      
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
      
      {footer && (
        <View style={styles.footer}>
          {footer}
        </View>
      )}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
  },

  // Variants
  default: {
    ...theme.shadows.sm,
  },
  elevated: {
    ...theme.shadows.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },

  // Padding variants
  none: {
    padding: 0,
  },
  small: {
    padding: theme.spacing.sm,
  },
  medium: {
    padding: theme.spacing.md,
  },
  large: {
    padding: theme.spacing.lg,
  },

  // States
  disabled: {
    opacity: 0.6,
  },

  // Layout
  container: {
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: theme.spacing.sm,
  },

  // Typography
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.primary,
  },
});

export default Card;
