import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'
import gsap from 'gsap'



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Debug
const gui = new lil.GUI()
const parameters = {
    
    position: {
        x:0,y:0,z:0
    },
    spacing: 0,
    amount: 10,

    moveObjects: () => {
        moveObjects(parameters.position,parameters.spacing)
    }, 
}

function moveObjects(position,spacing=0) { //TODO: Make it so that you can move center in 3D

    //const lowpoint = ( 1 - objects.length ) / 2 * (1+spacing) + center

    // height of each cube
    const size = 1
    
    objects.forEach((slice,k) => {
        slice.forEach((col,j) => {
            col.forEach((obj,i) => {

                        // Decide on the end color as a function of the grouped variable
                const endColor = (spacing===0) ? new THREE.Color('skyblue')  : obj.color //TODO make it so that you can change the color it transitions into
        
                // Animate color transition
                gsap.to(obj.mesh.material.color,{duration:1,r:endColor.r,g:endColor.g,b:endColor.b})

        
                // Animate movement
                gsap.to(obj.mesh.position, {
                                            duration: 1,
                                            x: position.x + j*(size + spacing),
                                            y: position.y + i*(size + spacing),
                                            z: position.z + k*(size + spacing),
                                        })

            })
        })
    })
 
   
    console.log(objects[0][0][0].mesh.position)
 }

const positionFolder = gui.addFolder('Position')
positionFolder.add(parameters.position,'x')
positionFolder.add(parameters.position,'y')
positionFolder.add(parameters.position,'z')

gui.add(parameters,'spacing')
gui.add(parameters,'moveObjects')

// Objects

const objects = []
const colors = ['blue','purple','orange','cyan','white','pink']

for (let k = 0; k < parameters.amount;k++){
    objects[k]= []
    for (let j = 0; j < parameters.amount; j++){
        objects[k][j] = []
        for(let i = 0; i < parameters.amount; i += 1){

            const geometry = new THREE.BoxGeometry(1, 1, 1)
            const material = new THREE.MeshBasicMaterial({ color: colors[i] })
            const mesh = new THREE.Mesh(geometry, material)
            scene.add(mesh)

            objects[k][j][i] = 
            {
                mesh:mesh,
                color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)])
            }
        }
    }
}

moveObjects(parameters.position,parameters.spacing)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate


const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()