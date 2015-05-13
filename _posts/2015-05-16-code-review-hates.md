---
layout:     post
title:      My Top 10 Code Review BS
date:       2015-05-16 15:41:12
summary:    Code reviews can just suck.
categories: General
tags: 		GeneralDev, Coding,
---


I think code reviews are a good thing, but when a friend posted [this article](http://kevinlondon.com/2015/05/05/code-review-best-practices.html) it made me realise that they can sometimes suck. And for the wrong reasons. These are some comments that I've seen in reviews, they range from the nit-picky to the insane.

So on my road to becoming more a jaded developer, these are my top ten code review bullshit comments...

_Disclosure: I admit it - I'm guilty of one or two of these (not admitting to which tho)._



### 09. You Don't Need To Initalize That.

_"You know shared_ptr default to null anyway so you don't need to bother initalizing it."_ Yes, yes I did know that. However since you've typedef'd everything to hide the fact its a shared_ptr I'll just go and make it super obvious to anybody reading code.



### 08. Standard Bashing
_"I know in some cases we use the 'qw' prefix, but in this case it should be 'ddw', it clearly states it in 3.2.23.42.34a in the 4th version of the standard doc."_ You know what the problem might actually be?



### 07. Non Standard Bashing
_"Its not in the standard doc but it's what I do."_ In other words I should code against your preference because you are doing the review!



### 06. You Don't Need To Use .at(i)

_"Since you are looping over the size of the container .at(i) isn't required! It's also slower!"_ Oh how shortsighted you are. Yes it isn't 'required' today, but functions you know have this habit of being modified beyond their original purpose. So I'll just leave that in.



### 05. Don't Use Init Lists.

_"Don't use init lists because they are unreadable."_ Are we speaking the same language? Do you do a da chacha?



### 04. Make It A shared_ptr

_"Make it a shared_ptr, it will solve the ownership."_ NO IT WILL NOT SOLVE THE OWNERSHIP - IT WILL MAKE IT MORE COMPLICATED!



### 03. You Don't Need To const Everything.
_"A const isn't a guarantee that the value wont change."_ I never knew that was possible in C++ - you can change the value of a const variable! NO - WAY! Or perhaps I const'd it for the readers benefit (of which I am now regretting).



### 02. You Shouldn't memcpy Becuase Of Vector Of Bools.

_"What if the vector changes to a vector of bools, its a specialization you know, then your memcpy is dangerous."_ I'm now stressing that I hadn't considered that my 3D floating point positional data could be represented with bools (yes yes binary blah blah).



### 01. Don't Use C++11 Because We Don't Know It.
_"You shouldn't use C++11 because not everybody knows it."_ Yep you're in the right industry!



### 00. assert() Is Too Brutal

_"assert() is detrimental to the user if it gets triggered you know."_ o_O you went to uni right? With a real building and teachers and exams and stuff?



### Final

I look at these in jest, and some of them are valid to a point given the right context. However far too often I've seen 40 comments on the correct prefix useage and zero on the overall structure and safety of the program. Reviews serve a point, which is not pointing out the blatantly obvious, or getting out your big nerd hammer, and if you didn't know assert was a debug tool there are more serious issues.


