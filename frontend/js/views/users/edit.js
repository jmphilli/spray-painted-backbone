define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'text!templates/users/edit.html'
    ], function($, _, Backbone, User, userTemplate){
      var UserView = Backbone.View.extend({
        events: {
                  'click #postUser': 'postUser',
                  'click #updateUser': 'updateUser',
                  'click #deleteUser': 'deleteUser'
                },
        postUser: function (event) {

          $('#password').removeClass()
          $('#password-confirm').removeClass()

          var username = $('#username').val()
          var email = $('#email').val()
          var password = $('#password').val()
          var passwordConfirm = $('#password-confirm').val()
          var userType = 'consumer'

          var formData = new FormData()
          var idCard = $("#state-id").prop('files')[0]
          var idReader = new FileReader();
          idReader.onload = function(e) {
            var extension = idCard.name.substr(idCard.name.lastIndexOf("."), idCard.name.length)
            formData.append('idCard' + extension, this.result)
          }
          idReader.readAsDataURL(idCard)

          var medicalCard = $("#medical-card").prop('files')[0]
          var medReader = new FileReader();
          medReader.onload = function(e) {
            var extension = medicalCard.name.substr(medicalCard.name.lastIndexOf("."), medicalCard.name.length)
            formData.append('medicalCard' + extension, this.result)
          }
          medReader.readAsDataURL(medicalCard)

          if(password == passwordConfirm) {
            var user = new User({username: username, email: email, userType: userType, password: password});
            user.save(null, {success: function(model, response) {

                var callback = function() {
                  var token = localStorage.getItem("login")
                  $.ajax({
                    url: 'api/files',
                    data: formData,
                    beforeSend: function (request) {
                      request.setRequestHeader("instantgram-auth", token);
                    },
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function(data){
                    }
                  })
                }

                model.set("password", password)
                model.login(model.get("username"), model.get("password"), callback)

            }});

          } else {
            $('#password').addClass("failure")
            $('#password-confirm').addClass("failure")
          }
        },
        updateUser : function(event) {
          var id = parseInt($('#id').val())
          var username = $('#username').val()
          var password = $('#password').val()
          var userType = $('#userType').val()
          var user = new User({id: id, username: username, userType: userType, password: password});
          user.save()
                         }, 
        deleteUser : function(event) {
          var id = parseInt($('#id').val())
          var username = $('#username').val()
          var password = $('#password').val()
          var userType = $('#userType').val()
          var user = new User({id: id, username: username, userType: userType, password: password});
          user.destroy()
                         },
        render: function(){
          var compiledTemplate = _.template(userTemplate)
          this.$el.html( compiledTemplate );
        },
        renderUser: function(userId) {
                          var that = this
                          var user = new User({id : userId})
                          user.fetch({success : function(data) {
                            var compiledTemplate = _.template(userTemplate)({result: data})
                            that.$el.html( compiledTemplate );
                          }})
                        }
      });
      return UserView;
    });
