
from openai import OpenAI
import secret 


# Create a dedicated agent for the chat assistant
chat_agent = OpenAI(api_key=secret.api_key)

def get_chat_response(history: list, user_message: str) -> str:
    """
    Given the chat history and a new user message,
    generate an assistant reply.
    """
    # Build conversation context
    messages = [{"role": "system", "content": "You are a helpful AI assistant embedded inside an ad recommendation app.Your job is to help the User improve his ads. Be brief, friendly, and suggest helpful questions if stuck."}]
    
    # Add previous history
    for user, assistant in history:
        messages.append({"role": "user", "content": user})
        messages.append({"role": "assistant", "content": assistant})
    
    # Add current user message
    messages.append({"role": "user", "content": user_message})

    # Call OpenAI API (adjust model if needed)
    response = chat_agent.chat.completions.create(
        model="gpt-4.1-mini",  # Or whichever model you're using
        messages=messages,
        temperature=0.7
    )

    # Return assistant's reply
    return response.choices[0].message.content.strip()

def suggest_questions(context: str) -> list:
    """
    Suggest a few helpful user questions based on the current context.
    """
    prompt = f"""
Based on this context inside an ad recommendation application:

\"\"\"{context}\"\"\"

Suggest 3 smart, helpful questions that a user might ask. Return them as a simple Python list like ["Question 1", "Question 2", "Question 3"] — no extra text.
"""
    response = chat_agent.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are a smart marketing assistant suggesting good user questions based on a given context.The User just generated his ads and also searched for similar ads.Your Questions should be related to the ads and Goal is to help the User improve his ads."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    try:
        suggestions = eval(response.choices[0].message.content.strip())
        if isinstance(suggestions, list):
            return suggestions
        return []
    except Exception as e:
        print(f"Failed to parse suggested questions: {e}")
        return []

