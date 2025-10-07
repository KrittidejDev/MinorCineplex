import ModalEmpty from "../Modals/ModalEmpty";
import UploadFile from "../Icons/UploadFile";
import { Button } from "../ui/button";

interface CreateNewMovieFormProps {
  isShowModal: boolean;
  onClose: () => void;
}

function AdminCreateNewMovieForm({
  isShowModal,
  onClose,
}: CreateNewMovieFormProps) {
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

              <div className="h-full flex flex-col flex-1">
                <label htmlFor="title" className="text-blue-bbee text-fr-16">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter movie title"
                  className="w-full p-3 border border-blue-bbee rounded-sm text-gray-gc1b placeholder:text-gray-g3b0 mt-1"
                />

                <label
                  htmlFor="description"
                  className="text-blue-bbee text-fr-16 mt-5"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Enter movie description"
                  className="flex-1 p-3 border border-blue-bbee rounded-sm text-gray-gc1b placeholder:text-gray-g3b0 mt-1 resize-none"
                />
              </div>
            </div>

            <div className="flex mt-5">
              <div className="flex flex-col">
                <label htmlFor="duration" className="text-blue-bbee text-fr-16">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  placeholder="e.g., 120"
                  className="w-full p-3 border border-blue-bbee rounded-sm text-gray-gc1b placeholder:text-gray-g3b0 mt-1"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </ModalEmpty>
  );
}

export default AdminCreateNewMovieForm;
