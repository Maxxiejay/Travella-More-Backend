from flask import Flask, render_template, jsonify, redirect, url_for, request
import os
import json

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default-secret-key")

@app.route('/')
def index():
    """Render the home page."""
    # Check if format=json is specified in query parameters
    if request.args.get('format') == 'json':
        return jsonify({
            "message": "Authentication API Frontend",
            "api_status": "running",
            "endpoints": {
                "api": "/api",
                "auth": "/api/auth"
            }
        })
    return render_template('index.html')

@app.route('/api')
def api_index():
    """API information endpoint."""
    api_info = {
        "name": "Authentication API",
        "version": "1.0.0",
        "status": "active"
    }
    
    # Check if format=json is specified in query parameters
    if request.args.get('format') == 'json':
        return jsonify(api_info)
    
    return render_template('api.html', api_info=api_info)

@app.route('/api/auth')
def auth_index():
    """Authentication API information endpoint."""
    auth_endpoints = {
        "endpoints": {
            "signup": "/api/auth/signup",
            "signin": "/api/auth/signin",
            "profile": "/api/auth/profile",
            "verify-email": "/api/auth/verify-email/:token",
            "resend-verification": "/api/auth/resend-verification",
            "forgot-password": "/api/auth/forgot-password",
            "reset-password": "/api/auth/reset-password/:token",
            "test-email": "/api/auth/test-email"
        }
    }
    
    # Check if format=json is specified in query parameters
    if request.args.get('format') == 'json':
        return jsonify(auth_endpoints)
    
    return render_template('auth.html', endpoints=auth_endpoints["endpoints"])
    
@app.route('/package-form')
def package_form():
    """Render the package form page."""
    return render_template('package_form.html')

@app.after_request
def add_cors_headers(response):
    """Add CORS headers to response."""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)