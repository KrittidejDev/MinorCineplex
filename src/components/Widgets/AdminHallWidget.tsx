import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";
import TableCard from "../Cards/TableCard";
import Eye from "../Icons/Eye";
import EditLight from "../Icons/EditLight";
import Trash from "../Icons/Trash";
import SearchLight from "../Icons/SearchLight";
import ArrowDown from "../Icons/ArrowDown";
import CloseRoundLight from "../Icons/CloseRoundLight";
import AdminComboBox from "../Inputs/AdminComboBox";
import AdminInputTextField from "../Inputs/AdminInputTextField";
import ModalEmpty from "../Modals/ModalEmpty";

type HallRow = {
  id: string;
  hallName: string;
  cinema: string;
  seatingCapacity: number;
  linkedShowtime: number;
};

export default function AdminHallWidget() {
  const [halls, setHalls] = useState<HallRow[]>([
    {
      id: "1",
      hallName: "Hall A",
      cinema: "Grand Cinema",
      seatingCapacity: 150,
      linkedShowtime: 3,
    },
    {
      id: "2", 
      hallName: "Hall B",
      cinema: "Grand Cinema",
      seatingCapacity: 120,
      linkedShowtime: 2,
    },
    {
      id: "3",
      hallName: "Hall C",
      cinema: "Grand Cinema", 
      seatingCapacity: 100,
      linkedShowtime: 1,
    },
    {
      id: "4",
      hallName: "Hall D",
      cinema: "Grand Cinema",
      seatingCapacity: 80,
      linkedShowtime: 0,
    },
    {
      id: "5",
      hallName: "Hall E",
      cinema: "Grand Cinema",
      seatingCapacity: 200,
      linkedShowtime: 4,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("All Cinemas");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCinema, setModalCinema] = useState("Cinema Branch");
  const [hallName, setHallName] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");

  const cinemaOptions = ["All Cinemas", "Grand Cinema", "Central Cinema", "Paragon Cinema"];
  const modalCinemaOptions = ["Cinema Branch", "Grand Cinema", "Central Cinema", "Paragon Cinema"];

  const filteredHalls = useMemo(() => {
    return halls.filter(hall => {
      const matchesSearch = hall.hallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hall.cinema.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCinema = selectedCinema === "All Cinemas" || hall.cinema === selectedCinema;
      return matchesSearch && matchesCinema;
    });
  }, [halls, searchTerm, selectedCinema]);

  const displayData = useMemo(() => {
    return filteredHalls.map(hall => ({
      ...hall,
      linkedShowtime: (
        <div className="flex justify-center">
          <span className="bg-blue-bbee text-white-wfff text-fr-12 px-2 py-1 rounded-full min-w-[24px] text-center">
            {hall.linkedShowtime}
          </span>
        </div>
      ),
    }));
  }, [filteredHalls]);

  const columns = useMemo(
    () => [
      { 
        key: "hallName", 
        label: <span className="text-white-wfff text-fm-16">Hall name</span>, 
        align: "left" as const 
      },
      { 
        key: "cinema", 
        label: <span className="text-white-wfff text-fm-16">Cinema</span>, 
        align: "left" as const 
      },
      { 
        key: "seatingCapacity", 
        label: <span className="text-white-wfff text-fm-16">Seating Capacity</span>, 
        align: "left" as const 
      },
      { 
        key: "linkedShowtime", 
        label: <span className="text-white-wfff text-fm-16">Linked Showtime</span>, 
        align: "left" as const 
      },
    ],
    []
  );

  const actions = useMemo(
    () =>
      filteredHalls.map((hall, idx) => ({
        onView: () => console.log("View Hall", hall.id),
        onEdit: () => console.log("Edit Hall", hall.id),
        onDelete: () => setHalls((prev) => prev.filter((_, i) => i !== idx)),
      })),
    [filteredHalls]
  );

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setHallName("");
    setSeatingCapacity("");
    setModalCinema("Cinema Branch");
  };

  const handleSave = () => {
    if (!hallName || !seatingCapacity || !modalCinema) return;
    
    const newHall: HallRow = {
      id: Date.now().toString(),
      hallName,
      cinema: modalCinema,
      seatingCapacity: parseInt(seatingCapacity),
      linkedShowtime: 0,
    };
    
    setHalls(prev => [...prev, newHall]);
    handleClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between mt-20 mx-[70px]">
        <h1 className="text-gray-g63f text-f-56 font-bold">Halls</h1>
        <Button
          className="btn-base blue-normal text-fm-16 font-bold gap-2.5 h-12 w-[135px] rounded-[4px] text-white"
          onClick={handleOpen}
        >
          <div className="text-white">
            <AddRoundLight width={24} height={24} />
          </div>
          Add Hall
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="mx-[70px] flex gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-g3b0">
            <SearchLight width={20} height={20} />
          </div>
          <input
            type="text"
            placeholder="Search Halls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-10 pr-10 rounded-[4px] border border-blue-bbee/70 outline-none focus:border-blue-bbee text-fr-14 text-gray-g3b0"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-g3b0"
            >
              <CloseRoundLight width={20} height={20} />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-12 px-4 rounded-[4px] border border-blue-bbee/70 outline-none focus:border-blue-bbee text-fr-14 text-gray-g3b0 bg-white-wfff flex items-center gap-2 min-w-[150px]"
          >
            <span>{selectedCinema}</span>
            <ArrowDown width={16} height={16} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white-wfff border border-blue-bbee/70 rounded-[4px] shadow-lg z-10">
              {cinemaOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedCinema(option);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-fr-14 text-gray-g3b0 hover:bg-gray-gc1b first:rounded-t-[4px] last:rounded-b-[4px]"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div>
        <TableCard
          columns={columns}
          actions={actions}
          data={displayData}
          headerPaddingClass="px-[30px] py-5"
          actionsHeaderPaddingClass="px-[30px] py-5"
        />
        <div className="mx-[70px] mt-4 text-gray-g3b0 text-fr-14">
          Showing {filteredHalls.length > 0 ? 1 : 0} to {Math.min(5, filteredHalls.length)} of {filteredHalls.length} results
        </div>
      </div>

      {/* Create New Hall Modal */}
      <ModalEmpty isShowModal={isModalOpen} onClose={handleClose}>
        <div className="w-full max-w-[920px] bg-white-wfff rounded-[8px] shadow-xl border border-gray-gedd">
          <div className="p-8 min-h-[61px]">
            <h2 className="text-f-56 text-gray-g63f">Create New Hall</h2>
            
            <div className="mt-6 flex flex-col gap-5">
              {/* Select Cinema */}
              <AdminComboBox
                label="Select Cinema"
                value={modalCinema}
                onChange={setModalCinema}
                options={modalCinemaOptions.map(option => ({ value: option, label: option }))}
                placeholder="Select Cinema"
              />

              {/* Seating Capacity */}
              <AdminInputTextField
                label="Seating Capacity"
                type="number"
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(e.target.value)}
                placeholder="e.g.,150"
              />

              {/* Hall Name */}
              <AdminInputTextField
                label="Hall Name"
                type="text"
                value={hallName}
                onChange={(e) => setHallName(e.target.value)}
                placeholder='e.g., "IMAX Theater"'
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button className="h-11 px-6 rounded-[4px] bg-gray-gedd text-gray-g3b0 hover:bg-gray-gedd" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="h-11 px-6 rounded-[4px] bg-blue-bbee text-white-wfff hover:bg-blue-b9a8" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </ModalEmpty>
    </div>
  );
}
