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
                LongDescription = "Una experiencia envolvente de contacto total con aceite Nuru, diseñada para disolver la tensión y elevar la sensualidad en cada movimiento.",
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
                LongDescription = "Un ritual atrevido donde la iniciativa cambia de manos, elevando la complicidad y la intensidad de la sesión.",
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
                LongDescription = "Dos terapeutas trabajan en perfecta sincronía para multiplicar cada sensación en una experiencia única.",
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
                LongDescription = "Una sesión enfocada en despertar cada sentido, con la posibilidad de añadir tiempo extra y elegir la modalidad con vestidura sensorial (en panty).",
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
                LongDescription = "Cada integrante de la pareja disfruta de su propio terapeuta, viviendo la experiencia al mismo tiempo y en el mismo espacio.",
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
                LongDescription = "Uno de los dos se entrega por completo a la relajación mientras el otro observa, alimentando la fantasía y la complicidad de la pareja.",
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
                Bio = "Especialista en rituales tántricos y terapias de contacto total, con más de 5 años de experiencia.",
                WhatsAppNumber = "573001112233",
                DisplayOrder = 1
            },
            new Masseuse
            {
                StageName = "Isabella",
                Bio = "Experta en masajes sensoriales y experiencias en pareja, enfocada en la conexión y la calidez.",
                WhatsAppNumber = "573002223344",
                DisplayOrder = 2
            },
            new Masseuse
            {
                StageName = "Camila",
                Bio = "Terapeuta certificada en recuperación muscular y piedras volcánicas.",
                WhatsAppNumber = "573003334455",
                DisplayOrder = 3
            },
            new Masseuse
            {
                StageName = "Sofía",
                Bio = "Especialista en masajes a cuatro manos y rituales L'AMOUR.",
                WhatsAppNumber = "573004445566",
                DisplayOrder = 4
            }
        );

        db.SaveChanges();
    }
}
