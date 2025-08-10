#!/usr/bin/env bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Usage:
# ./cf-debug-ssh.sh --app <app-name> --space <space-name> --org <org-name>
# Ensure you are logged into Cloud Foundry before running this script.

# Parameters
app=""
space=""
org=""

# Argument parsing
while (("$#")); do
    case "$1" in
    --app | -a)
        app="$2"
        shift 2
        ;;
    --space | -s)
        space="$2"
        shift 2
        ;;
    --org | -o)
        org="$2"
        shift 2
        ;;
    --)
        shift
        break
        ;;
    -* | --*=)
        echo -e "${RED}Error: Unsupported flag $1${NC}" >&2
        exit 1
        ;;
    *)
        shift
        ;;
    esac
done

if [ -z "$app" ]; then
    echo -e "${RED}Error: --app parameter must be defined.${NC}"
    exit 1
fi

if [ -n "$org" ] && [ -n "$space" ]; then
    echo -e "${CYAN}Targeting org: $org, space: $space${NC}"
    cf target -o "$org" -s "$space"
fi

echo -e "${BLUE}Checking SSH support for app '$app'...${NC}"
ssh_status=$(cf ssh-enabled "$app" 2>&1)

if [[ $ssh_status == *"ssh support is disabled"* ]]; then
    echo -e "${YELLOW}SSH is disabled for app '$app'. Enabling SSH...${NC}"
    cf enable-ssh "$app"
    echo -e "${YELLOW}Restarting app '$app' to apply SSH changes...${NC}"
    cf restart "$app"
else
    echo -e "${GREEN}SSH is already enabled for '$app'.${NC}"
fi

echo -e "${BLUE}Sending signal to allow remote debugging...${NC}"
cf ssh "$app" --command 'kill -usr1 $(pgrep -f .bin/cds-serve)'

echo -e "${GREEN}Establishing SSH tunnel to $app.${NC} \n${YELLOW}(Ctrl+C or type 'exit' to disconnect)...${NC}"

# Start SSH tunnel in the background
cf ssh "$app" -L 9229:127.0.0.1:9229 -N &
SSH_PID=$!

cleanup() {
    echo -e "${YELLOW}Disconnecting SSH tunnel...${NC}"
    kill $SSH_PID 2>/dev/null
    wait $SSH_PID 2>/dev/null
    echo -e "${YELLOW}Disabling SSH for '$app'...${NC}"
    cf disable-ssh "$app"
    echo -e "${GREEN}Done.${NC}"
    exit 0
}

# Trap CTRL+C and EXIT to cleanup
trap cleanup SIGINT SIGTERM

# Wait for user input to exit
while true; do
    read -r -p "$(echo -e "${CYAN}> Type 'exit' to disconnect: ${NC}")" input
    if [[ "$input" == "exit" ]]; then
        cleanup
    fi
done