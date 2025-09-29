import React from 'react'
import ShowtimeMovie from './ShowtimeMovie'
import DateSelectionBarWidget from './DateSelectionBarWidget'
import NavBarWidget from './NavBarWidget'
import FooterWidget from './FooterWidget'
import Image from 'next/image'

interface CinemaDetallWidgetProps {
  image?: string
  movie1Poster?: string
  movie2Poster?: string
  movie3Poster?: string
  movie4Poster?: string
}

const CinemaDetallWidget = ({
  image = "/images/banner.png",
  movie1Poster = "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_FMjpg_UX1000_.jpg",
  movie2Poster = "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
  movie3Poster = "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  movie4Poster = "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
}: CinemaDetallWidgetProps) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar */}
      <NavBarWidget />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center pt-[20px]">

        {/* Section 1: Cinema Header Info */}
        <section className="w-screen flex justify-start lg:justify-center lg:mt-[60px]">
          <div className="w-full lg:w-[1200px] lg:h-[600px] flex flex-col lg:flex-row">
            <div className="w-full bg-gray-gc1b rounded-lg overflow-hidden">
              <div className="flex flex-row sm:flex-col lg:flex-row">
                {/* Cinema Image */}
                <div className="w-1/2 sm:w-full lg:w-1/3 p-4 sm:p-6 lg:p-0">
                  <div className="w-full h-full sm:h-96 lg:h-[600px] bg-gray-700">
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt="Cinema Interior"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Cinema Details */}
                <div className="w-1/2 sm:w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-start pt-4 sm:pt-8 sm:mt-6">
                  {/* Cinema Title */}
                  <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
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

                  {/* Description - Desktop only */}
                  <div className="hidden lg:block space-y-4 mt-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Minor Cineplex cinemas often offer features like comfortable
                      seating, concession stands with snacks and drinks, and
                      advanced sound systems. Also have a hearing assistance and
                      wheelchair assess.
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Typically show a mix of Hollywood blockbusters, Thai films,
                      and independent or international movies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Section - Mobile and Tablet only */}
              <div className="lg:hidden px-4 sm:px-8 pb-8">
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Minor Cineplex cinemas often offer features like comfortable
                    seating, concession stands with snacks and drinks, and
                    advanced sound systems. Also have a hearing assistance and
                    wheelchair assess.
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Typically show a mix of Hollywood blockbusters, Thai films,
                    and independent or international movies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Date Selection */}
        <section className="w-full py-6 mb-8">
          <DateSelectionBarWidget />
        </section>

        {/* Section 3: Movie Showtimes */}
        <section className="w-full max-w-[1200px] px-4 sm:px-0">
          <div className="space-y-6">
            {/* Movie 1 - Django Unchained */}
            <div className="bg-gray-gc1b rounded-lg p-6 shadow-lg">
              <ShowtimeMovie
                movie={{
                  id: 'movie1',
                  title: 'Django Unchained',
                  poster: movie1Poster,
                  genreTags: ['Comedy', 'Drama'],
                  languageTag: 'EN',
                  movieDetailLink: '#',
                }}
                showtimes={{
                  groups: [
                    {
                      hallId: 'h1',
                      hallLabel: 'Hall 1',
                      times: [
                        { id: 't11', label: '11:30', disabled: true },
                        { id: 't12', label: '14:30' },
                        { id: 't13', label: '16:30' },
                      ],
                    },
                    {
                      hallId: 'h3',
                      hallLabel: 'Hall 3',
                      times: [
                        { id: 't31', label: '09:00', disabled: true },
                        { id: 't32', label: '12:00', disabled: true },
                        { id: 't33', label: '15:00' },
                        { id: 't34', label: '18:00' },
                      ],
                    },
                    {
                      hallId: 'h6',
                      hallLabel: 'Hall 6',
                      times: [
                        { id: 't61', label: '13:30' },
                        { id: 't62', label: '18:00' },
                        { id: 't63', label: '21:00' },
                      ],
                    },
                  ],
                }}
              />
            </div>

            {/* Movie 2 - The Dark Knight */}
            <div className="bg-gray-gc1b rounded-lg p-6 shadow-lg">
              <ShowtimeMovie
                movie={{
                  id: 'movie2',
                  title: 'The Dark Knight',
                  poster: movie2Poster,
                  genreTags: ['Action', 'Crime'],
                  languageTag: 'TH',
                  movieDetailLink: '#',
                }}
                showtimes={{
                  groups: [
                    {
                      hallId: 'h2',
                      hallLabel: 'Hall 2',
                      times: [
                        { id: 't21', label: '11:30', disabled: true },
                        { id: 't22', label: '14:30' },
                        { id: 't23', label: '16:30' },
                        { id: 't24', label: '20:30' },
                        { id: 't25', label: '23:30' },
                      ],
                    },
                    {
                      hallId: 'h4',
                      hallLabel: 'Hall 4',
                      times: [
                        { id: 't41', label: '15:00' },
                        { id: 't42', label: '18:00' },
                        { id: 't43', label: '21:00' },
                      ],
                    },
                  ],
                }}
              />
            </div>

            {/* Movie 3 - Interstella */}
            <div className="bg-gray-gc1b rounded-lg p-6 shadow-lg">
              <ShowtimeMovie
                movie={{
                  id: 'movie3',
                  title: 'Interstella',
                  poster: movie3Poster,
                  genreTags: ['Sci-fi'],
                  languageTag: 'TH/EN',
                  movieDetailLink: '#',
                }}
                showtimes={{
                  groups: [
                    {
                      hallId: 'h5',
                      hallLabel: 'Hall 5',
                      times: [
                        { id: 't51', label: '14:30' },
                        { id: 't52', label: '16:30' },
                        { id: 't53', label: '20:30' },
                        { id: 't54', label: '23:30' },
                      ],
                    },
                    {
                      hallId: 'h7',
                      hallLabel: 'Hall 7',
                      times: [
                        { id: 't71', label: '15:00' },
                        { id: 't72', label: '18:00' },
                        { id: 't73', label: '21:00' },
                      ],
                    },
                  ],
                }}
              />
            </div>

            {/* Movie 4 - Dune: Part Two */}
            <div className="bg-gray-gc1b rounded-lg p-6 shadow-lg">
              <ShowtimeMovie
                movie={{
                  id: 'movie4',
                  title: 'Dune: Part Two',
                  poster: movie4Poster,
                  genreTags: ['Action', 'Sci-fi'],
                  languageTag: 'TH',
                  movieDetailLink: '#',
                }}
                showtimes={{
                  groups: [
                    {
                      hallId: 'h8',
                      hallLabel: 'Hall 8',
                      times: [
                        { id: 't81', label: '14:30' },
                        { id: 't82', label: '16:30' },
                        { id: 't83', label: '20:30' },
                        { id: 't84', label: '23:30' },
                      ],
                    },
                    {
                      hallId: 'h9',
                      hallLabel: 'Hall 9',
                      times: [
                        { id: 't91', label: '15:00' },
                        { id: 't92', label: '18:00' },
                        { id: 't93', label: '21:00' },
                      ],
                    },
                  ],
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="mt-16">
        <FooterWidget />
      </footer>
    </div>
  )
}

export default CinemaDetallWidget
