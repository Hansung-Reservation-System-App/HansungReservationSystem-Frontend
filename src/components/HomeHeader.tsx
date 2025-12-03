import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Feather from "@react-native-vector-icons/feather";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type HomeHeaderProps = {
  userId: string;
};

export default function HomeHeader({ userId }: any) {
  const navigation = useNavigation<NavigationProp>();

  // user 아이콘 클릭 시 MyPage로 이동하는 함수
  const goToMyPage = () => {
    navigation.navigate("MyPage"); // MyPageScreen으로 바로 이동
  };
  return (
    <LinearGradient
      colors={["#FF3E8A", "#FF507E", "#FF6880"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.iconLeft}>
        <Feather name="home" size={22} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>한성대학교</Text>

      <TouchableOpacity style={styles.iconRight} onPress={goToMyPage}>
        <Feather name="user" size={22} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  iconLeft: { width: 30 },
  iconRight: { width: 30, alignItems: "flex-end" },
});
