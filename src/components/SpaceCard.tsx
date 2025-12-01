import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@react-native-vector-icons/feather";
import Colors from "../constants/Colors";

interface SpaceCardProps {
  title: string;
  time: string;
  category: string;
  current: number;     // 현재 인원
  max: number;         // 최대 인원
  image: any;
  onPress?: () => void;
}

// 혼잡도 자동 계산 (current / max)
const calcStatus = (current: number, max: number) => {
  const ratio = current / max;

  if (ratio <= 0.3) return "여유";
  if (ratio <= 0.7) return "보통";
  return "혼잡";
};

// 기존 색상 및 flex 값 유지
const getBarInfo = (status: string) => {
  switch (status) {
    case "여유":
      return { color: "#4CAF50" }; // 초록
    case "보통":
      return { color: "#FFC107" }; // 노랑
    case "혼잡":
      return { color: "#F44336" }; // 빨강
    default:
      return { color: "#4CAF50" };
  }
};

export default function SpaceCard({
  title,
  time,
  category,
  current,
  max,
  image,
  onPress,
}: SpaceCardProps) {
  // 자동 혼잡도 계산
  const status = calcStatus(current, max);

  // 게이지 길이 = 실제 비율
  const barFlex = Math.min(current / max, 1);

  // 색 정보 (기존 유지)
  const bar = getBarInfo(status);

  return (
    <View style={styles.card}>
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      {/* 타이틀 / 시간 */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.time}>{time}</Text>

      {/* 혼잡도 텍스트 */}
      <View style={styles.congestionRow}>
        <Text style={styles.congestionLabel}>혼잡도</Text>
        <Text style={styles.congestionValue}>{status}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { flex: barFlex, backgroundColor: bar.color },
          ]}
        />
        <View style={{ flex: 1 - barFlex }} />
      </View>

      {/* 예약 버튼 */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>예약하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 110,
  },
  imagePlaceholder: {
    width: "100%",
    height: 110,
    backgroundColor: "#eaeaea",
  },
  title: { fontSize: 14, fontWeight: "bold", marginTop: 8, paddingHorizontal: 12 },
  time: { color: Colors.textGray, paddingHorizontal: 12, marginTop: 3, fontSize: 12 },

  congestionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: 6,
  },
  congestionLabel: { color: Colors.textGray, fontSize: 12 },
  congestionValue: { color: Colors.primary, fontSize: 12 },

  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    marginHorizontal: 12,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 6,
    flexDirection: "row",
  },
  progressFill: {
    height: "100%",
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    marginHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 13 },
});
