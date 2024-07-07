---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		width: 100%;
		place-items: center; /* Center items within the grid */
	}

	#image-grid-0, #image-grid-1 {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		width: 90%;
		height: 90%;
		margin: 0 auto; /* Center the grid container */
		place-items: center; /* Center items within the grid */
	}

	.image-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border: 0px solid #ccc;
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

<div class="grid">
<div id="image-grid-0"></div>
<div id="image-grid-1"></div>
</div>

<script>
  var posts = [];
  {% assign sorted_posts = site.posts | sort: 'date' | reverse %}
  {% for post in sorted_posts %}
    posts.push({
      url: "{{ post.url | relative_url }}",
      title: "{{ post.title | escape }}"
    });
  {% endfor %}
</script>

<script>
	document.addEventListener('DOMContentLoaded', () => {
		images = [];
		posts.forEach(post => {
			image_path = './assets/images/hydrangea.jpg';
			link = post.url;
			if (link.includes('adistanceintertwined_cd_release.html'))
				image_path = './assets/images/a distance intertwined cover.jpg';
			images.push({'src':image_path, 'link':link, 'title':post.title});
		});

		const imageGrid0 = document.getElementById('image-grid-0');
		const imageGrid1 = document.getElementById('image-grid-1');

		images.forEach(image => {
			const imageContainer = document.createElement('div');
			imageContainer.classList.add('image-container');

			const anchor = document.createElement('a');
			anchor.href = image.link;
			anchor.title = image.title;

			const img = document.createElement('img');
			img.src = image.src;
			img.alt = 'Grid Image';

			anchor.appendChild(img);
			imageContainer.appendChild(anchor);

			if (image.link.includes('adistanceintertwined_cd_release.html'))
				imageGrid0.appendChild(imageContainer);
			else
				imageGrid1.appendChild(imageContainer);
		});
	});
</script>
