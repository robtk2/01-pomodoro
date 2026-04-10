import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, AppState, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { useTheme } from "@theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@presentation/navigation/AppNavigator";
import { useSettingsStore } from "@application/store/useSettingsStore";
import { HapticService } from "@infrastructure/services/HapticService";
import { GlassCard } from "@presentation/components/ui/GlassCard";
import { Button } from "@presentation/components/ui/Button";
import { ObsidianHeader } from "@presentation/components/layout/ObsidianHeader";

const appConfig = require("../../../app.json");

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const Theme = useTheme();
  const {
    vibrationEnabled,
    setVibrationEnabled,
    hapticPulseEnabled,
    setHapticPulseEnabled,
    hapticPulseDuration,
    setHapticPulseDuration,
    defaultSound,
    availableSounds,
    loadAvailableSounds,
    themeMode,
    setThemeMode,
  } = useSettingsStore();

  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(true);

  const checkPermissions = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasNotificationPermission((status as string) === "granted" || (status as string) === "provisional");
  }, []);

  useEffect(() => {
    checkPermissions();
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkPermissions]);

  React.useEffect(() => {
    if (availableSounds.length === 0) {
      loadAvailableSounds();
    }
  }, [availableSounds.length, loadAvailableSounds]);

  const handleTestVibration = () => {
    HapticService.impactMedium();
  };

  const handleThemeChange = (mode: "dark" | "light") => {
    HapticService.selection();
    setThemeMode(mode);
  };

  return (
    <View style={styles.container}>
      <ObsidianHeader
        title="CONFIGURACIÓN"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { padding: Theme.spacing.m }]}
      >
        {!hasNotificationPermission && (
          <GlassCard style={[styles.card, { marginBottom: Theme.spacing.l, borderColor: "#FF5252", borderWidth: 1 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.s }}>
              <Text style={{ fontSize: 24, marginRight: Theme.spacing.s }}>⚠️</Text>
              <Text style={[styles.rowLabel, { color: "#FF5252", flex: 1, fontWeight: '700' }]}>
                Notificaciones Desactivadas
              </Text>
            </View>
            <Text style={{ color: Theme.colors.textSecondary, marginBottom: Theme.spacing.m, fontSize: 13, lineHeight: 18 }}>
              El temporizador Pomodoro necesita notificaciones para funcionar en segundo plano y avisarte cuando termina el tiempo.
            </Text>
            <Button
              title="Abrir Ajustes del Sistema"
              onPress={() => Linking.openSettings()}
              variant="outline"
              style={{ borderColor: "#FF5252" }}
              textStyle={{ color: "#FF5252" }}
            />
          </GlassCard>
        )}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: Theme.colors.text,
              marginTop: Theme.spacing.s,
              marginLeft: Theme.spacing.s,
              marginBottom: Theme.spacing.m,
            },
          ]}
        >
          Tema
        </Text>
        <GlassCard style={[styles.card, { marginBottom: Theme.spacing.l }]}>
          <View style={styles.themeContainer}>
            <Button
              style={[
                styles.themeOption,
                {
                  backgroundColor:
                    Theme.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.3)",
                },
                themeMode === "dark" && {
                  borderColor: Theme.colors.primary,
                  borderWidth: 1.5,
                },
              ]}
              onPress={() => handleThemeChange("dark")}
            >
              <Text
                style={[
                  styles.themeLabel,
                  {
                    color: Theme.colors.text,
                    opacity: themeMode === "dark" ? 1 : 0.5,
                  },
                ]}
              >
                OBSIDIAN
              </Text>
              <Text
                style={[
                  styles.themeSubLabel,
                  { color: Theme.colors.textSecondary, marginBottom: Theme.spacing.s },
                ]}
              >
                Modo Oscuro
              </Text>
            </Button>

            <Button
              style={[
                styles.themeOption,
                {
                  backgroundColor:
                    Theme.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.3)",
                },
                themeMode === "light" && {
                  borderColor: Theme.colors.primary,
                  borderWidth: 1.5,
                },
              ]}
              onPress={() => handleThemeChange("light")}
            >
              <Text
                style={[
                  styles.themeLabel,
                  {
                    color: Theme.colors.text,
                    opacity: themeMode === "light" ? 1 : 0.5,
                  },
                ]}
              >
                QUARTZ
              </Text>
              <Text
                style={[
                  styles.themeSubLabel,
                  { color: Theme.colors.textSecondary, marginBottom: Theme.spacing.s },
                ]}
              >
                Modo Claro
              </Text>
            </Button>
          </View>
        </GlassCard>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: Theme.colors.text,
              marginTop: Theme.spacing.l,
              marginLeft: Theme.spacing.s,
              marginBottom: Theme.spacing.m,
            },
          ]}
        >
          General
        </Text>

        <GlassCard style={[styles.card, { marginBottom: Theme.spacing.l }]}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: Theme.colors.text }]}>
              Vibración Háptica
            </Text>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{
                false:
                  Theme.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.5)",
                true: Theme.colors.primary,
              }}
              thumbColor={vibrationEnabled ? "#FFFFFF" : "#888"}
            />
          </View>

          {!vibrationEnabled && (
            <Text
              style={[
                styles.infoNote,
                {
                  color: Theme.colors.textTertiary,
                  marginTop: Theme.spacing.s,
                },
              ]}
            >
              La vibración está desactivada en la aplicación.
            </Text>
          )}

          {vibrationEnabled && (
            <View>
              <Button
                title="Probar Vibración"
                onPress={handleTestVibration}
                variant="outline"
                style={[
                  styles.testButton,
                  {
                    marginTop: Theme.spacing.s,
                    borderColor: Theme.colors.borderLight,
                    backgroundColor:
                      Theme.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 255, 255, 0.5)",
                  },
                ]}
                textStyle={{ fontSize: 12 }}
              />
              <Text
                style={[
                  styles.infoNote,
                  {
                    color: Theme.colors.textTertiary,
                    marginTop: Theme.spacing.s,
                  },
                ]}
              >
                Nota: Si no sientes la vibración, habilita &quot;Respuesta
                táctil&quot; en los ajustes de sonido de tu sistema.
              </Text>
            </View>
          )}

          <View
            style={[
              styles.separator,
              {
                backgroundColor: Theme.colors.borderLight,
                marginVertical: Theme.spacing.s,
              },
            ]}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: Theme.colors.text }]}>
                Latido de Urgencia
              </Text>
              <Text
                style={[
                  styles.rowSubLabel,
                  {
                    color: Theme.colors.primary,
                    fontSize: Theme.typography.fontSize.tiny,
                  },
                ]}
              >
                Vibración rítmica al finalizar
              </Text>
            </View>
            <Switch
              value={hapticPulseEnabled}
              onValueChange={setHapticPulseEnabled}
              trackColor={{
                false:
                  Theme.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.5)",
                true: Theme.colors.primary,
              }}
              thumbColor={hapticPulseEnabled ? "#FFFFFF" : "#888"}
            />
          </View>

          {hapticPulseEnabled && (
            <View
              style={[
                styles.durationContainer,
                {
                  backgroundColor:
                    Theme.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.5)",
                  marginTop: Theme.spacing.s,
                  marginBottom: Theme.spacing.s,
                  borderRadius: Theme.roundness,
                },
              ]}
            >
              {[5, 10, 15].map((d) => (
                <Button
                  key={d}
                  style={[
                    styles.durationButton,
                    { borderRadius: Theme.roundness - 2 },
                    hapticPulseDuration === d && {
                      backgroundColor: Theme.colors.primary,
                    },
                  ]}
                  onPress={() => setHapticPulseDuration(d)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      {
                        color: Theme.colors.textTertiary,
                        fontSize: Theme.typography.fontSize.tiny,
                      },
                      hapticPulseDuration === d && {
                        color: Theme.colors.textInverted,
                      },
                    ]}
                  >
                    {d}s
                  </Text>
                </Button>
              ))}
            </View>
          )}

          <View
            style={[
              styles.separator,
              {
                backgroundColor: Theme.colors.borderLight,
                marginVertical: Theme.spacing.s,
              },
            ]}
          />

          <Button
            style={[styles.row, { paddingHorizontal: Theme.spacing.s }]}
            onPress={() =>
              navigation.navigate("SoundSelector", { isSelection: false })
            }
          >
            <View style={{ flex: 1, marginLeft: 2 }}>
              <Text style={[styles.rowLabel, { color: Theme.colors.text }]}>
                Sonido Predeterminado
              </Text>
              <Text
                style={[
                  styles.rowSubLabel,
                  {
                    color: Theme.colors.primary,
                    fontSize: Theme.typography.fontSize.tiny,
                  },
                ]}
              >
                {defaultSound?.name || "Seleccionar sonido..."}
              </Text>
            </View>
            <Text style={[styles.arrow, { color: Theme.colors.textTertiary }]}>
              →
            </Text>
          </Button>
        </GlassCard>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: Theme.colors.text,
              marginTop: Theme.spacing.l,
              marginLeft: Theme.spacing.s,
              marginBottom: Theme.spacing.m,
            },
          ]}
        >
          Gestión
        </Text>
        <GlassCard style={[styles.card, { marginBottom: Theme.spacing.l }]}>
          <Button
            style={styles.row}
            onPress={() => navigation.navigate("Modes")}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[styles.rowLabel, { color: Theme.colors.text }]}>
                Personalizar Modos
              </Text>
              <Text
                style={[styles.arrow, { color: Theme.colors.textTertiary }]}
              >
                →
              </Text>
            </View>
          </Button>
        </GlassCard>

        <View
          style={[
            styles.footer,
            { marginTop: Theme.spacing.xxl, marginBottom: Theme.spacing.xxl },
          ]}
        >
          <Text
            style={[
              styles.version,
              {
                color: Theme.colors.textTertiary,
                fontSize: Theme.typography.fontSize.tiny,
              },
            ]}
          >
            {appConfig.expo.name.toUpperCase()} v{appConfig.expo.version}
          </Text>
          <Text
            style={[
              styles.author,
              {
                color: Theme.colors.textTertiary,
                fontSize: Theme.typography.fontSize.tiny,
              },
            ]}
          >
            {" "}
            @robk2{" "}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  sectionTitle: {
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  card: {},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  arrow: {
    fontSize: 20,
  },
  rowSubLabel: {
    marginTop: 2,
  },
  separator: {
    height: 1,
  },
  footer: {
    alignItems: "center",
  },
  version: {
    fontWeight: "700",
  },
  author: {
    marginTop: 4,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  durationText: {
    fontWeight: "700",
  },
  infoNote: {
    fontSize: 11,
    fontStyle: "italic",
    lineHeight: 16,
  },
  testButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  themeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  themeOption: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  themeSubLabel: {
    fontSize: 10,
    opacity: 0.7,
  },
});
