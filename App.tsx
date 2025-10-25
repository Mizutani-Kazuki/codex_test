import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAppStore } from "@/store/useAppStore";
import WaveHeader from "@/components/WaveHeader";
import TaskList from "@/components/TaskList";
import DailyLogModal from "@/components/DailyLogModal";
import HistorySection from "@/components/HistorySection";
import { CalendarDayScore } from "@/types";

const App: React.FC = () => {
  const initialize = useAppStore((state) => state.initialize);
  const tasks = useAppStore((state) => state.tasks);
  const logs = useAppStore((state) => state.logs);
  const rankings = useAppStore((state) => state.rankings);
  const toggleTask = useAppStore((state) => state.toggleTask);
  const updateDailyLog = useAppStore((state) => state.updateDailyLog);
  const selectedDate = useAppStore((state) => state.selectedDate);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const todayLog = useMemo(() => logs.find((log) => log.date === selectedDate), [logs, selectedDate]);

  const calendarData: CalendarDayScore[] = useMemo(
    () =>
      logs
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((log) => ({ date: log.date, score: log.score }))
        .slice(0, 10),
    [logs]
  );

  const streakDays = useMemo(() => {
    const sortedLogs = logs.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    let streak = 0;
    for (const log of sortedLogs) {
      if (log.completedTaskIds.length > 0) {
        streak += 1;
      } else {
        break;
      }
    }
    return Math.max(1, streak);
  }, [logs]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.appTitle}>毎日まめ</Text>
          <Text style={styles.tagline}>豆のように小さな習慣をコツコツと。</Text>
        </View>
        <WaveHeader
          score={todayLog?.score ?? 72}
          streakDays={streakDays}
          onPress={() => setIsModalOpen(true)}
        />
        <TaskList tasks={tasks} onToggleTask={toggleTask} />
        <HistorySection
          days={calendarData}
          positiveRanking={rankings.positives}
          negativeRanking={rankings.negatives}
        />
      </ScrollView>
      <DailyLogModal
        visible={isModalOpen}
        initialScore={todayLog?.score ?? 0}
        initialPositives={todayLog?.positives ?? []}
        initialNegatives={todayLog?.negatives ?? []}
        onClose={() => setIsModalOpen(false)}
        onSave={updateDailyLog}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617"
  },
  container: {
    padding: 24,
    paddingBottom: 64
  },
  headerSection: {
    marginBottom: 24
  },
  appTitle: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800"
  },
  tagline: {
    color: "#94a3b8",
    fontSize: 16,
    marginTop: 6
  }
});

export default App;
