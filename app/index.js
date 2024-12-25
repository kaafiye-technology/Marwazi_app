import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

const { width } = Dimensions.get("window"); // Get device width

const Dashboard = () => {
  const [user, setUser] = useState([]);

  // Function to load data
  const getStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        console.log("userdata", userData);
        setUser(userData);
      } else {
        router.push("/welcome/welcome");
      }
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const [update, setUpdate] = useState(null);
  const [values, setValues] = useState({
    sp: 551,
    version: 1,
  });

  const CheckVersion = async () => {
    try {
      const res = await axios.post("https://db.al-marwaziuniversity.so/api/save", values);
      setUpdate(res.data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (update === "Not Updated") {
    router.push("/update");
  }

  useEffect(() => {
    getStorage();
    CheckVersion();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {/* University Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://al-marwaziuniversity.so/uploads/ktc_edit_sp/logo/marwaziunivbersity.png_ktceditsp_20240521065859.png",
          }}
          style={styles.headerImg}
          alt="Logo"
        />
        <Text style={styles.logoText}>بوابة الطالب/ ــة</Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <Pressable
          style={styles.feature}
          onPress={() => router.push("/users/profile")}
        >
          <Icon name="account" size={30} color="#9C27B0" />
          <Text style={styles.featureText}>ملف الطالب</Text>
        </Pressable>
        <Pressable
          style={styles.feature}
          onPress={() => router.push("/timetable/semesters")}
        >
          <Icon name="calendar-outline" size={30} color="#2196F3" />
          <Text style={styles.featureText}>الجدول الدراسي</Text>
        </Pressable>

        <Pressable
          style={styles.feature}
          onPress={() => router.push("/attendance/attendence")}
        >
          <Icon name="check-circle-outline" size={30} color="#9C27B0" />
          <Text style={styles.featureText}>الحضور</Text>
        </Pressable>

        <Pressable
          style={styles.feature}
          onPress={() => router.push("/finance/semesters")}
        >
          <Icon name="cash" size={30} color="#FF9800" />
          <Text style={styles.featureText}>الرسوم المالية</Text>
        </Pressable>

        <Pressable
          style={styles.feature}
          onPress={() => router.push("/examination/semesters")}
        >
          <Icon name="file-document-outline" size={30} color="#4CAF50" />
          <Text style={styles.featureText}>نتائج الإمتحانات</Text>
        </Pressable>

        <Pressable
          style={styles.feature}
          onPress={() => router.push("/evaluation/evaluation")}
        >
          <Icon name="chart-bar" size={30} color="#FF9800" />
          <Text style={styles.featureText}>التقييم</Text>
        </Pressable>

        <Pressable
          style={styles.feature}
          onPress={() => router.push("/complaint/complaint")}
        >
          <Icon name="alert-circle-outline" size={30} color="red" />
          <Text style={styles.featureText}>الشكاوى</Text>
        </Pressable>
        <Pressable
          style={styles.feature}
          onPress={() => router.push("/notification/MessageScreen")}
        >
          <Icon name="bell" size={30} color="#2196F3" />
          <Text style={styles.featureText}>إشعارات</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: "#236b17",
    paddingBottom: 20, // Prevent cutoff on small screens
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: -40,
    marginTop: -20,
  },
  featuresContainer: {
    marginTop: 20,
  },
  feature: {
    flexDirection: "row-reverse", // Reverse the icon and text
    alignItems: "center",
    justifyContent: "space-between", // Align icon and text evenly
    width: width * 0.9, // Make the feature responsive
    alignSelf: "center", // Center features
    backgroundColor: "#FFF",
    padding: 13,
    marginVertical: 6,
    borderRadius: 15,
    elevation: 4,
  },
  featureText: {
    fontSize: 18,
    marginRight: 20, // Adds space between the text and the icon
    color: "#333",
    textAlign: "right", // Right-align the text
    flex: 1, // Make the text take up available space to push it to the right
  },
  headerImg: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 36,
    marginTop: 20, // Add a margin top to push the image down
    borderRadius: 60,
  },
  
});

export default Dashboard;
