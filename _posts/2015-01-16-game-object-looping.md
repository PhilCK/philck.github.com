---
layout:     post
title:      Game Object Looping
date:       2015-01-16 11:21:29
summary:    Looping through game objects efficiently.
categories: GameDev
tags: 		GameDev
---

I was porting over one of my hobby projects from OSX to Windows, when I noticed that in debug performance was terrible on Windows. So I cracked open the [Very Sleepy][1] profiler to try and find where my performance had gone. It turned out that on Windows MSVS does of lot of debug stuff with STL which kills [performance][4], but as I was profiling I was quite shocked to see how much time was being spent looping through game objects and calling the various hook methods ( `obj->update()` etc.).

With a little digging it became very obvious why game objects where taking so much time. However after some researching online I was quite surprised how much I came across people suggesting `std::list< GameObject* >` as a method to store and iterate your game objects.


### List< GameObject* >

I see this a lot (I've done it also). It seems that because we want to delete the objects from the container people opt for using a list.

{% highlight cpp %}
std::list<GameObject*> myListOfGameObjects;

myListOfGameObjects.push_back(new PlayerObject());
// ... other allocations

for(auto &obj : myListOfGameObjects)
{
  obj->update();
}
{% endhighlight %}

This is a flawed approach, while inserting and deleting are fast, we will still be spending the vast majority of the time looping through the items to call the hook. However since this isn't a contiguous container we are jumping all around the memory. So cache-misses abound.


### Vector< GameObject* >

This is what have been doing, but while it served its purpose its still not quite right. Inserting and deleting are slightly more expensive, but really not as expensive as you might imagine. There is a nice talk from [Bjarne Stroustrup][2] about it. Essentially modern hardware is pretty good at inserting and deleting in contiguous memory.

{% highlight cpp %}
std::vector< GameObject* > myVecOfGameObjects;

myListOfGameObjects.push_back(new PlayerObject());
// ... other allocations
// ... looping call the update() hook etc.

it = myVecOfGameObjects.erase(it); // This isn't as expensive as you first think.

{% endhighlight %}

But the same problem still exists. While our pointers are contiguous now, are objects certainly are not. Rubbish!


### Vector< GameObject >

Part of the issue is that we are allocating objects at runtime, which means a polymorphic base class, which means also means using the `new` operator. This scatters our objects around the place.

Wouldn't it be nice if we could just do something like this.

{% highlight cpp %}
std::vector<GameObject> myVecOfGameObjects;

myVecOfGameObjects.push_back(PlayerObject());
myVecOfGameObjects.push_back(EnemyObject());

// .. loop though and delete etc.

{% endhighlight %}

What is this magic! [Sean Parent's][3] talk on 'Inheritance Is the Base Class of Evil' talk, explains it better than I could, it's well worth the watch. It's worth noting that his talk isn't centered around performance.

### Benchmarks

I ran some very very quick and dirty benchmark tests and these are my results.

{% highlight text %}

3971 ms - std::list< GameObject* >
3675 ms - std::vector< GameObject* >
3100 ms - std::vector< GameObject >

{% endhighlight %}

Fairly significant from `list< GameObject* >` to `vector< GameObject >`.


### Whats Else

[Sean Parent's][3] method was designed to remove base classes. From my perspective my game object base class is a way of interacting with the game engine. So I'd rather keep it.

Since I want to keep my base class of evil I'm stuck with heap allocations. This is C++ however, so what I could feasibly do is pre-allocate a memory pool for my game objects. Which means my allocations are fast, and I have a contiguous container of memory _of objects_ not pointers.

{% highlight cpp %}
struct Base {
  char reserveSize[sizeof(256)]; // Or as big as your biggest object.
};

std::vector<Base> myReservedMemory;
myReservedMemory.resize(512);

new(&myReservedMemory[0]) new PlayerObject();
new(&myReservedMemory[1]) new EnemyObject();

for(auto &obj : myReservedMemory)
{
  reinterpret_cast<GameObject*>(&obj)->update();
}

{% endhighlight %}

So how does that compare with Sean Parent's method.

{% highlight text %}

3100 ms - std::vector< GameObject >
3109 ms - std::vector< Block >

{% endhighlight %}

Its comparable - however it does come with a whole host of other issues. Added complexity is certainly one. This could be considered early optimization, I don't usually have more than 100-200 objects so I'd only be doing this for a little bit of fun/learning.


[1]: http://www.codersnotes.com/sleepy
[2]: https://www.youtube.com/watch?v=YQs6IC-vgmo
[3]: http://channel9.msdn.com/Events/GoingNative/2013/Inheritance-Is-The-Base-Class-of-Evil
[4]: https://benc45.wordpress.com/2008/07/13/performance-killer-debug-iterator-support-in-visual-studio/
