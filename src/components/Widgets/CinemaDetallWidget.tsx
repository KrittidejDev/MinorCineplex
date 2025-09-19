import React from "react";
import ShowtimeMovie from "./ShowtimeMovie";
import DateSelectionBarWidget from "./DateSelectionBarWidget";
import NavbarWithBannerWidget from "./NavbarWithBannerWidget";
import FooterWidget from "./FooterWidget";

const CinemaDetallWidget = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-start pt-[20px]">
            <div className="w-[1200px] flex flex-col">
                {/* Header with Banner - Cinema Info */}
                <div className="w-full bg-gray-gc1b rounded-lg overflow-hidden mb-8">
                    <div className="flex flex-col lg:flex-row">
                        {/* Cinema Image */}
                        <div className="w-full lg:w-1/3">
                            <div className="w-full h-100 lg:h-110 bg-gray-700">
                                <img
                                    src="https://images.unsplash.com/photo-1489599808417-8a3b4b5b5b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                    alt="Cinema Interior"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Cinema Details */}
                        <div className="w-full lg:w-2/3 p-8 flex flex-col justify-start pt-8">
                            {/* Cinema Title */}
                            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                                Minor Cineplex Arkham
                            </h1>

                            {/* Feature Tags */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="px-4 py-2 rounded-full bg-gray-600 text-white text-sm font-medium">
                                    Hearing assistance
                                </span>
                                <span className="px-4 py-2 rounded-full bg-gray-600 text-white text-sm font-medium">
                                    Wheelchair access
                                </span>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Minor Cineplex cinemas often offer features like comfortable seating, concession stands with snacks and drinks, and advanced sound systems. Also have a hearing assistance and wheelchair assess.
                                </p>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Typically show a mix of Hollywood blockbusters, Thai films, and independent or international movies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Date Selection Bar */}
                <div className="w-full  py-4 mb-8 flex justify-center">
                    <DateSelectionBarWidget />
                </div>

                {/* Main Content */}
                <div className="w-full">
                    <div className="space-y-8">
                        {/* Movie 1 - Django Unchained */}
                        <ShowtimeMovie
                            movie={{
                                id: "movie1",
                                title: "Django Unchained",
                                poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
                                genreTags: ["Comedy", "Drama"],
                                languageTag: "EN",
                                movieDetailLink: "#"
                            }}
                            showtimes={{
                                groups: [
                                    {
                                        hallId: "h1",
                                        hallLabel: "Hall 1",
                                        times: [
                                            { id: "t11", label: "11:30", disabled: true },
                                            { id: "t12", label: "14:30" },
                                            { id: "t13", label: "16:30" },

                                        ],
                                    },
                                    {
                                        hallId: "h3",
                                        hallLabel: "Hall 3",
                                        times: [
                                            { id: "t31", label: "09:00", disabled: true },
                                            { id: "t32", label: "12:00", disabled: true },
                                            { id: "t33", label: "15:00" },
                                            { id: "t34", label: "18:00" },

                                        ],
                                    },
                                    {
                                        hallId: "h6",
                                        hallLabel: "Hall 6",
                                        times: [
                                            { id: "t61", label: "13:30" },
                                            { id: "t62", label: "18:00" },
                                            { id: "t63", label: "21:00" },
                                        ],
                                    },
                                ]
                            }}
                        />

                        {/* Movie 2 - The Dark Knight */}
                        <ShowtimeMovie
                            movie={{
                                id: "movie2",
                                title: "The Dark Knight",
                                poster: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
                                genreTags: ["Action", "Crime"],
                                languageTag: "TH",
                                movieDetailLink: "#"
                            }}
                            showtimes={{
                                groups: [
                                    {
                                        hallId: "h2",
                                        hallLabel: "Hall 2",
                                        times: [
                                            { id: "t21", label: "11:30", disabled: true },
                                            { id: "t22", label: "14:30" },
                                            { id: "t23", label: "16:30" },
                                            { id: "t24", label: "20:30" },
                                            { id: "t24", label: "23:30" },
                                        ],
                                    },
                                    {
                                        hallId: "h4",
                                        hallLabel: "Hall 4",
                                        times: [
                                            { id: "t41", label: "15:00" },
                                            { id: "t42", label: "18:00" },
                                            { id: "t43", label: "21:00" },
                                        ],
                                    },
                                ]
                            }}
                        />

                        {/* Movie 3 - Interstella */}
                        <ShowtimeMovie
                            movie={{
                                id: "movie3",
                                title: "Interstella",
                                poster: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
                                genreTags: ["Sci-fi"],
                                languageTag: "TH/EN",
                                movieDetailLink: "#"
                            }}
                            showtimes={{
                                groups: [
                                    {
                                        hallId: "h5",
                                        hallLabel: "Hall 5",
                                        times: [
                                            { id: "t51", label: "14:30" },
                                            { id: "t52", label: "16:30" },
                                            { id: "t53", label: "20:30" },
                                            { id: "t54", label: "23:30" },
                                        ],
                                    },
                                    {
                                        hallId: "h7",
                                        hallLabel: "Hall 7",
                                        times: [
                                            { id: "t71", label: "15:00" },
                                            { id: "t72", label: "18:00" },
                                            { id: "t73", label: "21:00" },
                                        ],
                                    },
                                ]
                            }}
                        />

                        {/* Movie 4 - Dune: Part Two */}
                        <ShowtimeMovie
                            movie={{
                                id: "movie4",
                                title: "Dune: Part Two",
                                poster: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
                                genreTags: ["Action", "Sci-fi"],
                                languageTag: "TH",
                                movieDetailLink: "#"
                            }}
                            showtimes={{
                                groups: [
                                    {
                                        hallId: "h8",
                                        hallLabel: "Hall 8",
                                        times: [
                                            { id: "t81", label: "14:30" },
                                            { id: "t82", label: "16:30" },
                                            { id: "t83", label: "20:30" },
                                            { id: "t84", label: "23:30" },
                                        ],
                                    },
                                    {
                                        hallId: "h9",
                                        hallLabel: "Hall 9",
                                        times: [
                                            { id: "t91", label: "15:00" },
                                            { id: "t92", label: "18:00" },
                                            { id: "t93", label: "21:00" },
                                        ],
                                    },
                                ]
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CinemaDetallWidget;
