export async function GET(request: Request) {
  return new Response("Hello, from API! + " + JSON.stringify(request));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received webhook payload:", body);

    // Process the webhook data here

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
