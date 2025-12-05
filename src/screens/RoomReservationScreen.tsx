// src/screens/RoomReservationScreen.tsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
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

// ... 기존 헬퍼 함수들은 그대로 유지 ...
const toFirestoreTimestamp = (date: Date) => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanos: 0,
});

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

  const timeSlots = useMemo(() => {
    if (facilityId === "facility3" || facilityId === "facility4") {
      return generateTimeSlots("09:00", "21:00");
    }
    if (facilityId === "facility5") {
      return generateTimeSlots("09:00", "19:00");
    }
    return [];
  }, [facilityId]);

  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const seatNumberToLabel = (n: number) => flatRooms[n - 1] ?? null;
  const labelToSeatNumber = (label: string) => flatRooms.indexOf(label) + 1;

  // 🔥 [수정됨] 백엔드 데이터(UTC)를 강제로 한국 시간(KST)으로 변환하여 비교
  const fetchReservations = useCallback(async () => {
    try {
      console.log(`📡 [API 요청] ${facilityId} 예약 정보 가져오는 중...`);
      
      const res = await axios.get(
        `http://10.0.2.2:8080/api/reservations/seats/${facilityId}`
      );
      
      const list = res.data.data;
      const bookedList: string[] = [];

      list.forEach((item: any) => {
        // 1. 좌석 번호 -> 방 이름
        const roomLabel = seatNumberToLabel(item.seatNumber);
        if (!roomLabel) return;

        // 2. 시간 변환 (핵심 수정 부분!)
        // item.startTime.seconds는 UTC 초
        const d = new Date(item.startTime.seconds * 1000);
        
        //  기기 시간대 무시하고 UTC 시간 가져온 뒤 9시간(KST) 더하기
        let kstHour = d.getUTCHours() + 9;
        
        // 24시 넘어가면 날짜 보정 (예: 16시 UTC + 9 = 25시 -> 01시)
        if (kstHour >= 24) kstHour -= 24;

        const hh = String(kstHour).padStart(2, "0");
        const timeStr = `${hh}:00`;

        // 3. 키 생성 (예: "Challenge_09:00")
        const key = `${roomLabel}_${timeStr}`;
        bookedList.push(key);

        console.log(`🔒 예약 확인됨: ${key} (KST 변환 완료)`);
      });

      setReservedTimes(bookedList);
      
    } catch (err) {
      console.error("❌ 예약 조회 실패:", err);
    }
  }, [facilityId]);

  // 화면 진입 시 조회
  useEffect(() => {
    setSelectedRoom(null);
    setSelectedTime(null);
    fetchReservations();
  }, [fetchReservations]);


  const handleReservation = async () => {
    if (!selectedRoom || !selectedTime) {
      Alert.alert("알림", "방과 시간을 모두 선택해주세요.");
      return;
    }
    if (!userId) {
      Alert.alert("오류", "로그인 정보가 없습니다.");
      return;
    }

    const now = new Date();
    // 보내는 로직은 이미 완벽합니다 (hour - 9 해서 UTC로 보냄)
    const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const kstGap = 9 * 60 * 60 * 1000;
    const todayKst = new Date(utcNow + kstGap);

    const year = todayKst.getFullYear();
    const month = todayKst.getMonth();
    const day = todayKst.getDate();

    const [hhStr, mmStr] = selectedTime.split(":");
    const hour = parseInt(hhStr);
    const minute = parseInt(mmStr);

    // KST -> UTC 변환해서 서버로 전송
    const start = new Date(Date.UTC(year, month, day, hour - 9, minute));
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const payload = {
      facilityId,
      userId,
      seatNumber: labelToSeatNumber(selectedRoom),
      startTime: toFirestoreTimestamp(start),
      endTime: toFirestoreTimestamp(end),
    };

    console.log("🚀 [예약 요청] Payload:", JSON.stringify(payload, null, 2));

    try {
      await axios.post("http://10.0.2.2:8080/api/reservations", payload);

      const endHour = hour + 2;
      Alert.alert(
        "예약 성공",
        `${selectedRoom}\n${selectedTime} - ${endHour}:00 예약되었습니다.`
      );

      setSelectedTime(null);

      //  예약 성공 후 재조회
      console.log("🔄 예약 성공! 목록 갱신을 위해 재조회합니다.");
      await fetchReservations();

      onReserved && onReserved();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409 || err.response?.data?.code === "DUPLICATE_RESERVATION") {
             Alert.alert("예약 실패", "이미 예약된 시간대입니다.");
             await fetchReservations(); 
             return;
        }
      }
      Alert.alert("예약 실패", "잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ... 안내 박스 등 위쪽 UI 생략 (그대로 둠) ... */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>이용 가능 룸</Text>
        <Text style={styles.infoCount}>{flatRooms.length}개실</Text>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <View style={[styles.statusColor, { borderColor: "#5D5FFE" }]} />
          <Text style={styles.statusText}>선택 가능</Text>
        </View>
        <View style={styles.statusItem}>
          <View style={[styles.statusColor, { backgroundColor: "#E0E0E0", borderColor: "#E0E0E0" }]} />
          <Text style={styles.statusText}>예약 불가</Text>
        </View>
        <View style={styles.statusItem}>
          <View style={[styles.statusColor, { backgroundColor: "#5D5FFE" }]} />
          <Text style={styles.statusText}>선택됨</Text>
        </View>
      </View>

      {roomRows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((room) => {
            const isSelected = selectedRoom === room;
            return (
              <TouchableOpacity
                key={room}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedRoom(room);
                  setSelectedTime(null);
                }}
                style={[styles.roomBtn, isSelected && styles.roomSelected]}
              >
                <Text style={[styles.roomText, isSelected && styles.textSelected]}>
                  {room}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <Text style={styles.timeTitle}>
        {selectedRoom ? `${selectedRoom} 시간 선택` : "룸을 먼저 선택해주세요"}
      </Text>

      <View style={styles.timeRow}>
        {timeSlots.map((time) => {
          const checkKey = `${selectedRoom}_${time}`;
          const isBooked = reservedTimes.includes(checkKey);
          const isSelected = selectedTime === time;

          return (
            <TouchableOpacity
              key={time}
              disabled={!selectedRoom || isBooked}
              onPress={() => {
                  console.log(`🖱️ 클릭한 시간: ${checkKey}, 예약여부: ${isBooked}`);
                  setSelectedTime(time);
              }}
              style={[
                styles.timeBtn,
                isSelected && styles.timeBtnSelected,
                isBooked && styles.timeBtnBooked, // 여기가 핵심!
                !selectedRoom && styles.timeBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.timeText,
                  isSelected && styles.timeTextSelected,
                  isBooked && styles.timeTextBooked,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedRoom && selectedTime && (
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>
            {selectedRoom} / {selectedTime} 시작
          </Text>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleReservation}
          >
            <Text style={styles.confirmText}>예약 완료</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 120, // 바텀시트 공간 확보
    alignItems: "center",
    backgroundColor: "#fff",
  },
  infoBox: {
    width: "90%",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    elevation: 2, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 12,
  },
  infoLabel: { fontWeight: "bold", color: "#333" },
  infoCount: { marginLeft: 10, color: "#5D5FFE", fontWeight: "bold" },

  statusRow: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "flex-end", // 오른쪽 정렬
    gap: 12,
    marginBottom: 16,
  },
  statusItem: { flexDirection: "row", alignItems: "center" },
  statusColor: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: { color: "#666", fontSize: 12 },

  row: { flexDirection: "row", flexWrap: "wrap", justifyContent:"center", marginBottom: 8 },

  roomBtn: {
    minWidth: 95,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5D5FFE",
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  roomSelected: { backgroundColor: "#5D5FFE" },
  roomText: {
    color: "#5D5FFE",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
  textSelected: { color: "#fff" },

  timeTitle: {
    width: "90%",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 24,
    marginBottom: 12,
    color: "#333",
  },
  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%",
    justifyContent: "flex-start",
  },
  timeBtn: {
    width: "22%", // 한 줄에 4개 정도 들어가게
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#5D5FFE",
    borderRadius: 8,
    marginRight: "3%", // 사이 간격
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  timeBtnSelected: { backgroundColor: "#5D5FFE" },
  timeBtnBooked: { 
    backgroundColor: "#F0F0F0", 
    borderColor: "#E0E0E0" 
  },
  timeBtnDisabled: { opacity: 0.3 },

  timeText: { color: "#5D5FFE", fontWeight: "500", fontSize: 13 },
  timeTextSelected: { color: "#fff" },
  timeTextBooked: { color: "#AAA" },

  bottomSheet: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: 24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sheetTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 16, color: "#333" },
  confirmBtn: {
    backgroundColor: "#5D5FFE",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});