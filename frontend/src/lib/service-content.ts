/**
 * Editorial copy for each service's own page (/servicios/[slug] and
 * /masajes-tantricos/[slug]) — the part that makes every page unique and worth
 * indexing, on top of the catalog data (name, price, duration, highlights) that
 * comes from the API. Keyed by service slug; a service without an entry here
 * (e.g. one just created in the admin panel) still gets a complete page built
 * from its catalog data alone.
 *
 * Only facts the catalog already states — no invented guarantees, timings or
 * credentials. Adult rituals are described with the same restraint as the rest
 * of the site: sensual, never graphic.
 */
export type ServiceContent = {
  /** Search-facing name for the <title>, e.g. "Masaje con piedras volcánicas a domicilio en Medellín". */
  seoTitle: string;
  /** 140–160 characters for the meta description. */
  seoDescription: string;
  /** Opening paragraphs, beyond the catalog's long description. */
  intro: string[];
  idealFor: string[];
  /** How the session unfolds, step by step, in prose. */
  session: string;
  /** Questions specific to this ritual (general ones are added by the page). */
  faqs: { q: string; a: string }[];
};

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  // ---------- General spa section ----------
  "piedras-volcanicas": {
    seoTitle: "Masaje con piedras volcánicas a domicilio en Medellín",
    seoDescription:
      "Terapia con piedras volcánicas calientes a domicilio en Medellín: 75 minutos de calor profundo para cuello, espalda y hombros. Reserva en línea.",
    intro: [
      "El calor relaja el músculo antes de que llegue la mano. Por eso la terapia con piedras volcánicas alcanza tensiones que un masaje convencional a veces no logra soltar: las piedras, tibias y lisas, reposan sobre los puntos de mayor carga y luego acompañan los movimientos de la terapeuta.",
      "La llevamos hasta tu espacio en Medellín y el Valle de Aburrá, para que después de la sesión no tengas que manejar ni salir a ninguna parte.",
    ],
    idealFor: [
      "Estrés acumulado en cuello, espalda y hombros",
      "Contracturas por largas jornadas frente al computador",
      "Quien busca una relajación profunda con calor",
    ],
    session:
      "La sesión empieza con movimientos manuales suaves para reconocer las zonas tensas. Luego las piedras volcánicas calientes se deslizan por la espalda y reposan sobre los puntos de mayor tensión mientras el calor penetra. Se alternan técnica manual y piedras durante los 75 minutos, en un ambiente cálido y sin prisa.",
    faqs: [
      {
        q: "¿El calor de las piedras es incómodo?",
        a: "No debería serlo: la idea es un calor profundo y agradable. Si en algún momento lo sientes demasiado intenso, díselo a tu terapeuta y ajusta la temperatura o el tiempo de reposo de las piedras.",
      },
    ],
  },
  "aceites-calientes": {
    seoTitle: "Masaje con aceites calientes a domicilio en Medellín",
    seoDescription:
      "Masaje de cuerpo completo con aceites esenciales tibios a domicilio en Medellín. 60 minutos de movimientos largos y envolventes para desconectar.",
    intro: [
      "Pocas cosas relajan tanto como el aceite tibio sobre la piel. En esta terapia, aceites esenciales templados acompañan movimientos largos y continuos que recorren todo el cuerpo, combinando el efecto del calor con una técnica envolvente.",
      "Es una sesión pensada para desconectar por completo: sin agenda, sin prisa y sin salir de tu espacio.",
    ],
    idealFor: [
      "Desconectar al final de una semana pesada",
      "Una primera experiencia de masaje de cuerpo completo",
      "Quien disfruta los aromas y la sensación del aceite tibio",
    ],
    session:
      "La terapeuta calienta los aceites antes de empezar y trabaja con movimientos largos, lentos y continuos, de la espalda a las piernas y los brazos. El ritmo es constante para que el cuerpo entre en un estado de calma profunda durante los 60 minutos.",
    faqs: [
      {
        q: "¿Qué aceites se usan?",
        a: "Aceites esenciales tibios, aplicados en movimientos envolventes por todo el cuerpo. Si tienes alguna alergia o sensibilidad en la piel, avísanos al reservar.",
      },
    ],
  },
  "experiencia-en-pareja": {
    seoTitle: "Masaje en pareja a domicilio en Medellín",
    seoDescription:
      "Masaje en pareja a domicilio en Medellín: un terapeuta para cada uno, en la misma habitación y al mismo tiempo. 60 minutos para compartir.",
    intro: [
      "Relajarse juntos, al mismo tiempo y en el mismo espacio. En la experiencia en pareja cada uno tiene su propio terapeuta certificado, así que nadie espera su turno: ambos viven la sesión en paralelo, sincronizados en cada movimiento.",
      "Un plan distinto para un aniversario, una sorpresa o simplemente para regalarse una pausa compartida sin salir de casa.",
    ],
    idealFor: [
      "Aniversarios, cumpleaños y fechas especiales",
      "Parejas que quieren compartir un momento de relajación",
      "Regalar una experiencia distinta a una cena",
    ],
    session:
      "Llegan dos terapeutas y preparan el espacio en una misma habitación. Cada persona recibe su masaje al mismo tiempo, con movimientos sincronizados, durante 60 minutos. Al terminar, los dos quedan igual de relajados y en el mismo momento.",
    faqs: [
      {
        q: "¿Necesitamos dos espacios?",
        a: "No. La experiencia está pensada para vivirse en la misma habitación, con un terapeuta por persona trabajando al mismo tiempo.",
      },
    ],
  },
  "masaje-interactivo": {
    seoTitle: "Masaje interactivo en pareja a domicilio en Medellín",
    seoDescription:
      "Aprendan a masajearse en pareja: un terapeuta los guía paso a paso en casa, en Medellín. 60 minutos de técnica de contacto consciente para repetir.",
    intro: [
      "Aquí los protagonistas son ustedes. En el masaje interactivo un terapeuta guía a la pareja paso a paso para que se masajeen mutuamente, enseñando técnicas de contacto consciente que pueden repetir después, en casa.",
      "Es tan didáctico como íntimo: una forma de fortalecer la conexión física y llevarse algo más que una tarde de relajación.",
    ],
    idealFor: [
      "Parejas que quieren aprender a darse masajes",
      "Reconectar después de épocas de rutina o estrés",
      "Un regalo con algo que se queda después de la sesión",
    ],
    session:
      "El terapeuta explica y demuestra cada técnica, y luego acompaña a la pareja mientras la practica, corrigiendo presión, ritmo y postura. Se turnan para dar y recibir durante los 60 minutos, hasta que los movimientos salen de forma natural.",
    faqs: [
      {
        q: "¿Necesitamos experiencia previa?",
        a: "No. El terapeuta los guía desde cero y adapta el ritmo a la pareja, para que al final puedan repetir las técnicas por su cuenta.",
      },
    ],
  },
  "relajacion-clasica": {
    seoTitle: "Masaje relajante a domicilio en Medellín",
    seoDescription:
      "Masaje de relajación clásico (técnica sueca) a domicilio en Medellín: 60 minutos de presión media para liberar el estrés. Reserva en línea.",
    intro: [
      "El masaje relajante de toda la vida, bien hecho. Usamos la técnica sueca clásica, con presión media y movimientos largos y envolventes, para liberar el estrés acumulado del día a día.",
      "Es la mejor puerta de entrada si es tu primera experiencia con nosotros o si prefieres una sesión tradicional, sin sorpresas.",
    ],
    idealFor: [
      "Tu primera experiencia de masaje a domicilio",
      "Estrés del trabajo y tensión general",
      "Quien prefiere una presión media, ni suave ni profunda",
    ],
    session:
      "La sesión recorre espalda, piernas, brazos y cuello con las maniobras clásicas de la técnica sueca: deslizamientos largos, amasamiento suave y fricciones ligeras. Son 60 minutos a un ritmo pausado, pensados para que el cuerpo baje revoluciones.",
    faqs: [
      {
        q: "¿En qué se diferencia de la recuperación muscular profunda?",
        a: "La relajación clásica usa presión media y busca bajar el estrés; la recuperación muscular profunda trabaja con presión sostenida sobre los músculos más exigidos y está pensada para deportistas o tensión crónica.",
      },
    ],
  },
  "exfoliacion-corporal": {
    seoTitle: "Exfoliación corporal a domicilio en Medellín",
    seoDescription:
      "Exfoliación corporal completa con sales y aceites naturales a domicilio en Medellín. 45 minutos para una piel más suave; combínala con tu masaje.",
    intro: [
      "Una exfoliación completa de cuerpo con sales y aceites naturales que elimina células muertas y deja la piel visiblemente más suave desde la primera sesión.",
      "Funciona sola, pero brilla como preparación: la piel renovada recibe mejor los aceites de cualquier masaje que reserves después.",
    ],
    idealFor: [
      "Renovar la piel antes de una fecha especial",
      "Preparar la piel antes de otro ritual",
      "Piel opaca o reseca",
    ],
    session:
      "La terapeuta aplica la mezcla de sales y aceites naturales con movimientos circulares por todo el cuerpo, zona por zona, y luego retira el exfoliante. Son 45 minutos que puedes reservar solos o combinar con cualquier otro de nuestros rituales.",
    faqs: [
      {
        q: "¿Puedo combinarla con un masaje?",
        a: "Sí. Está pensada para combinarse con cualquier otro ritual: la exfoliación prepara la piel antes del masaje.",
      },
    ],
  },
  "masaje-pies-reflexologia": {
    seoTitle: "Reflexología podal a domicilio en Medellín",
    seoDescription:
      "Masaje de pies y reflexología a domicilio en Medellín: 30 minutos para aliviar la fatiga y activar la circulación. Sesión exprés o complemento.",
    intro: [
      "Los pies cargan con todo el día. Esta sesión trabaja de forma específica sobre los puntos de reflexología del pie para aliviar la fatiga acumulada y activar la circulación después de una jornada larga.",
      "Son 30 minutos: suficiente como sesión exprés independiente y perfecta como complemento de otro servicio.",
    ],
    idealFor: [
      "Jornadas largas de pie o caminando",
      "Una sesión corta entre semana",
      "Complementar otro masaje",
    ],
    session:
      "La terapeuta empieza relajando el pie completo y luego presiona, uno a uno, los puntos de reflexología, con una presión que se ajusta a lo que sientas. Cierra con movimientos suaves para activar la circulación.",
    faqs: [
      {
        q: "¿Puedo reservarla sola?",
        a: "Sí. Funciona como sesión exprés independiente de 30 minutos o como complemento de otro de nuestros servicios.",
      },
    ],
  },
  "recuperacion-muscular-profunda": {
    seoTitle: "Masaje deportivo de tejido profundo a domicilio en Medellín",
    seoDescription:
      "Masaje de tejido profundo a domicilio en Medellín para deportistas y tensión crónica: 75 minutos de presión sostenida enfocados en el resultado.",
    intro: [
      "Para la tensión que no cede con un masaje suave. La recuperación muscular profunda usa técnica de tejido profundo, con presión sostenida sobre los grupos musculares más exigidos.",
      "Es la sesión para deportistas, para quien entrena con frecuencia y para la tensión crónica: enfocada en el resultado, no solo en la relajación.",
    ],
    idealFor: [
      "Recuperación después de entrenar o competir",
      "Tensión crónica en espalda, piernas u hombros",
      "Quien prefiere una presión firme",
    ],
    session:
      "La terapeuta identifica los grupos musculares más cargados y trabaja sobre ellos con presión lenta y sostenida, capa por capa. La intensidad se ajusta contigo durante los 75 minutos: firme, pero siempre tolerable.",
    faqs: [
      {
        q: "¿Duele un masaje de tejido profundo?",
        a: "Es una presión firme e intensa, pero no debería doler de forma aguda. Tu terapeuta ajusta la intensidad contigo durante toda la sesión.",
      },
    ],
  },

  // ---------- Adult section (+18) ----------
  "ritual-lamour-full-nuru": {
    seoTitle: "Masaje Nuru a domicilio en Medellín",
    seoDescription:
      "Ritual L'AMOUR (Full Nuru) a domicilio en Medellín: 90 minutos cuerpo a cuerpo con aceite Nuru premium. Solo mayores de 18, total discreción.",
    intro: [
      "Nuestro ritual insignia y el más solicitado. El Full Nuru es una experiencia cuerpo a cuerpo de principio a fin, con aceite Nuru premium: deslizante, cálido y pensado para que cada movimiento fluya sin interrupciones.",
      "Son 90 minutos que se adaptan al ritmo que tú marques, sin prisa y sin pasos que se salten, en la privacidad de tu espacio en Medellín.",
    ],
    idealFor: [
      "Quien quiere vivir el ritual más completo de L'AMOUR",
      "Una ocasión especial que merece 90 minutos sin prisa",
      "Quien ya conoce el masaje tántrico y busca ir más allá",
    ],
    session:
      "La sesión empieza con calma, preparando el espacio y el aceite a la temperatura justa. A partir de ahí, el ritual avanza cuerpo a cuerpo durante los 90 minutos, al ritmo que tú marques, y cierra con la estimulación incluida al finalizar.",
    faqs: [
      {
        q: "¿Qué es el aceite Nuru?",
        a: "Es un aceite de textura muy deslizante que permite que el contacto cuerpo a cuerpo fluya sin fricción durante todo el ritual. Usamos una versión premium, aplicada tibia.",
      },
    ],
  },
  "salvaje-cambio-de-roles": {
    seoTitle: "Masaje tántrico con cambio de roles a domicilio en Medellín",
    seoDescription:
      "Salvaje (Cambio de Roles): ella toma el control en un ritual tántrico de 75 minutos a domicilio en Medellín. Solo mayores de 18, total discreción.",
    intro: [
      "En este ritual los roles se invierten desde el primer minuto: ella toma el control y la iniciativa queda por completo en sus manos.",
      "Está pensado para quien busca soltar el control y dejarse llevar, en una experiencia intensa de 75 minutos que cierra con estimulación incluida.",
    ],
    idealFor: [
      "Quien quiere soltar el control por completo",
      "Salir de la rutina con una experiencia intensa",
      "Quien disfruta el juego de roles",
    ],
    session:
      "La terapeuta marca el ritmo desde el inicio y conduce la sesión de principio a fin, alternando intensidad y pausas. Durante los 75 minutos tú solo tienes que dejarte llevar; el ritual cierra con la estimulación incluida al finalizar.",
    faqs: [
      {
        q: "¿Puedo poner límites durante la sesión?",
        a: "Siempre. Todos nuestros rituales ocurren en un marco de respeto y consentimiento: puedes pedir que la sesión cambie de ritmo o se detenga en cualquier momento.",
      },
    ],
  },
  "masaje-cuatro-manos": {
    seoTitle: "Masaje a cuatro manos a domicilio en Medellín",
    seoDescription:
      "Masaje a cuatro manos a domicilio en Medellín: dos terapeutas certificadas en perfecta sincronía durante 90 minutos. Solo mayores de 18.",
    intro: [
      "Dos terapeutas certificadas, un solo ritmo. En el masaje a cuatro manos ambas trabajan en perfecta sincronía sobre tu cuerpo, multiplicando cada sensación en una coreografía de movimientos simultáneos.",
      "Son 90 minutos pensados para quienes ya conocen nuestros rituales y quieren llevar la experiencia a otro nivel, con estimulación incluida al finalizar.",
    ],
    idealFor: [
      "Quien ya vivió otros rituales de L'AMOUR",
      "Una experiencia envolvente e inolvidable",
      "Celebrar una ocasión especial",
    ],
    session:
      "Llegan dos terapeutas que coordinan cada movimiento para que las cuatro manos se sientan como una sola ola. La sincronía se mantiene durante los 90 minutos y el ritual cierra con la estimulación incluida al finalizar.",
    faqs: [
      {
        q: "¿Puedo elegir a las dos masajistas?",
        a: "Sí. Al reservar eliges a tu masajista principal y a la segunda terapeuta según la disponibilidad del horario.",
      },
    ],
  },
  "ritual-contacto-total": {
    seoTitle: "Ritual de contacto total a domicilio en Medellín",
    seoDescription:
      "Ritual de contacto total a domicilio en Medellín: 90 minutos de contacto consciente por todo el cuerpo con respiración guiada. Solo mayores de 18.",
    intro: [
      "Un recorrido completo de contacto consciente por todo el cuerpo, acompañado de una técnica de respiración guiada que ayuda a soltar la tensión mental además de la física.",
      "Son 90 minutos de presencia total, para quienes buscan una experiencia profunda que va más allá del masaje tradicional.",
    ],
    idealFor: [
      "Quien busca una experiencia profunda y consciente",
      "Soltar tensión mental además de la física",
      "Quien se interesa por el lado más contemplativo del tantra",
    ],
    session:
      "La sesión empieza con respiración guiada para llegar al cuerpo y al momento presente. A partir de ahí, el contacto consciente recorre todo el cuerpo sin prisa, acompasado con la respiración, durante los 90 minutos.",
    faqs: [
      {
        q: "¿Qué papel tiene la respiración?",
        a: "La respiración guiada marca el ritmo del ritual y ayuda a soltar la tensión mental: es lo que convierte el contacto en una experiencia de presencia total.",
      },
    ],
  },
  "piel-con-piel": {
    seoTitle: "Masaje piel con piel a domicilio en Medellín",
    seoDescription:
      "Experiencia piel con piel a domicilio en Medellín: 60 minutos de contacto directo enfocado en la conexión. Solo mayores de 18, total discreción.",
    intro: [
      "Cercanía y calidez en su forma más pura: una sesión de contacto directo, sin barreras, enfocada en la conexión más que en la técnica.",
      "Son 60 minutos para quienes buscan sentir presencia real, sin distancia, en la privacidad de su espacio.",
    ],
    idealFor: [
      "Quien valora la cercanía por encima de la técnica",
      "Una sesión íntima de 60 minutos",
      "Reconectar con el propio cuerpo",
    ],
    session:
      "El ritmo es lento y el contacto, directo y continuo. Más que maniobras de masaje, la sesión busca una conexión real durante los 60 minutos, siempre al ritmo que tú marques.",
    faqs: [
      {
        q: "¿En qué se diferencia del Cuerpo a Cuerpo?",
        a: "Piel con Piel se centra en la cercanía y la conexión; Cuerpo a Cuerpo es una técnica de deslizamiento corporal completo, con presión controlada y movimientos fluidos.",
      },
    ],
  },
  "cuerpo-a-cuerpo": {
    seoTitle: "Masaje cuerpo a cuerpo a domicilio en Medellín",
    seoDescription:
      "Masaje cuerpo a cuerpo a domicilio en Medellín: 75 minutos de deslizamiento corporal completo para una relajación absoluta. Solo mayores de 18.",
    intro: [
      "Una técnica clásica de deslizamiento corporal completo, donde el propio cuerpo de la terapeuta se convierte en la herramienta de masaje.",
      "Son 75 minutos de relajación absoluta que combinan presión controlada y movimientos fluidos de principio a fin.",
    ],
    idealFor: [
      "Una relajación absoluta de cuerpo completo",
      "Quien disfruta los movimientos fluidos y envolventes",
      "Una alternativa más corta al Ritual L'AMOUR",
    ],
    session:
      "La terapeuta prepara el aceite y trabaja con deslizamientos largos de su propio cuerpo sobre el tuyo, controlando la presión en cada zona. El movimiento es continuo durante los 75 minutos, sin cortes.",
    faqs: [
      {
        q: "¿En qué se diferencia del Ritual L'AMOUR (Full Nuru)?",
        a: "Ambos son cuerpo a cuerpo, pero el Ritual L'AMOUR dura 90 minutos, usa aceite Nuru premium e incluye estimulación al finalizar; el Cuerpo a Cuerpo es una sesión de 75 minutos centrada en la relajación.",
      },
    ],
  },
  "masaje-sensorial": {
    seoTitle: "Masaje sensorial a domicilio en Medellín",
    seoDescription:
      "Masaje sensorial a domicilio en Medellín: 60 minutos para despertar los sentidos, con opción de vestidura sensorial y tiempo adicional. Solo +18.",
    intro: [
      "Sesenta minutos enfocados en despertar cada sentido, con movimientos pausados y una atención especial a las zonas de mayor sensibilidad.",
      "Es un ritual flexible: puedes sumar tiempo adicional o elegir la modalidad con vestidura sensorial (en panty) si prefieres una experiencia más sutil.",
    ],
    idealFor: [
      "Una primera experiencia sensual, a tu medida",
      "Quien prefiere empezar con una versión más sutil",
      "Quien quiere alargar la sesión con tiempo adicional",
    ],
    session:
      "El ritmo es pausado de principio a fin: la terapeuta recorre el cuerpo con movimientos lentos y se detiene en las zonas de mayor sensibilidad. Si eliges la vestidura sensorial, la sesión transcurre con la terapeuta en panty.",
    faqs: [
      {
        q: "¿Qué es la vestidura sensorial?",
        a: "Es una modalidad opcional en la que la terapeuta realiza la sesión en panty, para quien prefiere una experiencia más sutil. La eliges al reservar.",
      },
      {
        q: "¿Puedo alargar la sesión?",
        a: "Sí. El masaje sensorial admite tiempo adicional, que puedes sumar al momento de reservar.",
      },
    ],
  },
  "masaje-voyerista": {
    seoTitle: "Masaje voyerista para parejas a domicilio en Medellín",
    seoDescription:
      "Masaje Voyerista, el arte de mirar: uno se relaja y el otro observa. 60 minutos para parejas a domicilio en Medellín. Solo mayores de 18.",
    intro: [
      "El arte de mirar. Uno de los dos se entrega por completo a la relajación mientras el otro observa cada movimiento de cerca, alimentando la fantasía y la complicidad de la pareja.",
      "Son 60 minutos que despiertan tanto a quien recibe como a quien mira, en la privacidad de su espacio.",
    ],
    idealFor: [
      "Parejas que quieren explorar juntas algo nuevo",
      "Avivar la complicidad y la fantasía",
      "Una noche especial sin salir de casa",
    ],
    session:
      "La pareja decide quién recibe y quién observa. La terapeuta trabaja con movimientos lentos sobre quien recibe, mientras la otra persona acompaña de cerca, durante los 60 minutos.",
    faqs: [
      {
        q: "¿Quien observa participa?",
        a: "No: en el Masaje Voyerista uno recibe y el otro observa. Si prefieren que los dos reciban al mismo tiempo, la Experiencia en Pareja o el Masaje Interactivo son mejores opciones.",
      },
    ],
  },
};
