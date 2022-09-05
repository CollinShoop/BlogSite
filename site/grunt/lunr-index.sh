#!/usr/bin/env bash

# Grunt is very sensitive about the context it's run from
# Being explicit ensures that this script can be run from another directory without issues
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
grunt --base ${SCRIPT_DIR} --gruntfile ${SCRIPT_DIR}/Gruntfile.js lunr-index -v
