// src/components/SpaceCard.tsx

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// feather는 사용하지 않아서 제거해도 됩니다.
import Colors from "../constants/Colors";

interface SpaceCardProps {
  title: string;
  time: string;
  category: string;
  current: number;
  max: number;
  image: any;
  onPress?: () => void;
  availableReservation: boolean; // true: 예약 가능 / false: 예약 불가(정보보기)
}

// 혼잡도 자동 계산 (current / max)
const calcStatus = (current: number, max: number) => {
  const ratio = current / max || 0; // 0으로 나누기 방지

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
  current,
  max,
  image,
  onPress,
  availableReservation,
}: SpaceCardProps) {
  // 자동 혼잡도 계산
  const status = calcStatus(current, max);

  // 게이지 길이 = 실제 비율 (NaN 방지)
  const ratio = current / max || 0;
  const barFlex = Math.min(ratio, 1);

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
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.time} numberOfLines={1}>{time}</Text>

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
        {/* flex가 0일때 오류 방지를 위해 최소값 처리 혹은 조건부 렌더링이 좋으나 간단히 처리 */}
        <View style={{ flex: Math.max(0, 1 - barFlex) }} />
      </View>

      {/* 🔥🔥🔥 버튼 영역 수정됨 🔥🔥🔥 */}
      {/* 기존 조건부 렌더링({availableReservation && ...})을 제거하고 항상 버튼을 표시합니다. */}
      <TouchableOpacity
        // availableReservation이 false면 infoButton 스타일을 추가로 적용 (회색 배경)
        style={[styles.button, !availableReservation && styles.infoButton]}
        onPress={onPress} // 어떤 버튼이든 누르면 상세 화면으로 이동
        activeOpacity={0.8}
      >
        <Text
          // availableReservation이 false면 infoButtonText 스타일을 추가로 적용 (진한 회색 글씨)
          style={[styles.buttonText, !availableReservation && styles.infoButtonText]}
        >
          {/* 텍스트 내용을 조건에 따라 변경 */}
          {availableReservation ? "예약하기" : "정보 보기"}
        </Text>
      </TouchableOpacity>
       {/* 🔥🔥🔥 버튼 영역 수정 끝 🔥🔥🔥 */}

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
    // 카드 하단에 약간의 여백 추가 (버튼이 너무 딱 붙지 않게)
    paddingBottom: 12,
  },
  image: {
    width: "100%",
    height: 110,
    backgroundColor: "#eaeaea", // 이미지 로딩 전 배경색
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
  congestionValue: { color: Colors.primary, fontSize: 12, fontWeight: 'bold' },

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

  // --- 버튼 스타일 수정 ---

  // 기본 버튼 스타일 (예약하기 - 핑크색)
  button: {
    backgroundColor: Colors.primary, // 기본 핑크색
    paddingVertical: 10, // 터치 영역을 위해 조금 늘림
    marginHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center', // 텍스트 중앙 정렬
    justifyContent: 'center',
  },
  // 기본 버튼 텍스트 (흰색)
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14, // 폰트 사이즈 약간 키움
  },

// styles 객체 내부

  // 정보 보기 버튼 스타일 (배경: 아주 연한 쿨 그레이)
  infoButton: {
    backgroundColor: "#EFF0F4", // 기존보다 더 밝고 깨끗한 회색
  },
  
  // 정보 보기 텍스트 스타일 (글씨: 진한 쥐색)
  infoButtonText: {
    color: "#6B7684", // 완전 검정이 아닌, 세련된 차콜 그레이
    fontWeight: "700", // 두께감 유지
    fontSize: 14,
  },
});