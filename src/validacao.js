const validacoesNativas = {
    valueMissing: "Campo obrigatório.",
    patternMismatch: "Formato inválido.",
    tooShort: "Há menos caracteres que o necessário.",
    tooLong: "Há mais caracteres que o permitido"
};

function checaValidacoesCustomizadas(campo, regras) {
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

function adicionaMensagemDeErro(campo, mensagem) {
    campo.parentNode.querySelector('.invalid-feedback').textContent = mensagem;
    campo.classList.add('is-invalid');
    campo.classList.remove('is-valid');
}

function removeMensagemDeErro(campo) {
    campo.classList.remove('is-invalid');
    campo.classList.add('is-valid');
    campo.parentNode.querySelector('.invalid-feedback').textContent = '';
}

export function registraCampoParaValidacao(campo, regras) {

    campo.addEventListener('invalid', e => e.preventDefault());
    campo.addEventListener('blur', e => {
        let validador = campo.checkValidity();
        console.log('validador', validador);

        if (!validador) {
            let erro = Object.keys(validacoesNativas).find(tipo => campo.validity[tipo]);
            let mensagem = validacoesNativas[erro];

            adicionaMensagemDeErro(campo, mensagem);
            return;
        }
        
        let mensagem = checaValidacoesCustomizadas(campo, regras);
        if (mensagem !== '') {
            adicionaMensagemDeErro(campo, mensagem);
            return;
        }

        removeMensagemDeErro(campo);
    });
}