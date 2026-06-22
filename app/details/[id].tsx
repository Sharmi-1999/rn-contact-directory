import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../store/store";
import { saveNicknameThunk, toggleFavoriteThunk } from "../store/contactsSlice";
import { Avatar } from "../features/contacts/components/Avatar";
import { ContactActions } from "../features/details/components/ContactActions";
import { NicknameManager } from "../features/details/components/NicknameManager";
import { Ionicons } from "@expo/vector-icons";

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { contacts, favorites, nicknames } = useAppSelector((state) => state.contacts);

  const contact = contacts.find((c) => c.id === id);
  const nickname = nicknames[id];
  const isFavorite = favorites.includes(id);

  if (!contact) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Contact not found</Text>
      </View>
    );
  }

  const handleSaveNickname = (newNickname: string) => {
    dispatch(saveNicknameThunk({ id, nickname: newNickname }));
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteThunk(id));
  };

  const formatBirthday = (b?: typeof contact.birthday) => {
    if (!b || b.day === undefined || b.month === undefined) return null;
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthStr = months[b.month - 1] || "";
    return `${monthStr} ${b.day}${b.year ? `, ${b.year}` : ""}`;
  };

  const primaryPhone = contact.phoneNumbers?.[0]?.number;
  const primaryEmail = contact.emails?.[0]?.email;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Avatar name={contact.name} uri={contact.imageUri} size={100} />
        <View style={styles.nameRow}>
          <Text style={styles.nameText}>{contact.name}</Text>
          <TouchableOpacity style={styles.favoriteIcon} onPress={handleToggleFavorite}>
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={28}
              color={isFavorite ? "#FFD700" : "#CCCCCC"}
            />
          </TouchableOpacity>
        </View>
        {contact.company || contact.jobTitle ? (
          <Text style={styles.companyText}>
            {contact.jobTitle}
            {contact.jobTitle && contact.company ? " at " : ""}
            {contact.company}
          </Text>
        ) : null}
      </View>

      <ContactActions phone={primaryPhone} email={primaryEmail} />

      <NicknameManager nickname={nickname} onSave={handleSaveNickname} />

      <View style={styles.detailsCard}>
        {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phone Numbers</Text>
            {contact.phoneNumbers.map((p, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{p.label}</Text>
                <Text style={styles.detailValue}>{p.number}</Text>
              </View>
            ))}
          </View>
        )}

        {contact.emails && contact.emails.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email Addresses</Text>
            {contact.emails.map((e, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{e.label}</Text>
                <Text style={styles.detailValue}>{e.email}</Text>
              </View>
            ))}
          </View>
        )}

        {contact.addresses && contact.addresses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Addresses</Text>
            {contact.addresses.map((a, index) => {
              const addrString = [a.street, a.city, a.region, a.postalCode, a.country]
                .filter(Boolean)
                .join(", ");
              return (
                <View key={index} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>address</Text>
                  <Text style={styles.detailValue}>{addrString}</Text>
                </View>
              );
            })}
          </View>
        )}

        {contact.birthday && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Birthday</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>date</Text>
              <Text style={styles.detailValue}>{formatBirthday(contact.birthday)}</Text>
            </View>
          </View>
        )}

        {contact.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>{contact.note}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 32,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  favoriteIcon: {
    marginLeft: 12,
  },
  companyText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  section: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  detailRow: {
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textTransform: "capitalize",
  },
  detailValue: {
    fontSize: 16,
    color: "#333333",
    marginTop: 2,
  },
});
