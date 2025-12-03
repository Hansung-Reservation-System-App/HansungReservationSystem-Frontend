// src/screens/SeatReservationScreen.tsx
import React, { useEffect, useState } from "react";
import { Alert } from "react-native"; // 맨 위 import 에 추가
import RoomReservationScreen from "./RoomReservationScreen";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";

type SeatReservationProps = {
  facilityId: string;
  userId: string | null;
  facilityName: string;
  navigation: any;
  onReserved: () => void; 
};

export default function SeatReservationScreen({
  facilityId,
  userId,
  facilityName,
  navigation,
  onReserved,
}: SeatReservationProps) {
  // Firestore Timestamp JSON 생성 함수
const toFirestoreTimestamp = (date: Date) => ({
  seconds: Math.floor(date.getTime() / 1000), // ✅ 이름 변경
  nanos: 0,                                   // ✅ 이름 변경
});


  const addHours = (date: Date, hours: number) =>
    new Date(date.getTime() + hours * 60 * 60 * 1000);

  const seatRows = [
    ["A1","A2","A3","A4","A5","A6","A7"],
    ["B1","B2","B3","B4","B5","B6","B7"],
    ["C1","C2","C3","C4","C5","C6","C7"],
    ["D1","D2","D3","D4","D5","D6","D7"],
    ["E1","E2","E3","E4","E5","E6","E7"],
    ["F1","F2","F3","F4","F5","F6","F7"],
    ["G1","G2","G3","G4","G5","G6","G7"],
  ];

  const [reservedLabels, setReservedLabels] = useState<string[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const seatNumberToLabel = (num: number) => {
    const rowIndex = Math.floor((num - 1) / 7);
    const colIndex = (num - 1) % 7 + 1;
    const rowLetter = String.fromCharCode(65 + rowIndex);
    return `${rowLetter}${colIndex}`;
  };

  useEffect(() => {
    axios
      .get(`http://10.0.2.2:8080/api/reservations/seats/${facilityId}`)
      .then((res) => {
        const seatNumbers: number[] = res.data.data;
        const labels = seatNumbers.map((num) => seatNumberToLabel(num));
        setReservedLabels(labels);
      })
      .catch((err) => console.error("예약 좌석 조회 실패:", err));
  }, [facilityId]); // 여기는 옵션이지만 있으면 더 안전

  const labelToSeatNumber = (label: string) => {
    const rowLetter = label.charAt(0);
    const col = parseInt(label.substring(1), 10);
    const rowIndex = rowLetter.charCodeAt(0) - 65;
    return rowIndex * 7 + col;
  };


// 예약하기
const handleReservation = async () => {
  if (!selectedSeat) return;

  // ⭐ userId null 체크 추가
  if (!userId) {
    Alert.alert("예약 실패", "로그인 정보가 없습니다. 다시 로그인해주세요.");
    return;
  }

  const response = await axios.get(
    `http://10.0.2.2:8080/api/reservations/seats/${facilityId}`
  );

  const reservedSeats = response.data.data;

  const seatNumber = labelToSeatNumber(selectedSeat);
  const now = new Date();
  const end = addHours(now, 2);

  const payload = {
    facilityId,
    userId,  // ⭐ 이 시점에서는 string 보장됨
    seatNumber,
    startTime: toFirestoreTimestamp(now),
    endTime: toFirestoreTimestamp(end),
  };

  console.log("[SeatReservationScreen] 예약 payload");
  console.log(payload);

  try {
    await axios.post("http://10.0.2.2:8080/api/reservations", payload);

    Alert.alert(
      "예약 완료",
      `${facilityName} ${selectedSeat} 좌석이 예약되었습니다.`
    );

    onReserved && onReserved();

  } catch (err) {
    console.error("예약 실패:", err);
    Alert.alert("예약 실패", "잠시 후 다시 시도해주세요.");
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* 상단: 잔여 좌석 */}
      <View style={styles.seatInfoBox}>
        <Text style={styles.seatInfoLabel}>이용 가능</Text>
        <Text style={styles.seatInfoCount}>
          {49 - reservedLabels.length}석
        </Text>
      </View>

      {/* 상태 라벨 */}
      <View style={styles.statusLabelContainer}>
        <View style={styles.statusLabelItem}>
          <View style={[styles.statusColorBox, { borderColor: "#5D5FFE" }]} />
          <Text style={styles.statusLabelText}>선택 가능</Text>
        </View>

        <View style={styles.statusLabelItem}>
          <View style={[styles.statusColorBox, { backgroundColor: "#D9D9D9" }]} />
          <Text style={styles.statusLabelText}>사용 중</Text>
        </View>

        <View style={styles.statusLabelItem}>
          <View style={[styles.statusColorBox, { backgroundColor: "#5D5FFE" }]} />
          <Text style={styles.statusLabelText}>선택됨</Text>
        </View>
      </View>

      {/* 좌석 UI */}
      {seatRows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((seat) => {
            const isReserved = reservedLabels.includes(seat);
            const isSelected = selectedSeat === seat;

            return (
              <TouchableOpacity
                key={seat}
                disabled={isReserved}
                onPress={() => setSelectedSeat(seat)}
                style={[
                  styles.seat,
                  isReserved && styles.disabledSeat,
                  isSelected && styles.selectedSeat,
                ]}
              >
                <Text
                  style={[
                    styles.seatText,
                    isReserved && styles.disabledSeatText,
                    isSelected && styles.selectedSeatText,
                  ]}
                >
                  {seat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* 예약 버튼 Bottom Sheet */}
      {selectedSeat && (
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>
            선택한 좌석: {selectedSeat}
          </Text>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleReservation}
          >
            <Text style={styles.confirmText}>좌석 예약하기</Text>
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
  );
}

/* ---------------------- styles 그대로 ---------------------- */
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
    paddingBottom: 120,
  },
  seatInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: "90%",
    marginBottom: 15,
    elevation: 2,
  },
  seatInfoLabel: { fontWeight: "bold", color: "#444" },
  seatInfoCount: { marginLeft: 10, color: "#5D5FFE", fontWeight: "bold" },
  row: { flexDirection: "row", marginBottom: 10 },
  seat: {
    width: 45,
    height: 45,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#5D5FFE",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  seatText: { color: "#5D5FFE", fontWeight: "600" },
  disabledSeat: {
    backgroundColor: "#D9D9D9",
    borderColor: "#aaa",
  },
  disabledSeatText: { color: "#999" },
  selectedSeat: { backgroundColor: "#5D5FFE" },
  selectedSeatText: { color: "#fff" },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  sheetTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  confirmButton: {
    backgroundColor: "#5D5FFE",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  statusLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  statusLabelItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusColorBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabelText: {
    fontSize: 14,
    color: "#555",
  },
});