from openai import OpenAI
import json
import re
import secret

client = OpenAI(api_key=secret.api_key)

def generate_ad(product_desc: str) -> str:
    """Generate an advertisement for the given product."""
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=f"Create a catchy, fun advertisement for this product: {product_desc}"
    )
    return response.output_text


def find_similar_ads(ad_text: str) -> list:
    """Search the web for ads similar to the generated ad and return a list of structured ads."""
    response = client.responses.create(
        model="gpt-4.1-mini",
        tools=[{"type": "web_search_preview"}],
        input=f"""
System Message: 
You are an assistant that helps search for advertisements based on a provided ad text. When searching for ads, you must follow the exact format requested, and return only the necessary details (product_name, ad_title, source, url) in a strict JSON format. If no ads are found, you should return an empty list. Your response must be exactly as specified, without additional commentary or content.

User Message:
Based on the following ad:

\"\"\"{ad_text}\"\"\"

Search the web for similar or related advertisements.
Return the results ONLY in this exact JSON format:
[
  {{
    "product_name": "...",
    "ad_title": "...",
    "source": "...",
    "url": "..."
  }},
  ...
]
If no ads found, just return an empty list: []
"""
    )

    raw_output = response.output_text.strip()

    # 🛠 Fix: Remove triple backticks and optional ```json at the start
    cleaned_output = re.sub(r"^```(?:json)?\s*", "", raw_output)
    cleaned_output = re.sub(r"\s*```$", "", cleaned_output)

    print("==== CLEANED RESPONSE ====")
    print(cleaned_output)
    print("===========================")

    try:
        ads_list = json.loads(cleaned_output)
        if not isinstance(ads_list, list):
            return []
        return ads_list
    except (json.JSONDecodeError, TypeError) as e:
        print(f"Error decoding JSON: {e}")
        print(f"Raw cleaned output was: {cleaned_output}")
        return []
    
def rank_and_filter_ads(ads_list: list) -> list:
    """Rank and filter ads, returning the top 5 based on simple criteria."""

    # Example simple scoring: prioritize if product_name and url are non-empty
    def score(ad):
        score = 0
        if ad.get("product_name"):
            score += 2
        if ad.get("url"):
            score += 2
        if "official" in ad.get("source", "").lower():
            score += 1
        return score

    # Sort ads by their score, descending
    ranked_ads = sorted(ads_list, key=score, reverse=True)

    # Return the top 5
    return ranked_ads[:5]

def format_ads_html(ads_list: list) -> str:
        """Format the ads into an HTML list."""
        html_output = "<ul>"
        for idx, ad in enumerate(ads_list):
            html_output += f"""
            <li>
                <strong>{ad.get('product_name', 'Unknown Product')}</strong><br/>
                <em>{ad.get('ad_title', 'No Title')}</em><br/>
                Source: {ad.get('source', 'Unknown Source')}<br/>
                <a href="{ad.get('url', '#')}" target="_blank">View Ad</a>
            </li>
            """
        html_output += "</ul>"
        return html_output