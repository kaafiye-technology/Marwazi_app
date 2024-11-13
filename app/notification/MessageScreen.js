import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from "expo-router";

const MessageScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages...');
        const jsonValue = await AsyncStorage.getItem('user');
        console.log('User data:', jsonValue);
        if (jsonValue !== null) {
          const userData = JSON.parse(jsonValue);
          
          const response = await axios.post('https://db.al-marwaziuniversity.so/api/report', {   
            sp: 624,   
            id: userData.result.auto_id,
            type: 'class'
          });
  
          setMessages(response.data.result);
          console.log('Messages:', response.data.result);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
  }, []);

  // Render item in FlatList
  const renderItem = ({ item }) => (
    <Pressable 
      style={styles.messageContainer}
      onPress={() => router.push(`/notification/NotificationDetail?id=${item.id}&title=${encodeURIComponent(item.title)}&description=${encodeURIComponent(item.description)}`)}
    >
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={45} color="gray" />
        {item.unread && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.name, item.unread && styles.bold]}>{item.title}</Text>
          <Text style={styles.time}>{item.time_label}</Text>
        </View>
        <Text style={styles.messageText} numberOfLines={1}>{item.description}</Text>
      </View>
    </Pressable>
  );
  
  return ( 
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    left: 30,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default MessageScreen;
