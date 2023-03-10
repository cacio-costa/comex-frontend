import * as api from '../js/api.js';
import { Produto, Categoria } from '../js/modelo-classes.js';
import IMask from 'imask';

let campoUrl: HTMLInputElement = document.querySelector('#url');
let campoNome: HTMLInputElement = document.querySelector('#nome');
let campoPreco: HTMLInputElement = document.querySelector('#preco');
let campoEstoque: HTMLInputElement = document.querySelector('#estoque');
let campoDescricao: HTMLInputElement = document.querySelector('#descricao');
let campoCategoria: HTMLInputElement = document.querySelector('#categoria');

let mascaraPreco = IMask(campoPreco, {
    mask: Number,
    scale: 2,
    thousandsSeparator: '.',
    radix: ',',
    signed: false,
    padFractionalZeros: true
});

function criaOptionsDeCategorias(): void {
    api.listaCategorias()
        .then(categorias => {
            let optionsDasCategorias = categorias.filter(c => c.isAtiva)
                .map(c => `<option value="${c.id}">${c.nome}</option>`);

            let options = ['<option value="">Selecione</option>', ...optionsDasCategorias];

            campoCategoria.innerHTML = options.join('');
        });
}

function limpaFormulario(): void {
    campoCategoria.value = '';
    campoDescricao.value = '';
    campoEstoque.value = '';
    campoPreco.value = '';
    campoNome.value = '';
    campoUrl.value = '';
}

function salvaProduto(evento: SubmitEvent): Promise<void> {
    evento.preventDefault();

    let novoProduto = new Produto(
        campoNome.value, 
        campoDescricao.value, 
        parseInt(mascaraPreco.unmaskedValue), 
        parseInt(campoEstoque.value), 
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