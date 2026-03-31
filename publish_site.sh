#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMIT_MESSAGE="${1:-Publish latest TPD site}"

cd "$SCRIPT_DIR"

git add -A

if git diff --cached --quiet; then
  echo "No new git changes to commit."
else
  git commit -m "$COMMIT_MESSAGE"
fi

git push
"$SCRIPT_DIR/sync_site.sh"
