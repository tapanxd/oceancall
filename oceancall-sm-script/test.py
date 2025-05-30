import boto3

# SageMaker client
runtime = boto3.client('sagemaker-runtime', region_name='us-east-1')

# Read .wav file as bytes
with open("63019007.wav", "rb") as f:
    audio_bytes = f.read()

# Invoke the endpoint
response = runtime.invoke_endpoint(
    EndpointName="oceancall-endpoint",
    ContentType="application/octet-stream",
    Body=audio_bytes
)

# Show result
print(response['Body'].read().decode())