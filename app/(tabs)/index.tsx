import { FontAwesome } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import index_all from './index_all';
import index_follow from './index_follow';

const Tab = createMaterialTopTabNavigator();

// NoteCard 组件
export default function HomeScreen() {
  return (
    <ScrollView className="bg-[#fbf9fa]">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14 },
            tabBarItemStyle: { width: 60, marginBottom: 0 },
            tabBarStyle: {
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              elevation: 0, // 移除Android上的阴影
              shadowOpacity: 0, // 移除iOS上的阴影
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#F26371',
              width: 30,
              position: 'absolute',
              bottom: 0,
              left: '37.8%',
            },
          }}>
          <Tab.Screen name="index_all" component={index_all} options={{ title: '发现' }}/>
          <Tab.Screen name="index_follow" component={index_follow} options={{ title: '关注' }} />
        </Tab.Navigator>
        <Link href="/search" className="absolute top-3 right-3 z-10">
          <FontAwesome size={20} name="search" color="#c1c1c1" />
        </Link>
      </SafeAreaView>
    </ScrollView>
  );
}
