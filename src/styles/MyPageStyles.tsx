// src/screens/MyPageStyles.ts

import { StyleSheet } from "react-native";

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
// 🔹 로그아웃 + 정보수정 버튼 행
actionButtonsRow: {
  flexDirection: "row",
  marginHorizontal: 20,
  marginBottom: 16,
  gap: 8, // RN 버전이 낮으면 대신 각 버튼에 marginHorizontal 사용
},

// 🔹 정보 수정하기 버튼
editButton: {
  flex: 1,
  backgroundColor: "#FF3E8A",
  marginHorizontal: 0,      // 행 안에서 쓰니까 margin은 row에서 처리
  paddingVertical: 16,
  borderRadius: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#FF3E8A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
},

editButtonDisabled: {
  opacity: 0.5,
},

editButtonText: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
},

  // 🔹 로그아웃 버튼은 가로 분할을 위해 flex: 1 추가
logoutButton: {
  flex: 1,
  backgroundColor: "#FF3E8A",
  marginHorizontal: 0,      // 행 안에서 쓰니까 margin은 row에서 처리
  paddingVertical: 16,
  borderRadius: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#FF3E8A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
},

  logoutButtonText: {
    color: "#fff",
    fontSize: 15,
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

export default styles;