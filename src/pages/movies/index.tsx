// pages/index.tsx
import { useEffect, useState } from "react";

type MovieItem = {
  movie_id: string;
  movie_name: string;
  movie_name_en: string;
  movie_duration: string;
  movie_genre: string;
  movie_releasedate: string;
  movie_slug: string;
  system_type: string;
};

export default function Home() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timestamp = Date.now();

    const fetchMovies = async () => {
      const res = await fetch("/api/cinema");
      const html = await res.text();

      // ตอนนี้ html เป็น string ของ div โรงหนัง
      console.log(html);
    };

    fetchMovies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!movies.length) return <p>No movies found</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Movies</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.movie_id} className="mb-2">
            <p className="font-semibold">
              {movie.movie_name || movie.movie_slug}
            </p>
            <p className="text-gray-600">{movie.movie_name_en}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
