import json
import base64
import uuid
import boto3
import requests
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('OceanCallPredictions')

MODEL_ENDPOINT = " "

def lambda_handler(event, context):
    try:
        # Parse multipart/form-data
        if event.get("isBase64Encoded"):
            import cgi
            import io
            import base64

            body = base64.b64decode(event["body"])
            content_type = event["headers"].get("Content-Type") or event["headers"].get("content-type")
            if not content_type:
                return response(400, "Missing Content-Type")

            environ = {'REQUEST_METHOD': 'POST'}
            headers = {'content-type': content_type}
            fs = cgi.FieldStorage(fp=io.BytesIO(body), environ=environ, headers=headers)

            audio_file = fs['file'].file.read() if 'file' in fs else None
        else:
            return response(400, "Invalid encoding or missing file")

        if not audio_file:
            return response(400, "No audio file uploaded")

        # Convert to base64
        audio_b64 = base64.b64encode(audio_file).decode('utf-8')

        # Send to model server (ngrok endpoint)
        result = requests.post(
            MODEL_ENDPOINT,
            json={"audio_base64": audio_b64},
            timeout=10
        )

        if result.status_code != 200:
            return response(502, f"Model server error: {result.text}")

        result_json = result.json()

        # Save to DynamoDB
        entry_id = str(uuid.uuid4())
        table.put_item(Item={
            'id': entry_id,
            'prediction': result_json.get('prediction'),
            'confidence': Decimal(str(result_json.get('confidence'))),
            'top_predictions': json.dumps(result_json.get('top_predictions', [])),
        })

        # Return response
        return response(200, {
            'prediction': result_json.get('prediction'),
            'confidence': result_json.get('confidence'),
            'id': entry_id
        })

    except Exception as e:
        return response(500, f"❌ Server error: {str(e)}")

def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }
