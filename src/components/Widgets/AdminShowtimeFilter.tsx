import { InputDropdown } from "../Inputs/InputDropdown"

const AdminShowtimeFilter = () => {
    const movieOptions = [
        { value: "1", label: "Movie 1" },
        { value: "2", label: "Movie 2" },
    ]
    const cinemaOptions = [
        { value: "1", label: "Cinema 1" },
        { value: "2", label: "Cinema 2" },
    ]
  return (
    <div className="flex gap-4">
        <InputDropdown
        value=""
        onChange={() => {}}
        options={movieOptions}
        label="Movie Name"
        />
        <InputDropdown
        value=""
        onChange={() => {}}
        options={cinemaOptions}
        label="Cinema"
        />
        <InputDropdown
        value=""
        onChange={() => {}}
        options={cinemaOptions}
        label="Cinema"
        />
        <InputDropdown
        value=""
        onChange={() => {}}
        options={cinemaOptions}
        label="Cinema"
        />
    </div>
  )
}
export default AdminShowtimeFilter