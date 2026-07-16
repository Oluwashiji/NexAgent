"""
LLM service. This is the last stop in the pipeline: take the chunks
retrieval found, plus the customer's actual question, and get Groq to
write a real, natural-language answer - but strictly grounded in those
chunks, not the model's general knowledge.

The system prompt below is doing the most important job in this whole
file: it's what stops the chatbot from confidently making things up
about a business it knows nothing about. If the retrieved chunks don't
actually answer the question, we'd rather it say "I don't have that
information" than invent a plausible-sounding wrong answer.
"""
from groq import Groq

from app.core.config import settings

_client = None


def get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


SYSTEM_PROMPT = """You are a helpful customer support assistant for a business.
Answer the customer's question using ONLY the information in the "Context" \
section below. Do not use any outside knowledge.

Rules:
- If the context contains the answer, respond naturally and concisely, as a \
real support agent would.
- If the context does NOT contain enough information to answer, say so \
honestly (e.g. "I don't have that information right now, but I can connect \
you with our team.") - never guess or make something up.
- Do not mention "the context" or "the documents" to the customer; just \
answer as if you simply know this about the business.
"""


def generate_answer(query: str, context_chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_chunks) if context_chunks else "(no relevant information found)"

    user_message = f"""Context:
{context}

Customer question: {query}"""

    client = get_client()
    response = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.3,
        max_tokens=500,
    )
    return response.choices[0].message.content