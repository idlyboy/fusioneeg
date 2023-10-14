import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { CategoryTag, Input, PromptDetails, Screen } from "~/components";
import { categories, quickAddPrompts } from "~/config";
import { AccountContext } from "~/contexts/account.context";
import { PromptScreenNavigationProp, RouteProp } from "~/navigation";
import { appInsights } from "~/utils";

export const QuickAddPromptsScreen = () => {
  const route = useRoute<RouteProp<"QuickAddPrompts">>();
  const navigation = useNavigation<PromptScreenNavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    route.params?.selectedCategory ?? "All"
  );
  const filteredPrompts = useMemo(() => {
    if (selectedCategory === "All" || selectedCategory === "") {
      // Remove "All" category from the list of categories
      const index = categories.findIndex((category) => category.name === "All");
      if (index !== -1) {
        categories.splice(index, 1);
      }
      return quickAddPrompts;
    } else {
      // Add "All" category to the list of categories if it doesn't exist
      const index = categories.findIndex((category) => category.name === "All");
      if (index === -1) {
        categories.unshift({
          name: "All",
          color: "#FFC0CB",
          icon: "💫",
        });
      }
      return selectedCategory
        ? quickAddPrompts?.filter(
            (prompt) => prompt.additionalMeta?.category === selectedCategory
          )
        : quickAddPrompts;
    }
  }, [quickAddPrompts, selectedCategory]);

  const accountContext = useContext(AccountContext);

  useEffect(() => {
    appInsights.trackPageView({
      name: "Quick Add Prompts",
      properties: {
        prompt_count: quickAddPrompts?.length,
        userNpub: accountContext?.userNpub,
      },
    });
  }, [quickAddPrompts]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("Search text", searchTerm);
  }, [searchTerm]);

  return (
    <Screen>
      {quickAddPrompts && quickAddPrompts?.length > 0 && (
        <View>
          <View className="flex justify-center items-center w-full">
            <Text className="font-sans-bold text-center text-white text-base pb-2">
              What’s been top of mind for you lately
            </Text>
            <Text className="font-sans-light max-w-xs text-center text-white text-base">
              We will use this to suggest you prompts
            </Text>
          </View>
          <Input
            value={searchTerm}
            className="my-5"
            onChangeText={setSearchTerm}
            placeholder="I want to be more energetic about work"
          />
          <View className="mb-10">
            <ScrollView
              horizontal
              className="flex gap-x-3 gap-y-3 pl-2"
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((category) => {
                const name = category.name;
                return (
                  <CategoryTag
                    key={name}
                    title={name}
                    icon={category.icon}
                    isActive={name === selectedCategory}
                    handleValueChange={(checked) =>
                      setSelectedCategory(checked ? name : "")
                    }
                  />
                );
              })}
            </ScrollView>
            <ScrollView className="flex mt-4 mx-1 flex-col">
              {filteredPrompts.map((prompt) => (
                <View key={prompt.uuid} className="my-2">
                  <PromptDetails
                    prompt={prompt}
                    variant="add"
                    onClick={() =>
                      navigation.navigate("EditPrompt", { prompt, type: "add" })
                    }
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </Screen>
  );
};
