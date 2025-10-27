import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { CalendarDayScore, RankingItem } from "@/types";

interface HistorySectionProps {
  days: CalendarDayScore[];
  positiveRanking: RankingItem[];
  negativeRanking: RankingItem[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ days, positiveRanking, negativeRanking }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>振り返り</Text>
      <Text style={styles.subtitle}>過去のスコアと気づきをチェック</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarRow}>
        {days.map((day) => (
          <View key={day.date} style={styles.dayCard}>
            <Text style={styles.dayLabel}>{day.date.slice(5)}</Text>
            <Text style={styles.dayScore}>{day.score}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.rankingRow}>
        <View style={styles.rankingCard}>
          <Text style={styles.rankingTitle}>プラス要因ランキング</Text>
          <FlatList
            data={positiveRanking}
            keyExtractor={(item) => item.label}
            renderItem={({ item, index }) => (
              <View style={styles.rankingItem}>
                <Text style={styles.rankingIndex}>{index + 1}</Text>
                <Text style={styles.rankingLabel}>{item.label}</Text>
                <Text style={styles.rankingCount}>{item.count}回</Text>
              </View>
            )}
          />
        </View>
        <View style={[styles.rankingCard, styles.negativeRanking]}>
          <Text style={styles.rankingTitle}>マイナス要因ランキング</Text>
          <FlatList
            data={negativeRanking}
            keyExtractor={(item) => item.label}
            renderItem={({ item, index }) => (
              <View style={styles.rankingItem}>
                <Text style={[styles.rankingIndex, styles.negativeIndex]}>{index + 1}</Text>
                <Text style={styles.rankingLabel}>{item.label}</Text>
                <Text style={[styles.rankingCount, styles.negativeCount]}>{item.count}回</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 20
  },
  title: {
    color: "#f1f5f9",
    fontSize: 22,
    fontWeight: "700"
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14
  },
  calendarRow: {
    marginTop: 12
  },
  dayCard: {
    width: 90,
    height: 100,
    borderRadius: 18,
    backgroundColor: "rgba(14, 165, 233, 0.16)",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  dayLabel: {
    color: "#bae6fd",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600"
  },
  dayScore: {
    color: "#0ea5e9",
    fontSize: 28,
    fontWeight: "700"
  },
  rankingRow: {
    flexDirection: "row",
    gap: 16
  },
  rankingCard: {
    flex: 1,
    backgroundColor: "rgba(15, 118, 110, 0.12)",
    borderRadius: 20,
    padding: 16
  },
  negativeRanking: {
    backgroundColor: "rgba(185, 28, 28, 0.12)"
  },
  rankingTitle: {
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8
  },
  rankingIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(45, 212, 191, 0.3)",
    textAlign: "center",
    textAlignVertical: "center",
    color: "#0f172a",
    fontWeight: "700"
  },
  negativeIndex: {
    backgroundColor: "rgba(248, 113, 113, 0.4)",
    color: "#fee2e2"
  },
  rankingLabel: {
    flex: 1,
    marginHorizontal: 12,
    color: "#e2e8f0",
    fontSize: 15
  },
  rankingCount: {
    color: "#0f766e",
    fontWeight: "700"
  },
  negativeCount: {
    color: "#b91c1c"
  }
});

export default HistorySection;
