import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@theme";
import { Input } from "@presentation/components/ui/Input";
import { Button } from "@presentation/components/ui/Button";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface GlassBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  children: React.ReactNode;
  heightRatio?: number; // 0.1 to 1.0
}

export const GlassBottomSheet: React.FC<GlassBottomSheetProps> = ({
  isVisible,
  onClose,
  title,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  children,
  heightRatio = 0.65,
}) => {
  const Theme = useTheme();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable 
          style={[
            styles.backdrop, 
            { backgroundColor: Theme.mode === 'dark' ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0.4)" }
          ]} 
          onPress={onClose} 
        />
        
        <View 
          style={[
            styles.sheetContainer, 
            { 
              height: SCREEN_HEIGHT * heightRatio,
              backgroundColor: Theme.colors.backgroundSecondary,
              borderTopColor: Theme.colors.border
            }
          ]}
        >
          <BlurView 
            intensity={Theme.mode === 'dark' ? 80 : 95} 
            tint={Theme.mode === 'dark' ? 'dark' : 'light'} 
            style={StyleSheet.absoluteFill}
          >
            <View style={styles.content}>
              <View 
                style={[
                  styles.handle, 
                  { backgroundColor: Theme.mode === 'dark' ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)" }
                ]} 
              />
              
              <View style={[styles.header, { paddingHorizontal: Theme.spacing.l, paddingTop: Theme.spacing.m }]}>
                <Text 
                  style={[
                    styles.title, 
                    { 
                      color: Theme.colors.text,
                      fontFamily: Theme.typography.fontFamily.bold
                    }
                  ]}
                >
                  {title}
                </Text>
                <Button onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={Theme.colors.textSecondary} />
                </Button>
              </View>

              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChangeText={onSearchChange}
                icon="search"
                rightIcon={searchQuery.length > 0 ? "close-circle" : undefined}
                onRightIconPress={() => onSearchChange("")}
                containerStyle={{ 
                  marginHorizontal: Theme.spacing.l, 
                  marginTop: Theme.spacing.m,
                  marginBottom: Theme.spacing.s
                }}
                inputWrapperStyle={{ minHeight: 46 }}
                autoCorrect={false}
              />

              <View style={styles.body}>
                {children}
              </View>
            </View>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    borderTopWidth: 1,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
  },
  closeButton: {
    padding: 4,
  },
  body: {
    flex: 1,
  },
});
