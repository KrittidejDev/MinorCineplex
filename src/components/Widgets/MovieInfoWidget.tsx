"use client";

import React, { useState } from "react";
import MovieCard from "../Cards/MovieCard";
import MovieCardInfo from "../Cards/MovieCardInfo";
import { APIMovie } from "@/types/movie";
import TrailerPlayer from "../Displays/TrailerPlayer";
import { ActorProfile, DirectorProfile } from "../ui/actordirectorlist";
import InputSearch from "../Inputs/InputSearch";
import CitySelection from "../ui/cityselection";
import DateSelectionBarWidget from "./DateSelectionBarWidget";

interface MoviesDetailWidgetProps {
  movie: APIMovie;
}

const MovieInfoWidget: React.FC<MoviesDetailWidgetProps> = ({ movie }) => {
  const [activeTab, setActiveTab] = useState("ข้อมูลภาพยนต์");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  if (!movie) return <p>ไม่พบข้อมูลหนัง</p>;

  return (
    <>
      {/* Desktop Size */}
      <div className="hidden md:block">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between">
            <MovieCard
              id={movie.id}
              title={movie.title}
              poster_url={movie.poster_url || undefined}
              release_date={
                movie.release_date ? new Date(movie.release_date) : undefined
              }
              rating={movie.rating || undefined}
              genre={movie.genre || undefined}
            />
            <TrailerPlayer url={movie.trailer_url} />
          </div>
          <div className="flex gap-10 mt-10">
            <button
              className={`text-[20px] font-semibold cursor-pointer ${activeTab === "ข้อมูลภาพยนต์" ? "text-blue-bbee" : "text-white-wfff"}`}
              onClick={() => setActiveTab("ข้อมูลภาพยนต์")}
            >
              ข้อมูลภาพยนต์
            </button>
            <button
              className={`text-[20px] font-semibold cursor-pointer ${activeTab === "รอบฉาย" ? "text-blue-bbee" : "text-white-wfff"}`}
              onClick={() => setActiveTab("รอบฉาย")}
            >
              รอบฉาย
            </button>
          </div>
        </div>

        {activeTab === "ข้อมูลภาพยนต์" && (
          <div className="max-w-[1200px] mx-auto flex flex-col gap-10 mt-10">

            <div>
              <h3 className="font-bold text-f-24">นักแสดง</h3>
              <div className="flex flex-wrap gap-2.5 mt-5">
                {(movie.actors || []).map((actor) => {
                  const [firstName, ...rest] = actor.name.split(" ");
                  const lastName = rest.join(" ");
                  const hasImage = !!actor.imageUrl;

                  return (
                    <div key={actor.id}>
                      {hasImage ? (
                        <ActorProfile
                          firstName={firstName}
                          lastName={lastName}
                          imageUrl={actor.imageUrl ?? undefined}
                        />
                      ) : (
                        <div className="flex flex-col items-center text-white-wfff text-sm">
                          <span>{firstName}</span>
                          {lastName && <span>{lastName}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-f-24">ผู้กำกับ</h3>
              <div className="flex flex-wrap gap-2.5 mt-5">
                {(movie.directors || []).map((director) => {
                  const [firstName, ...rest] = director.name.split(" ");
                  const lastName = rest.join(" ");
                  const hasImage = !!director.imageUrl;

                  return (
                    <div key={director.id}>
                      {hasImage ? (
                        <DirectorProfile
                          firstName={firstName}
                          lastName={lastName}
                          imageUrl={director.imageUrl ?? undefined}
                        />
                      ) : (
                        <div className="flex flex-col items-center text-white-wfff text-sm">
                          <span>{firstName}</span>
                          {lastName && <span>{lastName}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-f-24">เรื่องย่อ</h3>
              <div className="mt-5">
                <p
                  className="font-bold"
                  dangerouslySetInnerHTML={{ __html: movie?.description ?? "" }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "รอบฉาย" && (
          <div>
            <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-5 items-center justify-center px-4 mt-10">
              <div className="w-full lg:w-[895px]">
                <InputSearch />
              </div>
              <div className="w-full lg:w-[285px]">
                <CitySelection />
              </div>
            </div>

            <div className="w-full mt-10">
              <DateSelectionBarWidget
                onSelectDate={(date) => setSelectedDate(date)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Size */}
      <div className="md:hidden">
        <TrailerPlayer
          url={movie.trailer_url}
          className="w-full h-full object-cover rounded-none"
        />
        <div className="px-4 py-10">
          <MovieCardInfo
            id={movie.id}
            title={movie.title}
            poster_url={movie.poster_url || undefined}
            release_date={
              movie.release_date ? new Date(movie.release_date) : undefined
            }
            rating={movie.rating || undefined}
            genre={movie.genre || undefined}
          />
          <div className="flex flex-col gap-10 mt-10">
            <div>
              <h3 className="font-bold text-f-24">ผู้กำกับ</h3>
              <div className="flex flex-wrap gap-2.5 mt-5">
                {(movie.directors || []).map((director) => {
                  const fullName = director.name;
                  const truncated =
                    fullName.length > 50
                      ? fullName.slice(0, 50) + "…"
                      : fullName;
                  const [firstName, ...rest] = truncated.split(" ");
                  const lastName = rest.join(" ");
                  const hasImage = !!(
                    director.imageUrl && director.imageUrl !== "null"
                  );

                  return (
                    <React.Fragment key={director.id}>
                      {hasImage ? (
                        <DirectorProfile
                          firstName={firstName}
                          lastName={lastName}
                          imageUrl={director.imageUrl ?? undefined}
                        />
                      ) : (
                        <div className="text-white text-center">
                          {firstName} <br /> {lastName}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-f-24">นักแสดง</h3>
              <div className="flex flex-wrap gap-2.5 mt-5">
                {(movie.actors || []).map((actor) => {
                  const fullName = actor.name;
                  const truncated =
                    fullName.length > 5 ? fullName.slice(0, 5) + "…" : fullName;
                  const [firstName, ...rest] = truncated.split(" ");
                  const lastName = rest.join(" ");
                  const hasImage = !!(
                    actor.imageUrl && actor.imageUrl !== "null"
                  );

                  return (
                    <React.Fragment key={actor.id}>
                      {hasImage ? (
                        <ActorProfile
                          firstName={firstName}
                          lastName={lastName}
                          imageUrl={actor.imageUrl ?? undefined}
                        />
                      ) : (
                        <div className="text-white">
                          {firstName} {lastName}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-f-24">เรื่องย่อ</h3>
              <div className="mt-5">
                <p
                  className="font-bold"
                  dangerouslySetInnerHTML={{ __html: movie?.description ?? "" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-10">
          <DateSelectionBarWidget
            onSelectDate={(date) => setSelectedDate(date)}
          />
        </div>
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-5 items-center justify-center px-4 mt-10">
          <div className="w-full lg:w-[895px]">
            <InputSearch />
          </div>
          <div className="w-full lg:w-[285px]">
            <CitySelection />
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieInfoWidget;
