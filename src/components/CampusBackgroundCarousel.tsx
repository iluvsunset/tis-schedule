import React, { useEffect, useRef } from 'react';

const CAMPUS_IMAGES = [
  '/campus/campus_1.webp', // Students in TIS uniforms
  '/campus/campus_2.webp', // Modern classroom
  '/campus/campus_3.webp', // Campus grounds & students
  '/campus/campus_4.webp', // TIS campus activity
  '/campus/campus_5.webp', // TIS student event
  '/campus/campus_6.webp', // TIS Main Building facade
];

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    v_uv.y = 1.0 - v_uv.y; // Flip Y for WebGL texture
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_tex0;
  uniform sampler2D u_tex1;
  uniform float u_progress;
  uniform float u_time;

  // Subtle 5-tap Gaussian Blur in shader for 120fps GPU performance
  vec4 sampleBlurred(sampler2D tex, vec2 uv, float zoom) {
    vec2 centeredUv = (uv - 0.5) * zoom + 0.5;
    vec2 off = vec2(0.0035, 0.0035);
    vec4 col = texture2D(tex, centeredUv) * 0.36;
    col += texture2D(tex, centeredUv + off) * 0.16;
    col += texture2D(tex, centeredUv - off) * 0.16;
    col += texture2D(tex, centeredUv + vec2(off.x, -off.y)) * 0.16;
    col += texture2D(tex, centeredUv + vec2(-off.x, off.y)) * 0.16;
    return col;
  }

  void main() {
    // Subtle Ken Burns slow pan/zoom
    float zoom0 = 0.95 - sin(u_time * 0.05) * 0.03;
    float zoom1 = 0.98 - cos(u_time * 0.05) * 0.03;

    vec4 col0 = sampleBlurred(u_tex0, v_uv, zoom0);
    vec4 col1 = sampleBlurred(u_tex1, v_uv, zoom1);

    // Smooth sinusoidal crossfade
    float t = smoothstep(0.0, 1.0, u_progress);
    vec4 finalColor = mix(col0, col1, t);

    // Dark luxury TIS Navy vignette overlay directly on GPU
    float dist = distance(v_uv, vec2(0.5, 0.5));
    finalColor.rgb *= (1.0 - dist * 0.45);
    
    // Mix with Deep Navy tone for 100% text readability
    vec3 navyTint = vec3(0.04, 0.07, 0.14);
    finalColor.rgb = mix(finalColor.rgb, navyTint, 0.58);

    gl_FragColor = vec4(finalColor.rgb, 1.0);
  }
`;

export const CampusBackgroundCarousel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use 0.5x internal resolution for 60-120fps GPU performance on any iPhone/mobile
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const updateSize = () => {
      canvas.width = Math.floor((window.innerWidth * 0.5) * dpr);
      canvas.height = Math.floor((window.innerHeight * 0.5) * dpr);
    };
    updateSize();

    const gl = canvas.getContext('webgl', { 
      alpha: false, 
      antialias: false, 
      powerPreference: 'low-power' 
    });

    if (!gl) return;

    // Shader compilation helper
    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const aPositionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTex0Loc = gl.getUniformLocation(program, 'u_tex0');
    const uTex1Loc = gl.getUniformLocation(program, 'u_tex1');
    const uProgressLoc = gl.getUniformLocation(program, 'u_progress');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');

    gl.uniform1i(uTex0Loc, 0);
    gl.uniform1i(uTex1Loc, 1);

    // Create GPU Textures
    const createTexture = () => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return tex;
    };

    const texture0 = createTexture();
    const texture1 = createTexture();

    // Preload HTMLImageElements
    const loadedImages: HTMLImageElement[] = [];
    let isMounted = true;

    CAMPUS_IMAGES.forEach((src) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      loadedImages.push(img);
    });

    const uploadTexture = (texUnit: number, texture: WebGLTexture, img: HTMLImageElement) => {
      gl.activeTexture(texUnit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      if (img.complete && img.naturalWidth > 0) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      }
    };

    let currentIndex = 0;
    let nextIndex = 1;
    let transitionStartTime = performance.now();
    const DISPLAY_DURATION = 7000; // 7s hold
    const TRANSITION_DURATION = 1800; // 1.8s crossfade
    let animFrameId: number;

    const render = (timeNow: number) => {
      if (!isMounted) return;

      // Handle window visibility tab pauses
      if (document.hidden) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);

      const elapsed = timeNow - transitionStartTime;
      const totalCycle = DISPLAY_DURATION + TRANSITION_DURATION;

      let progress = 0;
      if (elapsed > DISPLAY_DURATION) {
        progress = Math.min((elapsed - DISPLAY_DURATION) / TRANSITION_DURATION, 1.0);
      }

      if (elapsed >= totalCycle) {
        currentIndex = nextIndex;
        nextIndex = (nextIndex + 1) % loadedImages.length;
        transitionStartTime = timeNow;
        progress = 0;
      }

      const img0 = loadedImages[currentIndex];
      const img1 = loadedImages[nextIndex];

      if (img0 && img0.complete) uploadTexture(0, texture0, img0);
      if (img1 && img1.complete) uploadTexture(1, texture1, img1);

      gl.uniform1f(uProgressLoc, progress);
      gl.uniform1f(uTimeLoc, timeNow * 0.001);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      updateSize();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isMounted = false;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      gl.deleteTexture(texture0);
      gl.deleteTexture(texture1);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none"
    >
      {/* Ultra-Lightweight Hardware-Accelerated WebGL Background Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transform-gpu pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.9,
          willChange: 'transform',
        }}
      />

      {/* Subtle Studio Lighting Gradients in TIS Navy & Amber */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
