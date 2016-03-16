if(Meteor.isClient)
{
  var _uid = Session.get('_uid');
  window.tags = [];
  if(_uid == undefined)
  {
    _uid = Math.floor(Math.random()*1000) +1;
    Session.set('_uid',_uid);
  }
  
  Meteor.subscribe('Post.get');
  Meteor.subscribe('User.get');
  
  Template.chatShow.helpers({
    posts:function () {
      console.log(window.tags);
      return Post.find({tags:{ $in: Session.get('tags') }});
    },
    name:function (i) {
        console.log(Meteor.users.findOne({ _id: i}).emails[0].address);
        return Meteor.users.findOne({ _id: i}).emails[0].address;
    }
  })

  
  
  Template.chatCreate.events({
    'submit form':function (event) {
      event.preventDefault();
      var input = event.target.content;
      var tags = event.target.tags;
      Session.set('tags',tags.value.split(','));
      //console.log(window.tags);
      var obj = {
        content:input.value,
        tags:tags.value,
        _uid:Meteor.userId()
      }
      if(input.value.trim() == '')
      {
        return;
      }
      Meteor.call('Post.store',obj);
      input.value = "";

    }
  })

  console.log(_uid);
}



if(Meteor.isServer)
{
  Meteor.publish('Post.get',function(){

      return Post.find();
  })
  Meteor.publish('User.get',function(){

      return Meteor.users.find();
  })

  Meteor.methods({
    'Post.store':function (e) {
        Post.insert(e);
        console.log(1);
    }
  })
  
}

