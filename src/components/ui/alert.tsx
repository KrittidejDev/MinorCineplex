import CloseRoundLight from "../Icons/CloseRoundLight";

type messageAlertProps = {
  header: string;
  text: string;
  onClick?: () => void;
};

export function ErrorAlert({ header, text, onClick }: messageAlertProps) {
  return (
    <div className="max-w-[480px] bg-red-r64b/60 p-4 rounded-sm">
      <div className="flex gap-3 justify-between">
        <div className="flex flex-col gap-1">
          {header ? (
            <p>{header}</p>
          ) : (
            <h1 className="text-fm-16 font-bold">Attention needed</h1>
          )}
          {text ? (
            <p>{text}</p>
          ) : (
            <p className="text-fr-14 mt-1">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis provident inventore aut quod saepe esse.
            </p>
          )}
        </div>
        <div>
          <button onClick={onClick} className="cursor-pointer">
            <CloseRoundLight />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SuccessAlert({ header, text, onClick }: messageAlertProps) {
  return (
    <div className="max-w-[480px] bg-green-g372/60 p-4 rounded-sm">
      <div className="flex gap-3 justify-between">
        <div className="flex flex-col gap-1">
          {header ? (
            <p>{header}</p>
          ) : (
            <h1 className="text-fm-16 font-bold">Attention needed</h1>
          )}
          {text ? (
            <p>{text}</p>
          ) : (
            <p className="text-fr-14 mt-1">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis provident inventore aut quod saepe esse.
            </p>
          )}
        </div>
        <div>
          <button onClick={onClick} className="cursor-pointer">
            <CloseRoundLight />
          </button>
        </div>
      </div>
    </div>
  );
}
