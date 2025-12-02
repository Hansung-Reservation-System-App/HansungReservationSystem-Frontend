import React, { useEffect, useState } from "react";
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
  userId: string;
  facilityName: string;
  navigation: any;
};

export default function RoomReservationScreen({
  facilityId,
  userId,
  facilityName,
  navigation,
}: RoomReservationProps) {
  
  // 1. 예약 가능한 시간대 목록 (09:00 ~ 22:00)
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  // 이미 예약된 시간 (백엔드에서 받아올 데이터)
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  // 사용자가 선택한 시간
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    // TODO: 백엔드 API 연동 (시설 ID에 따른 예약된 시간 조회)
    // 지금은 테스트를 위해 임시로 '12:00', '13:00'이 이미 찼다고 가정합니다.
    setReservedTimes(["12:00", "13:00", "18:00"]);

    /* axios.get(`http://10.0.2.2:8080/api/reservations/rooms/${facilityId}`)
      .then(res => setReservedTimes(res.data.reservedTimes))
      .catch(err => console.error(err));
    */
  }, [facilityId]);

  const handleReservation = async () => {
    if (!selectedTime) return;

    // TODO: 실제 예약 API 호출
    console.log(`예약 요청: ${facilityName}, 시간: ${selectedTime}`);

    Alert.alert("예약 성공", `${selectedTime} 시간에 예약되었습니다.`, [
      {
        text: "확인",
        onPress: () => navigation.navigate("Home"), // 혹은 완료 화면으로 이동
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* 1. 상단 정보 박스 (좌석 화면과 동일 디자인) */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>이용 가능 시간</Text>
        <Text style={styles.infoCount}>
          {timeSlots.length - reservedTimes.length} 타임
        </Text>
      </View>

      {/* 2. 상태 설명 (좌석 화면과 동일 디자인) */}
      <View style={styles.statusLabelContainer}>
        <View style={styles.statusLabelItem}>
          <View style={[styles.statusColorBox, { borderColor: "#5D5FFE" }]} />
          <Text style={styles.statusLabelText}>예약 가능</Text>
        </View>

        <View style={styles.statusLabelItem}>
          <View style={[styles.statusColorBox, { backgroundColor: "#D9D9D9", borderColor: "#D9D9D9" }]} />
          <Text style={styles.statusLabelText}>마감됨</Text>
        </View>

        <View style={styles.statusLabelItem}>
          <View style={[styles.statusColorBox, { backgroundColor: "#5D5FFE", borderColor: "#5D5FFE" }]} />
          <Text style={styles.statusLabelText}>선택됨</Text>
        </View>
      </View>

      {/* 3. 시간 선택 그리드 (좌석 대신 시간 버튼) */}
      <View style={styles.gridContainer}>
        {timeSlots.map((time, index) => {
          const isReserved = reservedTimes.includes(time);
          const isSelected = selectedTime === time;

          return (
            <TouchableOpacity
              key={index}
              disabled={isReserved}
              onPress={() => setSelectedTime(time)}
              style={[
                styles.timeSlot,
                isReserved && styles.disabledSlot,
                isSelected && styles.selectedSlot,
              ]}
            >
              <Text
                style={[
                  styles.timeText,
                  isReserved && styles.disabledText,
                  isSelected && styles.selectedText,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. 하단 바텀 시트 (좌석 화면과 동일 로직) */}
      {selectedTime && (
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>
            선택한 시간: <Text style={{color:"#5D5FFE"}}>{selectedTime}</Text>
          </Text>
          <Text style={styles.sheetSubTitle}>
             1시간 이용이 가능합니다.
          </Text>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleReservation}
          >
            <Text style={styles.confirmText}>이 시간으로 예약하기</Text>
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
  );
}

/* 스타일은 SeatReservationScreen과 90% 유사하게 구성 */
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
    paddingBottom: 120, // 바텀시트 공간 확보
  },
  // 상단 정보 박스
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "90%",
    marginBottom: 20,
    elevation: 2, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoLabel: { fontWeight: "bold", color: "#444", fontSize: 16 },
  infoCount: { marginLeft: "auto", color: "#5D5FFE", fontWeight: "bold", fontSize: 18 },

  // 상태 라벨 (범례)
  statusLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // 간격 벌리기
    width: "85%",
    marginBottom: 20,
  },
  statusLabelItem: { flexDirection: "row", alignItems: "center" },
  statusColorBox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabelText: { fontSize: 14, color: "#555" },

  // 시간표 그리드 컨테이너
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // 줄바꿈 허용
    justifyContent: "space-between", // 양옆 정렬
    width: "90%",
  },
  // 개별 시간 버튼 스타일 (좌석 모양 변형)
  timeSlot: {
    width: "31%", // 한 줄에 3개씩 (여백 포함)
    aspectRatio: 2.2, // 직사각형 비율
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#5D5FFE",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  timeText: { color: "#5D5FFE", fontWeight: "600", fontSize: 16 },

  // 상태별 스타일
  disabledSlot: { backgroundColor: "#D9D9D9", borderColor: "#D9D9D9" },
  disabledText: { color: "#999" },
  selectedSlot: { backgroundColor: "#5D5FFE", borderColor: "#5D5FFE" },
  selectedText: { color: "#fff" },

  // 바텀 시트
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sheetTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 6, color:'#333' },
  sheetSubTitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  confirmButton: {
    backgroundColor: "#5D5FFE",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});