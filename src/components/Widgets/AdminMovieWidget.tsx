import { useState } from "react";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";

function AdminMovieWidget() {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);

  return (
    <>
      <div>
        <div className="flex justify-between items-center border border-red-500">
          <h1 className="font-bold text-f-56 text-gray-g63f">Movies</h1>

          <Button
            className="btn-base blue-normal text-fm-16 font-bold px-4 py-3 gap-2.5"
            onClick={() => setIsShowCreateModal(true)}
          >
            <AddRoundLight width={24} height={24} color={"#FFFFFF"} />
            Add Cinema
          </Button>
        </div>
      </div>
    </>
  );
}

export default AdminMovieWidget;
