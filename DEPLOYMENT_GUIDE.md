# 🚀 RAAH-SETU Deployment & Production Guide

## Overview

Complete guide for deploying RAAH-SETU application to production with security, scalability, and reliability.

---

## Phase 1: Pre-Deployment Checklist

### Frontend Preparation

- [ ] Review all pages for console errors
- [ ] Test all routes work correctly
- [ ] Verify API endpoint URLs configured for production
- [ ] Test responsiveness on mobile devices
- [ ] Test dark mode functionality
- [ ] Verify all animations load properly
- [ ] Check image optimization
- [ ] Review TypeScript for type errors
- [ ] Audit accessibility (a11y)
- [ ] Test with network throttling

### Backend Preparation

- [ ] Review all API endpoints
- [ ] Test error handling
- [ ] Verify password hashing implementation
- [ ] Check CORS configuration
- [ ] Review SQL queries for optimization
- [ ] Test concurrent user scenarios
- [ ] Check logging configuration
- [ ] Verify environment variables handling
- [ ] Test database backup procedures
- [ ] Review rate limiting strategy

### Database Preparation

- [ ] Create schema on production database
- [ ] Set up indexes for common queries
- [ ] Configure automated backups
- [ ] Test restore procedures
- [ ] Set up monitoring and alerts
- [ ] Configure user permissions
- [ ] Review retention policies
- [ ] Test query performance

---

## Phase 2: Environment Configuration

### Backend Production Configuration

File: `Backend/.env.production`

```env
# Database
DB_HOST=your-production-db-host.com
DB_USER=prod_raah_setu_user
DB_PASSWORD=SecurePassword123!@#
DB_NAME=raah_setu_prod
DB_PORT=3306

# Flask
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-super-secret-key-here-change-me

# Security
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
JWT_SECRET_KEY=your-jwt-secret-key-change-me
JWT_EXPIRATION=3600

# Email (for notifications)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# API Rate Limiting
RATE_LIMIT=100/hour
API_TIMEOUT=30
```

### Frontend Production Configuration

File: `client/.env.production`

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=RAAH-SETU
VITE_APP_VERSION=2.0.0
VITE_ANALYTICS_ID=your-analytics-id
VITE_ENVIRONMENT=production
```

---

## Phase 3: Backend Deployment (Heroku Example)

### Step 1: Prepare Backend

```bash
cd Backend

# Create Procfile
echo "web: python api_enhanced.py" > Procfile

# Create runtime.txt (specify Python version)
echo "python-3.11.5" > runtime.txt

# Update requirements.txt
pip freeze > requirements.txt

# Add production dependencies
echo "gunicorn==21.2.0" >> requirements.txt
echo "python-dotenv==1.0.0" >> requirements.txt
```

### Step 2: Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=prod_user
heroku config:set DB_PASSWORD=secure_password
heroku config:set DB_NAME=raah_setu_prod
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY=your-secret-key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Step 3: Database Setup

```bash
# Connect to your production database
mysql -h your-db-host -u prod_user -p

# Run schema creation
mysql -h your-db-host -u prod_user -p raah_setu_prod < create_schema.sql
```

### Updated Procfile for Production

```
web: gunicorn -w 4 -b 0.0.0.0:$PORT api_enhanced:app
```

---

## Phase 4: Frontend Deployment (Netlify Example)

### Step 1: Build Frontend

```bash
# Build optimized production bundle
npm run build

# Verify build size
ls -lh dist/

# Expected: < 5MB
```

### Step 2: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Or connect GitHub for automatic deployments
# Settings → Build & Deploy → Authorize GitHub
```

### Step 3: Configure Netlify Build

File: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"
  environment = { NODE_VERSION = "18.x" }

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

---

## Phase 5: Database Deployment (AWS RDS Example)

### Step 1: Create RDS Instance

```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier raah-setu-prod \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password "SecurePassword123!@#" \
  --allocated-storage 20 \
  --db-name raah_setu_prod \
  --publicly-accessible false

# Get endpoint
aws rds describe-db-instances --db-instance-identifier raah-setu-prod
```

### Step 2: Configure Security

```bash
# Create security group
aws ec2 create-security-group \
  --group-name raah-setu-db-sg \
  --description "Security group for RAAH-SETU database"

# Allow Flask backend access
aws ec2 authorize-security-group-ingress \
  --group-name raah-setu-db-sg \
  --protocol tcp \
  --port 3306 \
  --source-security-group-id <backend-sg-id>
```

### Step 3: Setup Database

```bash
# Connect to RDS
mysql -h your-rds-endpoint.amazonaws.com -u admin -p

# Run schema
SOURCE create_schema.sql;

# Verify
SHOW TABLES;
```

---

## Phase 6: SSL/HTTPS Configuration

### Get SSL Certificate (Let's Encrypt)

```bash
# If using custom domain with Netlify
# Settings → Domain Management → SSL/TLS → Enable HTTPS

# For Heroku
heroku certs:auto:enable --app your-app-name

# For custom server
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### Backend HTTPS Configuration

File: `Backend/api_enhanced_prod.py`

```python
from flask import Flask
from flask_cors import CORS
import ssl

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com", "https://www.yourdomain.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

if __name__ == '__main__':
    # Use SSL certificates
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(
        '/path/to/cert.pem',
        '/path/to/key.pem'
    )
    app.run(
        host='0.0.0.0',
        port=443,
        ssl_context=context,
        debug=False
    )
```

---

## Phase 7: Monitoring & Logging

### Backend Logging Setup

File: `Backend/config.py`

```python
import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logging():
    if not os.path.exists('logs'):
        os.mkdir('logs')
    
    file_handler = RotatingFileHandler(
        'logs/app.log',
        maxBytes=10240000,
        backupCount=10
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('RAAH-SETU startup')
```

### Monitoring Services

```python
# New Relic - Application Monitoring
pip install newrelic

# Configure: newrelic.ini
# newrelic-admin run-program python api_enhanced.py

# Sentry - Error Tracking
pip install sentry-sdk

# In api_enhanced.py:
import sentry_sdk
sentry_sdk.init("https://your-sentry-dsn@sentry.io/...")
```

### Log Aggregation

```bash
# Using ELK Stack
# Elasticsearch, Logstash, Kibana

# Or use CloudWatch (AWS)
pip install watchtower

# In logging config:
import watchtower
app.logger.addHandler(watchtower.CloudWatchLogHandler())
```

---

## Phase 8: Performance Optimization

### Frontend Optimization

```bash
# Code splitting
npm run build -- --config-override=vite.config.prod.ts

# Measure
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

### Backend Optimization

```python
# Add caching
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis'})

@app.route('/api/emergency-contacts')
@cache.cached(timeout=300)
def get_emergency_contacts():
    # ...
```

### Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_created_at ON activities(user_id, created_at);

-- Query optimization
EXPLAIN SELECT * FROM emergency_contacts WHERE user_id = 1;

-- Monitor slow queries
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

---

## Phase 9: Backup & Disaster Recovery

### Automated Backups

```bash
# MySQL automated backup script
#!/bin/bash
BACKUP_DIR="/backups/raah-setu"
DATE=$(date +"%Y%m%d_%H%M%S")

mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/backup_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://raah-setu-backups/

# Schedule with cron
# 0 2 * * * /usr/local/bin/backup_db.sh
```

### Backup Restoration

```bash
# Restore from backup
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backup_20240115_020000.sql

# Verify
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM emergency_contacts;
```

---

## Phase 10: Security Hardening

### API Security

```python
# Rate limiting
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    # ...

# Input validation
from flask_wtf import FlaskForm
from wtforms import StringField, validators

class LoginForm(FlaskForm):
    email = StringField('Email', [validators.Email()])
    password = StringField('Password', [validators.Length(min=8)])

# CSRF protection
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect(app)
```

### Database Security

```python
# Use parameterized queries (already implemented)
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

# Enable SSL for DB connections
ssl_config = {
    'ca': '/path/to/ca.pem',
    'cert': '/path/to/client-cert.pem',
    'key': '/path/to/client-key.pem'
}
conn = mysql.connector.connect(**config, ssl_disabled=False, **ssl_config)
```

### Frontend Security

```typescript
// Content Security Policy headers (configured via Netlify)
// Add to netlify.toml headers section:
// Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'

// XSS Prevention - already using React (escapes by default)

// HTTPS Strict-Transport-Security
// Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Phase 11: Monitoring Dashboard

### Setup Monitoring

```bash
# Uptime monitoring
curl -X POST https://uptimerobot.com/api/v2/monitors \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_API_KEY",
    "type": 1,
    "url": "https://api.yourdomain.com/api/health",
    "friendly_name": "RAAH-SETU API"
  }'
```

### Metrics to Monitor

- ✅ API response time (target: <200ms)
- ✅ Error rate (target: <0.1%)
- ✅ Database query time (target: <100ms)
- ✅ Uptime (target: 99.9%)
- ✅ Server CPU usage (target: <70%)
- ✅ Memory usage (target: <80%)
- ✅ Disk space (target: >10% free)

---

## Phase 12: CI/CD Pipeline

### GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy RAAH-SETU

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install && pip install -r Backend/requirements.txt
      - name: Run tests
        run: npm run test
      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy backend to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          git remote add heroku https://git.heroku.com/your-app.git
          git push heroku main
      - name: Deploy frontend to Netlify
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        run: |
          npm run build
          netlify deploy --prod --dir=dist
```

---

## Phase 13: Scaling Strategy

### Horizontal Scaling

```bash
# Load balancer configuration (Nginx)
upstream backend {
    server backend1.yourdomain.com;
    server backend2.yourdomain.com;
    server backend3.yourdomain.com;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

### Vertical Scaling

```bash
# Upgrade database instance
aws rds modify-db-instance \
  --db-instance-identifier raah-setu-prod \
  --db-instance-class db.t3.small \
  --apply-immediately
```

### Caching Strategy

```python
# Redis for session/cache
import redis

redis_client = redis.Redis(
    host='cache.yourdomain.com',
    port=6379,
    decode_responses=True
)

# Cache health checks
@app.route('/api/health-checks')
def get_health_checks():
    user_id = request.args.get('user_id')
    cache_key = f'health_checks_{user_id}'
    
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # ... fetch from DB ...
    redis_client.setex(cache_key, 300, json.dumps(data))
    return data
```

---

## Phase 14: Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify HTTPS certificate working
- [ ] Check API endpoints responding
- [ ] Test user signup → login → actions flow
- [ ] Verify database persistence
- [ ] Check error handling works
- [ ] Confirm backups running
- [ ] Monitor error logs
- [ ] Verify analytics working
- [ ] Test mobile responsiveness
- [ ] Check performance metrics
- [ ] Review security headers
- [ ] Confirm monitoring active
- [ ] Test disaster recovery
- [ ] Document production access

---

## Troubleshooting Production Issues

### API Not Responding

```bash
# Check server status
curl https://api.yourdomain.com/api/health

# Check logs
heroku logs --tail

# Restart
heroku restart
```

### Database Connection Error

```bash
# Test connection
mysql -h prod-db.rds.amazonaws.com -u admin -p

# Check security group
aws ec2 describe-security-groups --group-names raah-setu-db-sg

# Verify environment variables
heroku config | grep DB_
```

### High Error Rate

```bash
# Check logs for errors
heroku logs --tail | grep ERROR

# Review recent deployments
heroku releases

# Rollback if needed
heroku releases:rollback
```

---

## Maintenance Schedule

### Daily
- Monitor API uptime
- Check error logs
- Review performance metrics

### Weekly
- Database maintenance
- Backup verification
- Security patches review

### Monthly
- Database optimization
- Performance analysis
- Security audit
- User feedback review

### Quarterly
- Infrastructure review
- Scaling assessment
- Disaster recovery drill
- Budget review

---

## Cost Estimation

### Monthly Costs (Estimated)

| Service | Cost |
|---------|------|
| Heroku Dyno (Premium) | $50 |
| AWS RDS (db.t3.micro) | $30 |
| Netlify Pro | $19 |
| Domain Name | $12 |
| SendGrid (Email) | $30 |
| Monitoring Services | $20 |
| **Total** | **~$161** |

### Cost Optimization

- Use spot instances for non-critical workloads
- Implement auto-scaling
- Compress data transmission
- Optimize database queries
- Use CDN for static assets

---

## Support & Maintenance

### Help Resources

- Heroku documentation: https://devcenter.heroku.com/
- AWS documentation: https://docs.aws.amazon.com/
- Flask documentation: https://flask.palletsprojects.com/
- MySQL documentation: https://dev.mysql.com/doc/

### Incident Response

1. **Detect** → Monitoring alerts
2. **Investigate** → Check logs and metrics
3. **Mitigate** → Apply hotfix or rollback
4. **Communicate** → Update status page
5. **Resolve** → Deploy permanent fix
6. **Learn** → Post-mortem analysis

---

## Conclusion

Your RAAH-SETU application is now production-ready with:

✅ Secure deployment
✅ Automated backups
✅ Monitoring & logging
✅ SSL/HTTPS encryption
✅ Scalable infrastructure
✅ Disaster recovery
✅ Performance optimization
✅ Security hardening

**Status:** Ready for production use and user traffic!

---

**Last Updated:** 2024
**Version:** 2.0
**Production Ready:** ✅
