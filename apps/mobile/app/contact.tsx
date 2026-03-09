import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/Screen";
import { sendContactMessage } from "@/lib/api";

export default function ContactScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const submit = async () => {
    try {
      await sendContactMessage({ fullName, email, subject, message });
      setStatus("sent");
      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Screen title="İletişim">
      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Ad Soyad" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="E-posta" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Konu" value={subject} onChangeText={setSubject} />
        <TextInput style={[styles.input, styles.area]} placeholder="Mesaj" value={message} onChangeText={setMessage} multiline />
        <Pressable style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Gönder</Text>
        </Pressable>
        {status === "sent" ? <Text style={styles.ok}>Mesajınız gönderildi.</Text> : null}
        {status === "error" ? <Text style={styles.err}>Mesaj gönderilemedi.</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5efe3",
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d3dee6",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  area: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#145f82",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#f7fbfd",
    fontWeight: "700",
  },
  ok: {
    color: "#0f6a4f",
  },
  err: {
    color: "#b03e34",
  },
});