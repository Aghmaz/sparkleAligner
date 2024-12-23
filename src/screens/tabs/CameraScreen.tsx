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
import {launchImageLibrary} from 'react-native-image-picker';
import {CropView} from 'react-native-image-crop-tools';
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
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isPlusOpen, setIsPlusOpen] = useState<boolean>(true);
  const [currentDevice, setCurrentDevice] = useState<'front' | 'back'>('front');
  const [flashState, setFlashState] = useState<'off' | 'on'>('off');
  const [zoomLevel, setZoomLevel] = useState<1 | 2>(1);
  const [uploading, setUploading] = useState<boolean>(false);


  const navigation = useNavigation<CameraScreenNavigationProp>();
  // // Cloudinary credentials
  // const CLOUD_NAME = 'dbtjfmmf9';
  // const API_KEY = '158646382266981';
  // const API_SECRET = '5EEjkWe5gb6RI7xBCn9hIT_tX4w';
  // const UPLOAD_URL = `https://api.cloudinary.com/v1_1/dbtjfmmf9/image/upload`;

  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice(currentDevice);

  const cameraRef = useRef<Camera | null>(null);
  const cropViewRef = useRef<any>(null);

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
        setPhotoUri('file://' + photo.path);
        setIsCameraActive(false);
        setIsPlusOpen(false);
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

  const togglePlus = (): void => {
    setIsPlusOpen(!isPlusOpen);
  };

  const chooseFromLibrary = (): void => {
    launchImageLibrary({mediaType: 'photo', quality: 0.5}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setPhotoUri(uri);
          setIsCropping(true);
          uploadImageToCloudinary(uri);
        }
      }
    });
  };

  const uploadImageToCloudinary = async (uri: string) => {
    const data = new FormData();
    const filename = uri.split('/').pop();

    // Build the form data with the image
    data.append('file', {
      uri,
      name: filename,
      type: 'image/jpeg', // Ensure you match the type of the file
    } as any); // Type assertion to prevent TypeScript error

    data.append('upload_preset', 'aneela'); // Cloudinary upload preset
    data.append('api_key', '158646382266981'); // API Key from your Cloudinary account

    setUploading(true);

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dbtjfmmf9/image/upload',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Cloudinary Response: ', response.data);
      setUploading(false);
      setImageUrl(response.data.secure_url); // Cloudinary URL of uploaded image
    } catch (error) {
      console.error('Upload error: ', error);
      setUploading(false);
    }
  };

  const onImageCrop = (res: {uri: string}) => {
    setPhotoUri(res.uri);
    setIsCropping(false);
  };

  if (!isPermissionGranted) return <PermissionsPage />;
  if (!device) return <NoCameraDeviceError />;

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {isPlusOpen ? (
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
      ) : null}
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
      {!isPlusOpen && photoUri && (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.WHITE,
          }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              activeOpacity={0.8}>
              <Icons.MENU />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Teethies</Text>
            <Icons.FAQ />
          </View>
          <View
            style={{
              backgroundColor: COLORS.GRAY,
              flex: 7,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 17,
                color: COLORS.BLACK,
                textAlign: 'center',
              }}>
              11/20/2024, 12:50 PM | Aligner #1
            </Text>
            <View>
              <Image
                resizeMode="cover"
                source={{uri: photoUri}}
                style={styles.photoPreviewImage}
              />
              <View
                style={{
                  width: '100%',
                  position: 'absolute',
                  bottom: '17%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                }}>
                <Icons.EDITWHITE />
                <Icons.FOLDERWHITE />
                <Icons.CAMERAWHITE />
                <Icons.SHAREWHITE />
                <Icons.DELETE />
              </View>
            </View>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 17,
                color: COLORS.BLACK,
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: COLORS.SKY_LIGHT,
                alignSelf: 'center',
                position: 'absolute',
                bottom: 0,
              }}>
              #1
            </Text>
          </View>
          <View
            style={{
              flex: 3,
              alignItems: 'flex-end',
              paddingRight: 10,
              justifyContent: 'flex-end',
              paddingBottom: 20,
            }}>
            <TouchableOpacity
              onPress={togglePlus}
              activeOpacity={0.8}
              style={styles.plusIconContainer}>
              <Icons.PLUS />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isCropping && photoUri && (
        <View style={{flex: 1, backgroundColor: COLORS.BLACK}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              padding: 18,
              backgroundColor: '#0E1316ee',
            }}>
            <Text></Text>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                fontSize: 22,
                color: COLORS.WHITE,
              }}>
              Edit Photo
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsPlusOpen(!isPlusOpen);
                setIsCropping(!isCropping);
              }}
              activeOpacity={0.8}>
              <Icons.TICKWHITE />
            </TouchableOpacity>
          </View>
          <CropView
            sourceUrl={photoUri}
            style={styles.cropView}
            ref={cropViewRef}
            onImageCrop={onImageCrop}
            keepAspectRatio
            aspectRatio={{width: 16, height: 9}}
          />
          <View style={{position: 'absolute', top: '9.6%'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#00000095',
                width: '100%',
                paddingHorizontal: 15,
                paddingBottom: 13,
                paddingTop: 50,
              }}>
              <Icons.Flip />
              <Text
                style={{
                  color: COLORS.WHITE,
                  fontSize: 17,
                  fontFamily: 'Roboto-Medium',
                }}>
                11/20/2024, 4:18 PM
              </Text>
              <Text
                style={{
                  color: COLORS.WHITE,
                  fontSize: 20,
                  fontFamily: 'Roboto-Medium',
                }}>
                #1
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.dashedLineVertical} />
              <Image
                style={{height: 200, width: 350}}
                resizeMode="cover"
                source={require('../../assets/images/teethFrame.png')}
              />
              <View style={styles.dashedLineHorizontal} />
            </View>
            <View
              style={{
                backgroundColor: '#00000095',
                padding: 20,
                height: '100%',
              }}></View>
          </View>
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
    height: '89.5%',
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
