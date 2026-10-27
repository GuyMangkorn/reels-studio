# Excalidraw MCP for Mark

Use the [official excalidraw/excalidraw-mcp server](https://github.com/excalidraw/excalidraw-mcp) over local STDIO, as selected by the user. The server and dependencies are installed outside this repository; machine configuration lives in `~/.codex/config.toml`, not the agent TOML. Mark inherits MCP servers from the calling chat according to [OpenAI custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents).

This guide records setup and historical verification; it does not establish availability in the current session.

<a id="ติดตั้งและเปิดใช้"></a>
## Installation and activation

Example for a new machine with Node.js, Git and pnpm:

```bash
git clone https://github.com/excalidraw/excalidraw-mcp.git "$HOME/.local/share/excalidraw-mcp"
cd "$HOME/.local/share/excalidraw-mcp"
pnpm install --frozen-lockfile
pnpm run build
codex mcp add excalidraw -- node "$HOME/.local/share/excalidraw-mcp/dist/index.js" --stdio
codex mcp get excalidraw
```

For an existing installation, inspect source/revision before updating rather than cloning over it. This machine's recorded installation was package `0.3.2`, commit `157aa23ceb1976008aadc89eb05e3444060f09d6`, on 26 October 2026. It used a verified absolute Node path to avoid relying on the GUI's PATH. The source is MIT-licensed; server code/assets were not copied into this repository.

Codex uses `[mcp_servers.excalidraw]` with TOML `command` and `args`; user-supplied JSON `mcpServers` belongs to another client format. See [OpenAI MCP configuration](https://learn.chatgpt.com/docs/extend/mcp). If tools remain absent after configuration, open Settings → MCP servers, select the server and Restart; then check `/mcp` or start a new chat according to client loading behavior. Configuration does not prove every open chat has loaded the server.

The local server needs no API key. The developers' [recommended remote endpoint](https://github.com/excalidraw/excalidraw-mcp#remote-recommended) is an alternative, not the transport configured for this work.

<a id="วิธีใช้สำหรับ-storyboard"></a>
## Required storyboard workflow

1. Verify that the chat actually has Excalidraw tools before claiming MCP use. Call `read_me` first for the server's accepted element format; then call `create_view` with `elements` containing a serialized JSON array.
2. Present one story scene per view/panel set, synchronized with its `.excalidraw` file and scene sheet under [Mark's workflow](mark-storyboard-workflow.md). Preserve scene/shot/panel IDs, Short/Long framing, Thai subtitles and lighting/shadow/color intent. MCP drawing does not change shared scene/runtime-art ownership.
3. Keep the `checkpointId` from `create_view`. For revisions, start elements with `{"type":"restoreCheckpoint","id":"..."}` and use operations supported by `read_me`, preserving IDs. Accept user edits/context when the client supplies them and record the revision actually reviewed.
4. Always save editable `storyboards/<episode>/<scene>.excalidraw` files with scene sheets. Server checkpoints live in a pruned temporary directory and are not durable project files. Convert simplified payloads into standard Excalidraw schema rather than merely changing their extension: pseudo-elements such as camera/checkpoint/delete and helper labels require conversion. Check parsing and open/inspect a visual export when possible.
5. After editor changes, export/save the latest state back to the scene file and match its revision to the scene sheet. A new checkpoint does not prove that repository files were updated.
6. Inspect the actual widget image or export before declaring a visual pass. Check Thai layout, key actions, reveals and both aspect ratios. A protocol response of `Diagram displayed` establishes tool-call success only, not correct host presentation.

The recorded model-facing tools were `read_me` and `create_view`. In that version's metadata, `save_checkpoint`, `read_checkpoint` and `export_to_excalidraw` were app/widget-only. Verify current tools rather than assuming a screenshot tool, filesystem export or automatic local-file reading exists. Read local `.excalidraw` sources with file tools and prepare supported elements.

`export_to_excalidraw` uploads the diagram to create an excalidraw.com link; it does not save locally. Use it only when the user explicitly requests export/sharing there. Normal developer handoffs use repository files and generated previews in `out/`.

<a id="หลักฐานการตรวจ-installation-นี้"></a>
## Historical installation evidence

The recorded installation checks were:

- Lockfile build passed, including TypeScript, bundled server and MCP App HTML.
- STDIO initialize and `tools/list` passed and returned the Excalidraw server/tools described above.
- `read_me`, `create_view` and a revision using `restoreCheckpoint` passed.
- MCP App HTML `resources/list` and `resources/read` passed.
- `codex mcp get excalidraw` confirmed enabled local STDIO command/args.
- The interactive host widget and a complete real storyboard scene had not been verified; distinguish these gaps from protocol test results.

If configuration disappears or the server fails to start, inspect the Node path, `dist/index.js`, configuration and client reload first. Report the actual error before claiming MCP is unavailable. Direct Excalidraw file authoring is a fallback; describe it as such rather than as MCP output.
