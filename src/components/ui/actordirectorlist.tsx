"use client";

import Image from "next/image";

interface ProfileProps {
  firstName: string;
  lastName: string;
  imageUrl?: string;
}

export function ActorProfile({ firstName, lastName, imageUrl }: ProfileProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="relative w-[70px] h-[70px] lg:w-[110px] lg:h-[110px] rounded-full bg-white overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`${firstName} ${lastName}`}
            fill
            className="object-cover"
          />
        )}
      </div>
      <p className="font-bold text-white-wfff text-center">
        {firstName} <br /> {lastName}
      </p>
    </div>
  );
}

export function DirectorProfile({
  firstName,
  lastName,
  imageUrl,
}: ProfileProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="relative w-[70px] h-[70px] lg:w-[110px] lg:h-[110px] rounded-full bg-white overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`${firstName} ${lastName}`}
            fill
            className="object-cover"
          />
        )}
      </div>
      <p className="font-bold text-white-wfff text-center">
        {firstName} <br /> {lastName}
      </p>
    </div>
  );
}
