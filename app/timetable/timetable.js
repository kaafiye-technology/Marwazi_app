import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

export default function ScheduleScreen() {
  const [scheduleData, setScheduleData] = useState([]);
  const { semester_id } = useLocalSearchParams();
  const [error, setError] = useState(null);

  const fetchSchedule = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue) {
        const userData = JSON.parse(jsonValue);
        const values = {
          sp: 545,
          class_id: userData.result.class_id,
          semester_id: userData.result.semester_id,
          day_id: semester_id,
        };
        const response = await axios.post('https://mis.psu.edu.so/api/report', values);
        const result = response.data.result;

        setScheduleData(result);
      }
    } catch (err) {
      console.log('Fetch error:', err);
      setError('Failed to load schedule.');
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [semester_id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#44b4d4" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Time Table</Text>
        </View>

        <View style={styles.scheduleContainer}>
  <Text style={styles.todayText}>
    {scheduleData.length > 0 ? scheduleData[0].day : 'Day'}
  </Text>
  {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

  <FlatList
    data={scheduleData}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Text style={styles.time}> {item.period.split(' ')[0]}{"\n"}
        {item.period.split(' ').slice(1, 4).join(' ')}</Text>
        <View style={styles.details}>
          <Text style={styles.subject}>{item.course}</Text>
          <View style={styles.row}>
            <Feather name="map-pin" size={14} color="#ffbc00" />
            <Text style={styles.room}>{item.class}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={{
                uri:
                  item.avatar ||
                  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
              }}
              style={styles.avatar}
            />
            <Text style={styles.teacher}>{item.lecturer}</Text>
          </View>
        </View>
        {item.assessment && (
          <View style={styles.assessmentBadge}>
            <Text style={styles.assessmentText}>{item.assessment}</Text>
          </View>
        )}
      </View>
    )}
  />
</View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
  },
  todayText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  time: {
    fontWeight: "bold",
    width: 70,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  room: {
    fontSize: 13,
    marginLeft: 5,
    color: "#555",
  },
  teacher: {
    fontSize: 13,
    marginLeft: 8,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  assessmentBadge: {
    backgroundColor: "#ffe5e5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  assessmentText: {
    color: "#d00",
    fontWeight: "bold",
  },
});
