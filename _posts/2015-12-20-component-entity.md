---
layout:     post
title:      The Component Entity Pattern
date:       2015-12-20 16:19:07
summary:    Organizing code.
categories: GameDev
tags:       C++, Coding
---

One thing I think games development is really good at is object composition, I think thats because the game industry has simply tried all the ways to do it. Some are better than others, others scale poorly but are good enough for a project at a certain size.

When we talk about object composition we are usually talking about making an entity on the screen (or off) have certain functionality, and some other entity a different but possibly similar set of functionality. Sharing this functionality across different entity types can be useful in terms of sharing common code, and also in terms of a common interface with your game engine.

## Object Composition Through Inheritance

The easiest form of object composition is of course using inheritance.

### Single Inheritance

The 'classical' way is straight up inheritance. This good for small projects, but deep inheritance tree's quickly becomes problematic.

{% highlight cpp %}
class GameObject;
class Spaceship : public GameObject;
class Destroyer : public Spaceship;
class SuperDestroyer : public Destroyer;
{% endhighlight %}

Very soon we end up with a special case type ship that may or may not share characteristics with other ships.

The arcytyple example to this problem is the Animal one.

{% highlight cpp %}
class Animal;
class Mammal : public Animal; // can walk
class Fish : public Animal; // can swim
class Bird : public Animal; // can fly
{% endhighlight %}

But then when we want to implement a Penguin we really want to inherit of Fish to get the swim. Or a Whale, we want to inherit of Fish even though its a Mammal.

Still this is a reasonable way to-do it for certain projects. I tend to worry after about 3 deep inheritance, I always feel the chances of framework hell increase exponentially with each layer of inheritance.


### Multi-Inheritance

Most languages don't support multi-inheritance (with good reason), but if I express a game object like this, it almost 'feels' right.

{% highlight cpp %}
class Player : public Transform, Renderable, Collidable;
{% endhighlight %}

However I don't think 'feels' outweighs the problems it has. It comes with the diamond inheritance issue, and also (I feel) makes things slightly confusing.


## The OOP Component Entity

Not a huge fan of OOP these days, however I do think its good for displaying concepts.

{% highlight cpp %}
class Component_interface
{
public:
   explicit(Entity *parent);

   Entity *get_parent();
};

class Entity final
{
  std::vector<Component_interface> m_components;
public:
  template<typename T>
  T* get_component() { /* search through m_components and return or nullptr */ }
};
{% endhighlight %}

This is nice. we have made the Entity just a container class for all the components, to the point where we can just stop any inheritance from it. The components can talk to each other in a sideways fashion if they need to, and even change there behavior based on what other components are attached.


## Data or Logic

Unity uses a component system, but I think it makes for a blurry example, and quite likely doesn't really represent whats going on underneath but just has an abstracted GUI for the user ease (of which it is). Unity makes no distinction between what is data and what is logic. Most of the existing components feel more like data, while the ones you add feel more like logic. 

I prefer data over logic (your solution might make sense to do the other way around), The main issue I run into with 'logic' can be summed up with Transforms and Rigidbodies, who owns the positional data? The transform or the physics engine? When thinking in terms of logic this makes things (at least to me) blurry. However shifting your view point to that of data, the answer becomes a little simpler, nether! Its just positional data, of which the Transform and Physics can both interact with.

There are other overlaps, you might want to use the AABB for collision information, but you might also want to use it for culling objects in the scene. The animation system and renderer both also want access to the mesh data.

{% highlight yaml %}
entity:
  has_data:
    transform_data:
    aabb_data:
    mesh_data:
    material_data:

  has_logic
    transform_logic:
    rigidbody_logic:
    renderer_logic:

{% endhighlight %}

I think looking at it like this makes things easier to see that logic can share data, this uncoupling makes some of the complexities of treating components all as equal resolve itself.


## Final

This was a very wish washy article. I've used a component system of sorts for most projects, however the more I separate out the data from the logic the easier I find some of this stuff to-do.