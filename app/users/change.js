import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, TextInput } from "react-native";
import { Button } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function ChangePassword() {
    const [msg, setMsg] = useState([]);
    const [values, setValues] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [error, setError] = useState(null);
    const url = 'https://db.al-marwaziuniversity.so/api/report'

    const handleSave = async () => {
     
    
        try {
            const jsonValue = await AsyncStorage.getItem('user');
            if (jsonValue != null) {
                const userData = JSON.parse(jsonValue);
                const payload = {
                    sp: 625,
                    auto_id: userData.result.auto_id,
                    ...values,
                };

                // Debugging log
                console.log("Fetching Semesters with payload:", payload);

                const response = await axios.post(url, payload);
                const result = response.data.result;
                setMsg(result[0].msg);
                console.log('change:',result[0].msg)
            }
        } catch (err) {
            console.log('Error:', err);
        }
    };
    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#236b17'}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={{uri: 'https://al-marwaziuniversity.so/uploads/ktc_edit_sp/logo/marwaziunivbersity.png_ktceditsp_20240521065859.png' }} style={styles.headerImg} alt='Logo' />
                    <Text style={styles.title}>تغيير كلمة المرور</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.input}> 
                        <Text style={styles.inputLabel}>Old Password</Text>
                        <TextInput
                            style={styles.inputControl}
                            secureTextEntry
                            placeholder="********"
                            placeholderTextColor="#6b7280"
                            onChangeText={(val) => setValues({...values, old_password : val})}
                        />
                    </View>
                    
                    <View style={styles.input}> 
                        <Text style={styles.inputLabel}>New Password</Text>
                        <TextInput
                            style={styles.inputControl}
                            secureTextEntry
                            placeholder="********"
                            placeholderTextColor="#6b7280"
                            onChangeText={(val) => setValues({...values, new_password : val})}
                        />
                    </View>
                    
                    <View style={styles.input}> 
                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <TextInput
                            style={styles.inputControl}
                            secureTextEntry
                            placeholder="********"
                            placeholderTextColor="#6b7280"
                            onChangeText={(val) => setValues({...values, confirm_password : val})}
                        />
                    </View>

                    {msg && <Text style={styles.error}>{msg}</Text>}

                    <View style={styles.formAction}>
                        <Button title="Save" buttonStyle={styles.btn} onPress={handleSave} />
                    </View>
                </View>
            </View>
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
        backgroundColor: '#FF8C00',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    error: {
        paddingVertical: 7,
        textAlign: 'center',
        marginTop: 1,
        borderRadius: 12,
        color: '#FF8C00',
        fontSize: 20,
        fontWeight: 'bold'
    },
});
