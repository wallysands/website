---
title: "Jello Jump"
summary: "A small OpenGL platformer prototype focused on making a cube feel gelatinous through charged jumps, squash-and-stretch animation, particles, and a trailing camera."
year: "2025"
tools: ["C++17", "OpenGL", "SDL3", "GLM", "GLSL"]
links: []
status: "available"
image: "/projects/jello-jump/player-texture.jpg"
video:
  src: "/projects/jello-jump/game-with-audio-and-closer-camera.mp4"
  poster: "/projects/jello-jump/player-texture.jpg"
  caption: "Walkthrough recording with audio narration, showing the charged jump controls and gelatinous motion."
---

Jello Jump is a solo graphics project about making a simple cube feel alive. The game takes inspiration from *Jump King* and *Thomas Was Alone*: the player charges a jump by holding a direction key, then releases to launch the character. The controls intentionally push in the opposite direction of the visual compression, so the cube feels like a spring being squeezed before it snaps back.

The main technical focus was time-based animation driven by physics-like values. Gravity changes the vertical velocity every frame, horizontal movement is damped by friction while grounded, and the character model deforms from the current velocity. Fast vertical motion stretches the cube upward, hard landings squash it outward, and diagonal movement can introduce shear so the body feels soft instead of rigid.

To keep the deformation from flashing or snapping between poses, the character's current transform is compared against the previous frame and interpolated when the change is too large. That smoothing made the affine transformations feel closer to jello, even though the model itself stays a cube.

The prototype also includes a few small systems around the central movement loop:

- Cast shadows, normal maps, and textured OpenGL geometry for the player and platforms.
- Collision-triggered particles that shed from the character and settle onto walls or floors.
- A camera dead zone that trails the character instead of locking perfectly to it, giving the view a slower, softer motion.

## Affine transformation sketches

The progress report framed the animation problem as a sequence of affine transformations: compress the cube before release, stretch it along the jump, combine axes for diagonal motion, and squash against collision surfaces before recovering to the base shape.

<div class="project-figure-grid">
  <figure>
    <img src="/website/projects/jello-jump/jump-stretch-squash.png" alt="Jump sequence sketch showing a cube at rest, squashed during charge, and stretched during vertical motion." loading="lazy" />
    <figcaption>Vertical charge: squash on the platform, then stretch through the jump.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/jello-jump/diagonal-stretching.png" alt="Diagonal movement sketch showing the cube compressing and stretching across several angled poses." loading="lazy" />
    <figcaption>Diagonal launch: combine directional compression and stretch across a longer arc.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/jello-jump/wall-impact.png" alt="Wall impact sketch showing the cube stretched vertically against a wall." loading="lazy" />
    <figcaption>Wall impact: compress into the collision side, spread, then settle back to the cube shape.</figcaption>
  </figure>
</div>

The result is a compact graphics demo where the game feel comes mostly from animation principles: squash and stretch, anticipation, follow-through, arcs, and exaggeration. Future work would push the material further with transparency, stronger jiggle after impacts, and rotation-based deformation so the cube can lean into momentum instead of relying only on scale and shear.
