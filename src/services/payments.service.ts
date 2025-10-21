import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentsService {
    private baseUrl = 'https://sandbox.wompi.co/v1';
    private publicKey: string;
    private privateKey: string;

    constructor(
        private readonly ordersService: OrdersService,
        private readonly configService: ConfigService,
    ) {
        this.publicKey = this.configService.get<string>('WOMPI_PUBLIC_KEY')!;
        this.privateKey = this.configService.get<string>('WOMPI_PRIVATE_KEY')!;
    }
    async createPayment(orderId: number) {
        const order = await this.ordersService.findOne(orderId);
        if (!order) throw new NotFoundException('Orden no encontrada');

        // 1️⃣ Tokenizar la tarjeta (simula el ingreso del cliente)
        const cardPayload = {
            number: '4242424242424242',
            exp_month: '12',
            exp_year: '29',
            cvc: '123',
            card_holder: 'Juan Perez',
        };

        const tokenResp = await axios.post(`${this.baseUrl}/tokens/cards`, cardPayload, {
            headers: { Authorization: `Bearer ${this.publicKey}` },
        });

        const token = tokenResp.data.data.id; // ID del token

        // 2️⃣ Crear transacción usando la tarjeta tokenizada
        const txPayload = {
            amount_in_cents: Math.round(order.total * 100),
            currency: 'COP',
            customer_email: 'cliente@ejemplo.com',
            reference: `${order.id}`,
            payment_method: {
                type: 'CARD',
                token,
            },
        };

        try {
            const resp = await axios.post(`${this.baseUrl}/transactions`, txPayload, {
                headers: { Authorization: `Bearer ${this.privateKey}` },
            });
            return resp.data;
        } catch (error) {
            console.error('Error Wompi:', error.response?.data || error.message);
            throw new Error('Error al crear pago en Wompi');
        }
    }

    async handleWebhook(data: any) {
        const event = data;
        const reference = event.data.metadata?.reference || null;
        const orderId = parseInt(reference, 10);
        if (orderId) {
            await this.ordersService.markPaid(orderId, event);
        }
        return { ok: true };
    }

}
