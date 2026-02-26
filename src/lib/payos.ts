import crypto from "crypto";

const PAYOS_API = "https://api-merchant.payos.vn";

interface PayOSPaymentData {
  orderCode: number;
  amount: number;
  description: string;
  buyerName?: string;
  buyerEmail?: string;
  cancelUrl: string;
  returnUrl: string;
}

interface PayOSResponse {
  code: string;
  desc: string;
  data?: {
    checkoutUrl: string;
    paymentLinkId: string;
    qrCode: string;
  };
}

function generateSignature(data: Record<string, any>, checksumKey: string): string {
  // PayOS signature: sorted key=value pairs joined by &
  const sortedKeys = Object.keys(data).sort();
  const signStr = sortedKeys.map((k) => `${k}=${data[k]}`).join("&");
  return crypto.createHmac("sha256", checksumKey).update(signStr).digest("hex");
}

export async function createPayOSPayment(params: PayOSPaymentData): Promise<{
  checkoutUrl: string;
  paymentLinkId: string;
  orderCode: number;
}> {
  const clientId = process.env.PAYOS_CLIENT_ID!;
  const apiKey = process.env.PAYOS_API_KEY!;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY!;

  const signData = {
    amount: params.amount,
    cancelUrl: params.cancelUrl,
    description: params.description,
    orderCode: params.orderCode,
    returnUrl: params.returnUrl,
  };

  const signature = generateSignature(signData, checksumKey);

  const body = {
    ...signData,
    ...(params.buyerName && { buyerName: params.buyerName }),
    ...(params.buyerEmail && { buyerEmail: params.buyerEmail }),
    signature,
  };

  const res = await fetch(`${PAYOS_API}/v2/payment-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const json: PayOSResponse = await res.json();

  if (json.code !== "00" || !json.data) {
    throw new Error(`PayOS error: ${json.desc}`);
  }

  return {
    checkoutUrl: json.data.checkoutUrl,
    paymentLinkId: json.data.paymentLinkId,
    orderCode: params.orderCode,
  };
}

export function verifyPayOSWebhook(
  webhookData: Record<string, any>,
  checksumKey: string
): boolean {
  const { signature, ...data } = webhookData;
  const expected = generateSignature(data, checksumKey);
  return expected === signature;
}

export function generateOrderCode(): number {
  // PayOS requires numeric order code, max 9 digits
  return Math.floor(100000000 + Math.random() * 900000000);
}
