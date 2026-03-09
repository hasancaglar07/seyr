import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Screen, cardStyles } from "@/components/Screen";
import { getSchedule } from "@/lib/api";
import type { ScheduleEntry } from "@seyir/contracts";

const dayMap = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export default function ScheduleScreen() {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);

  useEffect(() => {
    getSchedule().then(setEntries).catch(() => setEntries([]));
  }, []);

  return (
    <Screen title="Yayın Akışı">
      {entries.map((entry) => (
        <View key={entry.id} style={cardStyles.card}>
          <Text style={cardStyles.title}>{entry.title}</Text>
          <Text style={cardStyles.body}>
            {dayMap[entry.dayOfWeek]} - {entry.startsAt}
          </Text>
          <Text style={cardStyles.body}>{entry.presenterName ?? "Seyr Yayın"}</Text>
        </View>
      ))}
    </Screen>
  );
}