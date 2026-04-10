import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { useTheme } from "@theme";
import { formatTimeDisplay } from "@domain/timer/logic";

interface TimerDisplayProps {
  time: number;
  progress: number;
  color: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  time, 
  progress, 
  color 
}) => {
  const Theme = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: Theme.spacing.xxl, marginVertical: Theme.spacing.xxl }]}>
      <View style={styles.progressWrapper}>
        <Progress.Circle
          size={280}
          progress={progress}
          color={color}
          unfilledColor={Theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
          borderWidth={0}
          thickness={12}
          strokeCap="round"
        />
        <View style={styles.textWrapper}>
          <Text 
            style={[
              styles.timeText, 
              { 
                fontFamily: Theme.typography.fontFamily.bold,
                fontSize: Theme.typography.fontSize.display,
                color: Theme.colors.text,
                letterSpacing: Theme.typography.letterSpacing.display
              }
            ]}
          >
            {formatTimeDisplay(time)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    transform: [{ translateY: 4 }],
  },
});


