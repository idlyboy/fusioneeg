import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { StyleSheet, Image, View, Text } from "react-native";

import logo from "../assets/icon.png";
import { HomeScreen } from "../pages/home.js";
import { PromptScreen } from "../pages/prompt.js";
import { ResponsesScreen } from "../pages/responses.js";
import { AccountScreen } from "../pages/account.js";
import { PromptEntryScreen } from "../pages/promptEntry.js";

function LogoTitle() {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Image source={logo} style={{ width: 35, height: 35 }} />
      <Text style={{ fontSize: 25, marginLeft: 10, fontWeight: "700" }}>
        FUSION
      </Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const PromptStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
      />
      <Stack.Screen
        name="AuthorPrompt"
        component={PromptScreen}
        options={{ title: "Author Prompt" }}
      />
      <Stack.Screen
        name="ViewResponses"
        component={ResponsesScreen}
        options={{ title: "Prompt Responses" }}
      />
      <Stack.Screen
        name="PromptEntry"
        component={PromptEntryScreen}
        options={{ title: "Prompt Entry" }}
      />
    </Stack.Navigator>
  );
};

const AccountStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
      />
    </Stack.Navigator>
  );
};

export function FusionNavigation() {
  return (
    <Tab.Navigator activeColor="#023059" initialRouteName="Prompts">
      <Tab.Screen
        name="Prompts"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="head-question"
              color={color}
              size={26}
            />
          ),
        }}
        component={PromptStack}
      />
      <Tab.Screen
        name="Profile"
        component={AccountStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
