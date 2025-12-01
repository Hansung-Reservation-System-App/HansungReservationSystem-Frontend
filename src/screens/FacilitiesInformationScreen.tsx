// src/screens/FacilitiesInformationScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function FacilitiesInformationScreen({ facilityId, onNameLoaded }: any) {
  const [facility, setFacility] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadFacilityDetail = async () => {
    try {
      const res = await axios.get(`http://10.0.2.2:8080/api/facilities/${facilityId}`);
      setFacility(res.data.data);

      if (onNameLoaded) {
        onNameLoaded(res.data.data.name);
      }
    } catch (err) {
      console.error("시설 상세 정보 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilityDetail();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#555" />
        <Text style={{ marginTop: 10 }}>불러오는 중...</Text>
      </View>
    );
  }

  if (!facility) {
    return (
      <View style={styles.center}>
        <Text>시설 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* 위치 정보 */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={20} color="#7A6EE6" />
          <Text style={styles.cardTitle}>위치 정보</Text>
        </View>

        <Text style={styles.infoText}>건물 위치</Text>
        <Text style={styles.subText}>{facility.address} {facility.buildingNumber}</Text>

        <Text style={styles.infoText}>운영 시간</Text>
        <Text style={styles.subText}>{facility.operatingHours}</Text>

        <Text style={styles.infoText}>좌석 수</Text>
        <Text style={styles.subText}>{facility.maxCount}석</Text>

        <Text style={styles.infoText}>현재 이용 인원</Text>
        <Text style={styles.subText}>{facility.currentCount}명</Text>

        <Text style={styles.infoText}>혼잡도</Text>
        <Text style={styles.subText}>{facility.congestionLevel}</Text>
      </View>

      {/* 이용 수칙 */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list-circle-outline" size={20} color="#5A7BEF" />
          <Text style={styles.cardTitle}>이용 수칙</Text>
        </View>

        {facility.notice?.split("\n").map((line: string, idx: number) => (
          <Text key={idx} style={styles.ruleText}>
            {idx + 1}. {line.trim()}
          </Text>
        ))}
      </View>

      {/* 주의 사항 */}
      <View style={[styles.card, styles.warningCard]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="alert-circle-outline" size={22} color="#D9534F" />
          <Text style={styles.warningTitle}>주의 사항</Text>
        </View>

        {facility.rules?.split("\n").map((line: string, idx: number) => (
          <Text key={idx} style={styles.warningText}>
            • {line.trim()}
          </Text>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
  },

  infoText: {
    fontWeight: "600",
    marginTop: 8,
  },

  subText: {
    color: "#555",
    marginTop: 4,
  },

  ruleText: {
    marginTop: 6,
    lineHeight: 20,
    color: "#444",
  },

  warningCard: {
    backgroundColor: "#FFECEC",
  },

  warningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
    color: "#D9534F",
  },

  warningText: {
    marginTop: 6,
    color: "#C13B3B",
    fontWeight: "600",
    lineHeight: 20,
  },
});
