import { existsSync } from "node:fs";
import { resolve } from "node:path";

export function resolveWorkspacePath(...segments: string[]) {
  const direct = resolve(process.cwd(), ...segments);
  if (existsSync(direct)) {
    return direct;
  }

  const workspaceRoot = resolve(process.cwd(), "..", "..", ...segments);
  return workspaceRoot;
}
