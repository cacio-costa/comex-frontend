import * as api from '../api.js';
import * as modelo from '../modelo.js';
import IMask from '/node_modules/imask/esm/index.js';

let campoUrl = document.getElementById('url');
let campoNome = document.getElementById('nome');
let campoEstoque = document.getElementById('estoque');
let campoDescricao = document.getElementById('descricao');
let campoCategoria = document.getElementById('categoria');

let campoPreco = IMask(document.getElementById('preco'), {
    mask: Number,
    scale: 2,
    thousandsSeparator: '.',
    radix: ',',
    signed: false,
    padFractionalZeros: true
});

function criaOptionsDeCategorias() {
    api.listaCategorias()
        .then(categorias => {
            let optionsDasCategorias = categorias.filter(c => modelo.isCategoriaAtiva(c))
                .map(c => `<option value="${c.id}">${c.nome}</option>`);

            let options = ['<option value="">Selecione</option>', ...optionsDasCategorias];

            campoCategoria.innerHTML = options;
        });
}

function limpaFormulario() {
    campoCategoria.value = '';
    campoDescricao.value = '';
    campoEstoque.value = '';
    campoPreco.value = '';
    campoNome.value = '';
    campoUrl.value = '';
}

function salvaProduto(evento) {
    evento.preventDefault();

    let novoProduto = modelo.criaProduto(
        campoNome.value, 
        campoDescricao.value, 
        campoPreco.unmaskedValue, 
        campoEstoque.value, 
        campoCategoria.value,
        campoUrl.value
    );

    return api.salvaProduto(novoProduto)
            .then(produtoSalvo => {
                alert(`Produto ${produtoSalvo.nome} cadastrado com sucesso.`);

                limpaFormulario();
                campoNome.focus();
            })
            .catch(alert);
}

document.getElementById('formulario-produto').addEventListener('submit', salvaProduto);

window.addEventListener('load', criaOptionsDeCategorias);