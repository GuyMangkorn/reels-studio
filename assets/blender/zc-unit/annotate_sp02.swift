// SP02 preview annotator (QA tool). Draws a title bar with the shot ID (preview-labels rule) and optional zone rectangles on a local still.
// Usage: swift assets/blender/zc-unit/annotate_sp02.swift <in.png> <out.png> <spec.json>
// spec.json: {"title": "B10-SH01 | SS-R2.4 | TH 0:00.0 [c0, b1] | blockout", "rects": [{"box": [x0,y0,x1,y1], "color": "#ff0000", "label": "caption zone", "fill": 0.25}]}
import AppKit
import Foundation

struct Rect: Decodable { let box: [Double]; let color: String; let label: String?; let fill: Double? }
struct Spec: Decodable { let title: String; let rects: [Rect]? }

func color(_ hex: String, _ a: CGFloat = 1) -> NSColor {
    let v = UInt32(hex.dropFirst(), radix: 16) ?? 0xffffff
    return NSColor(srgbRed: CGFloat((v >> 16) & 255) / 255, green: CGFloat((v >> 8) & 255) / 255, blue: CGFloat(v & 255) / 255, alpha: a)
}

let a = CommandLine.arguments
guard a.count == 4, let img = NSImage(contentsOfFile: a[1]),
      let spec = try? JSONDecoder().decode(Spec.self, from: Data(contentsOf: URL(fileURLWithPath: a[3]))),
      let rep0 = img.representations.first else { fputs("usage: annotate_sp02.swift in.png out.png spec.json\n", stderr); exit(1) }
let w = rep0.pixelsWide, h = rep0.pixelsHigh
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true,
                           isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
img.draw(in: NSRect(x: 0, y: 0, width: w, height: h))
let font = NSFont.boldSystemFont(ofSize: 22)
func text(_ s: String, _ x: Double, _ yTop: Double, _ c: NSColor, bg: Bool) {
    let attrs: [NSAttributedString.Key: Any] = [.font: font, .foregroundColor: c]
    let sz = (s as NSString).size(withAttributes: attrs)
    let r = NSRect(x: x, y: Double(h) - yTop - Double(sz.height), width: Double(sz.width) + 12, height: Double(sz.height) + 4)
    if bg { NSColor(white: 0, alpha: 0.65).setFill(); r.fill() }
    (s as NSString).draw(at: NSPoint(x: r.minX + 6, y: r.minY + 2), withAttributes: attrs)
}
for r in spec.rects ?? [] {
    let b = r.box
    let rc = NSRect(x: b[0], y: Double(h) - b[3], width: b[2] - b[0], height: b[3] - b[1])
    if let f = r.fill { color(r.color, CGFloat(f)).setFill(); rc.fill() }
    color(r.color).setStroke()
    let p = NSBezierPath(rect: rc); p.lineWidth = 3; p.stroke()
    if let l = r.label { text(l, b[0] + 2, b[1] + 2, color(r.color), bg: true) }
}
text(spec.title, 0, 0, .white, bg: true)
NSGraphicsContext.restoreGraphicsState()
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
