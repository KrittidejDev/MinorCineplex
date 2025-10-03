"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import MovieCard from "../Cards/MovieCard";
import { APIMovie } from "@/types/movie";
import TrailerPlayer from "../Displays/TrailerPlayer";

const MovieInfoWidget: React.FC = () => {
  const params = useParams();
  const movieId = params?.id as string | undefined;

  const [movie, setMovie] = useState<APIMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovie = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/movies/${id}`);
      console.log("Movie API response:", res.data);
      setMovie(res.data.movie);
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถโหลดข้อมูลหนังได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchMovie(movieId);
    }
  }, [movieId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>ไม่พบข้อมูลหนัง</p>;

  return (
    <div>
      <div className="flex justify-between">
        <MovieCard
          id={movie.id}
          title={movie.title}
          poster_url={movie.poster_url || undefined}
          release_date={
            movie.release_date ? new Date(movie.release_date) : undefined
          }
          rating={movie.rating || undefined}
          genre={movie.genre || undefined}
        />
        <TrailerPlayer url={movie.trailer_url} />
      </div>
    </div>
  );
};

export default MovieInfoWidget;
