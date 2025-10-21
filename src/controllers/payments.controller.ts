import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from 'src/services/payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) {}

  @Post('create')
  createPayment(@Body() body: { orderId:number }) {
    return this.paymentsService.createPayment(body.orderId);
  }

  // endpoint webhook que Wompi llamará (configure in Wompi console)
  @Post('webhook')
  webhook(@Body() body:any) {
    return this.paymentsService.handleWebhook(body);
  }
}
