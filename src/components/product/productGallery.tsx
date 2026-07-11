import Image from "next/image";

interface ProductGalleryProps {
  title: string;
  /** Real photos in display order; empty when only the gradient cover exists. */
  photos: string[];
  cover?: string;
}

/**
 * Airbnb-style bento gallery: one large hero photo plus up to four smaller
 * tiles. Falls back to a single hero cell when only one photo (or only the
 * gradient placeholder) is available.
 */
export function ProductGallery({ title, photos, cover }: ProductGalleryProps) {
  if (photos.length === 0) {
    return (
      <div
        className="aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[16/7]"
        style={{ background: cover ?? "var(--bg-subtle)" }}
      />
    );
  }

  if (photos.length === 1) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[16/7]">
        <Image
          src={photos[0]}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  const [hero, ...rest] = photos.slice(0, 5);
  const tiles = rest.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-2 sm:aspect-[16/7] sm:grid-cols-4 sm:grid-rows-2">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-auto sm:col-span-2 sm:row-span-2">
        <Image
          src={hero}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 512px, 100vw"
          className="object-cover"
        />
      </div>
      {tiles.map((photo, index) => (
        <div
          key={photo + index}
          className="relative hidden aspect-square overflow-hidden sm:block sm:aspect-auto"
        >
          <Image
            src={photo}
            alt={title}
            fill
            sizes="256px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
