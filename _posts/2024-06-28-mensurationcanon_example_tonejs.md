---
layout: post
title: "Mensuration Canon on a Phrase: Tone.js Example"
date: 2024-06-28
image: "./assets/images/hydrangea_alpha.png"
group: "propcanon"
---

<script src="https://unpkg.com/tone"></script>

{% assign data = site.data.melodies | jsonify %}
**Melodies:** {{ data }}

<script>melodies = {{ data }}["melodies"]</script>

<script src="{{ '/assets/js/mensurationcanon_example_tonejs.js' | relative_url }}"></script>

<button onclick="play()">Play</button>

```javascript
{% include mensurationcanon_example_tonejs.js %}
```

The above JavaScript code should be included in HTML code, for example, as follows:

```html
<script src="https://unpkg.com/tone"></script>
{% raw %}
{% assign data = site.data.melodies | jsonify %}

<script>melodies = {{ data }}["melodies"]</script>
{% endraw %}
<script src="{{ '/assets/js/mensurationcanon_example_tonejs.js' | relative_url }}"></script>

<button onclick="play()">Play</button>
```
