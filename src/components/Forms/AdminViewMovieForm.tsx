import { useState, useEffect } from "react";
import Image from "next/image";
import ModalEmpty from "../Modals/ModalEmpty";
import UploadFile from "../Icons/UploadFile";
import { Button } from "../ui/button";
import AdminInputTextField from "../Inputs/AdminInputTextField";
import AdminInputTextArea from "../Inputs/AdminInputTextArea";
import AdminDropdownInput from "../Inputs/AdminDropdownInput ";
import { MovieDTO } from "@/types/movie";

interface ViewMovieFormProps {
  movie: MovieDTO | null;
  isShowModal: boolean;
  onClose: () => void;
}

function AdminViewMovieForm({
  movie,
  isShowModal,
  onClose,
}: ViewMovieFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    rating: "",
    trailer: "",
  });

  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    if (movie) {
      // setFormData({
      //   title: movie.title || "",
      //   description: movie.description || "",
      //   duration: movie.duration_min?.toString() || "",
      //   rating: movie.rating?.toString() || "",
      //   trailer: movie.trailer_url || "",
      // });

      // setSelectedGenre(movie.genre?.toLowerCase() || "");
      setPosterPreview(movie.poster_url || null);
    }
  }, [movie]);

  const genreOptions = [
    { value: "action", label: "Action" },
    { value: "comedy", label: "Comedy" },
    { value: "drama", label: "Drama" },
    { value: "horror", label: "Horror" },
    { value: "romance", label: "Romance" },
    { value: "sci-fi", label: "Sci-Fi" },
    { value: "thriller", label: "Thriller" },
    { value: "animation", label: "Animation" },
  ];

  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <div className="bg-white w-[1200px] h-[744px] rounded-sm shadow-lg py-10 px-[120px]">
        <h1 className="font-bold text-f-56 text-gray-g63f">View Movie</h1>
        <div className="h-[316px] flex items-start gap-5 mt-5">
          <form className="flex flex-col flex-1">
            <div className="h-[316px] flex items-start gap-5">
              {/* Poster Preview */}
              <div className="w-[250px] h-full flex justify-center items-center text-center border border-blue-bbee rounded-sm border-dashed overflow-hidden relative">
                {posterPreview ? (
                  <Image
                    src={posterPreview}
                    alt="Poster Preview"
                    fill
                    className="object-cover w-full h-full"
                    sizes="250px"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-g3b0">
                    <UploadFile width={40} height={40} />
                    <p className="mt-4 text-f-16">No Poster Available</p>
                  </div>
                )}
              </div>

              {/* Movie Info */}
              <div className="h-full flex flex-col gap-5 flex-1">
                <AdminInputTextField
                  label="Title"
                  value={formData.title}
                  onChange={() => {}}
                  errors=""
                  require={true}
                  type="text"
                  disabled
                />

                <AdminInputTextArea
                  label="Description"
                  value={formData.description}
                  onChange={() => {}}
                  errors=""
                  require={true}
                  rows={7}
                  disabled
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex mt-5">
              <div className="flex flex-col w-full">
                <div className="flex gap-5">
                  <div className="flex flex-col flex-1">
                    <AdminInputTextField
                      label="Duration (minutes)"
                      value={formData.duration}
                      onChange={() => {}}
                      errors=""
                      require={true}
                      type="number"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <AdminDropdownInput
                      label="Genre"
                      value={selectedGenre}
                      onChange={() => {}}
                      options={genreOptions}
                      errors=""
                      require={true}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <AdminInputTextField
                      label="Rating"
                      placeholder="0 - 5"
                      value={formData.rating}
                      onChange={() => {}}
                      errors=""
                      require={false}
                      type="number"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex flex-col mt-1">
                  <AdminInputTextField
                    label="Trailer URL"
                    value={formData.trailer}
                    onChange={() => {}}
                    errors=""
                    require={false}
                    type="text"
                    disabled
                  />
                </div>

                <div className="flex justify-end gap-2 mt-10">
                  <Button
                    type="button"
                    className="w-[120px] btn-base blue-normal  cursor-pointer text-fr-16"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ModalEmpty>
  );
}

export default AdminViewMovieForm;
