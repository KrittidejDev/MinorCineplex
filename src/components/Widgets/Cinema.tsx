import DoneRound from "../Icons/DoneRound";

const Cinema = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <h1>All Cineme</h1>
        <div className="flex gap-3 justify-between items-center p-1 h-12 rounded-sm bg-gray-g63f">
          <button className="bg-gray-g63f h-11 py-2 px-4 rounded-sm text-gray-gedd">Browse by City</button>
          <button className="bg-gray-gf7e h-11 py-1 px-4 rounded-sm flex items-center text-gray-gedd">
            <DoneRound height="24"/>
            Nearest Location First
          </button>
        </div>
      </div>
    </div>
  );
};
export default Cinema;
