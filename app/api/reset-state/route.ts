import { NextResponse } from "next/server";
import { resetJobState } from "@/utils/route";

export async function POST() {
    try {
      resetJobState();
      return NextResponse.json({ status: "ok", message: "Job state reset" });
    } catch (err) {
      console.error("Error resetting job state:", err);
      return NextResponse.json({ status: "error", message: "Failed to reset" }, { status: 500 });
    }
  }