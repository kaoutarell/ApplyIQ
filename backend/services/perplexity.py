import requests
from config import PERPLEXITY_API_KEY
import pprint
from urllib.parse import urlparse

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
            "indeed.com",
            "jobillico.com",
            "jobbank.gc.ca",
            "glassdoor.com",
            "monster.ca",
            "emplois.ca.indeed.com",
            "workopolis.com",
            "montreal-job.ca"
        ],
        "model": "sonar-reasoning-pro", #changing deep-reasoning - see commit comments
        "messages": [{"role": "user", "content": query}],
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    pprint.pprint(data)  # Log raw response for testing

    citations = data.get("citations", [])
    
    # Process citations into AnswerCard format
    citation_cards = []
    for citation in citations:
        if not is_job_listing_url(citation):
            continue

        parsed_url = urlparse(citation)
        domain = parsed_url.netloc.replace('www.', '').replace('.com', '').replace('.ca', '').title()
        
        # Extract meaningful title from URL
        path_parts = [p for p in parsed_url.path.split('/') if p and not p.startswith('q-')]
        title = path_parts[-1] if path_parts else domain
        title = title.replace('-', ' ').replace('_', ' ').title()
        
        # Clean up special cases
        if 'indeed' in domain.lower():
            title = title.replace('Q ', '').replace('L ', '')
        
        citation_cards.append({
            "title": f"{title}",
            "description": f"Source: {domain}",
            "link": citation,
        })

    return citation_cards

# new function that helps in filtering the findings - narrow it to only the job related links
def is_job_listing_url(url):
    job_keywords = ["job", "emploi", "posting", "offer", "career", "recruit", "position"]
    return any(keyword in url.lower() for keyword in job_keywords)
