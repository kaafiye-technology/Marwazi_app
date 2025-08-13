import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="login"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
