import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const NotificationDetail = () => {
  const { id, title: paramTitle, description: paramDescription } = useLocalSearchParams();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMessageDetail = async () => {
      try {
        if (!paramTitle || !paramDescription) { // Only fetch if params are not provided
          console.log("Fetching message details for ID:", id);
          const response = await axios.get(`https://db.al-marwaziuniversity.so/api/report/${id}`);
          console.log("Response Status:", response.status);
          console.log("Response Data:", response.data);

          setMessage(response.data);
        } else {
          // Use provided parameters
          setMessage({ title: paramTitle, description: paramDescription });
        }
      } catch (error) {
        console.error('Error fetching message details:', error);
      }
    };

    if (id) fetchMessageDetail();
  }, [id, paramTitle, paramDescription]);

  if (!message) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{message.title}</Text>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          <Text style={styles.boldText}>WARGALIN:</Text>{"\n"}
          {message.description || "No description available."}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  messageContainer: {
    padding: 16,
    backgroundColor: '#EDEDED',
    borderRadius: 12,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default NotificationDetail;
