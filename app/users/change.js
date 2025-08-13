import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Button } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePassword() {
  const [msg, setMsg] = useState([]);
  const [values, setValues] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [error, setError] = useState(null);
  const url = 'https://mis.psu.edu.so/api/report'

  const handleSave = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        const payload = {
          sp: 624,
          auto_id: userData.result.auto_id,
          ...values,
        };

        console.log("Change password payload:", payload);
        const response = await axios.post(url, payload);
        const result = response.data.result;
        setMsg(result[0].msg);
        console.log('change:', result[0].msg);
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#44b4d4' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
            <Image source={{uri: 'https://mis.psu.edu.so/uploads/ktc_edit_sp/logo/logopsu.png_ktceditsp_20240924070249.png' }} style={styles.headerImg} alt='Logo' />

              <Text style={styles.title}>Change Password</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Old Password</Text>
                <TextInput
                  style={styles.inputControl}
                  secureTextEntry
                  placeholder="********"
                  placeholderTextColor="#6b7280"
                  onChangeText={(val) => setValues({ ...values, old_password: val })}
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.inputControl}
                  secureTextEntry
                  placeholder="********"
                  placeholderTextColor="#6b7280"
                  onChangeText={(val) => setValues({ ...values, new_password: val })}
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.inputControl}
                  secureTextEntry
                  placeholder="********"
                  placeholderTextColor="#6b7280"
                  onChangeText={(val) => setValues({ ...values, confirm_password: val })}
                />
              </View>

              {msg ? <Text style={styles.error}>{msg}</Text> : null}

              <View style={styles.formAction}>
                <Button title="Save" buttonStyle={styles.btn} onPress={handleSave} />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginVertical: 36,
  },
  headerImg: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 36,
    borderRadius: 60,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  form: {
    marginBottom: 24,
    flex: 1,
  },
  formAction: {
    marginVertical: 24,
  },
  btn: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  error: {
    paddingVertical: 7,
    textAlign: 'center',
    marginTop: 1,
    borderRadius: 12,
    color: '#0a0a0a',
    fontSize: 20,
    fontWeight: 'bold'
  },
});
