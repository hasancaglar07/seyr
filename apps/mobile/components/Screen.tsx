import { ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export function Screen({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#f5efe3",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#152a3a",
  },
  body: {
    marginTop: 6,
    color: "#4d6574",
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0b2335",
  },
  wrap: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    color: "#f5f2eb",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#caddec",
    marginTop: 4,
  },
});