import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import COLORS from '../../constraints/colors';
import { Switch } from 'react-native-switch';
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
  const [treatmentPreviews, setTreatmentPreviews] = useState<TreatmentPreviews[]>([]);
  const [userID, setUserID] = useState<string | null>(null);
  // Approval state and comments for each preview
  const [approvalStatus, setApprovalStatus] = useState<{ [key: string]: boolean }>({});
  const [commentsByPreview, setCommentsByPreview] = useState<{ [key: string]: string }>({});
  // Final decision for each preview (if saved)
  const [finalDecision, setFinalDecision] = useState<{
    [key: string]: { status: string; comment?: string; timestamp: string };
  }>({});
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: any }>({});
  const navigation = useNavigation<TPScreenNavigationProp>();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const ID = await AsyncStorage.getItem('userId');
        if (ID) {
          fetchData(ID);
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

  const fetchData = async (ID: string): Promise<void> => {
    if (!ID) return;
    try {
      const response = await fetch(
        `http://192.168.1.103:8000/api/user/treatment-preview-by-agent/${ID}`,
      );
      const result: TreatmentPreviews[] = await response.json();
      console.log(result, 'fetched previews');
      setTreatmentPreviews(result);
    } catch (error) {
      console.error('Error fetching treatment Previews:', error);
    }
  };

  // Modified handleSave: if approved, use default comment; if rejected, require comment.
  // After saving, store final decision in state and replace UI.
  const handleSave = async (patientId: string, previewId: string) => {
    const isApproved = approvalStatus[previewId] || false;
    let comment: string;
    if (isApproved) {
      // Approved: use default approval comment
      comment = "Patient's request is approved after a full review of the documents.";
    } else {
      comment = commentsByPreview[previewId] || '';
      if (!comment) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Please enter a comment for rejection.',
        });
        return;
      }
    }
    const status = isApproved ? 'approve' : 'deny';
    const payload = {
      patientId,
      status,
      comment,
    };

    try {
      const response = await fetch(
        'http://192.168.1.103:8000/api/user/patient-approval',
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
        text1: 'Successful',
        text2: 'Treatment Previews Approval Saved successfully',
      });
      // Set final decision for this preview with current timestamp
      const timestamp = new Date().toLocaleString();
      setFinalDecision(prev => ({
        ...prev,
        [previewId]: { status: isApproved ? 'Approved' : 'Rejected', comment: isApproved ? undefined : comment, timestamp },
      }));
    } catch (error) {
      console.error('Error saving approval:', error);
      alert('An error occurred while saving approval');
    } finally {
      // Clear the local temporary states for this preview
      setCommentsByPreview(prev => ({ ...prev, [previewId]: '' }));
      setApprovalStatus(prev => ({ ...prev, [previewId]: false }));
    }
  };

  const renderItem = ({ item }: { item: TreatmentPreviews }) => (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.treatmentItemContainer}>
        {item.uploadedFiles.map((file, index) => {
          // Determine file extension to decide if it's a video or image
          const extension = file.fileName.split('.').pop()?.toLowerCase();
          const isVideo = extension
            ? ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv'].includes(extension)
            : false;
          return (
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
                {isVideo ? (
                  <Video
                    ref={ref => (videoRefs.current[file.fileUrl] = ref)}
                    source={{ uri: file.fileUrl }}
                    paused={playingVideo !== file.fileUrl}
                    style={styles.videoPlayer}
                    resizeMode="cover"
                    onEnd={() => setPlayingVideo(null)}
                    controls={true}
                    onError={error =>
                      console.error('Video playback error:', error)
                    }
                  />
                ) : (
                  <Image
                    source={{ uri: file.fileUrl }}
                    style={styles.imagePlayer}
                    resizeMode="cover"
                  />
                )}
                {/* For the last file, render either the approval UI or final decision message */}
                {index === item.uploadedFiles.length - 1 && (
                  <>
                    {finalDecision[item._id] ? (
                      // Final decision has been made: display bold message.
                      <View style={styles.finalMessageContainer}>
                        {finalDecision[item._id].status === 'Approved' ? (
                          <Text style={styles.finalMessageText}>
                            Approved on {finalDecision[item._id].timestamp}
                          </Text>
                        ) : (
                          <Text style={styles.finalMessageText}>
                            Rejected on {finalDecision[item._id].timestamp}:{' '}
                            {finalDecision[item._id].comment}
                          </Text>
                        )}
                      </View>
                    ) : (
                      // Otherwise, show approval UI
                      <>
                        <View style={styles.approvalWrapper}>
                          <Text style={styles.approveText}>Approve</Text>
                          <Switch
                            value={approvalStatus[item._id] || false}
                            onValueChange={(value) =>
                              setApprovalStatus(prev => ({ ...prev, [item._id]: value }))
                            }
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
                        {/* Only show comment input if not approved */}
                        {!(approvalStatus[item._id] || false) && (
                          <View style={styles.commentWrapper}>
                            <TextInput
                              value={commentsByPreview[item._id] || ''}
                              onChangeText={(text) =>
                                setCommentsByPreview(prev => ({ ...prev, [item._id]: text }))
                              }
                              placeholder="Enter comment for rejection"
                              placeholderTextColor={COLORS.GRAY_DARK}
                              numberOfLines={5}
                              multiline
                              style={styles.commentInput}
                            />
                          </View>
                        )}
                        <TouchableOpacity
                          onPress={() => handleSave(item.linkedPatientId._id, item._id)}
                          activeOpacity={0.8}
                          style={styles.saveButton}>
                          <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}
              </View>
            </View>
          );
        })}
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
        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.8}>
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
  imagePlayer: {
    height: 200,
    marginTop: 10,
    width: '100%',
  },
  approvalWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  approveText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLUE_LIGHT,
    marginRight: 20,
  },
  commentWrapper: {
    marginTop: 20,
  },
  commentInput: {
    width: '100%',
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: COLORS.GRAY_DARK,
    borderRadius: 12,
    color: COLORS.BLACK,
    paddingHorizontal: 13,
  },
  saveButton: {
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.BLUE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 12,
    height: 40,
  },
  saveButtonText: {
    fontFamily: 'Roboto-Medium',
    color: COLORS.WHITE,
    fontSize: 14,
  },
  finalMessageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  finalMessageText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: COLORS.BLUE_LIGHT,
  },
  noPreviewsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
