import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="details/[id]"
          options={{
            title: "Contact Details",
            headerBackTitle: "Back",
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </Provider>
  );
}
