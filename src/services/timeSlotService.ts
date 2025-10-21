import * as timeSlotRepo from "../repositories/timeSlotRepository";

export const getTimeSlots = async () => {
    const timeSlots = await timeSlotRepo.getMany();
    return timeSlots;
};

export const getTimeSlotsForAdmin = async () => {
    const timeSlots = await timeSlotRepo.getMany();
    return timeSlots;
}