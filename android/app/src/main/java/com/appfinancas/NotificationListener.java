package com.appfinancas;

import android.app.Notification;
import android.content.Intent;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NotificationListener extends NotificationListenerService {

    private static final String TAG = "NotificationListener";
    private static ReactApplicationContext reactContext;

    public static void setReactContext(ReactApplicationContext context) {
        reactContext = context;
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        try {
            String packageName = sbn.getPackageName();
            
            // Filtrar apenas apps bancários
            if (!isBankApp(packageName)) {
                return;
            }

            Notification notification = sbn.getNotification();
            Bundle extras = notification.extras;

            String title = extras.getString(Notification.EXTRA_TITLE);
            String text = extras.getCharSequence(Notification.EXTRA_TEXT).toString();

            Log.d(TAG, "Notificação bancária recebida: " + packageName);
            Log.d(TAG, "Título: " + title);
            Log.d(TAG, "Texto: " + text);

            // Enviar para React Native
            if (reactContext != null) {
                WritableMap params = Arguments.createMap();
                params.putString("packageName", packageName);
                params.putString("appName", getAppName(packageName));
                params.putString("title", title);
                params.putString("body", text);
                params.putDouble("timestamp", System.currentTimeMillis());

                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onBankNotification", params);
            }

        } catch (Exception e) {
            Log.e(TAG, "Erro ao processar notificação", e);
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // Não precisamos fazer nada quando a notificação é removida
    }

    private boolean isBankApp(String packageName) {
        return packageName.equals("com.nu.production") ||           // Nubank
               packageName.equals("br.com.bb.android") ||            // Banco do Brasil
               packageName.equals("com.google.android.apps.walletnfcrel"); // Google Pay
    }

    private String getAppName(String packageName) {
        if (packageName.equals("com.nu.production")) return "Nubank";
        if (packageName.equals("br.com.bb.android")) return "Banco do Brasil";
        if (packageName.equals("com.google.android.apps.walletnfcrel")) return "Google Pay";
        return packageName;
    }
}
