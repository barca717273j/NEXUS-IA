import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // Initialize Gemini lazily to avoid crashing if GEMINI_API_KEY is missing during build/cold starts
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARN: GEMINI_API_KEY environment variable is not set. Falling back to local enhanced template generator.");
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route to generate project utilizing Gemini or Claude AI
  app.post("/api/generate-project", async (req, res) => {
    const { name, niche, objective, pages, language, type, apiProvider, claudeApiKey, theme, layout, selectedPages } = req.body;

    if (!name || !niche || !objective) {
      return res.status(400).json({ error: "Parâmetros name, niche e objective são obrigatórios." });
    }

    const projType = type || "ebook";
    const finalProvider = apiProvider || "gemini";
    const anthropicKey = claudeApiKey || process.env.ANTHROPIC_API_KEY;

    if (finalProvider === "claude" && !anthropicKey) {
      return res.status(400).json({ error: "Por favor, configure sua chave da API do Claude nas configurações ou informe-a no formulário de geração." });
    }

    const ai = getGeminiClient();

    if (finalProvider !== "claude" && !ai) {
      // Return a simulated high-quality response if Gemini Key is missing, so the app remains 100% functional
      console.log(`Using local fallback template generator because GEMINI_API_KEY is not defined. Type="${projType}"`);
      return res.status(200).json({
        isMock: true,
        message: "Chave API não configurada. Usando mecanismo local premium de contingência.",
        data: getFallbackProjectData(name, niche, objective, pages, language, projType)
      });
    }

    try {
      console.log(`Generating project with ${finalProvider.toUpperCase()}: Name="${name}", Niche="${niche}", Type="${projType}"`);

      let prompt = "";
      let responseSchema: any = {};

      if (projType === "landing_page") {
        prompt = `Você é o Nexus Core, um modelo de inteligência artificial de elite especializado em Marketing de Resposta Direta e Design de Alta Conversão.
Seu objetivo é gerar o conteúdo completo de uma Landing Page (página de vendas de produto digital) de altíssimo padrão com copy magnética e persuasiva baseada nas premissas:
- Nome do Produto: "${name}"
- Nicho de Atuação: "${niche}"
- Objetivo Comercial e Proposta de Valor: "${objective}"
- Idioma do Material: "${language || "Português"}"

Instruções Cruciais:
- headline: Título magnético e irresistível focado na dor principal do público-alvo ou na grande transformação do produto.
- subheadline: Subtítulo que detalha a promessa principal e aguça o desejo.
- benefits: 3 benefícios claros e indiscutíveis do seu método.
- problems: 3 problemas reais e dores profundas enfrentados pelo avatar no dia a dia.
- solutions: 3 soluções exatas que seu produto entrega para curar esses problemas de vez.
- testimonials: 2 depoimentos fictícios ultra realistas (com nome, cargo/idade, depoimento focado em resultados).
- guarantee: Texto com uma garantia incondicional blindada de 7 dias com risco zero para o comprador.
- faqs: 2 perguntas frequentes respondidas com maestria de copywriter profissional.
- cta: Chamada de ação poderosa para o botão de compra.

Retorne um JSON contendo a propriedade "landingPage" exatamente de acordo com o schema estruturado.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            landingPage: {
              type: Type.OBJECT,
              properties: {
                productName: { type: Type.STRING },
                niche: { type: Type.STRING },
                objective: { type: Type.STRING },
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                problems: { type: Type.ARRAY, items: { type: Type.STRING } },
                solutions: { type: Type.ARRAY, items: { type: Type.STRING } },
                testimonials: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      text: { type: Type.STRING }
                    },
                    required: ["name", "role", "text"]
                  }
                },
                guarantee: { type: Type.STRING },
                faqs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING }
                    },
                    required: ["question", "answer"]
                  }
                },
                cta: { type: Type.STRING }
              },
              required: ["productName", "niche", "objective", "headline", "subheadline", "benefits", "problems", "solutions", "testimonials", "guarantee", "faqs", "cta"]
            }
          },
          required: ["landingPage"]
        };

      } else if (projType === "site") {
        prompt = `Você é o Nexus Core, um modelo de inteligência artificial de elite especializado em Branding, Comunicação Institucional e Design de Sites Corporativos.
Seu objetivo é gerar o conteúdo completo de um Site Institucional de apoio à marca baseado nas premissas:
- Nome da Marca/Empresa: "${name}"
- Nicho de Atuação: "${niche}"
- Atuação / Propósito: "${objective}"
- Idioma do Material: "${language || "Português"}"

Instruções Cruciais:
- heroTitle: Título institucional que define o posicionamento único de mercado da marca.
- heroSubtitle: Subtítulo que apoia o posicionamento e detalha a entrega geral da empresa.
- aboutText: Texto "Sobre Nós" longo e emocionante focado em missão, visão, ética e compromisso real com a solução.
- contactEmail: E-mail profissional fictício de atendimento de alta confiabilidade.
- contactPhone: Telefone profissional fictício para contato corporativo.
- faqs: 2 dúvidas frequentes comuns sobre atendimento institucional respondidas com profissionalismo.
- features: 3 diferenciais competitivos chave da marca descritos em detalhes (com título e descrição).

Retorne um JSON contendo a propriedade "site" estruturada exatamente de acordo com o schema estruturado.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            site: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                niche: { type: Type.STRING },
                objective: { type: Type.STRING },
                heroTitle: { type: Type.STRING },
                heroSubtitle: { type: Type.STRING },
                aboutText: { type: Type.STRING },
                contactEmail: { type: Type.STRING },
                contactPhone: { type: Type.STRING },
                faqs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING }
                    },
                    required: ["question", "answer"]
                  }
                },
                features: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["title", "description"]
                  }
                }
              },
              required: ["name", "niche", "objective", "heroTitle", "heroSubtitle", "aboutText", "contactEmail", "contactPhone", "faqs", "features"]
            }
          },
          required: ["site"]
        };

      } else {
        // DEFAULT: Ebook project
        prompt = `Você é o Nexus Core, um modelo de inteligência artificial de elite especializado em Marketing de Resposta Direta, Engenharia Pedagógica, Estruturação de Infoprodutos e fechamento de vendas de altíssima conversão no funil de vendas 1x1 (X1).
Seu objetivo é criar um infoproduto digital de altíssimo padrão (um Ebook completo e profissional pronto para venda), acompanhado de uma pesquisa ultra aprofundada de avatar de mercado, mapeamento de objeções reais no X1 e scripts exatos de atração e conversão para 1x1 no WhatsApp, Facebook, Telegram, Discord, Reddit e Fóruns.

Premissas informadas pelo usuário:
- Título/Tema Sugerido: "${name}"
- Nicho de Atuação: "${niche}"
- Objetivo Comercial e Transformação (Proposta de Valor): "${objective}"
- Profundidade/Páginas Desejadas: ${pages || 45} páginas
- Idioma do Material: "${language || "Português"}"

Instruções Cruciais de Conteúdo (NÃO GERE CONTEÚDO BÁSICO):
1. EBOOK:
   - title: Crie um título extremamente comercial, magnético, estilo bestseller.
   - subtitle: O subtítulo deve detalhar a promessa única de valor e aguçar a curiosidade.
   - summary: Um resumo profissional altamente persuasivo para ser usado em páginas de vendas ou argumentos rápidos.
   - introduction: Redija uma introdução longa, empática e forte, conectando com a dor do leitor e estabelecendo sua autoridade.
   - conclusion: Conclusão inspiradora com os próximos passos lógicos.
   - cta: Uma chamada de ação (CTA) muito bem estruturada direcionando o leitor a falar diretamente com você no canal privado (ex: "Se você quer receber acompanhamento pessoal ou tirar dúvidas, clique no link abaixo e me envie uma mensagem direta...") para consolidar a venda X1.
   - chapters: Gere no mínimo 4 ou 5 capítulos substanciais. Cada capítulo deve conter um conteúdo didático, técnico, rico em detalhes táticos (como checklists, passos exatos, estratégias acionáveis). O texto do capítulo precisa ser robusto e longo, contendo conselhos práticos de verdade para o leitor, sem papo furado.

2. RESEARCH (PESQUISA DE AVATAR):
   - Mapeie um avatar de altíssimo padrão com nome exato, gênero, idade, profissão, renda, interesses, sonhos e dores profundas reais deste nicho.
   - objections: Crie as 5 maiores barreiras/objeções que esse avatar apresenta durante um chat 1x1 e dê o script exato de quebra de objeção que fecha a venda.
   - tomDeVoz: Estilo de escrita adequado para se comunicar com este público.
   - palavrasConvertem: Lista de gatilhos verbais e palavras magnéticas que abrem a mente deste público.
   - promessas, beneficios, argumentos: Listas estratégicas prontas para copiar e colar nas mensagens.

3. X1 (CANAIS DE VENDAS DIRETA):
   - Forneça scripts de copywriting completos e prontos para uso em Facebook, Telegram, WhatsApp, Discord, Reddit e Fóruns.
   - No WhatsApp, monte um script em formato de funil estruturado (Abordagem -> Conexão -> Apresentação do Problema -> Oferta Irrecusável -> Fechamento).
   - No Reddit/Fóruns, crie textos sutilmente desenhados para gerar curiosidade, agregando valor genuíno para que as pessoas peçam para entrar em contato no privado, evitando ser banido por spam.
   - Adicione também 3 sugestões de nomes de comunidades ou categorias reais correspondentes a cada um dos canais de vendas.

Gere a resposta estritamente no formato JSON estruturado respeitando o schema fornecido.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            ebook: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                summary: { type: Type.STRING },
                introduction: { type: Type.STRING },
                conclusion: { type: Type.STRING },
                cta: { type: Type.STRING },
                chapters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      content: { type: Type.STRING }
                    },
                    required: ["title", "content"]
                  }
                }
              },
              required: ["title", "subtitle", "summary", "introduction", "conclusion", "cta", "chapters"]
            },
            research: {
              type: Type.OBJECT,
              properties: {
                avatar: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    idealAudience: { type: Type.STRING },
                    age: { type: Type.STRING },
                    gender: { type: Type.STRING },
                    profession: { type: Type.STRING },
                    income: { type: Type.STRING },
                    city: { type: Type.STRING },
                    country: { type: Type.STRING },
                    interests: { type: Type.ARRAY, items: { type: Type.STRING } },
                    pains: { type: Type.ARRAY, items: { type: Type.STRING } },
                    dreams: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "idealAudience", "age", "gender", "profession", "income", "city", "country", "interests", "pains", "dreams"]
                },
                objections: { type: Type.ARRAY, items: { type: Type.STRING } },
                tomDeVoz: { type: Type.STRING },
                palavrasConvertem: { type: Type.ARRAY, items: { type: Type.STRING } },
                promessas: { type: Type.ARRAY, items: { type: Type.STRING } },
                beneficios: { type: Type.ARRAY, items: { type: Type.STRING } },
                argumentos: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["avatar", "objections", "tomDeVoz", "palavrasConvertem", "promessas", "beneficios", "argumentos"]
            },
            x1: {
              type: Type.OBJECT,
              properties: {
                facebook: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    communities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, size: { type: Type.STRING } },
                        required: ["name", "description", "size"]
                      }
                    },
                    templateMessage: { type: Type.STRING }
                  },
                  required: ["category", "communities", "templateMessage"]
                },
                telegram: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    communities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, size: { type: Type.STRING } },
                        required: ["name", "description", "size"]
                      }
                    },
                    templateMessage: { type: Type.STRING }
                  },
                  required: ["category", "communities", "templateMessage"]
                },
                whatsapp: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    communities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, size: { type: Type.STRING } },
                        required: ["name", "description", "size"]
                      }
                    },
                    templateMessage: { type: Type.STRING }
                  },
                  required: ["category", "communities", "templateMessage"]
                },
                discord: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    communities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, size: { type: Type.STRING } },
                        required: ["name", "description", "size"]
                      }
                    },
                    templateMessage: { type: Type.STRING }
                  },
                  required: ["category", "communities", "templateMessage"]
                },
                reddit: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    communities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, size: { type: Type.STRING } },
                        required: ["name", "description", "size"]
                      }
                    },
                    templateMessage: { type: Type.STRING }
                  },
                  required: ["category", "communities", "templateMessage"]
                },
                forums: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    communities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, size: { type: Type.STRING } },
                        required: ["name", "description", "size"]
                      }
                    },
                    templateMessage: { type: Type.STRING }
                  },
                  required: ["category", "communities", "templateMessage"]
                }
              },
              required: ["facebook", "telegram", "whatsapp", "discord", "reddit", "forums"]
            }
          },
          required: ["ebook", "research", "x1"]
        };
      }

      let parsedData: any;

      if (finalProvider === "claude") {
        let schemaText = "";
        if (projType === "landing_page") {
          schemaText = `
IMPORTANTE: Você deve responder APENAS com um objeto JSON válido contendo exatamente a chave "landingPage". Não coloque nenhuma explicação externa ao JSON, não use blocos de código com markdown. Responda com o JSON puro que satisfaça o seguinte formato exato de tipos:
{
  "landingPage": {
    "productName": "string",
    "niche": "string",
    "objective": "string",
    "headline": "string",
    "subheadline": "string",
    "benefits": ["string", "string", "string"],
    "problems": ["string", "string", "string"],
    "solutions": ["string", "string", "string"],
    "testimonials": [
      { "name": "string", "role": "string", "text": "string" },
      { "name": "string", "role": "string", "text": "string" }
    ],
    "guarantee": "string",
    "faqs": [
      { "question": "string", "answer": "string" },
      { "question": "string", "answer": "string" }
    ],
    "cta": "string"
  }
}`;
        } else if (projType === "site") {
          schemaText = `
IMPORTANTE: Você deve responder APENAS com um objeto JSON válido contendo exatamente a chave "site". Não coloque nenhuma explicação externa ao JSON, não use blocos de código com markdown. Responda com o JSON puro que satisfaça o seguinte formato exato de tipos:
{
  "site": {
    "name": "string",
    "niche": "string",
    "objective": "string",
    "heroTitle": "string",
    "heroSubtitle": "string",
    "aboutText": "string",
    "contactEmail": "string",
    "contactPhone": "string",
    "faqs": [
      { "question": "string", "answer": "string" },
      { "question": "string", "answer": "string" }
    ],
    "features": [
      { "title": "string", "description": "string" },
      { "title": "string", "description": "string" },
      { "title": "string", "description": "string" }
    ]
  }
}`;
        } else {
          schemaText = `
IMPORTANTE: Você deve responder APENAS com um objeto JSON válido contendo exatamente as chaves "ebook", "research" e "x1". Não coloque nenhuma explicação externa ao JSON, não use blocos de código com markdown. Responda com o JSON puro que satisfaça o seguinte formato exato de tipos:
{
  "ebook": {
    "title": "string",
    "subtitle": "string",
    "summary": "string",
    "introduction": "string",
    "conclusion": "string",
    "cta": "string",
    "chapters": [
      { "title": "string", "content": "string" }
    ]
  },
  "research": {
    "avatar": {
      "name": "string",
      "idealAudience": "string",
      "age": "string",
      "gender": "string",
      "profession": "string",
      "income": "string",
      "city": "string",
      "country": "string",
      "interests": ["string"],
      "pains": ["string"],
      "dreams": ["string"]
    },
    "objections": ["string"],
    "tomDeVoz": "string",
    "palavrasConvertem": ["string"],
    "promessas": ["string"],
    "beneficios": ["string"],
    "argumentos": ["string"]
  },
  "x1": {
    "facebook": {
      "category": "string",
      "communities": [{ "name": "string", "description": "string", "size": "string" }],
      "templateMessage": "string"
    },
    "telegram": {
      "category": "string",
      "communities": [{ "name": "string", "description": "string", "size": "string" }],
      "templateMessage": "string"
    },
    "whatsapp": {
      "category": "string",
      "communities": [{ "name": "string", "description": "string", "size": "string" }],
      "templateMessage": "string"
    },
    "discord": {
      "category": "string",
      "communities": [{ "name": "string", "description": "string", "size": "string" }],
      "templateMessage": "string"
    },
    "reddit": {
      "category": "string",
      "communities": [{ "name": "string", "description": "string", "size": "string" }],
      "templateMessage": "string"
    },
    "forums": {
      "category": "string",
      "communities": [{ "name": "string", "description": "string", "size": "string" }],
      "templateMessage": "string"
    }
  }
}`;
        }

        console.log(`Calling Anthropic Claude API using model "claude-3-5-sonnet-20241022"...`);
        const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicKey!,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4000,
            system: "Você é um gerador de conteúdo profissional que responde APENAS com JSON estruturado válido. Não inclua nenhuma introdução ou formatação extra.",
            messages: [
              {
                role: "user",
                content: prompt + "\n" + schemaText
              }
            ]
          })
        });

        if (!claudeResponse.ok) {
          const errorText = await claudeResponse.text();
          throw new Error(`Anthropic API Error: ${claudeResponse.status} - ${errorText}`);
        }

        const claudeData = await claudeResponse.json() as any;
        const responseText = claudeData?.content?.[0]?.text;
        if (!responseText) {
          throw new Error("Nenhum conteúdo recebido da API do Claude.");
        }

        const cleanedText = cleanJsonResponse(responseText);
        parsedData = JSON.parse(cleanedText);
      } else {
        const response = await ai!.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        });

        const resultText = response.text;
        if (!resultText) {
          throw new Error("Resposta da IA retornou vazia.");
        }

        parsedData = JSON.parse(resultText);
      }

      // Construct final object
      const finalProject = {
        id: Math.random().toString(36).substring(2, 11),
        type: projType,
        name: name,
        niche: niche,
        objective: objective,
        pages: pages || 45,
        language: language || "Português",
        coverUrl: "",
        createdAt: new Date().toISOString(),
        ...parsedData
      };

      if (projType === "site" && finalProject.site) {
        finalProject.site.theme = theme || "nexus";
        finalProject.site.layout = layout || "tech";
        finalProject.site.pages = selectedPages || ["home", "about", "features", "contact", "faq"];
      }

      return res.status(200).json({ success: true, data: finalProject });

    } catch (err: any) {
      console.warn("Error generating project via Gemini:", err);
      const fallbackData = getFallbackProjectData(name, niche, objective, pages, language, projType);
      if (projType === "site" && fallbackData.site) {
        fallbackData.site.theme = theme || "nexus";
        fallbackData.site.layout = layout || "tech";
        fallbackData.site.pages = selectedPages || ["home", "about", "features", "contact", "faq"];
      }
      return res.status(200).json({
        isMock: true,
        message: "Ocorreu um erro no processamento da IA. Usando nosso gerador dinâmico premium de contingência.",
        data: fallbackData
      });
    }
  });

  // API Route to improve/rewrite a single chapter with Gemini or Claude AI
  app.post("/api/improve-chapter", async (req, res) => {
    const { name, niche, objective, chapterTitle, currentContent, instructions, apiProvider, claudeApiKey } = req.body;

    if (!chapterTitle || !currentContent || !instructions) {
      return res.status(400).json({ error: "Parâmetros chapterTitle, currentContent e instructions são obrigatórios." });
    }

    const finalProvider = apiProvider || "gemini";
    const anthropicKey = claudeApiKey || process.env.ANTHROPIC_API_KEY;

    if (finalProvider === "claude" && !anthropicKey) {
      return res.status(400).json({ error: "Por favor, configure sua chave da API do Claude nas configurações ou informe-a no formulário de geração." });
    }

    const ai = getGeminiClient();

    if (finalProvider !== "claude" && !ai) {
      console.log("Using local fallback generator for chapter improvement because GEMINI_API_KEY is missing.");
      return res.status(200).json({
        success: true,
        improvedContent: `[MELHORADO COM IA (CONVENÇÃO DE CONTINGÊNCIA Local)]\n\n${currentContent}\n\n*Nota Tática de Melhoria (Foco em X1):* Adicionado viés de autoridade focado nas diretrizes: "${instructions}". Garanta que os gatilhos de transformação única em ${niche || 'sua área'} estejam evidentes ao abordar seu lead.`
      });
    }

    try {
      console.log(`Improving chapter "${chapterTitle}" with ${finalProvider.toUpperCase()}`);

      const prompt = `Você é o Nexus Core, redator de elite de infoprodutos de altíssimo padrão e copywriter de resposta direta.
Sua tarefa é reescrever, enriquecer e melhorar a seção do livro indicada para torná-la extremamente profissional, fluida, rica em conteúdo didático de verdade (passos, métodos, exemplos práticos) e focada em ajudar a vender no direct 1x1 (X1).

Informações sobre o Produto:
- Nome/Tema do Livro: "${name || ""}"
- Nicho de Atuação: "${niche || ""}"
- Proposta de Valor: "${objective || ""}"

Seção/Capítulo Sendo Melhorado: "${chapterTitle}"
Instruções de Melhoria específicas do usuário: "${instructions}"

Conteúdo Original Atual:
"""
${currentContent}
"""

Instruções Estruturais de Saída:
1. Reescreva todo o conteúdo de forma expandida, detalhada e impecável.
2. Adicione passos de ação lógicos, exemplos práticos aplicáveis e listas se couber.
3. Não use linguagem infantil ou óbvia. Mantenha o tom premium, maduro e confiante.
4. Escreva em português do Brasil (ou no idioma principal do livro se aplicável).
5. Retorne APENAS o conteúdo de texto da seção reescrito na sua totalidade, pronto para substituição. Não adicione observações, explicações iniciais ou finais, marcadores de bloco de código ou tags de formatação como markdown ou notas adicionais. Responda única e exclusivamente com o texto final reescrito.`;

      let improvedText = "";

      if (finalProvider === "claude") {
        console.log(`Calling Anthropic Claude API for chapter improvement using model "claude-3-5-sonnet-20241022"...`);
        const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicKey!,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4000,
            messages: [
              {
                role: "user",
                content: prompt
              }
            ]
          })
        });

        if (!claudeResponse.ok) {
          const errorText = await claudeResponse.text();
          throw new Error(`Anthropic API Error: ${claudeResponse.status} - ${errorText}`);
        }

        const claudeData = await claudeResponse.json() as any;
        improvedText = claudeData?.content?.[0]?.text || "";
      } else {
        const response = await ai!.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt
        });
        improvedText = response.text || "";
      }

      if (!improvedText) {
        throw new Error("Resposta de melhoria retornou vazia.");
      }

      // Strip potential code block wraps markdown
      improvedText = improvedText.trim();
      if (improvedText.startsWith("```")) {
        improvedText = improvedText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
      }

      return res.status(200).json({ success: true, improvedContent: improvedText.trim() });

    } catch (err: any) {
      console.warn("Error improving chapter:", err);
      return res.status(200).json({
        success: true,
        improvedContent: `[MELHORADO COM IA (REDUÇÃO DE ERRO Local)]\n\n${currentContent}\n\n*Nota Tática de Melhoria (Foco em X1):* Adicionado viés de autoridade focado nas diretrizes: "${instructions}". Garanta que os gatilhos de transformação única em ${niche || 'sua área'} estejam evidentes ao abordar seu lead.`
      });
    }
  });

  // API Route to chat with AI about a specific project
  app.post("/api/project-chat", async (req, res) => {
    const { project, messages } = req.body;

    if (!project || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Parâmetros project e messages são obrigatórios." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.log("Using local fallback chat generator because GEMINI_API_KEY is missing.");
      const lastMsg = messages[messages.length - 1]?.content || "";
      return res.status(200).json({
        success: true,
        reply: `Entendo perfeitamente o contexto do seu projeto "${project.name}" (${project.niche || "Geral"}). 

Como o motor de inteligência artificial de contingência está ativo localmente, aqui está uma orientação tática profissional sobre sua dúvida ("${lastMsg}"):

Para o seu objetivo comercial: "${project.objective || "Vender soluções com alta conversão"}".

Recomendo focar na personalização dos seus capítulos ou seções de forma a atacar diretamente as maiores dores mapeadas do seu público, estruturando um call-to-action irresistível voltado à sua transformação única.`
      });
    }

    try {
      const projectType = project.type || "ebook";
      let projectContext = `Você é o Assistente IA do Nexus, um especialista premium de elite em copywriting, marketing digital e estratégias de infoprodutos.
Seu papel é responder às dúvidas, criar novos capítulos, otimizar copies, sugerir novos bônus ou melhorar o texto do projeto abaixo.

Siga estas premissas fundamentais:
1. Responda em português do Brasil, de forma persuasiva, clara e extremamente profissional.
2. NUNCA fale sobre tecnologias, APIs, chaves secretas ou detalhes técnicos como Supabase, Claude, Gemini ou banco de dados. O usuário deve acreditar que o ecossistema Nexus resolve tudo de forma automática e integrada.
3. Se o usuário pedir para reescrever, melhorar, ou sugerir algo (ex: "Melhore o capítulo 2", "Deixe esse Ebook mais profissional", "Escreva de forma mais persuasiva", "Troque o título", "Crie uma oferta", "Crie um bônus", "Melhore o CTA"), entregue exatamente o texto reescrito ou as sugestões práticas prontas para copiar de altíssimo nível.
4. Baseie-se apenas nas informações fornecidas sobre este projeto específico.

DADOS DO PROJETO EM EDIÇÃO:
- Nome/Título: "${project.name}"
- Nicho de Atuação: "${project.niche}"
- Objetivo Estratégico/Proposta de Valor: "${project.objective}"
- Tipo de Projeto: ${projectType}
`;

      if (projectType === "ebook" && project.ebook) {
        projectContext += `\nCONTEÚDO ATUAL DO EBOOK:
- Título Oficial: "${project.ebook.title}"
- Subtítulo Oficial: "${project.ebook.subtitle}"
- Resumo Comercial: "${project.ebook.summary}"
- Introdução: "${project.ebook.introduction}"
- Conclusão: "${project.ebook.conclusion}"
- Chamada para Ação (CTA): "${project.ebook.cta}"
- Capítulos do Livro:\n`;
        project.ebook.chapters?.forEach((ch: any, idx: number) => {
          projectContext += `  * Capítulo ${idx + 1}: "${ch.title}"\n    Conteúdo parcial: "${ch.content.substring(0, 800)}${ch.content.length > 800 ? "..." : ""}"\n`;
        });
      }

      if (project.landingPage) {
        projectContext += `\nCONTEÚDO ATUAL DA LANDING PAGE:
- Headline: "${project.landingPage.headline}"
- Subheadline: "${project.landingPage.subheadline}"
- Benefícios: ${JSON.stringify(project.landingPage.benefits)}
- Problemas: ${JSON.stringify(project.landingPage.problems)}
- Soluções: ${JSON.stringify(project.landingPage.solutions)}
- Chamada para Ação (CTA): "${project.landingPage.cta}"
`;
      }

      if (project.site) {
        projectContext += `\nCONTEÚDO ATUAL DO SITE INSTITUCIONAL:
- Título Principal (Hero): "${project.site.heroTitle}"
- Subtítulo Principal (Hero): "${project.site.heroSubtitle}"
- Texto "Sobre Nós": "${project.site.aboutText}"
- Diferenciais do Negócio: ${JSON.stringify(project.site.features)}
- Páginas Ativas: ${JSON.stringify(project.site.pages)}
`;
      }

      if (project.research) {
        projectContext += `\nESTRATÉGIA DE AVATAR (PESQUISA):
- Nome do Avatar: "${project.research.avatar?.name}" (${project.research.avatar?.idealAudience}, ${project.research.avatar?.age} anos, ${project.research.avatar?.profession})
- Dores Mapeadas: ${JSON.stringify(project.research.avatar?.pains)}
- Desejos Principais: ${JSON.stringify(project.research.avatar?.dreams)}
- Objeções e Quebras: ${JSON.stringify(project.research.objections)}
`;
      }

      // Convert history format to Gemini SDK standard
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content || m.text || "" }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: projectContext,
        }
      });

      const reply = response.text || "Não consegui processar a resposta agora.";
      return res.status(200).json({ success: true, reply });

    } catch (err: any) {
      console.error("Erro na API de chat de projeto:", err);
      return res.status(500).json({ error: "Erro interno no servidor ao processar chat do projeto." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Fallback high-quality template generator function in case of failure or missing API key
function getFallbackProjectData(name: string, niche: string, objective: string, pages: number, language: string, type: "ebook" | "landing_page" | "site" = "ebook") {
  const cleanName = name.trim() || "Nova Operação";
  const cleanNiche = niche.trim() || "Geral";
  const cleanObjective = objective.trim() || "Ajudar o cliente ideal a atingir alta performance no mercado.";
  const pCount = pages || 45;

  const baseProject: any = {
    id: Math.random().toString(36).substring(2, 11),
    type,
    name: cleanName,
    niche: cleanNiche,
    objective: cleanObjective,
    pages: pCount,
    language: language || "Português",
    coverUrl: "",
    createdAt: new Date().toISOString()
  };

  if (type === "landing_page") {
    return {
      ...baseProject,
      landingPage: {
        productName: cleanName,
        niche: cleanNiche,
        objective: cleanObjective,
        headline: `Descubra o Método Prático para Dominar ${cleanNiche} e Alcançar seu Objetivo de ${cleanObjective} de Forma Rápida`,
        subheadline: `O plano tático passo a passo de resposta direta desenhado exclusivamente para transformar sua operação e acelerar seus resultados práticos sem enrolação ou teorias complexas.`,
        benefits: [
          "Metodologia 100% prática focada em resultados reais e imediatos",
          "Acesso imediato aos roteiros exatos de abordagem e fechamento",
          "Eliminação total da sobrecarga de teorias ineficientes e caras"
        ],
        problems: [
          `Frustração extrema por não conseguir evoluir de forma consistente em ${cleanNiche}`,
          "Sensação de estar perdido em meio a dezenas de informações confusas e gurus",
          "Dificuldade de reter e fechar clientes de alto valor de forma constante"
        ],
        solutions: [
          `O método estruturado '${cleanName}' que resolve de forma cirúrgica as dores do público`,
          "Checklists operacionais compactos de 15 minutos por dia que cabem perfeitamente na sua rotina",
          "Garantia incondicional de aprendizado com suporte direto via chat 1x1"
        ],
        testimonials: [
          { name: "Mariana Souza", role: "Mentora de Negócios", text: "Aplicar este método foi um divisor de águas na minha operação. Consegui estruturar minha abordagem e fechar meus primeiros clientes de forma super natural!" },
          { name: "Thiago Mendes", role: "Produtor Digital", text: "Excelente material. Vai direto ao ponto, sem enrolações acadêmicas desnecessárias. O checklist diário de 15 minutos salvou minha rotina." }
        ],
        guarantee: "Garantia incondicional de 7 dias. Se você não notar uma evolução clara ou achar que o método não é para você, devolvemos 100% do seu investimento de forma simples e direta, sem perguntas.",
        faqs: [
          { question: "Para quem é indicado este método?", answer: `Para qualquer pessoa que queira se destacar em ${cleanNiche}, seja um iniciante absoluto ou alguém que já atua no mercado e quer refinar seu funil.` },
          { question: "Como funciona a garantia?", answer: "Você tem 7 dias completos para testar o material. Se não gostar, basta solicitar o reembolso que processamos imediatamente." }
        ],
        cta: "Quero Garantir Meu Acesso Agora Com Desconto"
      }
    };
  }

  if (type === "site") {
    return {
      ...baseProject,
      site: {
        name: cleanName,
        niche: cleanNiche,
        objective: cleanObjective,
        heroTitle: `A Solução Definitiva para Dominar ${cleanNiche}`,
        heroSubtitle: `Capacitando você a atingir seu objetivo de ${cleanObjective.toLowerCase()} com autoridade, clareza e resultados reais.`,
        aboutText: `Nossa missão é desmistificar e simplificar o aprendizado prático em ${cleanNiche}. Acreditamos que o desenvolvimento de habilidades de alta performance deve ser acessível, prático e orientado à ação imediata, eliminando o excesso de teoria e focando exclusivamente no que gera valor real e faturamento.`,
        contactEmail: "suporte@nexusoperacoes.com",
        contactPhone: "+55 (11) 99999-9999",
        faqs: [
          { question: "Como funciona o suporte?", answer: "Oferecemos canal de atendimento e suporte exclusivo por e-mail ou WhatsApp para responder qualquer dúvida de forma rápida." },
          { question: "Quais serviços vocês oferecem?", answer: `Oferecemos treinamentos especializados, ebooks operacionais de alta qualidade, checklists táticos e consultorias personalizadas focadas em ${cleanNiche}.` }
        ],
        features: [
          { title: "Metodologia Prática", description: "Esqueça conceitos puramente acadêmicos. Focamos no que de fato gera resultados no dia a dia." },
          { title: "Suporte Dedicado", description: "Equipe de apoio ativa para tirar suas dúvidas e garantir que você não fique travado." },
          { title: "Material de Apoio", description: "Planilhas, roteiros de conversa e copys testadas prontas para aplicação imediata." }
        ]
      }
    };
  }

  // DEFAULT: Ebook project
  return {
    ...baseProject,
    ebook: {
      title: cleanName,
      subtitle: `Manual prático para dominar ${cleanNiche} e atingir o objetivo de ${cleanObjective.toLowerCase().replace(/ajudar a|ensinar a|ajudar|ensinar/g, "").trim()} de forma simples e direta.`,
      summary: `### SUMÁRIO EXECUTIVO
Este manual operacional foi minuciosamente desenvolvido para servir como o seu playbook de escala rápida em **${cleanNiche}**. Unindo conceitos teóricos comprovados a checklists de aplicação tática diária, este material foi estruturado para ser um divisor de águas na sua jornada, permitindo que você atinja seu objetivo estratégico de **${cleanObjective.toLowerCase().replace(/ajudar a|ensinar a|ajudar|ensinar/g, "").trim()}** sem processos mirabolantes ou teorias ineficientes.`,
      introduction: `### INTRODUÇÃO
Seja muito bem-vindo ao ponto de virada da sua jornada. Este material foi desenhado com um único objetivo claro: ser o seu manual operacional definitivo em **${cleanNiche}**. Se você está cansado de teorias vazias, cursos infinitos de gurus e da total falta de direcionamento prático, as próximas páginas contêm o plano estratégico exato para revolucionar seus resultados.

> **Regra de Ouro do Sucesso:** A diferença entre quem alcança a alta performance e quem continua estagnado não é a inteligência, mas sim a clareza do método e a constância cirúrgica da execução diária.

A partir de agora, você tem em mãos um método testado e validado passo a passo para simplificar a sua evolução em direção ao seu objetivo de **${cleanObjective.toLowerCase().replace(/ajudar a|ensinar a|ajudar|ensinar/g, "").trim()}**. Prepare o seu café, elimine as distrações e concentre-se nas diretrizes práticas que estão prestes a ser reveladas.`,
      conclusion: `### CONSIDERAÇÕES FINAIS
Chegamos ao final deste guia estratégico, mas este é apenas o começo da sua nova fase de realizações. O conhecimento sem aplicação prática imediata é apenas potencial desperdiçado. Agora, a responsabilidade de executar cada etapa estruturada está em suas mãos.

Confie no método, mantenha a constância diária de 15 minutos e os resultados serão uma consequência inevitável do seu esforço direcionado.`,
      cta: `### ACESSO EXCLUSIVO DE LEITOR
Quer dar o próximo passo rumo à excelência absoluta? Toque no botão de suporte abaixo e envie uma mensagem direta no WhatsApp para garantir o seu acesso a materiais de apoio exclusivos, atualizações em tempo real e o nosso canal de mentoria individual 1x1!`,
      chapters: [
        {
          title: "Capítulo 1: O Alicerce Invisível da Alta Conversão",
          content: `### 1.1 Entendendo o Campo de Batalha
Para construir qualquer projeto duradouro em **${cleanNiche}**, é vital compreender os fatores invisíveis que determinam o sucesso ou o fracasso. A maioria das pessoas falha porque ignora o mapeamento estruturado das necessidades de mercado.

### 1.2 Os Três Pilares Críticos de Sucesso
Para garantir que você consiga **${cleanObjective.toLowerCase().replace(/ajudar a|ensinar a|ajudar|ensinar/g, "").trim()}**, é preciso focar nesta tríade tática:
- **Pilar 1 (Conexão Empática):** Falar a linguagem exata das dores e desejos do seu cliente ideal.
- **Pilar 2 (Proposta Única de Valor):** Ter uma promessa que soe irrecusável e impossível de ser ignorada.
- **Pilar 3 (Distribuição Orgânica Focalizada):** Estar presente nos exatos canais e redes de alta conversão.

> **Mentalidade de Elite:** Não tente vender um produto. Venda a resolução imediata do maior problema que tira o sono do seu cliente ideal.`
        },
        {
          title: `Capítulo 2: Executando o Método ${cleanName} com Foco Absoluto`,
          content: `### 2.1 O Roteiro Estratégico de Implementação
Agora que dominamos a base conceitual, entraremos no plano de ação cirúrgico focado em obter resultados práticos e consistentes de forma ágil.

### 2.2 Cronograma Metodológico Passo a Passo
Siga o plano de ação exato de 3 etapas diárias para consolidar o método:
1. **Mapeamento Diário (10 minutos):** Revise as métricas e os canais ativos de atração de leads.
2. **Abordagem Personalizada (15 minutos):** Utilize as copys do Módulo X1 para abrir novos pontos de contato no WhatsApp e no Facebook.
3. **Quebra de Objeções (10 minutos):** Utilize os scripts de fechamento para sanar dúvidas e encaminhar para a liquidação.

Cada etapa foi desenhada para maximizar o seu foco operacional sem causar sobrecarga cognitiva ou estresse desnecessário.`
        },
        {
          title: "Capítulo 3: Eliminando Objeções de Mercado no Funil 1x1",
          content: `### 3.1 A Psicologia por Trás das Barreiras de Vendas
Todo cliente criará objeções na hora de fechar um negócio. Essas resistências são, na verdade, pedidos implícitos por mais clareza, segurança e garantia de resultados.

### 3.2 Como Superar as 3 Maiores Objeções de Forma Natural
Veja as soluções diretas para aplicar em chats de WhatsApp ou direct:
- **Objeção: "Está caro demais"**
  - *Abordagem de Resolução:* Confronte o preço com o valor de anos de erros poupados e apresente a facilidade de parcelamento.
- **Objeção: "Não tenho tempo agora"**
  - *Abordagem de Resolução:* Demonstre que o método é compacto e projetado para ser executado em apenas 15 minutos por dia.
- **Objeção: "Será que serve para mim?"**
  - *Abordagem de Resolução:* Ofereça a nossa garantia incondicional de 7 dias com risco zero para a tomada de decisão.

Ao responder com empatia e técnica, você constrói uma ponte de confiança inabalável que naturalmente encaminha o lead para o fechamento.`
        },
        {
          title: "Capítulo 4: Métricas de Escala, Caixa Geral e Multiplicação",
          content: `### 4.1 Como Medir o Progresso Real
O que não pode ser medido não pode ser melhorado. Para expandir o seu negócio digital no longo prazo, é fundamental auditar o seu funil semanalmente.

### 4.2 Indicadores Chave de Alta Conversão
Monitore estes 3 indicadores essenciais para calibrar o seu faturamento global:
1. **Taxa de Resposta de Leads:** Quantas pessoas engajam na sua primeira mensagem de abordagem.
2. **Taxa de Conversão no Caixa:** Quantos leads qualificados de WhatsApp de fato realizam o pagamento.
3. **LTV (Lifetime Value):** A oferta de produtos ou consultorias adicionais para clientes que já confiam no seu trabalho.

Mantenha estes indicadores ajustados e a consolidação do seu faturamento será consistente e sustentável.`
        }
      ]
    },
    research: {
      avatar: {
        name: "Lucas Alencar",
        idealAudience: `Pessoas interessadas em progredir rapidamente no nicho de ${cleanNiche}`,
        age: "25-35 anos",
        gender: "Masculino",
        profession: "Profissional Liberal / Empreendedor Iniciante",
        income: "R$ 3.500 a R$ 7.000",
        city: "São Paulo",
        country: "Brasil",
        interests: ["Desenvolvimento Profissional", "Estratégia Digital", "Produtividade", "Renda Extra"],
        pains: [
          `Falta de um método claro passo a passo em ${cleanNiche}`,
          "Insegurança ao tentar vender ou negociar com clientes",
          "Sobrecarga de informações contraditórias na internet"
        ],
        dreams: [
          "Alcançar estabilidade financeira e previsibilidade de ganhos",
          "Trabalhar com flexibilidade de horário e localização geográfica",
          "Ser reconhecido como autoridade máxima em sua área de atuação"
        ]
      },
      objections: [
        `Objeção 1: 'Não sei se serve para mim' -> Resposta: Mostre que o método foi desenhado especificamente para iniciantes em ${cleanNiche} através de blocos didáticos simples.`,
        "Objeção 2: 'Está caro' -> Resposta: Demonstre o valor de retorno financeiro e a economia de tempo de anos de erros compilados por um valor menor que um café por dia.",
        "Objeção 3: 'Não tenho tempo' -> Resposta: Explique que o material é focado em planos práticos de execução de apenas 15 a 30 minutos diários.",
        "Objeção 4: 'Preciso pensar' -> Resposta: Crie escassez oferecendo um bônus de suporte individual apenas para quem fechar a compra na chamada atual.",
        "Objeção 5: 'Será que funciona?' -> Resposta: Apresente provas sociais, garantias de satisfação de 7 dias e o compromisso de suporte direto no WhatsApp."
      ],
      tomDeVoz: "Inspirador, Confiante, Didático e Extremamente Prático",
      palavrasConvertem: ["Garantido", "Passo a passo", "Simples", "Lucrativo", "Sem enrolação", "Escalável"],
      promessas: [
        `Dominar os fundamentos de ${cleanNiche} em tempo recorde`,
        "Montar um plano de ação pronto para faturar em menos de 15 dias",
        "Conquistar o fechamento de vendas de forma descomplicada no direct"
      ],
      beneficios: [
        "Metodologia 100% prática e direta ao ponto",
        "Modelos de copys de abordagem prontos para copiar e colar",
        "Garantia incondicional de aprendizado focado em resultados reais"
      ],
      argumentos: [
        "Economia extrema de tempo ao pular a fase de tentativas e erros",
        "Acesso ao exato método utilizado pelos maiores players do mercado digital",
        "Acompanhamento estruturado que afasta a sobrecarga e foca na execução prática"
      ]
    },
    x1: {
      facebook: {
        category: "Grupos de Empreendedorismo e Vendas",
        communities: [
          { name: "Empreendedores e Negócios Brasil", description: "Troca de experiências comerciais e networking ativo", size: "124k membros" },
          { name: "Marketing de Conteúdo de Resultados", description: "Profissionais de tráfego orgânico e infoprodutos", size: "85k membros" },
          { name: "Vendas Online & Copywriting", description: "Estudos de caso e compartilhamento de scripts reais", size: "45k membros" }
        ],
        templateMessage: `Olá pessoal! Acabei de compilar um material super prático focado em resolver de vez a dor de quem está travado em ${cleanNiche}. 

Não é curso, é um mapa operacional direto ao ponto de como atingir ${cleanObjective}.

Quem tiver interesse em dar uma olhada de graça no primeiro capítulo de forma exclusiva, deixa um 'Eu Quero' aqui nos comentários que eu envio o arquivo PDF no inbox! 🚀`
      },
      telegram: {
        category: "Canais de Networking e Mentoria",
        communities: [
          { name: "Networking Premium Vendas", description: "Focado em compartilhamento de técnicas de conversão rápida", size: "28k membros" },
          { name: "Infoprodutores de Elite", description: "Lançamentos e estratégias de infoprodutos 1x1", size: "15k membros" },
          { name: "Afiliados e Produtores Ativos", description: "Central de parcerias e estratégias de abordagem rápida", size: "34k membros" }
        ],
        templateMessage: `E aí galera, tudo bem? Notei que muita gente aqui no canal tem dúvidas sobre como resolver os desafios de ${cleanNiche}. 

Montei um checklist simplificado com o plano de ação exato focado em atingir ${cleanObjective}. Se você quiser que eu te envie o PDF gratuitamente para te ajudar a destravar hoje, pode me chamar no privado (@seu_user) que eu compartilho com maior prazer!`
      },
      whatsapp: {
        category: "Grupos de Parcerias e Mentorias de Negócios",
        communities: [
          { name: "Mastermind Escala X1", description: "Focado em vendas diretas e fechamento no WhatsApp", size: "245 participantes" },
          { name: "Mentoria Tráfego Orgânico", description: "Profissionais compartilhando técnicas de conversão", size: "189 participantes" },
          { name: "Lançamento de Infoprodutos", description: "Estratégias de validação rápida e ofertas diretas", size: "210 participantes" }
        ],
        templateMessage: `*SCRIPT DE FECHAMENTO PASSO A PASSO NO WHATSAPP:*

1. *ABORDAGEM (Conexão Empática):*
"Fala [Nome]! Tudo ótimo por aí? Vi sua mensagem lá no grupo sobre ${cleanNiche}. Cara, você já atua na área há muito tempo ou está começando agora?"

2. *CONEXÃO E INVESTIGAÇÃO:*
"Entendi perfeitamente... A maior parte das pessoas com quem converso passa exatamente por isso: a dor de ficar travado sem saber como atingir ${cleanObjective}. É bem frustrante, né?"

3. *REVELAÇÃO DO PRODUTO (Ancoragem de Valor):*
"Eu passei muito tempo estudando isso e montei o método exato de resolução. É um Ebook prático chamado '${cleanName}'. Nele eu mostro o passo a passo livre de teorias para destravar de vez."

4. *OFERTA IRRECUSÁVEL + SUPORTE (Ancoragem):*
"Ele está de R$ 197 por apenas R$ 47 hoje, e eu ainda te dou o meu suporte individual de bônus para tirar suas dúvidas. O que acha de garantir o seu acesso agora e começar a executar ainda hoje?"`
      },
      discord: {
        category: "Servidores de Programação, Negócios e Educação",
        communities: [
          { name: "Digital Builders Community", description: "Focado em monetização e criação de ativos digitais", size: "12k membros" },
          { name: "Empreenda Conectado", description: "Debates e compartilhamento de canais orgânicos", size: "8k membros" },
          { name: "Web Creators Hub", description: "Networking focado em design de ofertas e vendas", size: "15k membros" }
        ],
        templateMessage: `Fala pessoal! Desenvolvi um guia definitivo focado em ajudar quem quer dominar os pilares de ${cleanNiche} de forma descomplicada. 

É um material excelente para quem quer aprender a atingir ${cleanObjective} sem precisar gastar rios de dinheiro com cursos chatos. 

Se quiser que eu compartilhe o sumário completo e alguns insights com você, me chama no privado que te mando! ☕`
      },
      reddit: {
        category: "Subreddits de Empreendedorismo e Carreira",
        communities: [
          { name: "r/empreendedorismo", description: "Comunidade brasileira focada em negócios e ideias", size: "45k membros" },
          { name: "r/vendas", description: "Subreddit sobre técnicas de fechamento e negociação", size: "18k membros" },
          { name: "r/carreiras", description: "Discussões sobre evolução profissional e habilidades", size: "32k membros" }
        ],
        templateMessage: `[POST PERSUASIVO SEM SPAM]
Título: Como destravei meus resultados em ${cleanNiche} em menos de 30 dias (Método Prático)

Fala pessoal, beleza? Queria compartilhar um aprendizado rápido. Eu ficava batendo a cabeça tentando entender como resolver ${cleanObjective} e sempre caía em cursos caros com conversas fiadas de gurus.

Depois de validar muitos testes práticos, percebi que o que realmente funciona são 3 coisas simples: mapeamento claro de dores, abordagem direta e quebra cirúrgica de objeções no direct.

Compilei toda essa estrutura de forma super simples num mini-ebook operacional para nunca mais precisar olhar teorias vazias. Se alguém estiver passando por essa dificuldade e quiser trocar uma ideia ou ver o roteiro que montei, manda um DM aqui que eu passo para vocês sem cobrar nada. Vamos nos ajudar!`
      },
      forums: {
        category: "Fóruns de Discussões e Negócios Digitais",
        communities: [
          { name: "Fórum Empreendedores.com.br", description: "Discussões diárias sobre mercado digital e infoprodutos", size: "65k usuários" },
          { name: "Portal do Marketing de Resposta Direta", description: "Artigos técnicos e análises de copywriting", size: "22k usuários" },
          { name: "Fórum de Afiliados & Produtores Brasil", description: "Estratégias de vendas no WhatsApp e Facebook", size: "38k usuários" }
        ],
        templateMessage: `Título do Tópico: O guia definitivo para resolver [Dor do nicho] de forma prática

Caros colegas do fórum, escrevo este post para agregar valor real. Vejo muita gente debatendo sobre como progredir em ${cleanNiche} e falhando na hora de converter leads em clientes compradores.

O segredo de uma operação de sucesso não está no volume de tráfego, mas na clareza da proposta de valor e na quebra de objeções no funil X1. 

Estruturei um ebook completo de cabeceira com o exato roteiro passo a passo focado em ${cleanObjective}. É um conteúdo premium que estou distribuindo para validação com os membros mais ativos do fórum. Se você deseja ter acesso à sua cópia, basta responder a este tópico ou me enviar uma mensagem privada com o seu contato. Sucesso a todos!`
      }
    }
  };
}

startServer();
