#!/usr/bin/env bash
# Rcrd autopilot: runs Codex one feature at a time until docs/PROGRESS.md has no unchecked items.
# Start it from the repo folder:   caffeinate -i ./scripts/autopilot.sh
# Stop it any time with Ctrl+C. Logs are in .autopilot/.

set -u
cd "$(dirname "$0")/.." || exit 1
mkdir -p .autopilot

# Codex runs without a sandbox so it can use the network (npm) and Docker (Supabase).
# `codex exec` never asks for approval.
CODEX=(codex exec --sandbox danger-full-access)

CAREFUL='^(supabase/migrations/|lib/permissions/|lib/actions/|lib/billing/|lib/ai/|app/api/)'
MAX_FAILS=6          # consecutive runs with no new commit before giving up
WAIT_ON_FAIL=1200    # seconds to wait after a failed run (lets usage limits reset)
fails=0

run_prompt='Follow AGENTS.md (section 5, autonomous mode). Take the first unchecked item in docs/PROGRESS.md (plus closely related items you can finish together), build it to the Definition of Done, tick it, commit and push. Do not ask questions.'

while true; do
  next=$(grep -m1 -E '^- \[ \] ' docs/PROGRESS.md | sed -E 's/^- \[ \] //')
  if [ -z "$next" ]; then
    echo "$(date '+%F %T')  Nothing left to do. Check docs/BLOCKERS.md for items that need you."
    break
  fi

  stamp=$(date '+%Y%m%d-%H%M%S')
  echo "$(date '+%F %T')  Building: $next"
  before=$(git rev-parse HEAD)
  "${CODEX[@]}" "$run_prompt" > ".autopilot/$stamp-build.log" 2>&1
  after=$(git rev-parse HEAD)

  if [ "$before" = "$after" ]; then
    fails=$((fails + 1))
    echo "$(date '+%F %T')  No commit from that run ($fails/$MAX_FAILS). Last lines of the log:"
    tail -5 ".autopilot/$stamp-build.log"
    if [ "$fails" -ge "$MAX_FAILS" ]; then
      echo "Stopping after $MAX_FAILS failed runs in a row. Read the latest log in .autopilot/ and docs/BLOCKERS.md."
      exit 1
    fi
    echo "Waiting $((WAIT_ON_FAIL / 60)) minutes before retrying..."
    sleep "$WAIT_ON_FAIL"
    continue
  fi
  fails=0

  # Independent review for changes to patient-data or money code.
  if git diff --name-only "$before" "$after" | grep -qE "$CAREFUL"; then
    echo "$(date '+%F %T')  Careful-area change: running review"
    codex exec --sandbox read-only \
      "You are reviewing someone else's work. Review the changes in: git diff $before $after. Check them against AGENTS.md sections 2 and 7 and the spec sections for the feature IDs in the commit messages. Look for security holes (missing RLS or permission checks, cross-clinic data leaks, secrets), money/GST errors, and data-loss risks. Do not edit anything. If there are no real problems, reply with exactly: NO ISSUES. Otherwise list each problem with file, line and the fix." \
      > ".autopilot/$stamp-review.md" 2> ".autopilot/$stamp-review.log"

    if ! grep -q "NO ISSUES" ".autopilot/$stamp-review.md"; then
      echo "$(date '+%F %T')  Review found issues: running fix"
      "${CODEX[@]}" "Follow AGENTS.md. A reviewer checked commits $before..$after and wrote .autopilot/$stamp-review.md. Fix every real problem it lists, run npm run check, commit with message 'Review fixes: <IDs>' and push. Do not ask questions." \
        > ".autopilot/$stamp-fix.log" 2>&1
    fi
  fi
done
