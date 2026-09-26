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
  incense: { src: "/images/spa-incense-candle.jpg", alt: "Incienso y velas en un espacio de ritual", w: 1123, h: 2000 },
  oilHand: { src: "/images/massage-oil-pour-hand.jpg", alt: "Aceite tibio vertiéndose en la mano de la terapeuta", w: 1500, h: 2000 },
  footBw: { src: "/images/foot-massage-bw.jpg", alt: "Reflexología en blanco y negro", w: 1333, h: 2000 },
  oilBowl: { src: "/images/spa-suite-oil-bowl.jpg", alt: "Ritual con cuenco de aceite en suite privada", w: 1333, h: 2000 },
  candles: { src: "/images/spa-ambiance-candles.jpg", alt: "Velas encendidas en un ambiente íntimo", w: 2000, h: 1333 },
  oilBottle: { src: "/images/essential-oil-bottle.jpg", alt: "Aceite esencial en un frasco de vidrio ámbar", w: 1333, h: 2000 },
  herbal: { src: "/images/herbal-compress-massage.jpg", alt: "Masaje con compresas herbales tibias", w: 1333, h: 2000 },
  bathTray: { src: "/images/spa-bath-tray.jpg", alt: "Ritual de baño con velas, sales y aceites", w: 1333, h: 2000 },
  aromaTowels: { src: "/images/aroma-burner-towels.jpg", alt: "Quemador de aromas encendido junto a toallas enrolladas", w: 3000, h: 2000 },
  backFlowers: { src: "/images/back-frangipani-flowers.jpg", alt: "Espalda en reposo con flores de frangipani", w: 1333, h: 2000 },
  candlesGlow: { src: "/images/candles-glow.jpg", alt: "Velas encendidas en penumbra", w: 1238, h: 1152 },
  oiledBack: { src: "/images/massage-oiled-back.jpg", alt: "Masaje con aceite sobre la espalda", w: 1440, h: 1920 },
  shoulders: { src: "/images/massage-shoulders.jpg", alt: "Terapeuta masajeando hombros y espalda", w: 1920, h: 1440 },
  suitePhone: { src: "/images/spa-suite-phone-bw.jpg", alt: "Suite de masajes lista, reservada desde el celular", w: 1125, h: 2000 },
  oilBottles: { src: "/images/oil-bottles-amber.jpg", alt: "Frascos de aceites esenciales en luz cálida", w: 1333, h: 2000 },
  thumbsBack: { src: "/images/massage-thumbs-back.jpg", alt: "Presión con los pulgares a lo largo de la espalda", w: 2000, h: 1333 },
  herbalFlatlay: { src: "/images/herbal-ritual-flatlay.jpg", alt: "Compresas herbales, sales, velas y aceites para el ritual", w: 1920, h: 1920 },
} satisfies Record<string, Photo>;

/**
 * Stand-in photography per catalog category, used when a service has no
 * uploaded image yet — so the catalog never shows an empty placeholder box.
 * Services within a category rotate through its list for variety.
 */
const CATEGORY_PHOTOS: Record<string, Photo[]> = {
  "eroticos-tantricos": [PHOTOS.oilBack, PHOTOS.candlesGlow, PHOTOS.oilHand],
  "terapias-especiales": [PHOTOS.hotStone, PHOTOS.oilBowl, PHOTOS.oiledBack, PHOTOS.incense, PHOTOS.thumbsBack],
  sensoriales: [PHOTOS.incense, PHOTOS.oilBottles],
  "experiencias-pareja": [PHOTOS.suite, PHOTOS.bathTray, PHOTOS.herbalFlatlay],
  "relajacion-muscular": [PHOTOS.shoulders, PHOTOS.herbal, PHOTOS.footBw, PHOTOS.hotStone],
};

const ALL = Object.values(PHOTOS);

export function fallbackPhoto(categorySlug: string | undefined, index: number): Photo {
  const list = (categorySlug && CATEGORY_PHOTOS[categorySlug]) || ALL;
  return list[index % list.length];
}
