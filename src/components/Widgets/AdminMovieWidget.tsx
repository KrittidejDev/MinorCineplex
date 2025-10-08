import { useState } from "react";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";
import TableCard from "../Cards/TableCard";
import { APIMovie } from "@/types/movie";
import AdminCreateNewMovieForm from "../Forms/AdminCreateNewMovieForm";

function AdminMovieWidget() {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  
  const moviesData: APIMovie[] = [
    {
      id: "1",
      title: "Inception",
      duration_min: 148,
      poster_url:
        "https://cdn.majorcineplex.com/uploads/movie/3866/thumb_3866.jpg",
      trailer_url: null,
      genre: "Action,Sci-Fi",
      rating: "",
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
      release_date: new Date("2010-07-16"),
    },
    {
      id: "2",
      title: "Interstellar",
      duration_min: 169,
      poster_url:
        "https://cdn.majorcineplex.com/uploads/movie/3866/thumb_3866.jpg",
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
      poster_url:
        "https://cdn.majorcineplex.com/uploads/movie/3866/thumb_3866.jpg",
      trailer_url: null,
      genre: "Action,Crime,Drama",
      rating: "9.0",
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
      release_date: new Date("2008-07-18"),
    },
  ];

  // Transform data to show poster images
  const displayData = moviesData.map(movie => ({
    ...movie,
    poster_url: (
      <img 
        src={movie.poster_url || "/images/placeholder.jpg"} 
        alt={movie.title}
        className="w-12 h-16 object-cover rounded"
      />
    ),
    duration_min: `${movie.duration_min} min`,
    rating: movie.rating || "-"
  }));

  const movieColumns = [
    { key: "poster_url", label: <span className="text-white-wfff text-fm-16">Poster</span>, align: "left" as const },
    { key: "title", label: <span className="text-white-wfff text-fm-16">Title</span>, align: "left" as const },
    { key: "genre", label: <span className="text-white-wfff text-fm-16">Genre</span>, align: "center" as const },
    { key: "rating", label: <span className="text-white-wfff text-fm-16">Rating</span>, align: "center" as const },
    { key: "duration_min", label: <span className="text-white-wfff text-fm-16">Duration</span>, align: "center" as const },
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
      <div className="flex flex-col gap-10">
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

        <div>
          <TableCard
            columns={movieColumns}
            data={displayData}
            actions={movieActions}
            headerPaddingClass="px-[30px] py-5"
            actionsHeaderPaddingClass="px-[30px] py-5"
          />
          <div className="mx-[70px] mt-4 text-gray-g3b0 text-fr-14">
            Showing {moviesData.length > 0 ? 1 : 0} to {Math.min(5, moviesData.length)} of {moviesData.length} results
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
