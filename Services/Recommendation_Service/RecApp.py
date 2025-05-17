from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from src.agents import Search_Agent as Agent1
from src.agents import Assistant_Agent as Assistant
from src.agents import Ad_Performance_Predictor as Performance
import os
import sys


chat_history = []  # Store chat history for the assistant

app = FastAPI()

# Compute root directory (2 levels up from this file)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, BASE_DIR)



# Mount static and templates from the project root
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))



@app.get("/", response_class=HTMLResponse)
async def get_index(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "generated_ad": "",
        "similar_ads": "",
        "suggested_questions": []
    })


@app.post("/", response_class=HTMLResponse)
async def post_index(
    request: Request,
    product: str = Form(...)
):
    # Step 1: Generate ad
    generated_ad = Agent1.generate_ad(product)

    # Step 2: Search for similar ads
    similar_ads_list = Agent1.find_similar_ads(generated_ad)

    # Step 3: Rank and filter the ads
    top_ads = Agent1.rank_and_filter_ads(similar_ads_list)

    # Step 4: Format ads for HTML rendering
    similar_ads_html = Agent1.format_ads_html(top_ads)

    # Step 5: Prepare context for suggested questions
    context = f"{generated_ad}\n\nSimilar Ads:\n" + "\n".join([ad.get('ad_title', '') for ad in top_ads])

    # Step 6: Get suggested questions
    suggested_questions = Assistant.suggest_questions(context)

    return templates.TemplateResponse("index.html", {
        "request": request,
        "generated_ad": generated_ad,
        "similar_ads": similar_ads_html,
        "suggested_questions": suggested_questions
    })


@app.post("/chat")
async def chat(message: str = Form(...)):
    assistant_reply = Assistant.get_chat_response(chat_history, message)
    chat_history.append((message, assistant_reply))
    return JSONResponse({"assistant_reply": assistant_reply})


@app.post("/predict_ctr")
async def predict_ctr(product: str = Form(...)):
    if not product:
        return JSONResponse({"error": "Product description is required"}, status_code=400)

    predicted_ctr = Performance.predict_ctr_from_description(product)
    if predicted_ctr is None:
        return JSONResponse({"error": "Failed to predict CTR"}, status_code=500)

    evaluation = Performance.evaluate_ctr_with_llm(predicted_ctr, product)

    return JSONResponse({
        "ctr": predicted_ctr * 100,
        "evaluation": evaluation
    })
