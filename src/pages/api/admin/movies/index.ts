import type { NextApiRequest, NextApiResponse } from "next";
import { moviesService } from "@/services/movieService";
import { MovieDTO } from "@/types/movie";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const result = await moviesService.getMoviesForAdmin();
      return res.status(200).json(result);
    }

    if (req.method === "POST") {
      const {
        title,
        description,
        duration,
        rating,
        trailer,
        poster_url,
        genre,
      } = req.body;

      if (!title || !description || !duration || !rating) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
      }

      type GenreInput = string | { id: string; name?: string; slug?: string };

const genreArray: GenreInput[] = Array.isArray(genre) ? genre : genre ? [genre] : [];

const genrePayload = await Promise.all(
  genreArray.map(async (g: GenreInput) => {
    if (typeof g === "string") {
      const slug = g.toLowerCase().replace(/\s+/g, "-");

      const dbGenre = await prisma.genre.upsert({
        where: { slug },
        update: {},
        create: { name: g, slug },
      });
      return { id: dbGenre.id, name: dbGenre.name, slug: dbGenre.slug };
    } else {
      if (!g.id) throw new Error("Genre object ต้องมี id");

      return { id: g.id, name: g.name || g.id, slug: g.slug || g.id };
    }
  })
);

const moviePayload: Omit<MovieDTO, "id"> = {
  title,
  translations: { th: { title, description } },
  duration_min: Number(duration),
  rating: rating ? String(rating) : undefined,
  trailer_url: trailer || undefined,
  poster_url: poster_url || undefined,
  status: "COMING_SOON",
  slug: "",
  genres: genrePayload.map((g) => ({ genre: g })),
  actors: [],
  directors: [],
  languages: [],
};

      console.log(
        "Payload sent to moviesService.createMovieForAdmin:",
        moviePayload
      );

      const createdMovie =
        await moviesService.createMovieForAdmin(moviePayload);

      return res.status(201).json({ success: true, data: createdMovie });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
