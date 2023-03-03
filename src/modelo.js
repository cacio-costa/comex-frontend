import { v4 as uuidv4 } from '/node_modules/uuid/dist/esm-browser/index.js';

function formataData() {
    let [mes, dia, ano] = new Date()
        .toLocaleString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
        .split(',')[0]
        .split('/');

    return `${ano}-${mes}-${dia}`;
}

export function criaCategoria(nome) {
    return {
        id: uuidv4(),
        nome: nome,
        status: 'ATIVA',
        criacao: formataData()
    };
}

export function criaProduto(nome, descricao, preco, quantidadeEmEstoque, categoria, url) {
    return {
        id: uuidv4(),
        nome: nome,
        descricao: descricao,
        preco: preco,
        quantidadeEmEstoque: quantidadeEmEstoque,
        categoria: categoria,
        url: url,
        criacao: formataData()
    };
}

export function criaEndereco(logradouro, complemento, bairro, cidade, uf, cep) {
    return { uf, cep, bairro, cidade, logradouro, complemento };
}

export function criaCliente(nome, sobrenome, cpf, telefone, email, endereco) {
    return {
        id: uuidv4(),
        nome: nome,
        sobrenome: sobrenome,
        cpf: cpf,
        telefone: telefone,
        email: email,
        endereco: endereco,
        criacao: formataData()
    };
}

export function isCategoriaAtiva(categoria) {
    return categoria.status == 'ATIVA';
}

function cpfComFormatoValido(cpf) {
    return cpf
        && cpf.trim().length
        && /[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/g.test(cpf.trim());
}

function numerosRepetidos(cpf) {
    const numerosRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]

    return numerosRepetidos.includes(cpf)
}

function digitoValido(cpf, indiceDoDigito, multiplicador) {
    let soma = 0;
    for (let tamanho = 0; tamanho < indiceDoDigito; tamanho++) {
        soma += cpf[tamanho] * multiplicador;
        multiplicador--;
    }

    soma = (soma * 10) % 11;

    if (soma == 10 || soma == 11) {
        soma = 0;
    }

    return soma == cpf[indiceDoDigito];
}

export function validaCpf(cpf) {
    console.log('VALIDANDO CPF...');
    if (!cpfComFormatoValido(cpf)) {
        return 'Formato inválido.';
    }

    let somenteNumeros = cpf.trim().replaceAll(/\.|-/g, '');
    console.log('VALIDANDO REPETIDOS...', somenteNumeros);
    if (numerosRepetidos(somenteNumeros)) {
        return 'Todos os números iguais.';
    }

    if (!digitoValido(somenteNumeros, 9, 10) || !digitoValido(somenteNumeros, 10, 11)) {
        return 'Dígitos verificadores inválidos.';
    }

    return '';
}


// 1 - Sempre que receber a mesma entrada deve retornar a mesma resposta
// 2 - Só depende do estado dela
// 3 - Não pode ter efeitos colaterais
export function formataStringDaCategoria(categoria) {
    return `${categoria.id}: ${categoria.nome} (${categoria.status})`;
}

export function formataStringDoProduto(produto) {
    return `${produto.nome} (${produto.categoria.nome}) => ${produto.quantidadeEmEstoque} em estoque.`
}
