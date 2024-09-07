import { Stack } from 'expo-router';

const AppLayout = () => {
  
  return (
    <Stack>
       
       <Stack.Screen name="index" options={{headerTitle: "Dashboard",headerBackVisible: false, headerShown: false}} />
        <Stack.Screen name="users/profile" options={{headerTitle: "Profile"}} />
       <Stack.Screen name="users/notification" options={{headerTitle: "Notification"}} />
       <Stack.Screen name="users/complaint" options={{headerTitle: "Complaint"}} />
       <Stack.Screen name="users/intro" options={{headerShown: "false"}} />



       <Stack.Screen name="finance/balance" options={{headerTitle: "Balance"}} />


       <Stack.Screen name="examination/semesters" options={{headerTitle: "Semesters"}} />
       <Stack.Screen name="examination/marks" options={{headerTitle: "Marks"}} />
       <Stack.Screen name="finance/statement" options={{headerTitle: "Statement"}} />
       <Stack.Screen name="timetable/semesters" options={{headerTitle: "Semesters"}} />
       <Stack.Screen name="attendance/semesters" options={{headerTitle: "Semesters"}} />
       <Stack.Screen name="timetable/timetable" options={{headerTitle: "Timetable"}} />
       <Stack.Screen name="attendance/courseAttendace" options={{headerTitle: "Attendace"}} />

       <Stack.Screen name="login" options={{headerTitle: "aa", headerBackVisible: false, headerShown: false}} />
       <Stack.Screen name="welcome" options={{headerTitle: "aa", headerBackVisible: false, headerShown: false}} />

       

    </Stack>
  );
};

export default AppLayout;