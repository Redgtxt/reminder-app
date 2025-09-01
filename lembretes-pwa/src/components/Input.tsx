import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../styles/theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  variant = 'default',
  size = 'medium',
  fullWidth = true,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  required = false,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles = [
    styles.container,
    fullWidth && styles.fullWidth,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    error && styles.error,
    textInputProps.editable === false && styles.disabled,
  ];

  const inputStyles: TextStyle[] = [
    styles.input,
    styles[`${size}Input` as keyof typeof styles] as TextStyle,
    leftIcon && styles.inputWithLeftIcon,
    rightIcon && styles.inputWithRightIcon,
    inputStyle,
  ].filter(Boolean) as TextStyle[];

  const labelStyles = [
    styles.label,
    error && styles.errorLabel,
    labelStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyles}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          {...textInputProps}
          style={inputStyles}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helper && !error && <Text style={styles.helperText}>{helper}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },

  // Label
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  },
  required: {
    color: theme.colors.error,
  },

  // Input container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },

  // Variants
  default: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filled: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 0,
  },
  outlined: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },

  // Sizes
  small: {
    height: 36,
  },
  medium: {
    height: theme.layout.inputHeight,
  },
  large: {
    height: 56,
  },

  // States
  focused: {
    borderColor: theme.colors.primary,
  },
  error: {
    borderColor: theme.colors.error,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: theme.colors.borderLight,
  },

  // Input
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.primary,
    paddingHorizontal: theme.spacing.md,
  },

  // Input sizes
  smallInput: {
    fontSize: theme.typography.fontSize.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  mediumInput: {
    fontSize: theme.typography.fontSize.base,
    paddingHorizontal: theme.spacing.md,
  },
  largeInput: {
    fontSize: theme.typography.fontSize.lg,
    paddingHorizontal: theme.spacing.lg,
  },

  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },

  // Icons
  leftIcon: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.xs,
  },
  rightIcon: {
    paddingRight: theme.spacing.md,
    paddingLeft: theme.spacing.xs,
  },

  // Helper texts
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  },
  helperText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  },
  errorLabel: {
    color: theme.colors.error,
  },
});

export default Input;
