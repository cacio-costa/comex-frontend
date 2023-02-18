import * as api from '../api.js';
import * as modelo from '../modelo.js';
import IMask from '/node_modules/imask/esm/index.js';

function criaOptionCategoria(categoria) {
    let option = document.createElement('option');
    option.setAttribute('value', categoria.id);
    option.textContent = categoria.nome;

    return option;
}


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


api.listaCategorias()
    .then(function(categorias) {
        categorias.map(criaOptionCategoria)
            .forEach(option => campoCategoria.appendChild(option));
    });


let formulario = document.getElementById('formulario-produto');
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    api.buscaCategoriaPorId(campoCategoria.value)
        .then(categoria => {
            let produto = modelo.criaProduto(campoNome.value, campoDescricao.value, campoPreco.unmaskedValue, campoEstoque.value, categoria);
            console.log(produto);
        })
        .catch(erro => console.log(erro));
});