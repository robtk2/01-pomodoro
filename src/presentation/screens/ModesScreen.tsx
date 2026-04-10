import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTimerStore } from "@application/store/useTimerStore";
import { useTheme } from "@theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@presentation/navigation/AppNavigator";
import { GlassCard } from "@presentation/components/ui/GlassCard";
import { Button } from "@presentation/components/ui/Button";
import { formatTimeDisplay } from "@domain/timer/logic";
import { ObsidianHeader } from "@presentation/components/layout/ObsidianHeader";

type Props = NativeStackScreenProps<RootStackParamList, "Modes">;

/**
 * Pantalla de Gestión de Modos.
 */
export const ModesScreen: React.FC<Props> = ({ navigation }) => {
  const { modes, currentModeId } = useTimerStore();
  const Theme = useTheme();

  const handleEditMode = (item: any) => {
    navigation.navigate("EditMode", { mode: item });
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = item.id === currentModeId;

    return (
      <GlassCard
        style={[
          styles.card,
          isSelected && { borderColor: item.color, borderWidth: 1 }
        ]}
      >
        <Button
          style={[styles.cardInner, { padding: Theme.spacing.m }]}
          onPress={() => handleEditMode(item)}
        >
          <View style={[styles.colorIndicator, { backgroundColor: item.color, marginRight: Theme.spacing.m }]} />
          <View style={styles.cardContent}>
            <Text 
              style={[
                styles.modeLabel, 
                { 
                  fontFamily: Theme.typography.fontFamily.bold,
                  fontSize: Theme.typography.fontSize.body,
                  color: Theme.colors.text
                }
              ]}
            >
              {item.label}
            </Text>
            <Text 
              style={[
                styles.modeTime, 
                { 
                  fontFamily: Theme.typography.fontFamily.regular,
                  fontSize: Theme.typography.fontSize.small,
                  color: Theme.colors.textSecondary
                }
              ]}
            >
              {formatTimeDisplay(item.time)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Theme.colors.textTertiary} />
        </Button>
      </GlassCard>
    );
  };

  return (
    <View style={styles.container}>
      <ObsidianHeader 
        title="MIS MODOS" 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <FlatList
        data={modes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent, 
          { 
            padding: Theme.spacing.m,
            gap: Theme.spacing.m,
            paddingBottom: Theme.spacing.xxl
          }
        ]}
        ListFooterComponent={
          <Button
            title="+ CREAR NUEVO MODO"
            onPress={() => navigation.navigate("EditMode", { mode: undefined })}
            variant="outline"
            style={[styles.addButton, { marginTop: Theme.spacing.l, borderColor: Theme.colors.borderLight }]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
  },
  card: {
    padding: 0,
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 6,
    height: 40,
    borderRadius: 3,
  },
  cardContent: {
    flex: 1,
  },
  modeLabel: {
  },
  modeTime: {
    marginTop: 2,
  },
  addButton: {
    borderStyle: "dashed",
    paddingVertical: 16,
  },
});
