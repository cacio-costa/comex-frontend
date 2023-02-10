import { v4 as uuidv4 } from 'uuid';

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

export function criaProduto(nome, descricao, preco, quantidadeEmEstoque, categoria) {
    return {
        id: uuidv4(),
        nome: nome,
        descricao: descricao,
        preco: preco,
        quantidadeEmEstoque: quantidadeEmEstoque,
        categoria: categoria,
        criacao: formataData()
    };
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


// 1 - Sempre que receber a mesma entrada deve retornar a mesma resposta
// 2 - Só depende do estado dela
// 3 - Não pode ter efeitos colaterais
export function formataStringDaCategoria(categoria) {
    return `${categoria.id}: ${categoria.nome} (${categoria.status})`;
}

export function formataStringDoProduto(produto) {
    return `${produto.nome} (${produto.categoria.nome}) => ${produto.quantidadeEmEstoque} em estoque.`
}