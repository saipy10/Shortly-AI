/**@type { import("drizzle-kit").Config} */
export default {
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_7Glr6nvpQjyT@ep-square-shape-a89nazgl-pooler.eastus2.azure.neon.tech/Shorts-AI?sslmode=require",
  },
};

// import { defineConfig } from "drizzle-kit";
// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./configs/schema.js",
//   dbCredentials: {
//     url:  'postgresql://neondb_owner:npg_7Glr6nvpQjyT@ep-square-shape-a89nazgl-pooler.eastus2.azure.neon.tech/Shorts-AI?sslmode=require'
//   }
// });
