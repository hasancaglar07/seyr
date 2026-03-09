import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Screen, cardStyles } from "@/components/Screen";
import { getPresenters } from "@/lib/api";
import type { Presenter } from "@seyir/contracts";

export default function PresentersScreen() {
  const [presenters, setPresenters] = useState<Presenter[]>([]);

  useEffect(() => {
    getPresenters().then(setPresenters).catch(() => setPresenters([]));
  }, []);

  return (
    <Screen title="Programcılar">
      {presenters.map((presenter) => (
        <View key={presenter.id} style={cardStyles.card}>
          <Text style={cardStyles.title}>{presenter.fullName}</Text>
          <Text style={cardStyles.body}>{presenter.bio}</Text>
        </View>
      ))}
    </Screen>
  );
}