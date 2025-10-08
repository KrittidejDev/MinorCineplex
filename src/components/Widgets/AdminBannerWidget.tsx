import React, { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import AddRoundLight from "../Icons/AddRoundLight";
import TableCard from "../Cards/TableCard";
import Banner from "../Icons/Banner";
import Eye from "../Icons/Eye";
import EditLight from "../Icons/EditLight";
import Trash from "../Icons/Trash";
import CloudUpload from "../Icons/CloudUpload";
import IconCircle from "../Icons/IconCircle";
import ArrowDown from "../Icons/ArrowDown";

type BannerRow = {
  id: string;
  image: string;
  name: string;
  displayPage: string;
};

export default function AdminBannerWidget() {
  const [banners, setBanners] = useState<BannerRow[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [bannerName, setBannerName] = useState("");
  const [displayPage, setDisplayPage] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(
    () => [
      { 
        key: "image", 
        label: <span className="text-white-wfff text-fm-16">Image</span>, 
        align: "left" as const,
        width: "120px"
      },
      { 
        key: "name", 
        label: <span className="text-white-wfff text-fm-16">Banner Name</span>, 
        align: "left" as const 
      },
      { 
        key: "displayPage", 
        label: <span className="text-white-wfff text-fm-16">Display Page</span>, 
        align: "left" as const 
      },
    ],
    []
  );

  const actions = useMemo(
    () =>
      banners.map((banner, idx) => ({
        onView: () => {},
        onEdit: () => {},
        onDelete: () => setBanners((prev) => prev.filter((_, i) => i !== idx)),
      })),
    [banners]
  );

  const handleOpen = () => {
    setBannerName("");
    setDisplayPage("");
    setBannerImage(null);
    setIsDropdownOpen(false);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!bannerName || !displayPage || !bannerImage) return;
    setBanners((prev) => [...prev, { 
      id: Date.now().toString(),
      image: bannerImage.name,
      name: bannerName, 
      displayPage 
    }]);
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
    }
  };

  const dropdownOptions = [
    { value: "Home", label: "Home" },
    { value: "Movies", label: "Movies" },
    { value: "Cinemas", label: "Cinemas" }
  ];

  const handleOptionSelect = (value: string) => {
    setDisplayPage(value);
    setIsDropdownOpen(false);
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
        <h1 className="text-gray-g63f text-f-56 font-bold">Banners</h1>
        <Button
          className="btn-base blue-normal text-fm-16 font-bold gap-2.5 h-12 w-[135px] rounded-[4px]"
          onClick={handleOpen}
        >
          <AddRoundLight width={24} height={40} color={"#FFFFFF"} />
          Add Banner
        </Button>
      </div>

      <div>
        <TableCard
          columns={columns}
          actions={actions}
          data={banners}
          headerPaddingClass="px-[30px] py-5"
          actionsHeaderPaddingClass="px-[30px] py-5"
        />
        <div className="mx-[70px] mt-4 text-gray-g3b0 text-fr-14">
          Showing {banners.length > 0 ? 1 : 0} to {Math.min(5, banners.length)} of {banners.length} results
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-[920px] bg-white-wfff rounded-[8px] shadow-xl border border-gray-gedd">
            <div className="p-8 min-h-[61px]">
              <h2 className="text-f-56 text-gray-g63f">Create New Banner</h2>
              <p className="text-fr-16 text-gray-g3b0 mt-1">Fill in the details below to create a new promotional banner for the website.</p>

              <div className="mt-6 flex flex-col gap-5">
                <div>
                  <label className="block text-blue-bbee text-fr-16 mb-2">Banner Name</label>
                  <input
                    value={bannerName}
                    onChange={(e) => setBannerName(e.target.value)}
                    placeholder="e.g. Summer Block buster Special"
                    className="w-full h-12 px-4 rounded-[4px] border border-blue-bbee outline-none focus:border-blue-bbee text-fr-16 text-gray-g3b0"
                  />
                </div>

                <div>
                  <label className="block text-blue-bbee text-fr-16 mb-2">Display Page</label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full h-12 px-4 rounded-[4px] border border-blue-bbee outline-none focus:border-blue-bbee text-fr-16 text-gray-g3b0 bg-white-wfff flex items-center justify-between"
                    >
                      <span>{displayPage || "Select display page"}</span>
                      <ArrowDown width={20} height={20} />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white-wfff border border-blue-bbee rounded-[4px] shadow-lg z-10">
                        {dropdownOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleOptionSelect(option.value)}
                            className="w-full px-4 py-3 text-left text-fr-14 text-gray-g3b0 hover:bg-gray-gc1b first:rounded-t-[4px] last:rounded-b-[4px]"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-blue-bbee text-fr-16 mb-2">Banner Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".svg,.png,.jpg,.gif"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-1 border-dashed border-blue-bbee rounded-[4px] px-8 py-15 text-center hover:border-blue-bbee/70 transition-colors">
                      <div className="flex justify-center mb-4">
                        <IconCircle 
                          icon={CloudUpload}
                          size={70}
                          backgroundColor="bg-gray-g3b0/40"
                          iconColor="#FFFFFF"
                          iconSize={40}
                        />
                      </div>
                      <p className="text-fr-16 text-gray-g3b0 mb-1">
                        <span className="text-gray-g3b0 text-f-20">Click to upload</span> or Drag and drop
                      </p>
                      <p className="text-fr-16 text-gray-g3b0">SVG, PNG, JPG or GIF (MAX 800x400px)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button className="h-11 px-6 rounded-[4px] bg-gray-gedd text-gray-g3b0 hover:bg-gray-gedd" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button className="h-11 px-6 rounded-[4px] bg-blue-bbee text-white-wfff hover:bg-blue-b9a8" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
