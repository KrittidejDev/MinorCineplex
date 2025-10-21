import React, { useState, useEffect } from "react";
import { SearchLight, ExpandDownLight, DateTodayLight } from "../Icons/Icons";
import { Input } from "../ui/input";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MovieStatus } from "@/types/enums";
import { userService } from "@/config/userServices";


interface FilterOption {
  id?: string;
  value?: string;
  name: string;
}

interface FilterSearchProps {
  onSearch?: (filters: FilterData) => void;
  query: FilterData;
  setQuery: (query: FilterData) => void;
  className?: string;
  movies: Movie[];
}

export interface FilterData {
  title?: string;
  genre?: string;
  language?: string;
  release_date?: string;
  status?: MovieStatus;
}

interface Movie {
  id: string;
  title: string;
  genre?: string;
  release_date?: Date;
}

const languageOptions: FilterOption[] = [
  { value: "th", name: "TH" },
  { value: "en", name: "EN" },
];

const FilterSearch: React.FC<FilterSearchProps> = ({
  onSearch,
  query,
  setQuery,
  className = "",
  movies,
}) => {
  const [genreOptions, setGenreOptions] = useState<FilterOption[]>([]);

  const fetchGenres = async () => {
    const response = await userService.GET_FILTER_GENRE();
    setGenreOptions(response as FilterOption[]);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleInputChange = (field: keyof FilterData, value: string) => {
    setQuery({
      ...query,
      [field]: value,
    });
  };

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };
  return (
    <div className={`bg-gray-g63f rounded-lg p-4 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 items-center max-w-xs mx-auto lg:max-w-none lg:mx-0">
        {/* Movie Dropdown */}
        <div className="w-full lg:w-48">
          <Select
            value={
              movies.find((m) => m.title === query?.title)?.id || ""
            }
            onValueChange={(value) => {
              const movie = movies.find((m) => m.id === value);
              handleInputChange("title", movie?.title || "");
            }}
          >
            <SelectTrigger className="bg-gray-g63f border-gray-gf7e text-white rounded-sm h-12 focus:border-gray-g3b0 focus:ring-0 w-full relative cursor-pointer">
              <SelectValue placeholder="Movie" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ExpandDownLight width="16" height="16" color="#8B93B0" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-g63f border-gray-gf7e">
              {movies?.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id}
                  className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                >
                  {option.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language + Genre */}
        <div className="flex gap-2 lg:contents">
          <div className="w-39 lg:w-48">
            <Select
              value={query?.language || ""}
              onValueChange={(value) => handleInputChange("language", value)}
            >
              <SelectTrigger className="bg-gray-g63f border-gray-gf7e text-white rounded-sm h-12 focus:border-gray-g3b0 focus:ring-0 w-full relative cursor-pointer">
                <SelectValue placeholder="Language" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ExpandDownLight width="16" height="16" color="#8B93B0" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-g63f border-gray-gf7e">
                {languageOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value || ""}
                    className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                  >
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-39 lg:w-48">
            <Select
              value={query?.genre || ""}
              onValueChange={(value) => handleInputChange("genre", value)}
            >
              <SelectTrigger className="bg-gray-g63f border-gray-gf7e text-white rounded-sm h-12 focus:border-gray-g3b0 focus:ring-0 w-full relative cursor-pointer">
                <SelectValue placeholder="Genre" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ExpandDownLight width="16" height="16" color="#8B93B0" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-g63f border-gray-gf7e">
                {genreOptions.length > 0 ? (
                  genreOptions.map((genre) => (
                    <SelectItem
                      key={genre.id}
                      value={genre.name}
                      className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                    >
                      {genre.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    No genres found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 lg:contents">
          {/* Release Date */}
          <div className="w-39 lg:w-48">
            <div className="relative">
              <Input
                type="text"
                placeholder="Release Date"
                value={query?.release_date || ""}
                onChange={(e) =>
                  handleInputChange("release_date", e.target.value)
                }
                onKeyPress={handleKeyPress}
                className="bg-gray-g63f border-gray-gf7e text-white placeholder-gray-g3b0 rounded-sm h-9 pl-4 pr-12 focus:border-gray-g3b0 focus:ring-0 w-full cursor-pointer"
              />
              <input
                type="date"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.value) {
                    const date = new Date(e.target.value);
                    const isoString = date.toISOString();
                    handleInputChange("release_date", isoString);
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <DateTodayLight width="16" height="16" color="#8B93B0" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full flex justify-center lg:w-auto">
          <button
            onClick={handleSearch}
            className="bg-blue-bbee hover:bg-blue-b9a8 text-white rounded-sm h-9 px-5 flex items-center justify-center transition-colors duration-200 w-15 lg:w-auto cursor-pointer"
          >
            <SearchLight width="30" height="30" color="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSearch;
