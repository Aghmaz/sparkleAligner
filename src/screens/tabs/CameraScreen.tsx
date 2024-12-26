import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  TakePhotoOptions,
} from 'react-native-vision-camera';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker, {types} from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Shadow} from 'react-native-shadow-2';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';
import axios from 'axios';

const PermissionsPage: React.FC = () => (
  <View style={styles.centeredMessageContainer}>
    <Text style={styles.errorText}>Camera permissions are required!</Text>
  </View>
);

const NoCameraDeviceError: React.FC = () => (
  <View style={styles.centeredMessageContainer}>
    <Text style={styles.errorText}>No camera device found!</Text>
  </View>
);

type CameraScreenNavigationProp = DrawerNavigationProp<any, any>;

const CameraScreen: React.FC = () => {
  const [isPermissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [currentDevice, setCurrentDevice] = useState<'front' | 'back'>('front');
  const [flashState, setFlashState] = useState<'off' | 'on'>('off');
  const [zoomLevel, setZoomLevel] = useState<1 | 2>(1);
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [userID, setUserID] = useState<string | null>(null);

  const navigation = useNavigation<CameraScreenNavigationProp>();
  // // Cloudinary credentials
  // const CLOUD_NAME = 'dbtjfmmf9';
  // const API_KEY = '158646382266981';
  // const API_SECRET = '5EEjkWe5gb6RI7xBCn9hIT_tX4w';
  // const UPLOAD_URL = `https://api.cloudinary.com/v1_1/dbtjfmmf9/image/upload`;

  const {hasPermission, requestPermission} = useCameraPermission();
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

  const capturePhoto = async (): Promise<void> => {
    if (cameraRef.current) {
      try {
        const options: TakePhotoOptions = {
          flash: flashState,
        };
        const photo = await cameraRef.current.takePhoto(options);
        const photoUri = 'file://' + photo.path;
        setPhotoUri(photoUri);
        setIsCameraActive(false);
        saveImageUrlToDatabase(
          'https://res.cloudinary.com/aneelacloud/raw/upload/v1735231132/lzq2aeejelgkg5a3c050.stl',
        );
        // uploadFileToCloudinary(photoUri, 'image/jpeg');
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  const toggleCamera = (): void => {
    setCurrentDevice(prevDevice => (prevDevice === 'front' ? 'back' : 'front'));
  };

  const toggleFlash = (): void => {
    if (device?.hasFlash) {
      setFlashState(prevState => (prevState === 'off' ? 'on' : 'off'));
    } else {
      console.warn('Flash is not available for the current camera');
    }
  };

  const toggleZoom = (): void => {
    setZoomLevel(prevZoom => (prevZoom === 1 ? 2 : 1));
  };

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
        console.log('Selected file:', file);
        // uploadFileToCloudinary(file.uri, file.type);
        saveImageUrlToDatabase(
          'https://res.cloudinary.com/aneelacloud/raw/upload/v1735231132/lzq2aeejelgkg5a3c050.stl',
        );
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('File Picker Error: ', err);
      }
    }
  };

  useEffect(() => {
    const getUserId = async () => {
      const ID = await AsyncStorage.getItem('userId');
      if (ID !== null) setUserID(ID);
    };
    getUserId();
  }, []);

  const uploadFileToCloudinary = async (uri: string, mimeType: string) => {
    const data = new FormData();
    const filename = uri.split('/').pop();
    console.log(uri, 'uri==================');
    console.log(filename, 'filename===================');
    console.log(mimeType, 'mimeType====================');

    data.append('file', {
      uri,
      name: filename,
      type: mimeType,
    } as any);

    data.append('upload_preset', 'aneela');
    // data.append("cloud_name", "aneelacloud");
    data.append('api_key', '158646382266981');

    setUploading(true);

    console.log(data, 'data==================');

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/aneelacloud/auto/upload", 
        {
          method: "POST",
          body: data, 
        }
      );
      console.log('Cloudinary Response: ', response);
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'File Uploaded Successfully',
          text2: 'Your file has been uploaded.',
        });
      }, 2000);
      // const uploadedImageUrl = response.data.secure_url;
      setUploading(false);
      // setImageUrl(uploadedImageUrl);
      // saveImageUrlToDatabase(uploadedImageUrl);
    } catch (error) {
      console.error('Upload error: ', error);
      setUploading(false);
    }
  };
  const saveImageUrlToDatabase = async (imageUrl: string) => {
    try {
      const userId = userID;
      const response = await fetch(
        `http://192.168.8.100:5000/api/auth/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const existingData = await response.json();
      const mediaArray = existingData.media || [];
      mediaArray.push({
        fileUrl: imageUrl,
        uploadedAt: new Date(),
      });
      const updateResponse = await fetch(
        `http://192.168.8.100:5000/api/auth/user/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            media: mediaArray,
          }),
        },
      );
      if (!updateResponse.ok) {
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

  if (!isPermissionGranted) return <PermissionsPage />;
  if (!device) return <NoCameraDeviceError />;

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.actionButtonRow}
          onPress={() => setIsCameraActive(true)}>
          <Text style={styles.actionButtonText}>Take Photo</Text>
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
          <Text style={styles.actionButtonText}>Choose from Library</Text>
          <Shadow>
            <View style={styles.iconButtonWrapper}>
              <Icons.LIBRARY />
            </View>
          </Shadow>
        </TouchableOpacity>
      </View>
      {isCameraActive && (
        <>
          <Camera
            style={StyleSheet.absoluteFillObject}
            device={device}
            isActive={true}
            ref={cameraRef}
            photo={true}
            zoom={zoomLevel}
          />
          <View style={styles.cameraOverlay}>
            <View style={styles.dashedLineVertical} />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -50,
                backgroundColor: '#0e0603dd',
                width: '100%',
                paddingHorizontal: 20,
                paddingVertical: 18,
              }}
              activeOpacity={0.8}
              onPress={() => setIsCameraActive(false)}>
              <Icons.CROSSWHITE />
            </TouchableOpacity>
            <Image
              style={styles.imageFrame}
              resizeMode="cover"
              source={require('../../assets/images/teethFrame.png')}
            />
            <View style={styles.dashedLineHorizontal} />
          </View>
          <View style={styles.cameraControlsWrapper}>
            <View style={styles.cameraControlRow}>
              <TouchableOpacity activeOpacity={0.8} onPress={toggleZoom}>
                {zoomLevel === 1 ? <Icons.ZOOMIN /> : <Icons.ZOOMOUT />}
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={toggleCamera}>
                <Icons.CAMERASWITCH />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={toggleFlash}>
                {flashState === 'off' ? <Icons.FLASHOFF /> : <Icons.FLASH />}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.captureButtonWrapper}
              onPress={capturePhoto}>
              <View style={styles.captureButtonCircle} />
            </TouchableOpacity>
          </View>
        </>
      )}
      {uploading && (
        <Text style={{padding: 20, fontFamily: 'Roboto-Medium', fontSize: 15}}>
          UPLOADING ...
        </Text>
      )}
      {photoUri && (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.WHITE,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            resizeMode="cover"
            source={{uri: photoUri}}
            style={styles.photoPreviewImage}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  cropView: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'flex-end',
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
  cameraOverlay: {
    height: '33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedLineVertical: {
    width: '51.5%',
    borderTopWidth: 4,
    borderStyle: 'dashed',
    position: 'absolute',
    transform: [{rotate: '90deg'}],
    borderColor: COLORS.BLACK,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingTop: 30,
    flex: 3,
  },
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  imageFrame: {
    height: 200,
    width: 400,
  },
  dashedLineHorizontal: {
    width: '95%',
    borderTopWidth: 4,
    borderStyle: 'dashed',
    position: 'absolute',
    borderColor: COLORS.BLACK,
  },
  cameraControlsWrapper: {
    backgroundColor: '#0e0603dd',
    height: '60%',
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
    transform: [{translateX: -40}],
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
  photoPreviewImage: {
    width: '100%',
    height: '50%',
  },
  plusIconContainer: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.SKY_LIGHT,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
