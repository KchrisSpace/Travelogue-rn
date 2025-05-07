import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { SafeAreaView, ScrollView ,Text} from 'react-native';
import index_all from './index_all';
import index_follow from './index_follow';

const Tab = createMaterialTopTabNavigator();

// NoteCard 组件
export default function HomeScreen() {
  return (
    <ScrollView className="bg-[#fbf9fa]">
      <SafeAreaView >
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: {
              backgroundColor: '#F26371',
            },
          }}>
          <Tab.Screen name="发现" component={index_all} />
          <Tab.Screen name="关注" component={index_follow} />
        </Tab.Navigator>
      </SafeAreaView>
    </ScrollView>
  );
};


