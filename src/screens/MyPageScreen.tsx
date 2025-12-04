// src/screens/MyPageScreen.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/MyPageStyles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  reservationId: string;
  facilityId: string;
  facilityName: String;
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
  const [extendLoading, setExtendLoading] = useState(false); // 🔹 연장 중 여부
  const [cancelLoading, setCancelLoading] = useState(false); // 🔹 취소 중 여부

  // 🔧 UTC 기준 timestamp → KST(UTC+9) Date로 변환
const toDate = (ts: { seconds: number; nanos: number }) => {
  const utcMillis = ts.seconds * 1000;
  const KST_OFFSET = 9 * 60 * 60 * 1000; // 9시간
  return new Date(utcMillis + KST_OFFSET);
};

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

  // 🔹 예약 목록 조회 함수 분리
  const fetchReservations = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://10.0.2.2:8080/api/reservations/my/${userId}`
      );

      console.log(
      "📌 [MY] reservations raw response:",
      JSON.stringify(res.data, null, 2)
    );

      const list: Reservation[] = res.data.data ?? [];

      // ✅ status가 "취소" 인 건 무조건 이전 예약으로 보냄
      const actives = list.filter(
        (r) => r.active && r.status !== "취소"
      );
      const past = list.filter(
        (r) => !r.active || r.status === "취소"
      );

      setActiveReservation(actives[0] ?? null);
      setPastReservations([...past, ...actives.slice(1)]);

      console.log("🔹 my reservations:", list);
    } catch (err) {
      console.error("예약 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [userId]);

  // 🔹 연장하기 버튼 핸들러
  const handleExtend = async () => {
  if (!activeReservation || extendLoading) return;

  try {
    setExtendLoading(true);
    //console.log();

    const res = await axios.put(
      `http://10.0.2.2:8080/api/reservations/extend/${activeReservation.reservationId}`,
      {}
    );

    console.log("🔹 extend response:", res.status, res.data);

    const isSuccess = res.data?.isSucess === true;
    if (isSuccess) {
      // 1️⃣ 서버가 돌려준 최신 예약으로 화면을 즉시 갱신
      const updated: Reservation = res.data.data;
      setActiveReservation(updated);

      Alert.alert("성공", "예약 시간이 2시간 연장되었습니다.");

      // 2️⃣ 그 다음, 서버 기준 전체 목록으로 한 번 더 동기화
      await fetchReservations();
    } } catch (err: any) {
  // Axios 에러인지 먼저 확인
  if (axios.isAxiosError(err)) {
    console.log("🔴 status:", err.response?.status);
    console.log("🔴 headers:", err.response?.headers);
    console.log(
      "🔴 response data:",
      JSON.stringify(err.response?.data, null, 2)  // body만 예쁘게
    );
  } else {
    console.log("🔴 unknown error:", err);
  }

  Alert.alert("실패", "예약 연장 중 오류가 발생했습니다.");
}
 finally {
    setExtendLoading(false);
  }
};

  // 🔹 취소하기 버튼 핸들러 수정
  const handleCancel = async () => {
  if (!activeReservation || cancelLoading) return;

  try {
    setCancelLoading(true);
    console.log("🔹 cancel target id:", activeReservation.reservationId);

    const res = await axios.put(
      `http://10.0.2.2:8080/api/reservations/cancel/${activeReservation.reservationId}`,
      {}
    );

    console.log("🔹 cancel response:", res.status, res.data);

    const isSuccess = res.data?.isSucess === true;

    if (isSuccess) {
      Alert.alert("성공", "예약이 취소되었습니다.");
      await fetchReservations(); // ✅ 서버 상태 다시 반영
    } else {
      Alert.alert(
        "실패",
        res.data?.message || "예약이 취소되지 않았습니다.\n관리자에게 문의하세요."
      );
    }
  } catch (err: any) {
    // 여기서 백엔드 에러 메시지를 꼭 찍어보자
    if (axios.isAxiosError(err)) {
      console.error(
        "예약 취소 실패:",
        err.response?.status,
        err.response?.data
      );
    } else {
      console.error("예약 취소 실패(기타):", err);
    }
    Alert.alert("실패", "예약 취소 중 오류가 발생했습니다.");
  } finally {
    setCancelLoading(false);
  }
};

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
              <Text style={styles.reservationDetailText}>
                {activeReservation.facilityName}
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

            {/* 버튼들 */}
            <View style={styles.reservationButtons}>
              {/* 연장하기 */}
              <TouchableOpacity
                style={styles.extendButton}
                onPress={handleExtend}
                disabled={extendLoading || cancelLoading}
              >
                <Text style={styles.extendButtonText}>
                  {extendLoading ? "연장 중..." : "연장하기"}
                </Text>
              </TouchableOpacity>

              {/* 취소하기 */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={cancelLoading || extendLoading}
              >
                <Text style={styles.cancelButtonText}>
                  {cancelLoading ? "취소 중..." : "취소하기"}
                </Text>
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
            <View key={r.reservationId} style={styles.pastReservationCard}>
              <View style={styles.reservationHeader}>
                <View style={styles.statusBadgeInactive}>
                  {/* ✅ 취소된 예약이면 "취소", 나머지는 "완료" */}
                  <Text style={styles.statusBadgeText}>
                    {r.status === "취소" ? "취소" : "완료"}
                  </Text>
                </View>
              </View>

              <View style={styles.reservationDetail}>
                <Ionicons name="location-outline" size={16} color="#FF3E8A" />
                <Text style={styles.reservationDetailText}>
                  {r.facilityName}
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
      await AsyncStorage.removeItem('userId');

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
  const [studentId, setStudentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [totalUseMinutes, setTotalUseMinutes] = useState("");
  const [totalReservationCount, setTotalReservationCount] = useState("");

  useEffect(() => {
    const loadUserId = async () => {
      const stored = await AsyncStorage.getItem("userId");
      if (stored) setUserId(stored);
    };
    loadUserId();
  }, []);

  // 🔹 RootNavigator에서 아직 userId를 안 넘기고 있으니까, 우선 fallback
  // <Stack.Screen name="MyPage" component={MyPageScreen} />
  const realUserId = userId; 

useEffect(() => {
  const fetchMyPage = async () => {
    if (!realUserId) return; // userId 아직 로드 안됐으면 실행 안 함

    try {
      const response = await axios.get(
        `http://10.0.2.2:8080/api/users/${realUserId}`
      );

      console.log("📌 MyPage response:", response.data);

      // 래핑된 data 꺼내기 (중요)
      const data = response.data.data ?? response.data;

      // 상태 업데이트
      setName(data.name);
      setStudentId(data.userId);
      setPhoneNumber(data.phoneNumber);
      setPassword(data.password ?? "");
      //setTotalUseMinutes(String(data.totalUseMinutes ?? ""));
      //setTotalReservationCount(String(data.totalReservationCount ?? ""));
    } catch (error) {
      console.error("마이페이지 조회 실패:", error);
    }
  };

  fetchMyPage();
}, [realUserId]);  // 🔥 중요: realUserId 변경될 때마다 MyPage 재로드

// 통계 카드 
useEffect(() => {
  const fetchStatsFromReservations = async () => {
    if (!realUserId) return; // userId 아직 없으면 패스

    try {
      const res = await axios.get(
        `http://10.0.2.2:8080/api/reservations/my/${realUserId}`
      );

      const list: Reservation[] = res.data.data ?? [];

      // 1) 취소된 예약(status === "취소")는 통계에서 제외한다고 가정
      const validReservations = list.filter(r => r.status !== "취소");

      // 2) 총 예약 횟수 = validReservations 개수
      const totalCount = validReservations.length;

      // 3) 총 이용 시간(분) = 각 예약의 (end - start) 합산
      const totalMinutes = validReservations.reduce((sum, r) => {
        const diffSeconds = r.endTime.seconds - r.startTime.seconds;
        const diffMinutes = Math.max(0, Math.floor(diffSeconds / 60));
        return sum + diffMinutes;
      }, 0);

      // 4) 상태에 반영 (문자열로)
      setTotalUseMinutes(String(totalMinutes));
      setTotalReservationCount(String(totalCount));
    } catch (err) {
      console.error("통계 계산용 예약 조회 실패:", err);
      // 실패하면 기존 값 그대로 두고, 필요하면 여기서 "-"로 초기화해도 됨
      // setTotalUseMinutes("");
      // setTotalReservationCount("");
    }
  };

  fetchStatsFromReservations();
}, [realUserId]);



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
          studentId={studentId}
          phone={phoneNumber}
          password={password}
          totalUseMinutes={totalUseMinutes}
          totalReservationCount={totalReservationCount}
          onLogout={handleLogout}
        />
      ) : (
        <MyReservations userId={realUserId} />
      )}
    </SafeAreaView>
  );
}
