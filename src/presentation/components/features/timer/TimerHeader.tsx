import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TimerMode } from "@domain/modes/types";
import { useTheme } from "@theme";
import { Button } from "@presentation/components/ui/Button";

interface TimerHeaderProps {
  currentMode: TimerMode;
  onOpenSelector: () => void;
}

export const TimerHeader: React.FC<TimerHeaderProps> = ({ 
  currentMode,
  onOpenSelector 
}) => {
  const Theme = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: Theme.spacing.m }]}>
      <Button
        onPress={onOpenSelector}
        style={[
          styles.selectorButton, 
          { 
            backgroundColor: Theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
            borderColor: Theme.colors.border,
            paddingVertical: Theme.spacing.s,
            paddingHorizontal: Theme.spacing.l,
          }
        ]}
      >
        <View style={[styles.dot, { backgroundColor: currentMode.color, marginRight: Theme.spacing.s }]} />
        <Text 
          style={[
            styles.modeText, 
            { 
              color: currentMode.color,
              fontFamily: Theme.typography.fontFamily.bold
            }
          ]}
        >
          {currentMode.label}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={18} 
          color={currentMode.color} 
          style={[styles.icon, { marginLeft: Theme.spacing.s }]}
        />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modeText: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  icon: {
    opacity: 0.8,
  },
});
