import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../store/store";
import { syncContacts, loadPersistedData, toggleFavoriteThunk } from "../store/contactsSlice";
import { ContactList } from "../features/contacts/components/ContactList";

export default function ContactsDirectoryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { contacts, favorites, nicknames, permissionStatus, isLoading } = useAppSelector(
    (state) => state.contacts
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(loadPersistedData());
    dispatch(syncContacts());
  }, [dispatch]);

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavoriteThunk(id));
  };

  const handleSelectContact = (id: string) => {
    router.push({
      pathname: "/details/[id]",
      params: { id },
    });
  };

  const handleRetrySync = () => {
    dispatch(syncContacts());
  };

  if (isLoading && contacts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Synchronizing contacts...</Text>
      </View>
    );
  }

  if (permissionStatus === "denied" || permissionStatus === "blocked") {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="lock-closed-outline" size={64} color="#888888" style={styles.errorIcon} />
        <Text style={styles.errorTitle}>Permission Required</Text>
        <Text style={styles.errorMessage}>
          This app needs access to your contacts to display them in the directory. Please enable contacts access in your system settings.
        </Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => Linking.openSettings()}>
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {permissionStatus === "limited" && (
        <View style={styles.permissionBanner}>
          <Text style={styles.bannerText}>
            Limited Access: Only some contacts are available. Grant Full Access in Settings to see all contacts.
          </Text>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.bannerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}
      <ContactList
        contacts={contacts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favorites={favorites}
        nicknames={nicknames}
        onToggleFavorite={handleToggleFavorite}
        onSelectContact={handleSelectContact}
        isRefreshing={isLoading}
        onRefresh={handleRetrySync}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
  permissionBanner: {
    backgroundColor: "#FFF9E6",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE0B2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerText: {
    fontSize: 13,
    color: "#B78103",
    flex: 1,
    marginRight: 8,
  },
  bannerButton: {
    backgroundColor: "#FFA000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  bannerButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  settingsButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
