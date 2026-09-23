/**
 * The site's own photography, in one place. Dimensions are the real pixel
 * size of the optimized files in /public/images (long side 2000px), so
 * next/image can reserve exact space and avoid layout shift.
 */
export type Photo = { src: string; alt: string; w: number; h: number };

export const PHOTOS = {
  suite: { src: "/images/spa-suite-massage.jpg", alt: "Suite privada de masajes", w: 1333, h: 2000 },
  oilBack: { src: "/images/massage-oil-pour-back.jpg", alt: "Aceite tibio deslizándose sobre la espalda", w: 1333, h: 2000 },
  hotStone: { src: "/images/hot-stone-massage.jpg", alt: "Piedras de jade sobre la espalda durante una terapia", w: 1615, h: 2000 },
  handsBack: { src: "/images/massage-hands-back.jpg", alt: "Manos de la terapeuta en contacto consciente", w: 1500, h: 2000 },
  incense: { src: "/images/spa-incense-candle.jpg", alt: "Incienso y velas en un espacio de ritual", w: 1123, h: 2000 },
  oilHand: { src: "/images/massage-oil-pour-hand.jpg", alt: "Aceite tibio vertiéndose en la mano de la terapeuta", w: 1500, h: 2000 },
  footBw: { src: "/images/foot-massage-bw.jpg", alt: "Reflexología en blanco y negro", w: 1333, h: 2000 },
  oilBowl: { src: "/images/spa-suite-oil-bowl.jpg", alt: "Ritual con cuenco de aceite en suite privada", w: 1333, h: 2000 },
  candles: { src: "/images/spa-ambiance-candles.jpg", alt: "Velas encendidas en un ambiente íntimo", w: 2000, h: 1333 },
  oilBottle: { src: "/images/essential-oil-bottle.jpg", alt: "Aceite esencial en un frasco de vidrio ámbar", w: 1333, h: 2000 },
  herbal: { src: "/images/herbal-compress-massage.jpg", alt: "Masaje con compresas herbales tibias", w: 1333, h: 2000 },
  bathTray: { src: "/images/spa-bath-tray.jpg", alt: "Ritual de baño con velas, sales y aceites", w: 1333, h: 2000 },
} satisfies Record<string, Photo>;

/**
 * Stand-in photography per catalog category, used when a service has no
 * uploaded image yet — so the catalog never shows an empty placeholder box.
 * Services within a category rotate through its list for variety.
 */
const CATEGORY_PHOTOS: Record<string, Photo[]> = {
  "eroticos-tantricos": [PHOTOS.oilBack, PHOTOS.candles, PHOTOS.oilHand],
  "terapias-especiales": [PHOTOS.hotStone, PHOTOS.oilBowl, PHOTOS.handsBack, PHOTOS.incense, PHOTOS.suite],
  sensoriales: [PHOTOS.incense, PHOTOS.candles],
  "experiencias-pareja": [PHOTOS.suite, PHOTOS.bathTray, PHOTOS.oilBowl],
  "relajacion-muscular": [PHOTOS.handsBack, PHOTOS.herbal, PHOTOS.footBw, PHOTOS.hotStone],
};

const ALL = Object.values(PHOTOS);

export function fallbackPhoto(categorySlug: string | undefined, index: number): Photo {
  const list = (categorySlug && CATEGORY_PHOTOS[categorySlug]) || ALL;
  return list[index % list.length];
}
