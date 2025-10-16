function AdminTableWidget() {
  const header = ["Poster", "Title", "Genre", "Rating", "Duration", "Actions"];
  return (
    <>
      <div>
        {/* header */}
        <div>
          {header.map((h) => (
            <p className="font-bold" key={h}>{h}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminTableWidget;
