import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform, 
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@presentation/navigation/AppNavigator";
import { useSettingsStore } from "@application/store/useSettingsStore";
import { useTheme } from "@theme";
import { Button } from "@presentation/components/ui/Button";
import { TimePicker } from "@presentation/components/ui/TimePicker";
import { useEditModeForm } from "@application/hooks/useEditModeForm";
import { GlassCard } from "@presentation/components/ui/GlassCard";
import { ObsidianHeader } from "@presentation/components/layout/ObsidianHeader";
import { SoundSelectorSheet } from "@presentation/components/features/timer/SoundSelectorSheet";
import { Input } from "@presentation/components/ui/Input";
import { ColorPicker } from "@presentation/components/ui/ColorPicker";
import { IconPicker } from "@presentation/components/ui/IconPicker";

type Props = NativeStackScreenProps<RootStackParamList, "EditMode">;

const PRESET_COLORS = ["#F06292", "#4DB6AC", "#81C784", "#BA68C8", "#FFD54F", "#007AFF"];

const PRESET_ICONS = [
  "book-outline",
  "cafe-outline",
  "fitness-outline",
  "code-slash-outline",
  "game-controller-outline",
  "headset-outline",
  "bulb-outline",
  "rocket-outline",
] as const;

/**
 * Pantalla de Creación/Edición de Modos.
 */
export const EditModeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mode } = route.params;
  const Theme = useTheme();
  
  const {
    form,
    minutes,
    seconds,
    setMinutes,
    setSeconds,
    updateField,
    handleSave,
  } = useEditModeForm(mode, () => navigation.goBack());

  const [isSoundSheetVisible, setIsSoundSheetVisible] = React.useState(false);

  const { availableSounds, loadAvailableSounds, defaultSound } = useSettingsStore();

  React.useEffect(() => {
    if (availableSounds.length === 0) {
      loadAvailableSounds();
    }
  }, [availableSounds.length, loadAvailableSounds]);

  const handleSoundPicker = () => {
    setIsSoundSheetVisible(true);
  };

  return (
    <View style={styles.container}>
      <ObsidianHeader 
        title={mode ? "EDITAR MODO" : "NUEVO MODO"} 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={[styles.content, { padding: Theme.spacing.l }]}
          keyboardShouldPersistTaps="handled"
        >
          <GlassCard style={styles.mainCard}>
            <Input
              label="Nombre del modo"
              value={form.label}
              onChangeText={(v) => updateField("label", v)}
              placeholder="Ej: Estudio Profundo"
              icon="bookmark-outline"
            />

            <View style={[styles.pickerSection, { marginVertical: Theme.spacing.l }]}>
              <Text 
                style={[
                  styles.label, 
                  { 
                    fontSize: Theme.typography.fontSize.small,
                    color: Theme.colors.textSecondary,
                    marginTop: 0,
                    marginBottom: Theme.spacing.s,
                  }
                ]}
              >
                Duración
              </Text>
              <View 
                style={[
                  styles.pickersContainer, 
                  { 
                    backgroundColor: Theme.colors.surface,
                    borderColor: Theme.colors.border,
                    padding: Theme.spacing.m,
                    borderRadius: Theme.roundness,
                    marginTop: Theme.spacing.s,
                  }
                ]}
              >
                <TimePicker 
                  label="Min"
                  value={minutes}
                  max={99}
                  onValueChange={setMinutes}
                />
                <Text style={[styles.separator, { color: Theme.colors.textTertiary, marginHorizontal: Theme.spacing.s }]}>:</Text>
                <TimePicker 
                  label="Seg"
                  value={seconds}
                  onValueChange={setSeconds}
                />
              </View>
            </View>

            <ColorPicker
              label="Personalización"
              colors={PRESET_COLORS}
              selectedColor={form.color}
              onSelect={(color) => updateField("color", color)}
            />

            <IconPicker
              label="Icono"
              icons={PRESET_ICONS}
              selectedIcon={form.icon}
              onSelect={(icon) => updateField("icon", icon)}
              activeColor={form.color}
            />

            <Input
              label="Mensaje al iniciar"
              value={form.messageActive}
              onChangeText={(v) => updateField("messageActive", v)}
              placeholder="Ej: ¡A trabajar!"
              containerStyle={{ marginTop: Theme.spacing.m }}
            />

            <Input
              label="Mensaje al terminar"
              value={form.messageFinished}
              onChangeText={(v) => updateField("messageFinished", v)}
              placeholder="Ej: ¡Descanso completado!"
            />

            <Text 
              style={[
                styles.label, 
                { 
                  fontSize: Theme.typography.fontSize.small,
                  color: Theme.colors.textSecondary,
                  marginTop: Theme.spacing.m,
                  marginBottom: Theme.spacing.s,
                }
              ]}
            >
              Alarma
            </Text>

            <Button 
              style={[
                styles.soundSelector, 
                { 
                  backgroundColor: Theme.colors.surface,
                  padding: Theme.spacing.m,
                  borderRadius: Theme.roundness,
                  borderColor: Theme.colors.borderLight
                }
              ]}
              onPress={handleSoundPicker}
            >
              <Text 
                style={[
                  styles.soundText, 
                  { 
                    fontSize: Theme.typography.fontSize.body,
                    color: Theme.colors.primary,
                    fontFamily: Theme.typography.fontFamily.semibold
                  }
                ]}
              >
                {form.soundUri 
                  ? availableSounds.find(s => s.uri === form.soundUri)?.name || "Sonido personalizado"
                  : `Predeterminado (${defaultSound?.name || "Sistema"})`}
              </Text>
            </Button>
          </GlassCard>

          <Button
            title={mode ? "GUARDAR CAMBIOS" : "CREAR NUEVO MODO"}
            variant="primary"
            onPress={handleSave}
            style={[styles.saveButton, { marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.xl }]}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <SoundSelectorSheet 
        isVisible={isSoundSheetVisible}
        onClose={() => setIsSoundSheetVisible(false)}
        currentSoundUri={form.soundUri || defaultSound?.uri}
        onSelectSound={(uri) => updateField("soundUri", uri)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
  },
  label: {
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pickerSection: {
    alignItems: "center",
  },
  pickersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  separator: {
    fontSize: 32,
  },
  mainCard: {
    marginBottom: 16,
  },
  saveButton: {
  },
  soundSelector: {
    borderWidth: 1,
  },
  soundText: {
  },
});
