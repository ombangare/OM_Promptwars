from pydantic import BaseModel, Field

class DecisionInput(BaseModel):
    title: str = Field(default='', max_length=120)
    decision: str = Field(min_length=10, max_length=5000)
    options: list[str] = Field(min_length=1, max_length=8)
    priorities: list[str] = Field(default_factory=list, max_length=12)
    reasons: str = Field(min_length=10, max_length=5000)
    constraints: str = Field(default='', max_length=5000)
    known_facts: str = Field(default='', max_length=5000)

class AssumptionTestRequest(BaseModel):
    assumption: str = Field(min_length=5, max_length=2000)
    context: str = Field(min_length=10, max_length=7000)
    analysis_id: str | None = Field(default=None, max_length=64)

class Assumption(BaseModel):
    title: str
    description: str
    why_it_matters: str
    confidence: str = 'Medium'
    questions: list[str] = []

class BlindSpot(BaseModel):
    title: str
    description: str
    why_it_matters: str

class Conflict(BaseModel):
    title: str
    description: str
    tension: str

class EvidenceGap(BaseModel):
    claim: str
    missing_evidence: str
    verification_method: str

class ReasoningMap(BaseModel):
    decision: str
    reasons: list[str]
    facts: list[str]
    assumption_labels: list[str]
    blind_spot_labels: list[str]
    conflict_labels: list[str]

class AnalysisResult(BaseModel):
    summary: str
    reasoning_map: ReasoningMap
    assumptions: list[Assumption]
    blind_spots: list[BlindSpot]
    conflicts: list[Conflict]
    evidence_gaps: list[EvidenceGap]
    critical_questions: list[str]
    guardrail: str = 'MindXray audits your reasoning. It does not make the decision for you.'

class StressResult(BaseModel):
    why_it_may_hold: str
    why_it_may_fail: str
    evidence_to_seek: list[str]
    questions_to_ask: list[str]
    verification_steps: list[str]
