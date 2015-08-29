---
layout:     post
title:      Wrapping OpenGL
date:       2015-08-29 11:12:43
summary:    Object Orientated OpenGL.
categories: GameDev
tags:       C++, Coding
---


I've been creating a [simple wrapper](#) for OpenGL to help me with some common things. While I'm not a huge fan of archetypal object orientation, I chose to write this wrapper in that way for ease of prototyping. However wrapping OpenGL (or any C style resource) is not as easy as you might think.


## Simple Resource Wrap

Its easy right? I just initialize the resource in the constructor and release it in the destructor. RAII is all you need right?

{% highlight cpp %}
class texture
{
public:

  texture(const std::string &filename)
  {
    // ... other stuff
    glGenTextures(1, &m_tex_id);
  }

  ~texture()
  {
    glDeleteTextures(1, &tex_id)
  }

private:

  GLuint tex_id;

};
{% endhighlight %}

We're done! - No we aren't. What if I copy this texture? Then the first copy to go out of scope will take the resource with it. Well that can be solved by making the copy and assignment private, and defining a move and move assignment. This works to a degree, however you'd be surprised how many implicit copy's you make, so it invalidates my need for a simple wrapper for quick prototyping. However I'd consider this the most correct in an academic sense, but not an engineering one.


## I Know, Shared_ptrs!

_Apparently_ shared_ptrs solve everything.

{% highlight cpp %}
std::shared_ptr<texture> my_texture; // Solved?
{% endhighlight %}

This is horrid, but it does fit the 'easier' for prototyping angle, there is a tweak we can do to make this less horrid though.

{% highlight cpp %}
class texture
{
  // texture impl
  std::shared_ptr<texture_resource> m_gl_texture;
}
{% endhighlight %}

This makes things somewhat cleaner. I'm not passing shared_ptr's around everywhere, and at the same time the resource isn't destroyed until all copies have vanished, but it still suffers from the whole shared_ptr thing. It is in essence a global, its state can be changed by who knows what, who knows where.

{% highlight cpp %}
texture my_texture("my_512_texture.png");
my_texture.get_width(); // 512

texture copy(my_texture);
copy.load_data("other_256_texture.png");

my_texture.get_width(); // 256 
{% endhighlight %}

This isn't ideal. One possible solution would be to make the internal shared_ptr const (I am a fan of immutable objects), and then the RAII thing comes back to life a little. However the issue with RAII is that it assumes all resources are equal. Its quite often the case with textures that you would want to update them, so this doesn't solve the issue where copies can change the state.


## Remember Requirements

Its very easy to get caught up with what is the 'correct' way to do something. And while that is certainly something worthy to stive to, I tend to think that I am an engineer first and foremost. Simple Wrapper was supposed to be a simple tool to allow me to use textures and shaders quickly. So to that end the internal shared_ptr wins. It may hurt my eyes slightly, it may not be nice (I find OOP rarely is anyway), but it works with minimum fuss.