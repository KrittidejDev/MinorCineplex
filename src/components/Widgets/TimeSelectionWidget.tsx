import TimeSelectionCard from "../Cards/TimeSelectionCard";

function TimeSelectionWidget() {
  return (
    <>
      <div className="w-screen flex flex-col items-center gap-6 mb-20">
        <TimeSelectionCard
          cinemaName="Minor Cineplex Arkham"
          halls={[1, 3, 6]}
          tags={["Hearing assistance", "Wheelchair access"]}
        />
        <TimeSelectionCard cinemaName="Minor Riddler Factory" halls={[2, 5]} />
        <TimeSelectionCard
          cinemaName="Minor Cineplex Tricorner"
          halls={[1]}
          tags={["Hearing assistance", "Wheelchair access"]}
        />
      </div>
    </>
  );
}

export default TimeSelectionWidget;
