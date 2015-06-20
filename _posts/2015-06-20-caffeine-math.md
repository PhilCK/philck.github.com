---
layout:     post
title:      Caffeine Math
date:       2015-06-20 22:01:18
summary:    Small hobby math engine.
categories: General
tags: 		GeneralDev, Coding,
---


A little while ago I started putting up some of my math code onto Github which can be found [here](https://github.com/PhilCK/caffeine-math). Its a small simple math library that I use for my hobby projects (mostly games).

## What Is It?

It's a header only math library, that handles most vector, and matrix math. It has other things in it as well. I've been porting it over in small bits as I write tests for those components. Also gives me a chance to add missing functions that should be in a math library but I've not had a need for.


## How To Use It?

It's completely function based. And all functions start with the type name to make things like intellisence easier.

{% highlight cpp %}

vector3 my_position = vector3_init(0,0,0);
vector3 my_velocity = vector3_init(1,0,0);

vector3 my_position = vector3_add(my_position, my_velocity);

{% endhighlight %}

Most of it works along those lines.

## No SIMD

It's always been one of those things I've meant to add, but usually I find speed up's elsewhere so I use them. Combined with my projects being small scale. However its something I'd like to add after I've finished porting/testing the various components.

## What Next

I need to finish Matrix support and I have some other basic geometry math I need to add for a project, I'll add that to the library when I come to that. And hopefully I can get SIMD done stuff at the end of summer.

