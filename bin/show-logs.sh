#!/bin/bash
#-----------------------------------------------------------------------------
# Copyright (C) 2022 Nuvoola AI.
# All Rights Reserved.
#-----------------------------------------------------------------------------
# Script to quickly dump the logs for a service unit, or provide a quick
# help screen of the most commonly used commands.
#-----------------------------------------------------------------------------
# Author  : Christian Jean
# Created : 2021.10.27
# Version : 1.0
#-----------------------------------------------------------------------------
#

function usage() {
  echo
  echo "USAGE: "
  echo
  echo "   service-logs.sh <service>"
  echo
  echo "WHERE: "
  echo
  echo "   service    Is the service name to get logs for."
  echo
  echo "EXAMPLE: "
  echo
  echo "   service-logs.sh foo-bar"
  echo
  exit 1
}

function help() {
  echo "Log options are:"
  echo 
  echo "  -f or --follow      To follow log updates (like 'tail')"
  echo "  -e or --end         To start log at end of print (to avoid need to scroll)"
  echo "  --utc               Express time in Coordinated Universal Time (UTC)."
  echo 
  echo "  -k, --dmesg         Show only kernel messages. This implies -b."
  echo 
  echo "  -b or --boot        To view logs for current boot (same as '--boot 0')."
  echo "  -b 0                To view log for last boot (0 is default if not provided)."
  echo "  -b -1               To view one boot prior to last boot ( also use -2, -3, and so on)."
  echo
  echo "  --disk-usage        This shows the sum of the disk usage of all archived and active journal files."
  echo
  echo "  --list-boot         Show a tabular list of boots (relative to current boot)."
  echo
  echo "  -p <priority>       Filter output by message priorities or priority ranges."
  echo "                      Takes either a numeric value or textual log level."
  echo
  echo "                      0: emerg        3: err            6: info  "
  echo "                      1: alert        4: warning        7: debug "
  echo "                      2: crit         5: notice                  "
  echo
  echo "  -g or --grep        Filter output to entries where the message matches the specified regular expression."
  echo "                      If the pattern is all lowercase, matching is case insensitive."
  echo "                      Otherwise, matching is case sensitive."
  echo 
  echo "  --case-sensitive=   Make pattern matching case sensitive or case insenstive (use 'true' or 'false')."
  echo
  echo " >> Type '--examples' to see examples! <<<"
  echo
  exit 1
}


function examples() {
  echo "Log examples:"
  echo 
  echo "  -b 0                To view log for last boot (0 is default if not provided)."
  echo "  -b -1               To view one boot prior to last boot."
  echo "  -b -2               To view two boot logs ago."
  echo
  echo "  --since \"2015-01-10 17:15:00\""
  echo "  --since \"2015-01-10\""
  echo "  --since yesterday"
  echo "  --since 09:00"
  echo 
  echo "  --until \"2015-01-11 03:00\""
  echo "  --until \"1 hour ago\""
  echo
  echo "  -p 4                To only show 'warning' messages."
  echo "  -p err              To only show 'err' messages."
  echo
  exit 1
}


SERVICE_NAME="$1"

[ -z "$1" ] && \
  echo "ERROR: Missing a service name!" && \
  usage

[[ "$1" == "-h" || "$1" == "--help" ]] && help
[[ "$1" == "-e" || "$1" == "--example" || "$1" == "--examples" ]] && examples

journalctl \
  -e \
  -f \
  --output=short-unix \
  --utc \
  --no-host \
  -u ${SERVICE_NAME}
