"use client";

import React, { useEffect, useState } from "react";
import MovieCard from "../Cards/MovieCard";
import { APIMovie } from "@/types/movie";
import TrailerPlayer from "../Displays/TrailerPlayer";
import { ActorProfile, DirectorProfile } from "../ui/actordirectorlist";

interface MoviesDetailWidgetProps {
  movie: APIMovie;
}

const MovieInfoWidget: React.FC<MoviesDetailWidgetProps> = ({ movie }) => {
  
  const [activeTab, setActiveTab] = useState("ข้อมูลภาพยนต์");
  if (!movie) return <p>ไม่พบข้อมูลหนัง</p>;

  return (
    <div>
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

      {activeTab === "ข้อมูลภาพยนต์" && (
        <div className="flex flex-col gap-10 mt-10">
          <div>
            <h3 className="font-bold text-f-24">นักแสดง</h3>
            <div className="flex gap-2.5 mt-5">
              <ActorProfile />
              <ActorProfile />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-f-24">ผู้กำกับ</h3>
            <div className="flex gap-2.5 mt-5">
              <DirectorProfile />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-f-24">เรื่องย่อ</h3>
            <div className="mt-5">
              <p className="font-bold">{movie.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieInfoWidget;
