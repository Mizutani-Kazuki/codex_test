import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface WaveHeaderProps {
  score: number;
  streakDays: number;
  onPress: () => void;
}

const WaveHeader: React.FC<WaveHeaderProps> = ({ score, streakDays, onPress }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 3200,
          useNativeDriver: true
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 3200,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12]
  });

  const wavePath = useMemo(
    () =>
      score >= 80
        ? "M0 70 Q 90 40 180 70 T 360 70 V140 H0 Z"
        : score >= 60
        ? "M0 80 Q 90 55 180 80 T 360 80 V140 H0 Z"
        : "M0 90 Q 90 70 180 90 T 360 90 V140 H0 Z",
    [score]
  );

  return (
    <Pressable onPress={onPress} style={styles.container} accessibilityRole="button">
      <Text style={styles.title}>今日の豆スコア</Text>
      <View style={styles.scoreRow}>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreUnit}>/ 100</Text>
      </View>
      <Text style={styles.streakLabel}>連続達成 {streakDays} 日目</Text>
      <Animated.View style={[styles.waveWrapper, { transform: [{ translateY }] }]}
        accessibilityIgnoresInvertColors>
        <Svg width="100%" height="140" viewBox="0 0 360 140">
          <Path d="M0 0 H360 V70 H0 Z" fill="#38bdf8" opacity={0.35} />
          <Path d="M0 20 H360 V90 H0 Z" fill="#0ea5e9" opacity={0.5} />
          <Path d={wavePath} fill="#0284c7" />
        </Svg>
      </Animated.View>
      <Text style={styles.cta}>タップして今日の記録をつける</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    overflow: "hidden",
    marginBottom: 24
  },
  title: {
    color: "#bae6fd",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 12
  },
  scoreValue: {
    color: "#f8fafc",
    fontSize: 56,
    fontWeight: "700"
  },
  scoreUnit: {
    color: "#cbd5f5",
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 4
  },
  streakLabel: {
    color: "#93c5fd",
    fontSize: 16,
    marginTop: 4,
    fontWeight: "500"
  },
  waveWrapper: {
    position: "absolute",
    bottom: -30,
    left: 0,
    right: 0
  },
  cta: {
    color: "#bae6fd",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16
  }
});

export default WaveHeader;
