# API Endpoints Documentation

## Available Dashboard API Endpoints:

### Project Overview
- **GET** `/dashboard/project`
- Returns project details, status, progress, budget, and deadline
- Response format:
```json
{
  "id": "string",
  "name": "string",
  "status": "development" | "completed" | "review" | "planning",
  "progress": number,
  "budget": number,
  "spent": number,
  "deadline": "ISO date string"
}
```

### Analytics
- **GET** `/dashboard/analytics`
- Returns website/app analytics data
- Response format:
```json
{
  "visitors": {
    "today": number,
    "thisWeek": number,
    "thisMonth": number,
    "change": number
  },
  "performance": {
    "loadTime": number,
    "responseTime": number,
    "uptime": number
  },
  "conversions": {
    "rate": number,
    "total": number,
    "revenue": number
  },
  "activeUsers": number
}
```

### Financial Reports
- **GET** `/dashboard/financial`
- Returns financial data and transactions
- Response format:
```json
{
  "sales": {
    "today": number,
    "thisMonth": number,
    "lastMonth": number,
    "change": number
  },
  "revenue": {
    "total": number,
    "thisMonth": number,
    "pending": number
  },
  "invoices": {
    "paid": number,
    "pending": number,
    "overdue": number
  },
  "recentTransactions": [
    {
      "id": "string",
      "description": "string",
      "amount": number,
      "date": "ISO date string",
      "status": "paid" | "pending" | "failed"
    }
  ]
}
```

### Support Center
- **GET** `/dashboard/support`
- Returns support tickets and meeting info
- **POST** `/dashboard/support/tickets`
- Creates new support ticket

## Authentication
All API calls include Authorization header:
```
Authorization: Bearer {token}
```

## Error Handling
All endpoints return standard HTTP status codes:
- 200: Success
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting
API calls are limited to prevent abuse. 
Check response headers for rate limit info.