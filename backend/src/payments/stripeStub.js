// Payment stub - do NOT use in production. Integrate with Stripe (Checkout/Elements) or another PCI-compliant provider.
// This file simulates creating a payment intent and verifying webhooks.

module.exports = {
  async createPaymentIntent({ amount, currency = 'usd' }){
    // In production, call Stripe SDK: stripe.paymentIntents.create({ amount, currency })
    return { id: `pi_stub_${Date.now()}`, amount, currency, status: 'requires_payment_method' };
  },
  verifyWebhook(req){
    throw new Error('Webhook verification not implemented. Integrate with a real payment provider before using in production.');
  }
}
