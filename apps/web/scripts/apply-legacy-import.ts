import { readFile } from "node:fs/promises";
import { importLegacySnapshot } from "../lib/repository";
import { resolveWorkspacePath } from "../lib/workspace-path";

async function run() {
  const legacyPath = resolveWorkspacePath("scripts", "legacy-export.json");
  const raw = await readFile(legacyPath, "utf8");
  const payload = JSON.parse(raw);
  const result = await importLegacySnapshot(payload);

  console.log("Legacy import completed.");
  console.log(JSON.stringify(result, null, 2));
}

run().catch((error) => {
  console.error("Legacy import failed.");
  console.error(error);
  process.exit(1);
});
