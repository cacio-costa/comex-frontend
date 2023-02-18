import IMask from '/node_modules/imask/esm/index.js';

import { consultaEndereco } from '../api.js';
import * as modelo from '../modelo.js';

let campoUf = document.getElementById('uf');
let campoBairro = document.getElementById('bairro');
let campoCidade = document.getElementById('cidade');
let campoLogradouro = document.getElementById('logradouro');
let campoComplemento = document.getElementById('complemento');

let campoCep = IMask(document.getElementById('cep'), {
    mask: '00000-000'
});


let campoNome = document.getElementById('nome');
let campoEmail = document.getElementById('email');
let campoSobrenome = document.getElementById('sobrenome');

let campoCpf = IMask(document.getElementById('cpf'), {
    mask: '000.000.000-00'
});
let campoTelefone = IMask(document.getElementById('telefone'), {
    mask: [
        { mask: '(00) 0000-0000' },
        { mask: '(00) 00000-0000' }
    ]
});


campoCep.on("complete", function() {
    console.log(arguments);
    consultaEndereco(campoCep.unmaskedValue)
        .then(function(endereco) {
            campoUf.value = endereco.uf;
            campoBairro.value = endereco.bairro;
            campoCidade.value = endereco.cidade;
            campoLogradouro.value = endereco.logradouro;
            campoComplemento.value = endereco.complemento;
        });
});

let formulario = document.getElementById('formulario-cliente');
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    let endereco = modelo.criaEndereco(
        campoLogradouro.value, 
        campoComplemento.value, 
        campoBairro.value, 
        campoCidade.value, 
        campoUf.value, 
        campoCep.value
    );

    let cliente = modelo.criaCliente(
        campoNome.value, 
        campoSobrenome.value, 
        campoCpf.value, 
        campoTelefone.value, 
        campoEmail.value, 
        endereco
    );

    console.log(cliente);
});