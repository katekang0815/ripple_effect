import React, { useRef, useEffect } from 'react';

/**
 * RippleBackground
 * 
 * Uses WebGL to render a smooth, animated gradient sphere that follows the mouse
 * and distorts like liquid.
 */
const RippleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // --- Shader Sources ---

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse; // Smooth mouse position in pixels

      // Simplex 2D noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;

        // Convert mouse pixel coords to UV space (0.0 - 1.0)
        vec2 mouseUV = u_mouse / u_resolution.xy;
        
        // Aspect corrected coordinates
        vec2 st = uv;
        st.x *= aspect;
        
        vec2 m = mouseUV;
        m.x *= aspect;

        // --- Interaction & Distortion ---
        
        // Distance from the current mouse position
        float d = distance(st, m);
        
        // Create a ripple wave based on distance and time
        // Frequency and speed of the wave
        float wave = sin(d * 12.0 - u_time * 2.5);
        
        // The distortion is strongest near the mouse and fades out
        float distortionStrength = 0.02 * exp(-d * 2.5);
        
        // Calculate the displacement vector
        vec2 displacement = normalize(st - m) * wave * distortionStrength;
        
        // Apply displacement to UVs for the background texture look
        vec2 distortedUV = uv - displacement;
        
        // --- Gradient Orb Render ---
        
        // We use the distorted coordinates for the orb calculation to give it a "liquid" feel
        // as it moves through the space.
        vec2 sphereUV = distortedUV;
        sphereUV.x *= aspect;
        
        float sphereDist = distance(sphereUV, m);
        
        // Colors
        vec3 bg = vec3(0.925, 0.921, 0.913); // Light Beige #ECEBE9
        vec3 c1 = vec3(1.0, 0.368, 0.227);   // Orange/Red #FF5E3A
        vec3 c2 = vec3(1.0, 0.7, 0.4);       // Soft Peach
        vec3 c3 = vec3(0.5, 0.7, 1.0);       // Soft Blue accent

        // Shape mixing
        // Large soft glow
        float glow = smoothstep(0.55, 0.0, sphereDist);
        
        // Tighter, brighter core
        float core = smoothstep(0.20, 0.0, sphereDist);
        
        // Dynamic noise for internal texture variation
        float n = snoise(sphereUV * 2.5 + u_time * 0.4);
        
        // Composition
        // 1. Start with background
        // 2. Mix in the peach glow
        vec3 color = mix(bg, c2, glow * 0.6);
        
        // 3. Mix in the strong orange core
        color = mix(color, c1, core * 0.85);
        
        // 4. Add blue accents based on noise within the glow area
        color = mix(color, c3, smoothstep(0.2, 0.6, n) * glow * 0.4);
        
        // Add film grain for texture
        float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        color += (grain - 0.5) * 0.035;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // --- Setup Helper Functions ---

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    // --- Initialization ---

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertShader || !fragShader) return;

    const program = createProgram(gl, vertShader, fragShader);
    if (!program) return;

    gl.useProgram(program);

    // Full screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    // --- State & Animation Loop ---

    // Initial position at center
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = window.innerHeight - e.clientY; // Invert Y for WebGL
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handling
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl?.viewport(0, 0, canvas.width, canvas.height);
      
      // Update targets if we haven't moved mouse yet (optional, keeps it centered on resize if untouched)
      // But typically we just let it stay where it was.
    }
    window.addEventListener('resize', resize);
    resize();

    let startTime = performance.now();
    let animationFrameId: number;

    function render() {
      if (!gl || !program) return;

      const currentTime = (performance.now() - startTime) / 1000;
      
      // Smooth interpolation (Inertia)
      // The 0.08 factor controls the "lag". Lower = heavier/slower.
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform2f(mouseLocation, currentX, currentY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />;
};

export default RippleBackground;