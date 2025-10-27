import React, { useState, useEffect, useMemo, useCallback } from "react";
import { SearchLight, ExpandDownLight } from "../Icons/Icons";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MovieStatus } from "@/types/enums";
import { userService } from "@/config/userServices";
import { useTranslation } from "next-i18next";

interface FilterOption {
  id?: string;
  value?: string;
  name?: string;
  name_en?: string;
  name_th?: string;
}

interface FilterSearchProps {
  onSearch?: (filters: FilterData) => void;
  query: FilterData;
  setQuery: (query: FilterData) => void;
  className?: string;
  movies: Movie[];
}

export interface FilterData {
  movie_id?: string;
  genre?: string;
  language?: string;
  release_date?: string;
  status?: MovieStatus;
}

interface Movie {
  id: string;
  title: string;
  genre?: string;
  translations?: {
    th?: { title: string; description: string };
    en?: { title: string; description: string };
  };
  release_date?: Date;
}

const languageOptions = (lang: string): FilterOption[] => [
  { value: "all-languages", name: lang === "th" ? "ทุกภาษา" : "All Languages" },
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
  const { i18n } = useTranslation();
  const [genreOptions, setGenreOptions] = useState<FilterOption[]>([]);

  const texts = useMemo(
    () => ({
      allMovies: i18n.language === "th" ? "ภาพยนตร์ทั้งหมด" : "All Movies",
      allGenres: i18n.language === "th" ? "ประเภททั้งหมด" : "All Genres",
      allLanguages: i18n.language === "th" ? "ทุกภาษา" : "All Languages",
      movie: i18n.language === "th" ? "ภาพยนตร์" : "Movie",
      genre: i18n.language === "th" ? "ประเภท" : "Genre",
      language: i18n.language === "th" ? "ภาษา" : "Language",
      noGenresFound: i18n.language === "th" ? "ไม่พบประเภท" : "No genres found",
    }),
    [i18n.language]
  );

  const fetchGenres = useCallback(async () => {
    const response = await userService.GET_FILTER_GENRE();

    const genresArray = response as FilterOption[];
    const genreList = genresArray.map((genre) => ({
      id: genre.id,
      value: genre.id, // Use ID as value instead of name
      name: i18n.language === "th" ? genre.name_th : genre.name_en,
    }));

    setGenreOptions(genreList);
  }, [i18n.language]);

  useEffect(() => {
    if (i18n.language) fetchGenres();
  }, [fetchGenres, i18n.language]);

  const handleInputChange = (field: keyof FilterData, value: string) => {
    setQuery({
      ...query,
      [field]: value,
    });
  };

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className={`bg-gray-g63f rounded-lg p-4 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-5 items-center max-w-xs mx-auto lg:max-w-none lg:mx-0">
        {/* Movie Dropdown */}
        <div className="w-full lg:min-w-70">
          <Select
            value={query?.movie_id || "all-movies"}
            onValueChange={(value) => {
              if (value === "all-movies") {
                handleInputChange("movie_id", "");
              } else {
                handleInputChange("movie_id", value); // Store movie ID directly
              }
            }}
          >
            <SelectTrigger className="bg-gray-g63f border-gray-gf7e text-white rounded-sm h-12 focus:border-gray-g3b0 focus:ring-0 w-full relative cursor-pointer">
              <SelectValue placeholder={texts.movie} />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ExpandDownLight width="16" height="16" color="#8B93B0" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-g63f border-gray-gf7e">
              <SelectItem
                value="all-movies"
                className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
              >
                {texts.allMovies}
              </SelectItem>
              {movies?.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id}
                  className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                >
                  {i18n.language === "th"
                    ? option.translations?.th?.title
                    : option.translations?.en?.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language + Genre */}
        <div className="flex gap-5 max-w-70">
          <div className="w-39 lg:w-40">
            <Select
              value={query?.language || ""}
              onValueChange={(value) => handleInputChange("language", value)}
            >
              <SelectTrigger className="bg-gray-g63f border-gray-gf7e text-white rounded-sm h-12 focus:border-gray-g3b0 focus:ring-0 w-full relative cursor-pointer">
                <SelectValue placeholder={texts.language} />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ExpandDownLight width="16" height="16" color="#8B93B0" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-g63f border-gray-gf7e">
                {languageOptions(i18n.language).map((option) => (
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
                <SelectValue placeholder={texts.genre} />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ExpandDownLight width="16" height="16" color="#8B93B0" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-g63f border-gray-gf7e">
                <SelectItem
                  value="all-genres"
                  className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                >
                  {texts.allGenres}
                </SelectItem>
                {genreOptions.length > 0 ? (
                  genreOptions.map((genre) => (
                    <SelectItem
                      key={genre.id || genre.name}
                      value={genre.value || genre.name || ""}
                      className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                    >
                      {genre.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    {texts.noGenresFound}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
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
