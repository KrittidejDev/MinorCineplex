import { cinemaService } from "@/services/cinemaService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method Not Allowed",
      error: "Only GET method is supported",
    });
  }

  const { slug, date } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({
      message: "Invalid or missing slug",
      error: "Slug must be a non-empty string",
    });
  }

  if (date && typeof date !== "string") {
    return res.status(400).json({
      message: "Invalid date format",
      error: "Date must be a valid string in YYYY-MM-DD format",
    });
  }

  try {
    const result = await cinemaService.getCinemaShowtimesBySlug(slug, date);

    if (!result) {
      return res.status(404).json({
        message: `Cinema with slug "${slug}" not found`,
        error: "No cinema found with the provided slug",
      });
    }

    return res.status(200).json({
      message: "Cinema showtimes retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching cinema showtimes:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
