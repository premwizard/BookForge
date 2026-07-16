from typing import Any
from fastapi import APIRouter, Request, HTTPException

router = APIRouter()

@router.post("/webhook")
async def stripe_webhook(request: Request) -> Any:
    """
    Handle Stripe webhooks for subscription updates.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")

    # In a real application, we would verify the signature using the Stripe SDK:
    # try:
    #     event = stripe.Webhook.construct_event(
    #         payload, sig_header, endpoint_secret
    #     )
    # except ValueError as e:
    #     raise HTTPException(status_code=400, detail="Invalid payload")
    # except stripe.error.SignatureVerificationError as e:
    #     raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Stub: Simulate event parsing
    import json
    try:
        event = json.loads(payload)
        event_type = event.get("type", "")
    except Exception:
        event_type = "unknown"

    print(f"Received Stripe webhook event: {event_type}")

    if event_type == "checkout.session.completed":
        print("Payment successful, activating subscription...")
        # Update user.subscription_status = "Active"
    elif event_type == "customer.subscription.deleted":
        print("Subscription canceled.")
        # Update user.subscription_status = "Inactive"
    else:
        print(f"Unhandled event type: {event_type}")

    return {"status": "success"}
