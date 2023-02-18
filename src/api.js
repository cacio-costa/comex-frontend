import { criaEndereco, criaCategoria } from "./modelo.js";

let categorias = [
    criaCategoria('INFORMÁTICA'),
    criaCategoria('MÓVEIS'),
    criaCategoria('LIVROS')
];

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
    return Promise.resolve(categorias);
}

export function buscaCategoriaPorId(id) {
    let categoria = categorias.find(c => c.id === id);
    return categoria
         ? Promise.resolve(categoria) 
         : Promise.reject(`Categoria inexistente: ${id}`);

}

export function consultaEndereco(cep) {
    let url = `https://viacep.com.br/ws/${cep}/json/`;

    return fetch(url)
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(json) {
            if (json.erro) {
                return Promise.reject(`Cep inexistente: ${cep}`);
            }
            
            return criaEndereco(json.logradouro, json.complemento, json.bairro, json.localidade, json.uf, cep);
        })
        .catch(function(erroHttp) {
            console.log('Falha ao fazer requisição para API', erroHttp);
            //return Promise.reject('Falha ao consultar endereço. Tente novamente dentro de 2 minutos.')

            return criaEndereco('', '', '', '', '', cep);
        });
}
