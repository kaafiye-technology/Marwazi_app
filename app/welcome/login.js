import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Using MaterialCommunityIcons

export default function Login() {
    const url = 'https://db.al-marwaziuniversity.so/api/report'
  const [values, setValues] = useState({
    sp: 515,
    username: "",
    password: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem("user");
      console.log("User data removed");
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, values);
      if (response.data.result.length == 0) {
        setError("ID-ga iyo Password-ka waa qalad");
      } else {
        setData(response.data.result);
        const result = response.data.result[0];
        try {
          await AsyncStorage.setItem("user", JSON.stringify({ result }));
        } catch (error) {
          console.error("Error saving data", error);
        }
        router.push("/");
      }

      console.log("url:", url, "values:", values, "response:", response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("values:", values, "data:", data);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#236b17" }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://al-marwaziuniversity.so/uploads/ktc_edit_sp/logo/marwaziunivbersity.png_ktceditsp_20240521065859.png",
            }}
            style={styles.headerImg}
            alt="Logo"
          />
          <Text style={styles.title}>مرحبا بكم في برنامج تيسير</Text>
        </View>

        <View style={styles.form}>
          {/* Student ID */}
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Student ID</Text>
            <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputControl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="Gali Student ID"
              placeholderTextColor="#6b7280"
              onChangeText={(val) => setValues({ ...values, username: val })}
            />
          </View>
          </View>

          {/* Password Field */}
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputControl}
                secureTextEntry={!showPassword}
                placeholder="Gali password-kada"
                placeholderTextColor="#6b7280"
                onChangeText={(val) => setValues({ ...values, password: val })}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <View style={styles.formAction}>
            <Button
              title="تسجيل الدخول"
              buttonStyle={styles.btn}
              onPress={handleLogin}
            />
            {error && <Text style={styles.error}>Error: {error}</Text>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginVertical: 36,
  },
  headerImg: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 36,
    borderRadius: 60,
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
    color: "white",
  },
  input: {
    marginBottom: 16,

  },
  input1: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    color: "white",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
  },
  inputControl: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  form: {
    marginBottom: 24,
    flex: 1,
  },
  formAction: {
    marginVertical: 24,
  },
  btn: {
    backgroundColor: "#075eec",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF8C00",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF8C00",
  },
  error: {
    paddingVertical: 7,
    textAlign: "center",
    marginTop: 1,
    borderRadius: 12,
    color: "red",
    fontWeight: "700",
  },
});
