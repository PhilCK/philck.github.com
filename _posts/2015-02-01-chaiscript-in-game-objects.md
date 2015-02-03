---
layout:     post
title:      Chaiscript In Game Objects
date:       2015-02-01 10:08:09
summary:    Chaiscript is a breeze to get into your game objects.
categories: GameDev
tags: 		  GameDev Chaiscript scripting
---

I'm currently working on a small project where I've decided to use [Chaiscript][1] as a scripting layer for my game objects. Embedding a scripting language can represent a very large part of work, so I chose Chaiscript for its ease of use. Chaiscript has been written to be embedded into C++ from the ground up. This is a bare bones example of how you could use Chaiscript.

### Chaiscript Quickstart

Chaiscript has a lovely interface, and makes binding a doddle.

_Taken from their [website][1]_

{% highlight cpp %}
#include <chaiscript/chaiscript.hpp>
 
std::string helloWorld(const std::string &t_name)
{
  return "Hello " + t_name + "!";
}
 
int main()
{
  chaiscript::ChaiScript chai;
  chai.add(chaiscript::fun(&helloWorld), 
           "helloWorld");
 
  chai.eval("puts(helloWorld(\"Bob\"));");
}
{% endhighlight %}

Now truth be told most scripting languages show an easy to use - bind a function to the language example. In Chai's case though, it doesn't get much harder than this.

### Combining Game Objects

I'm going to show you how I dealt with objects in Chaiscript. This is only a very quick condensed example, in reality you'd want to be more cautious as chai will throw exceptions if functions don't exist.

So our setup will be a Chaiscript object that's defined in a file. We will then load up that object into our C++ game object.

{% highlight javascript %}
// Your script object

def script_object::script_object()
{ 
}

def script_object::on_start()
{ 
}

def script_object::on_update(dt)
{ 
}

def script_object::on_end()
{ 
}

{% endhighlight %}

Simple - Next you'll see in our game object we have `std::function`'s for each of the game object hooks. Chai plays nicely here, other script languages will require you to push arguments onto their stack etc.

{% highlight cpp %}
// A basic shell of a game object.
class GameObject
{
public:
  explicit GameObject(chaiscript::ChaiScript &chai, const std::string& scriptFile)
  {
    // Load up script object
    static int i = 0;
    i++;

    const std::string obj_id = "obj_" + std::to_string(i);

    chai.eval_file(scriptFile);
    chai.eval("auto " + obj_id + " = script_object();");

    m_onStart  = chai.eval<std::function<void()> >("fun() {" + obj_id + ".on_start(); }");  
    m_onUpdate = chai.eval<std::function<void(float)> >("fun(dt) {" + obj_id + ".on_update(dt); }");
    m_onEnd    = chai.eval<std::function<void()> >("fun() {" + obj_id + ".on_end(); }");
  }

  // Game object hooks.

  void onStart() {
    m_onStart();
  }

  void onUpdate(const float dt) {
    m_onUpdate(dt);
  }

  void onEnd() {
    m_onEnd();
  }

private:

  // Calling the chai methods.
  std::function<void()>             m_onStart;
  std::function<void(const float)>  m_onUpdate;
  std::function<void()>             m_onEnd;

};
{% endhighlight %}

And that is really it. We just need to then call those hooks which will pass into the script object.

{% highlight cpp %}
int main()
{
  chaiscript::ChaiScript chai;
  
  GameObject obj(chai, "script_object.chai");
  
  obj.onStart();
  obj.onUpdate(0.16f);
  obj.onEnd();


  return 0;
}
{% endhighlight %}


### Further Bits

While I do love Chaiscript it is not without its downsides. Linking is noticeably longer, and the script language itself if very stripped back. Given the size of project I'm currently doing Chaiscript does fit my needs well. I would find myself moving to [Anglescript][2] for bigger projects or just sticking with C++.

I am a fan of embedding scripting languages, they always represent a good way of splitting engine code and game code, but they can be a lot of work. If this is something you are interested in, I would recommend checking out Anglescript and [Lua][3] as well. I have used both inside my game projects and while I favour Anglescript, Lua has a good standing in games.


[1]: http://chaiscript.com/
[2]: http://www.angelcode.com/angelscript/
[3]: http://www.lua.org/
