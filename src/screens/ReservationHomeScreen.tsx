import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FacilityHeader from "../components/FacilityHeader";
import FacilitiesInformationScreen from "./FacilitiesInformationScreen";
import SeatReservationScreen from "./SeatReservationScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReservationHomeScreen({ route, navigation }: any) {
  const { facilityId } = route.params; // facilityId는 그대로 params 사용

  const [tab, setTab] = useState<"정보" | "좌석">("정보");
  const [facilityName, setFacilityName] = useState("시설 정보");

  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true); // ⭐ userId 로딩 상태

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const saved = await AsyncStorage.getItem("userId");
        if (!saved) {
          console.warn("로그인 정보가 없습니다. userId가 null 상태입니다.");
        } else {
          setStoredUserId(saved);
        }
      } catch (err) {
        console.error("userId 불러오기 오류:", err);
      } finally {
        setLoadingUser(false); // ⭐ 로딩 끝
      }
    };

    loadUserId();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 상단 그라데이션 헤더 */}
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
          <Text
            style={[
              styles.tabText,
              { color: tab === "정보" ? "#5D5FFE" : "#555" },
            ]}
          >
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
          <Text
            style={[
              styles.tabText,
              { color: tab === "좌석" ? "#5D5FFE" : "#555" },
            ]}
          >
            좌석
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탭 내용 영역 */}
      {tab === "정보" ? (
        <FacilitiesInformationScreen
          facilityId={facilityId}
          onNameLoaded={setFacilityName}
        />
      ) : (
        <>
          {/* ⭐ userId 로딩 중일 때 처리 */}
          {loadingUser && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" />
              <Text style={{ marginTop: 8 }}>사용자 정보를 불러오는 중...</Text>
            </View>
          )}

          {/* ⭐ userId 없음 (로그인 문제 등) */}
          {!loadingUser && !storedUserId && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text>로그인 정보가 없습니다. 다시 로그인해주세요.</Text>
            </View>
          )}

          {/* ⭐ userId까지 준비 완료된 경우에만 좌석 화면 렌더 */}
          {!loadingUser && storedUserId && (
            <SeatReservationScreen
              facilityId={facilityId}
              userId={storedUserId} // 이 시점에서는 무조건 string
              facilityName={facilityName}
              navigation={navigation}
              onReserved={() => {
                // 예약 끝나면 정보 탭으로 전환
                setTab("정보");
              }}
            />
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
