import requests
from config import PERPLEXITY_API_KEY
import json
from typing import Dict, Any, Optional
import re


def extract_json_from_text(text: str) -> dict:
    """
    Extracts JSON snippet enclosed in triple backticks from the input string,
    parses it, and returns it as a Python dictionary.

    If no valid JSON found, returns an empty dictionary.
    """
    pattern = r"```json\s*(\{.*?\})\s*```"
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        return {}

    json_str = match.group(1)
    try:
        data = json.loads(json_str)
        return data
    except json.JSONDecodeError:
        return {}


def estimate_salary(skills: list[str], location: str) -> Dict[str, Any]:
    prompt = {
        "role": "user",
        "content": f"""Provide a detailed salary estimate for someone with these skills: {', '.join(skills)} in {location}.
        Return ONLY a JSON response with these keys:
        - range (format like '90k-110k')
        - breakdown (key-value pairs of skills and their impact)
        - location_impact (how location affects salary)
        - source (data source)
        
        Example response format:
        {{
            "range": "100k-150k",
            "breakdown": {{
                "Python": "+15%",
                "AWS": "+20%"
            }},
            "location_impact": "Salaries in this location are 20% higher than national average",
            "source": "Source information"
        }}"""
    }

    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "model": "sonar-reasoning",
        "messages": [
            {
                "role": "system",
                "content": "You are a compensation analyst. Provide accurate salary data in JSON format. Respond ONLY with the JSON object, nothing else."
            },
            prompt
        ],
        "temperature": 0.3
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        content = data["choices"][0]["message"]["content"]
        print("Raw Perplexity API content:", content)

        # Try to extract JSON using the triple backtick extractor
        json_data = extract_json_from_text(content)

        if json_data:
            return json_data
        else:
            # Fallback: try parsing content directly or previous method
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                print(f"Failed to parse JSON from response: {content}")
                return {
                    "range": "Data unavailable",
                    "breakdown": {},
                    "location_impact": "Unable to determine location impact",
                    "source": "Perplexity AI"
                }
        
    except Exception as e:
        print(f"Error estimating salary: {str(e)}")
        print(f"Response content: {response.text if 'response' in locals() else 'No response'}")
        return {
            "range": "Data unavailable",
            "breakdown": {},
            "location_impact": "Unable to determine location impact",
            "source": "Perplexity AI"
        }
