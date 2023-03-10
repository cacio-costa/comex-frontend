import { Categoria, Produto, Cliente, Endereco} from "./modelo-classes.js";
import * as cache from './cache.js';

const API_URL = 'http://localhost:3000';

function efetuaRequisicao(url: string, metodo: string = 'GET',  payload: any = null): Promise<Response> {
    let opcoes: Record<string, any> = {
        method: metodo
    };

    if (payload) {
        opcoes.headers = { 'Content-Type': 'application/json' };
        opcoes.body = JSON.stringify(payload)
    }

    return fetch(API_URL + url, opcoes)
        .catch(erro => {
            console.log(`Erro em ${metodo} ${url}`, erro);
            return Promise.reject(erro);
        });
}

export function salvaProduto(produto: Produto): Promise<Produto> {
    let produtoParaApi = {
        id: produto.id,
        url: produto.url,
        nome: produto.nome,
        preco: produto.preco,
        criacao: produto.criacao.toISOString(),
        categoria: produto.categoria,
        descricao: produto.descricao,
        quantidadeEmEstoque: produto.quantidadeEmEstoque
    };

    return efetuaRequisicao(`/produtos`, 'POST', produtoParaApi)
        .then(resposta => {
            // Geralmente, depois de cadastrar algo, a API devolve o JSON da entidade.
            // Aqui, pegaríamos o produto cadastrado devolvido pela API e retornaríamos ele.

            return produto;
        })
        .catch(() => Promise.reject('Não foi possível salvar o produto! Aguarde uns minutos e tente novamente.'));
}

export function listaProdutos(): Promise<Produto[]> {
    return efetuaRequisicao('/produtos')
        .then(resposta => resposta.json())
        .then(produtos => {
            return produtos.map((produtoJson: any) => new Produto(
                produtoJson.nome, 
                produtoJson.descricao, 
                produtoJson.preco, 
                produtoJson.quantidadeEmEstoque, 
                produtoJson.categoria, 
                produtoJson.url, 
                new Date(produtoJson.criacao), 
                produtoJson.id
            ));
        })
        .catch(() => Promise.reject('Não foi possível carregar os produtos cadastrados.'));
}

export function salvaCategoria(categoria: Categoria): Promise<Categoria> {
    console.log('Objeto que será salvo...', JSON.stringify(categoria))
    
    let jsonTransformadoParaApi = categoria.paraApi();
    return efetuaRequisicao('/categorias', 'POST', jsonTransformadoParaApi)
        .then(resposta => {
            cache.limpaCacheCategorias();
            return categoria;
        })
        .catch(() => Promise.reject('Não foi possível salvar a categoria! Aguarde uns minutos e tente novamente.'));
}

export function atualizaCategoria(categoria: Categoria): Promise<Categoria> {
    return efetuaRequisicao(`/categorias/${categoria.id}`, 'PUT', categoria.paraApi())
        .then(resposta => {
            cache.limpaCacheCategorias();
            return categoria;
        })
        .catch(() => Promise.reject('Não foi possível salvar a categoria! Aguarde uns minutos e tente novamente.'));
}

export function listaCategorias(): Promise<Categoria[]> {
    let categoriasNoCache = cache.recuperaCategoriasNoCache();
    if (categoriasNoCache) {
        return Promise.resolve(categoriasNoCache);
    }

    return efetuaRequisicao(`/categorias`)
        .then(resposta => resposta.json())
        .then(categorias => {
            let listaDeCategorias = categorias.map((json: any) => new Categoria(json.nome, json.status, new Date(json.criacao), json.id));
            cache.armazenaCategorias(listaDeCategorias);

            return listaDeCategorias;
        })
        .catch(() => Promise.reject('Não foi possível recuperar as categorias.'));
}

export function alteraStatusDaCategoria(id: string, status: string): Promise<void> {
    return efetuaRequisicao(`/categorias/${id}`, 'PATCH', { status })
        .then(resposta => cache.limpaCacheCategorias());
}

export function excluiCategoria(id: string): Promise<void> {
    return efetuaRequisicao(`/categorias/${id}`, 'DELETE')
        .then(resposta => console.log(`Categoria ${id} removida...`))
        .catch(erro => Promise.reject('Erro ao excluir categoria.'));
}

export function salvaCliente(cliente: Cliente): Promise<Cliente> {
    let clienteParaApi = {
        id: cliente.id,
        cpf: cliente.cpf,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        sobrenome: cliente.sobrenome,
        criacao: cliente.criacao.toISOString(),

        endereco: {
            uf: cliente.endereco.uf,
            cep: cliente.endereco.cep,
            bairro: cliente.endereco.bairro,
            cidade: cliente.endereco.cidade,
            logradouro: cliente.endereco.logradouro,
            complemento: cliente.endereco.complemento
        }
    };

    return efetuaRequisicao('/clientes', 'POST', clienteParaApi)
        .then(resposta => cliente) // simula o retorno do cliente cadastrado pela API.
        .catch(() => Promise.reject('Não foi possível cadastrar o cliente! Aguarde uns minutos e tente novamente.'));
}

export function consultaEndereco(cep: string): Promise<Endereco> {
    let url = `https://viacep.com.br/ws/${cep}/json/`;

    return fetch(url)
        .then(resposta => resposta.json())
        .then(function(json) {
            if (json.erro) {
                return Promise.reject(`Cep inexistente: ${cep}`);
            }
            
            return new Endereco(
                json.logradouro, 
                json.complemento, 
                json.bairro, 
                json.localidade, 
                json.uf, 
                cep
            );
        })
        .catch(function(erroHttp) {
            console.log('Falha ao fazer requisição para API', erroHttp);

            return new Endereco('', '', '', '', '', cep);
        });
}

// Pesquisar performance async/await VS then