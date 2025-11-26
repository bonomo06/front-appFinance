package com.appfinancas;

import android.content.Intent;
import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NotificationListenerModule extends ReactContextBaseJavaModule {

    private static final String MODULE_NAME = "NotificationListenerModule";

    public NotificationListenerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        NotificationListener.setReactContext(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void requestPermission(Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getReactApplicationContext().startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void checkPermission(Promise promise) {
        try {
            String packageName = getReactApplicationContext().getPackageName();
            String enabledListeners = Settings.Secure.getString(
                getReactApplicationContext().getContentResolver(),
                "enabled_notification_listeners"
            );
            
            boolean hasPermission = enabledListeners != null && 
                                   enabledListeners.contains(packageName);
            
            promise.resolve(hasPermission);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}
