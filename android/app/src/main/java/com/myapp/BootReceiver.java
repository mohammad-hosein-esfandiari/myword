package com.myapp; // ← حتماً مطمئن شو که دقیقاً همین هست یا از AndroidManifest.xml بردار

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Log.d("BootReceiver", "Boot completed - BootReceiver triggered.");

            Toast.makeText(context, "اپ MyApp بعد از ری‌استارت اجرا شد", Toast.LENGTH_LONG).show();

            // اینجا می‌تونی سرویس پس‌زمینه یا کار دلخواه رو استارت کنی
            // context.startService(new Intent(context, YourService.class));
        }
    }
}
