---
layout:     post
title:      Draw Text In One Draw Call
date:       2015-10-10 09:01:32
summary:    One technique at batching text.
categories: GameDev
tags:       C++, Coding
---


Drawing text seems like it should be a free lunch, but it's not. Simplest way is to draw a character per quad, but a naive implementation will have each character a seperate draw call. This might be fine for some simple text like 'Level Up' but when you have a screen of text this becomes problematic. You really want to be able to batch your calls somehow. This is how I've been doing it, there are other techniques out there so don't consider this a definitive guide to text batching. Also I'm not going into how to render the text in any detail, as that really is another topic.

![Drawing Text]({{ site.url }}/images/drawing_text.png)

What I've done in Terminal to render text is to push all the data into a texture, use the geometry buffer to build the quad in the correct place with the correct scale, and then in the fragment shader lookup the font glyph.


## Data Texture

This is the most expensive step, we need to build a texture with all the data inside it, and potentially update each frame.

{% highlight cpp %}
std::vector<float> text_data = {
  char[0].character_id, char[0].position_x, char[0].position_x, char[0].tex_u, char[0].tex_v, char[0].width, char[0].height, // other attributes.
  char[1].character_id, char[1].position_x, char[1].position_x, char[1].tex_u, char[1].tex_v, char[1].width, char[1].height, // other attributes.
  // Rest of text...
};
{% endhighlight %}

Use this data as texture data, but we aren't going to use GL_RGBA as our pixel format as we wont get the same data backvout of the texture. Instead we will build our texture with GL_RGBA32F, this way our values will not get clipped.

{% highlight cpp %}
GLuint tex_id;
glGenTextures(1, &tex_id);
glBindTexture(GL_TEXTURE_2D, tex_id);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA32F, width, height, 0, GL_RGBA, GL_FLOAT, &text_data[0]);
{% endhighlight %}

## Render Points

Since we are using the Geometry shader to generate the quads, we need to pass the geo shader some way to index the data texture. We could have a vertex format with an 'id', and generate a large vertex buffer of points, However there is a nice feature in OpenGL we can use. If you render a bunch of nothings, the vertex shader will still get called with unique gl_VertexID. We can pass this along to the geo shader to use as an index into our data texture.

Calling this (With your data texture bound of course).

{% highlight cpp %}
uint32_t how_many_characters_you_want_to_render = 1000;
glDrawArrays(GL_POINTS, 0, how_many_characters_you_want_to_render);
{% endhighlight %}

## Vertex Shader

We can can get the vertex id in the vertex shader (notice no input).

{% highlight c %}
#version 150 core

out VertexData {
  int inID;
} vertexOut;

void main() {
  vertexOut.inID = gl_VertexID;
}
{% endhighlight %}

And pass it straight to the geo shader.


## Geometry Shader

In the geometry shader we can use the vertex id combined with texelFetch (which takes an x,y co-ord into a texture) to get the information from the texture for the quads we need.

{% highlight c %}
#version 150

layout (points) in;
layout (triangle_strip, max_vertices = 4) out;

in VertexData {
  int inID;
} vertexIn[];

out vec2 texC;

uniform sampler2D dataLookup;

void main()
{
  vec4 dataChunk1 = texelFetch(dataLookup, ivec2(0, vertexIn[0].inID), 0);
  vec4 dataChunk2 = texelFetch(dataLookup, ivec2(1, vertexIn[0].inID), 0);
  // Any other data chunks.

  // Generate billboard.
  for(int i = 0; i < 4; i++)
  {
    /*
     We now have all the information to build the quad.
    */

    EmitVertex();
  }

  EndPrimitive();}

{% endhighlight %}



## Fragment Shader

Now we can just sample from the texture that contains all the character glyphs.

{% highlight c %}
#version 150

in vec2 texC;

uniform sampler2D fontLookup; // Contains glyphs of all the characters.

out vec4 outColor;

void main()
{
  outColor = texture(fontLookup, texC);
}
{% endhighlight %}



## Other Stuff

Text is a big topic I purposely avoided talking about UTF-8, and the actual rendering processes as those are their own topics. Being able to batch text like this is pretty cool, I don't see a reason why this couldn't be extended to Sprites.

