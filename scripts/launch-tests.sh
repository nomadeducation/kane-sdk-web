#!/usr/bin/env bash

# bear in mind that this script has been conceived for a dockerized env.

set -ue

# only execute if node is present
if command -v node >/dev/null 2>&1 ;
then
    export NODE_ENV=test
    export NODE_PATH=.
    # define if we are in the automated tests env.
    # see https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
    CI=${CI:-false}

    # prepare the env.
    yarn build:test

    if [[ $CI == true ]] ;
    then
        # only execute tests if the linter result is good
        yarn lint && mocha --exit
    else
        mocha "$@" --exit
    fi
fi
