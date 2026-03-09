import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Screen, cardStyles } from "@/components/Screen";
import { getPrograms } from "@/lib/api";
import type { Program } from "@seyir/contracts";

export default function ProgramsScreen() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    getPrograms().then(setPrograms).catch(() => setPrograms([]));
  }, []);

  return (
    <Screen title="Programlar">
      {programs.map((program) => (
        <View key={program.id} style={cardStyles.card}>
          <Text style={cardStyles.title}>{program.title}</Text>
          <Text style={cardStyles.body}>{program.summary}</Text>
        </View>
      ))}
    </Screen>
  );
}