import { DailyLog, TaskTemplate } from "@/types";
import dayjs from "dayjs";

export const taskTemplates: TaskTemplate[] = [
  {
    id: "stretch",
    title: "ストレッチ",
    description: "朝の3分ストレッチで身体を目覚めさせる",
    category: "movement",
    targetPerDay: 1
  },
  {
    id: "hydrate",
    title: "こまめな水分補給",
    description: "500ml の水筒を1本飲み切る",
    category: "health",
    targetPerDay: 1
  },
  {
    id: "reset-desk",
    title: "デスクリセット",
    description: "仕事終わりに机を片付ける",
    category: "home",
    targetPerDay: 1
  },
  {
    id: "journal",
    title: "今日の振り返り日記",
    description: "良かったことを3つ書き出す",
    category: "wellbeing",
    targetPerDay: 1
  }
];

const today = dayjs();

export const mockLogs: DailyLog[] = Array.from({ length: 8 }).map((_, index) => {
  const date = today.subtract(index, "day");
  const score = Math.max(40, Math.min(100, 85 - index * 4 + (index % 3 === 0 ? 5 : 0)));
  const positives = ["早起きできた", "散歩", "水分補給"].slice(0, (index % 3) + 1);
  const negatives = index % 2 === 0 ? ["夜更かし"] : ["間食が多かった", "集中できなかった"];

  return {
    date: date.format("YYYY-MM-DD"),
    score,
    positives,
    negatives,
    completedTaskIds: taskTemplates
      .filter((_, taskIndex) => taskIndex % 2 === index % 2)
      .map((task) => task.id)
  };
});
