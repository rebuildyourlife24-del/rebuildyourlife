import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding E-Com Alpha Masterclass...");

  // Wist bestaande courses (optioneel, voor schone lei)
  // await prisma.course.deleteMany();
  
  const course = await prisma.course.create({
    data: {
      title: "E-Com Alpha Masterclass",
      description: "De ultieme blauwdruk voor het opschalen van een e-commerce brand naar €100k/maand met AI, automatisering en killer copy.",
      thumbnail: "/assets/courses/ecom-alpha.jpg",
      tierAccess: "FREE",
      order: 1,
      modules: {
        create: [
          {
            title: "Module 1: The Foundation",
            description: "Fundamenten, niche selectie en product onderzoek.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1.1 Welkom bij E-Com Alpha",
                  content: "In deze video leggen we de fundamenten uit van wat je de komende 6 weken gaat leren. Het draait niet alleen om Shopify, maar om mindset, systemen en schaalbaarheid.",
                  duration: 480, // 8 minuten
                  order: 1,
                  videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                  resources: {
                    create: [
                      {
                        title: "De 100K Mindset Checklist",
                        url: "https://example.com/mindset.pdf",
                        type: "PDF"
                      }
                    ]
                  }
                },
                {
                  title: "1.2 Winstgevende Niches Vinden met AI",
                  content: "Ontdek hoe je met tools zoals ChatGPT en Groq onontdekte e-commerce sub-niches vindt die schreeuwen om een premium brand.",
                  duration: 720,
                  order: 2,
                  videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                  resources: {
                    create: [
                      {
                        title: "100 ChatGPT Prompts voor E-Com",
                        url: "https://example.com/prompts.pdf",
                        type: "PDF"
                      },
                      {
                        title: "Niche Research Notion Template",
                        url: "https://notion.so/rebuildyourlife/template",
                        type: "TEMPLATE"
                      }
                    ]
                  },
                  quizzes: {
                    create: [
                      {
                        title: "Niche Selectie Quiz",
                        description: "Test je kennis over het vinden van de perfecte e-com niche.",
                        passingScore: 100,
                        questions: {
                          create: [
                            {
                              question: "Wat is de belangrijkste eigenschap van een winnende niche?",
                              order: 1,
                              answers: {
                                create: [
                                  { answer: "Lage concurrentie en hoge zoekvolumes", isCorrect: false },
                                  { answer: "Een gepassioneerde doelgroep met pijnpunten", isCorrect: true },
                                  { answer: "Producten die goedkoop in te kopen zijn", isCorrect: false }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            title: "Module 2: Store Build & Conversion",
            description: "Het bouwen van een winkel die bezoekers omzet in kopers.",
            order: 2,
            lessons: {
              create: [
                {
                  title: "2.1 High-Ticket Shopify Setup",
                  content: "We bouwen live een Shopify winkel die luxe uitstraalt en psychologische conversie-triggers gebruikt.",
                  duration: 1200,
                  order: 1,
                  resources: {
                    create: [
                      {
                        title: "Shopify Theme Files",
                        url: "https://example.com/theme.zip",
                        type: "DOC"
                      }
                    ]
                  }
                },
                {
                  title: "2.2 Copywriting voor Conversie",
                  content: "Mensen kopen geen producten, ze kopen een beter leven. Leer hoe je productomschrijvingen schrijft die direct inspelen op verlangens.",
                  duration: 900,
                  order: 2,
                  quizzes: {
                    create: [
                      {
                        title: "Copywriting Mastery",
                        passingScore: 100,
                        questions: {
                          create: [
                            {
                              question: "Wat is de belangrijkste regel in e-com copywriting?",
                              order: 1,
                              answers: {
                                create: [
                                  { answer: "Benefits > Features (Verkoop de uitkomst, niet het product)", isCorrect: true },
                                  { answer: "Zo veel mogelijk technische specificaties noemen", isCorrect: false },
                                  { answer: "Altijd kort en bondig blijven", isCorrect: false }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`✅ Succesvol de E-Com Alpha Masterclass aangemaakt (ID: ${course.id})`);
  console.log("Modules, Lessen, PDF's (Resources) en Quizzen zijn geïnjecteerd.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
