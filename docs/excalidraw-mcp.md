# Excalidraw MCP สำหรับมาร์ค

ใช้ [server ทางการ excalidraw/excalidraw-mcp](https://github.com/excalidraw/excalidraw-mcp) แบบ local STDIO ตามที่ผู้ใช้เลือก Server และ dependencies ติดตั้งนอก repo; config อยู่ใน `~/.codex/config.toml` ของเครื่อง ไม่ใช่ใน agent TOML มาร์คสืบทอด MCP servers จากแชตที่เรียกใช้ตาม [OpenAI custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents)

## ติดตั้งและเปิดใช้

ตัวอย่างสำหรับเครื่องใหม่ที่มี Node.js, Git และ pnpm แล้ว:

```bash
git clone https://github.com/excalidraw/excalidraw-mcp.git "$HOME/.local/share/excalidraw-mcp"
cd "$HOME/.local/share/excalidraw-mcp"
pnpm install --frozen-lockfile
pnpm run build
codex mcp add excalidraw -- node "$HOME/.local/share/excalidraw-mcp/dist/index.js" --stdio
codex mcp get excalidraw
```

หากมี installation อยู่แล้ว ให้ตรวจ source/revision ก่อนอัปเดตแทนการ clone ทับ เครื่องนี้ติดตั้ง package `0.3.2` จาก commit `157aa23ceb1976008aadc89eb05e3444060f09d6` วันที่ 26 ตุลาคม 2026 และใช้ absolute path ของ Node ที่ตรวจแล้ว เพื่อไม่พึ่ง PATH ของ GUI Source ใช้ MIT license; ไม่ได้คัดลอก code/assets ของ server เข้ามาใน repo นี้

Codex ใช้ `[mcp_servers.excalidraw]` ใน TOML โดยมี `command` และ `args`; JSON `mcpServers` ที่ผู้ใช้ส่งมาเป็นรูปแบบของ client อื่น ดู [OpenAI MCP configuration](https://learn.chatgpt.com/docs/extend/mcp) หากแชตยังไม่มีเครื่องมือหลังเพิ่ม config ให้ไป Settings → MCP servers เลือก server แล้วกด Restart จากนั้นตรวจ `/mcp` หรือเริ่มแชตใหม่ตามการโหลดของ client การมี config ไม่ได้ยืนยันว่าทุกแชตที่เปิดอยู่โหลด server แล้ว

Local server ไม่ต้องใส่ API key ส่วน [remote endpoint ที่ผู้พัฒนาแนะนำ](https://github.com/excalidraw/excalidraw-mcp#remote-recommended) เป็นอีกทางเลือก ไม่ใช่ transport ที่ตั้งค่าในงานนี้

## วิธีใช้สำหรับ storyboard

1. ตรวจว่าแชตมีเครื่องมือ Excalidraw จริงก่อนอ้างว่าใช้ MCP แล้ว เรียก `read_me` ครั้งแรกเพื่ออ่านรูปแบบ element ที่ server นี้รับ แล้วใช้ `create_view` ด้วย argument `elements` ซึ่งเป็น JSON array ที่ serialize เป็น string
2. แสดงหนึ่ง story scene ต่อ view/ชุด panel ให้สัมพันธ์กับ `.excalidraw` และ scene sheet ตาม [workflow มาร์ค](mark-storyboard-workflow.md) รักษา scene/shot/panel IDs, Short/Long framing, ซับไทย และเจตนาแสงเงาสี การวาดผ่าน MCP ไม่เปลี่ยนข้อตกลงว่าฉากและ runtime art เป็น shared assets
3. เก็บ `checkpointId` จากผล `create_view` เมื่อต้องแก้ต่อ ให้เริ่ม elements ด้วย `{"type":"restoreCheckpoint","id":"..."}` แล้วใช้ operations ที่ `read_me` รองรับ พร้อมรักษา IDs เดิม รับ user edits/context จาก widget เมื่อ client ส่งมา และบันทึก revision ให้ตรงกับที่ตรวจจริง
4. เก็บไฟล์แก้ไขได้ที่ `storyboards/<episode>/<scene>.excalidraw` พร้อม scene sheet เสมอ Checkpoint ของ local server อยู่ใน temporary directory และมีการ prune จึงไม่ใช่ไฟล์ถาวรของโปรเจกต์ อย่าเพียงเปลี่ยนนามสกุล simplified payload: pseudo-elements เช่น camera/checkpoint/delete และ helper labels ต้องถูกแปลงเป็น schema Excalidraw มาตรฐานก่อนบันทึก ตรวจ parse และเปิด/ตรวจ visual export เมื่อทำได้
5. หากมีการแก้ใน editor ให้ส่งออก/บันทึก state ฉบับแก้ล่าสุดกลับเป็นไฟล์ของฉาก แล้วเทียบ revision กับ scene sheet การมี checkpoint ใหม่ไม่พิสูจน์ว่าไฟล์ใน repo ถูกอัปเดตแล้ว
6. ตรวจภาพใน widget หรือ export จริงก่อนบอกว่าภาพผ่าน ตรวจไทย layout, key action, reveal และสองสัดส่วน การได้คำตอบ `Diagram displayed` จาก protocol ยืนยันเพียง tool call สำเร็จ ไม่ใช่หลักฐานว่า host แสดงภาพถูกต้อง

เครื่องมือ model-facing หลักที่ตรวจพบคือ `read_me` และ `create_view` ส่วน `save_checkpoint`, `read_checkpoint`, `export_to_excalidraw` เป็น app/widget-only ตาม metadata ของเวอร์ชันนี้ อย่าสมมติว่ามี screenshot tool, filesystem export tool หรือความสามารถอ่านไฟล์ local ให้เอง ให้อ่าน source `.excalidraw` ด้วยเครื่องมือไฟล์แล้วเตรียม elements ตาม format ที่รองรับ

`export_to_excalidraw` อัปโหลด diagram เพื่อสร้างลิงก์บน excalidraw.com ไม่ใช่การบันทึก local ใช้เมื่อผู้ใช้ขอ export/share ไปที่นั่นโดยชัดเจน; งานส่ง dev ปกติใช้ไฟล์ใน repo และ generated previews ใน `out/`

## หลักฐานการตรวจ installation นี้

- Build จาก lockfile ผ่าน รวม TypeScript, bundled server และ MCP App HTML
- STDIO initialize และ `tools/list` ผ่าน พบ Excalidraw server และเครื่องมือที่ระบุด้านบน
- เรียก `read_me`, `create_view` และสร้าง revision จาก `restoreCheckpoint` ผ่าน
- `resources/list` และ `resources/read` ของ MCP App HTML ผ่าน
- `codex mcp get excalidraw` ยืนยัน enabled และ local STDIO command/args
- ยังไม่ได้ตรวจ interactive widget ใน host หรือการสร้าง storyboard จริงทั้งฉาก; ต้องแยกจากผลทดสอบ protocol ข้างต้น

เมื่อ config หายหรือ server เริ่มไม่ได้ ให้ตรวจ Node path, `dist/index.js`, config และ client reload ก่อน การอ้างว่า MCP ไม่พร้อมต้องระบุข้อผิดพลาดจริง แล้วจึงใช้การสร้างไฟล์ Excalidraw โดยตรงเป็น fallback โดยไม่อ้างว่าเป็นผลจาก MCP
