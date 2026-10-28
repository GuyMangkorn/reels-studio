# POOLDEPTH-SHORT Blender preflight (D1)

Date: 2026-10-28. Owner: Boss. Checkout: branch `claude/pool-depth-short`. Scope: tooling only. No assets built, no spikes S0-S4 started, brief not edited. Pass here is tooling evidence, not visual or runtime proof of the Blender route (`VD01` stays `needs-feasibility` until S0).

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| PF1 | Blender app present | pass | `/Applications/Blender.app`; CLI `--version` = Blender 5.2.3 LTS (build 2026-10-22). MCP session reports `5.2.3 LTS`. |
| PF2 | MCP connection | pass | Port 9876 LISTEN by Blender (pid 23219). `get_blendfile_summary_path_info` ok (unsaved, `filepath ""`). `get_objects_summary` ok: default scene (Camera, Cube, Light), mode OBJECT. |
| PF3a | Render works | pass | `render_thumbnail_to_path` returned ok; PNG 1920x1080 RGBA, 1.17 MB, written by the add-on to its own temp dir `/var/folders/g3/vqn5pv1962921q7x8kvxytdm0000gn/T/blender_x8cZd3/blender_mcp/thumb.png` (the requested scratchpad path was not honored; file not in repo). Content not visually inspected. |
| PF3b | EEVEE | pass | Default engine `BLENDER_EEVEE`. |
| PF3c | Cycles | pass (switch only) | `scene.render.engine = 'CYCLES'` accepted, then restored to EEVEE. Cycles preferences exist. No Cycles frame rendered yet (S0 must). |
| PF3d | Cycles device | pass | `compute_device_type` METAL; devices: Apple M1 CPU (off), Apple M1 GPU 8 cores METAL (on). Scene `cycles.device` is CPU: set `GPU` in `build.py`. Only 8 GPU cores: budget S0 render times. |
| PF4a | Blender image/video export | pass | `ImageFormatSettings` lists PNG, OPEN_EXR, FFMPEG (`bpy.app.build_options.codec_ffmpeg` true). PNG sequence is the safe route. |
| PF4b | ffmpeg/ffprobe on PATH | fail (not required) | `which ffmpeg ffprobe` finds nothing; no Homebrew copy. |
| PF4c | Remotion media decode/encode | unknown | `remotion` 4.0.538; `node_modules/@remotion/compositor-darwin-arm64/` ships `ffmpeg`/`ffprobe`, but run directly they fail with `Library not loaded: libavdevice.dylib` (needs the DYLD path Remotion sets itself). A real Remotion render of a Blender clip is not tested. |
| PF5 | Glass/water refraction hint | pass (hint only) | Principled/glass shader nodes present in the build; Cycles available. IOR 1.333 volume refraction expected to work in Cycles. Not tested. |

## Fixes and notes

- PF4b: not blocking. Use PNG sequences from Blender and let Remotion consume frames/MP4 produced by its own bundled ffmpeg (`Scene.media` accepts `Img` or `OffthreadVideo`). If a standalone MP4 from Blender is wanted, use Blender's FFMPEG output (PF4a). Optional for the user: `brew install ffmpeg` for ad-hoc checks and contact sheets.
- PF4c: S0 should include one Remotion CLI render of a Blender PNG sequence and an `ffprobe` check via Remotion's bundled binary (`npx remotion ffprobe`).
- Scene defaults to 1920x1080 at 24 fps: `build.py` must set 1080x1920 and 30 fps (`VD10`).
- The open scene is the unsaved default; nothing was modified (engine switch was restored). Blender state is the user's own; save `.blend` sources under the repo only when assets begin.
- Thumbnail path caveat: write real renders with `bpy.ops.render.render` to explicit repo paths in `build.py`, not through `render_thumbnail_to_path`.
