# Immersive web and 3D (opt-in)
Source: reviewed local Work/3D_ENGINEERING_AND_WEB_STACK.md, 2026-11-24. This is a selective web-design router, not an installation checklist or a CAD workflow. The owner maintains the local engineering index separately.

## Select the minimum viable approach
- Ordinary entrances, feedback, reveal: native CSS/WAAPI, Emil motion guidance, then selected Motion Anything recipes (https://github.com/nexu-io/motion-anything). Never install every recipe as a global skill.
- Scroll-linked narrative: native scroll-driven animation when supported and appropriate; otherwise evaluate GSAP ScrollTrigger (https://github.com/greensock/GSAP). One scroll controller and one coordinated frame loop. Lenis (https://github.com/darkroomengineering/lenis) is optional, not a default.
- True interactive product 3D: evaluate https://github.com/Moh4696/open-3d-skills (threejs-scene, exploded-view, site-check; confirm paths at current revision), Three.js (https://github.com/mrdoob/three.js), or model-viewer (https://github.com/google/model-viewer) for a simple GLB viewer. React Three Fiber/drei only for existing React or when approved.
- Advanced scroll-camera references: https://github.com/systoai-design/threejs-scroll-sites and https://github.com/Flaeren/immersive-3d-web; choose one after review, do not install both automatically.
- Engineering product presentation: https://github.com/lubocsu/blueprint-3d-sheet or Open 3D Skills exploded-view; CAD STEP is source truth, GLB is a derivative. Illustrative exploded offsets are not proof of real mechanical movement.
- Rendered scroll-film: Open 3D Skills scroll-film or reviewed frame-sequence/video approach. Clearly distinguish rendered frames from interactive 3D.
- Asset optimization: https://github.com/donmccurdy/glTF-Transform when needed; preserve node identities and pivots. Blender/FreeCAD are optional offline authoring tools, not web runtime dependencies.

## Execution
1. Define story, interactions, budget, target devices, accessibility and fallback. Preserve existing design and grid.
2. Resolve exact upstream repository, revision, license, entrypoint and dependencies before use; source URLs above are candidates, not security approvals. Record in the scoped dependency evidence. Do not execute unreviewed scripts, install global skills or use paid services implicitly.
3. Build the smallest working preview, then improve. Pause work when the tab is hidden or scene offscreen where appropriate. Provide keyboard controls, reduced-motion and non-WebGL fallback; no essential information hidden in motion.
4. Verify normal and reduced-motion, mobile, keyboard, performance and fallback. Test transitions and end-state geometry separately. Keep layout verification risk-tiered. Do not claim CAD or physical validation from browser animation.

No third-party service or new framework is required merely because this intent was selected. For engineering CAD or video production hand off to the appropriate workflow, do not duplicate it here.
