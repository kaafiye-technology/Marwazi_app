import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from "expo-router";
const Dashboard = () => {

 

  const [user, setUser] = useState([]);

  // Function to load data
  const getStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('user');
        if (jsonValue != null) {
            const userData = JSON.parse(jsonValue);
            console.log('userdata', userData);
            setUser(userData);
        } else {
          router.push('/welcome/welcome');
        }
    } catch (error) {
        console.error('Error loading data', error);
    }
  };


  const [update, setUpdate] = useState(null);
  const [values, setValues] = useState({
    sp: 551,
    version: 1,
})
  const CheckVersion = async () => {
    try {
      const res = await axios.post('https://db.al-marwaziuniversity.so/api/save'
, 
        values,
      );
      setUpdate(res.data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  console.log('val',values)

console.log('version update',update)

if( update== 'Not Updated' ){
  router.push('/update')
}

  useEffect(() => {
    getStorage();
    CheckVersion();
  }, []);
  return (
    <ScrollView style={styles.container}>
      {/* University Logo */}
      <View style={styles.logoContainer}>
        <Image source={{uri: 'https://al-marwaziuniversity.so/uploads/ktc_edit_sp/logo/marwaziunivbersity.png_ktceditsp_20240521065859.png' }} style={styles.headerImg} alt='Logo' />
                <Text style={styles.logoText}>بوابة الطالب/ ــة</Text>


      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>

      <Pressable style={styles.feature} onPress={() => router.push('/users/profile')}>
          <Icon name="account" size={30} color="#9C27B0"  />
          <Text style={styles.featureText}>ملف الطالب</Text>
        </Pressable>
        <Pressable style={styles.feature}  onPress={() => router.push('/timetable/semesters')}>
          <Icon name="calendar-outline" size={30} color="#2196F3" />
          <Text style={styles.featureText}>الجدول الدراسي</Text>
        </Pressable>

        <Pressable style={styles.feature} onPress={() => router.push('/attendance/attendence')}>
          <Icon name="check-circle-outline" size={30} color="#9C27B0"  />
          <Text style={styles.featureText}>الحضور</Text>
        </Pressable>

        <Pressable style={styles.feature}  onPress={() => router.push('/finance/semesters')}>
          <Icon name="cash" size={30} color="#FF9800" />
          <Text style={styles.featureText}>الرسوم المالية</Text>
        </Pressable>

        <Pressable style={styles.feature}  onPress={() => router.push('/examination/semesters')}>
          <Icon name="file-document-outline" size={30} color="#4CAF50" />
          <Text style={styles.featureText}>نتائج الإمتحانات</Text>
        </Pressable>
 
        <Pressable style={styles.feature} onPress={() => router.push('/evaluation/evaluation')}>
          <Icon name="chart-bar" size={30} color="#FF9800"  />
          <Text style={styles.featureText}>التقييم</Text>
        </Pressable>
       
        <Pressable style={styles.feature} onPress={() => router.push('/complaint/complaint')}>
          <Icon name="alert-circle-outline" size={30} color="red"  />
          <Text style={styles.featureText}>الشكاوى</Text>
        </Pressable>
        <Pressable style={styles.feature} onPress={() => router.push('/notification/MessageScreen')}>
          <Icon name="bell" size={30} color="#2196F3"  />
          <Text style={styles.featureText}>إشعارات</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#236b17',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: -40,
    marginTop: -20,

  },
  featuresContainer: {
    marginTop: 20,
  },
  feature: {
    flexDirection: 'row-reverse', // Reverse the icon and text
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 13,
    marginVertical: 6,
    borderRadius: 15,
    elevation: 4,
  },
  featureText: {
    fontSize: 18,
    marginRight: 20, // Adds space between the text and the icon (since we reversed the direction)
    color: '#333',
  },
  headerImg:{
    width: 150,
    height: 150,
    alignSelf: 'center',
   marginBottom:36,
   borderRadius: 60,
}
});

export default Dashboard;


// import { Link, router } from "expo-router";
// import { View, Text, Image, StyleSheet, Pressable, SafeAreaView, Dimensions, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect, useState } from "react";
// import axios from 'axios';

// const images = [
//   require('../assets/caawiye.jpg'),
//   require('../assets/aqoonkaal.jpg'),
//   require('../assets/durdur.jpg'),
// ];

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT = Dimensions.get('window').height;

// export default function HomeScreen() {

//   const [imgActive, setimgActive] = useState(0);

//   const onchange = (nativeEvent) => {
//     if(nativeEvent) {
//       const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
//       if (slide != imgActive ){
//         setimgActive(slide);
//       }
//     }
//   }

//   const [user, setUser] = useState([]);

//   // Function to load data
//   const getStorage = async () => {
//     try {
//         const jsonValue = await AsyncStorage.getItem('user');
//         if (jsonValue != null) {
//             const userData = JSON.parse(jsonValue);
//             console.log('userdata', userData);
//             setUser(userData);
//         } else {
//           router.push('/welcome/welcome');
//         }
//     } catch (error) {
//         console.error('Error loading data', error);
//     }
//   };


//   const [update, setUpdate] = useState(null);
//   const [values, setValues] = useState({
//     sp: 551,
//     version: 1,
// })
//   const CheckVersion = async () => {
//     try {
//       const res = await axios.post('https://db.al-marwaziuniversity.so/api/save'
// , 
//         values,
//       );
//       setUpdate(res.data.message);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };
//   console.log('val',values)

// console.log('version update',update)

// if( update== 'Not Updated' ){
//   router.push('/update')
// }

//   useEffect(() => {
//     getStorage();
//     CheckVersion();
//   }, []);
//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.container}>
    
              
//         <View style={styles.wrap}>
//           <ScrollView 
//             onScroll={({nativeEvent}) => onchange(nativeEvent)} 
//             showsHorizontalScrollIndicator={false}
//             pagingEnabled
//             horizontal 
//             style={styles.wrap}
//           >
//             {images.map((e, index) => 
//               <Image  
//                 key={index}
//                 resizeMode='stretch'  
//                 style={styles.wrap} 
//                 source={e}
//               />
//             )}
//           </ScrollView>
//           <View style={styles.wrapDot}>
//             {images.map((e, index) =>
//               <Text key={index} style={imgActive === index ? styles.dotActive : styles.dot}>  ⁕  </Text>
//             )}
//           </View>
//         </View>
//         <View style={styles.border}>
//           <View style={styles.row}>
            
//             <View style={styles.imageContainer}>
//               <Pressable onPress={() => router.push('/finance/statement')}>
//                 <Image style={styles.image} source={require('../assets/finances.png')} />
//               </Pressable>
//               <Text style={styles.title}>Finance</Text>
//             </View>
//             <View style={styles.imageContainer}>
//               <Pressable onPress={() => router.push('/examination/semesters')}>
//                 <Image style={styles.image} source={require('../assets/examinations.png')} />
//               </Pressable>
//               <Text style={styles.title}>Examination</Text>
//             </View>
//             <View style={styles.imageContainer}>
//               <Pressable onPress={() => router.push('/attendance/semesters')}>
//                 <Image style={styles.image} source={require('../assets/attendences.png')} />
//               </Pressable>
//               <Text style={styles.title}>Attendance</Text>
//             </View>
//           </View>
//           <View style={styles.row}>
//             <View style={styles.imageContainer}>
//               <Pressable onPress={() => router.push('/timetable/semesters')}>
//                 <Image style={styles.image} source={require('../assets/timetables.png')} />
//               </Pressable>
//               <Text style={styles.title}>Timetable</Text>
//             </View>
            
//             {/* <View style={styles.imageContainer}>
//               <Pressable onPress={() => router.push('/users/complaint')}>
//                 <Image style={styles.image} source={require('../assets/complaints.png')} />
//               </Pressable>
//               <Text style={styles.title}>Complaint</Text>
//             </View>
//             <View style={styles.imageContainer}>
//               <Pressable onPress={() => router.push('/users/notification')}>
//                 <Image style={styles.image} source={require('../assets/notifications.png')} />
//               </Pressable>
//               <Text style={styles.title}>Notification</Text>
//             </View> */}
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#214923',
//   },
//   border: {
//     backgroundColor: '#8bb496',
//     borderRadius: 20,
//     marginTop: 100,
//     // height: 275,
//     // width: 390,
//   },
//   wrap: {
//     width: WIDTH  * 0.95,
//     height: HEIGHT * 0.20,
//     borderRadius: 5,
//     top: 10,
//   },
//   dotActive: {
//     margin: 3,
//     color: 'red',
//   },
//   dot: {
//     margin: 3,
//     color: 'white',
//   },
//   wrapDot: {
//     position: 'absolute',
//     top: 190,
//     flexDirection: 'row',
//     alignSelf: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: -1,
//     marginTop: 22,
//   },
//   imageContainer: {
//     alignItems: 'center',
//     marginHorizontal: 19,
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 10,
//     padding: 7,
//   },
 
//   image: {
//     width: 75,
//     height: 65,
//     marginBottom: 7,
//   },
//   title: {
//     fontSize: 17,
//     textAlign: 'center',
//     fontWeight: 'bold'
//   },
// });
