import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Link ,router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SemesterItem = ({ semester }) => {
    return (
      <TouchableOpacity onPress={() => router.push('timetable/timetable?semester_id='+semester.day_id)}>

      <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{semester.day}</Text>

        <View style={styles.iconContainer}>
          
        <Icon name="calendar-clock" size={24} color="#fff" />

        </View>
        

      </View>
      </TouchableOpacity>       

    );
  };

const SemestersList = () => {
  const [semesters, setSemesters] = useState([]);
  const url = 'https://mis.psu.edu.so/api/report'

  const fetchSemesters = async () => {
      
    try {
        const jsonValue = await AsyncStorage.getItem('user');
    if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        const values = {
            sp: 615,
            class_id: userData.result.class_id,
            semester_id: userData.result.semester_id

        }

        const response = await axios.post(url,values);
        
        const result = response.data.result;
            setSemesters(result);
        
      console.log('Fetched semesters:', result); // ✅ Log result in terminal

    }
        

       
    } catch (err) {
       // setError(err.message);
       console.log('eeror', err)
    } finally {
      //  setLoading(false);
    }
};

useEffect(()=>{
    fetchSemesters();
},[])

const SemesterItem = ({ semester }) => {
  return (
    <TouchableOpacity onPress={() => router.push('timetable/timetable?semester_id=' + semester.day_id)}>
      <View style={styles.itemContainer}>
        
        {/* Icon FIRST */}
        <View style={styles.iconContainer}>
          <Icon name="calendar-clock" size={24} color="#fff" />
        </View>

        {/* Day Name AFTER */}
        <Text style={styles.itemText}>{semester.day}</Text>

      </View>
    </TouchableOpacity>
  );
};



  return (
    <View style={styles.container}>
        <Text style={styles.semes}>Days</Text>
        <FlatList
        data={semesters}
        keyExtractor={(item) => item.day_id.toString()} // Assuming each semester has an `id` field
        renderItem={({ item }) => <SemesterItem semester={item} />} // Assuming the semester number is in `item.number`
     //  renderItem={renderItem}
     />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#44b4d4',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semes:{
    color:'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,

  },
  itemContainer: {
    flexDirection: 'row', // Ensures icon appears first, then text
    alignItems: 'center', // Aligns items vertically centered
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Ensures spacing between icon and text
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10, // Pushes text to the right of the icon
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    
  },

});

export default SemestersList;
