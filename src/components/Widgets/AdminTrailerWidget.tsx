import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";
import TableCard from "../Cards/TableCard";
import Link from "../Icons/Link";
import Eye from "../Icons/Eye";
import SearchLight from "../Icons/SearchLight";
import AdminInputTextField from "../Inputs/AdminInputTextField";
import ModalEmpty from "../Modals/ModalEmpty";

type TrailerRow = {
  name: string;
  url: string;
};

export default function AdminTrailerWidget() {
  const [trailers, setTrailers] = useState<TrailerRow[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");

  const columns = useMemo(
    () => [
      { key: "name", label: <span className="text-white-wfff text-fm-16">Time Slot Name</span>, align: "left" as const },
      { key: "url", label: <span className="text-white-wfff text-fm-16">URL</span>, align: "left" as const },
    ],
    []
  );

  const actions = useMemo(
    () =>
      trailers.map((trailer, idx) => ({
        onView: () => window.open(trailer.url, "_blank"),
        onEdit: () => {},
        onDelete: () => setTrailers((prev) => prev.filter((_, i) => i !== idx)),
      })),
    [trailers]
  );

  const handleOpen = () => {
    setMovieName("");
    setTrailerUrl("");
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!movieName || !trailerUrl) return;
    setTrailers((prev) => [...prev, { name: movieName, url: trailerUrl }]);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between mt-20 mx-[70px]">
        <h1 className="text-gray-g63f text-f-56 font-bold">Trailers</h1>
        <Button
          className="btn-base bg-blue-bbee text-white-wfff hover:bg-blue-bbee/90 text-fm-16 font-bold gap-2.5 h-12 w-[135px] rounded-[4px]"
          onClick={handleOpen}
        >
          <AddRoundLight width={24} height={40} color={"#FFFFFF"} />
          Add Trailer
        </Button>
      </div>

      <div>
        <TableCard 
          columns={columns} 
          actions={actions} 
          data={trailers}
          headerPaddingClass="px-[30px] py-5"
          actionsHeaderPaddingClass="px-[30px] py-5"
        />
        <div className="mx-[70px] mt-4 text-gray-g3b0 text-fr-14">
          Showing {trailers.length > 0 ? 1 : 0} to {Math.min(5, trailers.length)} of {trailers.length} results
        </div>
      </div>

      <ModalEmpty isShowModal={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-full max-w-[920px] bg-white-wfff rounded-[8px] shadow-xl border border-gray-gedd">
          <div className="p-8">
            <h2 className="text-f-56 text-gray-g63f">Add New Trailer</h2>
            <p className="text-fm-12 text-gray-g3b0 mt-1">Fill in the details below to add a new movie trailer</p>

            <div className="mt-6 flex flex-col gap-5">
              <AdminInputTextField
                label="Movie Name"
                type="text"
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                placeholder="Search for a movies (e.g., Inception)"
              />

              <div>
                <label className="block text-blue-bbee text-fr-14 mb-2">Trailer URL</label>
                <div className="flex">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-g3b0">
                      <Link />
                    </span>
                    <input
                      value={trailerUrl}
                      onChange={(e) => setTrailerUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?..."
                      className="w-full h-12 pl-9 pr-28 rounded-[4px] border border-blue-bbee/70 outline-none focus:border-blue-bbee text-fr-14 text-gray-g3b0"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-bbee hover:bg-blue-bbee/90 text-white-wfff rounded-r-[4px] h-12 px-3 inline-flex items-center gap-2"
                      onClick={() => trailerUrl && window.open(trailerUrl, "_blank")}
                    >
                      <Eye />
                      <span className="text-fr-14">View</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button className="h-11 px-6 rounded-[4px] bg-gray-gedd text-gray-g3b0 hover:bg-gray-gedd/90" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button className="h-11 px-6 rounded-[4px] bg-blue-bbee text-white-wfff hover:bg-blue-bbee/90" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </ModalEmpty>
    </div>
  );
}




