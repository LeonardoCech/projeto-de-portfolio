from fastapi import HTTPException, Request
from pydantic import BaseModel

from fastapi import APIRouter

router = APIRouter()


# Define um modelo para o payload do webhook
class WebhookPayload(BaseModel):
    event: str
    data: dict


@router.post("/pluggy")
async def webhook_handler(request: Request):
    """
    Endpoint para receber chamadas de webhook.
    """
    try:
        payload = await request.json()
        
        # Processamento adicional pode ser feito aqui
        # Exemplo: salvar no banco de dados ou acionar outra lógica

        return {"status": "success", "message": "Webhook received"}
    except Exception as e:
        # Caso ocorra erro
        raise HTTPException(status_code=500, detail=str(e))
