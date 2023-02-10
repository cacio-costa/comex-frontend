let categorias = [];
let produtos = [];

export function salvaProduto(produto) {
    produtos.push(produto);
}

export function listaProdutos() {
    return produtos;
}

export function salvaCategoria(categoria) {
    categorias.push(categoria);
}

export function listaCategorias() {
    return categorias;
}

export async function consultaEndereco(cep) {
    let url = `https://viacep.com.br/ws/${cep}/json/`;

    /*
    return fetch(url)
        .then(function(resposta) {
            return resposta.json();
        })
        .then(dadosEmJSON => {
            return dadosEmJSON;
        });
    */

    let resposta = await fetch(url);
    let dadosEmJSON = await resposta.json();

    return dadosEmJSON;
}
