import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TextInputProps, 
  ViewStyle, 
  TextStyle,
  StyleProp
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@theme";

import { Button } from './Button';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

/**
 * GlassInput - Componente de entrada de texto premium.
 * Soporta labels, iconos integrados (izq/der) y estados de error con estética esmerilada.
 */
export const Input: React.FC<InputProps> = ({
  label,
  icon,
  rightIcon,
  onRightIconPress,
  error,
  containerStyle,
  inputWrapperStyle,
  inputStyle,
  labelStyle,
  ...props
}) => {
  const Theme = useTheme();
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text 
          style={[
            styles.label, 
            { 
              color: Theme.colors.textSecondary,
              fontSize: Theme.typography.fontSize.small,
              fontFamily: Theme.typography.fontFamily.bold,
              marginBottom: Theme.spacing.s,
            },
            labelStyle
          ]}
        >
          {label}
        </Text>
      )}

      <View 
        style={[
          styles.inputWrapper, 
          { 
            backgroundColor: Theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
            borderColor: hasError ? Theme.colors.danger : Theme.colors.border,
            borderRadius: Theme.roundness,
            paddingHorizontal: Theme.spacing.m,
            minHeight: 52,
          },
          inputWrapperStyle
        ]}
      >
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={hasError ? Theme.colors.danger : Theme.colors.textTertiary} 
            style={styles.icon} 
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            { 
              color: Theme.colors.text,
              fontSize: Theme.typography.fontSize.body,
              fontFamily: Theme.typography.fontFamily.regular,
            },
            inputStyle
          ]}
          placeholderTextColor={Theme.colors.textTertiary}
          selectionColor={Theme.colors.primary}
          {...props}
        />

        {rightIcon && (
          <Button onPress={onRightIconPress!} disabled={!onRightIconPress} style={styles.rightIcon}>
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={Theme.colors.textTertiary} 
            />
          </Button>
        )}
      </View>

      {error && (
        <Text 
          style={[
            styles.errorText, 
            { 
              color: Theme.colors.danger,
              fontSize: Theme.typography.fontSize.tiny,
              marginTop: Theme.spacing.xs,
              marginLeft: Theme.spacing.xs,
            }
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 12,
  },
  rightIcon: {
    marginLeft: 10,
  },
  errorText: {
    fontWeight: '500',
  },
});
