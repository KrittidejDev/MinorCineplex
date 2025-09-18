import CinemaCard from "../Cards/CinemaCard";
import DoneRound from "../Icons/DoneRound";
import { cinemaData } from "@/lib/data/mockData";


const CinemaLocation = () => {
  return (
    <main className="flex w-screen justify-center">
      <section className="flex w-full max-w-[1440px] flex-col gap-10 justify-center py-10 sm:py-20 px-4 xl:px-30">
        <header className="flex gap-5 flex-wrap justify-between">
          <h1 className="text-white text-4xl">All Cinemas</h1>
          <div className="flex gap-3 justify-between items-center p-1 h-12 rounded-sm bg-gray-g63f">
            <button className="bg-gray-g63f h-11 py-2 px-4 rounded-sm ">
             <p className="text-gray-gedd line-clamp-1">Browse by City</p> 
            </button>
            <button className="bg-gray-gf7e h-11 py-1 px-4 rounded-sm flex items-center ">
              <DoneRound height="30" width="30" />
              <p className="text-gray-gedd line-clamp-1">Nearest Location First</p>
            </button>
          </div>
        </header>
        <section className="flex flex-col gap-10">
          {cinemaData.map((data) => (
            <section className="flex flex-col gap-6" key={data.province}>
              <h2 className="text-gray-g3b0 text-2xl font-bold">{data.province}</h2>
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                {data.cinemas?.map((cinema) => (
                  <CinemaCard cinema={cinema} key={cinema.name} />
                ))}
              </div>
            </section>
          ))}
        </section>
      </section>
    </main>
  );
};
export default CinemaLocation;
