import React, { useEffect, useState, useRef } from "react";
import {
  View,
  PanResponder
} from "react-native";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { enableScreens } from "react-native-screens";
import * as SplashScreen from "expo-splash-screen";

import { AuthContext } from "./src/context/AuthContext.js";
import { MonitoringScreen } from "./src/screens/MonitoringScreen.js";
import { ControlScreen } from "./src/screens/ControlScreen.js";
import { ProfileScreen } from "./src/screens/ProfileScreen.js";
import { LoginScreen } from "./src/screens/LoginScreen.js";

import CustomSplash from "./src/components/CustomSplash";
import { Api } from "./src/services/api.js";
import { Auth } from "./src/services/auth.js";
import { assertConfig } from "./src/services/config.js";

enableScreens(true);
const Tab = createBottomTabNavigator();

function SwipeWrapper({ children, navigationRef, user }) {
  const tabNames = user
    ? ["Monitoring", "Control", "Profile"]
    : ["Monitoring", "LoginScreen"];

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),

      onPanResponderRelease: (_, g) => {
        const dx = g.dx;
        if (Math.abs(dx) < 50) return;

        const nav = navigationRef.current;
        if (!nav) return;

        const current = nav.getCurrentRoute()?.name;
        const idx = tabNames.indexOf(current);
        if (idx === -1) return;

        if (dx < 0 && idx < tabNames.length - 1) {
          nav.navigate(tabNames[idx + 1]);
        } else if (dx > 0 && idx > 0) {
          nav.navigate(tabNames[idx - 1]);
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...responder.panHandlers}>
      {children}
    </View>
  );
}

function TabWrapper({ navigationRef, user }) {
  return (
    <SwipeWrapper navigationRef={navigationRef} user={user}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerTitle: "IOTWatch",
          headerTitleAlign: "center",
          headerTintColor: "#1f2937",
          headerStyle: { backgroundColor: "#f8f9fb" },
          headerTitleStyle: { fontWeight: "600", fontSize: 18 },
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarIcon: ({ color, size }) => {
            const iconName =
              route.name === "Monitoring"
                ? "analytics"
                : route.name === "Control"
                ? "options"
                : route.name === "Profile"
                ? "person"
                : "log-in";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Monitoring" component={MonitoringScreen} />
        {user ? (
          <>
            <Tab.Screen name="Control" component={ControlScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Tab.Screen name="LoginScreen" component={LoginScreen} />
        )}
      </Tab.Navigator>
    </SwipeWrapper>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    assertConfig();
  }, []);

  useEffect(() => {
    async function init() {
      try {
        await SplashScreen.preventAutoHideAsync();

        const { token, user } = await Auth.init();
        Api.setToken(token);
        setUser(user ?? null);
      } catch (err) {
        console.log("Init error:", err.message);
      } finally {
        setIsReady(true);
        setTimeout(async () => {
          setShowCustomSplash(false);
          await SplashScreen.hideAsync();
        }, 2500);
      }
    }
    init();
  }, []);

  const login = async (username, password) => {
    const resp = await Auth.login(username, password);
    Api.setToken(resp.token);
    setUser(resp.user);
    return resp;
  };

  const logout = async () => {
    await Auth.logout();
    Api.setToken(null);
    setUser(null);
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#f8f9fb",
    },
  };

  if (!isReady) return null;
  if (showCustomSplash) return <CustomSplash />;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <NavigationContainer theme={theme} ref={navigationRef} backBehavior="none">
        <TabWrapper navigationRef={navigationRef} user={user} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
