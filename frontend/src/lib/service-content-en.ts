import type { Locale } from "@/i18n/config";
import { SERVICE_CONTENT, type ServiceContent } from "./service-content";

/**
 * English editorial copy for each service page (/en/servicios/[slug] and
 * /en/masajes-tantricos/[slug]) — the same facts as the Spanish version in
 * service-content.ts, written for visitors to Medellín. Same rules: nothing
 * the catalog doesn't state, and adult rituals described with restraint.
 */
export const SERVICE_CONTENT_EN: Record<string, ServiceContent> = {
  // ---------- General spa section ----------
  "piedras-volcanicas": {
    seoTitle: "Hot stone massage at your home or hotel in Medellín",
    seoDescription:
      "Hot volcanic stone therapy at your home or hotel in Medellín: 75 minutes of deep warmth for neck, back and shoulders. Book online.",
    intro: [
      "Heat relaxes the muscle before the hand even arrives. That's why volcanic stone therapy reaches tension a regular massage sometimes can't release: the smooth, warm stones rest on the most loaded points and then follow the therapist's movements.",
      "We bring it to your place anywhere in Medellín and the Aburrá Valley, so after the session you don't have to drive or go anywhere.",
    ],
    idealFor: [
      "Built-up stress in the neck, back and shoulders",
      "Stiffness from long days at a computer",
      "Anyone looking for deep relaxation with heat",
    ],
    session:
      "The session starts with gentle hand strokes to find the tense areas. Then the hot volcanic stones glide along the back and rest on the points of greatest tension while the warmth sinks in. Hands and stones alternate for the full 75 minutes, in a warm, unhurried atmosphere.",
    faqs: [
      {
        q: "Is the heat of the stones uncomfortable?",
        a: "It shouldn't be: the idea is a deep, pleasant warmth. If it ever feels too intense, tell your therapist and she will adjust the temperature or how long the stones rest.",
      },
    ],
  },
  "aceites-calientes": {
    seoTitle: "Warm oil massage at your home or hotel in Medellín",
    seoDescription:
      "Full-body massage with warm essential oils at your home or hotel in Medellín. 60 minutes of long, flowing strokes to switch off completely.",
    intro: [
      "Few things relax you like warm oil on the skin. In this therapy, warmed essential oils accompany long, continuous strokes over the whole body, combining the effect of heat with an enveloping technique.",
      "It's a session designed to switch off completely: no schedule, no rush and no need to leave your space.",
    ],
    idealFor: [
      "Unwinding at the end of a heavy week",
      "A first full-body massage experience",
      "Anyone who enjoys scents and the feel of warm oil",
    ],
    session:
      "The therapist warms the oils before starting and works with long, slow, continuous strokes from the back to the legs and arms. The rhythm stays steady so the body settles into deep calm for the full 60 minutes.",
    faqs: [
      {
        q: "Which oils do you use?",
        a: "Warm essential oils, applied with flowing strokes over the whole body. If you have any allergy or skin sensitivity, let us know when you book.",
      },
    ],
  },
  "experiencia-en-pareja": {
    seoTitle: "Couples massage at your home or hotel in Medellín",
    seoDescription:
      "Couples massage at your home or hotel in Medellín: one therapist each, in the same room at the same time. 60 minutes to share.",
    intro: [
      "Relax together, at the same time and in the same space. In the couples experience each of you has your own certified therapist, so nobody waits their turn: you both enjoy the session side by side, in sync.",
      "A different plan for an anniversary, a surprise, or simply a shared pause without leaving home — or your hotel.",
    ],
    idealFor: [
      "Anniversaries, birthdays and special dates",
      "Couples who want to share a moment of relaxation",
      "A gift that's different from a dinner out",
    ],
    session:
      "Two therapists arrive and set up the space in the same room. Each of you receives your massage at the same time, with synchronised movements, for 60 minutes. When it ends, you're both equally relaxed, at the same moment.",
    faqs: [
      {
        q: "Do we need two rooms?",
        a: "No. The experience is designed to happen in the same room, with one therapist per person working at the same time.",
      },
    ],
  },
  "masaje-interactivo": {
    seoTitle: "Interactive couples massage class at home in Medellín",
    seoDescription:
      "Learn to massage each other: a therapist guides you step by step at your place in Medellín. 60 minutes of mindful-touch techniques to repeat.",
    intro: [
      "Here, you two are the stars. In the interactive massage a therapist guides the couple step by step to massage each other, teaching mindful-touch techniques you can repeat later at home.",
      "It's as instructive as it is intimate: a way to strengthen your physical connection and take home more than an afternoon of relaxation.",
    ],
    idealFor: [
      "Couples who want to learn to give each other massages",
      "Reconnecting after a stretch of routine or stress",
      "A gift with something that stays after the session",
    ],
    session:
      "The therapist explains and demonstrates each technique, then stays with the couple while you practise, correcting pressure, rhythm and posture. You take turns giving and receiving over the 60 minutes until the movements come naturally.",
    faqs: [
      {
        q: "Do we need any experience?",
        a: "No. The therapist guides you from scratch and adapts the pace to you, so by the end you can repeat the techniques on your own.",
      },
    ],
  },
  "relajacion-clasica": {
    seoTitle: "Relaxing massage at your home or hotel in Medellín",
    seoDescription:
      "Classic relaxation massage (Swedish technique) at your home or hotel in Medellín: 60 minutes of medium pressure to release stress. Book online.",
    intro: [
      "The classic relaxing massage, done properly. We use the traditional Swedish technique, with medium pressure and long, enveloping strokes, to release everyday built-up stress.",
      "It's the best place to start if it's your first time with us or if you prefer a traditional session with no surprises.",
    ],
    idealFor: [
      "Your first in-home massage",
      "Work stress and general tension",
      "Anyone who prefers medium pressure, neither soft nor deep",
    ],
    session:
      "The session covers back, legs, arms and neck with the classic Swedish strokes: long glides, gentle kneading and light friction. Sixty minutes at an unhurried pace, designed to help the body slow down.",
    faqs: [
      {
        q: "How is it different from the deep muscle recovery massage?",
        a: "Classic relaxation uses medium pressure and aims to lower stress; deep muscle recovery works with sustained pressure on the most strained muscles and is meant for athletes or chronic tension.",
      },
    ],
  },
  "exfoliacion-corporal": {
    seoTitle: "Body scrub at your home or hotel in Medellín",
    seoDescription:
      "Full body scrub with natural salts and oils at your home or hotel in Medellín. 45 minutes to smoother skin; pair it with your massage.",
    intro: [
      "A full-body exfoliation with natural salts and oils that removes dead skin cells and leaves your skin visibly softer from the first session.",
      "It works on its own, but it shines as a prelude: renewed skin takes in the oils of any massage you book afterwards much better.",
    ],
    idealFor: [
      "Renewing your skin before a special occasion",
      "Preparing the skin before another ritual",
      "Dull or dry skin",
    ],
    session:
      "The therapist applies the blend of natural salts and oils with circular movements over the whole body, area by area, and then removes the scrub. Forty-five minutes you can book alone or combine with any of our other rituals.",
    faqs: [
      {
        q: "Can I combine it with a massage?",
        a: "Yes. It's designed to be paired with any other ritual: the scrub prepares the skin before the massage.",
      },
    ],
  },
  "masaje-pies-reflexologia": {
    seoTitle: "Foot reflexology at your home or hotel in Medellín",
    seoDescription:
      "Foot massage and reflexology at your home or hotel in Medellín: 30 minutes to ease fatigue and boost circulation. Express session or add-on.",
    intro: [
      "Your feet carry the whole day. This session works specifically on the reflexology points of the foot to ease accumulated fatigue and boost circulation after a long day — perfect after exploring the city on foot.",
      "Thirty minutes: enough as a stand-alone express session and ideal as an add-on to another service.",
    ],
    idealFor: [
      "Long days on your feet or walking",
      "A short session midweek",
      "Adding on to another massage",
    ],
    session:
      "The therapist starts by relaxing the whole foot and then presses the reflexology points one by one, with pressure adjusted to how it feels to you. She finishes with gentle strokes to boost circulation.",
    faqs: [
      {
        q: "Can I book it on its own?",
        a: "Yes. It works as a stand-alone 30-minute express session or as an add-on to any of our other services.",
      },
    ],
  },
  "recuperacion-muscular-profunda": {
    seoTitle: "Deep tissue massage at your home or hotel in Medellín",
    seoDescription:
      "Deep tissue massage at your home or hotel in Medellín for athletes and chronic tension: 75 minutes of sustained, results-focused pressure.",
    intro: [
      "For tension that won't give way to a gentle massage. Deep muscle recovery uses deep tissue technique, with sustained pressure on the most strained muscle groups.",
      "It's the session for athletes, for people who train often and for chronic tension: focused on results, not just relaxation.",
    ],
    idealFor: [
      "Recovery after training or competing",
      "Chronic tension in the back, legs or shoulders",
      "Anyone who prefers firm pressure",
    ],
    session:
      "The therapist finds the most loaded muscle groups and works on them with slow, sustained pressure, layer by layer. The intensity is adjusted with you throughout the 75 minutes: firm, but always bearable.",
    faqs: [
      {
        q: "Does a deep tissue massage hurt?",
        a: "It's firm, intense pressure, but it shouldn't cause sharp pain. Your therapist adjusts the intensity with you throughout the session.",
      },
    ],
  },

  // ---------- Adult section (18+) ----------
  "ritual-lamour-full-nuru": {
    seoTitle: "Nuru massage at your home or hotel in Medellín",
    seoDescription:
      "The L'AMOUR Ritual (Full Nuru) at your home or hotel in Medellín: 90 minutes body to body with premium Nuru gel. Adults only (18+), fully discreet.",
    intro: [
      "Our signature and most requested ritual. The Full Nuru is a body-to-body experience from start to finish, with premium Nuru gel: silky, warm and designed so every movement flows without interruption.",
      "Ninety minutes that follow the pace you set, unhurried and with no steps skipped, in the privacy of your space in Medellín.",
    ],
    idealFor: [
      "Experiencing L'AMOUR's most complete ritual",
      "A special occasion that deserves 90 unhurried minutes",
      "Those who already know tantric massage and want to go further",
    ],
    session:
      "The session begins calmly, preparing the space and warming the gel to just the right temperature. From there the ritual continues body to body for 90 minutes, at the pace you set, and closes with the stimulation included at the end.",
    faqs: [
      {
        q: "What is Nuru gel?",
        a: "A very silky gel that lets body-to-body contact flow without friction throughout the ritual. We use a premium version, applied warm.",
      },
    ],
  },
  "salvaje-cambio-de-roles": {
    seoTitle: "Role-reversal tantric massage in Medellín",
    seoDescription:
      "Salvaje (Role Reversal): she takes control in a 75-minute tantric ritual at your home or hotel in Medellín. Adults only (18+), fully discreet.",
    intro: [
      "In this ritual the roles are reversed from the very first minute: she takes control, and the initiative is entirely in her hands.",
      "It's designed for those who want to let go of control and be carried along, in an intense 75-minute experience that closes with stimulation included.",
    ],
    idealFor: [
      "Letting go of control completely",
      "Breaking the routine with an intense experience",
      "Those who enjoy role play",
    ],
    session:
      "The therapist sets the pace from the start and leads the session from beginning to end, alternating intensity and pauses. For 75 minutes all you have to do is let yourself go; the ritual closes with the stimulation included at the end.",
    faqs: [
      {
        q: "Can I set limits during the session?",
        a: "Always. All our rituals take place within a framework of respect and consent: you can ask for the session to change pace or stop at any moment.",
      },
    ],
  },
  "masaje-cuatro-manos": {
    seoTitle: "Four-hands massage at your home or hotel in Medellín",
    seoDescription:
      "Four-hands massage at your home or hotel in Medellín: two certified therapists in perfect sync for 90 minutes. Adults only (18+).",
    intro: [
      "Two certified therapists, one rhythm. In the four-hands massage both work in perfect synchrony over your body, multiplying every sensation in a choreography of simultaneous movements.",
      "Ninety minutes for those who already know our rituals and want to take the experience to another level, with stimulation included at the end.",
    ],
    idealFor: [
      "Those who have already enjoyed other L'AMOUR rituals",
      "An enveloping, unforgettable experience",
      "Celebrating a special occasion",
    ],
    session:
      "Two therapists arrive and coordinate every movement so the four hands feel like a single wave. The synchrony holds for the full 90 minutes, and the ritual closes with the stimulation included at the end.",
    faqs: [
      {
        q: "Can I choose both therapists?",
        a: "Yes. When you book, you choose your main therapist and the second one according to availability at that time.",
      },
    ],
  },
  "ritual-contacto-total": {
    seoTitle: "Full-contact ritual at your home or hotel in Medellín",
    seoDescription:
      "Full-contact ritual at your home or hotel in Medellín: 90 minutes of mindful touch over the whole body with guided breathing. Adults only (18+).",
    intro: [
      "A complete journey of mindful touch over the whole body, accompanied by a guided breathing technique that helps release mental as well as physical tension.",
      "Ninety minutes of complete presence, for those seeking a deep experience that goes beyond a traditional massage.",
    ],
    idealFor: [
      "A deep, mindful experience",
      "Releasing mental as well as physical tension",
      "Those drawn to the more contemplative side of tantra",
    ],
    session:
      "The session begins with guided breathing to arrive in the body and the present moment. From there, mindful touch travels over the whole body without hurry, in time with the breath, for 90 minutes.",
    faqs: [
      {
        q: "What role does breathing play?",
        a: "Guided breathing sets the rhythm of the ritual and helps release mental tension: it's what turns touch into an experience of complete presence.",
      },
    ],
  },
  "piel-con-piel": {
    seoTitle: "Skin-to-skin massage at your home or hotel in Medellín",
    seoDescription:
      "Skin-to-skin experience at your home or hotel in Medellín: 60 minutes of direct contact focused on connection. Adults only (18+), fully discreet.",
    intro: [
      "Closeness and warmth in their purest form: a session of direct, barrier-free contact, focused on connection rather than technique.",
      "Sixty minutes for those who want to feel real presence, with no distance, in the privacy of their own space.",
    ],
    idealFor: [
      "Those who value closeness over technique",
      "An intimate 60-minute session",
      "Reconnecting with your own body",
    ],
    session:
      "The pace is slow and the contact direct and continuous. More than massage strokes, the session seeks a real connection for 60 minutes, always at the pace you set.",
    faqs: [
      {
        q: "How is it different from Body to Body?",
        a: "Skin to Skin centres on closeness and connection; Body to Body is a full-body gliding technique, with controlled pressure and flowing movements.",
      },
    ],
  },
  "cuerpo-a-cuerpo": {
    seoTitle: "Body-to-body massage at your home or hotel in Medellín",
    seoDescription:
      "Body-to-body massage at your home or hotel in Medellín: 75 minutes of full-body gliding for complete relaxation. Adults only (18+).",
    intro: [
      "A classic full-body gliding technique, in which the therapist's own body becomes the massage tool.",
      "Seventy-five minutes of complete relaxation combining controlled pressure and flowing movements from start to finish.",
    ],
    idealFor: [
      "Complete, full-body relaxation",
      "Those who enjoy flowing, enveloping movements",
      "A shorter alternative to the L'AMOUR Ritual",
    ],
    session:
      "The therapist prepares the oil and works with long glides of her own body over yours, controlling the pressure on each area. The movement is continuous for 75 minutes, without breaks.",
    faqs: [
      {
        q: "How is it different from the L'AMOUR Ritual (Full Nuru)?",
        a: "Both are body to body, but the L'AMOUR Ritual lasts 90 minutes, uses premium Nuru gel and includes stimulation at the end; Body to Body is a 75-minute session focused on relaxation.",
      },
    ],
  },
  "masaje-sensorial": {
    seoTitle: "Sensory massage at your home or hotel in Medellín",
    seoDescription:
      "Sensory massage at your home or hotel in Medellín: 60 minutes to awaken the senses, with an optional sensory-attire mode and extra time. 18+ only.",
    intro: [
      "Sixty minutes focused on awakening every sense, with unhurried movements and special attention to the most sensitive areas.",
      "It's a flexible ritual: you can add extra time or choose the sensory-attire option (therapist in underwear) if you prefer a subtler experience.",
    ],
    idealFor: [
      "A first sensual experience, tailored to you",
      "Those who prefer to start with a subtler version",
      "Extending the session with extra time",
    ],
    session:
      "The pace is unhurried from beginning to end: the therapist travels over the body with slow movements and lingers on the most sensitive areas. If you choose sensory attire, the therapist performs the session in underwear.",
    faqs: [
      {
        q: "What is sensory attire?",
        a: "An optional mode in which the therapist performs the session in underwear, for those who prefer a subtler experience. You choose it when you book.",
      },
      {
        q: "Can I extend the session?",
        a: "Yes. The sensory massage allows extra time, which you can add when you book.",
      },
    ],
  },
  "masaje-voyerista": {
    seoTitle: "Voyeur massage for couples at your home or hotel in Medellín",
    seoDescription:
      "The Voyeur Massage, the art of watching: one relaxes while the other watches. 60 minutes for couples at your place in Medellín. Adults only (18+).",
    intro: [
      "The art of watching. One of you surrenders completely to relaxation while the other watches every movement up close, fuelling the couple's fantasy and complicity.",
      "Sixty minutes that awaken both the one who receives and the one who watches, in the privacy of your own space.",
    ],
    idealFor: [
      "Couples who want to explore something new together",
      "Rekindling complicity and fantasy",
      "A special night without going out",
    ],
    session:
      "The couple decides who receives and who watches. The therapist works with slow movements on the one receiving, while the other stays close by, for 60 minutes.",
    faqs: [
      {
        q: "Does the one watching take part?",
        a: "No: in the Voyeur Massage one receives and the other watches. If you'd both rather receive at the same time, the Couples Experience or the Interactive Massage are better options.",
      },
    ],
  },
};

/** Editorial copy for a service in the page's language (English falls back to none, never to Spanish). */
export function serviceContent(slug: string, lang: Locale): ServiceContent | undefined {
  return lang === "en" ? SERVICE_CONTENT_EN[slug] : SERVICE_CONTENT[slug];
}
