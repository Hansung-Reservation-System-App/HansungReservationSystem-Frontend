import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function FacilityHeader({ title, onBack }: any) {
  return (
    <LinearGradient
      colors={["#A36CF7", "#FF6FB5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      {/*  뒤로가기 */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
      </TouchableOpacity>

      {/* 중앙 제목 */}
      <Text style={styles.title}>제목</Text>

      {/* 오른쪽 공간(정렬 맞추기용) */}
      <View style={styles.rightSpace} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",       //  화면 전체 폭
    height: 65,          // 피그마 스타일에 맞춰 약간 크게
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,           // 좌우 균형 맞추기
    justifyContent: "center",
  },
  rightSpace: {
    width: 40,           // 가운데 정렬
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
