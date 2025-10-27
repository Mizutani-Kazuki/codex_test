import { create } from "zustand";
import dayjs from "dayjs";
import { DailyLog, RankingItem, TaskInstance } from "@/types";
import { mockLogs, taskTemplates } from "@/data/mockData";

interface AppState {
  tasks: TaskInstance[];
  logs: DailyLog[];
  selectedDate: string;
  rankings: {
    positives: RankingItem[];
    negatives: RankingItem[];
  };
  initialize: () => void;
  toggleTask: (taskId: string) => void;
  updateDailyLog: (payload: { score: number; positives: string[]; negatives: string[] }) => void;
  setSelectedDate: (date: string) => void;
}

const computeRankings = (logs: DailyLog[]): { positives: RankingItem[]; negatives: RankingItem[] } => {
  const aggregate = (items: string[]) => items.reduce<Record<string, number>>((acc, label) => {
    if (!label) return acc;
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});

  const positiveCount = aggregate(logs.flatMap((log) => log.positives));
  const negativeCount = aggregate(logs.flatMap((log) => log.negatives));

  const toRanking = (map: Record<string, number>): RankingItem[] =>
    Object.entries(map)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

  return {
    positives: toRanking(positiveCount),
    negatives: toRanking(negativeCount)
  };
};

export const useAppStore = create<AppState>((set, get) => ({
  tasks: [],
  logs: [],
  selectedDate: dayjs().format("YYYY-MM-DD"),
  rankings: { positives: [], negatives: [] },
  initialize: () => {
    const today = dayjs().format("YYYY-MM-DD");
    const todaysLog = mockLogs.find((log) => log.date === today);

    set({
      tasks: taskTemplates.map((template): TaskInstance => ({
        ...template,
        completed: todaysLog?.completedTaskIds.includes(template.id) ?? false
      })),
      logs: mockLogs,
      rankings: computeRankings(mockLogs)
    });
  },
  toggleTask: (taskId) => {
    const { tasks, logs, selectedDate } = get();
    const nextTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const logIndex = logs.findIndex((log) => log.date === selectedDate);
    const nextLogs = [...logs];

    if (logIndex >= 0) {
      const log = nextLogs[logIndex];
      const completedTaskIds = new Set(log.completedTaskIds);
      if (completedTaskIds.has(taskId)) {
        completedTaskIds.delete(taskId);
      } else {
        completedTaskIds.add(taskId);
      }
      nextLogs[logIndex] = {
        ...log,
        completedTaskIds: Array.from(completedTaskIds)
      };
    } else {
      nextLogs.push({
        date: selectedDate,
        score: 70,
        positives: [],
        negatives: [],
        completedTaskIds: [taskId]
      });
    }

    set({
      tasks: nextTasks,
      logs: nextLogs,
      rankings: computeRankings(nextLogs)
    });
  },
  updateDailyLog: ({ score, positives, negatives }) => {
    const { logs, selectedDate } = get();
    const logIndex = logs.findIndex((log) => log.date === selectedDate);
    const nextLogs = [...logs];

    if (logIndex >= 0) {
      nextLogs[logIndex] = {
        ...nextLogs[logIndex],
        score,
        positives,
        negatives
      };
    } else {
      nextLogs.push({
        date: selectedDate,
        score,
        positives,
        negatives,
        completedTaskIds: []
      });
    }

    set({
      logs: nextLogs,
      rankings: computeRankings(nextLogs)
    });
  },
  setSelectedDate: (date) => set({ selectedDate: date })
}));
