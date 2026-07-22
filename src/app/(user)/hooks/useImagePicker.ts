import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
export function useImagePicker() {
   const [image, setImage] = useState<string | null>(null);
  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [4, 3],
      quality: 1,
      base64: true
    });
    if (!result.canceled) {
      setImage(result.assets[0].base64 ? 'data:image/jpeg;base64,' + result.assets[0].base64 : null);
    }
  };
  return { image, handleImagePicker,setImage };
}