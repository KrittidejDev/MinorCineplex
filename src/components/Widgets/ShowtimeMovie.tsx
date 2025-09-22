import React, { useState } from 'react'
import Tag from '@/components/Widgets/Tag'
import ShowtimeSelection from '@/components/Widgets/ShowtimeSelection'
import Image from 'next/image'
export type MovieData = {
  id: string
  title: string
  poster: string
  genreTags: string[]
  languageTag: string
  movieDetailLink?: string
}

export type ShowtimeData = {
  groups: Array<{
    hallId: string
    hallLabel: string
    times: Array<{
      id: string
      label: string
      disabled?: boolean
    }>
  }>
}

type ShowtimeTime = ShowtimeData['groups'][number]['times'][number]

interface ShowtimeMovieProps {
  movie?: MovieData
  showtimes?: ShowtimeData
  onTimeSelect?: (time: ShowtimeTime, context: { hallId: string }) => void
  className?: string
}

// Default mock data
const defaultMovie: MovieData = {
  id: 'movie1',
  title: 'The Dark Knight',
  poster:
    'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug',
  genreTags: ['Action', 'Crime'],
  languageTag: 'TH',
  movieDetailLink: '#',
}

const defaultShowtimes: ShowtimeData = {
  groups: [
    {
      hallId: 'h1',
      hallLabel: 'Hall 1',
      times: [
        { id: 't11', label: '11:30', disabled: true },
        { id: 't12', label: '14:30' },
        { id: 't13', label: '16:30' },
        { id: 't14', label: '20:30' },
        { id: 't15', label: '23:30' },
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
        { id: 't35', label: '21:00' },
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
}

export const ShowtimeMovie: React.FC<ShowtimeMovieProps> = ({
  movie = defaultMovie,
  showtimes = defaultShowtimes,
  onTimeSelect,
  className,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const handleTimeSelect = (
    time: ShowtimeTime,
    context: { hallId: string }
  ) => {
    setSelectedTime(time.id)
    onTimeSelect?.(time, context)
  }

  return (
    <div
      className={`flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8 ${
        className ?? ''
      }`}
    >
      {/* Movie Info Section */}
      <div className="flex-shrink-0 w-full lg:w-auto">
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-4 xl:gap-6">
          {/* Movie Poster */}
          <div className="flex-shrink-0 w-20 sm:w-24 md:w-32 lg:w-40 xl:w-48 mx-auto lg:mx-0">
            <div className="w-full aspect-[2/3] bg-gray-800 rounded-sm overflow-hidden">
              <div className="relative w-full h-full sm:h-80 md:h-96">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover object-center rounded "
                />
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            {/* Movie Title */}
            <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
              {movie.title}
            </h2>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 justify-center lg:justify-start">
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
      </div>

      {/* Showtimes Section */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
          {showtimes.groups.map((group) => (
            <div
              key={group.hallId}
              className="flex flex-col gap-2 sm:gap-3 lg:gap-4"
            >
              <div className="text-white/90 font-semibold text-base sm:text-lg lg:text-xl">
                {group.hallLabel}
              </div>
              <ShowtimeSelection
                times={group.times}
                onChange={(time: ShowtimeTime) =>
                  handleTimeSelect(time, { hallId: group.hallId })
                }
                className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 lg:gap-4"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShowtimeMovie
