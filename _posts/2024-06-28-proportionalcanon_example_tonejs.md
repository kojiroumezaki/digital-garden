---
layout: post
title: "Proportional Canon on a Phrase: Tone.js Example"
date: 2024-06-28
image: "./assets/images/hydrangea_alpha.png"
group: "propcanon"
---

<script src="https://unpkg.com/tone"></script>

{% assign data = site.data.melodies | jsonify %}
**Melodies:** {{ data }}

<script>melodies = {{ data }}["melodies"]</script>

<script src="{{ '/assets/js/proportionalcanon_example_tonejs.js' | relative_url }}"></script>

<script>
function toggle_playstop()
{
	const button = document.getElementById("playstop_button");
	const buttonText = button.textContent;
	if (buttonText=="Play")
	{
		play(); // this is in proportionalcanon_example_tonejs.js
		button.textContent = "Stop"
	}
	else
	{
		stop(); // this is in proportionalcanon_example_tonejs.js
		button.textContent = "Play"
	}
}
</script>

<button id="playstop_button" onclick="toggle_playstop()">Play</button>

<p style="text-align: center;">proportionalcanon_example_tonejs.js</p>
```javascript
{% include proportionalcanon_example_tonejs.js %}
```

<p>The above JavaScript code (proportionalcanon_example_tonejs.js) should be included in HTML code, for example, as follows:</p>

```html
<script src="https://unpkg.com/tone"></script>

<script>melodies = {"melodies":[[60,62,64,65,67,69,71],[64,62,60,59,57,55,53],[72,71,69,67,69,72,67]]}["melodies"]</script>

<!-- proportionalcanon_example_tonejs.js is the code above -->
<script src="proportionalcanon_example_tonejs.js"></script>

<script>
function toggle_playstop()
{
	const button = document.getElementById("playstop_button");
	const buttonText = button.textContent;
	if (buttonText=="Play")
	{
		play(); // this is in proportionalcanon_example_tonejs.js
		button.textContent = "Stop"
	}
	else
	{
		stop(); // this is in proportionalcanon_example_tonejs.js
		button.textContent = "Play"
	}
}
</script>

<button id="playstop_button" onclick="toggle_playstop()">Play</button>
```
