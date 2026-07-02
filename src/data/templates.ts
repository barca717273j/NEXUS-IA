import { Project, EbookContent, Research, OutreachGroup, Sale, Chapter } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Standard seed data for beautiful placeholder projects
export const SEED_PROJECTS: Project[] = [
  {
    id: "pro-1",
    name: "Método Liberdade Financeira 30D",
    niche: "Finanças Pessoais & Investimentos",
    objective: "Ensinar jovens profissionais a pouparem seus primeiros R$ 10.000 e começarem a investir do zero.",
    pages: 45,
    language: "Português",
    coverUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
    createdAt: "2026-06-10",
    ebook: {
      title: "O Despertar da Riqueza Inteligente",
      subtitle: "Como sair das dívidas, construir sua reserva de emergência e realizar seus primeiros investimentos em 30 dias.",
      summary: "Este guia prático foi desenhado para profissionais modernos que sentem que trabalham apenas para pagar contas. Através de um plano passo a passo, você aprenderá a reorganizar suas finanças, eliminar gargalos invisíveis de consumo e estruturar uma carteira de investimentos segura e rentável.",
      introduction: "Bem-vindo à sua nova realidade financeira. Se você chegou até aqui, é porque tomou a decisão consciente de não ser mais refém do dinheiro. A maioria das pessoas passa a vida inteira vendendo horas de trabalho por um salário que desaparece antes do dia 10. Este livro não é sobre fórmulas mágicas para enriquecer da noite para o dia, mas sobre um método testado para gerar liberdade real.",
      conclusion: "Parabéns por concluir esta jornada de transformação. Agora você possui o mapa completo e as chaves para sua autonomia financeira. Lembre-se de que a riqueza não é determinada pelo quanto você ganha, mas pelo quanto você retém e multiplica de forma consistente. O hábito é mais importante do que o valor inicial. Continue aplicando os princípios diariamente.",
      cta: "Quer acelerar seus resultados? Toque no link abaixo para se inscrever na nossa mentoria exclusiva e receber uma planilha personalizada de acompanhamento de investimentos.",
      chapters: [
        {
          title: "Capítulo 1: O Diagnóstico Financeiro de Precisão",
          content: "Para saber para onde ir, é preciso mapear exatamente onde você está hoje. O grande erro da maioria das pessoas é ignorar o saldo das faturas e evitar planilhas por medo da realidade. Neste capítulo, faremos um raio-x completo das suas despesas fixas e variáveis, identificando os 'vazamentos invisíveis' de capital — aquelas pequenas assinaturas esquecidas e juros que consomem até 25% do seu orçamento mensal sem que você perceba."
        },
        {
          title: "Capítulo 2: O Protocolo Antidívidas e Reserva Ágil",
          content: "Nenhuma carteira de investimentos prospera sobre solo instável. Se você possui juros acumulados, seu primeiro investimento é quitá-los. Aprenda a negociar dívidas com bancos reduzindo os juros em até 70% usando os canais corretos de ouvidoria. Em seguida, focaremos na construção de uma Reserva de Emergência equivalente a 6 meses do seu custo de vida, alocando-a em ativos de alta liquidez e segurança imediata."
        },
        {
          title: "Capítulo 3: O Primeiro Passo no Mercado de Ativos",
          content: "Desmistificando a Bolsa de Valores e o Tesouro Direto. Você descobrirá que investir não é um privilégio de milionários, e sim o caminho para se tornar um. Explicaremos detalhadamente a mecânica dos títulos de Renda Fixa (CDB, LCI, LCA) e como selecionar sua primeira corretora sem taxas abusivas, realizando seu primeiro aporte com foco em proteção inflacionária."
        },
        {
          title: "Capítulo 4: O Plano Consistente para os Primeiros R$ 10 Mil",
          content: "Como manter a disciplina e acelerar seus aportes. Dividiremos o objetivo de R$ 10.000 em metas semanais e mensais fáceis de monitorar. Apresentamos estratégias de renda extra rápida usando habilidades de copywriting e consultoria que você já possui hoje, permitindo aumentar sua capacidade de poupança mensal em até 40%."
        }
      ]
    },
    research: {
      avatar: {
        name: "Thiago Rocha",
        idealAudience: "Jovens profissionais CLT que recebem entre R$ 3.000 e R$ 6.000, sentem que estão estagnados e querem investir mas acham o mercado complexo.",
        age: "27 anos",
        gender: "Masculino",
        profession: "Analista de Tecnologia",
        income: "R$ 4.500/mês",
        city: "São Paulo",
        country: "Brasil",
        interests: ["Desenvolvimento Profissional", "Podcasts de Negócios", "Gadgets de Produtividade", "Viagens Econômicas"],
        pains: [
          "Sente frustração por ver o salário sumir rapidamente",
          "Medo de passar por imprevistos sem dinheiro guardado",
          "Ansiedade em relação à aposentadoria ou desemprego",
          "Acha que investir é muito arriscado e difícil de entender"
        ],
        dreams: [
          "Conquistar estabilidade e dormir sem preocupação financeira",
          "Pagar uma viagem internacional à vista, sem parcelas",
          "Ver o dinheiro render de verdade todos os meses",
          "Poder pedir demissão sem desespero para iniciar um negócio"
        ]
      },
      objections: [
        "Não tenho dinheiro para começar (Resolvido: método mostra como investir com R$ 30)",
        "Investir é muito arriscado (Resolvido: foco em ativos de renda fixa garantidos pelo FGC)",
        "Não tenho tempo para gerenciar isso (Resolvido: sistema automatizado de aportes que leva 10 min por mês)"
      ],
      tomDeVoz: "Inspirador, direto ao ponto, didático, firme e extremamente confiável.",
      palavrasConvertem: ["Liberdade", "Segurança", "Consistência", "Passo a passo", "Patrimônio", "Sem Dívidas", "Multiplicar"],
      promessas: [
        "Construa sua reserva de segurança e invista seus primeiros R$ 10 mil partindo do absoluto zero.",
        "Saia do ciclo de pagar contas e veja seu dinheiro render mais que a poupança em apenas 30 dias."
      ],
      beneficios: [
        "Planilha de controle financeiro automatizada integrada",
        "Passo a passo visual para abrir conta em corretora com segurança",
        "Lista de verificação de ativos seguros à prova de inflação"
      ],
      argumentos: [
        "O dinheiro guardado abaixo da inflação perde poder de compra diariamente. Deixar na poupança é perder patrimônio.",
        "A independência financeira não depende de herança, mas do método e consistência aplicada hoje."
      ]
    },
    x1: {
      facebook: {
        category: "Facebook",
        communities: [
          { name: "Investimentos para Iniciantes Brasil", description: "Grupo focado em trocar dúvidas sobre renda fixa e tesouro.", size: "45.000 membros" },
          { name: "Planejamento Financeiro Pessoal", description: "Fórum de apoio mútuo para orçamento doméstico.", size: "22.000 membros" }
        ],
        templateMessage: "Olá pessoal! Acabei de mapear um passo a passo completo sobre como organizei meu salário de R$ 4k para zerar minhas dívidas e fazer meu primeiro investimento no Tesouro. Coloquei tudo num guia super mastigado e direto ao ponto. Quem quiser entender o método e receber o PDF de graça, comenta EU QUERO aqui que mando inbox!"
      },
      telegram: {
        category: "Telegram",
        communities: [
          { name: "Canal Poupar & Investir", description: "Dicas rápidas diárias de economia e investimentos.", size: "12.500 inscritos" },
          { name: "Jovens Investidores BR", description: "Grupo de discussão sobre finanças corporativas e finanças pessoais.", size: "8.900 membros" }
        ],
        templateMessage: "Fala galera! Percebi que muita gente aqui quer começar a investir mas se sente perdida com tanta informação sobre ações e corretoras. Por isso, escrevi um ebook ensinando a focar no simples que funciona: como poupar os primeiros R$ 10k focado em renda fixa e segurança. Ficou muito prático. Vou liberar o PDF exclusivo para os membros daqui. Só me mandar uma mensagem direta."
      },
      whatsapp: {
        category: "WhatsApp",
        communities: [
          { name: "Grupo de Estudos: Finanças BR", description: "Foco em compartilhamento de planilhas e estudos de caso.", size: "230 participantes" },
          { name: "Networking & Finanças Sp", description: "Comunidade de profissionais de SP focados em crescimento pessoal.", size: "180 participantes" }
        ],
        templateMessage: "Bom dia pessoal do grupo! Sei que o foco aqui é networking, mas queria compartilhar que finalmente lancei meu ebook de finanças. É voltado especificamente para quem quer construir sua primeira reserva de emergência séria sem ter que parar de tomar seu café diário. Se alguém quiser dar uma olhada e me dar um feedback, estou enviando gratuitamente no privado!"
      },
      discord: {
        category: "Discord",
        communities: [
          { name: "Devs Investidores", description: "Servidor de profissionais tech que debatem sobre investimentos.", size: "3.200 membros" },
          { name: "Foco & Carreira Hub", description: "Comunidade focada em alta performance profissional e financeira.", size: "5.400 membros" }
        ],
        templateMessage: "E aí pessoal! Como desenvolvedores/analistas, a gente ganha bem mas às vezes não sabe fazer o dinheiro trabalhar pela gente. Eu estruturei um checklist de investimentos de alta liquidez e organizei num ebook bem direto (sem enrolação de coach). Tá livre de jargões técnicos. Deixei o PDF compartilhado no canal #recursos. Espero que ajude!"
      },
      reddit: {
        category: "Reddit",
        communities: [
          { name: "r/investimentos", description: "A maior comunidade de investimentos em língua portuguesa do Reddit.", size: "180.000 usuários" },
          { name: "r/financeiro", description: "Sub focado em planejamento, planilhas e finanças pessoais.", size: "28.000 usuários" }
        ],
        templateMessage: "[CONTEÚDO GRATUITO] Como saí do vermelho e guardei meus primeiros R$ 10k trabalhando como analista. Quero compartilhar com a comunidade o método prático de 4 passos que usei para otimizar meus gastos e sair do ciclo de ansiedade financeira. Montei um PDF ilustrado com o passo a passo completo. Link direto para leitura sem necessidade de e-mail no post."
      },
      forums: {
        category: "Fóruns",
        communities: [
          { name: "Portal Clube dos Poupadores", description: "Fórum nacional de debates financeiros independentes.", size: "50.000 visitas/mês" },
          { name: "Fórum de Finanças Básicas", description: "Espaço para tirar dúvidas básicas de contabilidade pessoal.", size: "15.000 usuários ativos" }
        ],
        templateMessage: "Prezados colegas de fórum. Criei um guia completo focado exclusivamente em quem busca segurança financeira imediata através da renda fixa descomplicada. O guia aborda desde a abertura correta de conta até simulações reais de rentabilidade contra a inflação. Gostaria muito da avaliação de vocês sobre a estrutura didática dos capítulos."
      }
    },
    milestones: {
      ebookCreated: true,
      researchCompleted: true,
      messagesReady: true,
      communitiesAnalyzed: true,
      firstPromoDone: true,
      firstSaleRegistered: true
    },
    sales: [
      { id: "sale-1", value: 47, date: "2026-06-15", note: "Primeira venda via grupo Telegram Finanças" },
      { id: "sale-2", value: 47, date: "2026-06-18", note: "Venda para membro do r/investimentos" },
      { id: "sale-3", value: 47, date: "2026-06-22", note: "Indicação direta de leitor satisfeito" },
      { id: "sale-4", value: 97, date: "2026-06-25", note: "Venda casada com planilha financeira premium" }
    ]
  },
  {
    id: "pro-2",
    name: "Manual de Nutrição Eficiente",
    niche: "Saúde, Emagrecimento & Bem-estar",
    objective: "Ajudar mães ocupadas a emagrecerem de 5 a 10kg sem dietas restritivas ou passar horas na cozinha.",
    pages: 50,
    language: "Português",
    coverUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
    createdAt: "2026-06-18",
    ebook: {
      title: "Nutrição Sem Culpa",
      subtitle: "Guia prático de reeducação alimentar e organização de marmitas para mulheres modernas com rotinas intensas.",
      summary: "Descubra como emagrecer de forma sustentável e saudável sem abrir mão das refeições em família. Este ebook traz estratégias realistas de planejamento alimentar semanal, receitas práticas prontas em 15 minutos e um manual de substituições inteligentes que aceleram o metabolismo sem privações extremas.",
      introduction: "Olá, guerreira. Se você é mãe, profissional, esposa e ainda precisa cuidar da casa, sabe que colocar-se em primeiro lugar é um desafio colossal. Provavelmente já tentou dietas restritivas que a deixaram cansada e irritada, apenas para recuperar todo o peso depois. Este livro foi escrito para quebrar esse ciclo definitivo. Você aprenderá que comer bem é libertador.",
      conclusion: "A reeducação alimentar não tem data de término porque é um estilo de vida definitivo. Você acabou de adquirir o conhecimento para nutrir seu corpo e o de quem você ama com facilidade e prazer. Não busque a perfeição diária, busque a constância. Celebre cada pequena escolha positiva.",
      cta: "Quer receber um cardápio customizado para suas necessidades individuais? Acesse o link abaixo para agendar uma consulta rápida de orientação nutricional online.",
      chapters: [
        {
          title: "Capítulo 1: O Metabolismo Feminino Desmistificado",
          content: "Compreenda como os hormônios femininos, o estresse cotidiano e a falta de sono de qualidade afetam o acúmulo de gordura corporal. Você aprenderá como pequenas alterações na ingestão de proteínas e fibras logo no café da manhã podem regular a saciedade e eliminar a compulsão por doces no final da tarde, regulando seu ciclo de energia."
        },
        {
          title: "Capítulo 2: Meal Prep Inteligente — O Segredo do Tempo",
          content: "Como preparar todas as refeições saudáveis da semana em apenas 2 horas no domingo. Mostraremos um guia de compras de supermercado focado em ingredientes versáteis e econômicos, técnicas corretas de congelamento para manter os nutrientes preservados e como organizar recipientes organizadores que facilitam a montagem rápida dos pratos diários."
        },
        {
          title: "Capítulo 3: Receitas Expressas e Saborosas",
          content: "Uma seleção de receitas práticas e nutritivas prontas em menos de 15 minutos que as crianças também vão adorar. Inclui opções de lanches portáteis para levar ao trabalho, jantares leves que promovem um sono reparador e opções saudáveis de sobremesas que satisfazem o desejo por açúcar sem prejudicar o progresso."
        }
      ]
    },
    research: {
      avatar: {
        name: "Letícia Mendes",
        idealAudience: "Mães ocupadas de 30 a 45 anos que conciliam trabalho e família, sentem-se sem energia e insatisfeitas com o corpo após a gestação.",
        age: "36 anos",
        gender: "Feminino",
        profession: "Coordenadora Pedagógica",
        income: "R$ 5.200/mês",
        city: "Belo Horizonte",
        country: "Brasil",
        interests: ["Rotina Materna", "Culinária Prática", "Organização Doméstica", "Bem-estar Holístico"],
        pains: [
          "Falta total de tempo para cozinhar pratos saudáveis e complexos",
          "Baixa autoestima e roupas que não servem mais",
          "Cansaço extremo ao final do dia para praticar exercícios",
          "Sensação de culpa por comer doces devido ao estresse"
        ],
        dreams: [
          "Voltar a usar suas roupas favoritas com confiança",
          "Ter energia de sobra para brincar com os filhos após o trabalho",
          "Estabelecer hábitos alimentares saudáveis para toda a família",
          "Sentir-se bem, ativa e bonita em frente ao espelho"
        ]
      },
      objections: [
        "Não tenho tempo para cozinhar (Resolvido: receitas de 15 minutos e técnica de marmitas de 2h)",
        "Comer saudável é muito caro (Resolvido: lista de supermercado focada em alimentos básicos e acessíveis)",
        "Minha família não vai comer (Resolvido: receitas adaptadas ao paladar infantil e adulto de forma saborosa)"
      ],
      tomDeVoz: "Acolhedor, empático, encorajador, maternal e focado na praticidade cotidiana.",
      palavrasConvertem: ["Praticidade", "Energia", "Leveza", "Sem Culpa", "Nutrição", "Organização semanal", "Saúde Integral"],
      promessas: [
        "Perca de 5 a 10kg em até 6 semanas sem deixar de comer o que gosta ou gastar horas na cozinha.",
        "Recupere sua autoestima e vitalidade com um método prático de nutrição feito para mães reais."
      ],
      beneficios: [
        "Guia completo de compras inteligente e econômico",
        "Tabela de substituições práticas para refeições rápidas",
        "Grupo de apoio no WhatsApp para compartilhar receitas"
      ],
      argumentos: [
        "Fazer dietas restritivas desacelera o metabolismo e gera efeito sanfona. A chave é a constância da reeducação prática.",
        "Seu tempo é precioso. Planejar a alimentação semanal economiza dinheiro de delivery e horas de estresse diário."
      ]
    },
    x1: {
      facebook: {
        category: "Facebook",
        communities: [
          { name: "Mães Unidas e Saudáveis", description: "Grupo de apoio a mães focadas em emagrecimento pós-parto.", size: "18.000 membros" },
          { name: "Marmitas & Organização Semanal", description: "Comunidade focada em compartilhar ideias de preparação alimentar.", size: "35.000 membros" }
        ],
        templateMessage: "Oi mamães! Como vcs se organizam para comer bem na correria? Eu estava me sentindo super cansada e com a autoestima baixa, até que criei um método de meal prep onde resolvo toda a alimentação saudável da semana em 2 horas no domingo. Organize e escrevi esse guia prático de receitas de 15 min. Se alguma mãe quiser receber o guia gratuitamente no inbox para testar com as crianças, me manda um oi ou comenta abaixo!"
      },
      telegram: {
        category: "Telegram",
        communities: [
          { name: "Nutrição Prática e Saudável", description: "Dicas de receitas rápidas para o dia a dia.", size: "8.400 inscritos" },
          { name: "Grupo de Mães Modernas", description: "Espaço para debates gerais sobre rotina de maternidade.", size: "10.200 membros" }
        ],
        templateMessage: "Olá queridas! Sei que a rotina de mãe é exaustiva e quase nunca sobra tempo para cuidarmos de nós mesmas. Eu montei um ebook curto e prático chamado 'Nutrição Sem Culpa' com receitas rápidas de 15 minutos e estratégias para organizar as refeições da semana sem complicações. Quero liberar algumas cópias gratuitas para as participantes daqui do grupo. Se tiver interesse em mudar seus hábitos com facilidade, me manda um direct."
      },
      whatsapp: {
        category: "WhatsApp",
        communities: [
          { name: "Grupo de Apoio: Vida Leve", description: "Troca de fotos de pratos saudáveis e incentivo diário.", size: "120 participantes" },
          { name: "Mães da Escola - Apoio", description: "Comunidade interna de mães de alunos de Belo Horizonte.", size: "95 participantes" }
        ],
        templateMessage: "Bom dia meninas! Desculpem o incômodo, mas sei que muitas de nós reclamamos de cansaço e falta de tempo para cozinhar. Eu estruturei um manual prático com dicas ótimas de substituições inteligentes e receitas expressas que meus filhos amaram. Consegui compilar tudo num PDF bem bonito e clean. Quem quiser dar uma olhada para facilitar a semana, me avisa que mando com prazer no particular!"
      },
      discord: {
        category: "Discord",
        communities: [
          { name: "Mulheres Tech & Bem-estar", description: "Servidor de desenvolvedoras e gestoras discutindo saúde.", size: "1.800 membros" },
          { name: "Lifestyle & Organização", description: "Espaço dedicado a debater rotina, foco e nutrição saudável.", size: "2.300 membros" }
        ],
        templateMessage: "E aí gurias! Como conciliar as reuniões diárias com alimentação saudável? Escrevi um ebook focando exclusivamente no planejamento semanal de marmitas e lanches rápidos que salvam a minha rotina em dias de entrega apertada. Sem ingredientes caros ou processos mirabolantes. Compartilhei o arquivo PDF direto na sala #lifestyle-recursos para quem quiser ler."
      },
      reddit: {
        category: "Reddit",
        communities: [
          { name: "r/vidasaudavel", description: "Comunidade brasileira focada em hábitos saudáveis de vida.", size: "12.000 membros" },
          { name: "r/cozinha", description: "Compartilhamento de dicas, receitas e truques gastronômicos.", size: "14.000 membros" }
        ],
        templateMessage: "[GUIA DE MEAL PREP] Como organizo a alimentação saudável de uma família de 4 pessoas em apenas 2 horas semanais. Quero dividir com vcs a planilha de compras e o fluxo de cozinha que montei para evitar gastar dinheiro com junk food e economizar mais de R$ 400 por mês em feira. Disponibilizei o ebook completo formatado de graça em anexo."
      },
      forums: {
        category: "Fóruns",
        communities: [
          { name: "Clube da Maternidade Saudável", description: "Fórum de discussão sobre aleitamento, nutrição e bem-estar materno.", size: "22.000 usuários" },
          { name: "Fórum Fitness Feminino BR", description: "Debates focados em hipertrofia e emagrecimento feminino.", size: "8.500 membros" }
        ],
        templateMessage: "Olá a todas. Elaborei um material didático voltado exclusivamente para a reeducação alimentar prática em rotinas sobrecarregadas de mães e profissionais. O livro evita radicalismos alimentares e ensina as bases para reequilibrar macronutrientes usando alimentos simples da cesta básica. Ficarei imensamente grata pelo feedback de vcs sobre as receitas expressas do Capítulo 3."
      }
    },
    milestones: {
      ebookCreated: true,
      researchCompleted: true,
      messagesReady: true,
      communitiesAnalyzed: true,
      firstPromoDone: false,
      firstSaleRegistered: false
    },
    sales: []
  }
];

// Fallback generator algorithm to write genuine, textbook-grade book contents for ANY custom niche
export function generateProject(
  name: string,
  niche: string,
  objective: string,
  pages: number,
  language: string,
  customCoverUrl?: string,
  projType: "ebook" | "landing_page" | "site" = "ebook"
): Project {
  // Clean inputs
  const cleanName = name.trim() || "Nova Ideia de Ebook";
  const cleanNiche = niche.trim() || "Desenvolvimento Geral";
  const cleanObjective = objective.trim() || "Ajudar pessoas a atingirem alta performance em sua área de atuação.";
  const pagesCount = Number(pages) || 30;
  const cleanLanguage = language.trim() || "Português";

  // Pick a thematic image from Unsplash depending on the niche
  let coverUrl = customCoverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800";
  const nicheLower = cleanNiche.toLowerCase();
  if (nicheLower.includes("emagrecer") || nicheLower.includes("saúde") || nicheLower.includes("nutri") || nicheLower.includes("fit") || nicheLower.includes("dieta")) {
    coverUrl = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800";
  } else if (nicheLower.includes("dinheiro") || nicheLower.includes("finança") || nicheLower.includes("venda") || nicheLower.includes("invest") || nicheLower.includes("rico") || nicheLower.includes("negócio")) {
    coverUrl = "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800";
  } else if (nicheLower.includes("marketing") || nicheLower.includes("digital") || nicheLower.includes("tráfego") || nicheLower.includes("vendedor") || nicheLower.includes("copy")) {
    coverUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800";
  } else if (nicheLower.includes("program") || nicheLower.includes("código") || nicheLower.includes("tech") || nicheLower.includes("web") || nicheLower.includes("software")) {
    coverUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800";
  } else if (nicheLower.includes("mental") || nicheLower.includes("mindset") || nicheLower.includes("produti") || nicheLower.includes("foco") || nicheLower.includes("tempo")) {
    coverUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800";
  }

  // Derive title elements from niche and objective
  const keywords = cleanObjective.split(" ").filter(w => w.length > 4).map(w => w.replace(/[.,]/g, ""));
  const keyword1 = keywords[0] || "Sucesso";
  const keyword2 = keywords[1] || "Estratégia";

  const title = cleanName;
  const subtitle = `Como atingir seu objetivo de ${cleanObjective.toLowerCase().replace(/ajudar a|ensinar a|ajudar|ensinar/g, "").trim()} com um plano prático, consistente e validado passo a passo.`;
  const summary = `Este manual prático foi cuidadosamente estruturado para guiar você rumo à maestria em ${cleanNiche}. Ele une os fundamentos teóricos de aplicação rápida aos planos de ação diários, permitindo que você supere a estagnação e atinja resultados expressivos em poucos dias, livre de complexidades ou jargões desnecessários.`;
  const introduction = `Seja muito bem-vindo ao ponto de virada da sua jornada. Este livro foi projetado com uma única missão: ser o seu manual operacional definitivo. Se você está cansado de teorias vazias, cursos infinitos e falta de direcionamento prático, as próximas páginas contêm o plano estratégico exato para revolucionar seus resultados.`;
  const conclusion = `Chegamos ao final deste guia, mas este é apenas o começo da sua nova fase de realizações. O conhecimento sem aplicação é apenas potencial desperdiçado. Agora, a responsabilidade de executar cada etapa estruturada está em suas mãos. Confie no método, mantenha a constância e os resultados serão inevitáveis.`;
  const cta = `Quer dar o próximo passo rumo à excelência? Acesse nosso canal exclusivo de suporte ao leitor e receba atualizações e materiais complementares diretamente no seu e-mail.`;

  // Build 4 solid textbook-grade chapters based on the niche input
  const chapters: Chapter[] = [
    {
      title: "Capítulo 1: O Alicerce Oculto do Sucesso",
      content: `Para construir qualquer projeto duradouro em ${cleanNiche}, é vital compreender os fatores invisíveis que determinam o sucesso ou o fracasso. A maioria das pessoas falha porque tenta pular as etapas de fundamentação operacional básica. Analisaremos de forma pragmática os principais pilares estruturais que sustentam essa área, oferecendo um diagnóstico profundo para identificar e corrigir suas deficiências críticas de forma imediata.`
    },
    {
      title: `Capítulo 2: Estratégias Avançadas para ${cleanName}`,
      content: `Agora que dominamos a base conceitual, entraremos no plano de ação focado em ${cleanObjective.toLowerCase().replace(/ajudar a|ensinar a/g, "")}. Dissecaremos as ferramentas práticas necessárias para catalisar seu desenvolvimento, incluindo um cronograma metodológico diário projetado para maximizar sua eficiência sem causar sobrecarga cognitiva ou estresse operacional.`
    },
    {
      title: `Capítulo 3: Eliminando Gargalos e Resistências`,
      content: `Mesmo os melhores métodos falham se não anteciparmos os obstáculos. Neste capítulo, abordaremos de maneira realista os erros mais comuns cometidos por iniciantes e profissionais experientes neste nicho. Você aprenderá táticas de blindagem mental e inteligência analítica para superar a procrastinação, eliminar distrações e manter a constância diária de execução.`
    },
    {
      title: "Capítulo 4: Do Planejamento aos Resultados Consolidados",
      content: "Como medir, auditar e expandir seus resultados a médio e longo prazo. Este capítulo apresenta métricas realistas para avaliar seu progresso semanal de forma tangível, estratégias comprovadas para manter o ímpeto criativo e as melhores formas de multiplicar seus retornos consolidando sua primeira vitória expressiva de mercado."
    }
  ];

  // Intelligence research cards
  const avatarName = cleanLanguage === "Inglês" ? "John Miller" : "Ricardo Santos";
  const avatarDemographics = {
    name: avatarName,
    idealAudience: `Pessoas interessadas em obter resultados de alta performance em ${cleanNiche}, que enfrentam dificuldades para executar um plano estruturado por conta própria.`,
    age: "32 anos",
    gender: cleanLanguage === "Inglês" ? "Male" : "Masculino",
    profession: cleanLanguage === "Inglês" ? "Professional" : "Profissional Liberal",
    income: "R$ 4.800/mês",
    city: "Curitiba",
    country: "Brasil",
    interests: ["Produtividade", "Desenvolvimento Pessoal", "Estratégia de Negócios", "Auto-educação"],
    pains: [
      `Dificuldade severa em organizar as etapas de evolução em ${cleanNiche}`,
      "Frustração constante decorrente de excesso de informações rasas",
      "Perda de foco e falta de apoio estruturado para continuar",
      "Medo terrível de investir recursos e tempo em métodos ineficazes"
    ],
    dreams: [
      "Alcançar o domínio profissional e ser reconhecido como referência",
      "Garantir a tranquilidade e a segurança que um método validado oferece",
      "Ver a transformação concreta de suas ideias em resultados práticos",
      "Liberdade de escolha e tempo de qualidade com foco no que realmente importa"
    ]
  };

  const research: Research = {
    avatar: avatarDemographics,
    objections: [
      "Isso realmente funciona para mim? (Resolvido: metodologia simplificada e testada passo a passo)",
      "Não tenho conhecimento prévio (Resolvido: didática construída do básico até as estratégias avançadas)",
      "Não tenho tempo livre (Resolvido: estruturado em módulos curtos de aplicação diária de 15 minutos)"
    ],
    tomDeVoz: "Extremamente profissional, analítico, focado na resolução lógica de problemas e incentivador.",
    palavrasConvertem: ["Evolução", "Método Prático", "Alta Performance", "Resultados", "Estrutura", "Consistência", "Autonomia"],
    promessas: [
      `Aprenda o método definitivo de ${cleanNiche} para atingir seu objetivo estratégico em tempo recorde.`,
      `Transforme sua abordagem operacional e conquiste a autonomia desejada através de um cronograma de 30 dias.`
    ],
    beneficios: [
      "Cronograma operacional detalhado de aplicação imediata",
      "Modelos mentais validados prontos para uso diário",
      "Checklists de auditoria interna de progresso pessoal"
    ],
    argumentos: [
      "Permanecer estagnado no mesmo patamar consome seu ativo mais valioso: o tempo de vida. Investir em conhecimento estruturado encurta caminhos.",
      "A falta de um método organizado gera retrabalho constante e dispersão de energia. Domine o processo lógico hoje."
    ]
  };

  // Create outreach groups
  const x1 = {
    facebook: {
      category: "Facebook",
      communities: [
        { name: `${cleanNiche} - Brasil`, description: "Grupo nacional de intercâmbio de conhecimento focado nesse nicho.", size: "12.000 membros" },
        { name: `Estudos & Práticas de ${keyword1}`, description: "Fórum de praticantes que compartilham lições aprendidas.", size: "6.500 membros" }
      ],
      templateMessage: `Olá pessoal do grupo! Queria compartilhar com vcs que acabei de estruturar um guia prático focado em resolver de forma definitiva as principais dificuldades de ${cleanNiche}. Desenvolvi um manual focado exclusivamente na prática de quem quer evoluir sem enrolação de teorias vazias. Consegui exportar o conteúdo em um PDF super organizado. Quem tiver interesse em ler o material de graça para dar um feedback sincero, comenta EU QUERO aqui que mando inbox com prazer!`
    },
    telegram: {
      category: "Telegram",
      communities: [
        { name: `Canal Oficial ${cleanNiche}`, description: "Informativos e atualizações sobre tendências do setor.", size: "4.800 inscritos" },
        { name: `Debates e Dúvidas - ${keyword1}`, description: "Chat ativo para sanar dúvidas operacionais dos membros.", size: "3.200 membros" }
      ],
      templateMessage: `Olá pessoal! Notei que muita gente aqui no canal tem dúvidas sobre qual o melhor caminho estruturado para dominar ${cleanNiche}. Por isso, passei as últimas semanas compilando um manual contendo as respostas para os principais gargalos que travam o progresso de quem está tentando evoluir. O material está em formato PDF direto e limpo. Vou liberar algumas cópias de cortesia para o pessoal deste grupo. Quem tiver interesse, por favor me envie uma mensagem no privado.`
    },
    whatsapp: {
      category: "WhatsApp",
      communities: [
        { name: `Grupo de Estudos: ${keyword1}`, description: "Foco exclusivo em soluções de alta aplicabilidade diária.", size: "110 participantes" },
        { name: `Networking e Alta Performance`, description: "Compartilhamento de conquistas e networking estratégico.", size: "140 participantes" }
      ],
      templateMessage: `Olá amigos do grupo! Gostaria de compartilhar que finalmente finalizei meu novo material didático direcionado a sanar as maiores objeções e entraves em ${cleanNiche}. Trata-se de um livro eletrônico focado estritamente em um plano prático de aplicação fácil na rotina. Se alguém quiser receber o PDF de forma gratuita para me ajudar a avaliar a didática, é só me mandar uma mensagem direta que envio imediatamente!`
    },
    discord: {
      category: "Discord",
      communities: [
        { name: `Comunidade de Foco & Evolução`, description: "Servidor focado em impulsionar o aprendizado conjunto.", size: "2.100 membros" },
        { name: `Estudos Avançados - ${keyword1}`, description: "Canais dedicados a debater ferramentas de produtividade.", size: "1.500 membros" }
      ],
      templateMessage: `Fala pessoal! Para quem quer aprofundar de verdade no assunto, montei um ebook bem enxuto ensinando os pilares operacionais de ${cleanNiche} e como se organizar com um método diário de progresso consistente. Evitei qualquer tipo de jargão acadêmico para focar apenas no que traz retorno real. Disponibilizei o arquivo PDF no canal #materiais. Deixem suas opiniões por lá!`
    },
    reddit: {
      category: "Reddit",
      communities: [
        { name: `r/${keyword1.toLowerCase()}`, description: `Subreddit focado em compartilhar conhecimentos de ${keyword1}.`, size: "8.500 leitores" },
        { name: "r/autodesenvolvimento", description: "Comunidade focada em técnicas de aprendizado ativo e hábitos saudáveis.", size: "35.000 usuários" }
      ],
      templateMessage: `[MANUAL PRÁTICO GRATUITO] Como montei um fluxo estruturado para otimizar os processos de ${cleanNiche} com 15 min diários. Quero apresentar para a comunidade o framework analítico de 4 etapas que desenhei para organizar a evolução pessoal e evitar dispersão mental. Compilei todos os checklists e estratégias no formato de um ebook PDF gratuito de leitura direta. Link compartilhado no corpo do post.`
    },
    forums: {
      category: "Fóruns",
      communities: [
        { name: "Fórum de Estudos Práticos BR", description: "Fórum nacional voltado a debater soluções práticas do mercado.", size: "10.000 usuários" },
        { name: `Clube dos Entusiastas de ${keyword1}`, description: "Ambiente independente para debates construtivos de alta performance.", size: "4.200 membros" }
      ],
      templateMessage: `Saudações a todos os membros. Desenvolvi um guia analítico direcionado especificamente a quem busca maior autonomia prática em ${cleanNiche}. O ebook aborda soluções funcionais para contornar a estagnação e organizar de forma lógica os passos de evolução cotidiana. Seria um imenso privilégio receber as considerações técnicas de vcs a respeito dos fluxos recomendados no Capítulo 2.`
    }
  };

  const landingPageContent = {
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
  };

  const siteContent = {
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
  };

  const project: Project = {
    id: generateId(),
    type: projType,
    name: cleanName,
    niche: cleanNiche,
    objective: cleanObjective,
    pages: pagesCount,
    language: cleanLanguage,
    coverUrl,
    createdAt: new Date().toISOString().split("T")[0],
    ebook: {
      title,
      subtitle,
      summary,
      introduction,
      conclusion,
      cta,
      chapters
    },
    research,
    landingPage: projType === "landing_page" ? landingPageContent : undefined,
    site: projType === "site" ? siteContent : undefined,
    x1,
    milestones: {
      ebookCreated: projType === "ebook",
      researchCompleted: true,
      messagesReady: true,
      communitiesAnalyzed: true,
      firstPromoDone: false,
      firstSaleRegistered: false
    },
    sales: []
  };

  return project;
}
