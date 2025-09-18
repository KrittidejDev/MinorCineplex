import React from "react";
import ShowtimeMovie from "./ShowtimeMovie";
import DateSelectionBarWidget from "./DateSelectionBarWidget";
import NavbarWithBannerWidget from "./NavbarWithBannerWidget";
import FooterWidget from "./FooterWidget";

const CinemaDetallWidget = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header with Banner */}
            <NavbarWithBannerWidget />

            {/* Date Selection Bar */}
            <div className="w-full bg-gray-800 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <DateSelectionBarWidget />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
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
                                        { id: "t11", label: "14:30" },
                                        { id: "t12", label: "16:30" },
                                        { id: "t13", label: "20:30" },
                                        { id: "t14", label: "23:30" },
                                    ],
                                },
                                {
                                    hallId: "h3",
                                    hallLabel: "Hall 3",
                                    times: [
                                        { id: "t31", label: "15:00" },
                                        { id: "t32", label: "18:00" },
                                        { id: "t33", label: "21:00" },
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
                                        { id: "t21", label: "14:30" },
                                        { id: "t22", label: "16:30" },
                                        { id: "t23", label: "20:30" },
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

            {/* Footer */}
            <FooterWidget />
        </div>
    );
};

export default CinemaDetallWidget;
