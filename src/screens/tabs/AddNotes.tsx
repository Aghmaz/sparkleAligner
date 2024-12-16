import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

type NavigationProps = NavigationProp<any>;

type RootDrawerParamList = {
  AddNotes: {savedNote: string} | undefined;
};

const AddNotes: React.FC = () => {
  const route = useRoute<RouteProp<RootDrawerParamList, 'AddNotes'>>();
  const [savedNote, setSavedNote] = useState(route.params?.savedNote || '');
  const [note, setNote] = useState<string>(savedNote || '');

  const inputRef = useRef<TextInput>(null);

  const navigation = useNavigation<NavigationProps>();

  const handleCross = (): void => {
    navigation.goBack();
  };
  const handleDelete = (): void => {
    setNote('');
    setSavedNote('');
    navigation.navigate('Calender', {savedNote: ''});
  };
  const handleTick = (): void => {
    navigation.navigate('Calender', {savedNote: note});
  };
  useEffect(() => {
    if (savedNote) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelection(note.length, note.length);
      }, 100);
    }
  }, [savedNote, note]);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCross} activeOpacity={0.8}>
              <Icons.CROSS />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              {savedNote ? 'Edit' : 'Add'} Notes
            </Text>
            {!note && <Text />}
            {note && (
              <TouchableOpacity onPress={handleTick} activeOpacity={0.8}>
                <Icons.TICK />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.row}>
            <View style={[styles.rowLeft, {borderBottomWidth: 0}]}>
              <Icons.CALENDER />
              <Text style={styles.rowTitle}>Date</Text>
            </View>
            <Text style={styles.rowDate}>12/13/2024</Text>
          </View>
          <View style={styles.rowLeft}>
            <Icons.MENU height={20} width={20} />
            <TextInput
              ref={inputRef}
              value={note}
              onChangeText={setNote}
              placeholderTextColor={COLORS.GRAY_DARK}
              placeholder="e.g. tightness, discomfort, special circumstances etc."
              style={{
                color: COLORS.BLACK,
                fontSize: 15,
                width: '80%',
                fontFamily: 'Roboto-Regular',
              }}
            />
          </View>
          {savedNote && (
            <TouchableOpacity
              onPress={handleDelete}
              activeOpacity={0.8}
              style={styles.rowLeft}>
              <Icons.DELETERED />
              <Text
                style={{
                  color: COLORS.RED,
                  fontSize: 15,
                  fontFamily: 'Roboto-Regular',
                }}>
                Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AddNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  rowTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  rowDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: COLORS.BLACK,
  },
});
