import { HomePageComponent } from "@/components/Home";

export function HomePage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center rounded-lg bg-transparent border-slate-400 overflow-auto">
      <HomePageComponent />
    </div>
  );
}
