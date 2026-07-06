# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *


class VerdictLayer(gl.Contract):
    latest_claim_verdict_json: str
    latest_task_verdict_json: str
    latest_dispute_verdict_json: str
    contract_version: str

    def __init__(self):
        self.contract_version = "verdictlayer-v0.1-deterministic"
        self.latest_claim_verdict_json = '{"module":"claim","verdict":"none","confidence":"low","summary":"No claim verdict submitted yet.","sourcesChecked":0,"generatedAt":"not_submitted"}'
        self.latest_task_verdict_json = '{"module":"task","status":"none","score":0,"feedback":"No task verdict submitted yet.","missingItems":"none","generatedAt":"not_submitted"}'
        self.latest_dispute_verdict_json = '{"module":"dispute","verdict":"none","confidence":"low","reason":"No dispute verdict submitted yet.","recommendedResolution":"Submit a dispute before requesting a resolution.","generatedAt":"not_submitted"}'

    @gl.public.write
    def submit_claim_verdict(self, claim: str, source_url_1: str, source_url_2: str, source_url_3: str) -> None:
        normalized_claim = claim.strip().lower()
        sources_checked = 0
        if source_url_1.strip() != "":
            sources_checked = sources_checked + 1
        if source_url_2.strip() != "":
            sources_checked = sources_checked + 1
        if source_url_3.strip() != "":
            sources_checked = sources_checked + 1
        if normalized_claim == "" or sources_checked == 0:
            verdict = "unclear"
            confidence = "low"
            summary = "Claim and at least one source are required."
        elif "airdrop confirmed" in normalized_claim or "guaranteed airdrop" in normalized_claim:
            verdict = "unclear"
            confidence = "medium"
            summary = "Airdrop claims require stronger confirmation."
        elif "scam" in normalized_claim and sources_checked < 2:
            verdict = "unclear"
            confidence = "low"
            summary = "Serious claims need more than one source."
        elif ("testnet is live" in normalized_claim or "mainnet is live" in normalized_claim) and sources_checked >= 2:
            verdict = "true"
            confidence = "high"
            summary = "The claim is supported by multiple submitted sources."
        elif "ended" in normalized_claim or "expired" in normalized_claim:
            verdict = "outdated"
            confidence = "medium"
            summary = "The claim appears to refer to an ended or expired state."
        else:
            verdict = "unclear"
            if sources_checked == 1:
                confidence = "low"
            elif sources_checked == 2:
                confidence = "medium"
            else:
                confidence = "high"
            summary = "The submitted evidence is not enough for a strong final verdict."
        self.latest_claim_verdict_json = '{"module":"claim","verdict":"' + verdict + '","confidence":"' + confidence + '","summary":"' + summary + '","sourcesChecked":' + str(sources_checked) + ',"generatedAt":"contract_execution"}'

    @gl.public.write
    def submit_task_verdict(self, task_title: str, task_requirements: str, contract_address: str, transaction_hash: str, github_repo_url: str, explanation: str) -> None:
        score = 0
        missing_items = ""
        normalized_requirements = task_requirements.lower()
        explanation_length = len(explanation.strip())
        if contract_address.strip() != "":
            score = score + 25
        else:
            missing_items = "contract address"
        if transaction_hash.strip() != "":
            score = score + 25
        else:
            if missing_items != "":
                missing_items = missing_items + ", "
            missing_items = missing_items + "transaction hash"
        if github_repo_url.strip() != "":
            score = score + 20
        else:
            if missing_items != "":
                missing_items = missing_items + ", "
            missing_items = missing_items + "GitHub repo URL"
        if explanation_length >= 80:
            score = score + 20
        else:
            if missing_items != "":
                missing_items = missing_items + ", "
            missing_items = missing_items + "detailed explanation"
        if "screenshot" in normalized_requirements or "readme" in normalized_requirements or "demo" in normalized_requirements:
            score = score + 10
        if score >= 80:
            status = "accepted"
            feedback = "Submission includes strong proof for the task."
        elif score >= 55:
            status = "needs_review"
            feedback = "Submission has useful proof but still needs review."
        elif score >= 25:
            status = "incomplete"
            feedback = "Submission is missing important proof items."
        else:
            status = "rejected"
            feedback = "Submission does not provide enough proof."
        if missing_items == "":
            missing_items = "none"
        self.latest_task_verdict_json = '{"module":"task","status":"' + status + '","score":' + str(score) + ',"feedback":"' + feedback + '","missingItems":"' + missing_items + '","generatedAt":"contract_execution"}'

    @gl.public.write
    def submit_dispute_verdict(self, dispute_title: str, side_a_claim: str, side_b_claim: str, evidence: str, decision_rule: str) -> None:
        normalized_evidence = evidence.strip().lower()
        if "both parties agree" in normalized_evidence:
            verdict = "split"
            confidence = "high"
            reason = "The evidence indicates both parties agree on a shared resolution."
        elif "side a completed" in normalized_evidence or "a completed" in normalized_evidence or "delivered by side a" in normalized_evidence:
            verdict = "side_a"
            confidence = "high"
            reason = "The evidence favors Side A completion."
        elif "side b is correct" in normalized_evidence or "b is correct" in normalized_evidence or "side a failed" in normalized_evidence:
            verdict = "side_b"
            confidence = "high"
            reason = "The evidence favors Side B."
        elif "partial" in normalized_evidence or "partially" in normalized_evidence or "incomplete" in normalized_evidence:
            verdict = "split"
            confidence = "medium"
            reason = "The evidence suggests partial completion or mixed responsibility."
        elif len(evidence.strip()) < 120:
            verdict = "unclear"
            confidence = "low"
            reason = "The evidence is too short for a strong decision."
        else:
            verdict = "unclear"
            confidence = "medium"
            reason = "The evidence does not clearly favor either side."
        if verdict == "side_a":
            recommended_resolution = "Favor Side A based on the submitted evidence."
        elif verdict == "side_b":
            recommended_resolution = "Favor Side B based on the submitted evidence."
        elif verdict == "split":
            recommended_resolution = "Consider a partial or negotiated resolution."
        else:
            recommended_resolution = "Request clearer evidence before making a final decision."
        self.latest_dispute_verdict_json = '{"module":"dispute","verdict":"' + verdict + '","confidence":"' + confidence + '","reason":"' + reason + '","recommendedResolution":"' + recommended_resolution + '","generatedAt":"contract_execution"}'

    @gl.public.view
    def get_contract_version(self) -> str:
        return self.contract_version

    @gl.public.view
    def get_latest_claim_verdict(self) -> str:
        return self.latest_claim_verdict_json

    @gl.public.view
    def get_latest_task_verdict(self) -> str:
        return self.latest_task_verdict_json

    @gl.public.view
    def get_latest_dispute_verdict(self) -> str:
        return self.latest_dispute_verdict_json
