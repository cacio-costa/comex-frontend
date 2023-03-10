const validacoesNativas: Record<string, string> = {
    "valueMissing": "Campo obrigatório.",
    "patternMismatch": "Formato inválido.",
    "tooShort": "Há menos caracteres que o necessário.",
    "tooLong": "Há mais caracteres que o permitido"
};

function checaValidacoesCustomizadas(campo: HTMLInputElement, regras: any): string {
    let mensagem = '';
    
    let validacoesCustomizadas = regras[campo.name] && regras[campo.name].funcoes;
    if (validacoesCustomizadas) {
        for (let validacao of validacoesCustomizadas) {
            mensagem = validacao(campo.value);

            if (mensagem !== '') {
                break;
            }
        }
    }

    return mensagem;
}

function adicionaMensagemDeErro(campo: HTMLInputElement, mensagem: string): void {
    campo.parentNode.querySelector('.invalid-feedback').textContent = mensagem;
    campo.classList.add('is-invalid');
    campo.classList.remove('is-valid');
}

function removeMensagemDeErro(campo: HTMLInputElement): void {
    campo.classList.remove('is-invalid');
    campo.classList.add('is-valid');
    campo.parentNode.querySelector('.invalid-feedback').textContent = '';
}

export function registraCampoParaValidacao(campo: HTMLInputElement, regras: any): void {

    campo.addEventListener('invalid', e => e.preventDefault());
    campo.addEventListener('blur', () => {
        let validador = campo.checkValidity();

        if (!validador) {
            let erro = Object.keys(validacoesNativas).find(tipo => campo.validity[tipo as keyof ValidityState]);
            let mensagem = validacoesNativas[erro];
            console.log('mensagem nativa...', mensagem);
            adicionaMensagemDeErro(campo, mensagem);
            return;
        }
        
        let mensagem = checaValidacoesCustomizadas(campo, regras);
        if (mensagem !== '') {
            adicionaMensagemDeErro(campo, mensagem);
            console.log('mensagem customizada...', mensagem);
            return;
        }
console.log('removendo mensagem de ', campo);
        removeMensagemDeErro(campo);
    });
}