import { v4 as uuidv4 } from 'uuid';


export class Categoria {

    private _nome: string;
    private _status: string;
    private _criacao: Date;
    private _id: string;

    public constructor(
        nome: string, 
        status: string = 'ATIVA', 
        criacao: Date = new Date(),
        id: string = uuidv4()
    ) {
        this._nome = nome;
        this._status = status;
        this._criacao = criacao;
        this._id = id;
    }

    public get nome(): string {
        return this._nome;
    }

    public set nome(novoNome: string) {
        this._nome = novoNome;
    }

    public get status(): string {
        return this._status;
    }

    public get criacao(): Date {
        return this._criacao;
    }

    public get id(): string {
        return this._id;
    }

    public get isAtiva(): boolean {
        return this._status == 'ATIVA';
    }

    public paraApi(): any {
        return {
            id: this._id,
            nome: this._nome,
            status: this._status,
            criacao: this._criacao.toISOString()
        };
    }

}

export class Produto {

    constructor(
        private _nome: string,
        private _descricao: string,
        private _preco: number,
        private _quantidadeEmEstoque: number,
        private _categoria: string,
        private _url: string,
        private _criacao: Date = new Date(),
        private _id: string = uuidv4()
    ) {}

    public get nome(): string {
        return this._nome;
    }

    public get descricao(): string {
        return this._descricao;
    }

    public get preco(): number {
        return this._preco;
    }

    public get quantidadeEmEstoque(): number {
        return this._quantidadeEmEstoque;
    }

    public get categoria(): string {
        return this._categoria;
    }

    public get url(): string {
        return this._url;
    }

    public get criacao(): Date {
        return this._criacao;
    }

    public get id() : string {
        return this._id;
    }
}

export class Endereco {

    constructor(
        private _uf: string, 
        private _cep: string, 
        private _bairro: string, 
        private _cidade: string, 
        private _logradouro: string, 
        private _complemento: string 
    ) {}
    
    
    public get uf() : string {
        return this._uf;
    }
    
    public get cep() : string {
        return this._cep;
    }

    public get bairro() : string {
        return this._bairro;
    }
    
    public get cidade() : string {
        return this._cidade;
    }

    public get logradouro() : string {
        return this._logradouro;
    }

    public get complemento() : string {
        return this._complemento;
    }

}

export class Cliente {

    constructor(
        private _nome: string,
        private _sobrenome: string,
        private _cpf: string,
        private _telefone: string,
        private _email: string,
        private _endereco: Endereco,
        private _criacao: Date = new Date,
        private _id: string = uuidv4()
    ) {}

    public get nome() : string {
        return this._nome;
    }

    public get sobrenome() : string {
        return this._sobrenome;
    }

    public get cpf() : string {
        return this._cpf;
    }

    public get telefone() : string {
        return this._telefone;
    }

    public get email() : string {
        return this._email;
    }

    public get endereco() : Endereco {
        return this._endereco;
    }

    public get criacao() : Date {
        return this._criacao;
    }

    public get id() : string {
        return this._id;
    }
}

export class Cpf {
    private static cpfComFormatoValido(cpf: string): boolean {
        return cpf
            && cpf.trim().length
            && /[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/g.test(cpf.trim());
    }
    
    private static numerosRepetidos(cpf: string): boolean {
        const numerosRepetidos = [
            '00000000000',
            '11111111111',
            '22222222222',
            '33333333333',
            '44444444444',
            '55555555555',
            '66666666666',
            '77777777777',
            '88888888888',
            '99999999999'
        ]
    
        return numerosRepetidos.includes(cpf)
    }
    
    private static digitoValido(cpf:string , indiceDoDigito: number, multiplicador: number) {
        console.log('argumentos', ...arguments);
        let soma = 0;
        for (let i: number = 0; i < indiceDoDigito; i++) {
            console.log(parseInt(cpf[i]) , soma);
            soma += parseInt(cpf[i]) * multiplicador;
            multiplicador--;
        }
    
        soma = (soma * 10) % 11;
    
        if (soma == 10 || soma == 11) {
            soma = 0;
        }
    
        return soma == parseInt(cpf[indiceDoDigito]);
    }
    
    public static validaCpf(cpf: string): string {
        console.log('VALIDANDO CPF...');
        if (!Cpf.cpfComFormatoValido(cpf)) {
            return 'Formato inválido.';
        }
    
        let somenteNumeros = cpf.trim().replace(/\.|-/g, '');
        console.log('VALIDANDO REPETIDOS...', somenteNumeros);
        if (Cpf.numerosRepetidos(somenteNumeros)) {
            return 'Todos os números iguais.';
        }
    
        if (!Cpf.digitoValido(somenteNumeros, 9, 10) || !Cpf.digitoValido(somenteNumeros, 10, 11)) {
            return 'Dígitos verificadores inválidos.';
        }
    
        return '';
    }
}