import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()


class EmailService:

    @staticmethod
    def send_email(to_email: str, subject: str, body: str):
        email_host = os.getenv("EMAIL_HOST")
        email_port = int(os.getenv("EMAIL_PORT", 587))
        email_username = os.getenv("EMAIL_USERNAME")
        email_password = os.getenv("EMAIL_PASSWORD")

        if not email_username or not email_password:
            print("Email credentials not configured")
            return False

        msg = EmailMessage()
        msg["From"] = email_username
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.set_content(body)

        try:
            with smtplib.SMTP(email_host, email_port) as server:
                server.starttls()
                server.login(email_username, email_password)
                server.send_message(msg)

            return True

        except Exception as e:
            print("Email sending failed:", e)
            return False