import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCurrentDate = () => {
  const today = new Date();
  const date = today.getDate();
  const month = today.toLocaleString('default', { month: 'short' });
  const year = today.getFullYear();
  return `${date} ${month} ${year}`;
};

const getCurrentDay = () => {
  const today = new Date();
  const options = { weekday: 'long' };
  return today.toLocaleDateString('ar-SA', options);
};

const SemesterSubjects = () => {
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [ratings, setRatings] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    setCurrentDate(getCurrentDate());
    setCurrentDay(getCurrentDay());
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue) {
        const userData = JSON.parse(jsonValue);

        // Define the values to be sent in the first POST request
        const values1 = { sp: 595 };

        // Define the values to be sent in the second POST request
        const values2 = {
          sp: 596,
          semester_id: userData.result.semester_id,
          class_id: userData.result.class_id
        };

        // Make Axios POST request for values1
        const response1 = await axios.post('https://db.al-marwaziuniversity.so/api/report', values1);
        const result1 = response1.data.result;
        setSemesters(result1);
        console.log('Semester (Response 1):', result1);

        // Make Axios POST request for values2
        const response2 = await axios.post('https://db.al-marwaziuniversity.so/api/report', values2);
        const result2 = response2.data.result;
        setSubjects(result2);
        console.log('Subjects (Response 2):', result2);
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  const handleStarPress = (subjectId, questionId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [`${subjectId}-${questionId}`]: rating,
    }));
  };

  const renderStars = (subjectId, questionId) => {
    const selectedRating = ratings[`${subjectId}-${questionId}`] || 0;

    return [...Array(5)].map((_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(subjectId, questionId, index + 1)}
      >
        <FontAwesome
          name="star"
          size={24}
          color={index < selectedRating ? 'gold' : 'gray'}
        />
      </TouchableOpacity>
    ));
  };

  // Check if at least one rating is given
  const isAnyRatingGiven = () => {
    return Object.values(ratings).some(rating => rating > 0);
  };

  const handleSave = async () => {
    if (!isAnyRatingGiven()) {
      Alert.alert("Rating Required", "Please rate at least one question before saving.");
      return;
    }

    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue) {
        const userData = JSON.parse(jsonValue);

        // Loop through the semesters or questions to send ratings
        for (const semester of semesters) {
          for (const subject of subjects) {
            const rating = ratings[`${subject.id}-${semester.id}`] || 0;

            // Only send the rating if it's greater than 0
            if (rating > 0) {
              const values3 = {
                sp: 597,
                company_id: 1,
                student_id: userData.result.auto_id,
                question_id: semester.id, // Use semester.id here
                teacher_id: subject.id,
                course_id: 1,
                class_id: userData.result.class_id,
                semester_id: userData.result.semester_id,
                year_id: 2024,
                semester_session: 1,
                stars: rating,
                user_id: 1,
                date: new Date().toISOString(),
              };

              // Send the rating via POST request
              const response3 = await axios.post('https://db.al-marwaziuniversity.so/api/report', values3);
              console.log('Rating submitted:', response3.data);
            }
          }
        }
        alert('Qiimayntada Wa La Diwangaliyay!');
      }
    } catch (err) {
      console.log('Save Error:', err);
      alert('An error occurred while saving.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.dayText}>{currentDay}</Text>
      </View>

      <View style={styles.semesterContainer}>
        <FontAwesome name="bookmark" size={24} color="#FF9800" style={styles.icon} />
        <Text style={styles.semesterText}>مستوى الحالي</Text>
      </View>

      {subjects.map((subject) => (
        <View key={subject.id}>
          <TouchableOpacity
            style={styles.subjectContainer}
            onPress={() => toggleExpand(subject.id)}
          >
             <FontAwesome
              name={expandedSubject === subject.id ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="gray"
              style={styles.arrowIcon}
            />
                        <Text style={styles.subjectText}>{subject.course}</Text>

            <View style={styles.subjectIcon}>
              <FontAwesome name="file-text" size={24} color="orange" />
            </View>

           
          </TouchableOpacity>

          {expandedSubject === subject.id && (
            <View style={styles.expandedContainer}>
              <Text style={styles.teacherName}>{subject.lecturer || 'No lecturer assigned'}</Text>

              {semesters.map((semester, index) => (
                <View key={index} style={styles.ratingContainer}>
                  <Text style={styles.ratingTitle}>
                    {index + 1}. {semester.question}
                  </Text>

                  <View style={styles.starsContainer}>
                    {renderStars(subject.id, semester.id)}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: isAnyRatingGiven() ? '#236b17' : '#cccccc' }
        ]}
        onPress={handleSave}
        disabled={!isAnyRatingGiven()} // Disable the button if no rating is given
      >
        <Text style={styles.saveText}>حفظ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  icon: {
    position: 'absolute',
    right: 0, // Align icon to the right
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayText: {
    fontSize: 20,
    color: "#236b17",
  },
  semesterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  semesterText: {
    marginRight: 25,
    fontSize: 16,
    color: "#236b17",
    fontWeight: 'bold',
    textAlign: 'right', // Align text content to the right
    flex: 1, // Ensure the text takes up full space within the row
  },
  subjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  subjectIcon: {
    marginRight: 10,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15
  },
  arrowIcon: {
    marginRight: 'auto',
  },
  expandedContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0066cc',
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  saveButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SemesterSubjects;
