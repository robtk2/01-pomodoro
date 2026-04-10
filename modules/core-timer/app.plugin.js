const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withCoreTimer(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;
    const mainApplication = androidManifest.application[0];

    // 1. Añadir permisos necesarios al manifiesto
    if (!androidManifest["uses-permission"])
      androidManifest["uses-permission"] = [];

    const permissions = [
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_SPECIAL_USE",
      "android.permission.POST_NOTIFICATIONS",
    ];

    permissions.forEach((perm) => {
      if (
        !androidManifest["uses-permission"].some(
          (p) => p.$["android:name"] === perm,
        )
      ) {
        androidManifest["uses-permission"].push({
          $: { "android:name": perm },
        });
      }
    });

    // 2. Añadir el servicio
    if (!mainApplication.service) mainApplication.service = [];

    const serviceName = "expo.modules.coretimer.CoreTimerService";
    if (
      !mainApplication.service.some((s) => s.$["android:name"] === serviceName)
    ) {
      mainApplication.service.push({
        $: {
          "android:name": serviceName,
          "android:foregroundServiceType": "specialUse",
          "android:exported": "false",
        },
        property: [
          {
            $: {
              "android:name": "android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE",
              "android:value": "Pomodoro timer background processing",
            },
          },
        ],
      });
    }

    return config;
  });
};
