import axios from 'axios';
import React, {use, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface Seance {
  heure: string;
  matiere: string;
  salle: string;
}

const Dashboard: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const [prochaineSeance, setProchaineSeance] = useState<Seance | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [userName, setUserName] = useState('');

  const getUser = async (id: number) => {
    try {
      const response = await axios.get(
        // `https://assitantetudiant.onrender.com/api/users/${id}`,
        `http://192.168.137.43:5000/api/users/${id}`,
      );
      setUserName(response.data.nom);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(
          'Erreur',
          'Impossible de récupérer les informations de l’utilisateur. Veuillez réessayer plus tard.',
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
    getUser(1);
  }, []);

  const emploiDuTemps: Seance[] = [
    {heure: '08:00', matiere: 'C#', salle: 'Salle A1'},
    {heure: '10:00', matiere: 'UML', salle: 'Salle A1'},
    {heure: '14:00', matiere: 'JAVA WEB', salle: 'Salle A1'},
    {heure: '16:00', matiere: "Droit de l'informatique", salle: 'Salle A1'},
  ];

  const taches: string[] = [
    'Projet Java (à corriger demain)',
    'Projet C# (lundi prochain)',
  ];

  useEffect(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(dateStr);

    const seanceAVenir = emploiDuTemps.find(seance => {
      const [hours, minutes] = seance.heure.split(':').map(Number);
      const seanceTime = new Date();
      seanceTime.setHours(hours, minutes, 0, 0);
      return seanceTime > now;
    });

    if (seanceAVenir) {
      setProchaineSeance(seanceAVenir);
      const interval = setInterval(() => {
        const now = new Date();
        const [h, m] = seanceAVenir.heure.split(':').map(Number);
        const target = new Date();
        target.setHours(h, m, 0, 0);
        const diff = target.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft('La séance commence !');
          clearInterval(interval);
          return;
        }

        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft('Aucune autre séance aujourd’hui.');
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bienvenue {userName} !</Text>
      <Text style={styles.date}>
        {currentDate} |{' '}
        <MaterialIcons name="wb-sunny" size={20} color="#fbc02d" /> 25°C
      </Text>

      {prochaineSeance && (
        <View style={styles.card}>
          <View style={styles.iconTitle}>
            <Ionicons name="time-outline" size={20} color="#2980b9" />
            <Text style={styles.cardTitle}> Prochaine séance</Text>
          </View>
          <Text style={styles.cardContent}>
            {prochaineSeance.heure} - {prochaineSeance.matiere} |{' '}
            {prochaineSeance.salle}
          </Text>
          <Text style={styles.countdown}>
            <Ionicons name="hourglass-outline" size={16} color="#888" /> Débute
            dans : {timeLeft}
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.iconTitle}>
          <Ionicons name="calendar-outline" size={20} color="#2980b9" />
          <Text style={styles.cardTitle}> Emploi du temps aujourd’hui</Text>
        </View>

        {emploiDuTemps.map((seance, index) => {
          const now = new Date();
          const [startHour, startMinute] = seance.heure.split(':').map(Number);
          const startTime = new Date();
          startTime.setHours(startHour, startMinute, 0, 0);

          const endTime = new Date(startTime);
          endTime.setHours(startTime.getHours() + 2);

          let statut = '';
          if (now < startTime) {
            statut = 'À venir';
          } else if (now >= startTime && now <= endTime) {
            statut = 'En cours';
          } else {
            statut = 'Terminé';
          }

          const statutColor =
            statut === 'En cours'
              ? '#27ae60'
              : statut === 'Terminé'
              ? '#c0392b'
              : '#2980b9';

          return (
            <View key={index} style={styles.seanceItem}>
              <Text style={styles.cardContent}>
                {seance.heure} - {seance.matiere} | {seance.salle}
              </Text>
              <Text style={[styles.statut, {color: statutColor}]}>
                <Ionicons
                  name={
                    statut === 'En cours'
                      ? 'play-circle-outline'
                      : statut === 'Terminé'
                      ? 'checkmark-done-outline'
                      : 'time-outline'
                  }
                  size={16}
                  color={statutColor}
                />{' '}
                {statut}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <View style={styles.iconTitle}>
          <FontAwesome5 name="tasks" size={18} color="#2980b9" />
          <Text style={styles.cardTitle}> Tâches à faire</Text>
        </View>
        {taches.map((tache, index) => (
          <Text key={index} style={styles.cardContent}>
            • {tache}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.iconTitle}>
          <Ionicons name="alert-circle-outline" size={20} color="#d35400" />
          <Text style={styles.cardTitle}> Rappel</Text>
        </View>
        <Text style={styles.cardContent}>Contrôle de Math lundi prochain</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  iconTitle: {
    // display: 'flex',
    // justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2f95dc',
  },
  cardContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  countdown: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,

    color: '#d35400',
  },
  chatButton: {
    marginTop: 20,
    backgroundColor: '#2f95dc',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seanceItem: {
    marginBottom: 10,
  },
  statut: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default Dashboard;
