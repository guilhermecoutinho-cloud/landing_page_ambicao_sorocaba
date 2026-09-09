/**
 * CONFIGURAÇÃO GERAL - AMBIÇÃO EM NEGÓCIOS
 * 
 * Este arquivo centraliza os dados dinâmicos da landing page e a integração com o CRM.
 * O time de marketing pode alterar o Webhook do CRM, número do WhatsApp,
 * datas, local e imagens diretamente aqui.
 */

const AMBICAO_CONFIG = {
  // Informações Oficiais do Evento
  evento: {
    nome: "Ambição em Negócios",
    edicao: "Edição Presencial • Sorocaba",
    data: "06 de Outubro",
    dataISO: "2026-10-06",
    cidade: "Sorocaba, SP",
    local: "Empresarial Bandeira",
    capacidadeMaxima: 250,
    metaParticipantes: 150,
    perfilPublico: "Empresários com faturamento anual a partir de R$ 5 milhões",
  },

  // Integração Direta com UNNICA CRM (ou Webhook / Automação)
  crm: {
    // URL oficial do Webhook do UNNICA CRM com o seu token:
    webhookUrl: "https://webhook.unnica.com.br/functions/v1/flow-webhook-receive?token=whk_beN75hOpcArDyrnC6sHx0FIYAigShQ1w", 
    
    // WhatsApp do time comercial / consultor que receberá o contato
    // Formato com DDI (55) + DDD + Número:
    whatsappNumero: "5515999999999",
    
    // Mensagem inicial automática que abre no WhatsApp do visitante
    whatsappMensagem: "Olá! Acabei de aplicar na landing page do Ambição em Negócios e gostaria de receber a condição especial.",

    // Se quiser redirecionar para uma página de obrigado após o envio, insira a URL aqui.
    // Deixe vazio ("") para exibir o modal de confirmação com botão de WhatsApp.
    redirectUrl: ""
  },

  // Opções do Formulário de Qualificação
  formulario: {
    faixasFaturamento: [
      "Até R$ 50.000",
      "R$ 50.000 a R$ 100.000",
      "R$ 100.000 a R$ 250.000",
      "R$ 250.000 a R$ 500.000",
      "Acima de R$ 500.000"
    ],
    faixasColaboradores: [
      "1 a 5 colaboradores",
      "6 a 15 colaboradores",
      "16 a 50 colaboradores",
      "Mais de 50 colaboradores"
    ]
  },

  // Fotos e Recursos Visuais (Substitua pelos caminhos dos arquivos reais quando disponíveis)
  imagens: {
    logo: "id/Logo.png",
    heroDestaque: "id/palestrantes_hero_blended.png",
    videoThumbnail: "", // ex: "assets/images/video-thumb.jpg"
    lilianCarmo: "",  // ex: "assets/images/lilian-carmo.png"
    atilaAbreu: "",   // ex: "assets/images/atila-abreu.png"
    lasaroDoCarmo: "",// ex: "assets/images/lasaro-do-carmo.png"
    experiencias: {
      pitStop: "",    // ex: "assets/images/pitstop.jpg"
      kart: "",       // ex: "assets/images/kart.jpg"
      bandeira: ""    // ex: "assets/images/bandeira.jpg"
    },
    galeriaAmbiente: [
      // Fotos reais de eventos anteriores da Capital Upgrade
    ]
  },

  // Redes Sociais Oficiais
  redesSociais: {
    instagram: "",
    linkedin: ""
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AMBICAO_CONFIG;
}
