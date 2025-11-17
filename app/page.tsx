import { DVDScreenSaver } from "./components/dvd-screen-saver";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 py-16 sm:px-12">

        <h2>角にぶつけたら....</h2>
        <section>
          <DVDScreenSaver />
        </section>

      </main>
    </div>
  );
}
