import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@theme";

const ITEM_HEIGHT = 50;

interface TimePickerProps {
  value: string;
  min?: number;
  max?: number;
  onValueChange: (value: string) => void;
  label: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  min = 0, 
  max = 59, 
  onValueChange, 
  label 
}) => {
  const Theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const isInitialRender = useRef(true);
  
  const data = Array.from({ length: max - min + 1 }, (_, i) => {
    const val = (i + min).toString();
    return val.padStart(2, "0");
  });

  const extendedData = ["", ...data, ""];

  useEffect(() => {
    if (isInitialRender.current) {
      const index = parseInt(value) - min;
      if (index >= 0) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
          isInitialRender.current = false;
        }, 150);
      }
    }
  }, [value, min]);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const newValue = (index + min).toString();
    
    if (newValue !== value) {
      onValueChange(newValue);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <View 
          style={[
            styles.indicator, 
            { 
              backgroundColor: Theme.mode === 'dark' ? "rgba(0, 122, 255, 0.05)" : "rgba(0, 122, 255, 0.03)",
              borderColor: Theme.mode === 'dark' ? "rgba(0, 122, 255, 0.15)" : "rgba(0, 122, 255, 0.1)"
            }
          ]} 
          pointerEvents="none" 
        />
        
        <ScrollView
          ref={scrollRef}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
        >
          {extendedData.map((item, index) => {
            const isSelected = item === value.padStart(2, "0");
            return (
              <View key={index} style={styles.itemContainer}>
                <Text 
                  style={[
                    styles.itemText, 
                    { 
                      fontSize: Theme.typography.fontSize.header,
                      color: Theme.colors.textTertiary,
                    },
                    isSelected && [
                      styles.itemTextSelected, 
                      { 
                        fontSize: Theme.typography.fontSize.title,
                        color: Theme.colors.primary,
                      }
                    ]
                  ]}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Text 
        style={[
          styles.label, 
          { 
            marginTop: Theme.spacing.s,
            fontSize: Theme.typography.fontSize.tiny,
            color: Theme.colors.textSecondary,
          }
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 65,
  },
  wheelContainer: {
    height: ITEM_HEIGHT * 3,
    width: "100%",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontWeight: "500",
  },
  itemTextSelected: {
    fontWeight: "700",
  },
  label: {
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
