import requests
from config import PERPLEXITY_API_KEY
from urllib.parse import urlparse
import re

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

def extract_insights(content: str) -> str:
    content = re.sub(r'<think>.*?</think>', '', content, flags=re.DOTALL)
    paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
    for p in paragraphs:
        if 50 < len(p) < 300:
            return p
    return paragraphs[0] if paragraphs else "No insights available."

def extract_skills(content: str) -> list[str]:
    skill_patterns = [
        r"(?:proficiency in|experience with|knowledge of|skills? include)[:\-]?\s*([^\.\n]+)",
        r"(?:ERP systems like|including|such as)\s*([^\.\n]+)",
        r"(?:requir(?:e|ing)|prefer)\s.*?(?:experience|knowledge|skills?)\s*(?:in|with)?\s*([^\.\n]+)"
    ]
    
    skills = set()
    for pattern in skill_patterns:
        matches = re.finditer(pattern, content, re.IGNORECASE)
        for match in matches:
            parts = re.split(r',|;|and|or|/|•|\+', match.group(1))
            for part in parts:
                skill = part.strip(" *:-").title()
                if len(skill) > 2 and not skill.isdigit():
                    skills.add(skill)
    return sorted(skills, key=lambda x: (-len(x), x))

def query_perplexity(query: str, is_cover_letter: bool = False) -> dict:
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "model": "sonar-medium-chat" if is_cover_letter else "sonar-reasoning-pro",
        "messages": [
            {
                "role": "system",
                "content": "You are a professional career advisor." if is_cover_letter 
                          else "You are a helpful research assistant."
            },
            {
                "role": "user",
                "content": query
            }
        ],
        "temperature": 0.7 if is_cover_letter else 0.2,
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()

    if is_cover_letter:
        return {
            "cover_letter": data["choices"][0]["message"]["content"]
        }
    else:
        message = data["choices"][0]["message"]["content"]
        citations = data.get("citations", [])
        
        return {
            "cards": format_citations(citations),
            "insights": extract_insights(message),
            "skills": extract_skills(message),
            "original_content": message,
            "query": query
        }