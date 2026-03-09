import { getCurrentOrNextSchedule } from "@/lib/content";
import { getSchedule, getStreams } from "@/lib/repository";

import { DynamicPlayerUI } from "./DynamicPlayerUI";

const LOGO_URL = "/assets/seyr-logo.png";

export async function StickyPlayerDock() {
  const [streams, schedule] = await Promise.all([getStreams(), getSchedule()]);
  const stream = streams.find((item) => !/tvyayini_embed/i.test(item.streamUrl)) ?? streams[0];
  const nextEntry = getCurrentOrNextSchedule(schedule);

  if (!stream) {
    return null;
  }

  return <DynamicPlayerUI stream={stream} nextEntry={nextEntry} />;
}
