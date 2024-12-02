from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Load model and tokenizer (assumes you have saved these)
tokenizer = Tokenizer(num_words=10000)
model = tf.keras.models.load_model('spam_detection_model.h5')

# Load the dataset to fit tokenizer (assuming it's the same as training data)
df = pd.read_csv("messages.csv", encoding='latin-1')
df['message'] = df['message'].str.lower()
tokenizer.fit_on_texts(df['message'])

max_len = 100

# Define function to preprocess input
def preprocess_email(email):
    email = email.lower()
    email = email.replace(r'^.+@[^\.].*\.[a-z]{2,}$', 'emailaddress')
    email = email.replace(r'^http\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(/\S*)?$', 'webaddress')
    email = email.replace(r'£|\$', 'dollars')
    email = email.replace(r'\d+(\.\d+)?', 'number')
    email = email.replace(r'[^\w\d\s]', ' ')
    email = email.replace(r'\s+', ' ')
    return email.strip()

# Define prediction route
@app.route('/analyze', methods=['POST'])  
def predict():
    data = request.get_json()
    email = data['email']

    # Preprocess the email
    email = preprocess_email(email)

    # Tokenize and pad the email
    sequence = tokenizer.texts_to_sequences([email])
    padded_sequence = pad_sequences(sequence, maxlen=max_len)

    # Predict using the loaded model
    prediction = model.predict(padded_sequence)
    result = 'SPAM' if prediction[0][0] > 0.5 else 'NOT SPAM'

    # Return the prediction result
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
