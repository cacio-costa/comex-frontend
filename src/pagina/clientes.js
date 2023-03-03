import IMask from '/node_modules/imask/esm/index.js';

import * as api from '../api.js';
import * as modelo from '../modelo.js';
import * as validacao from '../validacao.js';

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

const regrasDeValidacao = {
    cpf: {
        funcoes: [modelo.validaCpf]
    },
    nome: {},
    sobrenome: {},
    telefone: {},
    email: {},
    cep: {},
    logradouro: {},
    bairro: {},
    cidade: {},
    uf: {}
};

function configuraValidacoesNosCampos() {
    let campos = [
        campoBairro, 
        campoCep.el.input, 
        campoCidade, 
        campoCpf.el.input, 
        campoEmail, 
        campoLogradouro, 
        campoNome, 
        campoSobrenome,
        campoTelefone.el.input,
        campoUf
    ];

    campos.forEach(campo => validacao.registraCampoParaValidacao(campo, regrasDeValidacao));
}




campoCep.on("complete", function() {
    console.log(arguments);
    api.consultaEndereco(campoCep.unmaskedValue)
        .then(function(endereco) {
            campoUf.value = endereco.uf;
            campoBairro.value = endereco.bairro;
            campoCidade.value = endereco.cidade;
            campoLogradouro.value = endereco.logradouro;
            campoComplemento.value = endereco.complemento;
        });
});

function limpaFormulario() {
    campoCpf.value = ''; 
    campoNome.value = ''; 
    campoEmail.value = ''; 
    campoTelefone.value = ''; 
    campoSobrenome.value = ''; 

    campoUf.value = ''; 
    campoCep.value = '';
    campoBairro.value = ''; 
    campoCidade.value = ''; 
    campoLogradouro.value = ''; 
    campoComplemento.value = '';

    formulario.classList.remove('was-validated');
}

function salvaCliente() {
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

    api.salvaCliente(cliente)
        .then(clienteSalvo => {
            limpaFormulario();
            alert(`Cliente ${clienteSalvo.nome} (${clienteSalvo.cpf}) cadastrado com sucesso.`);
        })
        .catch(alert);
}

let formulario = document.getElementById('formulario-cliente');
formulario.addEventListener('submit', e => {
    e.preventDefault();
    e.stopPropagation();

    let formularioValido = formulario.checkValidity();
    if (formularioValido) {
        salvaCliente();
    } else {
        formulario.classList.add('was-validated');
    }
});

window.addEventListener('load', configuraValidacoesNosCampos);