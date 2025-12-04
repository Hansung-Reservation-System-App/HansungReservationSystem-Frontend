// src/screens/RoomReservationScreen.tsx

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

type RoomReservationProps = {
  facilityId: string;
  userId: string | null;
  facilityName: string;
  navigation: any;
  onReserved: () => void;
};

/* ------------------ Firestore Timestamp ------------------ */
const toFirestoreTimestamp = (date: Date) => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanos: 0,
});

/* ------------------ 시간 포맷 ------------------ */
const formatTime = (ts: { seconds: number; nanos: number }) => {
  const d = new Date(ts.seconds * 1000);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const formatTimeRange = (
  start: { seconds: number; nanos: number },
  end: { seconds: number; nanos: number }
) => `${formatTime(start)} - ${formatTime(end)}`;

/* ------------------ 시설별 방 구성 ------------------ */
const roomLayoutByFacility: Record<string, string[][]> = {
  facility3: [
    ["그룹스터디실(3F-1)", "그룹스터디실(3F-2)", "그룹스터디실(4F)"],
    ["그룹스터디실(5F)", "그룹스터디실(6F)", "코워킹룸(3F)"],
    ["회의실(5F상상커먼스)"],
  ],
  facility4: [
    ["IB101", "IB102", "IB103"],
    ["IB104", "IB105", "IB106"],
    ["IB107", "IB108", "IB111"],
  ],
  facility5: [
    ["Challenge", "Collaboration", "Communication"],
    ["Convergence", "Creativity", "Critical Thinking"],
  ],
};

/* ------------------ 운영 시간 ------------------ */
const generateTimeSlots = (open: string, close: string): string[] => {
  const [openH] = open.split(":").map(Number);
  const [closeH] = close.split(":").map(Number);

  const slots: string[] = [];
  let cur = openH;
  while (cur + 2 <= closeH) {
    slots.push(`${String(cur).padStart(2, "0")}:00`);
    cur += 2;
  }
  return slots;
};

export default function RoomReservationScreen({
  facilityId,
  userId,
  facilityName,
  navigation,
  onReserved,
}: RoomReservationProps) {
  const roomRows = roomLayoutByFacility[facilityId] ?? [];
  const flatRooms = useMemo(() => roomRows.flat(), [roomRows]);

  /* 운영 시간 슬롯 */
  const timeSlots = useMemo(() => {
    if (facilityId === "facility3" || facilityId === "facility4") {
      return generateTimeSlots("09:00", "21:00");
    }
    if (facilityId === "facility5") {
      return generateTimeSlots("09:00", "19:00");
    }
    return [];
  }, [facilityId]);

  /* 상태 */
  const [reservedRooms, setReservedRooms] = useState<string[]>([]);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  /* seatNumber → 방 이름 */
  const seatNumberToLabel = (n: number) => flatRooms[n - 1] ?? null;

  /* ------------------ 예약된 룸/시간 조회 ------------------ */
  useEffect(() => {
    axios
      .get(`http://10.0.2.2:8080/api/reservations/seats/${facilityId}`)
      .then((res) => {
        const reservations = res.data.data;
        const rooms: string[] = [];
        const times: string[] = [];

        reservations.forEach((r: any) => {
          const roomLabel = seatNumberToLabel(r.seatNumber);
          if (!roomLabel) return;

          rooms.push(roomLabel);

          // 08:00 ~ 20:00 중 예약된 시작시간 가져오기
          const d = new Date(r.startTime.seconds * 1000);
          const hh = String(d.getHours()).padStart(2, "0") + ":00";

          times.push(`${roomLabel}_${hh}`);
        });

        setReservedRooms(rooms);
        setReservedTimes(times);
      })
      .catch((err) => console.error("예약 조회 실패:", err));
  }, [facilityId]);

  /* 방 이름 → seatNumber */
  const labelToSeatNumber = (label: string) =>
    flatRooms.indexOf(label) + 1;

  /* ------------------ 예약하기 ------------------ */
const handleReservation = async () => {
    if (!selectedRoom || !selectedTime) {
      Alert.alert("예약 실패", "방과 시간을 모두 선택해주세요.");
      return;
    }
    if (!userId) {
      Alert.alert("예약 실패", "로그인 정보가 없습니다.");
      return;
    }

    /* 1. 기기 시간대 무시하고 강제로 KST 기준 오늘 날짜 구하기 */
    const now = new Date();
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); 
    const kstGap = 9 * 60 * 60 * 1000; 
    const todayKst = new Date(utcNow + kstGap);

    const year = todayKst.getFullYear();
    const month = todayKst.getMonth();
    const day = todayKst.getDate();

    const [hhStr, mmStr] = selectedTime.split(":");
    const hour = parseInt(hhStr);
    const minute = parseInt(mmStr);

    /* 2. Firestore 저장용 Timestamp 생성 (UTC 변환) */
    // 한국 시간 9시는 UTC 0시이므로 (hour - 9)를 해줍니다.
    const start = new Date(Date.UTC(year, month, day, hour - 9, minute));
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2시간 이용

    const startTs = toFirestoreTimestamp(start);
    const endTs = toFirestoreTimestamp(end);

    /* 3. 알림 메시지용 문자열 생성 (KST 기준 직접 포맷팅) */
    const startHourStr = String(hour).padStart(2, "0");
    const endHourStr = String(hour + 2).padStart(2, "0"); // 종료 시간은 +2시간
    const minStr = String(minute).padStart(2, "0");
    
    const alertDateStr = `${month + 1}월 ${day}일`; // 예: 12월 4일
    const alertTimeStr = `${startHourStr}:${minStr} - ${endHourStr}:${minStr}`;

    const payload = {
      facilityId,
      userId,
      seatNumber: labelToSeatNumber(selectedRoom),
      startTime: startTs,
      endTime: endTs,
    };

    try {
    await axios.post("http://10.0.2.2:8080/api/reservations", payload);

    Alert.alert(
      "예약 완료",
      `${facilityName} ${selectedRoom}\n${alertDateStr} ${alertTimeStr}`
    );

    onReserved && onReserved();
  } catch (err: any) {
    //console.error("룸 예약 실패:", err);

    // ✅ axios 에러일 때만 응답 확인
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const code = err.response?.data?.code; // 백엔드 ApiResponse 구조에 맞게

      // 🔥 백엔드에서 중복예약일 때 내려주는 값에 맞춰서 조건 설정
      // 예시: HTTP 409 Conflict + "DUPLICATE_ACTIVE_RESERVATION"
      if (status === 409 || code === "DUPLICATE_ACTIVE_RESERVATION") {
        Alert.alert("예약 안내", "이미 진행 중인 예약이 있습니다.");
        return; // ⬅️ 여기서 끝내고 더 이상 에러 알림 안 띄움
      }
    }

    // 그 외 에러는 기존 메세지
    Alert.alert("예약 실패", "잠시 후 다시 시도해주세요.");
  }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 이용 가능 */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>이용 가능</Text>
        <Text style={styles.infoCount}>
          {flatRooms.length - reservedRooms.length}개
        </Text>
      </View>

      {/* 상태 */}
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <View style={[styles.statusColor, { borderColor: "#5D5FFE" }]} />
          <Text style={styles.statusText}>선택 가능</Text>
        </View>

        <View style={styles.statusItem}>
          <View style={[styles.statusColor, { backgroundColor: "#D9D9D9" }]} />
          <Text style={styles.statusText}>사용 중</Text>
        </View>

        <View style={styles.statusItem}>
          <View style={[styles.statusColor, { backgroundColor: "#5D5FFE" }]} />
          <Text style={styles.statusText}>선택됨</Text>
        </View>
      </View>

      {/* 방 선택 */}
      {roomRows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((room) => {
            const reserved = reservedRooms.includes(room);
            const selected = selectedRoom === room;

            return (
              <TouchableOpacity
                key={room}
                disabled={reserved}
                onPress={() => setSelectedRoom(room)}
                style={[
                  styles.roomBtn,
                  reserved && styles.roomReserved,
                  selected && styles.roomSelected,
                ]}
              >
                <Text
                  style={[
                    styles.roomText,
                    reserved && styles.textReserved,
                    selected && styles.textSelected,
                  ]}
                >
                  {room}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* 시간 선택 */}
      <Text style={styles.timeTitle}>시간 선택</Text>

      <View style={styles.timeRow}>
        {timeSlots.map((t) => {
          const isReserved = reservedTimes.includes(`${selectedRoom}_${t}`);
          const selected = selectedTime === t;

          return (
            <TouchableOpacity
              key={t}
              disabled={isReserved || !selectedRoom}
              onPress={() => setSelectedTime(t)}
              style={[
                styles.timeBtn,
                selected && styles.timeBtnSelected,
                isReserved && styles.timeBtnReserved,
                !selectedRoom && styles.timeBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.timeText,
                  selected && styles.timeTextSelected,
                  isReserved && styles.timeTextReserved,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 예약 버튼 */}
      {selectedRoom && selectedTime && (
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>
            {selectedRoom} / {selectedTime} 시작
          </Text>

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleReservation}
          >
            <Text style={styles.confirmText}>룸 예약하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

/* ------------------ 스타일 ------------------ */
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 140,
    alignItems: "center",
  },

  infoBox: {
    width: "90%",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    elevation: 2,
    marginBottom: 12,
  },
  infoLabel: { fontWeight: "bold", color: "#444" },
  infoCount: { marginLeft: 10, color: "#5D5FFE", fontWeight: "bold" },

  statusRow: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statusItem: { flexDirection: "row", alignItems: "center" },
  statusColor: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: { color: "#555" },

  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },

  roomBtn: {
    minWidth: 95,
    height: 45,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#5D5FFE",
    marginHorizontal: 4,
    marginVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  roomText: {
    color: "#5D5FFE",
    fontWeight: "600",
    fontSize: 11,
    textAlign: "center",
  },
  roomReserved: {
    backgroundColor: "#D9D9D9",
    borderColor: "#aaa",
  },
  textReserved: { color: "#999" },
  roomSelected: { backgroundColor: "#5D5FFE" },
  textSelected: { color: "#fff" },

  timeTitle: {
    width: "90%",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },

  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%",
  },

  timeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#5D5FFE",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  timeBtnSelected: { backgroundColor: "#5D5FFE" },
  timeBtnReserved: {
    backgroundColor: "#D9D9D9",
    borderColor: "#aaa",
  },
  timeBtnDisabled: { opacity: 0.4 },

  timeText: { color: "#5D5FFE", fontWeight: "500" },
  timeTextSelected: { color: "#fff" },
  timeTextReserved: { color: "#999" },

  bottomSheet: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },

  sheetTitle: { fontWeight: "bold", marginBottom: 16 },

  confirmBtn: {
    backgroundColor: "#5D5FFE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
