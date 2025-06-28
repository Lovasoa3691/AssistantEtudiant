import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Button,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Easing,
  Alert,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import axios from 'axios';

export default function ScheduleCalendar() {
  interface Planning {
    id: string;
    date: string;
    hdeb: string;
    hfin: string;
    matiere: string;
    salle: string;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newRoom, setNewRoom] = useState('');

  const [schedule, setSchedule] = useState<Planning[]>([]);

  const [selectedDate, setSelectedDate] = useState('');
  const [matiere, setMatiere] = useState<string>('');
  const [heureDebut, setHeureDebut] = useState<string>('');
  const [heureFin, setHeureFin] = useState<string>('');
  const [salle, setSalle] = useState<string>('');

  const [pickerMode, setPickerMode] = useState<'debut' | 'fin' | null>(null);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const formatTime = (date: Date): string =>
    date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedDate) {
      const formatted = formatTime(selectedDate);
      if (pickerMode === 'debut') {
        setHeureDebut(formatted);
      } else if (pickerMode === 'fin') {
        setHeureFin(formatted);
      }
    }
  };

  const slideAnim = useRef(new Animated.Value(500)).current;

  const getAllPlanning = async () => {
    try {
      const response = await axios.get(
        'http://192.168.137.43:5000/api/planning',
      );
      setSchedule(response.data);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(
          'Erreur',
          'Impossible de récupérer les plannings. Veuillez réessayer plus tard.',
        );
      } else {
        Alert.alert(
          'Erreur',
          'Une erreur inconnue est survenue. Veuillez réessayer plus tard.',
        );
      }
    }
  };

  useEffect(() => {
    getAllPlanning();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const savePlanning = () => {
    if (!matiere || !heureDebut || !heureFin || !salle) {
      Alert.alert('Veuillez remplir tous les champs.');
      return;
    }

    const newPlanning: Omit<Planning, 'id'> = {
      date: selectedDate,
      hdeb: heureDebut,
      hfin: heureFin,
      matiere: matiere,
      salle: salle,
    };

    const rep = axios.post(
      'http://192.168.137.43:5000/api/planning',
      newPlanning,
    );
    rep
      .then(response => {
        console.log('Planning ajouté avec succès:', response.data);
        Alert.alert('Succès', 'Cours ajouté avec succès.');
        getAllPlanning();
        setModalVisible(false);
        setMatiere('');
        setHeureDebut('');
        setHeureFin('');
        setSalle('');
      })
      .catch(error => {
        Alert.alert('Erreur', "Impossible d'ajouter le cours. Réessayez.");
      });
  };

  const coursesToday = schedule.filter(c => c.date === selectedDate);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <Text style={styles.title}>Emploi du temps</Text>

      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {selected: true, selectedColor: '#2f95dc'},
        }}
        style={styles.calendar}
      />

      <Text style={styles.subtitle}>
        {selectedDate ? `Cours du ${selectedDate}` : 'Sélectionnez une date'}
      </Text>

      {coursesToday.length === 0 && <Text>Aucun cours pour cette date.</Text>}

      <FlatList
        data={coursesToday}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.courseItem}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseText}>
                Horaire: {item.hdeb} - {item.hfin}
              </Text>
              <Text style={styles.courseText}>
                {item.matiere} | Salle {item.salle}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <Animated.View
            style={[
              styles.modalContent,
              {transform: [{translateY: slideAnim}]},
            ]}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <Text style={styles.title}>Ajouter une Révision</Text>

              <TextInput
                style={styles.input}
                placeholder="Matière"
                placeholderTextColor={'#999'}
                value={matiere}
                onChangeText={setMatiere}
              />

              <TouchableOpacity
                onPress={() => {
                  setPickerMode('debut');
                  setShowTimePicker(true);
                }}
                style={styles.input}>
                <Text style={{color: heureDebut ? '#000' : '#999'}}>
                  {heureDebut || 'Heure de début'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPickerMode('fin');
                  setShowTimePicker(true);
                }}
                style={styles.input}>
                <Text style={{color: heureFin ? '#000' : '#999'}}>
                  {heureFin || 'Heure de fin'}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChange}
                />
              )}

              <TextInput
                placeholder="Salle"
                placeholderTextColor={'#999'}
                value={salle}
                onChangeText={setSalle}
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  savePlanning();
                  setModalVisible(false);
                }}>
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#f2f6fc'},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  calendar: {marginBottom: 10},
  subtitle: {fontSize: 18, marginBottom: 10, fontWeight: '600'},
  courseItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  courseInfo: {
    flex: 1,
  },
  courseText: {fontSize: 16},
  input: {
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#2f95dc',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2f95dc',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 100,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});
