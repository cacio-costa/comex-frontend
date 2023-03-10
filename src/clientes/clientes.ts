
import IMask from 'imask';

import * as api from '../js/api.js';
import { Cliente, Endereco, Cpf } from '../js/modelo-classes.js';
import * as validacao from '../js/validacao.js';

let campoUf: HTMLInputElement = document.querySelector('#uf');
let campoCep: HTMLInputElement = document.querySelector('#cep');
let campoBairro: HTMLInputElement = document.querySelector('#bairro');
let campoCidade: HTMLInputElement = document.querySelector('#cidade');
let campoLogradouro: HTMLInputElement = document.querySelector('#logradouro');
let campoComplemento: HTMLInputElement = document.querySelector('#complemento');

let campoCpf: HTMLInputElement = document.querySelector('#cpf');
let campoNome: HTMLInputElement = document.querySelector('#nome');
let campoEmail: HTMLInputElement = document.querySelector('#email');
let campoTelefone: HTMLInputElement = document.querySelector('#telefone');
let campoSobrenome: HTMLInputElement = document.querySelector('#sobrenome');

let mascaraCep = IMask(campoCep, {
    mask: '00000-000'
});

let mascaraCpf = IMask(campoCpf, {
    mask: '000.000.000-00'
});

let mascaraTelefone = IMask(campoTelefone, {
    mask: [
        { mask: '(00) 0000-0000' },
        { mask: '(00) 00000-0000' }
    ]
});

const regrasDeValidacao = {
    cpf: {
        funcoes: [Cpf.validaCpf]
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

function configuraValidacoesNosCampos(): void {
    
    let campos = [
        campoBairro, 
        campoCep, 
        campoCidade, 
        campoCpf, 
        campoEmail, 
        campoLogradouro, 
        campoNome, 
        campoSobrenome,
        campoTelefone,
        campoUf
    ];

    campos.forEach(campo => validacao.registraCampoParaValidacao(campo, regrasDeValidacao));
}


mascaraCep.on("complete", function() {
    api.consultaEndereco(mascaraCep.unmaskedValue)
        .then(function(endereco) {
            campoUf.value = endereco.uf;
            campoBairro.value = endereco.bairro;
            campoCidade.value = endereco.cidade;
            campoLogradouro.value = endereco.logradouro;
            campoComplemento.value = endereco.complemento;
        });
});

function limpaCampo(campo: HTMLInputElement): void {
    campo.value = ''; 
    campo.classList.remove('is-valid', 'is-invalid');
}

function limpaFormulario(): void {
    limpaCampo(campoCpf); 
    limpaCampo(campoNome); 
    limpaCampo(campoEmail); 
    limpaCampo(campoTelefone); 
    limpaCampo(campoSobrenome); 
    
    limpaCampo(campoUf); 
    limpaCampo(campoCep);
    limpaCampo(campoBairro); 
    limpaCampo(campoCidade); 
    limpaCampo(campoLogradouro); 
    limpaCampo(campoComplemento);

    formulario.classList.remove('was-validated');
}

function salvaCliente() {
    let endereco = new Endereco(
        campoLogradouro.value, 
        campoComplemento.value, 
        campoBairro.value, 
        campoCidade.value, 
        campoUf.value, 
        campoCep.value
    );

    let cliente = new Cliente(
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

let formulario: HTMLFormElement = document.querySelector('#formulario-cliente');
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