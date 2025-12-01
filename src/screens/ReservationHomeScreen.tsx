// src/screens/ReservationHomeScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FacilityHeader from "../components/FacilityHeader";
import FacilitiesInformationScreen from "./FacilitiesInformationScreen";
import SeatReservationScreen from "./SeatReservationScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReservationHomeScreen({ route, navigation }: any) {
  const { facilityId } = route.params;
  const [tab, setTab] = useState("정보");

  // 🔥 헤더에 표시할 시설 이름 (초기값: 시설 정보)
  const [facilityName, setFacilityName] = useState("시설 정보");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* 🔹 상단 헤더 (시설 이름 표시) */}
      <FacilityHeader
        title={facilityName}
        onBack={() => navigation.navigate("Home")}
      />

      {/* 🔹 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setTab("정보")}
          style={[styles.tabItem, tab === "정보" && styles.tabActive]}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={tab === "정보" ? "#5D5FFE" : "#555"}
          />
          <Text style={[styles.tabText, { color: tab === "정보" ? "#5D5FFE" : "#555" }]}>
            정보
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab("좌석")}
          style={[styles.tabItem, tab === "좌석" && styles.tabActive]}
        >
          <Ionicons
            name="navigate-outline"
            size={20}
            color={tab === "좌석" ? "#5D5FFE" : "#555"}
          />
          <Text style={[styles.tabText, { color: tab === "좌석" ? "#5D5FFE" : "#555" }]}>
            좌석
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 내용 */}
      {tab === "정보" ? (
        <FacilitiesInformationScreen 
          facilityId={facilityId}
          onNameLoaded={setFacilityName}   // 🔥 이름 콜백 전달
        />
      ) : (
        <SeatReservationScreen facilityId={facilityId} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#5D5FFE",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
