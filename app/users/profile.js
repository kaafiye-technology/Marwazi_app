
import React, {useState, useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
const ProfileScreen = () => {


  const url = 'https://db.al-marwaziuniversity.so/api/report'
   
    const [user, setUser] = useState([]);
  
    
    const fetchProfile = async () => {
        
        try {
            const jsonValue = await AsyncStorage.getItem('user');
        if (jsonValue != null) {
            const userData = JSON.parse(jsonValue);
            const values = {
                sp: 537,
                std_id: userData.result.auto_id
            }

            const response = await axios.post(url,values);

            const result = response.data.result[0];
                setUser(result);
                console.log('yes:',  response.data.result);

            
        }
            

           
        } catch (err) {
            setError(err.message);
        } finally {
          //  setLoading(false);
        }
    };

    useEffect(()=>{
        fetchProfile();
    },[])
    


    console.log('user:', user);
  return (
    <ScrollView>
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
      <Image
  source={{
    uri: user?.image || 'https://al-marwaziuniversity.so/uploads/ktc_edit_sp/logo/marwaziunivbersity.png_ktceditsp_20240521065859.png', // Fallback to placeholder if user.image is null
  }}
  style={styles.profileImage}
/>

      </View>

      {/* User Name */}
      <Text style={styles.userName}>{user?.name}</Text>

      {/* Student and Hemis IDs */}
      <View style={styles.idContainer}>
        <View style={styles.idBox}>
        <MaterialCommunityIcons name="card-account-details" size={30} color="#4CAF50" style={styles.icon}/>
          <Text style={styles.idTitle}>{user?.auto_id}</Text>
          <Text style={styles.idSubtitle}>رقم الطالب / ــة</Text>
        </View>
        <View style={styles.idBox}>
        <MaterialCommunityIcons name="card-account-details-outline" size={30} color="#4CAF50" style={styles.icon}/>
          <Text style={styles.idTitle}>{user?.id}</Text>
          <Text style={styles.idSubtitle}>رقم ( Hemis)</Text>
        </View>
      </View>

      {/* Additional Info: Class, Semester, Status */}
      <View style={styles.infoContainer}>
                 <View>

       <Text style={styles.infoText3}>الفصل</Text>
        <Text style={styles.infoSubText}>{user?.class}</Text>
        </View>

                 <View>

        <Text style={styles.infoText}>المستوى</Text>
        <Text style={styles.infoSubText1}>{user?.semester}</Text>
        </View>
         <View>
        <Text style={styles.infoText}>الحالة</Text>
         <Text style={styles.infoSubText2}>{user?.status}</Text>
</View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/welcome/login')}>
        <Text style={styles.logoutButtonText}>تسجيل خروج</Text>
      </TouchableOpacity>
       {/* Change Button */}
       <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/users/change')}>
        <Text style={styles.logoutButtonText}>تغيير كلمة المرور</Text>
      </TouchableOpacity>

      {/* Academic Information */}
      <View style={styles.academicInfoContainer}>
         <View style={styles.line}></View>
        <Text style={styles.academicInfoHeader}>معلومات الطالب / ــة</Text>
         <Text style={styles.infoText2}>كمبس</Text>
        <Text style={styles.infoSubText3}>{user?.campus}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>الكلية</Text>
        <Text style={styles.infoSubText3}>{user?.faculty}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>القسم</Text>
        <Text style={styles.infoSubText3}>{user?.department}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>الدوام</Text>
        <Text style={styles.infoSubText3}>{user?.shift}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>الجنس</Text>
        <Text style={styles.infoSubText3}>{user?.gender}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>تاريخ الميلاد</Text>
        <Text style={styles.infoSubText3}>{user?.dob}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>مكان الميلاد</Text>
        <Text style={styles.infoSubText3}>{user?.pob}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>اسم الأم</Text>
        <Text style={styles.infoSubText3}>{user?.mother}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>إسم الولي</Text>
        <Text style={styles.infoSubText3}>{user?.contact_name}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>رقم الولي</Text>
        <Text style={styles.infoSubText3}>{user?.contact_tell}</Text>
        <View style={styles.academicInfoContainer1}/>
        <Text style={styles.infoText2}>فصيلة الدم</Text>
        <Text style={styles.infoSubText3}>{user?.blood_group}</Text>
        <View style={styles.academicInfoContainer1}/>

      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    marginTop: 20,
    marginBottom: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  icon:{
    marginLeft:85,
    position: 'absolute',
    Top:40
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  idContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '87%',
    marginBottom: 20,           
  },
  idBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 15,
    borderWidth: 1,
     borderColor:'#9aacae',
  },
  icon: {
    marginBottom: 10,  // Adds spacing between the icon and the text
    marginLeft: 60
  },
  idTitle: {
    position: 'absolute',
    marginTop: 15,
    left: 10,
    fontSize: 16,
    fontWeight: 'bold', // Changed fontWeight to 'bold'
    color: '#343434',
  },
  idSubtitle: {
    paddingTop: 5, // Adjust spacing between title and subtitle
    fontSize: 12,
    color: "#236b17",
    fontWeight: 'bold', // Changed fontWeight to 'bold'

  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginLeft:8

  },
  infoText: {
    fontSize: 16,
    marginLeft:8

  },
  infoText3: {
    fontSize: 16,
    marginRight:20

  },
  
  infoSubText: {
    fontSize: 12,
    color: "#236b17",


  },
  infoSubText1: {
    fontSize: 12,
    marginLeft:35,
    color: "#236b17",

  },
  infoSubText2: {
    fontSize: 12,
    marginLeft:8,
    color: "#236b17",

    
  },
  infoSubText3: {
    fontSize: 15,
    textAlign: 'right'

  },
  
  infoText2: {
    fontSize: 15,
    marginTop:20,
    color: "#236b17",
   fontWeight: 'bold',
   textAlign: 'right'

  },
  logoutButton: {
    marginBottom: 30,
    backgroundColor: '#236b17',
    borderRadius: 15,
     flexDirection: 'row',
       alignItems: 'center',
   justifyContent:'center',
    paddingVertical: 7,
      paddingHorizontal: 120,
       
  },
  
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  academicInfoContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
  },
  academicInfoContainer1: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 10,
      },
  academicInfoHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    marginTop: 18,
    color: "#FF9800",
    textAlign: 'right', // Align text content to the right
    right: 5,           // Position the element on the right side of the container    

  },
  academicInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

export default ProfileScreen;
