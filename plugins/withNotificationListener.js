const { withAndroidManifest } = require('@expo/config-plugins');

const withNotificationListener = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Adicionar permissão
    if (!androidManifest.$ ) {
      androidManifest.$ = {};
    }

    // Adicionar o serviço de listener de notificações
    if (!androidManifest.application) {
      androidManifest.application = [{}];
    }

    const application = androidManifest.application[0];

    if (!application.service) {
      application.service = [];
    }

    // Adicionar o NotificationListenerService
    application.service.push({
      $: {
        'android:name': '.NotificationListener',
        'android:label': 'App Finanças Notification Listener',
        'android:permission': 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
        'android:exported': 'true',
      },
      'intent-filter': [
        {
          action: [
            {
              $: {
                'android:name': 'android.service.notification.NotificationListenerService',
              },
            },
          ],
        },
      ],
    });

    return config;
  });
};

module.exports = withNotificationListener;
