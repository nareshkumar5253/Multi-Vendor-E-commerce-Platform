import uuid


class PaymentService:

    @staticmethod
    def process_payment(amount: float, payment_method: str):
        return {
            "success": True,
            "transaction_id": str(uuid.uuid4()),
            "amount": amount,
            "payment_method": payment_method
        }