import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function SeatReservationScreen({ facility }:any) {
  const seatRows = [
    ["A1","A2","A3","A4","A5","A6","A7"],
    ["B1","B2","B3","B4","B5","B6","B7"],
    ["C1","C2","C3","C4","C5","C6","C7"],
    ["D1","D2","D3","D4","D5","D6","D7"],
    ["E1","E2","E3","E4","E5","E6","E7"],
    ["F1","F2","F3","F4","F5","F6","F7"],
    ["G1","G2","G3","G4","G5","G6","G7"],
  ];

  const disabledSeats = ["B4", "C3", "D5", "F2"];
  const [seatState, setSeatState] = useState("available");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* 예약 요약 */}
      <View style={styles.seatInfoBox}>
        <Text style={styles.seatInfoLabel}>이용 가능</Text>
        <Text style={styles.seatInfoCount}>26석</Text>
        <Text style={styles.timeRight}>현재 시간 11:28</Text>
      </View>

      {/* 좌석 상태 표기 (라벨 스타일) */}  
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

      {/* 좌석 배치 */}
      {seatRows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((seat) => {
            const isDisabled = disabledSeats.includes(seat);
            const isSelected = selectedSeat === seat;

            return (
              <TouchableOpacity
                key={seat}
                disabled={isDisabled}
                onPress={() => setSelectedSeat(seat)}
                style={[
                  styles.seat,
                  isDisabled && styles.disabledSeat,
                  isSelected && styles.selectedSeat,
                ]}
              >
                <Text
                  style={[
                    styles.seatText,
                    isDisabled && styles.disabledSeatText,
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

      {/* Bottom Sheet */}
      {selectedSeat && (
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>
            선택한 좌석: {selectedSeat}
          </Text>

          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmText}>좌석 예약하기</Text>
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
  );
}

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
  timeRight: { marginLeft: "auto", color: "#444" },

  statusToggle: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginBottom: 20,
  },
  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#EDEDED",
  },
  statusBtnActive: { backgroundColor: "#A36CF7" },
  statusText: { color: "#666" },
  statusTextActive: { color: "#fff", fontWeight: "bold" },

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
  borderColor: "#5D5FFE",   // ✔️ 이걸 회색 → 파란색으로 변경
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
