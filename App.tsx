import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Dashboard from './screens/Dashboard';
// import Schedule from './screens/Schedule';
// import Revision from './screens/Revision';
// import ChatAI from './screens/ChatAI';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp} from '@react-navigation/native';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';
import Dashboard from './screens/dasboard';
import Schedule from './screens/schedule';
import ChatScreen from './screens/chat';
import Revision from './screens/revision';

type RootTabParamList = {
  Dashboard: undefined;
  Planning: undefined;
  Tâches: undefined;
  Assistant: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}): BottomTabNavigationOptions => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName: string = '';

            if (route.name === 'Dashboard')
              iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Planning')
              iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'Tâches')
              iconName = focused ? 'book' : 'book-outline';
            else if (route.name === 'Assistant')
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2f95dc',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Planning" component={Schedule} />
        <Tab.Screen name="Tâches" component={Revision} />
        <Tab.Screen name="Assistant" component={ChatScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
