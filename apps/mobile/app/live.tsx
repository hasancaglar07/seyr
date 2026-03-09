import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Screen, cardStyles } from "@/components/Screen";
import { getStreams } from "@/lib/api";
import { playStream, stopStream } from "@/lib/audio";
import type { Stream } from "@seyir/contracts";

export default function LiveScreen() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    getStreams().then(setStreams).catch(() => setStreams([]));
  }, []);

  return (
    <Screen title="Canlı Yayın" subtitle="Arkaplan çalma aktif">
      {streams.map((stream) => (
        <View key={stream.id} style={cardStyles.card}>
          <Text style={cardStyles.title}>{stream.name}</Text>
          <Text style={cardStyles.body}>{stream.streamUrl}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                await playStream(stream.streamUrl);
                setActiveId(stream.id);
              }}
            >
              <Text style={styles.buttonText}>Oynat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.outline]}
              onPress={async () => {
                await stopStream();
                setActiveId(null);
              }}
            >
              <Text style={[styles.buttonText, { color: "#154460" }]}>Durdur</Text>
            </TouchableOpacity>
          </View>
          {activeId === stream.id ? <Text style={styles.live}>Şu an çalıyor</Text> : null}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#145f82",
  },
  outline: {
    backgroundColor: "#e5eef3",
  },
  buttonText: {
    color: "#f7fbfd",
    fontWeight: "700",
  },
  live: {
    color: "#b43b2d",
    marginTop: 8,
    fontWeight: "600",
  },
});