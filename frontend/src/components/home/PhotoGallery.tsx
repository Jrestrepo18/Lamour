"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const PHOTOS = [
  { src: "/images/spa-incense-candle.jpg", alt: "Incienso y velas encendidas en un espacio de ritual", w: 2912, h: 5184 },
  { src: "/images/massage-oil-pour-back.jpg", alt: "Aceite tibio deslizándose sobre la espalda antes del masaje", w: 3648, h: 5472 },
  { src: "/images/hot-stone-massage.jpg", alt: "Piedras de jade sobre la espalda durante una terapia", w: 2048, h: 2536 },
  { src: "/images/spa-suite-massage.jpg", alt: "Suite privada de masajes con jacuzzi", w: 4000, h: 6000 },
  { src: "/images/massage-hands-back.jpg", alt: "Manos de la terapeuta en contacto consciente", w: 3888, h: 5184 },
  { src: "/images/foot-massage-bw.jpg", alt: "Reflexología en blanco y negro", w: 3743, h: 5614 },
  { src: "/images/spa-bath-tray.jpg", alt: "Bandeja de baño con velas, sales y aceites", w: 3648, h: 5472 },
  { src: "/images/essential-oil-bottle.jpg", alt: "Aceite esencial en un frasco de vidrio ámbar", w: 3000, h: 4500 },
  { src: "/images/herbal-compress-massage.jpg", alt: "Masaje con compresas herbales tibias", w: 1693, h: 2540 },
  { src: "/images/massage-oil-pour-hand.jpg", alt: "Aceite tibio vertiéndose en la mano de la terapeuta", w: 3024, h: 4032 },
  { src: "/images/spa-suite-oil-bowl.jpg", alt: "Ritual con cuenco de aceite en suite privada", w: 3973, h: 5959 },
  { src: "/images/spa-ambiance-candles.jpg", alt: "Velas y figuras decorativas en un ambiente relajante", w: 5184, h: 3456 },
];

/**
 * Real photography, finally — every other homepage section leans on icons,
 * gradients and the 3D piece. Two distinct layouts rather than one shared
 * component forced to do both jobs: mobile gets a swipeable, cropped strip
 * (the native "story" gallery pattern, and the layout most visitors will
 * actually see first); sm+ gets an uncropped editorial masonry that keeps
 * each photo's real aspect ratio. Dark section so the photography reads as
 * the focal point rather than competing with the site's usual warm paper tone.
 */
export function PhotoGallery() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{
        // Real (opaque) multi-stop gradient rather than an alpha overlay — bookends this
        // dark section with the exact tones of its light neighbors (Hero's silk, ScrollTint's
        // ivory) so both transitions read as continuous instead of a hard light/dark cut.
        background:
          "linear-gradient(to bottom, #e6dfd3 0%, #2b2019 9%, #2b2019 91%, #fdfbf7 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-terracotta/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-2/3 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">El ritual, en detalle</p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-ivory text-balance sm:text-5xl">
            Cada sentido, cada instante
          </h2>
        </motion.div>
      </Container>

      {/* Mobile: swipeable strip, cropped to a consistent card so it reads as one gallery. */}
      <div className="relative mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:hidden">
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.05 * (i % 4), ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[3/4] w-[72vw] shrink-0 snap-center overflow-hidden rounded-[1.5rem]"
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="75vw" className="object-cover" />
          </motion.div>
        ))}
      </div>

      {/* sm+: uncropped editorial masonry — real aspect ratios, not forced squares. */}
      <Container className="relative mt-10 hidden sm:block">
        <div className="columns-2 gap-5 lg:columns-3">
          {PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.05 * (i % 6), ease: [0.16, 1, 0.3, 1] }}
              className="group relative mb-5 block overflow-hidden rounded-[1.5rem] break-inside-avoid"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                sizes="(min-width: 1024px) 30vw, 45vw"
                className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
