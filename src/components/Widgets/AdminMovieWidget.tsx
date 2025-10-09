import { useState, useEffect,useMemo } from "react";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";
import TableCard from "../Cards/TableCard";
import { APIMovie } from "@/types/movie";
import AdminCreateNewMovieForm from "../Forms/AdminCreateNewMovieForm";
import AdminSearchBar from "../Inputs/AdminSearchBar";
import axios from "axios";

function AdminMovieWidget() {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [movies, setMovies] = useState<APIMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      try {
        const res = await axios.get<{ movie: APIMovie[] }>("/api/movies");;

        if (isMounted) {
          setMovies(Array.isArray(res.data.movie) ? res.data.movie : []);
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMovies = useMemo(() => {
    if (!Array.isArray(movies)) return [];
    if (!searchTerm) return movies;

    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  const displayData = filteredMovies.map((movie) => ({
    ...movie,
    poster_url: (
      <img
        src={movie.poster_url || "/images/placeholder.jpg"}
        alt={movie.title}
        className="w-12 h-16 object-cover rounded"
      />
    ),
    duration_min: `${movie.duration_min} mins`,
    rating: movie.rating || "-",
  }));

  const movieColumns = [
    {
      key: "poster_url",
      label: <span className="text-white-wfff text-fm-16">Poster</span>,
      align: "left" as const,
    },
    {
      key: "title",
      label: <span className="text-white-wfff text-fm-16">Title</span>,
      align: "left" as const,
    },
    {
      key: "genre",
      label: <span className="text-white-wfff text-fm-16">Genre</span>,
      align: "center" as const,
    },
    {
      key: "rating",
      label: <span className="text-white-wfff text-fm-16">Rating</span>,
      align: "center" as const,
    },
    {
      key: "duration_min",
      label: <span className="text-white-wfff text-fm-16">Duration</span>,
      align: "center" as const,
    },
  ];

  const movieActions = [
    {
      onView: () => console.log("View Movie 1"),
      onEdit: () => console.log("Edit Movie 1"),
      onDelete: () => console.log("Delete Movie 1"),
    },
    {
      onView: () => console.log("View Movie 2"),
      onEdit: () => console.log("Edit Movie 2"),
      onDelete: () => console.log("Delete Movie 2"),
    },
  ];

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mt-20 mx-[70px]">
          <h1 className="text-gray-g63f text-f-56 font-bold">Movies</h1>
          <Button
            className="btn-base blue-normal text-fm-16 font-bold gap-2.5 h-12 w-[135px] rounded-[4px]"
            onClick={() => setIsShowCreateModal(true)}
          >
            <AddRoundLight width={24} height={40} color={"#FFFFFF"} />
            Add Movie
          </Button>
        </div>

        <div className="mx-[70px] mt-8">
          <div className="w-full">
            <AdminSearchBar placeholder="Search by Title" />
          </div>
        </div>

        <div className="mt-5">
          <TableCard
            columns={movieColumns}
            data={displayData}
            actions={movieActions}
            headerPaddingClass="px-[30px] py-5"
            actionsHeaderPaddingClass="px-[30px] py-5"
          />
          <div className="mx-[70px] mt-4 text-gray-g3b0 text-fr-14">
            Showing {movies.length > 0 ? 1 : 0} to{" "}
            {Math.min(5, movies.length)} of {movies.length} results
          </div>
        </div>
      </div>

      <AdminCreateNewMovieForm
        isShowModal={isShowCreateModal}
        onClose={() => setIsShowCreateModal(false)}
      />
    </>
  );
}

export default AdminMovieWidget;
