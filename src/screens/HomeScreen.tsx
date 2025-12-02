// src/screens/HomeScreen.tsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, FlatList, Text, ActivityIndicator } from "react-native";
import HomeHeader from "../components/HomeHeader";
import SpaceCard from "../components/SpaceCard";
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export default function HomeScreen({ navigation, route }: any) {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = route?.params?.userId; //Login에서 넘겨준 userId

// src/screens/HomeScreen.tsx

// src/screens/HomeScreen.tsx

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
          availableReservation: detail.availableReservation, // FacilityDetailResponse에서 가져옴
        };
      })
    );

    // 예약 가능한 시설 먼저 표시
    const sortedFacilities = facilitiesWithDetail.sort((a, b) => {
      return b.availableReservation - a.availableReservation;  // 예약 가능한 시설이 먼저 나오게 정렬
    });

    setSpaces(sortedFacilities); // 정렬된 데이터를 상태로 설정
  } catch (error) {
    console.error("시설 불러오기 실패:", error);
  } finally {
    setLoading(false);
  }
};




  useEffect(() => {
    loadFacilities();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader userId={userId} />

      <View style={styles.searchBox}>
        <TextInput
          placeholder="다른 공간을 찾아보시나요?"
          style={styles.searchInput}
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
        renderItem={({ item }) => {
          console.log("availableReservation:", item.availableReservation);  // 디버깅용
          return (
            <SpaceCard
              {...item}
              availableReservation={item.availableReservation}
              onPress={() =>
                navigation.navigate("Reservation", {
                  facilityId: item.id,
                  userId: userId,
                })
              }
            />
          );
        }}
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
