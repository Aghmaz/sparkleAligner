import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  TakePhotoOptions,
} from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import DocumentPicker, { types } from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Shadow } from 'react-native-shadow-2';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';
import { useTheme } from '../../theme/themeManagement';
import LightTheme from '../../theme/LightTheme';
import DarkTheme from '../../theme/DarkTheme';

const CameraScreen: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const [isPermissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [uploading, setUploading] = useState<boolean>(false);
  const [userID, setUserID] = useState<string | null>(null);

  const navigation = useNavigation<DrawerNavigationProp<any, any>>();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [currentDevice, setCurrentDevice] = useState<'front' | 'back'>('front');
  const device = useCameraDevice(currentDevice);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      if (hasPermission === null) return;
      if (hasPermission === false) {
        const granted = await requestPermission();
        setPermissionGranted(granted);
      } else {
        setPermissionGranted(true);
      }
    };
    checkPermissions();
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    const getUserId = async () => {
      const ID = await AsyncStorage.getItem('userId');
      if (ID !== null) setUserID(ID);
    };
    getUserId();
  }, []);

  // Capture a photo, then switch to preview mode
  const capturePhoto = async (): Promise<void> => {
    if (cameraRef.current) {
      try {
        const options: TakePhotoOptions = { flash: 'off' };
        const photo = await cameraRef.current.takePhoto(options);
        const capturedUri = 'file://' + photo.path;
        setPhotoUri(capturedUri);
        setSelectedMimeType('image/jpeg');
        setIsCameraActive(false);
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  // Choose a file from the library and switch to preview mode
  const chooseFromLibrary = async (): Promise<void> => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: [
          types.images,
          types.pdf,
          'application/vnd.ms-pki.stl',
          'video/mp4',
        ],
      });
      if (file.uri && file.type) {
        setPhotoUri(file.uri);
        setSelectedMimeType(file.type);
        setIsCameraActive(false);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('File Picker Error: ', err);
      }
    }
  };

  const toggleCamera = (): void => {
    setCurrentDevice(prevDevice => (prevDevice === 'front' ? 'back' : 'front'));
  };

  // Upload image to Cloudinary, save URL to database, then return to initial view
  const uploadFileToCloudinary = async (uri: string, mimeType: string) => {
    const data = new FormData();
    const filename = uri.split('/').pop();
    data.append('file', { uri, name: filename, type: mimeType } as any);
    data.append('upload_preset', 'aneela');
    data.append('api_key', '158646382266981');

    setUploading(true);
    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/aneelacloud/auto/upload',
        { method: 'POST', body: data }
      );
      const jsonResponse = await response.json();
      const uploadedImageUrl = jsonResponse.secure_url;
      setUploading(false);
      await saveImageUrlToDatabase(uploadedImageUrl);
      Toast.show({
        type: 'success',
        text1: 'File Uploaded Successfully',
        text2: 'Your file has been uploaded.',
      });
      // Clear preview and return to initial options
      setPhotoUri(null);
    } catch (error) {
      console.error('Upload error: ', error);
      setUploading(false);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'There was an issue uploading your file.',
      });
    }
  };

  // Save the Cloudinary URL to your backend database
  const saveImageUrlToDatabase = async (imageUrl: string) => {
    const id = await AsyncStorage.getItem('userId');
    try {
      const response = await fetch(`http://192.168.1.103:8000/api/auth/user/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const existingData = await response.json();
      const mediaArray = existingData.media || [];
      mediaArray.push({ fileUrl: imageUrl, uploadedAt: new Date() });
      const updateResponse = await fetch(`http://192.168.1.103:8000/api/auth/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media: mediaArray }),
      });
      if (!updateResponse.ok) {
        const errorResponse = await updateResponse.text();
        throw new Error('Failed to save the URL to the database');
      }
      const updateResponseData = await updateResponse.json();
      console.log('Response from backend: ', updateResponseData);
    } catch (error) {
      console.error('Error saving URL to database: ', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to save the URL',
        text2: 'There was an issue saving the file URL to the database.',
      });
    }
  };

  // --- RENDER LOGIC ---
  // 1. If an image has been captured or chosen (photoUri exists), show the preview view.
  // 2. Else if the camera is active, show the camera view.
  // 3. Otherwise, show the initial camera options.
  return (
    <SafeAreaView
      style={[
        styles.safeAreaContainer,
        { backgroundColor: currentTheme.colors.background },
      ]}>
      {photoUri ? (
        // Preview Mode
        <View style={styles.previewContainer}>
          <Text style={[styles.previewTitle, { color: currentTheme.colors.text }]}>
            Preview
          </Text>
          <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="contain" />
          <View style={styles.previewButtonsContainer}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => {
                // Retake: Clear the preview so the initial options are visible
                setPhotoUri(null);
              }}>
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => uploadFileToCloudinary(photoUri, selectedMimeType)}>
              {uploading ? (
                <Text style={styles.previewButtonText}>Uploading...</Text>
              ) : (
                <Text style={styles.previewButtonText}>Select</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : isCameraActive ? (
        // Camera View
        <>
          <Camera
            style={StyleSheet.absoluteFillObject}
            device={device!}
            
            isActive={true}
            ref={cameraRef}
            photo={true}
          />
          <View style={styles.cameraControlsWrapper}>
            <View style={styles.cameraControlRow}>
              <TouchableOpacity activeOpacity={0.8} onPress={toggleCamera}>
                <Icons.CAMERASWITCH  />
              </TouchableOpacity>
              {/* Additional controls (zoom, flash) can be added here */}
            </View>
            <TouchableOpacity
              style={styles.captureButtonWrapper}
              onPress={capturePhoto}>
              <View style={styles.captureButtonCircle} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Initial Options View
        <View style={styles.initialOptionsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionButtonRow}
            onPress={() => setIsCameraActive(true)}>
            <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}>
              Take Photo
            </Text>
            <Shadow>
              <View style={styles.iconButtonWrapper}>
                <Icons.CAMERASKYBLUE />
              </View>
            </Shadow>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={chooseFromLibrary}
            activeOpacity={0.8}
            style={styles.actionButtonRow}>
            <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}>
              Choose from Library
            </Text>
            <Shadow>
              <View style={styles.iconButtonWrapper}>
                <Icons.LIBRARY />
              </View>
            </Shadow>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CameraScreen;

/* ============================
         Styles
============================ */
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  initialOptionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonContainer: {
    gap: 40,
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: '10%',
    right: '7%',
  },
  actionButtonRow: {
    gap: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  actionButtonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  iconButtonWrapper: {
    height: 45,
    width: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  cameraControlsWrapper: {
    backgroundColor: '#0e0603dd',
    height: '60%',
    justifyContent: 'flex-end',
  },
  cameraControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  captureButtonWrapper: {
    position: 'absolute',
    bottom: '45%',
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 50,
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonCircle: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.BLACK,
  },
  previewContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    marginBottom: 20,
  },
  previewImage: {
    width: '90%',
    height: '60%',
    marginBottom: 20,
  },
  previewButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  previewButton: {
    backgroundColor: COLORS.SKY_LIGHT,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  previewButtonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: COLORS.BLACK,
  },
});
