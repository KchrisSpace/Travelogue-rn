import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { SafeAreaView, ScrollView ,Text} from 'react-native';
import IndexAll from './index_all';
import IndexFollow from './index_follow';

const Tab = createMaterialTopTabNavigator();

// NoteCard 组件
const MainView: React.FC = () => {
  return (
    <SafeAreaView className="bg-[#fbf9fa]">
      <ScrollView>
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: {
              backgroundColor: '#F26371',
            },
          }}>
          <Tab.Screen name="发现" component={IndexAll} />
          <Tab.Screen name="关注" component={IndexFollow} />
        </Tab.Navigator>
      </ScrollView>
      <Text>123</Text>
    </SafeAreaView>
  );
};

export default MainView;
