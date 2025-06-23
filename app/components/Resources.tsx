//Create predefined resources here. As a server component
import type { Resource } from "./types"

export const newResources: Resource[] = [
    {id: 1, name: "CNC Machine 1", status: "Available"},
    {id: 2, name: "Assembly Line A", status: "Available"},
    {id: 3,name: "Assembly Line B", status: "Available"},
    {id: 4,name: "Assembly Line C", status: "Available"}
]



//Then export this data to the dashboard client component where all predefined will load