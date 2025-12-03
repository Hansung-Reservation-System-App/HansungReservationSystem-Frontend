// src/screens/HomeScreen.tsx

import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, TextInput, FlatList, Text, ActivityIndicator } from "react-native";
import HomeHeader from "../components/HomeHeader";
import SpaceCard from "../components/SpaceCard";
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }: any) {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 AsyncStorage에서 불러온 userId (route.params 버림)
  const [userId, setUserId] = useState<string | null>(null);

  // -------------------------------------------------------
  // 🔹 AsyncStorage에서 userId 불러오기 (앱 처음 + 뒤로가기 시 재실행)
  // -------------------------------------------------------
  const loadUserId = async () => {
    const stored = await AsyncStorage.getItem("userId");
    if (stored) {
      setUserId(stored);
    }
  };

  useEffect(() => {
    loadUserId(); // 앱 최초 실행 시 userId 불러오기
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserId(); // 뒤로가기 후 홈에 돌아오면 userId 재로드
    }, [])
  );

  // -------------------------------------------------------
  // 🔹 시설 목록 불러오기 (상세 정보 포함)
  // -------------------------------------------------------
  const loadFacilities = async () => {
    try {
      const res = await axios.get("http://10.0.2.2:8080/api/facilities");
      const list = res.data.data;

      // 각 시설 상세정보까지 요청
      const facilitiesWithDetail = await Promise.all(
        list.map(async (item: any) => {
          const detailRes = await axios.get(
            `http://10.0.2.2:8080/api/facilities/${item.id}`
          );
          const detail = detailRes.data.data;

          return {
            id: item.id,
            title: item.name,
            time: item.operatingHours,
            category: "시설",
            current: detail.currentCount,
            max: detail.maxCount,
            image: item.imageUrl ? { uri: item.imageUrl } : null,
            availableReservation: detail.availableReservation,
          };
        })
      );

      // 예약 가능한 시설이 위로 오게 정렬
      const sortedFacilities = facilitiesWithDetail.sort(
        (a, b) => b.availableReservation - a.availableReservation
      );

      setSpaces(sortedFacilities);
    } catch (error) {
      console.error("시설 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 최초 실행
  useEffect(() => {
    loadFacilities();
  }, []);

  // 뒤로가기 등으로 화면 포커스되면 다시 불러오기
  useFocusEffect(
    useCallback(() => {
      loadFacilities();
    }, [])
  );

  // -------------------------------------------------------
  // 🔹 화면 렌더링
  // -------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 내 정보 표시 헤더 */}
      <HomeHeader />

      {/* 검색창 */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="다른 공간을 찾아보시나요?"
          style={styles.searchInput}
        />
      </View>

      <View style={{ height: 12 }} />

      {/* 로딩 화면 */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 10, color: Colors.textGray }}>불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={spaces}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 40,
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SpaceCard
              {...item}
              availableReservation={item.availableReservation}
              onPress={() =>
                navigation.navigate("Reservation", {
                  facilityId: item.id,
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginTop: 10,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 15,
    flex: 1,
  },
});
