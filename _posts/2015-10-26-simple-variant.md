---
layout:     post
title:      Simplistic Variant 
date:       2015-10-26 21:10:22
summary:    Simple C++ union solution
categories: General
tags:       C++, Coding
---

Variants are C++'s union solution. Since C style unions in C++ can only support basic types, they are quite limited. Unions and variants can be pretty good for things like event data, or storing json (or any other interchange format) data. You might choose to use a variant to pass data around a callback system.

{% highlight cpp %}
void my_event_callback(const uint32_t id, const Variant &data)
{
  switch(id)
  {
    case(1):
    {
      const float my_data = data.get<float>();
      my_float_setter(my_data);
      break;
    }
    case(2):
    {
      const vec3 my_data = data.get<vec3>();
      my_vec3_setter(my_data);
      break;
    }
  }
}
{% endhighlight %}
    
But if you've ever cracked open Boost's variant or looked at some of the other variants out there it can be hard to understand what's going on under the hood. And there is usually a lot going on as there are a few edge cases you need to consider. However even fundamentally understanding what is going on can be a challenge as templates can quickly become hard to read.

## Type Agnostic Data Store

You might have already done something like this for getting data out of an xml/json etc.

We just have a chunk of memory that we use to dump various different data types into.

{% highlight cpp %}
class Node {
public:

  explicit Node(const float data) {
    new(data_store) float(data);
  }

  explicit Node(const int data) {
    new(data_store) int(data);
  }

  // Other type ctors

  float as_float() {
    return *reinterpret_cast<float*>(data_store);
  }

  int as_int() {
    return *reinterpret_cast<int*>(data_store);
  }

  // Other cast types

private:
  uint8_t data_store[128]; // the actual data.
};
{% endhighlight %}

This way we can push what we want into data_store as long as its within the maximum size of the data_store.

Well really that's half way to a simple variant class. Extracting out this logic we can very quickly make a simple generic variant.

## A Simplistic Variant

We can use templates to get and set the data in the data store, and std::aligned_union will allow us to get the size of the biggest type we might need to store.

{% highlight cpp %}
#include <type_traits>

template<typename... Ts>
class Variant
{
public:

  template<typename T, typename... Args>
  void set(Args&&... args) {
    new(&data_store) T(std::forward<Args>(args)...);
  }

  template<typename T>
  T& get() {
    return *reinterpret_cast<T*>(&data_store);
  }

private:
  typename std::aligned_union<0, Ts...>::type data_store;
};
{% endhighlight %}

To use the variant we need to pass in the types that it should support. This way the template can figure out how much space is required.

{% highlight cpp %}
Variant<uint32_t, float, std::string> my_variant;

my_variant.set<float>(1.234f);
my_variant.get<float>(); // returns 1.234

my_variant.set<std::string>("Hello world");
my_variant.get<std::string>(); // returns "Hello World"
{% endhighlight %}

The variant's size will be the size of its biggest element, which is something to be aware of.

{% highlight cpp %}
Variant<float, vec3, vec4, mat33, mat44> math_variant;
sizeof(math_variant); // mat44 is float * 16 == 64 bytes.
{% endhighlight %}

And thats about it.

## Is That Really It?

Well no, not really. I've left out a lot of details so I could show the barebones of how a variant works, without getting bogged down in a lot of detail (There are a bunch of posts that go into that detail). Most notably whats missing is type checking. You really want some type_id system to be able to force an error if you are trying to get a float from an std::string etc.

However this is a good starting point for creating your own variant, it's mine anyway.
