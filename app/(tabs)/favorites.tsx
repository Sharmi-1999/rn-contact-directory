import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../store/store";
import { syncContacts, toggleFavoriteThunk } from "../store/contactsSlice";
import { ContactList } from "../features/contacts/components/ContactList";
import { EmptyFavorites } from "../features/favorites/components/EmptyFavorites";

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { contacts, favorites, nicknames, isLoading } = useAppSelector(
    (state) => state.contacts
  );
  const [searchQuery, setSearchQuery] = useState("");

  const favoriteContacts = contacts.filter((c) => favorites.includes(c.id));

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavoriteThunk(id));
  };

  const handleSelectContact = (id: string) => {
    router.push({
      pathname: "/details/[id]",
      params: { id },
    });
  };

  const handleRefresh = () => {
    dispatch(syncContacts());
  };

  return (
    <View style={styles.container}>
      <ContactList
        contacts={favoriteContacts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favorites={favorites}
        nicknames={nicknames}
        onToggleFavorite={handleToggleFavorite}
        onSelectContact={handleSelectContact}
        isRefreshing={isLoading}
        onRefresh={handleRefresh}
        placeholderText="Search favorite contacts..."
        ListEmptyComponent={<EmptyFavorites />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
});
