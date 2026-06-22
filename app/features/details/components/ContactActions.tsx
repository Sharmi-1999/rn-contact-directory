import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ContactActionsProps {
  phone?: string;
  email?: string;
}

export const ContactActions: React.FC<ContactActionsProps> = ({ phone, email }) => {
  const triggerCall = () => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert("Error", "Calling is not supported on this device");
    });
  };

  const triggerSMS = () => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    Linking.openURL(`sms:${cleanPhone}`).catch(() => {
      Alert.alert("Error", "SMS is not supported on this device");
    });
  };

  const triggerEmail = () => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Error", "Email is not supported on this device");
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.actionButton, !phone && styles.disabledButton]}
        onPress={triggerCall}
        disabled={!phone}
      >
        <Ionicons name="call" size={24} color={phone ? "#FFFFFF" : "#AAAAAA"} />
        <Text style={[styles.actionText, !phone && styles.disabledText]}>Call</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, !phone && styles.disabledButton]}
        onPress={triggerSMS}
        disabled={!phone}
      >
        <Ionicons name="chatbubble" size={24} color={phone ? "#FFFFFF" : "#AAAAAA"} />
        <Text style={[styles.actionText, !phone && styles.disabledText]}>SMS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, !email && styles.disabledButton]}
        onPress={triggerEmail}
        disabled={!email}
      >
        <Ionicons name="mail" size={24} color={email ? "#FFFFFF" : "#AAAAAA"} />
        <Text style={[styles.actionText, !email && styles.disabledText]}>Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    width: 80,
    height: 70,
  },
  disabledButton: {
    backgroundColor: "#E5E5EA",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  disabledText: {
    color: "#8E8E93",
  },
});

export default ContactActions;
