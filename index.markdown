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
	image_path_default = './assets/images/hydrangea_alpha.png';
	image_path_cat_1 = './assets/images/a distance intertwined cover.jpg';
	link_cat_1 = 'adistanceintertwined_cd_release.html';
</script>

<script>
	document.addEventListener('DOMContentLoaded', () => {
		images = [];
		posts.forEach(post => {
			image_path = image_path_default;
			link = post.url;
			if (link.includes(link_cat_1))
				image_path = image_path_cat_1;
			images.push({'src':image_path, 'link':link, 'title':post.title});
		});

		const imageContainer = document.getElementById('image-container');
		
		w = document.documentElement.clientWidth * 0.95;
		imageContainer.style.width = w + 'px';
		imageContainer.style.height = w/2 + 'px';
		i_def = 0;
		i_cat_1 = 0;

		images.forEach(image => {
			const anchor = document.createElement('a');
			anchor.href = image.link;
			anchor.title = image.title;

			const img = document.createElement('img');
			img.src = image.src;
			img.alt = 'Grid Image';

			left_offset = 0;
			i = i_def;
			if (image.src.includes(image_path_cat_1))
			{
				left_offset = 45;
				i = i_cat_1++;
			}
			else
				i_def++;
			
			rand_top = Math.random();
			rand_left = Math.random();
			t = 0;
			l = 0;
			r = 0.225;
			if (i > 0)
			{
				t = Math.sin(i) * r;
				l = Math.cos(i) * r;
			}
            img.style.top = 80 * (t+0.5) + '%';
            img.style.left = 45 * (l+0.5) + left_offset + '%';

			anchor.appendChild(img);
			imageContainer.appendChild(anchor);
			
			i++;
		});
	});
</script>
