import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import PasswordRecoveryScreen from '../screens/PasswordRecoveryScreen';
import ReservationHomeScreen from "../screens/ReservationHomeScreen";
import MyPageScreen from "../screens/MyPageScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  PasswordRecovery: undefined;
  Home: { userId: string };
  Reservation: { facilityId: string; userId: string };
  MyPage: { userId: string };
  SeatReservationScreen: {
    facilityId: string;
    userId: string;
    facilityName: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Reservation" component={ReservationHomeScreen} />
      <Stack.Screen name="MyPage" component={MyPageScreen} />
    </Stack.Navigator>
  );
}
