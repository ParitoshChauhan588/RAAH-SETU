from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime
import bcrypt
import os

app = Flask(__name__)
CORS(app)

# MySQL Database Configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "raah_setu")
}

# Helper function to get database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"Database connection error: {e}")
        return None

# Helper function to hash password
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Helper function to verify password
def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# ==================== AUTHENTICATION ENDPOINTS ====================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')

        if not all([name, email, phone, password]):
            return jsonify({'error': 'All fields are required'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)

        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email already registered'}), 409

        # Hash password
        hashed_password = hash_password(password)

        # Insert user
        cursor.execute(
            "INSERT INTO users (name, email, phone, password, created_at) VALUES (%s, %s, %s, %s, NOW())",
            (name, email, phone, hashed_password)
        )
        conn.commit()
        user_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({
            'message': 'User registered successfully',
            'user_id': user_id,
            'email': email
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)

        # Get user
        cursor.execute("SELECT id, name, email, password FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user or not verify_password(password, user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401

        return jsonify({
            'message': 'Login successful',
            'user_id': user['id'],
            'name': user['name'],
            'email': user['email']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== EMERGENCY CONTACTS ENDPOINTS ====================

@app.route('/api/emergency-contacts', methods=['GET'])
def get_emergency_contacts():
    """Get all emergency contacts for a user"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, name, phone, relationship, priority, email FROM emergency_contacts WHERE user_id = %s ORDER BY priority DESC",
            (user_id,)
        )
        contacts = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({'contacts': contacts}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emergency-contacts', methods=['POST'])
def create_emergency_contact():
    """Create a new emergency contact"""
    try:
        data = request.json
        user_id = data.get('user_id')
        name = data.get('name')
        phone = data.get('phone')
        relationship = data.get('relationship')
        priority = data.get('priority', 'medium')
        email = data.get('email', '')

        if not all([user_id, name, phone, relationship]):
            return jsonify({'error': 'Required fields missing'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO emergency_contacts (user_id, name, phone, relationship, priority, email, created_at) VALUES (%s, %s, %s, %s, %s, %s, NOW())",
            (user_id, name, phone, relationship, priority, email)
        )
        conn.commit()
        contact_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({
            'message': 'Emergency contact created',
            'contact_id': contact_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emergency-contacts/<int:contact_id>', methods=['PUT'])
def update_emergency_contact(contact_id):
    """Update an emergency contact"""
    try:
        data = request.json
        name = data.get('name')
        phone = data.get('phone')
        relationship = data.get('relationship')
        priority = data.get('priority')
        email = data.get('email')

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor()
        cursor.execute(
            "UPDATE emergency_contacts SET name = %s, phone = %s, relationship = %s, priority = %s, email = %s WHERE id = %s",
            (name, phone, relationship, priority, email, contact_id)
        )
        conn.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Contact not found'}), 404

        cursor.close()
        conn.close()

        return jsonify({'message': 'Contact updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emergency-contacts/<int:contact_id>', methods=['DELETE'])
def delete_emergency_contact(contact_id):
    """Delete an emergency contact"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor()
        cursor.execute("DELETE FROM emergency_contacts WHERE id = %s", (contact_id,))
        conn.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Contact not found'}), 404

        cursor.close()
        conn.close()

        return jsonify({'message': 'Contact deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== HEALTH CHECK ENDPOINTS ====================

@app.route('/api/health-checks', methods=['GET'])
def get_health_checks():
    """Get health checks for a user"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, mood, heart_rate, location, notes, created_at FROM health_checks WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )
        checks = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({'checks': checks}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health-checks', methods=['POST'])
def create_health_check():
    """Create a new health check"""
    try:
        data = request.json
        user_id = data.get('user_id')
        mood = data.get('mood')
        heart_rate = data.get('heart_rate')
        location = data.get('location', '')
        notes = data.get('notes', '')

        if not all([user_id, mood]):
            return jsonify({'error': 'User ID and mood required'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO health_checks (user_id, mood, heart_rate, location, notes, created_at) VALUES (%s, %s, %s, %s, %s, NOW())",
            (user_id, mood, heart_rate, location, notes)
        )
        conn.commit()
        check_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({
            'message': 'Health check recorded',
            'check_id': check_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== INCIDENT REPORT ENDPOINTS ====================

@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    """Get incidents for a user"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, title, description, type, severity, location, status, created_at FROM incidents WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )
        incidents = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({'incidents': incidents}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/incidents', methods=['POST'])
def create_incident():
    """Create a new incident report"""
    try:
        data = request.json
        user_id = data.get('user_id')
        title = data.get('title')
        description = data.get('description')
        incident_type = data.get('type')
        severity = data.get('severity', 'medium')
        location = data.get('location')

        if not all([user_id, title, description, incident_type, location]):
            return jsonify({'error': 'Required fields missing'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO incidents (user_id, title, description, type, severity, location, status, created_at) VALUES (%s, %s, %s, %s, %s, %s, 'reported', NOW())",
            (user_id, title, description, incident_type, severity, location)
        )
        conn.commit()
        incident_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({
            'message': 'Incident reported',
            'incident_id': incident_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== ACTIVITY LOG ENDPOINTS ====================

@app.route('/api/activities', methods=['GET'])
def get_activities():
    """Get activities for a user"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, activity_type, description, location, created_at FROM activities WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )
        activities = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({'activities': activities}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/activities', methods=['POST'])
def create_activity():
    """Log a new activity"""
    try:
        data = request.json
        user_id = data.get('user_id')
        activity_type = data.get('type')
        description = data.get('description')
        location = data.get('location', '')

        if not all([user_id, activity_type, description]):
            return jsonify({'error': 'Required fields missing'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO activities (user_id, activity_type, description, location, created_at) VALUES (%s, %s, %s, %s, NOW())",
            (user_id, activity_type, description, location)
        )
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Activity logged'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== SOS ENDPOINT ====================

@app.route('/api/sos/activate', methods=['POST'])
def activate_sos():
    """Activate SOS alert"""
    try:
        data = request.json
        user_id = data.get('user_id')
        location = data.get('location')

        if not user_id:
            return jsonify({'error': 'User ID required'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO sos_alerts (user_id, location, status, created_at) VALUES (%s, %s, 'active', NOW())",
            (user_id, location)
        )
        conn.commit()
        sos_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({
            'message': 'SOS activated',
            'sos_id': sos_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'status': 'ok',
        'message': 'RAAH-SETU API is running',
        'version': '2.0'
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
