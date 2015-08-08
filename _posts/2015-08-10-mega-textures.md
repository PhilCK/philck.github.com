---
layout:     post
title:      Mega Textures
date:       2015-08-10 22:10:14
summary:    Textureing the MEGA
categories: GameDev
tags:       C++, Coding, Maps
---


Back in university I did my honours project on [Virtual Textures](https://vimeo.com/66203380). Mega Textures could be considered the predecessor to Virtual Textures. It's actually a very simple idea, and was surprisingly easy to knock up a simple application.

## What Is It

In short it is a dynamic mip-map system. With a handful of 512x512 textures you can texture a massively _unique_ terrain. With a very small memory overhead. If you can imagine drawing rings around the camera that go further and further out. Each one of these rings is a 512x512 texture that stretches further and further away. A notable example in games was Quake Wars, but the idea was around well before John Carmack made it popular.


## How Does It Work

In this demo I created a big texture and also created all the mip layers up-front, this makes it easier to sample on the fly without having to think about things like filtering as well. HDD space is cheap, memory, CPU and GPU are less cheap.

So for a given point we build a new mip map layer.

![Mip Levels]({{ site.url }}/images/mega_tex/mega_tex_mips.png)

The different colors in the screen shot indicate a different texture (mip) being sampled around the origin (_note: you would usually do this around the camera_).

## Limitations

It is 2D really. Mega Textures fail with overhangs and things like that. Which means it can't be extended to texturing other objects you may have in the world. However its easy! So for texturing large areas like we do in GIS it might be handy.

![Textured]({{ site.url }}/images/mega_tex/mega_tex_textured.png)

In this screenshot the textures are being sampled, which results in seemless transition between the mips.

## My Solution

The code for the demo can be found [here](https://github.com/PhilCK/mega-texture), its very limited and doesn't rebuild the maps when you move the camera, although that should be trivial enough to add. I'm also using 6 mips as I had in mind mapping of very very large areas, but I was having an issue making a large enough dataset so 6 mips might seem like an overkill for what is being renderered. The dataset isn't included in the repo as Github doesn't like files of 1gb. However you can easily open up your favourite image editor and make a massive texture, be sure to udpate the size of the texture in the code.

## Final

Virtual Textures are far superior, and can help abstract alot of your texture management, but for a cheap texturing solution this is still viable. I'd like to take another crack at Virtual Textures time permitting but I might try and do it in a map context rather than a game one.
