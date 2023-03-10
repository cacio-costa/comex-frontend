export class DateUtil {

    public static formataDateParaString(data: Date, formato: string = 'pt-BR'): string {
        return new Intl.DateTimeFormat(formato).format(data);
    }

}

