class game_logic
{

};


Core::Scheduler::Register_callback(callback_id)


class Subscription
{
public:



};



class Game_logic
{
public:

  Game_logic()
  {
    Core::Schedular::Subscription subs;

    Core::Scheduler(this, &on_update, subs);
    Core::Scheduler(this, &on_remove, subs);
    Core::Scheduler(this, &on_start, subs);
    Core::Scheduler(this, &on_event, subs);
    Core::Scheduler(this, &on_collision, subs);
  }

  void
  on_update();

  void
  on_event();

};


Core::Scheduler::add_callback(Core::update, &update, this);
Core::Scheduler::add_callback(Core::early_update, &update, this);
Core::Scheduler::add_callback(Core::late_update, &update, this);
Core::Scheduler::add_callback(Rigidbody::collision, &on_update, &ent);
Core::Scheduler::add_needs_update(&update_text_texture);


Rigidbody::collision_callback(function_ptr)
{

}



namespace Core {
namespace Scheduler {



}
}
