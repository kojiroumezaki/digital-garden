---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<img src="{{ '/assets/images/a distance intertwined cover.jpg' | relative_url }}" alt="a distance, intertwined cover art">

<style>
	#image-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		width: 400px;
		height: 400px;
	}

	.image-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border: 1px solid #ccc;
		border-radius: 10px;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.2s;
	}

	.image-container:hover img {
		transform: scale(1.1);
	}
</style>

<div id="image-grid"></div>

<script>
	document.addEventListener('DOMContentLoaded', () => {
		const images = [
						'./assets/images/hydrangea.jpg',
						'./assets/images/hydrangea.jpg',
						'./assets/images/hydrangea.jpg',
						'./assets/images/hydrangea.jpg'
					];
		const imageGrid = document.getElementById('image-grid');

		const imageContainer = document.createElement('div');
		imageContainer.classList.add('image-container');

		images.forEach(src => {
			const imageContainer = document.createElement('div');
			imageContainer.classList.add('image-container');
			
			const img = document.createElement('img');
			img.src = src;
			img.alt = 'Grid Image';
			
			imageContainer.appendChild(img);
			imageGrid.appendChild(imageContainer);
		});
	});
</script>
