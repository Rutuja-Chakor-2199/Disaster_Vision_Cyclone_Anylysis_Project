import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Dummy dataset (you can replace with real cyclone data later)
data = {
    "windspeed": [80, 100, 120, 150, 160, 90, 70, 110],
    "pressure": [1000, 990, 980, 970, 960, 995, 1005, 985],
    "risk": ["Low", "Medium", "High", "High", "High", "Medium", "Low", "Medium"],
}

df = pd.DataFrame(data)

# Features and labels
X = df[["windspeed", "pressure"]]
y = df["risk"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "cyclone_model.pkl")
print("✅ Model trained and saved as cyclone_model.pkl")
