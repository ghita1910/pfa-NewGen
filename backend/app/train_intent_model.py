import json
import random
import pickle

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

# Charger les intentions
with open("intents.json", "r", encoding="utf-8") as file:
    data = json.load(file)

X = []
y = []

# Préparer les données
for intent in data["intents"]:
    for pattern in intent["patterns"]:
        X.append(pattern)
        y.append(intent["tag"])

# Vectoriser les textes
vectorizer = CountVectorizer()
X_vec = vectorizer.fit_transform(X)

# Entraîner un modèle
model = LogisticRegression()
model.fit(X_vec, y)

# Sauvegarder le modèle et le vectorizer
with open("intent_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("✅ Modèle entraîné et sauvegardé.")

