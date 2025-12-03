import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FacilityHeader from "../components/FacilityHeader";
import FacilitiesInformationScreen from "./FacilitiesInformationScreen";
import SeatReservationScreen from "./SeatReservationScreen";
import RoomReservationScreen from "./RoomReservationScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReservationHomeScreen({ route, navigation }: any) {
  const { facilityId } = route.params;

  const [tab, setTab] = useState<"정보" | "예약">("정보");
  const [facilityName, setFacilityName] = useState("시설 정보");

  // ⭐ 룸형 시설 목록
  const ROOM_FACILITY_IDS = ["facility3", "facility4", "facility5"];
  const isRoomFacility = ROOM_FACILITY_IDS.includes(facilityId);

  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const saved = await AsyncStorage.getItem("userId");
        if (!saved) {
          console.warn("로그인 정보 없음");
        } else {
          setStoredUserId(saved);
        }
      } catch (err) {
        console.error("userId 불러오기 오류:", err);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUserId();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 상단 헤더 */}
      <FacilityHeader
        title={facilityName}
        onBack={() => navigation.navigate("Home")}
      />

      {/* 탭 */}
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
          onPress={() => setTab("예약")}
          style={[styles.tabItem, tab === "예약" && styles.tabActive]}
        >
          <Ionicons
            name="navigate-outline"
            size={20}
            color={tab === "예약" ? "#5D5FFE" : "#555"}
          />
          <Text style={[styles.tabText, { color: tab === "예약" ? "#5D5FFE" : "#555" }]}>
            예약
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탭 내용 */}
      {tab === "정보" ? (
        <FacilitiesInformationScreen
          facilityId={facilityId}
          onNameLoaded={setFacilityName}
        />
      ) : (
        <>
          {/* userId 로딩 상태 */}
          {loadingUser && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" />
              <Text style={{ marginTop: 8 }}>사용자 정보를 불러오는 중...</Text>
            </View>
          )}

          {/* userId 없음 */}
          {!loadingUser && !storedUserId && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text>로그인 정보가 없습니다. 다시 로그인해주세요.</Text>
            </View>
          )}

          {/* userId 로딩 완료 + 존재 → 예약 화면 렌더 */}
          {!loadingUser && storedUserId && (
            isRoomFacility ? (
              <RoomReservationScreen
                facilityId={facilityId}
                userId={storedUserId}
                facilityName={facilityName}
                navigation={navigation}
                onReserved={() => setTab("정보")}
              />
            ) : (
              <SeatReservationScreen
                facilityId={facilityId}
                userId={storedUserId}
                facilityName={facilityName}
                navigation={navigation}
                onReserved={() => setTab("정보")}
              />
            )
          )}
        </>
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
