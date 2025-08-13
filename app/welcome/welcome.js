// import React, { useEffect, useState } from 'react';
// import { ScrollView, View, Text, Image, StyleSheet, Button, FlatList, ActivityIndicator } from 'react-native';
// import axios from 'axios';

// const reportUrl = `https://mis.psu.edu.so/api/report`;
// const url = `https://mis.psu.edu.so/`;
 

// const DepartmentItem = ({ title, years, fee, image }) => (
//   <View style={styles.department}>
//     <Image source={{ uri: image }} style={styles.departmentImage} />
//     <Text style={styles.departmentTitle}>{title}</Text>
//     <Text style={styles.departmentInfo}>{years} | {fee}</Text>
//     <Button title="Apply" onPress={() => { /* Handle apply action */ }} />
//   </View>
// );

// const WelcomeScreen = () => {
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   const values = {
//     sp: 576,
//     faculty_id: '%'
// }
//   useEffect( async () => {
//     const response = await axios.post(reportUrl, values);
//     console.log('response: ', response.data.result)
//     setDepartments(response.data.result);
//     setLoading(false);
//    }, [])

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//       <Image source={require('../../assets/logo.png')} style={styles.logo} />
//         <Text style={styles.title}>Welcome to Our University</Text>
//         <Text style={styles.welcomeMessage}>
//         Puntland State University and thank you for visiting its main website. Puntland State University was founded by a group of dedicated Somali scholars and is committed to the development of human potential to contribute to the implementation of Somali national development plans. Puntland State University will serve the Somali nation by providing its students with world-class and relevant knowledge, skills, and ethical and moral training necessary for the 21st Century.
 
//  We invite qualified faculty and talented Somali students to visit our university campuses and join the growing community of scholars at Puntland State University.
 
//  All the best
//           </Text>
//       </View>
//       <FlatList
//         data={departments}
//         renderItem={({ item }) => (
//           <DepartmentItem
//             title={item.department}
//             years={item.years}
//             fee={item.fee}
//             image={url+item.image}
//           />
//         )}
//         keyExtractor={item => item.department_id.toString()}
//         contentContainerStyle={styles.departmentsContainer}
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   welcomeMessage: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   departmentsContainer: {
//     flexGrow: 1,
//   },
//   department: {
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//   },
//   departmentImage: {
//     width: '100%',
//     height: 150,
//     resizeMode: 'cover',
//     marginBottom: 10,
//   },
//   departmentTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   departmentInfo: {
//     fontSize: 16,
//     marginVertical: 10,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//   },
// });

// export default WelcomeScreen;
