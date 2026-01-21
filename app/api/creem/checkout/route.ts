import { NextResponse } from "next/server";

type RequestBody = {
  successUrl?: string;
  cancelUrl?: string;
};

function resolveBaseUrl(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) return origin;
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return "http://localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  const apiKey = (process.env.CREEM_API_KEY || "").trim();
  const productId = (process.env.CREEM_PRODUCT_ID || "").trim();

  if (!apiKey || !productId) {
    return NextResponse.json(
      { message: "Missing CREEM_API_KEY or CREEM_PRODUCT_ID." },
      { status: 400 }
    );
  }

  let body: RequestBody = {};
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    body = {};
  }

  const baseUrl = resolveBaseUrl(request);
  const successUrl = body.successUrl || `${baseUrl}/success?src=creem`;
  const cancelUrl = body.cancelUrl || `${baseUrl}/result?canceled=1`;

  const isTestKey = apiKey.startsWith("creem_test_");
  const creemBaseUrl = isTestKey
    ? "https://test-api.creem.io"
    : "https://api.creem.io";

  try {
    const response = await fetch(`${creemBaseUrl}/v1/checkouts`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(
        {
          product_id: productId,
          success_url: successUrl,
          cancel_url: cancelUrl,
        },
        (_key, value) => (value === undefined ? undefined : value)
      ),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      if (text.includes("cancel_url should not exist")) {
        const retryResponse = await fetch(`${creemBaseUrl}/v1/checkouts`, {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            Authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            success_url: successUrl,
          }),
        });
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          const checkoutUrl = retryData?.checkout_url || retryData?.checkoutUrl;
          if (checkoutUrl) {
            return NextResponse.json({ checkoutUrl });
          }
        } else if (process.env.NODE_ENV !== "production") {
          const retryText = await retryResponse.text().catch(() => "");
          console.error("Creem checkout retry error:", retryResponse.status, retryText);
        }
      }
      if (process.env.NODE_ENV !== "production") {
        console.error("Creem checkout error:", response.status, text);
        console.error("Creem baseUrl:", creemBaseUrl);
          console.error("Creem request body:", {
            product_id: productId,
            success_url: successUrl,
            cancel_url: cancelUrl,
          });
      }
      return NextResponse.json(
        {
          message: "Creem checkout request failed.",
          status: response.status,
          details: text.slice(0, 500),
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    if (process.env.NODE_ENV !== "production") {
      console.log("Creem checkout response:", response.status, data);
    }
    const checkoutUrl = data?.checkout_url || data?.checkoutUrl;

    if (!checkoutUrl) {
      return NextResponse.json(
        { message: "Creem checkout_url missing in response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Creem checkout request failed:", error);
    }
    return NextResponse.json(
      { message: "Creem checkout request failed." },
      { status: 500 }
    );
  }
}
