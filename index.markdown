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
  {% assign sorted_posts = site.posts | sort: 'date' %}
  {% for post in sorted_posts %}
    posts.push({
      url: "{{ post.url | relative_url }}",
      title: "{{ post.title | escape }}",
      image: "{{ post.image }}",
      group: "{{ post.group }}"
    });
  {% endfor %}
</script>

<script>
	/* count members for each group */
	group_count = {};
	posts.forEach(post => {
		if (post.group != undefined)
			if (group_count[post.group] == undefined)
				group_count[post.group] = 1;
			else
				group_count[post.group]++;
	});

	/* get the key with the minimum count */
	let minKey = null;
	let minValue = Infinity;
	for (const key in group_count) {
	  /* console.log(key,group_count[key]); */
	  if (group_count[key] < minValue) {
	    minValue = group_count[key];
	    minKey = key;
	  }
	}
	/* console.log(`Minimum value is ${minValue} with key "${minKey}"`); */

	/* assign key to group_right */
	group_right = minKey;
</script>

<script>
	document.addEventListener('DOMContentLoaded', () => {
		images = [];
		posts.forEach(post => {
			images.push({'src':post.image, 'link':post.url, 'title':post.title, 'group':post.group});
		});

		const imageContainer = document.getElementById('image-container');
		
		w = document.documentElement.clientWidth * 0.95;
		imageContainer.style.width = w + 'px';
		imageContainer.style.height = w/2 + 'px';
		
		/* NEXT: implement support for more than 2 categories (groups) */
		i_cat = [];
		i_cat[0] = 0;
		i_cat[1] = 0;

		images.forEach(image => {
			const anchor = document.createElement('a');
			anchor.href = image.link;
			anchor.title = image.title;

			const img = document.createElement('img');
			img.src = image.src;
			img.alt = 'Grid Image';

			left_offset = 0;
			i = i_cat[0];
			if (image.group == group_right)
			{
				left_offset = 45;
				i = i_cat[1]++;
			}
			else
				i_cat[0]++;
			
			t = 0; // relative top
			l = 0; // relative left
			r = 0.225; // radius
			k = 0.025; // randomization factor
			if (i > 0)
			{
				theta = (i * 60) / 360 * 2. * Math.PI;
				t = Math.sin(theta) * r;
				l = Math.cos(theta) * r;
				t += (Math.random()-0.5)*2*k;
				l += (Math.random()-0.5)*2*k;
			}
            img.style.top = 80 * (t+0.5) + '%';
            img.style.left = 45 * (l+0.5) + left_offset + '%';

			anchor.appendChild(img);
			imageContainer.appendChild(anchor);
			
			i++;
		});
	});
</script>
