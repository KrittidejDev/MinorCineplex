import Image from "next/image";
import ExpandDownLight from "../Icons/ExpandDownLight";

function CitySelection() {
  return (
    <>
      <button className="min-w-[258px] w-full lg:max-w-[285px]">
        <div className="bg-gray-g63f text-gray-gf7e flex justify-between py-3 px-4 border border-gray-gf7e rounded-sm">
          <p>City</p>
          <ExpandDownLight width={24} height={24} color={"#565F7E"} />
        </div>
      </button>
    </>
  );
}

export default CitySelection;
