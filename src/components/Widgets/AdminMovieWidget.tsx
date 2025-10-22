"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";
import TableCard from "../Cards/TableCard";
import { MovieDTO } from "@/types/movie";
import AdminCreateNewMovieForm from "../Forms/AdminCreateNewMovieForm";
import AdminViewMovieForm from "../Forms/AdminViewMovieForm";
import AdminEditMovieForm from "../Forms/AdminEditMovieForm";
import AdminSearchBar from "../Inputs/AdminSearchBar";

function AdminMovieWidget() {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [viewMovie, setViewMovie] = useState<MovieDTO | null>(null);
  const [editMovie, setEditMovie] = useState<MovieDTO | null>(null);
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/movies");
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();

      const movieList = Array.isArray(data)
        ? data
        : data.movie || data.movies || [];

      setMovies(movieList);
    } catch (err) {
      console.error("❌ Fetch movies error:", err);
      setError("ไม่สามารถโหลดข้อมูลหนังได้ (500)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
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
      <Image
        src={movie.poster_url || "/images/placeholder.jpg"}
        alt={movie.title}
        width={48}
        height={64}
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

  const movieActions = filteredMovies.map((movie) => ({
    onView: () => setViewMovie(movie),
    onEdit: () => setEditMovie(movie),
    onDelete: async () => {
      if (!confirm("Are you sure to delete this movie?")) return;

      try {
        await fetch(`/api/movies/${movie.id}`, { method: "DELETE" });
        fetchMovies();
      } catch (err) {
        console.error(err);
      }
    },
  }));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mt-20 px-[70px]">
          <h1 className="text-gray-g63f text-f-56 font-bold">Movies</h1>
          <Button
            className="btn-base blue-normal cursor-pointer text-fm-16 font-bold gap-2.5 h-12 w-[135px] rounded-[4px]"
            onClick={() => setIsShowCreateModal(true)}
          >
            <AddRoundLight width={24} height={24} color="white-wfff" />
            Add Movie
          </Button>
        </div>

        <div className="px-[70px] mt-8">
          <div className="w-full">
            <AdminSearchBar
              placeholder="Search by Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          <div className="mt-5 text-gray-g3b0 text-fr-14">
            Showing {filteredMovies.length > 0 ? 1 : 0} to{" "}
            {Math.min(5, filteredMovies.length)} of {filteredMovies.length}{" "}
            results
          </div>
        </div>
      </div>

      <AdminCreateNewMovieForm
        isShowModal={isShowCreateModal}
        onClose={() => {
          setIsShowCreateModal(false);
          fetchMovies();
        }}
      />

      <AdminViewMovieForm
        movie={viewMovie}
        isShowModal={!!viewMovie}
        onClose={() => setViewMovie(null)}
      />

      <AdminEditMovieForm
        movie={editMovie}
        isShowModal={!!editMovie}
        onClose={() => {
          setEditMovie(null);
          fetchMovies();
        }}
      />
    </>
  );
}

export default AdminMovieWidget;
