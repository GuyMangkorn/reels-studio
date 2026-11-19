# EDU-EP30 build notes

## T13 Lewis gun mechanics (Boss, 2026-11-19)
- A far-half tick or flat drawn inside a beast build is hidden by the centre-depth sort (`paintBeast` sorts parts, caps and flats by the depth of their centre; a cap's centre is nearer than the far half of anything on it). Mark a turning part in world space after the build instead (`paintLewisPanTicks`).
- Sheet anchors (muzzle, pan, port) for the Lewis gun were estimated for a longer gun than the locked geometry; see the ticket Result, A1-A2.
