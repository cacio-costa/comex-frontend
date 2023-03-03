import * as modelo from '../modelo.js';
import * as api from '../api.js';


function carregaCategorias() {
    return api.listaCategorias()
            .then(categorias => {
                listagemDeCategorias.innerHTML = '';
                console.log('limpou...', categorias);

                categorias.map(c => criaLinhaCategoria(c))
                    .forEach(linha => listagemDeCategorias.appendChild(linha));
            })
            .catch(alert);
}

function salvaCategoria(evento) {
    evento.preventDefault();

    let novaCategoria = modelo.criaCategoria(campoNome.value);
    api.salvaCategoria(novaCategoria)
        .then(categoriaSalva => {
            alert(`Categoria ${categoriaSalva.nome} cadastrada com sucesso.`);

            campoNome.value = '';
            campoNome.focus();
        
            return carregaCategorias();
        })
        .catch(alert);
}

function editaCategoria(categoria) {
    let novoNome = prompt('Digite o novo nome da categoria?');

    if (novoNome && novoNome.trim().length > 2) {
        categoria.nome = novoNome;
        api.atualizaCategoria(categoria)
            .then(() => carregaCategorias())
            .catch(alert);
    }
}

function desativaCategoria(categoria) {
    let confirmacao = confirm('Tem certeza que deseja desativar a categoria?');
    
    if (confirmacao) {
        api.alteraStatusDaCategoria(categoria.id, 'INATIVA')
            .then(() => carregaCategorias())
            .catch(alert);
    }        
}

function ativaCategoria(categoria) {
    api.alteraStatusDaCategoria(categoria.id, 'ATIVA')
        .then(() => carregaCategorias())
        .catch(alert);
}

function excluiCategoria(categoria) {
    let confirmacao = confirm(`Tem certeza que deseja excluir a categoria ${categoria.nome}?`);

    if (confirmacao) {
        api.excluiCategoria(categoria.id)
            .then(() => carregaCategorias())
            .then(() => alert('Categoria excluída!'))
            .catch(alert);
    }
}

function criaLinhaCategoria(categoria) {
    let exibeAtivar = modelo.isCategoriaAtiva(categoria) ? 'd-none' : '';
    let exibeDesativar = modelo.isCategoriaAtiva(categoria) ? '' : 'd-none';

    let linha = document.createElement('tr');
    linha.innerHTML = `<td>${categoria.nome}</td>
                       <td>${categoria.status}</td>
                       <td>${categoria.criacao}</td>
                       <td>
                         <button class="btn btn-outline-secondary btn-sm editar">
                           <i class="fas fa-edit"></i>
                         </button>
                         <button class="btn btn-outline-success btn-sm ativar ${exibeAtivar}">
                           <i class="fa-solid fa-check"></i>
                         </button>
                         <button class="btn btn-outline-warning btn-sm desativar ${exibeDesativar}">
                           <i class="fa-solid fa-ban"></i>
                         </button>
                         <button class="btn btn-outline-danger btn-sm excluir">
                           <i class="fas fa-trash-alt"></i>
                         </button>
                       </td>`;

    
    linha.querySelector('.ativar').addEventListener('click', evento => ativaCategoria(categoria));
    linha.querySelector('.editar').addEventListener('click', evento => editaCategoria(categoria));
    linha.querySelector('.excluir').addEventListener('click', evento => excluiCategoria(categoria));
    linha.querySelector('.desativar').addEventListener('click', evento => desativaCategoria(categoria));

    return linha;
}

const campoNome = document.querySelector('#nome');
const listagemDeCategorias = document.querySelector('#tabela-categorias tbody');

const formulario = document.querySelector('#formulario-categoria');
formulario.onsubmit = salvaCategoria;

window.addEventListener('load', carregaCategorias);
