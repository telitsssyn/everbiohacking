interface YouTubeProps {
  url: string;
  title?: string;
}

function extractId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/");
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    return null;
  }
  return null;
}

export function YouTube({ url, title }: YouTubeProps) {
  const id = extractId(url);
  if (!id) return null;
  return (
    <div className="my-8 aspect-video w-full overflow-hidden rounded-lg border border-white/10">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title ?? "YouTube video"}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
