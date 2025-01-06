import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import COLORS from '../../constraints/colors';
import {Switch} from 'react-native-switch';
import Video from 'react-native-video';
import Icons from '../../assets/icons';

interface File {
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

interface Patient {
  _id: string;
}

interface TreatmentPreviews {
  _id: string;
  linkedPatientId: Patient;
  uploadedFiles: File[];
}

type TPScreenNavigationProp = DrawerNavigationProp<any, any>;

const TreatmentPreviews: React.FC = () => {
  const [treatmentPreviews, setTreatmentPreviews] = useState<
    TreatmentPreviews[]
  >([]);
  const [userID, setUserID] = useState<string | null>(null);
  const [comments, setComments] = useState<string>('');
  const [approveTPs, setApproveTPs] = useState<boolean>(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const videoRefs = useRef<{[key: string]: any}>({});
  const navigation = useNavigation<TPScreenNavigationProp>();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const ID = await AsyncStorage.getItem('userId');
        if (ID) {
          setUserID(ID);
        } else {
          console.warn('User ID not found.');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    getUserId();
  }, []);

  const fetchData = async (): Promise<void> => {
    if (!userID) return;
    try {
      const response = await fetch(
        'http://192.168.86.134:8000/api/user/treatment-preview-by-agent/',
      );
      const result: TreatmentPreviews[] = await response.json();

      const filteredData = result.filter(
        item => item.linkedPatientId._id === userID,
      );
      setTreatmentPreviews(filteredData);
    } catch (error) {
      console.error('Error fetching treatment Previews:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userID]);

  const handleSave = async (patientId: string) => {
    if (!comments || !userID) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Please enter a comment and ensure you have a valid user ID.',
      });
      return;
    }

    const status = approveTPs ? 'approve' : 'deny';

    const payload = {
      patientId,
      status,
      comment: comments,
    };

    try {
      const response = await fetch(
        'http://192.168.86.134:8000/api/user/patient-approval/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to save approval status');
      }

      const responseData = await response.json();
      console.log('Response from API:', responseData);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Successfull',
        text2: 'Treatment Previews Approval Saved successfully',
      });
    } catch (error) {
      console.error('Error saving approval:', error);
      alert('An error occurred while saving approval');
    } finally {
      setComments('');
      setApproveTPs(false);
    }
  };

  const renderItem = ({item}: {item: TreatmentPreviews}) => (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.treatmentItemContainer}>
        {item.uploadedFiles.map((file, index) => (
          <View
            key={file.fileName}
            style={
              index !== item.uploadedFiles.length - 1
                ? styles.fileWrapper
                : styles.lastFileWrapper
            }>
            <View style={styles.fileHeader}>
              <Text style={styles.fileNameText}>{file.fileName}</Text>
              <Text style={styles.uploadedDateText}>
                Date :{' '}
                {new Date(file.uploadedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  year: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                })}
              </Text>
            </View>
            <View>
              <Video
                ref={ref => (videoRefs.current[file.fileUrl] = ref)}
                source={{uri: file.fileUrl}}
                paused={playingVideo !== file.fileUrl}
                style={styles.videoPlayer}
                resizeMode="cover"
                onEnd={() => setPlayingVideo(null)}
                controls={true}
                onError={error => console.error('Video playback error:', error)}
              />
              {index === item.uploadedFiles.length - 1 && (
                <>
                  <View style={styles.approvalWrapper}>
                    <Text style={styles.approveText}>Approve</Text>
                    <Switch
                      value={approveTPs}
                      onValueChange={setApproveTPs}
                      circleSize={22}
                      barHeight={15}
                      circleBorderWidth={0}
                      backgroundActive={'#a4bfd695'}
                      backgroundInactive={'#9b9b9b95'}
                      circleActiveColor={COLORS.BLUE_LIGHT}
                      circleInActiveColor={COLORS.GRAY}
                      renderActiveText={false}
                      renderInActiveText={false}
                      switchWidthMultiplier={1.3}
                    />
                  </View>
                  <View style={styles.commentWrapper}>
                    <TextInput
                      value={comments}
                      onChangeText={setComments}
                      placeholder="Enter Comment On TPs"
                      placeholderTextColor={COLORS.GRAY_DARK}
                      numberOfLines={5}
                      multiline
                      style={styles.commentInput}
                    />
                    <TouchableOpacity
                      onPress={() => handleSave(item.linkedPatientId._id)}
                      activeOpacity={0.8}
                      style={styles.saveButton}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        ))}
      </View>
    </KeyboardAwareScrollView>
  );

  if (treatmentPreviews.length === 0) {
    return (
      <View style={styles.noPreviewsContainer}>
        <Text>No Treatment Previews Found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.8}>
          <Icons.MENU />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Treatment Previews</Text>
        <Text />
      </View>
      <FlatList
        data={treatmentPreviews}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TreatmentPreviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 22,
    color: COLORS.BLACK,
  },
  treatmentItemContainer: {
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: COLORS.GRAY_DARK,
    padding: 20,
  },
  fileWrapper: {
    marginBottom: 20,
  },
  lastFileWrapper: {
    marginBottom: 0,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileNameText: {
    fontSize: 17,
    color: COLORS.BLUE_LIGHT,
    fontFamily: 'Roboto-Bold',
  },
  uploadedDateText: {
    fontSize: 17,
    color: COLORS.BLACK_LIGHT,
    fontFamily: 'Roboto-Bold',
  },
  videoPlayer: {
    height: 200,
    marginTop: 10,
    width: '100%',
  },
  approvalWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  approveText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLUE_LIGHT,
  },
  commentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  commentInput: {
    width: '70%',
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: COLORS.GRAY_DARK,
    borderRadius: 12,
    color: COLORS.BLACK,
    paddingHorizontal: 13,
  },
  saveButton: {
    paddingHorizontal: 10,
    backgroundColor: COLORS.BLUE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: '28%',
    borderRadius: 12,
    height: 40,
  },
  saveButtonText: {
    fontFamily: 'Roboto-Medium',
    color: COLORS.WHITE,
    fontSize: 14,
  },
  noPreviewsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
