---
layout:     post
title:      Who Do You Code For?
date:       2015-05-19 15:41:12
summary:  	Chances are it isn't your boss.
categories: General
tags: 		  GeneralDev, Coding,
---



_"Who are you coding for?"_ Seems like an easy enough statement. Though if you've answered 'your boss' or 'your company' or 'the product' you've likely missed your target audience.

> [Always code as if the person who ends up maintaining your code is a violent psychopath who knows where you live.](http://blog.codinghorror.com/coding-for-violent-psychopaths/)

The majority of code is maintenance, so its seems that coders spend the majority of the time reading code and not writing it. So like an author of a book you are writing for your audience and that's the other coders you work with. So when somebody extends your function to encorporate some new feature and a bug is caused, then you share the blame for that, as much as your share the credit for the inital code. You could be laying down the foundation for dozens of modifications, so do it right. I'm not talking Space Shuttle bullet proof, just make it safe, clear, and extendable without a PhD into your mind.


These are little day to day things I like to do, to try and help the next guy along when he has to modify what I've left behind.




## Local scope

Often I come accross big methods that do several different things. It can be quite hard to get your head around these methods. Local scoping responibilites can help refacting later down the line, but really helps with understanding of whats going on.

{% highlight cpp %}
void your_uber_long_function()
{
  // Safe bet this is used in multiple scopes
  const float lucky_number_punk = 0.1666f;

  // A comment above a set of curlies helps define a chunk.
  {
    // Anybody reading knows this ani't going to interact with anything outside.
      const float local_var = 1.234f;

    // Cool code goes here.
  }

  float a_variable_above_curlies = 0; // Indicates logic beloew sets it.
  {
    // looks like an inline function, makes it easy to pull out.
  }

  // .. more cool stuff
}
{% endhighlight %}

Scoping goes one way and one way only. As soon as you graduate a variable's scope you can be pretty sure that nobody is ever going to reduce it. From local to file, file to global. Scope down hard. In some circumstances I'll even push arrays inside the loop i'm iterating in, I certainly will for constants.

{% highlight cpp %}
for(std::size_t i = 0; i < some_size; ++i)
{
  const float my_float = 1.234f;

  std::array<uint32_t, 4> arr = {{1,2,3,4}};
  assert(arr.size() == some_size);

  arr.at(i) = my_float;
  // ... 
}
{% endhighlight %}

The shared_ptr people will bring this up in review also, "Did you know you can move that array and constant outside?". Yes yes I did.




## Avoid shared_ptr

This is pretty much the same as local scope but I seperated because people don't seem to consider shared_ptrs todo with scope. Really tho, shared_ptrs, globals and singletons all have similar issues. There state can get modified by who knows what, who knows where. Its a good chance you are doing multithreaded, or task based multithreading. You'll waste hours trying to understand state changes when 'everything' is a shared_ptr, global, or a singleton.

I find most situations with shared_ptr's can be avoided, but quite often the lazy approch is taken. Or the its just like GC mentality sets in. Its not GC, you likely don't want GC and its not solving your design issues. You can't always avoid it, especially when working on a system thats been in dev for a while, but don't add to that crap unless you have to.




## Hate Chaining Objects

Object orientation can lead to alot of repeated `this_object.some_method().other_method().that_method()` type thing. this makes code a bit messy. If you are doing it repeatedly please make it into references to help the next guy who comes along. He'll be able to read it better.

{% highlight cpp %}
for(int i = 0; i < this_object.some_method().another_method(); ++i)
{
  this_object.some_method().that_method();
  another_object.cool_method();
}
{% endhighlight %}

vs

{% highlight cpp %}
auto &obj = this_object.some_method();

for(int i = 0; i < obj.another_method(); ++i)
{
  obj.that_method();
  another_object.cool_method();
}
{% endhighlight %}

Much better! It looks nicer, and makes it clear what is being used accross a large file.




## DRY Up 'Do Not Repeate Yourself - Do Not ...'

When ever I see repeated code I have an inbuilt urge to refactor it. Less code paths usually mean easier debuging, and extending. I once opened up a file on a project and saw 12 hefety functions that where all just cut and pasted duplicates with a minor variable changed. Lazy and bug prone - urgh!

When ever I see repeated code I have an inbuilt urge to refactor it. Less code paths usually mean easier debuging, and extending. I once opened up a file on a project and saw 12 hefety functions that where all just cut and pasted duplicates with a minor variable changed. Lazy and bug prone - urgh!

_see how annoying that is!_


## Const As Much As Possible

Really in big methods and objects consting is godsend to the reader. Its very easy to iscolate the moving parts of a program, and thus be able to generate quickly some understanding of how things work.

{% highlight cpp %}
float wicked_calculation()
{
  const float foo = 1.f;
  const float bar = 2.f;
  float baz = 0.f; // You can already tell that baz - its likely going to change.
  // lots of lines

  return return_a_sony_random_number();
}
{% endhighlight %}


## Use Safe Things.

Sloppy code breeds sloppy code I always say (I don't). Consider this.

Your simple little loop

{% highlight cpp %}
for(std::size_t i = 0; i < container.size(); ++i)
{
  // few lines of logic.
  container[i] = new_value;
}
{% endhighlight %}

suddenly gets modified by somebody else, and somebody else, and somebody else beyond that...

{% highlight cpp %}
for(std::size_t i = 0; i < other_container.size(); ++i)
{
  // lots of more logic.
  container[i] = new_value; // container now indexed by other_container's size()
}
{% endhighlight %}

When the modifications of other_container get to the point where they are different size's you are suddenly writting on sombody else's memory. If you are luckly you'll cause a crash, unluckly you could be tweaking somebody else's variable causeing some other error down the line. This can be a nightmare situation to debug (one I've had to debug before). Although if the original author had used .at(i). as soon as the containers changed size this would have failed. std:: has lot of these type of things. use them where possible. Save somebody else some stress.



## Don't Go Mental With Abstraction

Coders have an obession with abstraction, an unhealthy one. Its far more helpfuly to me if I know a type is a float, or shared_ptr straight up. If they are all hidden beneath layers and layers of typedefs and abstractions it can be a royal pain. Keep things flat where you can, and stop saying "Another layer of abstraction solves everything." If you're abstracting for the sake of future proofing you are likely making more work for youself, and the next guy trying to understand what you left behind, so he can modifiy it.



## Alias Namespace Locally

Recently I moved job, and I've been spending alot of time trying to get to know as much of the codebase as possible, and the various `using namespace x` type thing makes it harder, because as I read the code I have litterally no idea where this stuff is comming from. What makes it worse is we have several definitions of a type `point` which as the new guy it makes it hard. Although I do understand why - our namespace aren't a simple `std::`, they are massive and typing them out is a nightmare and makes code look ugly. Though dumping the namespace isn't the answer. Alias it, preferably in the function (scope down hard) otherwise file.

{% highlight cpp %}
void your_amazing_cool_func()
{
  using namespace short_ns = ::your_really::really::long::namespace;
  short_ns::point = foo(1,2);
  // ...
}
{% endhighlight %}




## Assert Lots

Assert implies alot of things for you. Whats better a comment that says "This can't be null" or `assert(your_ptr)` If passing null, or 3, or "hi bob" is invalid make it explicitly invalid.

{% highlight cpp %}
void radical_function(bar *in_boo, boo *in_baz)
{
  assert(in_boo && in_baz);
  // ... continue
}

{% endhighlight %}

Assert's enforce your assumptions on the code your wrote, it also forces these assumptions on the guy who's extending your code. Comments do not.


## Further Things

Often lazy coding comes with a 'time is money' or 'my time is better spent elsewhere' rebuttle. Both these are as short sighted as I am on a Friday evening. If you are generating situations where bugs are easily generated then somebody is spending hours/days tracking them down. Which is likely going to cost more to fix (not to mention demoralization of people working on it).

Please please please read Scot Myers books if you can, they are really good. Also this talk from Jonathon Blow has some good bit in it also.

