---
layout:     post
title:      Hair Pulling MSVS Brace Initialization
date:       2015-04-06 08:05:06
summary:    One of those infuriating moments
categories: General
tags: 		C++, MSVS,
---

We've all had one of those moments where you can't figure out what the hell is going on. You've changed something in your code and all hell has broken loose, most of the time this is to due to needing a rest or at least a change of gear. When porting some code that I had been working on with Clang over to MSVS it altogether stopped working. After a few expletives I was quite surprised to find out it that was due to double brace initialization combined with only a `single` element.

### TestCode

Curious to what was going on I did the following little [test](http://pastie.org/10048059) in MSVS 2013 (Update 4).

{% highlight cpp %}

struct Foo {
  std::string name;
};
 
std::vector<Foo> fooOne = {% raw %}{{ {% endraw %}
  {"fooOne"},
{% raw %}}};{% endraw %}

std::vector<Foo> fooTwo = {% raw %}{{ {% endraw %}
  Foo{"fooTwo"},
{% raw %}}}; {% endraw %}

struct Bar {
  std::string name;
  int i;
};
 
std::vector<Bar> barOne = {% raw %}{{ {% endraw %}
  {"barOne", 1},
{% raw %}}};{% endraw %}

std::vector<Bar> barTwo = {% raw %}{{ {% endraw %}
  Bar{"barTwo", 1},
{% raw %}}};{% endraw %}

std::vector<std::string> booOne = {% raw %}{{ {% endraw %}
  {"boo"},
{% raw %}}};{% endraw %}

std::vector<std::string> booTwo = {% raw %}{{ {% endraw %}
  std::string{"boo"},
{% raw %}}};{% endraw %}

{% endhighlight plaintext %}

Top points if this is the output that you are expecting.

{% highlight text %}
fooOne

b

boo
boo
{% endhighlight %}

Changing the initialization to single braces fixes the issue, I'm not sure where I picked up the double braced initialization from but I've always used them that way.
