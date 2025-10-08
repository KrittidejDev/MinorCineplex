interface ProfileProps {
    firstName: string;
    lastName: string;
    imageUrl?: string;
}

export function ActorProfile({ firstName, lastName, imageUrl }: ProfileProps) {
    return (
        <>
        <div className="flex flex-col gap-2 items-center">
            <img src={imageUrl} alt="" className="min-w-[70px] min-h-[70px] lg:w-[110px] lg:h-[110px] rounded-full bg-white" />
            <p className="font-bold text-white-wfff text-center">{firstName} <br /> {lastName}</p>
        </div>
        </>
    )
}

export function DirectorProfile({ firstName, lastName, imageUrl }: ProfileProps) {
    return (
        <>
        <div className="flex flex-col gap-2 items-center">
            <img src={imageUrl} alt="" className="min-w-[70px] min-h-[70px] lg:w-[110px] lg:h-[110px] rounded-full bg-white" />
            <p className="font-bold text-white-wfff text-center">{firstName} <br /> {lastName}</p>
        </div>
        </>
    )
}