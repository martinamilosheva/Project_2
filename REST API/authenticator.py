from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

valid_users = [
    ('User123', 'Pass123'), 
    ('User456', 'Pass456'),
    ('User789', 'Pass789')]

@app.route('/api/authentication', methods=['POST'])
def handle_user_authentication():
    if request.is_json:
        data = request.get_json()

        if 'username' in data and 'password' in data:
            name, password = data['username'], data['password']
            response = {}
            status = 0

            if (name, password) in valid_users:
                response = {'message': 'Valid authentication.'}
                status = 200
            else:
                response = {'message': 'Invalid authentication.'}
                status = 401

            return jsonify(response), status
        else:
            return jsonify({'error': 'Missing keys.'}), 400
    else:
        return jsonify({'error': 'Request must be in JSON format'}), 400

if __name__ == '__main__':
    app.run(debug=True)
