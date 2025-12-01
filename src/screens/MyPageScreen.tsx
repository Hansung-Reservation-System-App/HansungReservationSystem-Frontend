// src/screens/MyPageScreen.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/MyPageStyles";
import axios from "axios";

// 프로필 타입
type Profile = {
  name: string;
  studentId: string;
  password: string;
  phone: string;
};

// ✅ MyPageInfo에 내려줄 props 타입
type MyPageInfoProps = {
  name: string;
  studentId: string;
  phone: string;
  password: string;
  totalUseMinutes: string;
  totalReservationCount: string;
  onLogout: () => void;
};

// 마이페이지 정보 컴포넌트
const MyPageInfo = ({
  name,
  studentId,
  phone,
  password,
  totalUseMinutes,
  totalReservationCount,
  onLogout,
}: MyPageInfoProps) => {
  // ✅ 서버에서 받은 값으로 초기값 구성
  const [originalProfile, setOriginalProfile] = useState<Profile>({
    name,
    studentId,
    password,
    phone,
  });

  const [profile, setProfile] = useState<Profile>(originalProfile);
  const [isDirty, setIsDirty] = useState(false); // 변경 여부

  // 🔄 서버 데이터가 바뀔 때(첫 로딩 포함) profile 동기화
  useEffect(() => {
    const nextProfile: Profile = {
      name: name || "",
      studentId: studentId || "",
      password: password || "",
      phone: phone || "",
    };
    setOriginalProfile(nextProfile);
    setProfile(nextProfile);
    setIsDirty(false);
  }, [name, studentId, phone, password]);

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

  // ✅ 회원 정보 수정 API 호출
  const handleUpdateProfile = async () => {
    try {
      const userIdForApi = studentId; // 현재는 studentId = userId 역할

      // password는 비워두면 아예 보내지 않기 (비번 변경은 별도 화면에서 한다고 가정)
      const body: any = {
        name: profile.name,
        phoneNumber: profile.phone,
      };
      if (profile.password) {
        body.password = profile.password;
      }

      const response = await axios.put(
        `http://10.0.2.2:8080/api/users/${userIdForApi}`,
        body
      );

      // 네가 준 응답 형태 기준
      // {
      //   "isSucess": true,
      //   "code": "string",
      //   "message": "string",
      //   "data": { ... }
      // }
      if (response.data?.isSucess) {
        setOriginalProfile(profile);
        setIsDirty(false);
        Alert.alert("성공", "회원 정보가 수정되었습니다.");
      } else {
        Alert.alert(
          "실패",
          response.data?.message || "회원 정보 수정에 실패했습니다."
        );
      }
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      Alert.alert("에러", "회원 정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.profileSection}>
        {/* 프로필 아이콘 */}
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>

        {/* 이름과 학번 (상단 표시용) */}
        <Text style={styles.profileName}>{profile.name || "이름 없음"}</Text>
        <Text style={styles.profileId}>{profile.studentId || "학번 없음"}</Text>
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
            {/* 🔸 서버에서 받은 학번 표시 */}
            <Text style={styles.infoValue}>
              {profile.studentId || "학번 정보 없음"}
            </Text>
            <Text style={styles.infoSubtext}>학생증 등록은 완료</Text>
          </View>
        </View>

        {/* 비밀번호 */}
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#FF3E8A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>비밀번호</Text>
            <Text style={styles.infoValue}>
              {"*".repeat(profile.password?.length ?? 0)}
            </Text>
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
          onPress={handleUpdateProfile}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text
            style={[
              styles.editButtonText,
              { color: "#fff" },
            ]}
          >
            회원 정보 수정
          </Text>
        </TouchableOpacity>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>로그 아웃하기</Text>
        </TouchableOpacity>
      </View>

      {/* 통계 카드 */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          {/* ✅ 백엔드에서 가져온 총 이용 시간 사용 */}
          <Text style={styles.statNumber}>
            {totalUseMinutes || "-"}
          </Text>
          <Text style={styles.statLabel}>총 이용 시간(분)</Text>
        </View>
        <View style={[styles.statCard, styles.statCardSecondary]}>
          {/* ✅ 백엔드에서 가져온 총 예약 횟수 사용 */}
          <Text style={[styles.statNumber, styles.statNumberSecondary]}>
            {totalReservationCount || "-"}
          </Text>
          <Text style={[styles.statLabel, styles.statLabelSecondary]}>
            총 예약 횟수
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// 예약 타입
type Reservation = {
  id: string;
  facilityId: string;
  userId: string;
  seatNumber: number;
  startTime: { seconds: number; nanos: number };
  endTime: { seconds: number; nanos: number };
  status: string;
  active: boolean;
};

type MyReservationsProps = {
  userId: string; // 🔹 MyPageScreen에서 넘겨줄 userId
};

const MyReservations = ({ userId }: MyReservationsProps) => {
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔧 타임스탬프 → Date → 문자열 포맷 함수들
  const toDate = (ts: { seconds: number; nanos: number }) =>
    new Date(ts.seconds * 1000);

  const formatDate = (ts: { seconds: number; nanos: number }) => {
    const d = toDate(ts);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatTime = (ts: { seconds: number; nanos: number }) => {
    const d = toDate(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mi}`;
  };

  const formatTimeRange = (
    start: { seconds: number; nanos: number },
    end: { seconds: number; nanos: number }
  ) => `${formatTime(start)} - ${formatTime(end)}`;

  useEffect(() => {
    if (!userId) return;

    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          `http://10.0.2.2:8080/api/reservations/my/${userId}`
        );

        const list: Reservation[] = res.data.data ?? [];

        // active 기준으로 진행 / 과거 나누기
        const actives = list.filter((r) => r.active);
        const past = list.filter((r) => !r.active);

        setActiveReservation(actives[0] ?? null);
        // 만약 active가 여러 개라면 1개만 “진행중”에 쓰고 나머지는 밑으로 내리기
        setPastReservations([...past, ...actives.slice(1)]);
      } catch (err) {
        console.error("예약 목록 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  return (
    <ScrollView style={styles.scrollContainer}>
      {/* 진행중인 예약 */}
      <View style={styles.activeReservationSection}>
        <Text style={styles.sectionTitle}>진행중인 예약</Text>

        {loading ? (
          <Text style={styles.reservationDetailText}>불러오는 중...</Text>
        ) : !activeReservation ? (
          <Text style={styles.reservationDetailText}>
            진행중인 예약이 없습니다.
          </Text>
        ) : (
          <View style={styles.activeReservationCard}>
            <View style={styles.reservationHeader}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>진행중</Text>
              </View>
            </View>

            <View style={styles.reservationDetail}>
              <Ionicons name="location-outline" size={16} color="#FF3E8A" />
              {/* 시설 이름이 필요하면 나중에 facility API에서 조인 */}
              <Text style={styles.reservationDetailText}>
                {activeReservation.facilityId}
              </Text>
            </View>

            <View style={styles.reservationDetail}>
              <Ionicons name="calendar-outline" size={16} color="#FF3E8A" />
              <Text style={styles.reservationDetailText}>
                {formatDate(activeReservation.startTime)}
              </Text>
            </View>

            <View style={styles.reservationDetail}>
              <Ionicons name="time-outline" size={16} color="#FF3E8A" />
              <Text style={styles.reservationDetailText}>
                {formatTimeRange(
                  activeReservation.startTime,
                  activeReservation.endTime
                )}
              </Text>
            </View>

            {/* 버튼들 (API는 나중에 붙이기) */}
            <View style={styles.reservationButtons}>
              <TouchableOpacity
                style={styles.extendButton}
                onPress={() => {
                  // TODO: 예약 연장 API (예: POST /api/reservations/{id}/extend)
                }}
              >
                <Text style={styles.extendButtonText}>연장하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  // TODO: 예약 취소 API (예: POST /api/reservations/{id}/cancel)
                }}
              >
                <Text style={styles.cancelButtonText}>취소하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 이전 예약 */}
      <View style={styles.pastReservationSection}>
        <Text style={styles.sectionTitle}>이전 예약</Text>

        {loading ? (
          <Text style={styles.reservationDetailText}>불러오는 중...</Text>
        ) : pastReservations.length === 0 ? (
          <Text style={styles.reservationDetailText}>
            이전 예약이 없습니다.
          </Text>
        ) : (
          pastReservations.map((r) => (
            <View key={r.id} style={styles.pastReservationCard}>
              <View style={styles.reservationHeader}>
                <View style={styles.statusBadgeInactive}>
                  <Text style={styles.statusBadgeText}>완료</Text>
                </View>
              </View>

              <View style={styles.reservationDetail}>
                <Ionicons name="location-outline" size={16} color="#FF3E8A" />
                <Text style={styles.reservationDetailText}>
                  {r.facilityId}
                </Text>
              </View>

              <View style={styles.reservationDetail}>
                <Ionicons name="calendar-outline" size={16} color="#FF3E8A" />
                <Text style={styles.reservationDetailText}>
                  {formatDate(r.startTime)}
                </Text>
              </View>

              <View style={styles.reservationDetail}>
                <Ionicons name="time-outline" size={16} color="#FF3E8A" />
                <Text style={styles.reservationDetailText}>
                  {formatTimeRange(r.startTime, r.endTime)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};


export default function MyPageScreen({ route, navigation }: any) {
  const [tab, setTab] = useState("정보");

  const handleLogout = async () => {
    try {
      // 1) 토큰/유저 정보 저장해둔 게 있으면 여기서 삭제
      // 예시) AsyncStorage 쓰고 있다면:
      // await AsyncStorage.removeItem('accessToken');
      // await AsyncStorage.removeItem('refreshToken');
      // await AsyncStorage.removeItem('userId');

      // 2) 네비게이션 스택을 Login으로 초기화
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],   // RootNavigator에 있는 "Login" 스크린 이름
      });
    } catch (e) {
      console.error("로그아웃 처리 중 오류:", e);
    }
  };

  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [totalUseMinutes, setTotalUseMinutes] = useState("");
  const [totalReservationCount, setTotalReservationCount] = useState("");

  // 🔹 RootNavigator에서 아직 userId를 안 넘기고 있으니까, 우선 fallback
  // <Stack.Screen name="MyPage" component={MyPageScreen} />
  const pathUserId = route?.params?.userId;

  useEffect(() => {
    const fetchMyPage = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:8080/api/users/${pathUserId}`
        );

        // ✅ 응답을 사용해서 상태 업데이트
        // (백엔드가 래핑해서 보내면 response.data.data.name 이런 식으로 맞춰주면 됨)
        console.log("📌 MyPage response:", response.data);
        // ✅ 래핑된 data 꺼내기 (중요!!)
        const data = response.data.data ?? response.data;
        
        setName(data.name);
        setUserId(data.userId);
        setPhoneNumber(data.phoneNumber);
        // 비밀번호는 보통 안 내려주니까, 내려오면 쓰고 아니면 빈 문자열
        setPassword(data.password ?? "");
        setTotalUseMinutes(String(data.totalUseMinutes ?? ""));
        setTotalReservationCount(String(data.totalReservationCount ?? ""));
      } catch (error) {
        console.error("마이페이지 조회 실패:", error);
      }
    };

    fetchMyPage();
  }, [pathUserId]);

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
      {tab === "정보" ? (
        <MyPageInfo
          name={name}
          studentId={userId}
          phone={phoneNumber}
          password={password}
          totalUseMinutes={totalUseMinutes}
          totalReservationCount={totalReservationCount}
          onLogout={handleLogout}
        />
      ) : (
        <MyReservations userId={pathUserId} />
      )}
    </SafeAreaView>
  );
}
