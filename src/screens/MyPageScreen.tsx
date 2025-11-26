import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

// 마이페이지 정보 컴포넌트
const MyPageInfo = () => {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.profileSection}>
        {/* 프로필 아이콘 */}
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>
        
        {/* 이름과 학번 */}
        <Text style={styles.profileName}>김한성</Text>
        <Text style={styles.profileId}>2024123456</Text>
      </View>

      {/* 기본 정보 카드 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>기본 정보</Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={20} color="#FF3E8A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>이름</Text>
            <Text style={styles.infoValue}>김한성</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="school-outline" size={20} color="#FF3E8A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>학번</Text>
            <Text style={styles.infoValue}>2024123456</Text>
            <Text style={styles.infoSubtext}>학생증 등록은 완료</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#FF3E8A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>이메일</Text>
            <Text style={styles.infoValue}>hansung@hansung.ac.kr</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#FF3E8A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>전화번호</Text>
            <Text style={styles.infoValue}>010-1234-5678</Text>
          </View>
        </View>
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>로그 아웃하기</Text>
      </TouchableOpacity>

      {/* 통계 카드 */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>총 이용 시간</Text>
        </View>
        <View style={[styles.statCard, styles.statCardSecondary]}>
          <Text style={[styles.statNumber, styles.statNumberSecondary]}>24</Text>
          <Text style={[styles.statLabel, styles.statLabelSecondary]}>총 예약 횟수</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// 예약 내역 컴포넌트
const MyReservations = () => {
  return (
    <ScrollView style={styles.scrollContainer}>
      {/* 진행중인 예약 */}
      <View style={styles.activeReservationSection}>
        <Text style={styles.sectionTitle}>진행중인 예약</Text>
        <View style={styles.activeReservationCard}>
          <View style={styles.reservationHeader}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>진행중</Text>
            </View>
          </View>
          
          <View style={styles.reservationDetail}>
            <Ionicons name="location-outline" size={16} color="#FF3E8A" />
            <Text style={styles.reservationDetailText}>회의실 A-12</Text>
          </View>
          
          <View style={styles.reservationDetail}>
            <Ionicons name="calendar-outline" size={16} color="#FF3E8A" />
            <Text style={styles.reservationDetailText}>2025-10-26</Text>
          </View>
          
          <View style={styles.reservationDetail}>
            <Ionicons name="time-outline" size={16} color="#FF3E8A" />
            <Text style={styles.reservationDetailText}>09:00 - 12:00</Text>
          </View>

          {/* 버튼들 */}
          <View style={styles.reservationButtons}>
            <TouchableOpacity style={styles.extendButton}>
              <Text style={styles.extendButtonText}>연장하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>취소하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 이전 예약 */}
      <View style={styles.pastReservationSection}>
        <Text style={styles.sectionTitle}>이전 예약</Text>
        
        <View style={styles.pastReservationCard}>
          <View style={styles.reservationHeader}>
            <View style={styles.statusBadgeInactive}>
              <Text style={styles.statusBadgeText}>완료</Text>
            </View>
          </View>
          
          <View style={styles.reservationDetail}>
            <Ionicons name="location-outline" size={16} color="#FF3E8A" />
            <Text style={styles.reservationDetailText}>회의실 B-05</Text>
          </View>
          
          <View style={styles.reservationDetail}>
            <Ionicons name="calendar-outline" size={16} color="#FF3E8A" />
            <Text style={styles.reservationDetailText}>2025-10-25</Text>
          </View>
          
          <View style={styles.reservationDetail}>
            <Ionicons name="time-outline" size={16} color="#FF3E8A" />
            <Text style={styles.reservationDetailText}>14:00 - 18:00</Text>
          </View>
        </View>

        <View style={styles.pastReservationCard}>
          <View style={styles.reservationHeader}>
            <View style={styles.statusBadgeInactive}>
              <Text style={styles.statusBadgeText}>완료</Text>
            </View>
          </View>
          
          <View style={styles.reservationDetail}>
            <Ionicons name="location-outline" size={16} color="#FF3E8A" />
            <Text style={styles.reservationDetailText}>회의실 C-03</Text>
          </View>
          
          <View style={styles.reservationDetail}>
            <Ionicons name="calendar-outline" size={16} color="#FF3E8A" />
            <Text style={styles.reservationDetailText}>2025-09-15</Text>
          </View>
          
          <View style={styles.reservationDetail}>
            <Ionicons name="time-outline" size={16} color="#FF3E8A" />
            <Text style={styles.reservationDetailText}>10:00 - 12:00</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default function MyPageScreen({ route, navigation }: any) {
  const [tab, setTab] = useState("정보");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* 🔹 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>마이페이지</Text>
      </View>

      {/* 🔹 정보 / 예약 탭 */}
      <View style={styles.tabContainer}>
        {/* 정보 탭 */}
        <TouchableOpacity
          onPress={() => setTab("정보")}
          style={[styles.tabItem, tab === "정보" && styles.tabActive]}
        >
          <Text
            style={[styles.tabText, { color: tab === "정보" ? "#FF3E8A" : "#555" }]}
          >
            마이페이지
          </Text>
        </TouchableOpacity>

        {/* 예약 탭 */}
        <TouchableOpacity
          onPress={() => setTab("예약")}
          style={[styles.tabItem, tab === "예약" && styles.tabActive]}
        >
          <Text
            style={[styles.tabText, { color: tab === "예약" ? "#FF3E8A" : "#555" }]}
          >
            마이예약내역
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 내용 */}
      {tab === "정보" ? <MyPageInfo /> : <MyReservations />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#FF3E8A",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#FF3E8A",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  // 프로필 섹션
  profileSection: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 20,
  },
  profileIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FF3E8A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  profileId: {
    fontSize: 16,
    color: "#6b7280",
  },
  // 정보 카드
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  infoSubtext: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  // 로그아웃 버튼
  logoutButton: {
    backgroundColor: "#FF3E8A",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#FF3E8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // 통계 카드
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f3e8ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statCardSecondary: {
    backgroundColor: "#ccfbf1",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7c3aed",
    marginBottom: 4,
  },
  statNumberSecondary: {
    color: "#0d9488",
  },
  statLabel: {
    fontSize: 11,
    color: "#a78bfa",
  },
  statLabelSecondary: {
    color: "#5eead4",
  },
  // 예약 섹션
  activeReservationSection: {
    padding: 20,
  },
  pastReservationSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  activeReservationCard: {
    backgroundColor: "#fdf2f8",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fbcfe8",
  },
  pastReservationCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  reservationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: "#FF3E8A",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeInactive: {
    backgroundColor: "#9ca3af",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  reservationDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  reservationDetailText: {
    fontSize: 14,
    color: "#374151",
  },
  reservationButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  extendButton: {
    flex: 1,
    backgroundColor: "#7c3aed",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  extendButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
});