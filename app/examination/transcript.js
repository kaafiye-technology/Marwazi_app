import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CourseList = () => {
  const [groupedCourses, setGroupedCourses] = useState({});

  const url = 'https://mis.psu.edu.so/api/report'; // Replace with actual URL

  const fetchMarks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        const values = {
          sp: 591,
          std_id: userData.result.auto_id,
        };
        console.log('Stored Semester ID:', userData.result.semester_id);

        const response = await axios.post(url, values);
        const result = response.data.result;

        const grouped = result.reduce((acc, course) => {
          (acc[course.semester_id] = acc[course.semester_id] || []).push(course);
          return acc;
        }, {});

        setGroupedCourses(grouped);
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const getEnglishSemester = (semesterId) => {
    const semesterMap = {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      265: '9',
      266: '10',
      9: '11',
      10: '12',
      11: '1',
      12: '2',
      503: '3',
    };
    return semesterMap[semesterId] || semesterId;
  };

  const renderCourse = ({ item }) => (
    <View style={styles.courseRow}> 
      <Text style={styles.courseName}>{item.course}</Text>
      <Text style={styles.courseTotal}>{item.total}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {Object.keys(groupedCourses).map((semesterId) => (
          <View key={semesterId} style={styles.semesterContainer}>
            <Text style={styles.semesterTitle}>
              {['11', '12', '503'].includes(semesterId) ? 'F-Term ' : 'Term '}
              {getEnglishSemester(semesterId)}
            </Text>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Course Name</Text>
              <Text style={styles.headerText}>Total</Text>
            </View>
            <FlatList
              data={groupedCourses[semesterId]}
              renderItem={renderCourse}
              keyExtractor={(item) => item.course}
              style={styles.list}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#44b4d4',

  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#44b4d4',
  },
  semesterContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  semesterTitle: {
    backgroundColor: '#0a0a0a',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#44b4d4',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  courseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // allow multi-line alignment
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    gap: 8, // optional: adds spacing
  },
  courseName: {
    flex: 1, // take remaining space
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap',
  },
  courseTotal: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    textAlign: 'right',
    minWidth: 50, // ensure enough width
  },
  
});

export default CourseList;
