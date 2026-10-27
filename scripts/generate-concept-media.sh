#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
concept_dir="$project_root/assets/concepts"

for poster in "$concept_dir"/*.svg; do
  slug="$(basename "$poster" .svg)"
  ffmpeg -hide_banner -loglevel error -y \
    -loop 1 -i "$poster" -t 4 \
    -vf "scale=1600:900,zoompan=z='min(zoom+0.0008,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1280x720:fps=30,format=yuv420p" \
    -an -c:v libvpx-vp9 -crf 39 -b:v 0 -deadline good -cpu-used 2 \
    "$concept_dir/$slug-preview.webm"
done
