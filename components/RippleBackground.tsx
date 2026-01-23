import React, { useRef, useEffect } from 'react';

interface RippleBackgroundProps {
  intensity: number;
  responsiveness: number;
  dropSize: number;
  bgImage: string | null;
}

const RippleBackground: React.FC<RippleBackgroundProps> = ({ intensity, responsiveness, dropSize, bgImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  const responsivenessRef = useRef(responsiveness);
  const dropSizeRef = useRef(dropSize);
  const bgImageRef = useRef(bgImage);

  // Sync props to refs
  useEffect(() => { intensityRef.current = intensity; }, [intensity]);
  useEffect(() => { responsivenessRef.current = responsiveness; }, [responsiveness]);
  useEffect(() => { dropSizeRef.current = dropSize; }, [dropSize]);
  useEffect(() => { bgImageRef.current = bgImage; }, [bgImage]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false });
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;       
      uniform vec2 u_click;       
      uniform float u_click_time; 
      uniform float u_intensity;
      uniform float u_drop_size;
      uniform sampler2D u_texture;
      uniform bool u_use_texture;

      varying vec2 v_uv;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
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

        vec2 mouseUV = u_mouse / u_resolution.xy;
        vec2 st = uv;
        st.x *= aspect;
        
        vec2 m = mouseUV;
        m.x *= aspect;

        float d = distance(st, m);
        float wave = sin(d * 15.0 - u_time * 3.0);
        float distortionStrength = 0.03 * exp(-d * u_drop_size);
        vec2 displacement = normalize(st - m + 0.0001) * wave * distortionStrength;

        float clickAge = u_time - u_click_time;
        if (clickAge > 0.0 && clickAge < 12.0) {
          vec2 clickUV = u_click / u_resolution.xy;
          clickUV.x *= aspect;
          float dClick = distance(st, clickUV);
          float rippleSpeed = 0.35;
          float rippleRadius = clickAge * rippleSpeed;
          float rippleWave = sin((dClick - rippleRadius) * 20.0);
          float thickness = 0.15;
          float rippleMask = smoothstep(thickness, 0.0, abs(dClick - rippleRadius));
          float rippleFade = exp(-clickAge * 0.375);
          displacement += normalize(st - clickUV + 0.0001) * rippleWave * rippleMask * rippleFade * 0.15;
        }
        
        vec2 distortedUV = uv - (displacement * u_intensity);
        vec3 color;

        if (u_use_texture) {
          color = texture2D(u_texture, distortedUV).rgb;
        } else {
          vec2 sphereUV = distortedUV;
          sphereUV.x *= aspect;
          float sphereDist = distance(sphereUV, m);
          vec3 bg = vec3(0.925, 0.921, 0.913);
          vec3 c1 = vec3(1.0, 0.368, 0.227);
          vec3 c2 = vec3(1.0, 0.7, 0.4);
          vec3 c3 = vec3(0.5, 0.7, 1.0);
          float glow = smoothstep(0.55, 0.0, sphereDist);
          float core = smoothstep(0.20, 0.0, sphereDist);
          float n = snoise(sphereUV * 2.5 + u_time * 0.4);
          color = mix(bg, c2, glow * 0.6);
          color = mix(color, c1, core * 0.85);
          color = mix(color, c3, smoothstep(0.2, 0.6, n) * glow * 0.4);
        }
        
        float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        color += (grain - 0.5) * 0.035;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const clickLoc = gl.getUniformLocation(program, 'u_click');
    const clickTimeLoc = gl.getUniformLocation(program, 'u_click_time');
    const intLoc = gl.getUniformLocation(program, 'u_intensity');
    const dropLoc = gl.getUniformLocation(program, 'u_drop_size');
    const texLoc = gl.getUniformLocation(program, 'u_texture');
    const useTexLoc = gl.getUniformLocation(program, 'u_use_texture');

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let currentTextureUrl: string | null = null;

    const updateTexture = (url: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Correct for standard image orientation vs WebGL texture orientation
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      };
      img.src = url;
    };

    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    let currentX = targetX, currentY = targetY;
    let lastClickX = -1000, lastClickY = -1000, lastClickTime = -20.0;
    const startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => { targetX = e.clientX; targetY = window.innerHeight - e.clientY; };
    const handleClick = (e: MouseEvent) => {
      lastClickX = e.clientX; lastClickY = window.innerHeight - e.clientY;
      lastClickTime = (performance.now() - startTime) / 1000;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);
    const resize = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    let animationFrameId: number;
    const render = () => {
      if (bgImageRef.current !== currentTextureUrl) {
        currentTextureUrl = bgImageRef.current;
        if (currentTextureUrl) updateTexture(currentTextureUrl);
      }

      const currentTime = (performance.now() - startTime) / 1000;
      currentX += (targetX - currentX) * responsivenessRef.current;
      currentY += (targetY - currentY) * responsivenessRef.current;

      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, currentTime);
      gl.uniform2f(mouseLoc, currentX, currentY);
      gl.uniform2f(clickLoc, lastClickX, lastClickY);
      gl.uniform1f(clickTimeLoc, lastClickTime);
      gl.uniform1f(intLoc, intensityRef.current);
      gl.uniform1f(dropLoc, dropSizeRef.current);
      gl.uniform1i(useTexLoc, bgImageRef.current ? 1 : 0);
      gl.uniform1i(texLoc, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />;
};

export default RippleBackground;