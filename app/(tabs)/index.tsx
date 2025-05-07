import { StyleSheet, View } from "react-native";

import { FontAwesome } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import index_all from './index_all';
import index_follow from './index_follow';

const Tab = createMaterialTopTabNavigator();

// NoteCard 组件
export default function HomeScreen() {
  return (
    <ScrollView className="bg-[#fbf9fa]">
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
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#F26371',
              width: 30,
              position: 'absolute',
              bottom: 0,
              left: '37.8%',
            },
          }}>
          <Tab.Screen name="发现" component={index_all} />
          <Tab.Screen name="关注" component={index_follow} />
        </Tab.Navigator>
        <Link href="/search" className="absolute top-3 right-3 z-10">
          <FontAwesome size={20} name="search" color="#c1c1c1" />
        </Link>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
