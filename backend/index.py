from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from limiter_config import limiter



from router import clasify_route
app = FastAPI()

app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(clasify_route.router)

@app.get("/")
async def root():
    return {"message": "Hello from main app!"}