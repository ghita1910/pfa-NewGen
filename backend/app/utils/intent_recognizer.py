import spacy

nlp = spacy.load("fr_core_news_md")

intents = {
    "demande_service": ["je veux réserver", "je veux un service", "réserver un prestataire", "j’ai besoin de"],
    "salutation": ["bonjour", "salut", "hello", "coucou"],
    "remerciement": ["merci", "merci beaucoup", "thanks"],
    "aurevoir": ["au revoir", "bye", "à bientôt"]
}

def recognize_intent(user_input: str) -> str:
    doc = nlp(user_input.lower())

    for intent, examples in intents.items():
        for example in examples:
            if example in doc.text:
                return intent
    return "inconnu"
