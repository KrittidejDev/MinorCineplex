import Eye from "../Icons/Eye";
import EditLight from "../Icons/EditLight";
import Trash from "../Icons/Trash";
import { APIMovie } from "@/types/movie";

interface AdminTableCardProps {
  header: string[];
  movies?: APIMovie[];
}

function AdminTableCard({ header, movies }: AdminTableCardProps) {
  return (
    <>
      <div>
        {/* header */}
        <div className="flex justify-between bg-blue-bbee py-5 px-[30px] rounded-t-sm">
          {header.map((h) => (
            <p key={h} className="font-bold text-fr-16 text-white-wfff">
              {h}
            </p>
          ))}
        </div>

        {/* content */}
        {(movies || []).map((movie) => {
          const genres = movie.genre ? movie.genre.split(",") : [];

          return (
            <div
              key={movie.id}
              className="flex items-center justify-between py-5 px-[30px] border-l border-r border-b border-blue-bbee"
            >
              <div className="w-[42px] h-[63px] bg-red-500"></div>
              <p className="text-fr-14 text-blue-bbee">
                {movie.title}
              </p>
              <div className="flex gap-1 flex-wrap">
                {genres.map((g) => (
                  <span key={g} className="text-fr-14 text-blue-bbee">
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-fr-14 text-blue-bbee">
                {movie.rating || "-"}
              </p>
              <p className="text-fr-14 text-blue-bbee">
                {movie.duration_min} mins
              </p>
              {/* actions buttons */}
              <div className="flex gap-2">
                <button
                  className="p-2 bg-green-g372 hover:bg-gray-gedd rounded-full cursor-pointer"
                  title="View Details"
                >
                  <Eye />
                </button>
                <button
                  className="p-2 bg-blue-bbee hover:bg-gray-gedd rounded-full cursor-pointer"
                  title="Edit"
                >
                  <EditLight />
                </button>
                <button
                  className="p-2 bg-red-r64b hover:bg-gray-gedd rounded-full cursor-pointer"
                  title="Delete"
                >
                  <Trash />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AdminTableCard;
