import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ComplaintRegistrationScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const date = new Date().toISOString().split("T")[0];

  const fetchDropdownOptions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue !== null) {
        const userData = JSON.parse(jsonValue);
        const values = {
          sp: 616,
          userId: userData.id,
        };
        const response = await axios.post('https://mis.psu.edu.so/api/report', values); 
        const result = response.data.result;
        setOptions(result);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching dropdown options:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const handleSelect = (option) => {
    setSelectedOffice(option);
    setDropdownVisible(false);
  };

  const checkDuplicateDescription = async () => {
    try {
      const response = await axios.post('https://mis.psu.edu.so/api/check-duplicate', { description });
      return response.data.isDuplicate;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !selectedOffice) {
      Alert.alert('Fadlan Iska Hubi', 'Dooro xafiiska ka cabaneysid oo qor cabashadaada.');
      return;
    }

    try {
      const isDuplicate = await checkDuplicateDescription();
      if (isDuplicate) {
        Alert.alert('Duplicate Entry', 'This description already exists. Please provide a unique description.');
        return;
      }

      const jsonValue = await AsyncStorage.getItem('user');
      const userData = JSON.parse(jsonValue);
      const complaintData = {
        sp: 617,
        company_id: 1,
        student_id: userData.result.auto_id,
        title: title,
        description: description,
        office_id: selectedOffice?.id,
        user_id: 1,
        date: date,
      };

      const response = await axios.post('https://mis.psu.edu.so/api/report', complaintData);
      
      if (response.status === 200) {
        console.log('Complaint registered successfully:', response.data);
        Alert.alert('Success', 'Complaint registered successfully!');
        setTitle('');
        setDescription('');
        setSelectedOffice(null);
      } else {
        console.log('Failed to register complaint');
      }
    } catch (error) {
      console.error('Error registering complaint:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title Complaint Field */}
      <Text style={styles.label}>Title Complaint</Text>
      <TextInput
        style={[styles.input, styles.text]}
        placeholder="Write your Title Complaint here"
        value={title}
        onChangeText={setTitle}
        multiline={true}
      />

      {/* Complaint Field */}
      <Text style={styles.label}>Complaint</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your complaint here"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

      {/* Choose Office Dropdown */}
      <Text style={styles.label}>Choose the Office</Text>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedOffice ? selectedOffice.name : "Choose the Office you complain about"}
          </Text>
          <Icon name={isDropdownVisible ? 'chevron-up' : 'chevron-down'} size={15} color="#333" />
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={isDropdownVisible}
          animationType="slide"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Choose the Office</Text>
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
        </Modal>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: '#0a0a0a' }]}
        onPress={handleSubmit}
      >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#44b4d4',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
  },
  text: {
    height: 40,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  noOptionsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
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

export default ComplaintRegistrationScreen;
