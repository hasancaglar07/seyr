import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Screen, cardStyles } from "@/components/Screen";
import { registerForPushNotifications } from "@/lib/notifications";

export default function SettingsScreen() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotifications().then(setToken).catch(() => setToken(null));
  }, []);

  return (
    <Screen title="Ayarlar" subtitle="Push + teknik bilgiler">
      <View style={cardStyles.card}>
        <Text style={cardStyles.title}>Bildirim Durumu</Text>
        <Text style={cardStyles.body}>{token ? "Push izinli" : "Push izni yok veya simülatör"}</Text>
        {token ? <Text style={styles.token}>{token}</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  token: {
    marginTop: 8,
    fontSize: 12,
    color: "#4d6574",
  },
});