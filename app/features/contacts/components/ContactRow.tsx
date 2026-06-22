import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ContactItem } from "../../../store/contactsSlice";
import { Avatar } from "./Avatar";

interface ContactRowProps {
  contact: ContactItem;
  nickname?: string;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const ContactRow: React.FC<ContactRowProps> = ({
  contact,
  nickname,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  const primaryPhone = contact.phoneNumbers && contact.phoneNumbers.length > 0
    ? contact.phoneNumbers[0].number
    : "No phone number";

  const displayName = nickname
    ? `${contact.name} (${nickname})`
    : contact.name;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <Avatar name={contact.name} uri={contact.imageUri} />
        <View style={styles.infoContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.phoneText} numberOfLines={1}>
            {primaryPhone}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
        <Ionicons
          name={isFavorite ? "star" : "star-outline"}
          size={24}
          color={isFavorite ? "#FFD700" : "#CCCCCC"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  phoneText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  favoriteButton: {
    padding: 8,
  },
});

export default ContactRow;
