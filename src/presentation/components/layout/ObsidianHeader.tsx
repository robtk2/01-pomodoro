import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from "@theme";
import { Button } from '../ui/Button';

interface ObsidianHeaderProps {
  title: string;
  renderRight?: () => React.ReactNode;
  renderLeft?: () => React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

/**
 * Cabecera personalizada con estética Obsidian Glass.
 * Sustituye a la cabecera nativa para evitar bugs de interactividad en Android.
 */
export const ObsidianHeader: React.FC<ObsidianHeaderProps> = ({
  title,
  renderRight,
  renderLeft,
  showBackButton,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const Theme = useTheme();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.content, { paddingHorizontal: Theme.spacing.m }]}>
        <View style={styles.leftSlot}>
          {showBackButton && (
            <Button 
              onPress={onBackPress!} 
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Text style={[styles.backText, { color: Theme.colors.text, fontFamily: Theme.typography.fontFamily.medium }]}>←</Text>
            </Button>
          )}
          {renderLeft && renderLeft()}
        </View>

        <Text 
          style={[
            styles.title, 
            { 
              fontFamily: Theme.typography.fontFamily.bold,
              fontSize: Theme.typography.fontSize.header,
              color: Theme.colors.text
            }
          ]} 
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={styles.rightSlot}>
          {renderRight && renderRight()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  content: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1, // Enviar al fondo para que no bloquee los slots laterales
  },
  leftSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 50,
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 50,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 24,
  },
});
