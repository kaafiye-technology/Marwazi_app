import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Text, Card } from 'react-native-elements';
import { Link, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


// const App = () => {
  // const tableHead = ['Subject', 'Marks', 'Status'];
  // const tableData = [
  //   ['الفرائض2', '59.5', 'passed'],
  //   ['قاعة بحث', '72', 'passed'],
  //   ['طرق التدريس', '73', 'passed'],
  //   ['فقه العبادات4', '67', 'passed'],
  // ];
  const App = () => {
    const tableHead = ['المدفوع', 'الرسوم', 'التاريخ', ];
    // const tableData = [
    //   {course:'الفرائض2', total:'59.5', status:'passed'},
    //   {course:'قاعة بحث', total:'72', status:'passed'},
    //   {course:'طرق التدريس', total:'73', status:'passed'},
    //   {course:'فقه العبادات4', total:'67', status:'passed'},
    // ];


  const [marks, setMarks] = useState([]);
  const url = 'https://db.al-marwaziuniversity.so/api/report'
    const { semester_id } = useLocalSearchParams();
  const fetchMarks = async () => {
      
    try {
        const jsonValue = await AsyncStorage.getItem('user');
    if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        const values = {
            sp: 586,
            std_id: userData.result.auto_id,
            
        }

        const response = await axios.post(url,values);
        
        const result = response.data.result;
            setMarks(result);
        
    }
        

       
    } catch (err) {
       // setError(err.message);
       console.log('eeror', err)
    } finally {
      //  setLoading(false);
    }
};

useEffect(()=>{
    fetchMarks();
},[])


  const tableRows = marks.map(item => [ item.CR,item.Description,item.date]);
// Step 1: Extract the 'total' values
const totalValues = marks.map(item => parseFloat(item.total));

// Step 2: Sum the values
const sum = totalValues.reduce((acc, value) => acc + value, 0);
const average = sum / marks.length;
const roundedNumber = average.toFixed(2);

console.log('Sum of totals:', sum);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card containerStyle={styles.card}>
          <Text h3 style={styles.title}>مدفوعات الطالب/ــة</Text>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.headText} />
            <Rows data={tableRows} textStyle={styles.text} />
          </Table>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#236b17',
  },
  card: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 0,
    shadowColor: 'transparent',
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
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
  footer: {
    height: 40,
    backgroundColor: '#3bcd6b',
  },
  footerText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default App;
