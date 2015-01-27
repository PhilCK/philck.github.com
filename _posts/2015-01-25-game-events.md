---
layout:     post
title:      Quick And Dirty Game Events
date:       2015-01-24 14:14:29
summary:    Game events don't need to be complicated.
categories: GameDev
tags: 		  GameDev
---

In all forms of OO programming objects need to communicate with other objects, but we also try hard to keep dependencies down. In games we usually have a lot of objects that need to talk to each other. Imagine a player in a first person shooter. There could conceivably be a player object a gun object a health bar object a ammo object, a power up object, an audio object etc, all these objects lead to dependencies.

Using events can help you decouple your code so that nothing depends on anything else (other than the system of events). There are many ways you can do event systems (and I doubt this will be the last time I talk about them here), this is a quick and dirty way of doing it.

### Lets Get Dirty

A quick and dirty event system can be baked right into your object's. Where the base game object class can contain _all_ the possible events. So when an event is fired, the implementing game object will only respond to an event if it defined the event method.

{% highlight cpp %}
class GameObject
{
public:

  // Event List //
  virtual void onCollision(GameObject &theOtherObject) {}
  virtual void onPlayerJump() {}
  virtual void onPlayerMove(const vec3 newPosition) {}

  // .. continue to list every event in this manor .. //

};

// Now for each object that needs to respond to a particular event
// override that particular event.

class AudioManager : public GameObject
{
  // .. class stuff ..
  void onPlayerJump() override { playAudio("jumpSound"); } 
  void onPlayerMove() override { playAudio("walkSound"); }
}

class Player : public GameObject
{
  void onCollision() override { /* do collision logic */ }
}

{% endhighlight %}

Now that our objects know what todo when a particular event is fired. They need to be informed that such an event has occurred. This can change depending on your preference. How I've been doing it recently, Is to send a lambda to a list of game objects that I've already got doing updates on the game objects. In fact you can actually call the update and render of the object using this method. This also gives you some added control if you wish to add extra things it.

{% highlight cpp %}
// The list of all the game objects that you use to update/render them.
class GameObjectList
{
  std::vector<GameObject*> allYourGameObjects;

public:

  // Update all game objects
  void updateGameObjects()
  {
    // We can use the event caller for this as well.
    broadcastEvent([](GameObject &obj) { obj.update();});
  }

  void broadcastEvent(std::function<void(GameObject&)> process)
  {
    for(auto &gameObj : allYourGameObjects)
    {
      process(*gameObj);
    }
  }
};

// Player sends an event when it moved.
class Player : public GameObject
{
  vec3 playerPos;

  void update()
  {
    if(input().pressedMoveKey())
    {
      playerPos += moveVec;

      allMyObjects.broadcastEvent([playerPos&](GameObject& obj) { obj.onPlayerMoved(playerPos); });
    }
  }
};

{% endhighlight %}


### Final Thoughts

This is really a quick slap method of doing game events, I would only recommend it for small projects. For bigger projects you don't want to be blindly sending events to all the objects in this manor. You might also want game objects to be able to respond to events, or swallow them so they don't propagate further.


