# Feature: Automated Video Processing Pipeline

*Spec for a coding agent (Claude Code, Cursor, etc.) — describes what to build and in what order.*

## 1. Summary

Users upload a video (MP4) through the web app. The backend validates it, queues a background job, and a Dockerized FFmpeg worker transcodes it and generates a thumbnail. The frontend tracks progress and plays the final video once it's ready.

## 2. Goal for v1

Ship the smallest version of this pipeline that works end-to-end and is safe to run in production: upload → validate → store → queue → transcode → thumbnail → status update → playback. Adaptive streaming, subtitles, and multi-resolution output come later (see 4.2).

## 3. High-Level Flow

```
User uploads MP4
  → Backend validates file & auth
  → DB record created (status: uploaded)
  → Original file saved to storage
  → Job pushed to queue (status: queued)
  → Worker picks job (status: processing)
  → FFprobe inspects input
  → FFmpeg transcodes + generates thumbnail
  → Outputs validated & saved to storage
  → DB updated (status: completed / failed)
  → Frontend polls status, then plays/downloads video
```

## 4. Scope

### 4.1 Build now (v1)

- [ ] Single MP4 upload, validated on both client and server
- [ ] Original file stored
- [ ] One compressed H.264 MP4 output
- [ ] One thumbnail per video
- [ ] Status tracking: `uploaded → queued → processing → completed | failed`
- [ ] Status polling endpoint
- [ ] Upload UI with progress bar
- [ ] Playback UI with poster image and an error fallback
- [ ] Temp file cleanup after every job

### 4.2 Out of scope for v1 — don't build unless asked

- Multiple resolution renditions (360p–1080p) / adaptive streaming
- WebM fallback encoding
- Subtitle generation (speech-to-text)
- Standalone audio extraction
- HLS streaming
- WebSocket/SSE live progress (polling is enough for v1)
- Retry logic beyond a simple max-2 policy
- Full metrics/alerting dashboard

## 5. Tech Stack

Defaults below — if the existing project already uses different tools, keep those and slot this feature in rather than introducing a parallel stack.

| Layer | Default |
|---|---|
| Backend | Node.js / Express |
| Queue | BullMQ + Redis |
| Processing | Docker container with FFmpeg + FFprobe |
| Storage | Local disk in dev, S3-compatible bucket in prod |
| Database | Postgres |
| Frontend | React |

## 6. Data Model & Storage Layout

`videos` table:

| Field | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | owner |
| original_file_name | text | as uploaded |
| original_size | bigint | bytes |
| duration_seconds | numeric | from ffprobe |
| status | enum | uploaded / queued / processing / completed / failed / retrying |
| input_path | text | storage key for original |
| output_path | text | storage key for processed file, null until completed |
| thumbnail_path | text | storage key, null until completed |
| error_message | text | null unless failed |
| created_at | timestamp | |
| processed_at | timestamp | null until completed or failed |

Storage key convention: `{user_id}/{video_id}/original.<ext>`, `{user_id}/{video_id}/output.mp4`, `{user_id}/{video_id}/thumbnail.jpg`. Always generate the `video_id` server-side — never use the raw uploaded filename as a storage key.

## 7. API Endpoints

- `POST /api/videos` — upload a file, create the DB record, return `video_id`
- `GET /api/videos/:id/status` — lightweight polling endpoint
- `GET /api/videos/:id` — full metadata: status, output URL, thumbnail URL
- `DELETE /api/videos/:id` — optional, removes the record and stored files

## 8. Implementation Steps — build in this order

1. **DB migration** for the `videos` table (Section 6).
2. **Upload endpoint** — auth check → confirm a file is present → check extension/MIME/size → create DB row (`status: uploaded`) → save the original to storage.
3. **Queue integration** — right after step 2, enqueue `{video_id, input_path}` and set `status: queued`.
4. **Docker image for the worker** — base image + ffmpeg + ffprobe + worker runtime; keep it minimal.
5. **Worker process**:
   - Pick job, set `status: processing`.
   - Run `ffprobe` on the input, store `duration_seconds`.
   - Run `ffmpeg` to transcode to H.264 MP4 — bitrate/resolution as config values, not hardcoded.
   - Generate one thumbnail (`ffmpeg -ss <time> -frames:v 1`).
   - Confirm outputs exist and are non-zero size.
   - Upload outputs to storage.
   - Update DB: `status: completed`, `output_path`, `thumbnail_path`, `processed_at`.
   - On any failure: catch it, set `status: failed` with `error_message`, and don't leave partial files behind.
6. **Status endpoint** — `GET /api/videos/:id/status` for frontend polling.
7. **Upload UI** — file picker, client-side type/size check, upload with a progress bar, then poll status until `completed` or `failed`.
8. **Playback UI** — fetch metadata, show the thumbnail as a poster, play the processed MP4, show a retry/error message on playback failure.
9. **Cleanup job** — delete temp/working files once a job reaches a terminal state.
10. **Logging** — log at each worker step (job picked, ffprobe done, transcode done, thumbnail done, upload done, or failure + reason).
11. **Tests** — upload validation, status transitions, worker success path, worker failure path.

## 9. Security Requirements

- Whitelist file types (`mp4`, plus `mov`/`webm` only if actually needed) — check on both frontend and backend.
- Enforce a max file size on both ends.
- Never trust the file extension alone — confirm it's a real video via `ffprobe`.
- Replace uploaded filenames with generated UUIDs before storing.
- Run FFmpeg inside Docker with least privilege — no unnecessary host mounts, non-root user in the container where possible.
- Require auth on upload and on any endpoint serving a user's private video.

## 10. Error Handling Rules

- Any FFmpeg or storage failure → `status: failed` + `error_message`; never leave a partial output file that looks valid.
- Retry only clearly transient errors (timeout, disk I/O) — max 2 attempts, then fail permanently.
- Don't retry invalid or corrupt input — fail immediately with a clear reason.
- User-facing error text stays generic ("Processing failed — please try another file"); detailed errors go to logs only.

## 11. Common Pitfalls to Avoid

- Processing the video synchronously inside the upload request
- Skipping real file-type validation (trusting the extension alone)
- Keeping uploaded files only in memory
- Using the raw uploaded filename as a storage key
- Not persisting job status at every stage
- Letting failed jobs fail silently
- Skipping temp file cleanup
- Not logging FFmpeg's actual error output
- Running FFmpeg directly on the host instead of inside the container

## 12. Definition of Done (v1)

- [ ] User can upload an MP4 and see upload progress
- [ ] Invalid files are rejected with a clear message before reaching the queue
- [ ] A valid upload is transcoded and gets a thumbnail with no manual steps
- [ ] Frontend reflects status changes without a full page reload
- [ ] Completed videos play back correctly in-browser
- [ ] Failed jobs show a clear user-facing error and leave no orphaned files
- [ ] Temp/working files are removed after every job

## 13. Instructions for the Implementing AI

- Follow the step order in Section 8. Don't start on Section 4.2 items unless explicitly asked.
- Check the existing codebase first — if there's already an upload handler, auth middleware, queue, or storage layer, extend it instead of adding a parallel system.
- If the project's real stack differs from Section 5 (e.g. Mongo instead of Postgres, SQS instead of BullMQ), follow what's already there and just note the substitution — don't block on it.
- Keep FFmpeg commands and encoding settings (bitrate, resolution, thumbnail timestamp) in one config file, not scattered across the codebase.
- Verify each step works on its own — e.g. run the ffmpeg command directly against a test file in the container — before wiring it into the next step.
- Prefer several small, reviewable changes over one large one.
- If completing this would require deleting or overwriting files unrelated to this feature, stop and ask first.
