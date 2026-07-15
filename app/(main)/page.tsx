import TimerControls from "@/components/timer/timer-controls";
import TimerDisplay from "@/components/timer/timer-display";
import TimerHeader from "@/components/timer/timer-header";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-20 py-20">
      <TimerHeader />
      <TimerDisplay />
      <TimerControls />
    </main>
  );
}
