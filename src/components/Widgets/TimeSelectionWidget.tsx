import Tag from "./Tag";
import LocationIconBlue from "../Icons/LocationIconBlue";
import ShowtimeSelection from "./ShowtimeSelection";
import ExpandDownLight from "../Icons/ExpandDownLight";

function TimeSelectionWidget() {
  return (
    <>
      <div className="w-screen flex justify-center">
        <div className="w-[1200px] bg-gray-gc1b flex flex-col rounded-md">
          <div className="flex justify-between py-4 px-6 border-b border-gray-g63f">
            <div className="flex items-center gap-5">
              <LocationIconBlue />
              <h3 className="text-f-24">Minor Cineplex Arkhem</h3>
              <Tag name="Hearing assistance" />
              <Tag name="Wheelchair access" />
              <div>
                <ExpandDownLight width={40} height={40} color={"#C8CEDD"} />
              </div>
            </div>
          </div>
          <div className="px-6 mt-10">
            <h3 className="text-f-24 text-gray-gedd mb-4">Hall 1</h3>
            <ShowtimeSelection />
          </div>
          <div className="px-6 mt-15">
            <h3 className="text-f-24 text-gray-gedd mb-4">Hall 3</h3>
            <ShowtimeSelection />
          </div>
          <div className="px-6 mt-15 mb-10">
            <h3 className="text-f-24 text-gray-gedd mb-4">Hall 6</h3>
            <ShowtimeSelection />
          </div>
        </div>
      </div>
    </>
  );
}

export default TimeSelectionWidget;
