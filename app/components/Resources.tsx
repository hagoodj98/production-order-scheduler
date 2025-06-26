//Create predefined resources in a server component
import type { Resource, SlotKey, SlotStatus } from "./types"


const slotKeys: SlotKey[] = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
  ];

  function createResource(id: number, name: string, status: SlotStatus): Resource {
    const timeSlots = Object.fromEntries(
      slotKeys.map(key => [key, status])
    ) as Record<SlotKey, SlotStatus>;
  
    return {
      id,
      name,
      ...timeSlots,
    };
  }
  
  export const newResources: Resource[] = [
    createResource(1, "CNC Machine 1", "Available"),
    createResource(2, "Assembly Line A", "Available"),
    createResource(3, "Assembly Line B", "Available"),
    createResource(4, "Assembly Line C", "Available"),
  ];


