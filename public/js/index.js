const app = {};

app.UserModel = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: '',
        email: '',
    }
});

app.UserCollection = Backbone.Collection.extend({
    model: app.UserModel,
    url: 'api/user/',
});

app.UserView = Backbone.View.extend({
});

collection = app.UserCollection();
collection.fetch();
collection.toString();

