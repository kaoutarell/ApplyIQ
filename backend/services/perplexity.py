import requests
from config import PERPLEXITY_API_KEY
import re
import pprint

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
        "model": "sonar",
        "messages": [{"role": "user", "content": query}],
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    pprint.pprint(data)  # Log raw response for testing

    text = data["choices"][0]["message"]["content"]
    citations = data.get("citations", [])

    jobs = []
    entries = re.split(r'\n(?=\d+\.\s)', text.strip())  # Split numbered entries

    for i, entry in enumerate(entries):
        # Extract title: e.g., **Google Software Engineering Internship**
        title_match = re.search(r"\*\*(.*?)\*\*", entry)
        title = title_match.group(1).strip() if title_match else f"Opportunity {i+1}"

        # Extract description: first paragraph/sentence after the title
        desc_match = re.search(r"\*\*.*?\*\*:\s*(.*?)(?:\n\n|\n\d+\.|\Z)", entry, re.DOTALL)
        description = desc_match.group(1).strip() if desc_match else "Follow the link for more info"

        # Clean formatting
        description = re.sub(r"\[\d+\]", "", description)  # remove citation refs like [1]
        description = re.sub(r"\s{2,}", " ", description)

        # Assign link (loop through if fewer citations than jobs)
        link = citations[i % len(citations)] if citations else "#"

        jobs.append({
            "title": title,
            "description": description,
            "link": link,
        })

        # Needs more improvement -- 

    return jobs
