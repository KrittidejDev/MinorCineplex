import CloseRoundLight from "../Icons/CloseRoundLight";

export function ErrorAlert() {
  return (
    <div className="max-w-[480px] bg-[#E5364B]/60 p-4 rounded-sm">
      <div className="flex justify-between">
        <h1 className="font-bold">Attention needed</h1>
        <button className="cursor-pointer"><CloseRoundLight /></button>
      </div>
      <p className="text-sm mt-1">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
        provident inventore aut quod saepe esse.
      </p>
    </div>
  );
}

export function SuccessAlert() {
  return (
    <div className="max-w-[480px] bg-[#00A372]/60 p-4 rounded-sm">
      <div className="flex justify-between">
        <h1 className="font-bold">Attention needed</h1>
        <button className="cursor-pointer"><CloseRoundLight /></button>
      </div>
      <p className="text-sm mt-1">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
        provident inventore aut quod saepe esse.
      </p>
    </div>
  );
}
