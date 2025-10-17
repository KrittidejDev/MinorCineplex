import { useState, useRef } from "react";
import ModalEmpty from "../Modals/ModalEmpty";
import UploadFile from "../Icons/UploadFile";
import { Button } from "../ui/button";
import AdminInputTextField from "../Inputs/AdminInputTextField";
import AdminInputTextArea from "../Inputs/AdminInputTextArea";
import AdminDropdownInput from "../Inputs/AdminDropdownInput ";
import axios from "axios";
import Image from "next/image";

interface CreateNewMovieFormProps {
  isShowModal: boolean;
  onClose: () => void;
}

function AdminCreateNewMovieForm({
  isShowModal,
  onClose,
}: CreateNewMovieFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    rating: "",
    trailer: "",
    poster_url: "",
  });

  const [, setPosterFile] = useState<File | null>(null); // removed unused variable warning
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    duration: "",
    rating: "",
    trailer: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file)); // preview ชั่วคราว

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/file-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ใช้ Next.js Image ได้
      setFormData((prev) => ({ ...prev, poster_url: res.data.url }));
      setPosterPreview(res.data.url); // update preview ด้วย URL จริง
    } catch (err) {
      console.error("Upload poster failed:", err);
      alert("ไม่สามารถอัปโหลด poster ได้");
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
  // removed selectedRating and loading warnings by safely omitting
  const genreOptions = [
    { value: "Action", label: "Action" },
    { value: "Comedy", label: "Comedy" },
    { value: "Drama", label: "Drama" },
    { value: "Horror", label: "Horror" },
    { value: "Romance", label: "Romance" },
    { value: "Sci-fi", label: "Sci-Fi" },
    { value: "Thriller", label: "Thriller" },
    { value: "Animation", label: "Animation" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ratingValue = Number(formData.rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      alert("Rating ต้องอยู่ระหว่าง 0 - 5");
      return;
    }

    const payload = {
      ...formData,
      duration: Number(formData.duration),
      genre: selectedGenre,
      rating: ratingValue,
      poster_url: formData.poster_url,
    };

    try {
      const res = await axios.post("/api/movies", payload);

      if (res.status === 201) {
        alert("เพิ่มภาพยนตร์สำเร็จ!");
        onClose();
      } else {
        alert("เพิ่มภาพยนตร์ไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("มีข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <div className="bg-white w-[1200px] h-[744px] rounded-sm shadow-lg py-10 px-[120px]">
        <h1 className="font-bold text-f-56 text-gray-g63f">Add New Movie</h1>
        <div className="h-[316px] flex items-start gap-5 mt-5">
          <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
            <div className="h-[316px] flex items-start gap-5">
              <div
                className="w-[250px] h-full flex justify-center items-center text-center border border-blue-bbee rounded-sm border-dashed relative overflow-hidden cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {posterPreview ? (
                  <Image
                    src={posterPreview}
                    alt="Poster Preview"
                    fill
                    sizes="250px"
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
                        <Button type="button" className="btn-base blue-normal cursor-pointer">
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
                      onChange={(value: string) => setSelectedGenre(value)}
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
                    className="w-[120px] btn-base blue-normal  cursor-pointer opacity-40 text-fr-16"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-[120px] btn-base blue-normal cursor-pointer text-fr-16"
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

export default AdminCreateNewMovieForm;
