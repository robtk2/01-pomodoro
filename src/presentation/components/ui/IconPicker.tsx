import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@theme";
import { Button } from './Button';

interface IconPickerProps {
  label?: string;
  icons: readonly (keyof typeof Ionicons.glyphMap)[];
  selectedIcon: string;
  onSelect: (icon: string) => void;
  activeColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

/**
 * IconItem - Subcomponente para un icono individual seleccionable.
 */
const IconItem: React.FC<{
  name: string;
  isSelected: boolean;
  onPress: () => void;
  activeColor: string;
}> = ({ name, isSelected, onPress, activeColor }) => {
  const Theme = useTheme();
  
  return (
    <Button
      onPress={onPress}
      style={[
        styles.iconButton,
        { 
          backgroundColor: Theme.colors.surface,
          borderColor: Theme.colors.border
        },
        isSelected && { 
          backgroundColor: `${activeColor}20`, 
          borderColor: activeColor 
        }
      ]}
    >
      <Ionicons 
        name={name as any} 
        size={24} 
        color={isSelected ? activeColor : Theme.colors.textTertiary} 
      />
    </Button>
  );
};

/**
 * IconPicker - Selector de iconos con layout fluido y estética Glass.
 */
export const IconPicker: React.FC<IconPickerProps> = ({
  label,
  icons,
  selectedIcon,
  onSelect,
  activeColor,
  containerStyle,
  labelStyle,
}) => {
  const Theme = useTheme();
  const highlightColor = activeColor || Theme.colors.primary;

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

      <View style={styles.grid}>
        {icons.map((iconName) => (
          <IconItem
            key={iconName}
            name={iconName}
            isSelected={selectedIcon === iconName}
            onPress={() => onSelect(iconName)}
            activeColor={highlightColor}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
