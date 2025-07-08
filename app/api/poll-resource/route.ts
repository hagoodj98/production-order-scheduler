import { NextResponse } from "next/server";
import { newResources } from "@/app/components/Resources";


export async function GET() {
    return NextResponse.json({availability: newResources});
}