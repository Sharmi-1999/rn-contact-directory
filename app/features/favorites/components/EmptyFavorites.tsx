import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const EmptyFavorites: React.FC = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="star-outline" size={64} color="#CCCCCC" />
      <Text style={styles.title}>No Favorites Yet</Text>
      <Text style={styles.subtitle}>
        Tap the star icon next to contacts in the Directory tab to add them here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 64,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666666",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});

export default EmptyFavorites;
