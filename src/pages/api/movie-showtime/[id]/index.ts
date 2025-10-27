import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, date } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }

  try {
    // // const movieShowtime = await getMovieShowtimeDetail(
    // //   id,
    // //   date as string | undefined
    // // );
    // if (!movieShowtime) {
    //   return res.status(404).json({ error: "Movie not found" });
    // }
    // return res.status(200).json({ data: movieShowtime, status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching movie showtime:", error);

    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "Server Error" });
  }
}
