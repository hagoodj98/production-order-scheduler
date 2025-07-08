//Create predefined resources in a server component
import type { Resource, SlotKey, SlotStatus } from "./types"


const slotKeys: SlotKey[] = [
    "12:13-12:15",
    "12:14-12:17",
    "12:15-12:19",
  

  ];
//Created a function that would dynamically add resources to the table. 
  function createResource(id: number, name: string, status: SlotStatus): Resource {
    //This dynamically builds an Object by mapping through the Slot array
    const timeSlots = Object.fromEntries(
      slotKeys.map(key => [key, status])
      //This type assertion tells typescript that this object should be treated as having keys from SlotKey and values of type SlotStatus.
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


