# Contact Directory & Favorites Management Application

A clean, production-oriented React Native mobile application built with **Expo (v54)**, **TypeScript**, and **Expo Router**. The app synchronizes device contacts, lets users add/remove favorites, manage contact nicknames, and perform native actions (Call, SMS, Email).

---

## Architecture Overview

The codebase is organized using a **Feature Module Architecture** to ensure components are modular, isolated, and scalable.

### Component & File Structure

```
rn-contact-directory/
├── app/
│   ├── _layout.tsx                       # Global Stack Layout & Redux Provider wrapper
│   ├── (tabs)/
│   │   ├── _layout.tsx                   # Tabs Navigation Layout (Directory & Favorites)
│   │   ├── index.tsx                     # Contacts Directory Screen (main list)
│   │   └── favorites.tsx                 # Favorites Screen (bookmarked list)
│   ├── details/
│   │   └── [id].tsx                      # Contact Details Screen (details, calls, nickname)
│   ├── store/
│   │   ├── store.ts                      # Redux Store configuration
│   │   └── contactsSlice.ts              # Redux Slice (thunks, reducers, selectors)
│   └── features/
│       ├── contacts/
│       │   └── components/
│       │       ├── Avatar.tsx            # Generates letter fallback with deterministic colors
│       │       ├── ContactRow.tsx        # Displays a contact item with title, sub-info & bookmark action
│       │       └── ContactList.tsx       # Reusable, search-optimized list with Pull-to-Refresh
│       ├── details/
│       │   └── components/
│       │       ├── ContactActions.tsx    # Call / SMS / Email buttons utilizing Linking
│       │       └── NicknameManager.tsx   # Visual input for setting, updating, or deleting nickname
│       └── favorites/
│           └── components/
│               └── EmptyFavorites.tsx    # UI message displaying when favorites lists are empty
```

---

## Technical Decisions

### 1. State Management: Redux Toolkit

Selected Redux Toolkit (`@reduxjs/toolkit` and `react-redux`) for managing the application state:

- Centralizes contacts, favorites, nicknames, permission states, and synchronization flags.
- Separates business logic from visual presentation using async thunks (`syncContacts`, `toggleFavoriteThunk`, `saveNicknameThunk`).
- Easy to test and expand compared to raw React context for larger applications.

### 2. Persistence Strategy: AsyncStorage

Selected `@react-native-async-storage/async-storage` as the persistence layer:

- Stores favorites and custom nicknames locally across application restarts.
- Integrates into Redux async thunks during initialization and state changes to keep AsyncStorage state and Redux store synchronized.

### 3. Native Integration: expo-contacts & Linking
- Uses `expo-contacts` to request user contacts access.
- Handles limited/denied access gracefully by showing targeted visual prompts, prompting the user with a button that directs them to their system settings, and allowing access to real contacts selected in limited mode.
- Uses native `Linking` for calling, texting, and emailing.

---

## Assumptions Made

1. **Search Criteria:** Search queries filter by matching name, nickname, or phone number. Whitespaces are stripped during phone number comparison to match number patterns like `+1 987 654 3210` with input `987654`.

---

## Trade-offs Considered

- **Zustand vs Redux Toolkit:** Zustand would require less boilerplate code. However, Redux Toolkit is the industry standard for large-scale enterprise React Native applications and demonstrates rigorous architecture principles (reducers, selectors, actions, middleware/thunks) standard in professional evaluation.
- **Redux Persist vs Custom Storage Thunks:** Redux Persist automates state persistence, but it adds complex configuration and can lead to version migration issues. Custom async thunks inside `contactsSlice` write only the critical state fields (favorites, nicknames) explicitly and safely, maintaining maximum readability and zero external boilerplate.

---

## Future Improvements

- **Offline Sync Reconciliation:** Implement smart reconciliation logic to merge new device contact changes with existing local nicknames and favorites if a contact is updated on the device.
- **Unit & Integration Testing:** Implement tests for Redux reducers and async thunk payloads using Jest and React Native Testing Library.
- **Shared Transitions:** Add smooth Shared Element Transitions between the list screen avatars and the details page avatar.

---

## Setup & Run Instructions

### Prerequisites

- Node.js (v18+)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

To run the project:

```bash
npx expo start
```

Press **`w`** to open in the web browser, **`i`** for iOS simulator (requires Xcode), or **`a`** for Android simulator (requires Android Studio).
