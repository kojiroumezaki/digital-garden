---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<style>
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		margin: 0;
		background-color: #f0f0f0;
		font-family: Arial, sans-serif;
	}
	
	.image-container {
		position: relative;
		border: 1px solid #ccc;
		overflow: hidden;
		background-color: white;
	}

	.image-container img {
		position: absolute;
		width: 10%; /* Adjust the size as needed */
		height: auto;
		object-fit: cover;
		transition: transform 0.2s;
	}

	.image-container img:hover {
		transform: scale(1.1);
	}
</style>

<div class="image-container" id="image-container">
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

		const imageContainer = document.getElementById('image-container');
		
		w = document.documentElement.clientWidth * 0.95;
		imageContainer.style.width = w + 'px';
		imageContainer.style.height = w/2 + 'px';

		images.forEach(image => {
			const anchor = document.createElement('a');
			anchor.href = image.link;
			anchor.title = image.title;

			const img = document.createElement('img');
			img.src = image.src;
			img.alt = 'Grid Image';

            img.style.top = 80 * Math.random() + '%';
            img.style.left = 90 * Math.random() + '%';

			anchor.appendChild(img);
			imageContainer.appendChild(anchor);
		});
	});
</script>
