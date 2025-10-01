import { useState, useEffect } from "react";
import Tag from "../Widgets/Tag";
import { Button } from "../ui/button";
import Image from "next/image";
import axios from "axios";

interface MoviesDetailWidgetProps {
  id: string;
}

interface APIMovie {
    id: string;
    title: string;
    duration_min: number;
    description?: string | null;
    poster_url?: string | null;
    trailer_url?: string | null;
    genre?: string | null;
    rating?: string | null;
    created_at: Date;
    updated_at: Date;
    release_date?: Date | null;
  }

function MoviesDetailWidget({ id }: MoviesDetailWidgetProps) {
  const [movie, setMovie] = useState<APIMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchMovie = async () => {
    try {
      console.log("Fetching movie id:", id);
      const res = await axios.get<APIMovie>(`/api/movies/${id}`);
      console.log("API Response:", res.data.movie);
      setMovie(res.data.movie);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("ไม่สามารถโหลดหนังได้");
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchMovie();
}, [id]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>ไม่พบหนัง</div>;

  const genres = movie?.genre
    ? movie.genre.split(",").map((g) => g.trim())
    : [];
  const formattedDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  return (
    <>
      <div className="w-screen flex justify-start lg:justify-center lg:mt-[60px]">
        <div className="w-full lg:w-[1200px] lg:h-[600px] flex flex-col lg:flex-row px-1 md:px4">
          <div className="relative w-full h-[547px] lg:w-[411px] lg:h-[600px]">
            <Image
              src={movie.poster_url}
              alt={movie.title}
              fill
              className="object-cover rounded-md"
            />
          </div>

          <div className="flex flex-col flex-1 py-10 px-4 lg:p-[60px] bg-gray-gc1b/70 backdrop-blur-xl rounded-md">
            <div className="flex flex-col gap-4">
              <h2 className="text-f-36 text-white-wfff">{movie.title}</h2>
              <div className="w-fit flex flex-col lg:flex-row lg:items-center">
                <div className="flex gap-2 border-r border-gray-gedd pr-2 lg:pr-5">
                  {movie?.genre?.split(",").map((g) => (
                    <Tag key={g} name={g} variant="genre" />
                  ))}
                </div>
                <p className="text-fr-16 text-gray-gedd mt-2 lg:mt-0 lg:pl-5">
                  Release date: {formattedDate}
                </p>
              </div>
            </div>
            <div className="mt-6 mb-10 lg:my-12">
              <Button className="btn-base blue-normal">Movie detail</Button>
            </div>
            <p className="text-fr-16 text-gray-gedd">{movie.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MoviesDetailWidget;
