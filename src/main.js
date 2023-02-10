import * as modelo from "./modelo.js";
import * as api from "./api.js";

function exibeCategoria(categoria) {
    console.log(modelo.formataStringDaCategoria(categoria));
}

function exibeProduto(produto) {
    console.log(modelo.formataStringDoProduto(produto));
}

let informatica = modelo.criaCategoria('INFORMÁTICA');
let moveis = modelo.criaCategoria('MÓVEIS');
let livros = modelo.criaCategoria('LIVROS');
api.salvaCategoria(informatica);
api.salvaCategoria(moveis);
api.salvaCategoria(livros);

api.listaCategorias()
    .forEach(c => exibeCategoria(c));



let notebookSamsung = modelo.criaProduto('Notebook Samsung', 'Notebook de última geração da Samsung', 3523.00, 1, informatica);
let cleanArch = modelo.criaProduto('Clean Architecture', 'Livro casca grossa do Uncle Bob', 102.90, 2, livros);
let monitorDell = modelo.criaProduto('Monitor Dell 27', 'Monitor gigante', 1889.00, 3, informatica);
api.salvaProduto(notebookSamsung);
api.salvaProduto(cleanArch);
api.salvaProduto(monitorDell);

console.log();
api.listaProdutos()
    .forEach(p => exibeProduto(p));
//listaProdutos().forEach(exibeProduto);

let endereco = await api.consultaEndereco(71909720);
let fulano = modelo.criaCliente('Fulano', 'de Tal', '123', '321', 'f@f.com', endereco);
console.log(fulano);