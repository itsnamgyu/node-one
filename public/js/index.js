const app = {};

app.User = Backbone.Model.extend({
    idAttribute: 'id',
    defaults: function () {
        return {
            name: '',
            email: '',
        };
    },
});


app.UserCollection = Backbone.Collection.extend({
    model: app.User,
    url: '/api/user',
});
app.userCollection = new app.UserCollection();


app.UserView = Backbone.View.extend({
    template: _.template($('#user-template').html()),
    initialize: function () {
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    events: {
        'click .user-delete': 'onDelete',
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    onDelete: function () {
        this.model.destroy();
    }
});


app.NewUserView = Backbone.View.extend({
    el: $('#new-user'),
    events: {
        'submit form': 'onSubmit',
    },
    initialize: function () {
        this.nameInput= this.$('#new-user-name');
        this.emailInput = this.$('#new-user-email');
    },
    onSubmit: function (e) {
        e.preventDefault();
        app.userCollection.create(this.getAttributesFromInput());
        this.refreshInputs();
        console.log('Submit!');
        return false;
    },
    getAttributesFromInput: function () {
        return {
            name: this.nameInput.val().trim(),
            email: this.emailInput.val().trim(),
        }
    },
    refreshInputs: function () {
        this.nameInput.val('');
        this.emailInput.val('');
    },
});


app.UserListView = Backbone.View.extend({
    el: $('#user-list'),
    initialize: function() {
        console.log('init user list!');
        app.userCollection.on('add', this.addUser, this);
        app.userCollection.on('reset', this.refresh, this);
    },
    addUser: function (userModel) {
        console.log('Adding user!');
        console.log(userModel);
        this.$el.append(new app.UserView({
            model: userModel,
        }).render().el);
    },
    refresh: function () {
        app.userCollection.each(this.addUser, this);
    }
});

app.newUserView = new app.NewUserView();
app.userListView = new app.UserListView();
app.userCollection.fetch();


