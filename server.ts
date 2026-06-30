import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

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

  // API Route to generate project utilizing Gemini AI
  app.post("/api/generate-project", async (req, res) => {
    const { name, niche, objective, pages, language } = req.body;

    if (!name || !niche || !objective) {
      return res.status(400).json({ error: "Parâmetros name, niche e objective são obrigatórios." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return a simulated high-quality response if Gemini Key is missing, so the app remains 100% functional
      console.log("Using local fallback template generator because GEMINI_API_KEY is not defined.");
      return res.status(200).json({
        isMock: true,
        message: "Chave API não configurada. Usando mecanismo local premium de contingência.",
        data: getFallbackProjectData(name, niche, objective, pages, language)
      });
    }

    try {
      console.log(`Generating project with Gemini: Name="${name}", Niche="${niche}"`);

      const prompt = `Você é o Nexus Core, um modelo de inteligência artificial de elite especializado em Marketing de Resposta Direta, Engenharia Pedagógica, Estruturação de Infoprodutos e fechamento de vendas de altíssima conversão no funil de vendas 1x1 (X1).
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

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
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
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Resposta da IA retornou vazia.");
      }

      const parsedData = JSON.parse(resultText);
      return res.status(200).json({ success: true, data: parsedData });

    } catch (err: any) {
      console.error("Error generating project via Gemini:", err);
      return res.status(200).json({
        isMock: true,
        message: "Ocorreu um erro no processamento da IA. Usando nosso gerador dinâmico premium de contingência.",
        data: getFallbackProjectData(name, niche, objective, pages, language)
      });
    }
  });

  // API Route to improve/rewrite a single chapter with Gemini AI
  app.post("/api/improve-chapter", async (req, res) => {
    const { name, niche, objective, chapterTitle, currentContent, instructions } = req.body;

    if (!chapterTitle || !currentContent || !instructions) {
      return res.status(400).json({ error: "Parâmetros chapterTitle, currentContent e instructions são obrigatórios." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.log("Using local fallback generator for chapter improvement because GEMINI_API_KEY is missing.");
      return res.status(200).json({
        success: true,
        improvedContent: `[MELHORADO COM IA (CONVENÇÃO DE CONTINGÊNCIA Local)]\n\n${currentContent}\n\n*Nota Tática de Melhoria (Foco em X1):* Adicionado viés de autoridade focado nas diretrizes: "${instructions}". Garanta que os gatilhos de transformação única em ${niche || 'sua área'} estejam evidentes ao abordar seu lead.`
      });
    }

    try {
      console.log(`Improving chapter "${chapterTitle}" with Gemini model gemini-3.5-flash`);

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

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      let improvedText = response.text;
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
      console.error("Error improving chapter via Gemini:", err);
      return res.status(200).json({
        success: true,
        improvedContent: `[MELHORADO COM IA (REDUÇÃO DE ERRO Local)]\n\n${currentContent}\n\n*Nota Tática de Melhoria (Foco em X1):* Adicionado viés de autoridade focado nas diretrizes: "${instructions}". Garanta que os gatilhos de transformação única em ${niche || 'sua área'} estejam evidentes ao abordar seu lead.`
      });
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
function getFallbackProjectData(name: string, niche: string, objective: string, pages: number, language: string) {
  const cleanName = name.trim() || "Nova Operação de Ebook";
  const cleanNiche = niche.trim() || "Geral";
  const cleanObjective = objective.trim() || "Ajudar o cliente ideal a atingir alta performance no mercado.";
  const pCount = pages || 45;

  return {
    ebook: {
      title: `Método ${cleanName} Avançado`,
      subtitle: `Como atingir resultados extraordinários em ${cleanNiche} focando na transformação prática do seu cliente`,
      summary: `Este guia prático foi minuciosamente desenvolvido para servir como o seu playbook de escala em ${cleanNiche}. Ele une os conceitos teóricos aos planos de ação diários para garantir resultados consistentes, de forma rápida e descomplicada.`,
      introduction: `Boas-vindas à sua jornada rumo à alta conversão. Este livro foi projetado para ser o seu mapa operacional. Se você busca estratégias práticas, as próximas páginas trazem o método exato para revolucionar seus resultados.`,
      conclusion: `Chegamos ao final do guia, mas a sua jornada de escala está apenas começando. O conhecimento só gera valor com a prática constante. Vá ao mercado, aplique o método e conquiste sua liberdade comercial.`,
      cta: `Quer destravar materiais de apoio inéditos e planilhas de execução prática para acelerar em até 3x seu progresso? Toque no link de suporte e me mande uma mensagem direta no WhatsApp agora mesmo!`,
      chapters: [
        {
          title: "Capítulo 1: O Pilar Invisível da Conversão",
          content: `Para construir qualquer projeto de sucesso em ${cleanNiche}, o passo número zero é entender perfeitamente o seu mercado de atuação. A maioria dos produtores digitais fracassa porque ignora as dores reais do cliente ideal. Aqui, analisaremos de forma simples como estruturar uma oferta que se venda sozinha de forma imediata.`
        },
        {
          title: "Capítulo 2: Executando com Maestria e Foco",
          content: `Com os conceitos alinhados, entraremos na fase tática direcionada a ${cleanObjective}. Dissecaremos as ferramentas práticas necessárias para maximizar a sua entrega diária e construir uma imagem profissional de extrema autoridade frente aos seus leads.`
        },
        {
          title: "Capítulo 3: Eliminando Objeções e Resistências",
          content: `Todo cliente criará objeções lógicas na hora de comprar. No Capítulo 3, abordamos como antecipar essas barreiras e respondê-las com empatia no funil 1 a 1, eliminando medos sobre preço, tempo e capacidade de execução.`
        },
        {
          title: "Capítulo 4: Métricas de Escala e Multiplicação",
          content: `Nesta fase final, apresentamos métricas realistas para avaliar seus ganhos semanalmente. Abordamos táticas de up-sell, pós-venda premium e a criação de esteiras de produtos para impulsionar e perpetuar o seu negócio no X1.`
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
