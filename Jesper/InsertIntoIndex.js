import cron from "node-cron";
import { migrate_today_data } from "./database.js";

cron.schedule("58 23 * * *", async () => {
  console.log("Cron running migration...");
  await migrate_today_data();
});
