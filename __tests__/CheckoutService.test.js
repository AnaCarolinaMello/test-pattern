import { jest } from '@jest/globals';
import { CheckoutService } from '../src/services/CheckoutService';
import { UserMother } from './builders/UserMother';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder';
import { Item } from '../src/domain/Item';
import { Pedido } from '../src/domain/Pedido';

describe('CheckoutService', () => {
    describe('quando o pagamento falha', () => {
        it('deve retornar null quando o pagamento falha', async () => {
            // Arrange
            const carrinho = new CarrinhoBuilder().build();
            const cartaoCredito = '1234567890';
            
            // Stub
            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: false })
            };
            
            // Dummies
            const repositoryDummy = {};
            const emailServiceDummy = {};
            
            const checkoutService = new CheckoutService(
                gatewayStub,
                repositoryDummy,
                emailServiceDummy
            );
            
            // Act
            const pedido = await checkoutService.processarPedido(carrinho, cartaoCredito);
            
            // Assert
            expect(pedido).toBeNull();
        });
    });

    describe('quando um cliente Premium finaliza a compra', () => {
        it('deve aplicar desconto de 10% e enviar email de confirmação', async () => {
            // Arrange
            const usuarioPremium = UserMother.umUsuarioPremium();
            const itens = [
                new Item('Produto A', 100.00),
                new Item('Produto B', 100.00)
            ];
            const carrinho = new CarrinhoBuilder()
                .comUser(usuarioPremium)
                .comItens(itens)
                .build();
            const cartaoCredito = '1234567890';
            
            // Stub
            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: true })
            };
            const pedidoSalvo = new Pedido(123, carrinho, 180.00, 'PROCESSADO');
            const repositoryStub = {
                salvar: jest.fn().mockResolvedValue(pedidoSalvo)
            };
            
            // Mock
            const emailMock = {
                enviarEmail: jest.fn().mockResolvedValue(undefined)
            };
            
            const checkoutService = new CheckoutService(
                gatewayStub,
                repositoryStub,
                emailMock
            );
            
            // Act
            await checkoutService.processarPedido(carrinho, cartaoCredito);
            
            // Assert
            expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartaoCredito);            
            expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);            
            expect(emailMock.enviarEmail).toHaveBeenCalledWith(
                usuarioPremium.email,
                'Seu Pedido foi Aprovado!',
                expect.stringContaining('Pedido 123 no valor de R$180')
            );
        });
    });
});