# Run the code

```bash
uvicorn main:app --reload --port 8000
```

# API Endpoints

## Voice Input

```bash
POST /voice
```

```json
{
    "session_id": "string",
    "text": "string"
}
```
