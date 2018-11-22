#!/usr/bin/env bash

set -ue

# only execute if node is present
if command -v node >/dev/null 2>&1 ;
then
    export NODE_PATH=.

    # produce a test/prod build base on "NODE_ENV"
    if [[ $NODE_ENV == "test" ]] ;
    then
        yarn build:test
    else
        yarn build
    fi

    # define if we are in the automated tests env.
    # see https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
    CI=${CI:-false}

    if [[ $CI == true ]] ;
    then
        # only execute tests if the linter result is good
        yarn lint && mocha
    else
        mocha "$@"
    fi
fi
