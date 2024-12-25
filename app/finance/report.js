import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Table, Row, Rows } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const StatementScreen = () => {
  const [selectedItem, setSelectedItem] = useState({ name: 'جميع التاريخ', value: '1' });
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [fromDate, setFromDate] = useState(new Date('2000-01-01'));
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [marks, setMarks] = useState([]);

  const url = 'https://db.al-marwaziuniversity.so/api/report';

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchMarks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        const values = {
          sp: 547,
          std_id: userData.result.auto_id,
          from: formatDate(fromDate),
          to: formatDate(toDate)
        };
        const response = await axios.post(url, values);
        const result = response.data.result;
        setMarks(result);
        console.log('Results:', response.data.result);
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  useEffect(() => {
    if (isGenerated) {
      fetchMarks();
    }
  }, [isGenerated, fromDate, toDate, selectedItem]); // Add dependencies

  const options = [
    { name: 'جميع التاريخ', value: '1' },
    { name: 'مخصص', value: '2' }
  ];

  const handleSelect = (item) => {
    setSelectedItem(item);
    setDropdownVisible(false);
    
    if (item.value === '1') {
      setFromDate(new Date('2000-01-01'));
      setToDate(new Date());
    } else if (item.value === '2') {
      const currentDate = new Date();
      setFromDate(currentDate);
      setToDate(currentDate);
    }
    setIsGenerated(true); // Trigger fetch on selection change
  };


  const tableHead = ['الباقي', 'المدفوع', 'رفع', 'الرسوم', 'التاريخ'];
  const tableRows = marks.map(item => [item.Balance, item.CR, item.DR, item.Description, item.date]);

  return (
    <ScrollView style={styles.container1}>
      <ImageBackground
        source={require('../../assets/finance.jpg')} // Your image file here
        style={styles.headerImage}
      >
        <Text style={styles.title}>هنا تفاصيل الرسوم</Text>
        <Text style={styles.subtitle}>Review your statement here</Text>
      </ImageBackground>

      {/* Custom Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.modalTitle}>اختر التاريخ</Text>
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
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>اختر التاريخ</Text>
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

      {/* Date Inputs */}
      {selectedItem.value !== '1' && ( // Only show date pickers if 'Custom' is selected
        <>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>من</Text>
            <TouchableOpacity onPress={() => setShowFromDatePicker(true)}>
              <Text>{formatDate(fromDate)}</Text>
            </TouchableOpacity>

            {showFromDatePicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowFromDatePicker(false);
                  if (selectedDate) setFromDate(selectedDate);
                }}
              />
            )}
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>إلى</Text>
            <TouchableOpacity onPress={() => setShowToDatePicker(true)}>
              <Text>{formatDate(toDate)}</Text>
            </TouchableOpacity>

            {showToDatePicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowToDatePicker(false);
                  if (selectedDate) setToDate(selectedDate);
                }}
              />
            )}
          </View>
        </>
      )}

      {/* Generate Button */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => setIsGenerated(true)} // Set generated state to true
      >
        <Text style={styles.generateButtonText}>اختر</Text>
      </TouchableOpacity>

      {/* Table for Statement */}
      {isGenerated && (
        <View style={styles.container}>
          <Text style={styles.title}>تفاصيل الرسوم المالية</Text>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.headText} />
            <Rows data={tableRows} textStyle={styles.text} />
          </Table>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  container: {
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 50, // Add this line for bottom margin

  },
  headerImage: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FF9800',
    alignSelf: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFF00',
    alignSelf: 'center'

  },
  dropdownContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row-reverse', // Reverse the order of text and icon
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
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
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
  dateContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    elevation: 3,
  },
  dateLabel: {
    fontSize: 16,
    color: '#7a7a7a',
    marginBottom: 5,
    textAlign: 'right'
  },
  datePicker: {
    width: '100%',
     },
  generateButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  head: {
    height: 40,
    backgroundColor: '#FF9800',
  },
  headText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
});

export default StatementScreen;
