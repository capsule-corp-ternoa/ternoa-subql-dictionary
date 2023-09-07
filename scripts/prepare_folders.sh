#!/bin/bash
SCRIPT_PATH=$(dirname "$0")
MAIN_DIRECTORY=${SCRIPT_PATH%/*}


printf "  SCRIPT_PATH %s\n" $SCRIPT_PATH
printf "  MAIN_DIRECTORY %s\n" $MAIN_DIRECTORY

folders=$(ls ${MAIN_DIRECTORY}/networks)

printf "  folders %s\n" $folders


for item in $folders
do
  printf "  ITEM: %s\n" $item
  scp -r ${MAIN_DIRECTORY}/src ${MAIN_DIRECTORY}/networks/$item
  scp ${MAIN_DIRECTORY}/package.json ${MAIN_DIRECTORY}/networks/$item
  scp ${MAIN_DIRECTORY}/tsconfig.json ${MAIN_DIRECTORY}/networks/$item
  scp ${MAIN_DIRECTORY}/schema.graphql ${MAIN_DIRECTORY}/networks/$item
  scp ${MAIN_DIRECTORY}/local-runner.sh ${MAIN_DIRECTORY}/networks/$item
  scp ${MAIN_DIRECTORY}/docker-compose.yml ${MAIN_DIRECTORY}/networks/$item
done

printf "Done !"