import React, { useState, useEffect } from "react";
import { SearchLight, ExpandDownLight, DateTodayLight } from "../Icons/Icons";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

// Types for filter options
interface FilterOption {
    value: string;
    label: string;
}

interface FilterSearchProps {
    onSearch?: (filters: FilterData) => void;
    className?: string;
}

interface FilterData {
    movie: string;
    language: string;
    genre: string;
    city: string;
    releaseDate: string;
}

// Movie data interface
interface Movie {
    id: string;
    title: string;
    title_en?: string;
    duration_min: number;
    description?: string;
    poster_url?: string;
    trailer_url?: string;
    genre?: string;
    rating?: string;
    release_date?: Date;
}

const languageOptions: FilterOption[] = [
    { value: "th", label: "ไทย" },
    { value: "en", label: "English" },
];

const genreOptions: FilterOption[] = [
    { value: "action", label: "Action" },
    { value: "comedy", label: "Comedy" },
    { value: "drama", label: "Drama" },
    { value: "horror", label: "Horror" },
    { value: "romance", label: "Romance" },
    { value: "sci-fi", label: "Sci-Fi" },
    { value: "thriller", label: "Thriller" },
    { value: "animation", label: "Animation" },
];

const cityOptions: FilterOption[] = [
    { value: "bangkok", label: "Bangkok" },
    { value: "chiang-mai", label: "Chiang Mai" },
    { value: "phuket", label: "Phuket" },
    { value: "pattaya", label: "Pattaya" },
    { value: "khon-kaen", label: "Khon Kaen" },
    { value: "udon-thani", label: "Udon Thani" },
];

const FilterSearch: React.FC<FilterSearchProps> = ({ onSearch, className = "" }) => {
    const [filters, setFilters] = useState<FilterData>({
        movie: "",
        language: "",
        genre: "",
        city: "",
        releaseDate: "",
    });

    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieOptions, setMovieOptions] = useState<FilterOption[]>([]);

    // Fetch movies from API
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('/api/movies');
                const data = await response.json();
                if (data.movie) {
                    setMovies(data.movie);
                    // Convert movies to filter options
                    const options = data.movie.map((movie: Movie) => ({
                        value: movie.id,
                        label: movie.title
                    }));
                    setMovieOptions(options);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);

    const handleInputChange = (field: keyof FilterData, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(filters);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={`bg-gray-g63f rounded-lg p-4 ${className}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Movie Dropdown */}
                <div className="w-full lg:w-48">
                    <Select
                        value={filters.movie}
                        onValueChange={(value) => handleInputChange('movie', value)}
                    >
                        <SelectTrigger className="bg-gray-g63f border-gray-gf7e text-white rounded-sm h-12 focus:border-gray-g3b0 focus:ring-0 w-full relative cursor-pointer">
                            <SelectValue placeholder="Movie" />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ExpandDownLight width="16" height="16" color="#8B93B0" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-g63f border-gray-gf7e">
                            {movieOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Language Dropdown */}
                <div className="w-full lg:w-48">
                    <Select
                        value={filters.language}
                        onValueChange={(value) => handleInputChange('language', value)}
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
                                    value={option.value}
                                    className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Genre Dropdown */}
                <div className="w-full lg:w-48">
                    <Select
                        value={filters.genre}
                        onValueChange={(value) => handleInputChange('genre', value)}
                    >
                        <SelectTrigger className="bg-gray-g63f border-gray-gf7e text-white rounded-sm h-12 focus:border-gray-g3b0 focus:ring-0 w-full relative cursor-pointer">
                            <SelectValue placeholder="Genre" />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ExpandDownLight width="16" height="16" color="#8B93B0" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-g63f border-gray-gf7e">
                            {genreOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* City Dropdown */}
                <div className="w-full lg:w-48">
                    <Select
                        value={filters.city}
                        onValueChange={(value) => handleInputChange('city', value)}
                    >
                        <SelectTrigger className="bg-gray-g63f border-gray-gf7e text-white rounded-sm h-12 focus:border-gray-g3b0 focus:ring-0 w-full relative cursor-pointer">
                            <SelectValue placeholder="City" />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ExpandDownLight width="16" height="16" color="#8B93B0" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-g63f border-gray-gf7e">
                            {cityOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-white hover:bg-gray-gf7e focus:bg-gray-gf7e cursor-pointer"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Release Date Input */}
                <div className="w-full lg:w-48">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Release Date"
                            value={filters.releaseDate}
                            onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="bg-gray-g63f border-gray-gf7e text-white placeholder-gray-g3b0 rounded-sm h-12 pl-4 pr-12 focus:border-gray-g3b0 focus:ring-0 w-full cursor-pointer"
                            onClick={() => {
                                const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                                if (dateInput) {
                                    dateInput.focus();
                                    dateInput.click();
                                }
                            }}
                        />
                        {/* Overlay the date input on top of the text input */}
                        <input
                            type="date"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                                if (e.target.value) {
                                    // Format date to DD/MM/YYYY
                                    const date = new Date(e.target.value);
                                    const formattedDate = date.toLocaleDateString('en-GB');
                                    handleInputChange('releaseDate', formattedDate);
                                }
                            }}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <DateTodayLight width="16" height="16" color="#8B93B0" />
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <div className="w-full lg:w-auto">
                    <button
                        onClick={handleSearch}
                        className="bg-blue-bbee hover:bg-blue-b9a8 text-white rounded-sm h-12 px-6 flex items-center justify-center gap-2 transition-colors duration-200 w-full lg:w-auto cursor-pointer"
                    >
                        <SearchLight width="30" height="30" color="#FFFFFF" />
                        <span className="text-fm-16"></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSearch;
