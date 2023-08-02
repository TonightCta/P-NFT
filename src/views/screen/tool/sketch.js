import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const fragmentShader = `
#include <packing>
uniform float time;
uniform float progress;
uniform sampler2D depthInfo;
uniform vec4 resolution;
varying float vDepth;
varying vec2 vUv;
varying vec2 vUv1;
varying vec3 vPosition;
uniform float cameraNear;
uniform float cameraFar;
float PI = 3.141592653589793238;
float readDepth( sampler2D depthSampler, vec2 coord ) {
    float fragCoordZ = texture2D( depthSampler, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}
void main()\t{
    float depth = readDepth( depthInfo, vUv1 );
    float tomix = smoothstep(0.2, 1., vDepth);
    gl_FragColor.rgb = mix(vec3(0.443,0.02,0.353),2.*vec3(0.,0.01,0.125),tomix);
    gl_FragColor.a = 1.0;

}`
const vertexShader = `
#include <packing>
//\tSimplex 3D Noise
//\tby Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
    dot(p2,x2), dot(p3,x3) ) );
}
uniform float time;
uniform float progress;
varying vec2 vUv;
varying vec2 vUv1;
varying vec3 vPosition;
varying float vDepth;
uniform vec2 pixels;
float PI = 3.141592653589793238;
uniform sampler2D depthInfo;
uniform vec4 resolution;

uniform float cameraNear;
uniform float cameraFar;


attribute float y;

float readDepth( sampler2D depthSampler, vec2 coord ) {
    float fragCoordZ = texture2D( depthSampler, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}
void main() {
    vUv = uv;
    vec2 vUv1 = (vec2(vUv.x,y) - 0.5)/resolution.zw + vec2(0.5);
    float depth = readDepth( depthInfo, vUv1 );

    vec3 pos = position;
    pos.z +=(1. - depth)*0.6*progress;
    pos.y += 0.01*snoise(vec3(vUv1*30.,time/100.));
    vDepth = depth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}`

export default class Sketch {
  constructor(options) {
    /*scene*/
    this.scene = new THREE.Scene()

    /*container*/
    this.container = options.dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    /*renderer*/
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0x000000, 1)
    this.renderer.physicallyCorrectLights = true
    // this.renderer.outputEncoding = THREE.sRGBEncoding; // hide for fast render(recommend)

    this.container.appendChild(this.renderer.domElement)

    /*cameras*/
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 5)
    this.camera1 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 2.1, 3)

    this.camera.position.set(0, -0.2, 1.2)
    this.camera.rotation.set(0.3, 0, 0)
    this.camera1.position.set(0, 0, 2)

    this.scene.add(new THREE.AmbientLight(0x59314f))
    this.light = new THREE.PointLight(0xf3398d, 2.2, 5, 1)
    this.scene.add(this.light)

    /*use for test*/
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    /*vars control*/
    this.time = 0
    this.isPlaying = true
    /*initial setup*/
    this.addObjects()
    this.resize()
    this.render()
    this.setupResize()
  }

  addObjects() {
    /*define material*/
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        depthInfo: { value: 0 },
        progress: { value: 0.6 },
        cameraNear: { value: this.camera1.near },
        cameraFar: { value: this.camera1.far },
        resolution: { value: new THREE.Vector4() },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader,
      fragmentShader,
    })

    /*make lines*/
    for (let i = 0; i <= 100; i++) {
      this.geometry = new THREE.PlaneBufferGeometry(4, 0.005, 300, 1)

      let y = []
      let len = this.geometry.attributes.position.array.length
      for (let j = 0; j < len / 3; j++) {
        y.push(i / 100)
      }
      this.geometry.setAttribute('y', new THREE.BufferAttribute(new Float32Array(y), 1))

      this.plane = new THREE.Mesh(this.geometry, this.material)
      this.plane.position.y = (i - 50) / 50
      this.scene.add(this.plane)
    }

    /*=======Start DepthFormat==========*/
    let format = THREE.DepthFormat
    let type = THREE.UnsignedShortType

    this.target = new THREE.WebGLRenderTarget(this.width, this.height)
    this.target.texture.format = THREE.RGBFormat
    this.target.texture.minFilter = THREE.NearestFilter
    this.target.texture.magFilter = THREE.NearestFilter
    this.target.texture.generateMipmaps = false
    // this.target.stencilBuffer = format === THREE.DepthStencilFormat ? true : false
    this.target.stencilBuffer = false
    this.target.depthBuffer = true
    this.target.depthTexture = new THREE.DepthTexture(this.width, this.height)
    this.target.depthTexture.format = format
    this.target.depthTexture.type = type
    /*=======End DepthFormat==========*/

    /*load glb*/
    this.loader = new GLTFLoader()
    this.loader.load('/glb/face_mesh_v030.glb', (GLTF) => {
      this.model = GLTF.scenes[0].children[0]
      this.model.rotation.set(1.8, 0, 0)
      this.model.position.set(0, 0.4, -1.5)
      const s = 0.086
      this.model.scale.set(s, s, s)

      /*use for test*/
      // this.model.traverse((O) => {
      //   if (O.isMesh) {
      //     O.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      //   }
      // })

      this.scene.add(this.model)
    })
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    if (!this.container) return
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height

    // image cover
    this.imageAspect = 1
    let a1
    let a2
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect
      a2 = 1
    } else {
      a1 = 1
      a2 = this.height / this.width / this.imageAspect
    }

    this.material.uniforms.resolution.value.x = this.width
    this.material.uniforms.resolution.value.y = this.height
    this.material.uniforms.resolution.value.z = a1
    this.material.uniforms.resolution.value.w = a2

    this.camera.updateProjectionMatrix()
    this.camera1.updateProjectionMatrix()
  }

  stop() {
    this.isPlaying = false
  }

  play() {
    this.isPlaying = true
    // if (!this.isPlaying) {
    //   this.render()
    //   this.isPlaying = true
    // }
  }

  render() {
    this.time++
    // if (!this.isPlaying) return

    /*model animation*/
    if (this.model) {
      this.model.position.z = !this.isPlaying ? -2.5 : -1.7 + 0.9 * Math.sin(this.time / 30)
      this.model.rotation.z = +0.3 * Math.cos(this.time / 120)
    }

    /*render target & camera*/
    this.renderer.setRenderTarget(this.target)
    this.renderer.render(this.scene, this.camera1)

    this.material.uniforms.depthInfo.value = this.target.depthTexture

    this.renderer.setRenderTarget(null)
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)

    this.material.uniforms.time.value = this.time

    /*Animation Run*/
    requestAnimationFrame(this.render.bind(this))
  }
}
