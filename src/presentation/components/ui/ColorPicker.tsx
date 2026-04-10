import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from "@theme";
import { Button } from './Button';

interface ColorPickerProps {
  label?: string;
  colors: readonly string[];
  selectedColor: string;
  onSelect: (color: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

/**
 * ColorItem - Subcomponente para un círculo de color seleccionable.
 */
const ColorItem: React.FC<{
  color: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ color, isSelected, onPress }) => {
  const Theme = useTheme();
  
  return (
    <Button
      onPress={onPress}
      style={[
        styles.colorCircle,
        { backgroundColor: color },
        isSelected && [
          styles.colorSelected, 
          { borderColor: Theme.mode === 'dark' ? '#FFFFFF' : '#000000' }
        ]
      ]}
    />
  );
};

/**
 * ColorPicker - Selector de colores con layout fluido y estética premium.
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  colors,
  selectedColor,
  onSelect,
  containerStyle,
  labelStyle,
}) => {
  const Theme = useTheme();

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
        {colors.map((color) => (
          <ColorItem
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onPress={() => onSelect(color)}
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
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    transform: [{ scale: 1.15 }],
    borderWidth: 3,
  },
});
