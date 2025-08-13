import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal,Dimensions,SafeAreaView } from 'react-native';
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
  const [selectedItem, setSelectedItem] = useState({name: 'Term 1', value: '1'}); // Default selected item
const { height, width } = Dimensions.get('window');

  const url = 'https://mis.psu.edu.so/api/report';

  const fetchBalance = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);

        const values1 = {
          sp: 619,
          std_id: userData.result.auto_id,
        };

        const values2 = {
          sp: 592,
          std_id: userData.result.std_id,
          semester_id: selectedItem.value, // Use selectedItem.value for the selected semester
        };

        const response1 = await axios.post(url, values1);
        const result1 = response1.data.result[0];
       // console.log('info',response1.data.result)
        setUser(result1);

        const response2 = await axios.post(url, values2);
        const result2 = response2.data.result || []; // Ensure it's an array
        console.log('API Response for selected term:', response2.data);
        console.log('Selected Term Value:', selectedItem.value);
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
  }, [selectedItem.value]); // Ensure it re-fetches on change
  

  const handleSelect = (item) => {
    setSelectedItem(item);
    setDropdownVisible(false); // Close the modal when an item is selected
  };

  const options = [
    { name: 'Term 1', value: '1' },
    { name: 'Term 2', value: '2' },
    { name: 'Term 3', value: '3' },
    { name: 'Term 4', value: '4' },
    { name: 'Term 5', value: '5' },
    { name: 'Term 6', value: '6' },
    { name: 'Term 7', value: '7' },
    { name: 'Term 8', value: '8' },
    { name: 'Term 9', value: '265' },
    { name: 'Term 10', value: '266' },
    { name: 'Term 11', value: '9' },
    { name: 'Term 12', value: '10' },
    { name: 'F-Term 1', value: '11' },
    { name: 'F-Term 2', value: '12' },
    { name: 'F-Term 3', value: '503' },
  ];

  console.log('subjects:', subjects)
  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}><Text style={styles.bold}>Name:</Text> <Text style={styles.bold1}> {user?.name}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Faculty:</Text><Text style={styles.bold1}> {user?.faculty}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Department:</Text> <Text style={styles.bold1}>{user?.department}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Class:</Text> <Text style={styles.bold1}>{user?.class}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Current Term:</Text> <Text style={styles.bold1}>{user?.semester}</Text></Text>
        <Text style={styles.infoText}><Text style={styles.bold}>Class Position:</Text><Text style={styles.bold1}> {user?.kaalinta} </Text></Text>
        <Text style={styles.infoText}>
  <Text style={styles.bold1}>Percentage Gained:</Text> 
  <Text style={styles.blackText}> {percentGained}% </Text>
  <Text style={styles.bold1}> Total Marks:</Text> 
  <Text style={styles.blackText}>{totalMarks}</Text>
</Text>
      </View>
     
      {/* Custom Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.modalTitle}>Choose Term</Text>
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
              <Text style={styles.modalTitle}>Choose Term</Text>
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

      {Array.isArray(subjects) && subjects.length > 0 ? (
  subjects.map((subject, index) => (
    <View 
      key={index} 
      style={[
        styles.subjectContainer, 
        index === subjects.length - 1 ? styles.lastSubjectContainer : {}
      ]} // Apply extra margin to all but the last item
    >
      <Text style={styles.courseTitle}>{subject?.course || 'Unknown Subject'}</Text>

      <View style={styles.marksContainer}>
      <View style={styles.row}>
          <Text style={styles.label}>Attendance</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.Attendence || 0).toString()} 
            editable={false} 
          />
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Quiz</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.Quiz || 0).toString()} 
            editable={false} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Assignment</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.Assignment || 0).toString()} 
            editable={false} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Midterm</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.Midterm || 0).toString()} 
            editable={false} 
          />
        </View>        

        <View style={styles.row}>
          <Text style={styles.label}>Final</Text>
          <TextInput 
            style={styles.input} 
            value={(subject?.Final || 0).toString()} 
            editable={false} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total</Text>
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
  <Text style={styles.text} >No subjects available for this semester.</Text>
)}

    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#44b4d4',
    
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#44b4d4',
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
  }, 
  bold1: {
    color: '#44b4d4',
    fontSize: 15,
    
  },
  blackText: {
    color: '#000', // Black color for numbers
    fontWeight: 'bold',
  },
  
  text: {
    color: '#fff',
    
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
    width: '100%',   
    height: 50,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#44b4d4',
    flex: 1, 
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '100%',   
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
    backgroundColor: '#44b4d4'

  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#0a0a0a',

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
    fontWeight: 'bold',

  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#44b4d4',
    textAlign: 'center',
  },
  subjectContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 28,
    marginBottom: 110, // Space between subject containers
    alignItems: 'center',
    width: '100%',
    height: 310,
  },
 
  marksContainer: {
    backgroundColor: '#0a0a0a',
    padding: 16,
    elevation: 2,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    width: '107%', // Ensure it fits within the container
  },
  row: {
    flexDirection: 'row', // Change to 'row-reverse' to position the label on the right
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    width: '30%', // Adjust width if necessary
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: '65%', // Adjust width if necessary
    fontSize: 16,
  },
});

export default ReportCard;
