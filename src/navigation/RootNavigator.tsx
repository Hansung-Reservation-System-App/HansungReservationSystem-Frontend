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

  // userId 제거: AsyncStorage에서 관리
  Home: undefined;

  // Reservation에서는 facilityId만 넘기기
  Reservation: { facilityId: string };

  // 마이페이지도 userId 필요 없음
  MyPage: undefined;

  // 필요하다면 좌석 예약도 userId 제거 가능
  SeatReservationScreen: {
    facilityId: string;
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

      {/* userId 필요 없음 */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* facilityId만 넘긴다 */}
      <Stack.Screen name="Reservation" component={ReservationHomeScreen} />

      {/* userId 필요 없음 */}
      <Stack.Screen name="MyPage" component={MyPageScreen} />
    </Stack.Navigator>
  );
}
