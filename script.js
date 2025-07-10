// Estado global do formulário
let formState = {
    selectedService: null,
    currentStep: 'service',
    userData: {},
    questionAnswers: {}
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    // Event listeners para seleção de serviço
    const serviceRadios = document.querySelectorAll('input[name="service"]');
    const btnNextService = document.getElementById('btn-next-service');
    
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            formState.selectedService = this.value;
            btnNextService.disabled = false;
        });
    });
    
    // Event listener para botão continuar da seleção de serviço
    btnNextService.addEventListener('click', function() {
        handleServiceSelection();
    });
    
    // Event listener para botão de envio dos dados
    document.getElementById('btn-submit').addEventListener('click', function() {
        handleDataSubmission();
    });
    
    // Event listener para botão de reiniciar
    document.getElementById('btn-restart').addEventListener('click', function() {
        restartForm();
    });
    
    // Máscaras para os campos
    setupInputMasks();
}

function setupInputMasks() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = value;
    });
    
    // Máscara para WhatsApp
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        this.value = value;
    });
}

function handleServiceSelection() {
    switch(formState.selectedService) {
        case 'fgts':
            showFGTSMessage();
            break;
        case 'inss':
            showINSSQuestions();
            break;
        case 'clt':
            showCLTQuestions();
            break;
        case 'bolsa-familia':
            showBolsaFamiliaQuestions();
            break;
        case 'siape':
            showDataForm();
            break;
        default:
            console.error('Serviço não reconhecido');
    }
}

function showFGTSMessage() {
    const resultContent = `
        <div class="result-message result-info">
            <h3>Antecipe seu FGTS em até 3 minutos!</h3>
            <p>Acesse o link abaixo para antecipar seu FGTS de forma rápida e segura:</p>
            <p><a href="https://link.icred.app/NWl6QzL" target="_blank">https://link.icred.app/NWl6QzL</a></p>
        </div>
    `;
    showResult(resultContent);
}

function showINSSQuestions() {
    const questionsHTML = `
        <h2>Algumas perguntas sobre seu benefício INSS</h2>
        <div class="question-container">
            <h3>Seu benefício é de representante legal?</h3>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="inss-representante" value="sim">
                    Sim
                </label>
                <label class="radio-option">
                    <input type="radio" name="inss-representante" value="nao">
                    Não
                </label>
            </div>
        </div>
        <button type="button" id="btn-next-inss" class="btn-primary" disabled>Continuar</button>
    `;
    
    showQuestionsStep(questionsHTML);
    
    // Event listeners para as perguntas do INSS
    const inssRadios = document.querySelectorAll('input[name="inss-representante"]');
    const btnNext = document.getElementById('btn-next-inss');
    
    inssRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            formState.questionAnswers.inssRepresentante = this.value;
            btnNext.disabled = false;
        });
    });
    
    btnNext.addEventListener('click', function() {
        if (formState.questionAnswers.inssRepresentante === 'nao') {
            showDataForm();
        } else {
            showINSSAgeQuestion();
        }
    });
}

function showINSSAgeQuestion() {
    const questionsHTML = `
        <h2>Idade do titular do benefício</h2>
        <div class="question-container">
            <h3>Qual a idade do titular?</h3>
            <div class="form-group">
                <input type="number" id="titular-idade" min="0" max="120" placeholder="Digite a idade">
            </div>
        </div>
        <button type="button" id="btn-check-age" class="btn-primary">Verificar</button>
    `;
    
    showQuestionsStep(questionsHTML);
    
    document.getElementById('btn-check-age').addEventListener('click', function() {
        const idade = parseInt(document.getElementById('titular-idade').value);
        
        if (!idade) {
            alert('Por favor, informe a idade do titular.');
            return;
        }
        
        if (idade < 4 || idade > 14) {
            const resultContent = `
                <div class="result-message result-error">
                    <h3>Não aprovamos para essa idade</h3>
                    <p>Infelizmente, não aprovamos empréstimos para titulares com idade abaixo de 4 anos ou acima de 14 anos quando se trata de representante legal.</p>
                </div>
            `;
            showResult(resultContent);
        } else {
            showDataForm();
        }
    });
}

function showCLTQuestions() {
    const questionsHTML = `
        <h2>Algumas perguntas sobre seu emprego</h2>
        <div class="question-container">
            <h3>Quantos meses você trabalha na mesma empresa?</h3>
            <div class="form-group">
                <input type="number" id="meses-empresa" min="0" max="600" placeholder="Digite o número de meses">
            </div>
        </div>
        <button type="button" id="btn-check-months" class="btn-primary">Verificar</button>
    `;
    
    showQuestionsStep(questionsHTML);
    
    document.getElementById('btn-check-months').addEventListener('click', function() {
        const meses = parseInt(document.getElementById('meses-empresa').value);
        
        if (!meses) {
            alert('Por favor, informe quantos meses trabalha na empresa.');
            return;
        }
        
        if (meses < 6) {
            const resultContent = `
                <div class="result-message result-error">
                    <h3>Tempo de empresa insuficiente</h3>
                    <p>Não aprovamos empréstimos para quem tem menos de 6 meses de empresa.</p>
                </div>
            `;
            showResult(resultContent);
        } else {
            showCLTLoanQuestion();
        }
    });
}

function showCLTLoanQuestion() {
    const questionsHTML = `
        <h2>Empréstimos existentes</h2>
        <div class="question-container">
            <h3>Você já tem algum empréstimo CLT sendo descontado?</h3>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="clt-emprestimo" value="sim">
                    Sim
                </label>
                <label class="radio-option">
                    <input type="radio" name="clt-emprestimo" value="nao">
                    Não
                </label>
            </div>
        </div>
        <button type="button" id="btn-next-clt" class="btn-primary" disabled>Continuar</button>
    `;
    
    showQuestionsStep(questionsHTML);
    
    const cltRadios = document.querySelectorAll('input[name="clt-emprestimo"]');
    const btnNext = document.getElementById('btn-next-clt');
    
    cltRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            formState.questionAnswers.cltEmprestimo = this.value;
            btnNext.disabled = false;
        });
    });
    
    btnNext.addEventListener('click', function() {
        if (formState.questionAnswers.cltEmprestimo === 'sim') {
            const resultContent = `
                <div class="result-message result-error">
                    <h3>Limite de empréstimos atingido</h3>
                    <p>Só aprovamos um empréstimo por CPF. Como você já possui um empréstimo CLT sendo descontado, não é possível aprovar um novo.</p>
                </div>
            `;
            showResult(resultContent);
        } else {
            showDataForm();
        }
    });
}

function showBolsaFamiliaQuestions() {
    const questionsHTML = `
        <h2>Informações sobre o Bolsa Família</h2>
        <div class="question-container">
            <h3>Qual o valor que recebe do benefício Bolsa Família?</h3>
            <div class="form-group">
                <input type="number" id="valor-bolsa" min="0" step="0.01" placeholder="Digite o valor em reais">
            </div>
        </div>
        <button type="button" id="btn-check-valor" class="btn-primary">Verificar</button>
    `;
    
    showQuestionsStep(questionsHTML);
    
    document.getElementById('btn-check-valor').addEventListener('click', function() {
        const valor = parseFloat(document.getElementById('valor-bolsa').value);
        
        if (!valor) {
            alert('Por favor, informe o valor do benefício.');
            return;
        }
        
        if (valor < 400) {
            const resultContent = `
                <div class="result-message result-error">
                    <h3>Valor do benefício insuficiente</h3>
                    <p>Não aprovamos empréstimos para quem recebe menos que R$ 400,00 do Bolsa Família.</p>
                </div>
            `;
            showResult(resultContent);
        } else {
            showBolsaFamiliaAppQuestion();
        }
    });
}

function showBolsaFamiliaAppQuestion() {
    const questionsHTML = `
        <h2>Forma de recebimento</h2>
        <div class="question-container">
            <h3>Você recebe através do Caixa Tem ou do APP da Caixa?</h3>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="bolsa-app" value="caixa-tem">
                    Caixa Tem
                </label>
                <label class="radio-option">
                    <input type="radio" name="bolsa-app" value="app-caixa">
                    APP da Caixa
                </label>
            </div>
        </div>
        <button type="button" id="btn-next-app" class="btn-primary" disabled>Continuar</button>
    `;
    
    showQuestionsStep(questionsHTML);
    
    const appRadios = document.querySelectorAll('input[name="bolsa-app"]');
    const btnNext = document.getElementById('btn-next-app');
    
    appRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            formState.questionAnswers.bolsaApp = this.value;
            btnNext.disabled = false;
        });
    });
    
    btnNext.addEventListener('click', function() {
        if (formState.questionAnswers.bolsaApp === 'app-caixa') {
            const resultContent = `
                <div class="result-message result-error">
                    <h3>Forma de recebimento não aceita</h3>
                    <p>Só aprovamos empréstimos para quem recebe o Bolsa Família no CAIXA TEM.</p>
                </div>
            `;
            showResult(resultContent);
        } else {
            showBolsaFamiliaLoanQuestion();
        }
    });
}

function showBolsaFamiliaLoanQuestion() {
    const questionsHTML = `
        <h2>Empréstimos existentes</h2>
        <div class="question-container">
            <h3>Você já tem algum empréstimo sendo descontado de seu Caixa Tem?</h3>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="bolsa-emprestimo" value="sim">
                    Sim
                </label>
                <label class="radio-option">
                    <input type="radio" name="bolsa-emprestimo" value="nao">
                    Não
                </label>
            </div>
        </div>
        <button type="button" id="btn-next-bolsa" class="btn-primary" disabled>Continuar</button>
    `;
    
    showQuestionsStep(questionsHTML);
    
    const bolsaRadios = document.querySelectorAll('input[name="bolsa-emprestimo"]');
    const btnNext = document.getElementById('btn-next-bolsa');
    
    bolsaRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            formState.questionAnswers.bolsaEmprestimo = this.value;
            btnNext.disabled = false;
        });
    });
    
    btnNext.addEventListener('click', function() {
        if (formState.questionAnswers.bolsaEmprestimo === 'sim') {
            const resultContent = `
                <div class="result-message result-error">
                    <h3>Empréstimo já existente</h3>
                    <p>Não aprovamos empréstimos para quem já possui empréstimo sendo descontado do CAIXA TEM.</p>
                </div>
            `;
            showResult(resultContent);
        } else {
            showDataForm();
        }
    });
}

function showQuestionsStep(html) {
    const questionsStep = document.getElementById('step-questions');
    questionsStep.innerHTML = html;
    showStep('questions');
}

function showDataForm() {
    showStep('data');
}

function showStep(stepName) {
    // Esconder todas as etapas
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Mostrar a etapa solicitada
    const targetStep = document.getElementById(`step-${stepName}`);
    if (targetStep) {
        targetStep.classList.add('active');
        formState.currentStep = stepName;
    }
}

function showResult(content) {
    const resultContent = document.getElementById('result-content');
    resultContent.innerHTML = content;
    showStep('result');
}

function handleDataSubmission() {
    // Coletar dados do formulário
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const idade = document.getElementById('idade').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    
    // Validar campos obrigatórios
    if (!nome || !cpf || !idade || !whatsapp) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validar idade mínima
    if (parseInt(idade) < 18) {
        alert('É necessário ter pelo menos 18 anos para solicitar o crédito.');
        return;
    }
    
    // Validar CPF (validação básica de formato)
    if (!isValidCPF(cpf)) {
        alert('Por favor, informe um CPF válido.');
        return;
    }
    
    // Salvar dados
    formState.userData = { nome, cpf, idade, whatsapp };
    
    // Mostrar mensagem de sucesso
    const resultContent = `
        <div class="result-message result-success">
            <h3>Solicitação enviada com sucesso!</h3>
            <p>Obrigado, <strong>${nome}</strong>! Seus dados foram enviados com sucesso.</p>
            <p>Nossa equipe entrará em contato através do WhatsApp <strong>${whatsapp}</strong> em breve para dar continuidade ao seu processo de crédito.</p>
            <p><strong>Serviço solicitado:</strong> ${getServiceName(formState.selectedService)}</p>
        </div>
    `;
    
    showResult(resultContent);
}

function isValidCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    return true; // Validação básica, pode ser expandida
}

function getServiceName(service) {
    const serviceNames = {
        'inss': 'Crédito para INSS',
        'siape': 'SIAPE',
        'clt': 'CLT',
        'bolsa-familia': 'Bolsa Família',
        'fgts': 'Antecipação do FGTS'
    };
    
    return serviceNames[service] || service;
}

function restartForm() {
    // Resetar estado
    formState = {
        selectedService: null,
        currentStep: 'service',
        userData: {},
        questionAnswers: {}
    };
    
    // Limpar formulários
    document.querySelectorAll('input').forEach(input => {
        if (input.type === 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Desabilitar botão de continuar
    document.getElementById('btn-next-service').disabled = true;
    
    // Voltar para a primeira etapa
    showStep('service');
}

