import React, { useState } from "react";
import Tag from "@/components/Widgets/Tag";
import ShowTime from "@/components/Widgets/ShowTime";

export type MovieData = {
    id: string;
    title: string;
    poster: string;
    genreTags: string[];
    languageTag: string;
    movieDetailLink?: string;
};

export type ShowtimeData = {
    groups: Array<{
        hallId: string;
        hallLabel: string;
        times: Array<{
            id: string;
            label: string;
            disabled?: boolean;
        }>;
    }>;
};

interface ShowtimeMovieProps {
    movie: MovieData;
    showtimes: ShowtimeData;
    onTimeSelect?: (time: any, context: { hallId: string }) => void;
    className?: string;
}

export const ShowtimeMovie: React.FC<ShowtimeMovieProps> = ({
    movie,
    showtimes,
    onTimeSelect,
    className,
}) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleTimeSelect = (time: any, context: { hallId: string }) => {
        setSelectedTime(time.id);
        onTimeSelect?.(time, context);
    };

    return (
        <div className={`flex flex-col lg:flex-row gap-6 lg:gap-8 ${className ?? ""}`}>
            {/* Movie Info Section */}
            <div className="flex-shrink-0 w-full lg:w-auto">
                <div className="w-full max-w-[285px] lg:max-w-[285px] mx-0">
                    {/* Movie Poster */}
                    <div className="w-full aspect-[2/3] bg-gray-800 rounded-sm overflow-hidden mb-4">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    {/* Movie Title */}
                    <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-4">
                        {movie.title}
                    </h2>


                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {movie.genreTags.map((tag, index) => (
                            <Tag key={index} name={tag} variant="genre" />
                        ))}
                        <Tag name={movie.languageTag} variant="language" />
                    </div>

                    {/* Movie Detail Link */}
                    {movie.movieDetailLink && (
                        <a
                            href={movie.movieDetailLink}
                            className="text-white underline hover:text-white/80 transition-colors text-sm"
                        >
                            Movie detail
                        </a>
                    )}
                </div>
            </div>

            {/* Showtimes Section */}
            <div className="flex-1 min-w-0">
                <ShowTime
                    groups={showtimes.groups}
                    onChange={handleTimeSelect}
                />
            </div>
        </div>
    );
};

export default ShowtimeMovie;
