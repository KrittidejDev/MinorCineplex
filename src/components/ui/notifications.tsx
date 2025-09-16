export function SuccessNotification() {
  return (
    <div>
      <div className="bg-[#00A372] text-white max-w-[480px] py-4 px-4 rounded-sm">
        <div className="flex justify-between">
        <h1 className="font-bold">Attention needed</h1>
        <button className="cursor-pointer">X</button>
        </div>
        <p className="max-w-[412px] mt-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
          reiciendis at rerum.
        </p>
      </div>
    </div>
  );
};

export function ErrorNotification() {
  return (
    <div>
      <div className="bg-[#E5364B] text-white max-w-[480px] py-4 px-4 rounded-sm">
        <div className="flex justify-between">
        <h1 className="font-bold">Attention needed</h1>
        <button className="cursor-pointer">X</button>
        </div>
        <p className="max-w-[412px] mt-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
          reiciendis at rerum.
        </p>
      </div>
    </div>
  );
};
