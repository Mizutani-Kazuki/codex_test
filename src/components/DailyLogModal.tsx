import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface DailyLogModalProps {
  visible: boolean;
  initialScore: number;
  initialPositives: string[];
  initialNegatives: string[];
  onClose: () => void;
  onSave: (payload: { score: number; positives: string[]; negatives: string[] }) => void;
}

const presetPositives = ["早起きできた", "散歩", "集中できた", "栄養バランス◎"];
const presetNegatives = ["夜更かし", "間食", "運動不足", "気分が落ち込んだ"];

const DailyLogModal: React.FC<DailyLogModalProps> = ({
  visible,
  initialScore,
  initialPositives,
  initialNegatives,
  onClose,
  onSave
}) => {
  const [score, setScore] = useState(
    initialScore !== undefined ? String(initialScore) : ""
  );
  const [positives, setPositives] = useState<string[]>(initialPositives);
  const [negatives, setNegatives] = useState<string[]>(initialNegatives);
  const [positiveInput, setPositiveInput] = useState("");
  const [negativeInput, setNegativeInput] = useState("");

  useEffect(() => {
    if (visible) {
      setScore(initialScore !== undefined ? String(initialScore) : "");
      setPositives(initialPositives);
      setNegatives(initialNegatives);
      setPositiveInput("");
      setNegativeInput("");
    }
  }, [initialScore, initialPositives, initialNegatives, visible]);

  const handleSubmit = () => {
    const numericScore = Number(score) || 0;
    onSave({
      score: Math.max(0, Math.min(100, numericScore)),
      positives,
      negatives
    });
    onClose();
  };

  const handleAddTag = (type: "positive" | "negative", value: string) => {
    if (!value) return;
    if (type === "positive" && !positives.includes(value)) {
      setPositives([...positives, value]);
    }
    if (type === "negative" && !negatives.includes(value)) {
      setNegatives([...negatives, value]);
    }
  };

  const handleRemoveTag = (type: "positive" | "negative", value: string) => {
    if (type === "positive") {
      setPositives(positives.filter((item) => item !== value));
    } else {
      setNegatives(negatives.filter((item) => item !== value));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>今日の記録</Text>
            <Pressable onPress={onClose} accessibilityRole="button">
              <MaterialCommunityIcons name="close" size={26} color="#cbd5f5" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.block}>
              <Text style={styles.label}>1日のスコア (0-100)</Text>
              <TextInput
                value={score}
                onChangeText={setScore}
                keyboardType="number-pad"
                placeholder="75"
                placeholderTextColor="#64748b"
                style={styles.input}
              />
            </View>
            <View style={styles.block}>
              <Text style={styles.label}>プラスに影響したこと</Text>
              <View style={styles.tagRow}>
                {positives.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => handleRemoveTag("positive", item)}
                    style={styles.tag}
                  >
                    <Text style={styles.tagText}>{item}</Text>
                    <MaterialCommunityIcons name="close" size={16} color="#0f172a" />
                  </Pressable>
                ))}
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  value={positiveInput}
                  onChangeText={setPositiveInput}
                  placeholder="例: 朝散歩"
                  placeholderTextColor="#64748b"
                  style={[styles.input, styles.flex]}
                />
                <Pressable
                  style={styles.addButton}
                  onPress={() => {
                    handleAddTag("positive", positiveInput.trim());
                    setPositiveInput("");
                  }}
                >
                  <Text style={styles.addButtonLabel}>追加</Text>
                </Pressable>
              </View>
              <View style={styles.suggestionRow}>
                {presetPositives.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => handleAddTag("positive", item)}
                    style={styles.suggestion}
                  >
                    <Text style={styles.suggestionText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.block}>
              <Text style={styles.label}>マイナスに影響したこと</Text>
              <View style={styles.tagRow}>
                {negatives.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => handleRemoveTag("negative", item)}
                    style={styles.tagNegative}
                  >
                    <Text style={styles.tagNegativeText}>{item}</Text>
                    <MaterialCommunityIcons name="close" size={16} color="#fee2e2" />
                  </Pressable>
                ))}
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  value={negativeInput}
                  onChangeText={setNegativeInput}
                  placeholder="例: 夜更かし"
                  placeholderTextColor="#64748b"
                  style={[styles.input, styles.flex]}
                />
                <Pressable
                  style={[styles.addButton, styles.negativeButton]}
                  onPress={() => {
                    handleAddTag("negative", negativeInput.trim());
                    setNegativeInput("");
                  }}
                >
                  <Text style={styles.addButtonLabel}>追加</Text>
                </Pressable>
              </View>
              <View style={styles.suggestionRow}>
                {presetNegatives.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => handleAddTag("negative", item)}
                    style={styles.suggestionNegative}
                  >
                    <Text style={styles.suggestionNegativeText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
          <Pressable style={styles.saveButton} onPress={handleSubmit} accessibilityRole="button">
            <Text style={styles.saveButtonLabel}>記録を保存</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.84)",
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%"
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomColor: "rgba(148, 163, 184, 0.1)",
    borderBottomWidth: 1
  },
  sheetTitle: {
    color: "#f1f5f9",
    fontSize: 20,
    fontWeight: "700"
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  block: {
    marginBottom: 24
  },
  label: {
    color: "#cbd5f5",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12
  },
  input: {
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 12
  },
  flex: {
    flex: 1
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#67e8f9",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6
  },
  tagText: {
    color: "#0f172a",
    fontWeight: "700"
  },
  tagNegative: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7f1d1d",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6
  },
  tagNegativeText: {
    color: "#fee2e2",
    fontWeight: "700"
  },
  addButton: {
    backgroundColor: "#22d3ee",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  negativeButton: {
    backgroundColor: "#f87171"
  },
  addButtonLabel: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 16
  },
  suggestionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  suggestion: {
    borderRadius: 999,
    backgroundColor: "rgba(103, 232, 249, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  suggestionText: {
    color: "#67e8f9",
    fontWeight: "600"
  },
  suggestionNegative: {
    borderRadius: 999,
    backgroundColor: "rgba(248, 113, 113, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  suggestionNegativeText: {
    color: "#fca5a5",
    fontWeight: "600"
  },
  saveButton: {
    backgroundColor: "#38bdf8",
    paddingVertical: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28
  },
  saveButtonLabel: {
    color: "#0f172a",
    fontWeight: "800",
    fontSize: 18,
    textAlign: "center"
  }
});

export default DailyLogModal;
