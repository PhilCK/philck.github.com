---
layout:     post
title:      Life Without STL
date:       2016-04-06 16:19:07
summary:    Constraints for the hell of it.
categories: General
tags:       C++, Coding
---

Coming from games, STL can bring up varied comments, but I never really cared for this thinking. My assumption at the time was alot of this
was down to traditional thinking, rather than any factual thing. Now I work on a large code base and slow build times are
a reality, so I set myself a task of life without STL for some fun (such a nerd).

## Strings

The first thing that slapped me in the face was even though std::string is a terrible string class by modern standards,
string manipulation without std::string are a royal pain. Urgh!

String manipulation aside I realize that string's in C++ are a massive pain anyway. Every second 3rd-party API has their own string class, internally
you might also have your own. One place I worked we had two! An ANSI string class and a UTF8 string class. However without exception they all grant
access to the underlying data structure with via a c_str() function (more on that later).


### Containers

My containers became instantly uglier, as I now had to keep a track of the capacity and the size of the array manually.

{% highlight cpp %}
struct My_data
{
  math::transform * transforms[];
  uint32_t size;
  uint32_t capacity;
}
{% endhighlight %}

Oh dear!


### Interfaces

One thing I hate about 3rd-party API's is when they force a point-of-view on you, you don't notice till you don't share it. An API that requires you to use std::shared_ptrs
or std::vectors, regardless if your code is using std::unique_ptr and std::array. Moving to a more C style of interface these interface niggles vanish.

Consider if a third party uses STL like this.

{% highlight cpp %}
// I find this is annoying!
std::array<float, 3> my_data;
ThridPartyAPI::get_data(std::vector<float> &arr);
{% endhighlight %}

Annoying now you have to marshal your data into that type or change your underlying data because they said so.

However if you remove STL from the interface it becomes less obstructive.

{% highlight cpp %}
// This doesn't get in my way.
ThridPartyAPI::get_data(int array[], size_t size_of_array);
{% endhighlight %}

Now this doesn't matter at all if my data is in a std::array or std::vector or even a c-array.

### Error Reporting

This isn't limited to STL but more templates in general, STL is however a good example of this. When things go wrong you get the most insane error string
when using STL. Not using STL you get errors that are actually readable. This is very helpful.

### Memory

This is really a double edged sword. While in some circumstances I found it much nicer dealing with the memory directly, and it gave me a much better
understanding on how my own program was working, this does add a level of required attention and knowledge about the system you are working on. And when dealing with
little temporary allocations this becomes burdensome.

### Cleaner Code

While it may be partly due to the project I chose to go STL free on, I did find that grouping data together was more natural, and desirable. I do really groan when I have to deal with big OO structures already, so dealing with data directly is such a refreshing thing.

### All In All

Am I now a detractor of STL? Not really, but I will use it with a lot more care, I like my interfaces STL free now. A lot of my hobby code is fast iteration mucking about. For which STL really helps me focus on what I need to. However at work I'm still waiting for the compiler to finish, urgh!
