import { criaCategoria } from '../modelo.js';

function salvaCategoria(evento) {
    evento.preventDefault();

    let novaCategoria = criaCategoria(campoNome.value);
    console.log(novaCategoria);

    campoNome.value = '';
    campoNome.focus();
}


const campoNome = document.querySelector('#nome');

const formulario = document.querySelector('#formulario-categoria');
formulario.onsubmit = salvaCategoria;
