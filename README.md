Welcome to Ember Template Factory!
=====================

This is a project to render handlebars templates when you need them in order to improve performance and code maintenance. imagine that you have a huge project with several modals or sections, this Template Factory allows to, through JSON, get the handlebar template and render it where you need it

----------


What you need
---------


**Ember.js** its a framework for creating ambitious web applications  (see [Ember.js])


#### FactoryController

Add this controller to your Ember project in order to load the templates that you need.
Here you will find different methods in order to load different types of templates: Templates for you AppMainView, for sections and modals.

#### RepositoryController
Add also this controller to your Ember project in order to stored templates that have already been loaded.

#### Template folder
Here you will put all the templates that you want to be render only when you need. The template always have this format:

```
<script type="text/x-handlebars" data-template-name="hello-world">
    <h1> Hello World </h1>
</script>
```

It's important to note that the "data-template-name" has to be different in all templates because Ember uses this attribute as a key in an array of templates.

#### MainApp.js
In your MainApp.js you only need to add:
```
var MainApp = Em.Application.create({
    LOG_TRANSITIONS: true,
    ready: function () {
    /** your code **/
    MainApp.AppContainerView = Em.ContainerView.extend({});
    MainApp.ModalContainerView = Em.ContainerView.extend({});
    /** And other containerView if you need for sections in tabs **/
    });
```

Finally you will need to add this into your main app view:
```
<script type="text/x-handlebars" data-template-name="application">
    <!-- Your HTML code -->
    <div class="container">
        <div class="modal fade" id="editView" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    {{view MainApp.ModalContainerView elementId="modalContainerView"}}
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- modal edit dialog -->
        {{view MainApp.AppContainerView elementId="appContainerView"}}
        {{outlet}}
    </div> <!-- main container -->
</script>

```

Then when you need to open a modal with a handlebar template you only need to:
```
FactoryController.loadModalTemplate(templateName, callback);
```

See the [demo] for more fun



License
----

The MIT License (MIT)


[Ember.js]:http://emberjs.com/
[demo]:http://juanjardim.com/index/templatefactory
