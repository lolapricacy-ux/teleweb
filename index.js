const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Payment } = require("mercadopago");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

if (!process.env.MP_ACCESS_TOKEN) {
  console.error("MP_ACCESS_TOKEN is required in .env");
  process.exit(1);
}

const mpConfig = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const paymentClient = new Payment(mpConfig);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
});

app.post("/create-payment", async (req, res) => {
  const { plan, amount, email } = req.body;

  if (!plan || !amount || !email) {
    return res.status(400).json({ error: "plan, amount and email are required" });
  }

  try {
    const paymentData = {
      transaction_amount: Number(amount),
      description: `${plan} - TeleWeb`,
      payment_method_id: "pix",
      payer: {
        email,
      },
      external_reference: `teleweb-${Date.now()}`,
    };

    const payment = await paymentClient.create({ body: paymentData });
    const transaction = payment.point_of_interaction?.transaction_data || {};

    return res.json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      qr_code: transaction.qr_code,
      qr_code_base64: transaction.qr_code_base64,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar pagamento Pix" });
  }
});

app.get("/payment-status/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "payment id is required" });
  }

  try {
    const payment = await paymentClient.get({ id });
    return res.json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar status do pagamento" });
  }
});

app.listen(PORT, () => {
  console.log(`Payment server running on http://localhost:${PORT}`);
});
