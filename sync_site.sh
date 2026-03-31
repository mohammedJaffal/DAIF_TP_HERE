#!/bin/zsh

set -euo pipefail

REMOTE_HOST="84.8.223.175"
REMOTE_USER="mo_jaffal"
REMOTE_PATH="/home/mo_jaffal/web/c3-mo-jaffal/public_html"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$(mktemp)"

cleanup() {
  rm -f "$CONFIG_FILE"
}

trap cleanup EXIT

if [[ -z "${SFTP_PASSWORD:-}" ]]; then
  read -s "SFTP_PASSWORD?SFTP password for ${REMOTE_USER}@${REMOTE_HOST}: "
  echo
fi

OBSCURED_PASS="$(rclone obscure "$SFTP_PASSWORD")"

cat > "$CONFIG_FILE" <<EOF
[enset_sftp]
type = sftp
host = $REMOTE_HOST
user = $REMOTE_USER
port = 22
pass = $OBSCURED_PASS
shell_type = unix
md5sum_command = none
sha1sum_command = none
EOF

echo "Syncing ${SCRIPT_DIR} to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"
echo "This is a mirror sync: removed local site files will be removed remotely too."

rclone sync \
  "$SCRIPT_DIR" \
  "enset_sftp:${REMOTE_PATH}" \
  --config "$CONFIG_FILE" \
  --filter-from "$SCRIPT_DIR/.deployignore" \
  --progress \
  --transfers 8 \
  --checkers 16
