import { Carrinho } from '../../src/domain/Carrinho';
import { Item } from '../../src/domain/Item';
import { User } from '../../src/domain/User';

export class CarrinhoBuilder {
    constructor() {
        // Valores padrão: um carrinho com 1 item padrão
        this.user = new User(1, 'Usuario Padrao', 'usuario@example.com', 'PADRAO');
        this.itens = [
            new Item('Item Padrao', 10.00)
        ];
    }

    comUser(user) {
        this.user = user;
        return this;
    }

    comItens(itens) {
        this.itens = itens;
        return this;
    }

    vazio() {
        this.itens = [];
        return this;
    }

    build() {
        return new Carrinho(this.user, this.itens);
    }
}