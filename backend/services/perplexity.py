import requests
import re
import json
from urllib.parse import urlparse
from config import PERPLEXITY_API_KEY


def is_job_listing_url(url: str) -> bool:
    job_keywords = ["job", "emploi", "posting", "offer", "career", "recruit", "position"]
    return any(keyword in url.lower() for keyword in job_keywords)


def format_citations(citations: list[str]) -> list[dict]:
    cards = []
    for citation in citations:
        if not is_job_listing_url(citation):
            continue

        parsed_url = urlparse(citation)
        domain = parsed_url.netloc.replace('www.', '').replace('.com', '').replace('.ca', '').title()

        path_parts = [p for p in parsed_url.path.split('/') if p and not p.startswith('q-')]
        title = path_parts[-1] if path_parts else domain
        title = title.replace('-', ' ').replace('_', ' ').title()

        if 'indeed' in domain.lower():
            title = title.replace('Q ', '').replace('L ', '')

        cards.append({
            "title": title,
            "description": f"Source: {domain}",
            "link": citation,
        })
    return cards


def extract_json_from_text(text: str) -> dict:
    pattern = r"```json\s*(\{.*?\})\s*```"
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        return {}

    json_str = match.group(1)
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return {}


def query_perplexity(query: str) -> dict:
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }

    system_prompt = (
        "You are a professional career analyst. Return the response strictly in JSON format inside triple backticks.\n"
        "Your JSON should include:\n"
        "- 'skills': a list of the most important technical and soft skills\n"
        "- 'requirements': a list of job requirements or qualifications\n"
        "- 'insights': 2-3 summarized points about the job opportunity or employer\n"
        "Respond ONLY with a JSON object inside triple backticks. Do not include any explanations."
    )

    payload = {
        "model": "sonar-reasoning",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ],
        "temperature": 0.2
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()

        content = data["choices"][0]["message"]["content"]
        citations = data.get("citations", [])
        print(content)

        parsed_json = extract_json_from_text(content)
        print(parsed_json)

        return {
            "structured_data": parsed_json,
            "cards": format_citations(citations),
            "raw_content": content,
            "query": query
        }

    except Exception as e:
        print(f"Error querying Perplexity API: {str(e)}")
        return {
            "structured_data": {},
            "cards": [],
            "raw_content": "Error fetching data",
            "query": query
        }
