# ContentSpark API Documentation

This document describes the API endpoints and data structures used in ContentSpark.

## Authentication

ContentSpark uses Supabase Auth for authentication. All API requests require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Base URLs

- **Development**: `http://localhost:54321`
- **Production**: `https://your-supabase-project.supabase.co`

## Endpoints

### Authentication

#### Sign Up
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### Sign In
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Sign Out
```http
POST /auth/v1/logout
Authorization: Bearer <jwt_token>
```

### Users

#### Get Current User Profile
```http
GET /rest/v1/users?id=eq.<user_id>
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "subscription_tier": "free",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Update User Profile
```http
PATCH /rest/v1/users?id=eq.<user_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "subscription_tier": "pro"
}
```

### Content Items

#### Get All Content Items
```http
GET /rest/v1/content_items?select=*,interactive_elements(*)
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "My Content",
    "content_text": "Content body...",
    "original_content_url": "https://example.com",
    "interactive_elements_config": [],
    "ai_summary": "AI generated summary...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "interactive_elements": [
      {
        "id": "uuid",
        "type": "poll",
        "config": {
          "question": "What do you think?",
          "options": ["Option 1", "Option 2"]
        }
      }
    ]
  }
]
```

#### Create Content Item
```http
POST /rest/v1/content_items
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "My New Content",
  "content_text": "This is the content body...",
  "original_content_url": "https://example.com",
  "interactive_elements_config": [],
  "ai_summary": "Optional AI summary..."
}
```

#### Update Content Item
```http
PATCH /rest/v1/content_items?id=eq.<content_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "ai_summary": "Updated summary..."
}
```

#### Delete Content Item
```http
DELETE /rest/v1/content_items?id=eq.<content_id>
Authorization: Bearer <jwt_token>
```

### Interactive Elements

#### Get Interactive Elements for Content
```http
GET /rest/v1/interactive_elements?content_item_id=eq.<content_id>
Authorization: Bearer <jwt_token>
```

#### Create Interactive Element
```http
POST /rest/v1/interactive_elements
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content_item_id": "uuid",
  "type": "poll",
  "config": {
    "question": "What's your favorite color?",
    "options": ["Red", "Blue", "Green", "Yellow"]
  }
}
```

#### Update Interactive Element
```http
PATCH /rest/v1/interactive_elements?id=eq.<element_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "config": {
    "question": "Updated question?",
    "options": ["New Option 1", "New Option 2"]
  }
}
```

#### Delete Interactive Element
```http
DELETE /rest/v1/interactive_elements?id=eq.<element_id>
Authorization: Bearer <jwt_token>
```

### Analytics

#### Get User Analytics
```http
GET /rest/v1/user_analytics?order=created_at.desc&limit=100
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "content_item_id": "uuid",
    "action_type": "content_created",
    "metadata": {
      "title": "My Content",
      "hasUrl": true
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Track User Action
```http
POST /rest/v1/user_analytics
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "action_type": "interactive_element_added",
  "content_item_id": "uuid",
  "metadata": {
    "type": "poll",
    "question": "Sample question"
  }
}
```

## Data Models

### User
```typescript
interface User {
  id: string
  email: string
  subscription_tier: 'free' | 'pro' | 'premium'
  created_at: string
  updated_at: string
}
```

### ContentItem
```typescript
interface ContentItem {
  id: string
  user_id: string
  title: string
  content_text: string
  original_content_url?: string
  interactive_elements_config: InteractiveElementConfig[]
  ai_summary?: string
  created_at: string
  updated_at: string
}
```

### InteractiveElement
```typescript
interface InteractiveElement {
  id: string
  content_item_id: string
  type: 'poll' | 'quiz' | 'hotspot'
  config: PollConfig | QuizConfig | HotspotConfig
  created_at: string
}

interface PollConfig {
  question: string
  options: string[]
}

interface QuizConfig {
  question: string
  options: string[]
  correctAnswer: number
}

interface HotspotConfig {
  x: number
  y: number
  title: string
  description: string
}
```

### UserAnalytics
```typescript
interface UserAnalytics {
  id: string
  user_id: string
  content_item_id?: string
  action_type: string
  metadata: Record<string, any>
  created_at: string
}
```

## Error Responses

All API endpoints return standard HTTP status codes and error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": "Validation error details..."
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limits

API rate limits are enforced based on subscription tier:

- **Free**: 100 requests per hour
- **Pro**: 1,000 requests per hour  
- **Premium**: 10,000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

ContentSpark supports webhooks for real-time notifications:

### Webhook Events

- `content_item.created`
- `content_item.updated`
- `content_item.deleted`
- `interactive_element.created`
- `user.subscription_changed`

### Webhook Payload
```json
{
  "event": "content_item.created",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "New Content",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @supabase/supabase-js
```

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

// Get content items
const { data, error } = await supabase
  .from('content_items')
  .select('*')
```

### Python
```bash
pip install supabase
```

```python
from supabase import create_client

supabase = create_client(
    "https://your-project.supabase.co",
    "your-anon-key"
)

# Get content items
response = supabase.table('content_items').select('*').execute()
```

## Testing

Use the following test credentials for development:

- **Email**: `test@contentspark.com`
- **Password**: `testpassword123`

Test API endpoints using tools like:
- [Postman](https://postman.com)
- [Insomnia](https://insomnia.rest)
- [curl](https://curl.se)

Example curl request:
```bash
curl -X GET \
  'http://localhost:54321/rest/v1/content_items' \
  -H 'Authorization: Bearer your_jwt_token' \
  -H 'apikey: your_anon_key'
```
