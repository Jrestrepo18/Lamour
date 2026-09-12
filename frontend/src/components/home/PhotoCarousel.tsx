import { Container } from "@/components/ui/Container";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { Reveal } from "@/components/ui/Reveal";

const PHOTOS = [
  { src: "/images/spa-suite-massage.jpg", alt: "Suite privada de masajes", w: 4000, h: 6000 },
  { src: "/images/massage-hands-back.jpg", alt: "Manos de la terapeuta en contacto consciente", w: 3888, h: 5184 },
  { src: "/images/spa-incense-candle.jpg", alt: "Incienso y velas en un espacio de ritual", w: 2912, h: 5184 },
  { src: "/images/hot-stone-massage.jpg", alt: "Piedras de jade sobre la espalda", w: 2048, h: 2536 },
  { src: "/images/massage-oil-pour-hand.jpg", alt: "Aceite tibio vertiéndose en la mano de la terapeuta", w: 3024, h: 4032 },
  { src: "/images/foot-massage-bw.jpg", alt: "Reflexología en blanco y negro", w: 3743, h: 5614 },
  { src: "/images/spa-suite-oil-bowl.jpg", alt: "Ritual con cuenco de aceite en suite privada", w: 3973, h: 5959 },
  { src: "/images/massage-oil-pour-back.jpg", alt: "Aceite tibio deslizándose sobre la espalda", w: 3648, h: 5472 },
  { src: "/images/spa-ambiance-candles.jpg", alt: "Velas encendidas en un ambiente íntimo", w: 5184, h: 3456 },
  { src: "/images/essential-oil-bottle.jpg", alt: "Aceite esencial en un frasco de vidrio ámbar", w: 3000, h: 4500 },
  { src: "/images/herbal-compress-massage.jpg", alt: "Masaje con compresas herbales tibias", w: 1693, h: 2540 },
  { src: "/images/spa-bath-tray.jpg", alt: "Ritual de baño con velas, sales y aceites", w: 3648, h: 5472 },
];

/**
 * A slow, continuous auto-scroll strip — the track holds two back-to-back
 * copies of the photo list and shifts exactly -50%, so the loop has no
 * visible seam (same technique as MarqueeBand's text ticker). Pauses on
 * hover on devices that have one; on touch devices there's no hover so it
 * just keeps drifting, which is the point — nothing to tap or swipe here,
 * it's a passing amient strip, not a gallery to operate.
 *
 * Edges fade via a real CSS mask (not a color-matched overlay) so it reads
 * correctly regardless of what's behind it — this section sits inside
 * ScrollTint, whose background color is mid-transition at this scroll depth.
 */
export function PhotoCarousel() {
  const track = [...PHOTOS, ...PHOTOS];

  return (
    <section className="overflow-hidden py-16 sm:py-20">
      <Container>
        <Reveal className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">Un vistazo</p>
          <h2 className="mt-3 font-serif text-3xl leading-[1.05] text-ink text-balance sm:text-4xl">
            El ritual, en detalle
          </h2>
        </Reveal>
      </Container>

      <div className="group/carousel relative mt-10">
        <div
          className="flex w-max animate-photo-scroll gap-4 px-5 group-hover/carousel:[animation-play-state:paused] sm:gap-5"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          {track.map((photo, i) => (
            <div
              key={`${photo.src}-${i}`}
              className="relative h-56 w-40 shrink-0 overflow-hidden rounded-[1.5rem] shadow-lg sm:h-72 sm:w-52"
            >
              <FadeInImage src={photo.src} alt={photo.alt} fill sizes="208px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
