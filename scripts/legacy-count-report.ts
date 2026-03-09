import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function run() {
  const legacyPath = resolve(process.cwd(), "scripts", "legacy-export.json");
  const raw = await readFile(legacyPath, "utf8");
  const legacy = JSON.parse(raw) as {
    programs: unknown[];
    presenters: unknown[];
    scheduleHints: unknown[];
    streams: unknown[];
  };

  console.log("Legacy count report");
  console.log(`Programs: ${legacy.programs.length}`);
  console.log(`Presenters: ${legacy.presenters.length}`);
  console.log(`Schedule rows: ${legacy.scheduleHints.length}`);
  console.log(`Streams: ${legacy.streams.length}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});