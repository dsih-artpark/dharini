# Generate the code
# API_URL="https://api.demo.dharini.artpark.ai/docs-json"
API_URL="http://host.docker.internal:4000/docs-json"

docker run --rm -v "${PWD}/packages:/local" openapitools/openapi-generator-cli generate \
    -i $API_URL \
    -g dart-dio \
    -o /local/es_client \
    --additional-properties=pubName=es_client,enumUnknownDefaultCase=true,pubVersion=1.0.0,pubDescription="EST API",pubAuthor="Dharini API"  \
    --skip-validate-spec

# Navigate the the package directory. Assuming you are in the project roo
cd packages/es_client

# Load the dependencies
fvm flutter pub get

# Generate code
fvm dart run build_runner build --delete-conflicting-outputs

cd ../../