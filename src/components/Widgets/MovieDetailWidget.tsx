import Tag from "../Widgets/Tag";
import { Button } from "../ui/button";

function MoviesDetailWidget() {
  return (
    <>
      <div className="w-screen flex justify-center mt-[60px]">
        <div className="w-[1200px] h-[600px] flex">
          <img src="" alt="" className="w-[411px] bg-white-wfff" />
          <div className="w-[669px] p-[60px] bg-gray-gc1b/70 backdrop-blur-xl rounded-md">
            <div className="flex flex-col gap-4">
              <h2 className="text-f-36 text-white-wfff">The Dark Knight</h2>
              <div className="flex items-center">
                <div className="flex gap-2">
                  <Tag name="Action" variant="genre" />
                  <Tag name="Crime" variant="genre" />
                  <Tag name="TH" variant="language" />
                </div>
                <p className="text-fr-16 text-gray-gedd px-5 ml-5 border-l border-gray-gedd">Release date: 18 Jun 2024</p>
              </div>
            </div>
            <div className="my-12">
            <Button className="btn-base blue-normal">Movie detail</Button>
            </div>
            <p className="text-fr-16 text-gray-gedd">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
              error deserunt eveniet, ex alias adipisci tenetur illum
              consequuntur nisi repellat quo magni deleniti repudiandae
              voluptatibus nihil cupiditate quae! Ad, vitae?
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MoviesDetailWidget;
