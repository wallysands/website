---
title: "Ray Tracer"
summary: "A C++ scene-file ray tracer with sphere and triangle intersections, polymorphic lighting, shadows, recursive reflection and refraction, spot lights, and OpenMP parallelization."
year: "2025"
tools: ["C++14", "OpenMP", "STB Image", "custom scene parser", "Vec3 math"]
links: []
status: "available"
image: "/projects/ray-tracer/spheres1-result.png"
---

Ray Tracer is a CSCI 5607 graphics project that turns plain-text scene descriptions into rendered images. The program parses camera settings, geometry, materials, lights, output size, and recursion depth, then traces one camera ray per pixel to shade the closest visible object.

The core renderer follows the full ray-tracing loop: generate a camera ray, test it against every shape, keep the nearest positive hit, compute the surface normal, shade the hit point, and write the resulting color. Shapes share a common interface, so spheres, flat triangles, and smooth normal-interpolated triangles can be handled in the same pass.

Lighting uses the same polymorphic pattern. Ambient, point, directional, and spot lights each calculate their contribution differently, while shadow checks cast rays back through the scene to see whether another object blocks the light. Spot lights were added as an extension, with a falloff region between the inner and outer cone.

The material model supports recursive reflection and refraction. At each hit point the tracer spawns reflected rays from the surface normal and refracted rays through the material's index of refraction, stopping at the configured maximum depth. Small offsets along the normal keep secondary rays from immediately hitting the same surface again.

Two bugs shaped the final renderer. Specular and refractive scenes started out visibly different from the reference images until the recursion condition was fixed to include the maximum depth. Triangle shadows also failed in some scenes because a directional light was being interpreted in the reverse direction.

OpenMP parallelizes the outer pixel loop so independent rays can be traced across CPU cores. On the scenes measured in the project report, the parallel version cut representative render times from 1381.16 ms to 353.78 ms for `spheres1.txt`, 3933.61 ms to 1141.02 ms for `spheres2.txt`, and 5523.71 ms to 1729.73 ms for `test_reasonable.txt`.

## Render samples

<div class="project-figure-grid project-figure-grid-compact">
  <figure>
    <img src="/website/projects/ray-tracer/spheres1-result.png" alt="Ray traced render from the spheres1 scene file." loading="lazy" />
    <figcaption>`spheres1.txt`: recursive shading and shadows on a simple sphere scene.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/ray-tracer/spheres2-result.png" alt="Ray traced render from the spheres2 scene file." loading="lazy" />
    <figcaption>`spheres2.txt`: additional geometry and reflective material behavior.</figcaption>
  </figure>
</div>
