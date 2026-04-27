import { NextResponse } from "next/server";
import { sheetsClient } from "@/lib/google/sheets-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    const symbolRows = await sheetsClient.getRange("Assets!A2:K");
    const symbolObj = symbolRows.find(
      (row: any[]) => row[0] === symbol || row[1] === symbol
    );

    if (!symbolObj) {
      return NextResponse.json(
        { success: false, error: "Symbol not found" },
        { status: 404 }
      );
    }

    const biasRows = await sheetsClient.getRange("Bias_States!A2:Z");

    const filtered = biasRows.filter(
      (row: any[]) => row[0] === symbolObj[0] || row[1] === symbolObj[0]
    );

    return NextResponse.json({
      success: true,
      symbol,
      data: filtered,
    });
  } catch (error) {
    console.error("Failed to fetch bias states:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch bias states" },
      { status: 500 }
    );
  }
}