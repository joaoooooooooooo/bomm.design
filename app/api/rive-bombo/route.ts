import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  const filePath = join(
    process.cwd(),
    "app",
    "Features",
    "riveBombo",
    "bombo2.riv",
  );

  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/octet-stream",
    },
  });
}
