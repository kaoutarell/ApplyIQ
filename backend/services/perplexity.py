import requests
from config import PERPLEXITY_API_KEY
from urllib.parse import urlparse
import re
import pprint

# --- Utility functions ---

def is_job_listing_url(url):  # filtering
    job_keywords = ["job", "emploi", "posting", "offer", "career", "recruit", "position"]
    return any(keyword in url.lower() for keyword in job_keywords)

#updated - we don't want to show the first sentence (not important)
def extract_think_and_cleaned_content(content: str):
    """Extract think text and clean content with improved formatting"""
    think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
    think_text = think_match.group(1).strip() if think_match else ""
    
    # Remove everything before the first result reference
    if think_text:
        # Find the first occurrence of "result [X]" or similar pattern
        result_match = re.search(r'(Looking at result|Result|result)\s*\[?\d+\]?', think_text, re.IGNORECASE)
        if result_match:
            think_text = think_text[result_match.start():]
        
        # Also remove any remaining initial sentences that might be before the first result
        sentences = re.split(r'(?<=[.!?])\s+', think_text)
        if len(sentences) > 1 and not re.match(r'(Looking at|Result|result)', sentences[0], re.IGNORECASE):
            think_text = ' '.join(sentences[1:])
    
    cleaned_content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
    
    # Format the content
    think_text = format_content(think_text)
    cleaned_content = format_content(cleaned_content)
    
    return think_text, cleaned_content

def format_content(text: str) -> str:
    """Format content with proper line breaks and heading handling"""
    # Convert Result[X] to bullet points
    text = re.sub(r'Result\s*\[\d+\]', lambda m: f"\n- {m.group(0)}", text)
    
    # Convert **heading** to \n## heading\n
    text = re.sub(r'\*\*(.*?)\*\*', r'\n## \1\n', text)
    
    # Convert # heading to \n### heading\n
    text = re.sub(r'#\s+(.*?)(?:\n|$)', r'\n### \1\n', text)
    
    # Ensure proper spacing between sections
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()

def format_citations(citations):  # extract only useful citation info
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

def extract_skills_and_certifications(text):
    # Basic patterns for skills and certs
    skills_pattern = re.compile(
        r"(skills\s*(?:required|preferred)?[:\-]\s*|skills include\s*|proficiency in\s*)(.+?)(?:\n|\.|\Z)", re.IGNORECASE)
    certs_pattern = re.compile(
        r"(certifications\s*(?:required|preferred)?[:\-]\s*|certifications include\s*|certified in\s*)(.+?)(?:\n|\.|\Z)", re.IGNORECASE)

    skills_matches = skills_pattern.findall(text)
    certs_matches = certs_pattern.findall(text)

    # Flatten and clean results
    skills = []
    for _, match in skills_matches:
        parts = re.split(r',|and|or|/|•', match)
        skills.extend([s.strip(" *:-").title() for s in parts if len(s.strip()) > 1])

    certifications = []
    for _, match in certs_matches:
        parts = re.split(r',|and|or|/|•', match)
        certifications.extend([c.strip(" *:-").title() for c in parts if len(c.strip()) > 1])

    return list(set(skills)), list(set(certifications))

# --- Main service function ---

def query_perplexity(query: str):
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "temperature": 0.2,
        "top_p": 0.9,
        "return_images": False,
        "return_related_questions": False,
        "top_k": 0,
        "stream": False,
        "presence_penalty": 0,
        "frequency_penalty": 1,
        "web_search_options": {"search_context_size": "low"},
        "search_domain_filter": [
            "indeed.com", "jobillico.com", "jobbank.gc.ca", "glassdoor.com",
            "monster.ca", "emplois.ca.indeed.com", "workopolis.com", "montreal-job.ca"
        ],
        "model": "sonar-reasoning-pro",
        "messages": [{"role": "user", "content": query}],
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    pprint.pprint(data)  # Log raw response for testing

    # Extract core fields
    message = data["choices"][0]["message"]["content"]
    citations = data.get("citations", [])

    # Apply custom logic
    think_text, assistant_text = extract_think_and_cleaned_content(message)
    citation_cards = format_citations(citations)
    skills, certifications = extract_skills_and_certifications(assistant_text)

    # Final structured result
    return {
        "cards": citation_cards,
        "assistant_text": assistant_text,
        "think_text": think_text,
        "skills": skills,
        "certifications": certifications
    }
