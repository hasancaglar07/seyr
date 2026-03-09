import type { ComponentType } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabsNavigator = Tabs as any;
const IoniconsIcon = Ionicons as unknown as ComponentType<{
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
}>;

const tabIcon = (name: keyof typeof Ionicons.glyphMap) => ({ color, size }: { color: string; size: number }) => (
  <IoniconsIcon name={name} color={color} size={size} />
);

export default function RootLayout() {
  return (
    <TabsNavigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0b2335" },
        headerTintColor: "#f5f2eb",
        tabBarStyle: { backgroundColor: "#0b2335", borderTopColor: "#17384f" },
        tabBarActiveTintColor: "#ffb343",
        tabBarInactiveTintColor: "#9ab5c8",
      }}
    >
      <TabsNavigator.Screen name="index" options={{ title: "Ana", tabBarIcon: tabIcon("home") }} />
      <TabsNavigator.Screen name="live" options={{ title: "Canli", tabBarIcon: tabIcon("radio") }} />
      <TabsNavigator.Screen name="schedule" options={{ title: "Akis", tabBarIcon: tabIcon("calendar") }} />
      <TabsNavigator.Screen name="programs" options={{ title: "Programlar", tabBarIcon: tabIcon("list") }} />
      <TabsNavigator.Screen name="presenters" options={{ title: "Programcilar", tabBarIcon: tabIcon("people") }} />
      <TabsNavigator.Screen name="contact" options={{ title: "Iletisim", tabBarIcon: tabIcon("mail") }} />
      <TabsNavigator.Screen name="settings" options={{ title: "Ayarlar", tabBarIcon: tabIcon("settings") }} />
    </TabsNavigator>
  );
}
