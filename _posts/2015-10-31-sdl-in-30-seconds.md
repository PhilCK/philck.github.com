---
layout:     post
title:      Quick SDL2 Context
date:       2015-10-31 16:19:07
summary:    SDL2 context in 30 seconds on a Mac.
categories: GameDev
tags:       C++, Coding
---

Ok! Sometimes we want a GL context, just a GL context and we want it now! Well assuming you have brew and command line tools installed you can.

## Install SDL2

Lets get into terminal and type.

{% highlight text %}
brew install sdl2
{% endhighlight %}
    
## Create A Simple Program

Create a cpp file and open in your fav editor (Sublime Right?).

{% highlight text %}
mkdir sdl2_in_a_flash
cd sdl2_in_a_flash
touch main.cpp
subl main.cpp
{% endhighlight %}

Then add the bare minimum to get SDL2 up and running.

{% highlight cpp %}
#include <SDL2/SDL.h>

int
main()
{
  // SDL Window
  SDL_Init(SDL_INIT_EVERYTHING);

  auto sdl_window = SDL_CreateWindow("SDL2 in 30 seconds.",
                SDL_WINDOWPOS_CENTERED,
                SDL_WINDOWPOS_CENTERED,
                800,
                480,
                SDL_WINDOW_ALLOW_HIGHDPI | SDL_WINDOW_OPENGL);

  // GL
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 2);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
  SDL_GL_SetAttribute(SDL_GL_RED_SIZE, 5);
  SDL_GL_SetAttribute(SDL_GL_GREEN_SIZE, 5);
  SDL_GL_SetAttribute(SDL_GL_BLUE_SIZE, 5);
  SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE, 24);
  SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);
  SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1);
  SDL_GL_SetAttribute(SDL_GL_MULTISAMPLEBUFFERS, 2);
  SDL_GL_SetAttribute(SDL_GL_MULTISAMPLESAMPLES, 4);
  
  auto gl_context = SDL_GL_CreateContext(sdl_window);

  SDL_GL_MakeCurrent(sdl_window, gl_context);

  // Game loop
  bool is_running = true;
  while(is_running)
  {
    // Process Events
    SDL_Event sdl_event;
  
    while (SDL_PollEvent(&sdl_event))
    {
      if (sdl_event.type == SDL_QUIT)
      {
        is_running = false;
      }
    }

    // *** Do Your Stuff.

  }


  return 0;
}
{% endhighlight %}


## Compile And Run

{% highlight text %}
clang++ main.cpp -std=c++11 -I/usr/local/include -L/user/local/lib -lsdl2 -F OpenGL
./a.out
{% endhighlight %}


## Rejoice!

I'm not sure it could be easier really.