import { useState, useRef, useEffect } from "react";
import ModalEmpty from "../Modals/ModalEmpty";
import UploadFile from "../Icons/UploadFile";
import { Button } from "../ui/button";
import AdminInputTextField from "../Inputs/AdminInputTextField";
import AdminInputTextArea from "../Inputs/AdminInputTextArea";
import AdminDropdownInput from "../Inputs/AdminDropdownInput ";
import { APIMovie } from "@/types/movie";
import axios from "axios";

interface EditMovieFormProps {
  movie: APIMovie | null;
  isShowModal: boolean;
  onClose: () => void;
}

function AdminEditMovieForm({
  movie,
  isShowModal,
  onClose,
}: EditMovieFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    rating: "",
    trailer: "",
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    duration: "",
    rating: "",
    trailer: "",
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        description: movie.description || "",
        duration: movie.duration_min?.toString() || "",
        rating: movie.rating?.toString() || "",
        trailer: movie.trailer_url || "",
      });
      setSelectedGenre(movie.genre?.toLowerCase() || "");
      setSelectedRating(movie.rating?.toString() || "");
      setPosterPreview(movie.poster_url || null);
    }
  }, [movie]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      if (errors[field as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie) return;

    const ratingValue = Number(formData.rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      alert("กรุณาใส่ Rating ระหว่าง 0 ถึง 5");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      duration_min: Number(formData.duration),
      trailer_url: formData.trailer,
      genre: selectedGenre,
      rating: ratingValue.toString(),
    };

    try {
      setLoading(true);
      const res = await axios.put(`/api/movies/${movie.id}`, payload);

      if (res.status === 200) {
        alert("แก้ไขภาพยนตร์สำเร็จ!");
        onClose();
      } else {
        alert("แก้ไขภาพยนตร์ไม่สำเร็จ");
      }
    } catch (err: any) {
      console.error("Error updating movie:", err.response?.data || err);
      alert("มีข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <div className="bg-white w-[1200px] h-[744px] rounded-sm shadow-lg py-10 px-[120px]">
        <h1 className="font-bold text-f-56 text-gray-g63f">Edit Movie</h1>
        <div className="h-[316px] flex items-start gap-5 mt-5">
          <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
            <div className="h-[316px] flex items-start gap-5">
              <div className="w-[250px] h-full flex justify-center items-center text-center border border-blue-bbee rounded-sm border-dashed relative overflow-hidden cursor-pointer">
                {posterPreview ? (
                  <img
                    src={posterPreview}
                    alt="Poster Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="p-[15px] flex justify-center items-center bg-gray-g3b0/40 rounded-full">
                      <UploadFile width={40} height={40} />
                    </div>
                    <div className="mt-10">
                      <h4 className="font-bold text-f-20 text-gray-g3b0">
                        Upload Poster
                      </h4>
                      <div className="max-w-[155px] mt-2">
                        <p className="text-[16px] text-gray-gedd">
                          Drag and drop or click to upload
                        </p>
                      </div>
                      <div className="mt-3.5">
                        <Button type="button" className="btn-base blue-normal">
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="h-full flex flex-col gap-5 flex-1">
                <AdminInputTextField
                  label="Title"
                  placeholder="Enter movie title"
                  value={formData.title}
                  onChange={handleInputChange("title")}
                  errors={errors.title}
                  require={true}
                  type="text"
                />

                <AdminInputTextArea
                  label="Description"
                  placeholder="Enter movie description"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  errors={errors.description}
                  require={true}
                  rows={7}
                />
              </div>
            </div>

            <div className="flex mt-5">
              <div className="flex flex-col w-full">
                <div className="flex gap-5">
                  <div className="flex flex-col flex-1">
                    <AdminInputTextField
                      label="Duration(minutes)"
                      placeholder="e.g.,120"
                      value={formData.duration}
                      onChange={handleInputChange("duration")}
                      errors={errors.duration}
                      require={true}
                      type="number"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <AdminDropdownInput
                      label="Genre"
                      placeholder="Action"
                      value={selectedGenre}
                      onChange={(value) => setSelectedGenre(value)}
                      options={genreOptions}
                      errors={!selectedGenre ? "Genre is required" : undefined}
                      require={true}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <AdminInputTextField
                      label="Rating"
                      placeholder="0 - 5"
                      value={formData.rating}
                      onChange={handleInputChange("rating")}
                      errors={errors.rating}
                      require={false}
                      type="number"
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-1">
                  <AdminInputTextField
                    label="Trailer URL"
                    placeholder="https://youtube.com/watch?"
                    value={formData.trailer}
                    onChange={handleInputChange("trailer")}
                    errors={errors.trailer}
                    require={false}
                    type="text"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-10">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="w-[120px] btn-base blue-normal opacity-40 text-fr-16"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-[120px] btn-base blue-normal text-fr-16"
                  >
                    Save
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

export default AdminEditMovieForm;
