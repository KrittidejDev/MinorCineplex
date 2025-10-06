import { useState } from "react";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";
import AdminTableCard from "../Cards/AdminTableCard";
import { APIMovie } from "@/types/movie";

function AdminMovieWidget() {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const movieHeader = ["Poster", "Title", "Genre", "Rating", "Duration", "Actions"];
  const mockMovies: APIMovie[] = [
    {
      id: "1",
      title: "Inception",
      duration_min: 148,
      poster_url: "/images/inception.jpg",
      trailer_url: null,
      genre: "Action,Sci-Fi",
      rating: "8.8",
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
      release_date: new Date("2010-07-16"),
    },
    {
      id: "2",
      title: "Interstellar",
      duration_min: 169,
      poster_url: "/images/interstellar.jpg",
      trailer_url: null,
      genre: "Adventure,Drama,Sci-Fi",
      rating: "8.6",
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
      release_date: new Date("2014-11-07"),
    },
    {
      id: "3",
      title: "The Dark Knight",
      duration_min: 152,
      poster_url: "/images/the_dark_knight.jpg",
      trailer_url: null,
      genre: "Action,Crime,Drama",
      rating: "9.0",
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
      release_date: new Date("2008-07-18"),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-f-56 text-gray-g63f">Movies</h1>

          <Button
            className="btn-base blue-normal text-fm-16 font-bold px-4 py-3 gap-2.5"
            onClick={() => setIsShowCreateModal(true)}
          >
            <AddRoundLight width={24} height={24} color={"#FFFFFF"} />
            Add Movie
          </Button>
        </div>
        <AdminTableCard header={movieHeader} movies={mockMovies} />
      </div>
    </>
  );
}

export default AdminMovieWidget;
