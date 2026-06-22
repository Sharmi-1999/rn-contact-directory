import React, { useMemo } from "react";
import { FlatList, View, TextInput, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ContactItem } from "../../../store/contactsSlice";
import { ContactRow } from "./ContactRow";

interface ContactListProps {
  contacts: ContactItem[];
  searchQuery: string;
  onSearchChange: (text: string) => void;
  favorites: string[];
  nicknames: Record<string, string>;
  onToggleFavorite: (id: string) => void;
  onSelectContact: (id: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  placeholderText?: string;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  searchQuery,
  onSearchChange,
  favorites,
  nicknames,
  onToggleFavorite,
  onSelectContact,
  isRefreshing,
  onRefresh,
  ListEmptyComponent,
  placeholderText = "Search by name or number...",
}) => {
  const filteredAndSortedContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = contacts.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(query);
      const phoneMatch = c.phoneNumbers?.some((p) =>
        p.number.toLowerCase().replace(/[^a-z0-9+]/g, "").includes(query.replace(/[^a-z0-9+]/g, ""))
      ) ?? false;
      const nicknameMatch = (nicknames[c.id] || "").toLowerCase().includes(query);
      return nameMatch || phoneMatch || nicknameMatch;
    });

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, searchQuery, nicknames]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholderText}
          value={searchQuery}
          onChangeText={onSearchChange}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={filteredAndSortedContacts}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
        removeClippedSubviews={true}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <ContactRow
            contact={item}
            nickname={nicknames[item.id]}
            isFavorite={favorites.includes(item.id)}
            onPress={() => onSelectContact(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          ListEmptyComponent || (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No contacts found</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: 8,
    margin: 12,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333333",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
  },
});

export default ContactList;
