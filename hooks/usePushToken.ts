// hooks/usePushToken.ts
import payloadClient from '@/lib/api/payloadClient';
import { getStoreId } from '@/service/storeService';
import { useAuthStore } from '@/store/authStore';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function usePushToken() {
  const storeId = getStoreId()
  const { user } = useAuthStore();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function register() {
     try {
      if (!Device.isDevice) {
        console.warn('Push notifications require a physical device');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permissions not granted');
        return;
      }

      const { data: expoToken } = await Notifications.getExpoPushTokenAsync({
        projectId: "9c01ad34-ea4b-41ce-875b-32bc54b13bd7"
      });
      console.log("Expo Token : ", expoToken)
      setToken(expoToken);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }
      const isExist = await payloadClient.collections.deviceTokens.find({
        where: {
          token: {
            equals: expoToken
          },
          store: {
            equals: storeId
          }
        }
      })
      if(isExist.docs.length > 0) {
        payloadClient.collections.deviceTokens.update({
          where: {
            token: {
              equals: expoToken
            },
          },
          patch: {
            token: expoToken,
            store: storeId,
            user: user ? parseInt(user.id) : undefined,
          }
        })
      }else {
        payloadClient.collections.deviceTokens.create({
          doc: {
            token: expoToken,
            store: storeId,
            user: user ? parseInt(user.id) : undefined,
          }
        })
      }
     }catch(error) {
      console.log("Error : ", error)
     }
    }

    register();
  }, []);

  return token;
}
