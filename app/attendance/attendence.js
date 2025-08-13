import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal,TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing icons
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const AttendanceScreen = () => {
  const [selectedItem, setSelectedItem] = useState({ name: 'All', id: '' });
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Modal visibility state
  const [options, setOptions] = useState([]); // Dropdown options from API
  const [loading, setLoading] = useState(true); // For loading state
  const [subject, setSubject] = useState({
    result: [], // Initialize result as an empty array
  });

  // Function to fetch options from API
  const fetchDropdownOptions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue !== null) {
        const userData = JSON.parse(jsonValue);
        const values = {
          sp: 621,
          semester_id: userData.result.semester_id,
          class_id: userData.result.class_id,
        };

        // API call to fetch options
        const response = await axios.post('https://mis.psu.edu.so/api/report', values);
        const result = response.data.result;

        // Update the options state
        setOptions(result);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching dropdown options:', err);
      setLoading(false);
    }
  };

  // Function to fetch subject data
  const fetchSubjectData = async (item) => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue !== null) {
        const userData = JSON.parse(jsonValue);

        const response = await axios.post('https://mis.psu.edu.so/api/report', {
          sp: 620,
          auto_id: userData.result.auto_id,
          semester_id: userData.result.semester_id,
          class_id: userData.result.class_id,
          course_id: item.id || '',
        });

        // Save the response data to subject state
        setSubject(response.data);
        console.log('Subject data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching subject data:', error);
    }
  };

  // Fetch options when the component mounts
  useEffect(() => {
    fetchDropdownOptions();
    
    fetchSubjectData(selectedItem);
  }, []); // Re-fetch data when selectedItem changes

  const handleSelect = (item) => {
    console.log('selected:', item);
    setSelectedItem(item);
    fetchSubjectData(item);
    setDropdownVisible(false); // Close the modal when an item is selected
  };

  // Ensure the correct type for attend and absents
  const attend = subject.result.length > 0 ? Number(subject.result[0]?.attend) : 0;  // Convert to number
  const absents = subject.result.length > 0 ? Number(subject.result[0]?.absents) : 0;  // Convert to number

  // PieChart data
  const data = [
    {
      name: 'Absent',
      value: absents,  // Use the parsed number for absents
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Present',
      value: attend,  // Use the parsed number for attendance
      color: '#36A2EB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.dropdownContainer}>
        {/* Custom Dropdown */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>{selectedItem.name}</Text>
          <Icon name={isDropdownVisible ? 'chevron-up' : 'chevron-down'} size={15} color="#333" />
        </TouchableOpacity>

        {/* Modal for Dropdown */}
        <Modal
          transparent={true}
          visible={isDropdownVisible}
          animationType="slide"
          onRequestClose={() => setDropdownVisible(false)}
        ><TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose Course</Text>
            {loading ? (
              <Text>Loading options...</Text>
            ) : options.length > 0 ? (
              options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={styles.modalItemText}>{option.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noOptionsText}>No options available</Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      
        </Modal>
      </View>

      <Text style={styles.headerText}>Rate of Absents and Presents</Text>

      <PieChart
        data={data}
        width={screenWidth * 0.9}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <View style={styles.detailsContainer}>
        <View style={styles.detailText}>
          <Icon name="calendar" size={20} color="#333" style={styles.icon} />
          <Text style={styles.text}>
           Total Periods: <Text style={styles.boldText}>{subject.result.length > 0 ? subject.result[0]?.periods : 'N/A'}</Text>
          </Text>
        </View>
        <View style={styles.detailText}>
          <Icon name="check-circle" size={20} color="green" style={styles.icon} />
          <Text style={styles.text}>
            Present Periods: <Text style={styles.boldText}>{attend || 'N/A'}</Text>
          </Text>
        </View>
        <View style={styles.detailText}>
          <Icon name="times-circle" size={20} color="red" style={styles.icon} />
          <Text style={styles.text}>
            Absent Periods: <Text style={styles.boldText}>{absents || 'N/A'}</Text>
          </Text>
        </View>
        <View style={styles.detailText}>
          <Icon name="percent" size={20} color="#333" style={styles.icon} />
          <Text style={styles.text}>
          Attendance Rate: <Text style={styles.boldText}>{attend && subject.result[0]?.periods ? '%' + ((attend / subject.result[0]?.periods) * 100).toFixed(2) : 'N/A'}</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
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
    color: '#333',
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
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detailsContainer: {
    marginTop: 20,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailText: {
    flexDirection: 'row', // Icons to the right
    justifyContent: 'flex-start', // Align items correctly
    alignItems: 'center', // Center items vertically
    marginBottom: 10,
    padding: 6,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    marginLeft: 10,
  },
  noOptionsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default AttendanceScreen;
