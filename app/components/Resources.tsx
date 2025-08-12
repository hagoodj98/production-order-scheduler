//Create predefined resources in a server component
import type { Resource, SlotKey, SlotStatus } from "./types"
import slots from "./dataslots";

const slotKeys = slots.map((slot) => `${slot.slot.start}-${slot.slot.end}`) as SlotKey[];
//Created a function that would dynamically add resources to the table. 
  function createResource(id: number, name: string, row: string, status: SlotStatus): Resource {
    //This dynamically builds an Object by mapping through the Slot array
    const timeSlots = Object.fromEntries(
      slotKeys.map(key => [key, status])
      //This type assertion tells typescript that this object should be treated as having keys from SlotKey and values of type SlotStatus.
    ) as Record<SlotKey, SlotStatus>;
  
    return {
      id,
      name,
      row,
      ...timeSlots,
    } as Resource;
  }
  
  export const newResources: Resource[] = [
    createResource(1, "CNC Machine 1", '0', "Available"),
    createResource(2, "Assembly Line A", '1', "Available"),
    createResource(3, "Assembly Line B", '2', "Available"),
    createResource(4, "Assembly Line C", '3', "Available"),
  ];


