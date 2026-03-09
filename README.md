# Run the code

```bash
uvicorn main:app --reload
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
