import TimerBootstrap from "@/components/timer/timer-bootstrap";
import TimerControls from "@/components/timer/timer-controls";
import TimerDisplay from "@/components/timer/timer-display";
import TimerHeader from "@/components/timer/timer-header";

import { PATH } from "@/constants/path";
import { createMetadata } from "@/utils/create-metadata";

export const metadata = createMetadata({ path: PATH.HOME });

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-20 py-20">
      <TimerBootstrap />
      <TimerHeader />
      <TimerDisplay />
      <TimerControls />
    </main>
  );
}
