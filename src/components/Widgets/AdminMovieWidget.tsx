import { useState } from "react";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";
import TableCard from "../Cards/TableCard";
import { APIMovie } from "@/types/movie";
import AdminCreateNewMovieForm from "../Forms/AdminCreateNewMovieForm";

function AdminMovieWidget() {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const movieColumns = [
    { key: "poster_url", label: "Poster", align: "left" as const },
    { key: "title", label: "Title", align: "left" as const },
    { key: "genre", label: "Genre", align: "center" as const },
    { key: "rating", label: "Rating", align: "center" as const },
    { key: "duration_min", label: "Duration", align: "center" as const },
  ];
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

  const movieActions = [
    {
      onView: () => console.log("View  1"),
      onEdit: () => console.log("Edit  1"),
      onDelete: () => console.log("Delete  1"),
    },
    {
      onView: () => console.log("View  2"),
      onEdit: () => console.log("Edit  2"),
      onDelete: () => console.log("Delete  2"),
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
        <TableCard
          columns={movieColumns}
          data={moviesData}
          actions={movieActions}
        />
      </div>
      <AdminCreateNewMovieForm
        isShowModal={isShowCreateModal}
        onClose={() => setIsShowCreateModal(false)}
      />
    </>
  );
}

export default AdminMovieWidget;
