// Importa a biblioteca do Google Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Função principal para executar a automação
async function runAutomation() {
    try {
        // Carrega a chave da API a partir da variável de ambiente
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('A chave da API Gemini não foi encontrada nas variáveis de ambiente.');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Define o caminho do arquivo de comando
        const commandFilePath = path.join(__dirname, 'protocol', 'command.json');
        
        // Verifica se o arquivo de comando existe
        if (!fs.existsSync(commandFilePath)) {
            console.error(`Erro: Arquivo de comando não encontrado em ${commandFilePath}`);
            return;
        }

        // Lê o comando a partir do arquivo JSON
        const commandFileContent = fs.readFileSync(commandFilePath, 'utf-8');
        const command = JSON.parse(commandFileContent);
        const userPrompt = command.prompt;

        // Seção principal do nosso prompt para o modelo Gemini
        const prompt = `
        Você é um expert em marketing digital e desenvolvimento web. Sua missão é criar uma landing page HTML5 completa e responsiva com Tailwind CSS para capturar leads. A página deve ter uma aparência moderna e profissional, com uma paleta de cores agradável e elementos de design bem espaçados.

        A landing page deve incluir as seguintes seções:
        1.  **Cabeçalho:** Um cabeçalho com o nome do produto/serviço no canto superior esquerdo.
        2.  **Hero Section:** Uma seção de destaque com um título persuasivo e uma breve descrição.
        3.  **Formulário de Contato:** Um formulário de captura de leads com os campos "Nome", "Email" e um botão "Enviar" que deve mudar o texto para "Obrigado!" ao ser clicado. O formulário não precisa de funcionalidade de backend, apenas o comportamento visual do botão.
        4.  **Rodapé:** Um rodapé simples com informações de direitos autorais.

        O tema e o propósito da landing page são baseados no seguinte comando do usuário:
        "${userPrompt}"

        Seu output deve ser SOMENTE o código HTML completo e bem formatado, sem nenhum texto adicional ou explicações. Inclua todos os scripts e links necessários, como o link do Tailwind CSS. Use cores agradáveis e um bom design para os botões e formulário. Use a fonte 'Inter' importada via Google Fonts.
        `;

        console.log('Gerando a landing page com o modelo Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedHtml = response.text();

        // Salva o HTML gerado em um arquivo
        const outputFilePath = path.join(__dirname, 'index.html');
        fs.writeFileSync(outputFilePath, generatedHtml);
        console.log(`Landing page gerada e salva em ${outputFilePath}`);

        // Opcional: Mostra uma prévia do conteúdo gerado
        console.log('\n--- Conteúdo Gerado ---');
        console.log(generatedHtml.substring(0, 500) + '...'); // Mostra apenas os primeiros 500 caracteres
        console.log('\n----------------------');

    } catch (error) {
        console.error('Ocorreu um erro durante a automação:', error);
    }
}

// Executa a função