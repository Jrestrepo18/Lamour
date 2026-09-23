using LAmour.Api.Models;
using LAmour.Api.Services;

namespace LAmour.Api.Data;

public static class SeedData
{
    public static void EnsureSeeded(LAmourDbContext db)
    {
        db.Database.EnsureCreated();

        if (!db.AdminUsers.Any())
        {
            db.AdminUsers.Add(new AdminUser
            {
                Username = "admin",
                PasswordHash = PasswordHasher.Hash("Lamour2024!"),
                FullName = "Administración L'AMOUR",
                Role = "Admin"
            });
        }

        if (db.ServiceCategories.Any())
        {
            db.SaveChanges();
            return;
        }

        var eroticos = new ServiceCategory
        {
            Name = "Masajes Eróticos & Tántricos",
            Slug = "eroticos-tantricos",
            Description = "Rituales sensoriales diseñados para liberar tensión y despertar los sentidos.",
            Highlight = "Todos los masajes eróticos incluyen estimulación al finalizar la terapia.",
            DisplayOrder = 1
        };

        var especiales = new ServiceCategory
        {
            Name = "Terapias Especiales",
            Slug = "terapias-especiales",
            Description = "Rituales con elementos térmicos y técnicas de contacto que profundizan la relajación.",
            DisplayOrder = 2
        };

        var sensoriales = new ServiceCategory
        {
            Name = "Masajes Sensoriales",
            Slug = "sensoriales",
            Description = "Sesiones de 60 minutos enfocadas en el placer de los sentidos, con tiempo adicional opcional.",
            DisplayOrder = 3
        };

        var pareja = new ServiceCategory
        {
            Name = "Experiencias en Pareja",
            Slug = "experiencias-pareja",
            Description = "Momentos diseñados para compartir, conectar y explorar en compañía.",
            DisplayOrder = 4
        };

        var relajacion = new ServiceCategory
        {
            Name = "Relajación y Muscular",
            Slug = "relajacion-muscular",
            Description = "Terapias clásicas enfocadas en el bienestar físico y la recuperación muscular.",
            DisplayOrder = 5
        };

        db.ServiceCategories.AddRange(eroticos, especiales, sensoriales, pareja, relajacion);
        db.SaveChanges();

        db.Services.AddRange(
            // Eróticos & Tántricos
            new Service
            {
                ServiceCategoryId = eroticos.Id,
                Name = "Ritual L'AMOUR (Full Nuru)",
                Slug = "ritual-lamour-full-nuru",
                ShortDescription = "Nuestro ritual insignia: cuerpo a cuerpo con aceite Nuru premium de principio a fin.",
                LongDescription = "Nuestro ritual insignia y el más solicitado: cuerpo a cuerpo completo con aceite Nuru premium, deslizante y cálido, de principio a fin de los 90 minutos. Incluye estimulación al finalizar y se adapta al ritmo que tú marques, sin prisa y sin pasos que te saltes.",
                DurationMinutes = 90,
                Price = 320000,
                HighlightsRaw = "Aceite Nuru premium;Cuerpo a cuerpo integral;Estimulación incluida al finalizar",
                DisplayOrder = 1
            },
            new Service
            {
                ServiceCategoryId = eroticos.Id,
                Name = "Salvaje (Cambio de Roles)",
                Slug = "salvaje-cambio-de-roles",
                ShortDescription = "Ella toma el control: una experiencia intensa donde los roles se invierten.",
                LongDescription = "Ella toma el control desde el primer minuto: un ritual donde los roles tradicionales se invierten y la iniciativa queda en sus manos. Ideal para quien busca soltar el control y dejarse llevar por completo, con estimulación incluida al cierre de los 75 minutos.",
                DurationMinutes = 75,
                Price = 280000,
                HighlightsRaw = "Ella toma el control;Juego de roles;Estimulación incluida al finalizar",
                DisplayOrder = 2
            },
            new Service
            {
                ServiceCategoryId = eroticos.Id,
                Name = "Masaje a Cuatro Manos",
                Slug = "masaje-cuatro-manos",
                ShortDescription = "Dos masajistas, un solo ritmo: una sensación envolvente e inolvidable.",
                LongDescription = "Dos terapeutas certificadas trabajan en perfecta sincronía sobre tu cuerpo, multiplicando cada sensación en una coreografía de movimientos simultáneos. 90 minutos pensados para quienes ya conocen nuestros rituales y quieren llevar la experiencia a otro nivel, con estimulación incluida al finalizar.",
                DurationMinutes = 90,
                Price = 420000,
                HighlightsRaw = "2 masajistas en sincronía;Sensación envolvente;Estimulación incluida al finalizar",
                RequiresTwoTherapists = true,
                DisplayOrder = 3
            },

            // Terapias Especiales
            new Service
            {
                ServiceCategoryId = especiales.Id,
                Name = "Piedras Volcánicas",
                Slug = "piedras-volcanicas",
                ShortDescription = "Calor profundo con piedras volcánicas para liberar la tensión muscular.",
                LongDescription = "Piedras volcánicas calientes se deslizan y reposan sobre los puntos de mayor tensión, combinando calor profundo con técnica manual para liberar contracturas que el masaje convencional no siempre alcanza. 75 minutos en un ambiente cálido y envolvente, ideal para el estrés acumulado en cuello, espalda y hombros.",
                DurationMinutes = 75,
                Price = 240000,
                HighlightsRaw = "Terapia de calor;Libera tensión profunda;Ambiente relajante",
                DisplayOrder = 1
            },
            new Service
            {
                ServiceCategoryId = especiales.Id,
                Name = "Terapia con Aceites Calientes",
                Slug = "aceites-calientes",
                ShortDescription = "Aceites tibios deslizándose en movimientos largos y envolventes.",
                LongDescription = "Aceites esenciales tibios se deslizan en movimientos largos y continuos por todo el cuerpo, combinando el efecto relajante del calor con una técnica envolvente de cuerpo completo. 60 minutos pensados para desconectar por completo, sin prisa.",
                DurationMinutes = 60,
                Price = 210000,
                HighlightsRaw = "Aceites esencia tibios;Movimientos envolventes",
                DisplayOrder = 2
            },
            new Service
            {
                ServiceCategoryId = especiales.Id,
                Name = "Ritual de Contacto Total",
                Slug = "ritual-contacto-total",
                ShortDescription = "Un recorrido completo de contacto consciente por todo el cuerpo.",
                LongDescription = "Un recorrido completo de contacto consciente por todo el cuerpo, acompañado de una técnica de respiración guiada que ayuda a soltar la tensión mental además de la física. 90 minutos de presencia total, ideal para quienes buscan una experiencia profunda más allá del masaje tradicional.",
                DurationMinutes = 90,
                Price = 300000,
                HighlightsRaw = "Contacto integral;Técnica de respiración guiada",
                DisplayOrder = 3
            },
            new Service
            {
                ServiceCategoryId = especiales.Id,
                Name = "Experiencia Piel con Piel",
                Slug = "piel-con-piel",
                ShortDescription = "Cercanía y calidez en su forma más pura.",
                LongDescription = "Cercanía y calidez en su forma más pura: una sesión de contacto directo, sin barreras, enfocada en la conexión más que en la técnica. 60 minutos para quienes buscan sentir presencia real, sin distancia.",
                DurationMinutes = 60,
                Price = 230000,
                HighlightsRaw = "Contacto directo;Máxima cercanía",
                DisplayOrder = 4
            },
            new Service
            {
                ServiceCategoryId = especiales.Id,
                Name = "Cuerpo a Cuerpo",
                Slug = "cuerpo-a-cuerpo",
                ShortDescription = "Técnica clásica de deslizamiento corporal para una relajación absoluta.",
                LongDescription = "Técnica clásica de deslizamiento corporal completo, donde el propio cuerpo de la terapeuta se convierte en la herramienta de masaje. 75 minutos de relajación absoluta, combinando presión controlada y movimientos fluidos de principio a fin.",
                DurationMinutes = 75,
                Price = 260000,
                HighlightsRaw = "Deslizamiento corporal;Relajación absoluta",
                DisplayOrder = 5
            },

            // Sensoriales
            new Service
            {
                ServiceCategoryId = sensoriales.Id,
                Name = "Masaje Sensorial",
                Slug = "masaje-sensorial",
                ShortDescription = "60 minutos de estimulación de los sentidos, con opción de vestidura sensorial.",
                LongDescription = "60 minutos enfocados en despertar cada sentido, con movimientos pausados y una atención especial a las zonas de mayor sensibilidad. Puedes sumar tiempo adicional o elegir la modalidad con vestidura sensorial (en panty) si prefieres una experiencia más sutil.",
                DurationMinutes = 60,
                Price = 200000,
                HighlightsRaw = "Opción con vestidura sensorial (en panty);Tiempo adicional disponible",
                HasSensoryDressOption = true,
                AllowsExtraTime = true,
                DisplayOrder = 1
            },

            // Experiencias en Pareja
            new Service
            {
                ServiceCategoryId = pareja.Id,
                Name = "Experiencia en Pareja",
                Slug = "experiencia-en-pareja",
                ShortDescription = "Un masajista dedicado para cada persona, en la misma habitación.",
                LongDescription = "Cada integrante de la pareja tiene su propio terapeuta certificado, y ambos viven la sesión al mismo tiempo, en la misma habitación, sincronizados en cada movimiento. 60 minutos pensados para compartir un momento de relajación juntos, sin que ninguno tenga que esperar su turno.",
                DurationMinutes = 60,
                Price = 480000,
                HighlightsRaw = "Un masajista por persona;Misma habitación;Sincronía total",
                RequiresTwoTherapists = true,
                IsCoupleExperience = true,
                DisplayOrder = 1
            },
            new Service
            {
                ServiceCategoryId = pareja.Id,
                Name = "Masaje Interactivo",
                Slug = "masaje-interactivo",
                ShortDescription = "El terapeuta guía a la pareja para que se masajeen mutuamente.",
                LongDescription = "El terapeuta guía a la pareja paso a paso para que se masajeen mutuamente, enseñando técnicas de contacto consciente que pueden repetir después, en casa. 60 minutos tan didácticos como íntimos, ideales para fortalecer la conexión física entre los dos.",
                DurationMinutes = 60,
                Price = 350000,
                HighlightsRaw = "Guiado por un terapeuta;Conexión activa en pareja",
                IsCoupleExperience = true,
                DisplayOrder = 2
            },
            new Service
            {
                ServiceCategoryId = pareja.Id,
                Name = "Masaje Voyerista",
                Slug = "masaje-voyerista",
                ShortDescription = "El Arte de Mirar: conexión a través de los sentidos.",
                LongDescription = "El Arte de Mirar: uno de los dos se entrega por completo a la relajación mientras el otro observa cada movimiento de cerca, alimentando la fantasía y la complicidad de la pareja. 60 minutos que despiertan tanto a quien recibe como a quien mira.",
                DurationMinutes = 60,
                Price = 260000,
                HighlightsRaw = "Uno se relaja, el otro observa;Alimenta la complicidad",
                IsCoupleExperience = true,
                DisplayOrder = 3
            },

            // Relajación y Muscular
            new Service
            {
                ServiceCategoryId = relajacion.Id,
                Name = "Masaje de Relajación Clásico",
                Slug = "relajacion-clasica",
                ShortDescription = "Técnica sueca clásica para liberar el estrés del día a día.",
                LongDescription = "Técnica sueca clásica, con presión media y movimientos largos y envolventes, diseñada para liberar el estrés acumulado del día a día. 60 minutos ideales si es tu primera experiencia con nosotros o buscas una sesión más tradicional.",
                DurationMinutes = 60,
                Price = 150000,
                HighlightsRaw = "Técnica sueca;Libera estrés",
                DisplayOrder = 1
            },
            new Service
            {
                ServiceCategoryId = relajacion.Id,
                Name = "Exfoliación Corporal",
                Slug = "exfoliacion-corporal",
                ShortDescription = "Renueva tu piel con una exfoliación completa de cuerpo.",
                LongDescription = "Una exfoliación completa de cuerpo con sales y aceites naturales que elimina células muertas y deja la piel visiblemente más suave. 45 minutos que puedes combinar con cualquier otro ritual para preparar la piel antes del masaje.",
                DurationMinutes = 45,
                Price = 130000,
                HighlightsRaw = "Piel renovada;Sales y aceites naturales",
                DisplayOrder = 2
            },
            new Service
            {
                ServiceCategoryId = relajacion.Id,
                Name = "Masaje en Pies (Reflexología)",
                Slug = "masaje-pies-reflexologia",
                ShortDescription = "Puntos de reflexología para aliviar la fatiga y activar la circulación.",
                LongDescription = "Trabajo específico sobre los puntos de reflexología del pie, pensado para aliviar la fatiga acumulada y activar la circulación después de un día largo. 30 minutos ideales como complemento de otro servicio o como sesión exprés independiente.",
                DurationMinutes = 30,
                Price = 90000,
                HighlightsRaw = "Reflexología;Activa la circulación",
                DisplayOrder = 3
            },
            new Service
            {
                ServiceCategoryId = relajacion.Id,
                Name = "Recuperación Muscular Profunda",
                Slug = "recuperacion-muscular-profunda",
                ShortDescription = "Técnica de tejido profundo para deportistas y tensión crónica.",
                LongDescription = "Técnica de tejido profundo con presión sostenida sobre los grupos musculares más exigidos, pensada para deportistas y para tensión crónica que no cede con un masaje suave. 75 minutos enfocados en el resultado, no solo en la relajación.",
                DurationMinutes = 75,
                Price = 220000,
                HighlightsRaw = "Tejido profundo;Ideal post-entrenamiento",
                DisplayOrder = 4
            }
        );

        db.Masseuses.AddRange(
            new Masseuse
            {
                StageName = "Valentina",
                Age = 28,
                Bio = "Especialista en rituales tántricos y terapias de contacto total, con más de 5 años de experiencia.",
                WhatsAppNumber = "573001112233",
                DisplayOrder = 1
            },
            new Masseuse
            {
                StageName = "Isabella",
                Age = 25,
                Bio = "Experta en masajes sensoriales y experiencias en pareja, enfocada en la conexión y la calidez.",
                WhatsAppNumber = "573002223344",
                DisplayOrder = 2
            },
            new Masseuse
            {
                StageName = "Camila",
                Age = 31,
                Bio = "Terapeuta certificada en recuperación muscular y piedras volcánicas.",
                WhatsAppNumber = "573003334455",
                DisplayOrder = 3
            },
            new Masseuse
            {
                StageName = "Sofía",
                Age = 27,
                Bio = "Especialista en masajes a cuatro manos y rituales L'AMOUR.",
                WhatsAppNumber = "573004445566",
                DisplayOrder = 4
            }
        );

        db.SaveChanges();
    }
}
