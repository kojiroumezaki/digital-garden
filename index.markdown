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
	orientation = ""
	function checkOrientation() {
		const orientationType = screen.orientation.type;
		if (orientationType.startsWith("landscape")) {
			console.log("Landscape mode (more horizontal)");
			// Perform actions for landscape orientation
			orientation = "landscape"
		} else if (orientationType.startsWith("portrait")) {
			console.log("Portrait mode (more vertical)");
			// Perform actions for portrait orientation
			orientation = "portrait"
		}
	}
	
	// call the function initially
	checkOrientation();
	
	// add an event listener for orientation changes
	screen.orientation.addEventListener("change", checkOrientation);
</script>

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
	/* initialize count to 0 for each group */
	group_count = {};
	posts.forEach(post => {
		if (post.group != undefined)
			if (group_count[post.group] == undefined)
				group_count[post.group] = 0;
	});
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
		h = orientation == "landscape" ? w/2 : w;
		imageContainer.style.height = h + 'px';
		
		h = 80;
		w = 90;
		num_groups = Object.keys(group_count).length;

		images.forEach(image => {
			const anchor = document.createElement('a');
			anchor.href = image.link;
			anchor.title = image.title;

			const img = document.createElement('img');
			img.src = image.src;
			img.alt = 'Grid Image';

			/* count group members here and compute group's offset */
			i = group_count[image.group]++;
			keys = Object.keys(group_count);
			i_group = keys.indexOf(image.group);
			group_offset = w/num_groups*i_group;
			
			/* calculate the member's center and offset */
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
            center = h * (t+0.5) + '%';
            offset = w / num_groups * (l+0.5) + group_offset + '%';

            img.style.top = orientation == "landscape" ? center : offset;
            img.style.left = orientation == "landscape" ? offset : center;

			anchor.appendChild(img);
			imageContainer.appendChild(anchor);
			
			i++;
		});
	});
</script>
