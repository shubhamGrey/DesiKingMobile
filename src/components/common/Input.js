import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../../config/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  editable = true,
  style,
  inputStyle,
  testID,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            leftIcon && styles.inputWithLeftIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isFocused ? colors.primary.main : colors.text.disabled}
            />
          </TouchableOpacity>
        )}
      </View>
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md - 2,
  },
  label: {
    fontSize: fontSize.xs,
    fontFamily: fonts.body.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs - 1,
    letterSpacing: 0.2,
  },
  labelError: {
    color: colors.error.main,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.card.border,
    borderRadius: borderRadius.md,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  inputFocused: {
    borderColor: colors.primary.main,
    shadowOpacity: 0.09,
    shadowRadius: 10,
  },
  inputError: {
    borderColor: colors.error.main,
  },
  inputDisabled: {
    backgroundColor: colors.background.cream,
    borderColor: colors.card.border,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 3,
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: colors.text.primary,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  leftIcon: {
    paddingLeft: spacing.md,
  },
  eyeIcon: {
    padding: spacing.sm + 2,
  },
  helperText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.body.regular,
    color: colors.text.muted,
    marginTop: spacing.xs,
    marginLeft: 2,
  },
  errorText: {
    color: colors.error.main,
  },
});

export default Input;
