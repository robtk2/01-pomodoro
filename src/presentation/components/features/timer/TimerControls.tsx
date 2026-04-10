import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "@presentation/components/ui/Button";
import { useTheme } from "@theme";

interface TimerControlsProps {
  isActive: boolean;
  handleStartStop: () => void;
  handleReset: () => void;
  color: string;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  handleStartStop,
  handleReset,
  color,
}) => {
  const Theme = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: Theme.spacing.l, gap: Theme.spacing.m }]}>
      <Button
        key={isActive ? "active" : "inactive"}
        title={isActive ? "PAUSAR" : "INICIAR"}
        onPress={handleStartStop}
        variant={isActive ? "outline" : "primary"}
        style={styles.mainButton}
        color={color}
        textStyle={!isActive ? { color: Theme.colors.textInverted } : undefined}
      />
      
      <Button
        title="REINICIAR"
        onPress={handleReset}
        variant="ghost"
        style={styles.resetButton}
        textStyle={[
          styles.resetText, 
          { 
            color: Theme.colors.textSecondary,
            fontSize: Theme.typography.fontSize.small
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  mainButton: {
    width: "80%",
    height: 60,
  },
  resetButton: {
    paddingVertical: 8,
  },
  resetText: {
    letterSpacing: 1.5,
  },
});
