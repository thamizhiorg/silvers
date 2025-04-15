import type { InstantRules } from "@instantdb/react-native";

const rules = {
  $files: {
    allow: {
      view: "true",
      create: "true",
      delete: "true",
    },
  },
  $users: {
    allow: {
      view: "auth() != null",
      create: "auth() != null && auth().id == id",
      update: "auth() != null && auth().id == id",
      delete: "auth() != null && auth().id == id",
    },
  },
  // Add permissions for other entities as needed
} satisfies InstantRules;

export default rules;
