import DateSelection from "../ui/dateselection"
import ExpandRightLight from "../Icons/ExpandRightLight"

function DateSelectionBarWidget() {
    return (
        <>
            <div className="w-screen h-fit bg-gray-gc1b flex justify-center items-center lg:mt-12">
                <div className="flex items-center gap-2 py-4 overflow-x-auto justify-start lg:justify-center flex-nowrap">
                    <DateSelection className="flex-shrink-0" day={"Today"} date={"24 Jun 2024"} />
                    <DateSelection className="flex-shrink-0" day={"Tue"} date={"25 Jun 2024"} />
                    <DateSelection className="flex-shrink-0" day={"Wed"} date={"26 Jun 2024"} />
                    <DateSelection className="flex-shrink-0" day={"Thu"} date={"27 Jun 2024"} />
                    <DateSelection className="flex-shrink-0" day={"Fri"} date={"28 Jun 2024"} />
                    <DateSelection className="flex-shrink-0" day={"Sat"} date={"29 Jun 2024"} />
                    <div>
                    <ExpandRightLight width={40} height={40} color={"#C8CEDD"} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DateSelectionBarWidget