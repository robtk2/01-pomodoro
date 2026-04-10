import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  TouchableOpacityProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@theme";

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  color?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  children,
  variant = "ghost",
  color,
  disabled = false,
  ...rest
}) => {
  const Theme = useTheme();
  const isPrimary = variant === "primary";
  
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: color || Theme.colors.primary,
          height: 56,
          width: "100%",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: color || Theme.colors.primary,
        };
      case "secondary":
        return {
          backgroundColor: `${color || Theme.colors.primary}20`,
        };
      case "ghost":
      default:
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getVariantTextStyle = (): TextStyle => {
    if (variant === "outline" || variant === "ghost" || variant === "secondary") {
      return { color: color || Theme.colors.primary };
    }
    return { color: Theme.colors.textInverted };
  };

  const Content = (
    <>
      {children}
      {title && (
        <Text
          style={[
            styles.buttonText,
            {
              fontFamily: Theme.typography.fontFamily.semibold,
              fontSize: Theme.typography.fontSize.body,
              letterSpacing: Theme.typography.letterSpacing.wider,
            },
            getVariantTextStyle(),
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.button,
        { borderRadius: Theme.roundness },
        getVariantStyle(),
        style,
        disabled && { opacity: 0.5 },
      ]}
      {...rest}
    >
      {isPrimary && (
        <LinearGradient
          colors={color ? [color, color] : (Theme.gradients.focus as any)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      )}
      {Content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  buttonText: {
    textTransform: "uppercase",
    zIndex: 1,
  },
});
