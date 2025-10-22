import { cinemaService } from "@/services/cinemaService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method Not Allowed",
      error: `Only GET method is supported`,
    });
  }
  const { slug } = req.query;
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({
      message: "Invalid or missing slug",
      error: "Slug must be a non-empty string",
    });
  }
  try {
    const cinema = await cinemaService.getCinemaBySlug(slug);
    if (!cinema) {
      return res.status(404).json({
        message: `Cinema with slug "${slug}" not found`,
        error: "No cinema found with the provided slug",
      });
    }

    return res.status(200).json({
      message: "Cinema retrieved successfully",
      data: cinema,
    });
  } catch (error) {
    console.error("Error fetching cinema by slug:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
