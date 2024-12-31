#!/bin/bash
#-----------------------------------------------------------------------------
# Copyright (C) 2022 Nuvoola AI.
# All Rights Reserved.
#-----------------------------------------------------------------------------
# Script to quickly configure Git on a Linux system.
#-----------------------------------------------------------------------------
# Author  : Christian Jean
# Created : 2022.03.14
# Version : 1.0
#-----------------------------------------------------------------------------
#

function usage() {
    echo
    echo "USAGE: "
    echo
    echo "   git-config.sh <fullname> <email>"
    echo
    echo "WHERE: "
    echo
    echo "   fullname    Is the user's full name with first and last name (ie: Christian Jean)"
    echo "   email       Is the user's email address (ie: christian.jean@gmail.com)"
    echo
    echo "EXAMPLE: "
    echo
    echo "   git-config.sh \"Christian Jean\" christian.jean@gmail.com"
    echo
    echo "   >>> Don't forget to use quotes around the full name! <<<"
    echo
    exit 1
}

USER=$(echo "$1" | sed 's/ \+/ /g; s/^ *//g; s/ *$//g')
EMAIL=$(echo "$2" | sed 's/^ *//g; s/ *$//g')
EDITOR="vim"


[ -z "$1" ] && \
    echo "ERROR: Missing fullname!" && \
    usage

[ -z "$2" ] && \
    echo "ERROR: Missing email address!" && \
    usage

RET=$(echo "$USER" | awk '/ / { print "0" }')
[ "$RET" != "0" ] && \
    echo "ERROR: Does not seem to be a full name (missing first or last name)!" && \
    usage

RET=$(echo "$EMAIL" | awk '/@/ { print "0" }')
[ "$RET" != "0" ] && \
    echo "ERROR: Does not seem to be a valid email address!" && \
    usage

echo "Full name     : '$USER'"
echo "Email address : '$EMAIL'"
echo "Editor        : '$EDITOR'"

git config --global user.name "$USER"
git config --global user.email "$EMAIL"
git config --global core.editor "$EDITOR"

git config --global credential.helper store
