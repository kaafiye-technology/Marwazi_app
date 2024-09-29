import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Icon } from 'react-native-elements'; // Assuming you're using react-native-elements for icons
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportCard = () => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [user, setUser] = useState([]);
  const [subjects, setSubjects] = useState([]); // Initialize subjects as an array
  const [totalMarks, setTotalMarks] = useState(0); // Add a state for total marks
  const [percentGained, setPercentGained] = useState(0); // State for percentage gained
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Modal visibility state
  const [selectedItem, setSelectedItem] = useState({name: 'المستوى الأول', value: '1'}); // Default selected item

  const url = 'https://db.al-marwaziuniversity.so/api/report';

  const fetchBalance = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);

        const values1 = {
          sp: 537,
          std_id: userData.result.auto_id,
        };

        const values2 = {
          sp: 592,
          std_id: userData.result.auto_id,
          semester_id: selectedItem.value, // Use selectedItem.value for the selected semester
        };

        const response1 = await axios.post(url, values1);
        const result1 = response1.data.result[0];
        console.log('info',response1.data.result)
        setUser(result1);

        const response2 = await axios.post(url, values2);
        const result2 = response2.data.result || []; // Ensure it's an array

        if (Array.isArray(result2)) {
          setSubjects(result2);

          // Calculate total marks
          const total = result2.reduce((acc, subject) => acc + (subject?.total || 0), 0);
          setTotalMarks(total); // Set the total marks

          // Calculate total possible marks
          const totalPossibleMarks = result2.length * 100; // Assuming max 100 per subject

          // Calculate the percentage gained
          const percentage = totalPossibleMarks > 0 ? (total / totalPossibleMarks) * 100 : 0;
          setPercentGained(percentage.toFixed(2)); // Round to 2 decimal places
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [selectedItem]); // Refetch data when selectedItem changes

  const handleSelect = (item) => {
    setSelectedItem(item);
    setDropdownVisible(false); // Close the modal when an item is selected
  };

  const options = [
    { name: 'المستوى الأول', value: '1' },
    { name: 'المستوى الثاني ', value: '2' },
    { name: 'المستوى الثالث', value: '3' },
    { name: 'المستوى الرابع', value: '4' },
    { name: 'المستوى الخامس', value: '5' },
    { name: 'المستوى السادس ', value: '6' },
    { name: 'المستوى السابع', value: '7' },
    { name: 'المستوى الثامن', value: '8' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}><Text style={styles.bold}>Name:</Text> <Text style={styles.bold1}> {user?.name}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Faculty:</Text><Text style={styles.bold1}> {user?.faculty}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Department:</Text> <Text style={styles.bold1}>{user?.department}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Class:</Text> <Text style={styles.bold1}>{user?.class}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Current Semester:</Text> <Text style={styles.bold1}>{user?.semester}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Class Position:</Text><Text style={styles.bold1}> {user?.kaalinta} students</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Department Position:</Text><Text style={styles.bold1}> {user?.depart} students</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Percent Gained:</Text><Text style={styles.bold1}> {percentGained}% Total Marks: {totalMarks}</Text></Text>
      </View>

      {/* Custom Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.modalTitle}>Choose Semester</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>{selectedItem.name}</Text>
        </TouchableOpacity>

        {/* Modal for Dropdown */}
        <Modal
          transparent={true}
          visible={isDropdownVisible}
          animationType="slide"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Choose Semester</Text>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={styles.modalItemText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>

      {/* Marks Section */}
      {Array.isArray(subjects) && subjects.length > 0 ? (
  subjects.map((subject, index) => (
    <View key={index} style={styles.subjectContainer}>
      {/* Make sure the course title is inside a Text component */}
      <Text style={styles.courseTitle}>{subject?.course || 'Unknown Subject'}</Text>

      <View style={styles.marksContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>درجة الحضور1</Text>
          {/* Wrap value inside a Text component */}
          <TextInput 
            style={styles.input} 
            value={(subject?.attendance1 || 0).toString()} 
            editable={false} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>درجة الامتحان النصفي</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.Midterm || 0).toString()} 
            editable={false} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>درجة المشاركة</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.participation || 0).toString()} 
            editable={false} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>درجة الحضور2</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.attendance2 || 0).toString()} 
            editable={false} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>درجة الامتحان النهائي</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.finalterm || 0).toString()} 
            editable={false} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>المجموع</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.total || 0).toString()} 
            editable={false} 
          />
        </View>
      </View>
    </View>
  ))
) : (
  <Text>No subjects available for this semester.</Text>
)}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    
  },
  infoText: {
    fontSize: 14,
    marginVertical: 2,
    fontWeight: 'bold',

  },
  bold: {
    fontWeight: 'bold',
    
  }, bold1: {
    color: '#236b17',
    fontSize: 16,
    
  },
  dropdownContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: 370,
    height: 50,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    flex: 1, 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
    backgroundColor: '#FF9800'

  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalItem: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    backgroundColor: '#f0f0f0',
    borderRadius: 35,
    margin: 3,
    
    
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right'

  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 24
  },
  subjectContainer: {   // Subject container as a header for the subject
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 28,
    marginBottom: 8,
    alignItems: 'center',   // Center the text
    width:380,
    height:390

  },
  marksContainer: {
    backgroundColor: '#236b17',
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    width:380,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    width: '30%',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: '65%',
    fontSize: 16,
  },
});

export default ReportCard;