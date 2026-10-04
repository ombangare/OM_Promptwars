import json
from google import genai
from app.settings import settings
from app.schemas import DecisionInput, AnalysisResult, StressResult

SYSTEM = """You are MindXray, a neutral decision-reasoning auditor.

Your job is to help the user think more critically. You MUST NOT decide for the user.
Never recommend, rank, select, score, or declare a best option.
Never output a final decision.

Analyze the user's reasoning for assumptions, overlooked factors, internal conflicts, evidence gaps, trade-offs, and critical questions.
Distinguish stated facts from assumptions. Be specific and intellectually honest.
"""

def _client():
    if not settings.gemini_api_key:
        raise RuntimeError('GEMINI_API_KEY is not configured')
    return genai.Client(api_key=settings.gemini_api_key)

def _text_output_schema(model):
    return {'type':'text','mime_type':'application/json','schema':model.model_json_schema()}

def analyze_decision(data: DecisionInput) -> AnalysisResult:
    prompt=f"""Audit this decision reasoning without deciding for the user.
Decision: {data.decision}
Options: {json.dumps(data.options)}
Priorities: {json.dumps(data.priorities)}
Reasons: {data.reasons}
Constraints: {data.constraints}
Known facts: {data.known_facts}
Return structured JSON only."""
    interaction=_client().interactions.create(model=settings.gemini_model,input=prompt,response_format=_text_output_schema(AnalysisResult),system_instruction=SYSTEM)
    return AnalysisResult.model_validate_json(interaction.output_text)

def stress_test(assumption: str, context: str) -> StressResult:
    prompt=f"""Stress-test this assumption without deciding the user's choice.
Assumption: {assumption}
Context: {context}
Return why it may hold, why it may fail, evidence to seek, questions to ask and verification steps.
"""
    interaction=_client().interactions.create(model=settings.gemini_model,input=prompt,response_format=_text_output_schema(StressResult),system_instruction=SYSTEM)
    return StressResult.model_validate_json(interaction.output_text)
