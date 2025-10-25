import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TaskInstance } from "@/types";

interface TaskListProps {
  tasks: TaskInstance[];
  onToggleTask: (taskId: string) => void;
}

const categoryLabel: Record<string, string> = {
  wellbeing: "ウェルビーイング",
  health: "健康",
  movement: "運動",
  home: "家事",
  learning: "学習"
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>今日の習慣</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onToggleTask(item.id)}
            style={[styles.item, item.completed && styles.itemCompleted]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.completed }}
          >
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons
                name={item.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                size={26}
                color={item.completed ? "#10b981" : "#475569"}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>{categoryLabel[item.category]}</Text>
            </View>
            <Text style={styles.badge}>×{item.targetPerDay}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 20,
    marginBottom: 32
  },
  header: {
    color: "#e2e8f0",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16
  },
  itemCompleted: {
    backgroundColor: "rgba(16, 185, 129, 0.12)"
  },
  iconWrapper: {
    width: 36
  },
  textWrapper: {
    flex: 1
  },
  title: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600"
  },
  meta: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4
  },
  badge: {
    color: "#38bdf8",
    fontWeight: "700",
    fontSize: 16
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    marginVertical: 6
  }
});

export default TaskList;
