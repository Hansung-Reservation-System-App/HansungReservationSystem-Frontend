import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@react-native-vector-icons/feather";
import Colors from "../constants/Colors";

interface SpaceCardProps {
  title: string;
  time: string;
  category: string;
  status: string; // 여유 / 보통 / 혼잡
  image: any;
}

// 퍼센트 대신 실제 bar 비율을 number로 설정
const getBarInfo = (status: string) => {
  switch (status) {
    case "여유":
      return { flex: 0.3, color: "#4CAF50" }; // 초록
    case "보통":
      return { flex: 0.6, color: "#FFC107" }; // 노랑
    case "혼잡":
      return { flex: 0.9, color: "#F44336" }; // 빨강
    default:
      return { flex: 0.3, color: "#4CAF50" };
  }
};

export default function SpaceCard({
  title,
  time,
  category,
  status,
  image,
}: SpaceCardProps) {
  const bar = getBarInfo(status);

  return (
    <View style={styles.card}>
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      <TouchableOpacity style={styles.likeIcon}>
        <Feather name="heart" size={20} color={Colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.time}>{time}</Text>

      <View style={styles.congestionRow}>
        <Text style={styles.congestionLabel}>혼잡도</Text>
        <Text style={styles.congestionValue}>{status}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { flex: bar.flex, backgroundColor: bar.color }]} />
        <View style={{ flex: 1 - bar.flex }} />
      </View>

      <TouchableOpacity style={styles.button}>
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
  likeIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
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
