import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Contacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ContactItem {
  id: string;
  name: string;
  phoneNumbers?: { number: string; label: string }[];
  emails?: { email: string; label: string }[];
  company?: string;
  jobTitle?: string;
  addresses?: { street?: string; city?: string; region?: string; country?: string; postalCode?: string }[];
  note?: string;
  birthday?: { day?: number; month?: number; year?: number };
  imageUri?: string;
}

interface ContactsState {
  contacts: ContactItem[];
  favorites: string[];
  nicknames: Record<string, string>;
  permissionStatus: "loading" | "granted" | "limited" | "denied" | "blocked";
  isLoading: boolean;
}

const initialState: ContactsState = {
  contacts: [],
  favorites: [],
  nicknames: {},
  permissionStatus: "loading",
  isLoading: false,
};

export const loadPersistedData = createAsyncThunk(
  "contacts/loadPersistedData",
  async () => {
    const favoritesData = await AsyncStorage.getItem("favorites");
    const nicknamesData = await AsyncStorage.getItem("nicknames");
    return {
      favorites: favoritesData ? JSON.parse(favoritesData) : [],
      nicknames: nicknamesData ? JSON.parse(nicknamesData) : {},
    };
  }
);

export const toggleFavoriteThunk = createAsyncThunk(
  "contacts/toggleFavorite",
  async (id: string, { getState }) => {
    const state = getState() as { contacts: ContactsState };
    const currentFavorites = state.contacts.favorites;
    const nextFavorites = currentFavorites.includes(id)
      ? currentFavorites.filter((favId) => favId !== id)
      : [...currentFavorites, id];
    await AsyncStorage.setItem("favorites", JSON.stringify(nextFavorites));
    return nextFavorites;
  }
);

export const saveNicknameThunk = createAsyncThunk(
  "contacts/saveNickname",
  async ({ id, nickname }: { id: string; nickname: string }, { getState }) => {
    const state = getState() as { contacts: ContactsState };
    const nextNicknames = { ...state.contacts.nicknames };
    if (nickname.trim()) {
      nextNicknames[id] = nickname.trim();
    } else {
      delete nextNicknames[id];
    }
    await AsyncStorage.setItem("nicknames", JSON.stringify(nextNicknames));
    return nextNicknames;
  }
);

export const syncContacts = createAsyncThunk(
  "contacts/syncContacts",
  async () => {
    try {
      const permissionResponse = await Contacts.requestPermissionsAsync();
      const status = permissionResponse.status;
      const accessPrivileges = (permissionResponse as any).accessPrivileges as string | undefined;

      console.log("[Contacts Sync] Permission status:", status, "| accessPrivileges:", accessPrivileges);

      // If permission is granted (even if limited), proceed to fetch the contacts.
      if (status === "granted") {
        let dataResponse;
        try {
          dataResponse = await Contacts.getContactsAsync({
            fields: [
              Contacts.Fields.Emails,
              Contacts.Fields.PhoneNumbers,
              Contacts.Fields.Company,
              Contacts.Fields.JobTitle,
              Contacts.Fields.Addresses,
              Contacts.Fields.Birthday,
              Contacts.Fields.Image,
              Contacts.Fields.RawImage,
            ],
          });
        } catch (error: any) {
          console.warn("[Contacts Sync] getContactsAsync failed:", error?.message || error);
          // Fallback: try with no fields
          try {
            dataResponse = await Contacts.getContactsAsync({});
          } catch (error2: any) {
            console.error("[Contacts Sync] All fetch attempts failed:", error2?.message || error2);
            throw error2;
          }
        }

        const data = dataResponse?.data;
        console.log("[Contacts Sync] Contacts fetched:", data?.length ?? 0);

        const resolvedStatus = accessPrivileges === "limited" ? ("limited" as const) : ("granted" as const);

        if (data && data.length > 0) {
          const formatted: ContactItem[] = [];
          for (const c of data) {
            try {
              if (!c) continue;
              formatted.push({
                id: c.id || Math.random().toString(),
                name: c.name || [c.firstName, c.lastName].filter(Boolean).join(" ") || "Unnamed Contact",
                phoneNumbers: Array.isArray(c.phoneNumbers)
                  ? c.phoneNumbers
                      .map((p) => ({ number: p?.number || "", label: p?.label || "mobile" }))
                      .filter((p) => p.number)
                  : undefined,
                emails: Array.isArray(c.emails)
                  ? c.emails
                      .map((e) => ({ email: e?.email || "", label: e?.label || "home" }))
                      .filter((e) => e.email)
                  : undefined,
                company: c.company || undefined,
                jobTitle: c.jobTitle || undefined,
                addresses: Array.isArray(c.addresses)
                  ? c.addresses.map((a) => ({
                      street: a?.street,
                      city: a?.city,
                      region: a?.region,
                      country: a?.country,
                      postalCode: a?.postalCode,
                    }))
                  : undefined,
                note: c.note || undefined,
                birthday: c.birthday && typeof c.birthday === "object"
                  ? {
                      day: typeof c.birthday.day === "number" ? c.birthday.day : undefined,
                      month: typeof c.birthday.month === "number" ? c.birthday.month : undefined,
                      year: typeof c.birthday.year === "number" ? c.birthday.year : undefined,
                    }
                  : undefined,
                imageUri: c.image?.uri || c.image?.localUri || c.rawImage?.uri || c.rawImage?.localUri || undefined,
              });
            } catch (err) {
              console.warn("[Contacts Sync] Skipped malformed contact:", c?.name, err);
            }
          }
          return { contacts: formatted, status: resolvedStatus };
        }
        // Device has no contacts at all (empty address book)
        console.log("[Contacts Sync] Device address book is empty.");
        return { contacts: [], status: resolvedStatus };
      }

      return { contacts: [], status: (status === "undetermined" ? "denied" : status) as any };
    } catch (e: any) {
      console.error("[Contacts Sync] Exception:", e?.message || e);
      return { contacts: [], status: "denied" as const };
    }
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPersistedData.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
        state.nicknames = action.payload.nicknames;
      })
      .addCase(toggleFavoriteThunk.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(saveNicknameThunk.fulfilled, (state, action) => {
        state.nicknames = action.payload;
      })
      .addCase(syncContacts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(syncContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload.contacts;
        state.permissionStatus = action.payload.status;
      })
      .addCase(syncContacts.rejected, (state) => {
        state.isLoading = false;
        state.contacts = [];
        state.permissionStatus = "denied";
      });
  },
});

export default contactsSlice.reducer;
