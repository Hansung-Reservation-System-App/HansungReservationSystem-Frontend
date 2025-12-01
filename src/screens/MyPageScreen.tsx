// src/screens/MyPageScreen.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/MyPageSyles";

// 프로필 타입 (타입 엄격하게 쓰기 싫으면 any로 바꿔도 됨)
type Profile = {
  name: string;
  studentId: string;
  password: string;
  phone: string;
};

// 마이페이지 정보 컴포넌트
const MyPageInfo = () => {
  // ✅ 초기값: 나중에 백엔드에서 받은 값으로 교체 예정
  const [originalProfile] = useState<Profile>({
    name: "김한성",
    studentId: "2111112",
    password: "1234",
    phone: "01012345678",
  });

  const [profile, setProfile] = useState<Profile>(originalProfile);
  const [isDirty, setIsDirty] = useState(false); // 변경 여부

  const handleChange = (field: keyof Profile, value: string) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);

    // 원본과 비교해서 하나라도 다르면 true
    const changed =
      updated.name !== originalProfile.name ||
      updated.studentId !== originalProfile.studentId ||
      updated.password !== originalProfile.password ||
      updated.phone !== originalProfile.phone;

    setIsDirty(changed);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.profileSection}>
        {/* 프로필 아이콘 */}
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>

        {/* 이름과 학번 (상단 표시용) */}
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileId}>{profile.studentId}</Text>
      </View>

      {/* 기본 정보 카드 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>기본 정보</Text>

        {/* 이름 */}
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={20} color="#FF3E8A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>이름</Text>
            <TextInput
              style={styles.infoValue}
              value={profile.name}
              onChangeText={(text) => handleChange("name", text)}
              placeholder="이름을 입력하세요"
            />
          </View>
        </View>

        {/* 학번 */}
        <View style={styles.infoItem}>
          <Ionicons name="school-outline" size={20} color="#FF3E8A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>학번</Text>
            <TextInput
              style={styles.infoValue}
              value={profile.studentId}
              onChangeText={(text) => handleChange("studentId", text)}
              placeholder="학번을 입력하세요"
              keyboardType="numeric"
            />
            <Text style={styles.infoSubtext}>학생증 등록은 완료</Text>
          </View>
        </View>

        {/* 비밀번호 */}
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#FF3E8A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>비밀번호</Text>
            <TextInput
              style={styles.infoValue}
              value={profile.password}
              onChangeText={(text) => handleChange("password", text)}
              placeholder="비밀번호를 입력하세요"
              //secureTextEntry
            />
          </View>
        </View>

        {/* 전화번호 */}
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#FF3E8A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>전화번호</Text>
            <TextInput
              style={styles.infoValue}
              value={profile.phone}
              onChangeText={(text) => handleChange("phone", text)}
              placeholder="전화번호를 입력하세요"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      {/* 🔹 정보 수정하기 + 로그아웃 버튼 묶음 */}
      <View style={styles.actionButtonsRow}>
        {/* 회원 정보 수정 버튼 */}
        <TouchableOpacity
          style={[
            styles.editButton,
            !isDirty && styles.editButtonDisabled, // 변경 없을 땐 비활성 스타일
          ]}
          disabled={!isDirty}
          onPress={() => {
            // TODO: 회원 정보 수정 API 통신 (PUT /api/user/profile 등)
            //  - profile 값 서버로 전송
            //  - 성공 시: originalProfile 값도 갱신하는 로직 필요
          }}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={isDirty ? "#fff" : "#fff"}
          />
          <Text
            style={[
              styles.editButtonText,
              { color: isDirty ? "#fff" : "#fff" },
            ]}
          >
            회원 정보 수정
          </Text>
        </TouchableOpacity>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            // TODO: 로그아웃 API 통신 (POST /api/auth/logout)
            //  - 토큰/AsyncStorage 삭제
            //  - 로그인 화면으로 네비게이션
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>로그 아웃하기</Text>
        </TouchableOpacity>
      </View>

      {/* 통계 카드 */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          {/* TODO: 백엔드에서 가져온 총 이용 시간 사용 */}
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>총 이용 시간</Text>
        </View>
        <View style={[styles.statCard, styles.statCardSecondary]}>
          {/* TODO: 백엔드에서 가져온 총 예약 횟수 사용 */}
          <Text style={[styles.statNumber, styles.statNumberSecondary]}>24</Text>
          <Text style={[styles.statLabel, styles.statLabelSecondary]}>
            총 예약 횟수
          </Text>
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

        {/* TODO: 백엔드에서 진행중 예약 조회해서 카드 렌더링 */}
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
            {/* 연장하기 */}
            <TouchableOpacity
              style={styles.extendButton}
              onPress={() => {
                // TODO: 예약 연장 API 통신 (POST /api/reservations/{id}/extend)
              }}
            >
              <Text style={styles.extendButtonText}>연장하기</Text>
            </TouchableOpacity>

            {/* 취소하기 */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                // TODO: 예약 취소 API 통신 (POST /api/reservations/{id}/cancel)
              }}
            >
              <Text style={styles.cancelButtonText}>취소하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 이전 예약 */}
      <View style={styles.pastReservationSection}>
        <Text style={styles.sectionTitle}>이전 예약</Text>

        {/* TODO: 백엔드에서 지난 예약 리스트 조회해서 map으로 렌더링 */}

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

  useEffect(() => {
    // TODO: 마이페이지 초기 데이터 조회 통신 (GET /api/mypage)
    //  - 프로필 정보
    //  - 통계 정보
    //  - 예약 내역
    //
    // 응답을 사용해서:
    //  - MyPageInfo에 props로 내려주도록 구조 리팩토링 예정
  }, []);

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
            style={[
              styles.tabText,
              { color: tab === "정보" ? "#FF3E8A" : "#555" },
            ]}
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
            style={[
              styles.tabText,
              { color: tab === "예약" ? "#FF3E8A" : "#555" },
            ]}
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