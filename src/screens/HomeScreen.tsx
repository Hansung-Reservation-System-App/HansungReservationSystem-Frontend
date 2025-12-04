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
  const [userId, setUserId] = useState<string | null>(null);

  // 검색어 상태 관리
  const [searchText, setSearchText] = useState("");

  const loadUserId = async () => {
    const stored = await AsyncStorage.getItem("userId");
    if (stored) {
      setUserId(stored);
    }
  };

  useEffect(() => {
    loadUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserId();
    }, [])
  );

  const loadFacilities = async () => {
    try {
      const res = await axios.get("http://10.0.2.2:8080/api/facilities");
      const list = res.data.data;

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

      const sortedFacilities = facilitiesWithDetail.sort(
        (a, b) => Number(b.availableReservation) - Number(a.availableReservation)
      );

      setSpaces(sortedFacilities);
    } catch (error) {
      console.error("시설 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFacilities();
    }, [])
  );

  // 검색 로직 (제목에 검색어가 포함된 것만 필터링)
  const filteredSpaces = spaces.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />

      {/* 검색창 */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="다른 공간을 찾아보시나요?"
          style={styles.searchInput}
          // 🔥 [추가 3] 입력값 바인딩 및 업데이트 함수 연결
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholderTextColor="#999" // 힌트 텍스트 색상
          returnKeyType="search" // 키보드 엔터 키를 '검색' 모양으로 변경
        />
      </View>

      <View style={{ height: 12 }} />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 10, color: Colors.textGray }}>불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          //  원본 데이터(spaces) 대신 필터링된 데이터(filteredSpaces) 사용
          data={filteredSpaces}
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
          // 검색 결과가 없을 때 보여줄 화면 (선택 사항)
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text style={{ color: Colors.textGray }}>검색 결과가 없습니다.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <SpaceCard
              {...item}
              availableReservation={item.availableReservation}
              onPress={() =>
                navigation.navigate("Reservation", {
                  facilityId: item.id,
                  availableReservation: item.availableReservation,
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
    paddingVertical: 0, // 안드로이드 텍스트 상하 잘림 방지
    color: "#000", // 입력 글씨 색상
  },
});