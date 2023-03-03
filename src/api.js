import { criaEndereco, criaCategoria } from "./modelo.js";
import * as cache from './cache.js';

const API_URL = 'http://localhost:3000'

function efetuaRequisicao(url, metodo = 'GET',  payload = null) {
    let opcoes = {
        method: metodo
    };

    if (payload) {
        opcoes.headers = { 'Content-Type': 'application/json' };
        opcoes.body = JSON.stringify(payload)
    }

    return fetch(API_URL + url, opcoes)
        .catch(erro => {
            console.log(`Erro em ${metodo} ${url}`, erro);
            return Promise.reject(erro);
        });
}

export function salvaProduto(produto) {
    return efetuaRequisicao(`/produtos`, 'POST', produto)
        .then(resposta => {
            // Geralmente, depois de cadastrar algo, a API devolve o JSON da entidade.
            // Aqui, pegaríamos o produto cadastrado devolvido pela API e retornaríamos ele.

            return produto;
        })
        .catch(() => Promise.reject('Não foi possível salvar o produto! Aguarde uns minutos e tente novamente.'));
}

export function listaProdutos() {
    return efetuaRequisicao('/produtos')
        .then(resposta => resposta.json())
        .catch(() => Promise.reject('Não foi possível carregar os produtos cadastrados.'));
}

export function salvaCategoria(categoria) {
    return efetuaRequisicao('/categorias', 'POST', categoria)
        .then(resposta => {
            localStorage.removeItem('cache-categorias');
            return categoria;
        })
        .catch(() => Promise.reject('Não foi possível salvar a categoria! Aguarde uns minutos e tente novamente.'));
}

export function atualizaCategoria(categoria) {
    return efetuaRequisicao(`/categorias/${categoria.id}`, 'PUT', categoria)
        .then(resposta => {
            localStorage.removeItem('cache-categorias');
            return categoria;
        })
        .catch(() => Promise.reject('Não foi possível salvar a categoria! Aguarde uns minutos e tente novamente.'));
}

export function listaCategorias() {
    let categoriasNoCache = cache.recuperaCategoriasNoCache();
    if (categoriasNoCache) {
        return Promise.resolve(categoriasNoCache);
    }

    return efetuaRequisicao(`/categorias`)
        .then(resposta => resposta.json())
        .then(categorias => {
            cache.armazenaCategorias(categorias);
            return categorias;
        })
        .catch(() => Promise.reject('Não foi possível recuperar as categorias.'));
}

export function alteraStatusDaCategoria(id, status) {
    return efetuaRequisicao(`/categorias/${id}`, 'PATCH', { status })
        .then(resposta => localStorage.removeItem('cache-categorias'));
}

export function excluiCategoria(id) {
    return efetuaRequisicao(`/categorias/${id}`, 'DELETE')
        .then(resposta => console.log(`Categoria ${id} removida...`))
        .catch(erro => Promise.reject('Erro ao excluir categoria.'));
}

export function salvaCliente(cliente) {
    return efetuaRequisicao('/clientes', 'POST', cliente)
        .then(resposta => cliente) // simula o retorno do cliente cadastrado pela API.
        .catch(() => Promise.reject('Não foi possível cadastrar o cliente! Aguarde uns minutos e tente novamente.'));
}

export function consultaEndereco(cep) {
    let url = `https://viacep.com.br/ws/${cep}/json/`;

    return fetch(url)
        .then(resposta => resposta.json())
        .then(function(json) {
            if (json.erro) {
                return Promise.reject(`Cep inexistente: ${cep}`);
            }
            
            return criaEndereco(
                json.logradouro, 
                json.complemento, 
                json.bairro, 
                json.localidade, 
                json.uf, 
                cep
            );
        })
        .catch(function(erroHttp) {
            console.log('Falha ao fazer requisição para API', erroHttp);

            return criaEndereco('', '', '', '', '', cep);
        });
}

// Pesquisar performance async/await VS then