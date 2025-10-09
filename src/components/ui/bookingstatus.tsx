export function BookingStatusPaid() {
    return (
        <>
        <div className="flex items-center py-1.5 px-4 bg-green-g372 rounded-full">
            <p className="font-medium text-sm text-white-wfff">Paid</p>
        </div>
        </>
    )
}

export function BookingStatusPayAtCinema() {
    return (
        <>
        <div className="flex items-center py-1.5 px-4 bg-blue-b9a8 rounded-full">
            <p className="font-medium text-sm text-white-wfff">Pay at cinema</p>
        </div>
        </>
    )
}

export function BookingStatusCompleted() {
    return (
        <>
        <div className="flex items-center py-1.5 px-4 border border-gray-g63f rounded-full">
            <p className="font-medium text-sm text-white-wfff">Completed</p>
        </div>
        </>
    )
}

export function BookingStatusCanceled() {
    return (
        <>
        <div className="flex items-center py-1.5 px-4 bg-gray-gf7e rounded-full">
            <p className="font-medium text-sm text-white-wfff">Canceled</p>
        </div>
        </>
    )
}