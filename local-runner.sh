SCRIPT_PATH=$(dirname "$0")

cd ${SCRIPT_PATH}

if [ -z $1 ]; then
    echo "Provide a path (e.g. '.')"
    exit 1
fi

export PROJECT_PATH=$1

docker rm -f $(docker-compose ps -a -q)
rm -rf .data/
rm -rf dist/
yarn
yarn codegen
yarn build
yarn start:docker