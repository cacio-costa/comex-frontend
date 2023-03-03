import * as api from '../api.js';

let painelDeProdutos = document.querySelector('#painel-de-produtos');

function criaCardDeProduto(produto) {
    return `
        <div class="col-sm-12 col-md-4 col-lg-3 mb-4">
            <div class="card">
                <img src="${produto.url}" class="card-img-top" alt="Foto de uma placa-mãe">
                <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">R$ ${produto.preco}</p>
                    <a href="#" class="btn btn-primary">Comprar</a>
                </div>
            </div>
        </div>
    `;
}

function exibeProdutos() {
    return api.listaProdutos()
        .then(produtos => produtos.map(p => criaCardDeProduto(p)))
        .then(cards => painelDeProdutos.innerHTML = cards)
        .catch(alert);
}

window.addEventListener('load', exibeProdutos);