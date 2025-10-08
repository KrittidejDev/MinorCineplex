import { useState } from "react";
import ModalEmpty from "../Modals/ModalEmpty";
import UploadFile from "../Icons/UploadFile";
import { Button } from "../ui/button";
import AdminInputTextField from "../Inputs/AdminInputTextField";
import AdminInputTextArea from "../Inputs/AdminInputTextArea";

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
    trailer: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    duration: "",
    trailer: "",
  });

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
        <h1 className="font-bold text-f-56 text-gray-g63f">Add New Movie</h1>
        <div className="h-[316px] flex items-start gap-5 mt-5">
          <form className="flex flex-col flex-1">
            <div className="h-[316px] flex items-start gap-5">
              <div className="w-[250px] h-full flex justify-center pt-10 text-center border border-blue-bbee rounded-sm border-dashed">
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
                      <Button className="btn-base blue-normal">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>
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
                    <label
                      htmlFor="genre"
                      className="text-blue-bbee text-fr-16"
                    >
                      Genre
                    </label>
                    <input
                      type="text"
                      name="genre"
                      id="genre"
                      placeholder="Action"
                      className="w-full p-3 border border-blue-bbee rounded-sm text-gray-gc1b placeholder:text-gray-g3b0 mt-1"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label
                      htmlFor="rating"
                      className="text-blue-bbee text-fr-16"
                    >
                      Rating
                    </label>
                    <input
                      type="text"
                      name="rating"
                      id="rating"
                      placeholder="13+"
                      className="w-full p-3 border border-blue-bbee rounded-sm text-gray-gc1b placeholder:text-gray-g3b0 mt-1"
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

export default AdminCreateNewMovieForm;
