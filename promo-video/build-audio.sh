#!/usr/bin/env bash
# Vision Wings promo — voiceover + music pipeline.
#
# Prerequisite: ELEVENLABS_API_KEY must be set. Everything else is bundled.
#   PowerShell:  $env:ELEVENLABS_API_KEY = "sk_..."
#   bash:        export ELEVENLABS_API_KEY="sk_..."
#
# Run from promo-video/.
set -euo pipefail

SKILL="../.claude/skills/promo-video"
REMOTION="remotion"

if [ -z "${ELEVENLABS_API_KEY:-}" ]; then
  echo "ERROR: ELEVENLABS_API_KEY is not set. See header." >&2
  exit 1
fi

echo "==> 1/5  Generating voiceover from voiceover-config.json"
npx tsx "$SKILL/scripts/generate-voiceover.ts" --config voiceover-config.json

echo "==> 2/5  Normalising loudness to broadcast target (-16 LUFS)"
bunx remotion ffmpeg -y -i voiceover.mp3 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  voiceover-normalized.mp3

echo "==> 3/5  Verifying timing with Whisper (fix any overlap before shipping)"
if command -v whisper >/dev/null 2>&1; then
  whisper voiceover-normalized.mp3 --model tiny --output_format srt --output_dir .
else
  echo "    Whisper not installed — skipping. Install with: pip install openai-whisper"
fi

# Music bed: fade in over 2s, fade out over the last 3s of the 60s timeline.
echo "==> 4/5  Mixing music bed under voiceover"
bunx remotion ffmpeg -y -i voiceover-normalized.mp3 -i "$REMOTION/public/background-music.mp3" \
  -filter_complex "[1:a]volume=0.09,afade=t=in:st=0:d=2,afade=t=out:st=57:d=3[music];[0:a][music]amix=inputs=2:duration=first" \
  "$REMOTION/public/voiceover-with-music.mp3"

echo "==> 5/5  Muxing audio onto both renders"
for fmt in landscape portrait; do
  bunx remotion ffmpeg -y -i "$REMOTION/out/promo-$fmt.mp4" -i "$REMOTION/public/voiceover-with-music.mp3" \
    -c:v copy -map 0:v:0 -map 1:a:0 -shortest \
    "$REMOTION/out/promo-$fmt-final.mp4"
  echo "    wrote $REMOTION/out/promo-$fmt-final.mp4"
done

cat <<'EOF'

Done. Two notes:
  * The rendered MP4s already carry the music bed on its own. This script
    replaces that track with the voiceover+music mix, so do NOT run it twice
    against an already-muxed file — always start from promo-<fmt>.mp4.
  * Alternatively set HAS_VOICEOVER = true in src/Composition.tsx and re-render;
    Remotion will then bake voiceover-with-music.mp3 in directly and steps 5
    becomes unnecessary.
EOF
