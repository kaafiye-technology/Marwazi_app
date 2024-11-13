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
  const url = 'https://db.al-marwaziuniversity.so/api/report'

  const fetchSemesters = async () => {
      
    try {
        const jsonValue = await AsyncStorage.getItem('user');
    if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        const values = {
            sp: 616,
            class_id: userData.result.class_id,
            semester_id: userData.result.semester_id

        }

        const response = await axios.post(url,values);
        
        const result = response.data.result;
            setSemesters(result);
        
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


console.log('semester:', semesters)
  const renderItem = ({ item }) => (
    <Link
        style={styles.itemContainer}
        href={''}
    >

<View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
      <Icon name="calendar-clock" size={24} color="#fff" />
      </View>
      <Text style={styles.itemText}>{item.day}</Text>
    </View>

   
    </Link>
);

  return (
    <View style={styles.container}>
        <Text style={styles.semes}>الأيام</Text>
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
    backgroundColor: '#236b17',
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
    textAlign: 'right',
    marginBottom: 15,

  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
        justifyContent: 'flex-end', // Aligns icon and text to the right

  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    margin: 10

  },
});

export default SemestersList;
