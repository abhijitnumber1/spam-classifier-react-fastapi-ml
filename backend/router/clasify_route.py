from fastapi import APIRouter, HTTPException, Request, status
from limiter_config import limiter
import pickle

from clasify.schema import Clasify

router = APIRouter(
    prefix="/clasify",
    tags=["clasify"],
    responses={404: {"description": "Not found"}},
)

@router.post("")
@limiter.limit("10/minute")
async def clasify(request: Request, request_body: Clasify):
    try:
        data = request_body.model_dump()
        # print(data)
        if not data["clasification_text"]:
            return HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bad Request",
            )
            
        
        # Load the vectorizer once at startup
        with open("vectorizer.pkl", "rb") as f:
            tfidf_vectorizer = pickle.load(f)
        vectorized_text = tfidf_vectorizer.transform([data['clasification_text']]).toarray()
        # print(vectorized_text)
        
        with open("model.pkl", "rb") as f:
            model = pickle.load(f)
        prediction = int(model.predict(vectorized_text)[0])
        # print(prediction)
        data["prediction"] = prediction
        return data
    except Exception as e:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Intrenal Server Error",
        )