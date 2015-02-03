---
layout: page
title: Post Index
permalink: /post_index/
---


{% for post in site.posts %}
<div class="post ml2">
  <a href="{{ post.url | prepend: site.baseurl }}" class="post-link">
    <h4 class="post-title">{{ post.title }}</h4>
  </a>
</div>
{% endfor %}