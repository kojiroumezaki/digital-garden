---
layout: post
title: "尺八 3D Model Code: STL Viewer"
date: 2024-09-11
image: "./assets/images/shakuhachi.png"
group: "shakuhachiresearch"
---

{% for post in site.posts %}
  {% if post.title == "尺八 3D Model Code: OpenSCAD" %}
<a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  {% endif %}
{% endfor %}

<style>
	body {
		display: flex;
	}

	.canvas-container {
		text-align: center;
		width: 100%;
		aspect-ratio: 16/9;
		background-color: black;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
    
<div class="canvas-container" id="canvas-container">
    <!-- Three.js canvas will be inserted here -->
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js"></script>

<script>
	let filepath = "{{ site.baseurl }}/assets/STL/Shak_02_Full.stl";
	
    // Basic Three.js setup
	let width = window.innerWidth;
	let height = window.innerHeight;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.domElement.style.width = 100 + '%';
    renderer.domElement.style.height = 100 + '%';

    let container = document.getElementById('canvas-container');
    container.appendChild(renderer.domElement);
    
    // Add a light
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // Create a group to act as a pivot
    let pivot = new THREE.Group();
    scene.add(pivot);

    // Load STL file
    let loader = new THREE.STLLoader();
    loader.load(filepath, function (geometry) {
        let material = new THREE.MeshLambertMaterial({ color: 0xCCCCCC });
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Center the object
        mesh.geometry.computeBoundingBox();
        let center = new THREE.Vector3();
        mesh.geometry.boundingBox.getCenter(center);

        // Adjust the mesh position to a new center of rotation
        mesh.position.sub(center);  // Center the object at the origin

        // Add the mesh to the pivot group
        pivot.add(mesh);
        
        // Set camera position
        camera.position.z = 500;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the pivot group instead of the mesh
        pivot.rotation.x += 0.000;
        pivot.rotation.y += 0.0025;
        pivot.rotation.z += 0.005;
        
        renderer.render(scene, camera);
    }

    animate();

    // Handle window resizing
    window.addEventListener('resize', function () {
        let width = window.innerWidth;
        let height = window.innerHeight;
        renderer.setSize(width, height);
		renderer.domElement.style.width = 100 + '%';
		renderer.domElement.style.height = 100 + '%';
        // camera.aspect = width / height;
        // camera.updateProjectionMatrix();
    });
</script>
