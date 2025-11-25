import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function FacilitiesInformationScreen({ facility }:any) {
  return (
    <ScrollView style={styles.container}>
      
      {/* 위치 정보 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>위치 정보</Text>

        <Text style={styles.infoText}>건물 위치</Text>
        <Text style={styles.subText}>한성대학교 상상관 3층</Text>

        <Text style={styles.infoText}>연락처</Text>
        <Text style={styles.subText}>02-760-4114</Text>

        <Text style={styles.infoText}>운영 시간</Text>
        <Text style={styles.subText}>평일 09:00 - 22:00, 주말 09:00 - 18:00</Text>

        <Text style={styles.infoText}>좌석 수</Text>
        <Text style={styles.subText}>총 60석</Text>
      </View>

      {/* 이용 수칙 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>이용 수칙</Text>
        <Text style={styles.rule}>· 좌석은 1인 1좌석만 예약 가능합니다.</Text>
        <Text style={styles.rule}>· 예약 시간 10분 이내 미입실 시 자동 취소됩니다.</Text>
        <Text style={styles.rule}>· 음료 외 음식물 반입 금지입니다.</Text>
        <Text style={styles.rule}>· 퇴실 시 주변 정리 정돈 부탁드립니다.</Text>
      </View>

      {/* 주의 사항 */}
      <View style={[styles.card, styles.warningCard]}>
        <Text style={[styles.cardTitle, { color: "#D9534F" }]}>
          주의사항
        </Text>
        <Text style={styles.warningText}>
          무단 퇴실 시 추후 이용이 제한될 수 있습니다. 다른 이용자를 배려하는 마음으로 이용 부탁드립니다.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },

  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  infoText: { fontWeight: "600", marginTop: 8 },
  subText: { color: "#555", marginTop: 4 },

  rule: { color: "#555", marginVertical: 4 },

  warningCard: { backgroundColor: "#FFE5E5" },
  warningText: { color: "#D9534F", marginTop: 5 },
});
