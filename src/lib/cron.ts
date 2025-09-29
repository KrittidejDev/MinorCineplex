import cron from "node-cron";
import { syncPopularMovies } from "./syncMovies";

export function startCronJobs() {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily movie sync...");
    try {
      await syncPopularMovies();
      console.log("Movie sync completed.");
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });
}
