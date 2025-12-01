// src/screens/HomeScreen.tsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, FlatList, Text, ActivityIndicator } from "react-native";
import HomeHeader from "../components/HomeHeader";
import SpaceCard from "../components/SpaceCard";
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export default function HomeScreen({ navigation }: any) {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const loadFacilities = async () => {
    try {
      const res = await axios.get("http://10.0.2.2:8080/api/facilities");
      const list = res.data.data; // FacilityListResponse 배열


      const mapped = list.map((item: any) => ({
        id: item.id,
        title: item.name,
        time: item.operatingHours,
        category: "시설", 
        status: item.congestionLevel,
        image: item.imageUrl ? { uri: item.imageUrl } : null,
      }));

      setSpaces(mapped);
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
      <HomeHeader />

      {/* 검색 */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="다른 공간을 찾아보시나요?"
          style={styles.searchInput}
        />
      </View>

      <View style={{ height: 12 }} />

      {/* 로딩중 표시 */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 10, color: Colors.textGray }}>불러오는 중...</Text>
        </View>
      ) : (
        /* 카드 리스트 */
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
              onPress={() =>
                navigation.navigate("Reservation", { facilityId: item.id })
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
