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
links = []
{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts %}
	links.push("{{ post.url | relative_url }}");
{% endfor %}
</script>

<script>
	document.addEventListener('DOMContentLoaded', () => {
		images = [];
		links.forEach(link => {
			images.push({'src':'./assets/images/hydrangea.jpg', 'link':link});
		});
		const imageGrid = document.getElementById('image-grid');

		images.forEach(image => {
			const imageContainer = document.createElement('div');
			imageContainer.classList.add('image-container');

			const anchor = document.createElement('a');
			anchor.href = image.link;

			const img = document.createElement('img');
			img.src = image.src;
			img.alt = 'Grid Image';

			anchor.appendChild(img);
			imageContainer.appendChild(anchor);
			imageGrid.appendChild(imageContainer);
		});
	});
</script>
