// src/screens/HomeScreen.tsx

import React from "react";
import { View, StyleSheet, TextInput, FlatList } from "react-native";
import HomeHeader from "../components/HomeHeader";
import SpaceCard from "../components/SpaceCard";
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }: any) {
  const spaces = [
    {
      id: "1",
      title: "공간예약A",
      time: "오전 9시 - 오후 6시",
      category: "휴게실",
      status: "여유",
      congestion: 30,
      image: null,
    },
    {
      id: "2",
      title: "공간예약B",
      time: "오전 10시 - 오후 8시",
      category: "스터디룸",
      status: "보통",
      congestion: 75,
      image: null,
    },
    {
      id: "3",
      title: "공간예약C",
      time: "오전 9시 - 오후 6시",
      category: "휴게실",
      status: "여유",
      congestion: 30,
      image: null,
    },
    {
      id: "4",
      title: "공간예약D",
      time: "오전 9시 - 오후 6시",
      category: "휴게실",
      status: "여유",
      congestion: 30,
      image: null,
    },
    {
      id: "5",
      title: "공간예약E",
      time: "오전 9시 - 오후 6시",
      category: "휴게실",
      status: "여유",
      congestion: 30,
      image: null,
    },
    {
      id: "6",
      title: "공간예약F",
      time: "오전 9시 - 오후 6시",
      category: "휴게실",
      status: "보통",
      congestion: 90,
      image: null,
    },
  ];

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

      {/* 카드 리스트 */}
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
              navigation.navigate("Reservation", { facility: item })
            }
          />
        )}
      />
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
