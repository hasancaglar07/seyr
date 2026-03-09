import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Screen, cardStyles } from "@/components/Screen";
import { getHome } from "@/lib/api";
import type { HomeResponse } from "@seyir/contracts";

export default function HomeScreen() {
  const [data, setData] = useState<HomeResponse | null>(null);

  useEffect(() => {
    getHome().then(setData).catch(() => setData(null));
  }, []);

  return (
    <Screen title="SeyrDijital" subtitle="Mobil V1 - misafir kullanım">
      <View style={cardStyles.card}>
        <Text style={cardStyles.title}>Canlı Kanallar</Text>
        <Text style={cardStyles.body}>{data?.streams.length ?? 0} aktif kanal</Text>
      </View>
      <View style={cardStyles.card}>
        <Text style={cardStyles.title}>Öne Çıkan Programlar</Text>
        {data?.featuredPrograms.map((program) => (
          <Text key={program.id} style={styles.item}>{program.title}</Text>
        ))}
      </View>
      <View style={cardStyles.card}>
        <Text style={cardStyles.title}>Duyurular</Text>
        {data?.announcements.map((note) => (
          <Text key={note.id} style={styles.item}>{note.title}</Text>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    marginTop: 6,
    color: "#264456",
  },
});