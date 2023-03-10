import { Categoria } from '../js/modelo-classes.js';
import { DateUtil } from '../js/date-util.js';
import * as api from '../js/api.js';


function carregaCategorias(): Promise<void> {
    return api.listaCategorias()
            .then((categorias: Categoria[]) => {
                listagemDeCategorias.innerHTML = '';
                console.log('limpou...', categorias);

                categorias.map(c => criaLinhaCategoria(c))
                    .forEach(linha => listagemDeCategorias.appendChild(linha));
            })
            .catch(alert);
}

function salvaCategoria(evento: SubmitEvent): void {
    evento.preventDefault();

    let novaCategoria = new Categoria(campoNome.value);
    api.salvaCategoria(novaCategoria)
        .then(categoriaSalva => {
            alert(`Categoria ${categoriaSalva.nome} cadastrada com sucesso.`);

            campoNome.value = '';
            campoNome.focus();
        
            return carregaCategorias();
        })
        .catch(alert);
}

function editaCategoria(categoria: Categoria): void {
    if (categoria == null) {
        throw new Error('Categoria não pode ser nula.');
    }
    let novoNome = prompt('Digite o novo nome da categoria?');

    if (novoNome && novoNome.trim().length > 2) {
        categoria.nome = novoNome;
        api.atualizaCategoria(categoria)
            .then(() => carregaCategorias())
            .catch(alert);
    }
}

function desativaCategoria(categoria: Categoria): void {
    let confirmou = confirm('Tem certeza que deseja desativar a categoria?');
    
    if (confirmou) {
        api.alteraStatusDaCategoria(categoria.id, 'INATIVA')
            .then(() => carregaCategorias())
            .catch(alert);
    }        
}

function ativaCategoria(categoria: Categoria): void {
    api.alteraStatusDaCategoria(categoria.id, 'ATIVA')
        .then(() => carregaCategorias())
        .catch(alert);
}

function excluiCategoria(categoria: Categoria): void {
    let confirmacao = confirm(`Tem certeza que deseja excluir a categoria ${categoria.nome}?`);

    if (confirmacao) {
        api.excluiCategoria(categoria.id)
            .then(() => carregaCategorias())
            .then(() => alert('Categoria excluída!'))
            .catch(alert);
    }
}

function criaLinhaCategoria(categoria: Categoria) {
    let exibeAtivar = categoria.isAtiva ? 'd-none' : '';
    let exibeDesativar = categoria.isAtiva ? '' : 'd-none';

    console.log('categoria', categoria, categoria.isAtiva);

    let linha = document.createElement('tr');
    linha.innerHTML = `<td>${categoria.nome}</td>
                       <td>${categoria.status}</td>
                       <td>${DateUtil.formataDateParaString(categoria.criacao)}</td>
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

const campoNome: HTMLInputElement = document.querySelector('#nome');
const listagemDeCategorias: HTMLElement = document.querySelector('#tabela-categorias tbody');

const formulario: HTMLFormElement = document.querySelector('#formulario-categoria');
formulario.onsubmit = salvaCategoria;

window.addEventListener('load', carregaCategorias);
