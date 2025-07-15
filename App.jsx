import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import notifee from '@notifee/react-native';

const App = () => {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60); // 15 دقیقه
  const [message, setMessage] = useState('در حال انتظار برای اجرای BackgroundFetch...');

  useEffect(() => {
    let intervalId;

    const init = async () => {
      await notifee.requestPermission();

      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      // شروع تایمر ثانیه‌ای
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) return 15 * 60;
          return prev - 1;
        });
      }, 1000);

      // تنظیم BackgroundFetch
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // دقیقه
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
        },
        async (taskId) => {
          console.log('[BackgroundFetch] task: ', taskId);

          setMessage(`✅ پاپ‌اپ ارسال شد برای taskId: ${taskId}`);
          setSecondsLeft(15 * 60); // ریست تایمر

          await notifee.displayNotification({
            title: 'بک‌گراند اجرا شد',
            body: `تسک: ${taskId}`,
            android: {
              channelId: 'default',
              smallIcon: 'ic_launcher',
            },
          });

          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.warn('[BackgroundFetch] failed to start', error);
          setMessage('❌ خطا در شروع BackgroundFetch');
        }
      );
    };

    init();

    return () => clearInterval(intervalId); // پاک کردن تایمر هنگام unmount
  }, []);

  // تبدیل ثانیه به دقیقه:ثانیه
  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ backgroundColor: "red", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 18 }}>⏱ زمان باقی‌مانده: {formatTime(secondsLeft)}</Text>
      <Text style={{ color: '#fff', marginTop: 10 }}>{message}</Text>
    </View>
  );
};

export default App;
