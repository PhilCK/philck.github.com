---
layout:     post
title:      Working With Maps
date:       2015-08-06 22:10:14
summary:    7 months in maps.
categories: General
tags:       GeneralDev, Coding,
---


Seven months into my job at Esri UK, I've passed my probation and still loving it. While many games companies make a big deal about their 'culture', which is usually a subtext to 'We let you have fun at work, now do unpaid overtime'. Esri UK by contrast has an awesome culture. I do miss the tech aspect of games, but in reality I would have had to leave Scotland to do that kind of work.

Working with maps has been fun. I'm surrounded by smart people and difficult problems. Heaven!



## Scale

Representing the world on a map is fairly straightforward to render. The issues come with rendering a map of the world, then zooming in to your street corner. You can't exactly just scale up the quad and hope to get away with it (I did, it failed). If you scale up your map, you have to scale up your points on the map, which also fails for the same reason. This is where games knowledge comes in handy, some of these are solved issues in games.



## Content

After you've got your map sorted there is content. Some of the datasets are huge! And they want them to work. Millions of points or polygons spread across this massively scalable world, Nice!



## Platform

While the performance of iDevices are impressive, they still aren't a desktop with 4 gb of ram. Getting all this onto a phone and have it running correctly is a massive issue. Trying to have dynamic maps that don't kill your battery and run a decent frame-rate with these big datasets - ouch. Games can be isolated fairly well, give me a GL context and I'll do the rest. We need a bit more in maps, which means more external libraries, more platform dependencies, more platform issues.



## Problems

This area is filled with problems, smart people and no easy solutions. Loving it!

