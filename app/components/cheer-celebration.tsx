type CheerCelebrationProps = {
  visible: boolean;
};

export function CheerCelebration({ visible }: CheerCelebrationProps) {
  if (!visible) return null;

  return (
    <section className="mt-8 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-5 text-emerald-50 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
      <p className="text-xl font-bold tracking-wide">YEAH!!!!!!!</p>
      <p className="mt-1 text-sm text-emerald-100/80">
        あなたはブログを閲覧する権限を獲得しました。
      </p>
      <a href="https://blog.devkey.jp" rel="noopener noreferrer">
        CLICK HERE!
      </a>
    </section>
  );
}
