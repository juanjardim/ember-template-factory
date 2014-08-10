/*!
 * @overview  Ember - Template Factory
 * @copyright Copyright 2014-2014 Juan Jardim and contributors
 * @license   Licensed under MIT license
 *            See https://github.com/juanjardim/ember-template-factory/blob/master/LICENSE
 * @version   0.5.0
 */


var FactoryController = Em.ArrayController.create({
    templatePath: "/ember/templates/",
    currentAppView: null,
    currentAppTemplate: null,
    lastAppView: null,
    currentServiceView: null,
    currentServiceTemplate: null,
    lastServiceView: null,
    lastServiceTemplate: null,
    currentEditView: null,
    currentEditTemplate: null,
    lastServiceData: null,
    stackCount: null,
    loadSectionTimes: 0,
    previousViews: [],


    loadSection: function(container, templateName, callback) {
        if (!templateName || templateName == "")
            return;
        var view = FactoryController.loadTemplate(templateName, callback);
        var containerView = Em.View.views[container];
        if (!containerView) {
            var loadSectionTimes = FactoryController.get("loadSectionTimes") + 1;
            window.setTimeout(FactoryController.loadSection, 50, container, templateName, callback);
            FactoryController.set("loadSectionTimes", loadSectionTimes);
            return;
        }
        var temp = containerView.toArray();
        if (temp.length) {
            if (!view.get("isDestroyed"))
                containerView.removeAllChildren();
        }

        containerView.addObject(view);
        RepositoryController.updateSectionTemplates(container, templateName, view);
        Ember.run.sync();
    },

    loadAppTemplate: function(templateName, callback) {
        if (!templateName || templateName == "")
            return;
        var currentAppTemplate = FactoryController.get("currentAppTemplate");
        if (currentAppTemplate == templateName)
            return;
        var view = FactoryController.loadTemplate(templateName, callback);
        if (!view)
            return;
        if (view.get("state") == "inDOM" && view.get("isInserted"))
            return;

        var serviceView = FactoryController.get("currentServiceView");
        var currentServiceTemplate = FactoryController.get("currentServiceTemplate");
        if (serviceView != null) {
            FactoryController.set("lastServiceView", serviceView);
            FactoryController.set("lastServiceTemplate", currentServiceTemplate);
        }

        var appView = FactoryController.get("currentAppView");
        var appTemplateName = FactoryController.get("currentAppTemplate");
        if (appView != null) {
            var element = $("#" + appTemplateName);
            if (element.length > 0 && element.hasClass("active"))
                element.removeClass("active");

            FactoryController.removeView(appView, appTemplateName);
            FactoryController.set("lastAppView", appView);
        }
        FactoryController.set("currentAppTemplate", templateName);

        var previousViews = FactoryController.get("previousViews");
        if (templateName == "index")
            previousViews = [];

        previousViews.push(FactoryController.createCurrentTemplate(templateName, "section"));
        FactoryController.set("previousViews", previousViews);

        var containerView = Em.View.views['appContainerView'];
        if (!containerView)
            return;
        var temp = containerView.toArray();
        if (temp.length)
            containerView.unshiftObject();
        containerView.addObject(view);
        FactoryController.set("currentAppView", view);
        Ember.run.sync();
    },

    loadModalTemplate: function(templateName, callback, auto) {
        if (!templateName|| templateName == "")
            return;
        var view = FactoryController.loadTemplate(templateName, callback);
        if (!view)
            return;

        var containerView = Em.View.views['modalContainerView'];
        if (!containerView)
            return;

        if (!auto || auto) {
            var keyboard = true;
            var backdrop = true;
        } else if (!auto) {
            keyboard = false;
            backdrop = "static";
        }

        var temp = containerView.toArray();
        if (temp.length)
            containerView.removeAllChildren();
        containerView.addObject(view);

        FactoryController.set("currentEditView", view);
        FactoryController.set("currentEditTemplate", templateName);

        $('#editView').modal({
            show: true,
            keyboard: keyboard,
            backdrop: backdrop
        });


    },

    removeTemplate: function(view, viewName) {
        if (view != null) {
            var sections = RepositoryController.getSectionTemplateByParentView(viewName);
            if (sections != null) {
                for (var i = 0; i < sections.length; i++) {
                    sections[i].removeFromParent();
                    sections[i].destroyElement();
                    sections.set("isInserted", false);
                }
            }
            view.removeFromParent();
            view.destroyElement();
            view.set("isInserted", false);
            view.set("parentElement", null);
        }
    },

    loadTemplate: function(templateName, callback) {
        try {
            if (!templateName)
                return null;
            if (RepositoryController !== undefined) {
                var template = RepositoryController.getTemplate(templateName);
                if (template != null && !template.get("isDestroyed") && !template.get("isDestroying"))
                    return template;
            }
            template = Ember.View.create({
                isInserted: false,
                isLoaded: false,
                parentElement: null,
                wasCalled: false,
                willInsertElement: function() {
                    var isLoaded = this.isLoaded;
                    if (!isLoaded) {
                        FactoryController.getTemplate(FactoryController.get("templatePath") + templateName + ".handlebars", this);
                        this.set("isLoaded", true);
                    }
                },
                didInsertElement: function() {
                    var isInserted = this.isInserted;
                    Ember.run.later(function() {
                        Ember.run.sync();
                    }, 100);

                    if (isInserted)
                        return;
                    if (callback == null) {
                        this.set("isInserted", true);
                        return;
                    }
                    callback();

                },
                willDestroyElement: function() {
                    this.set("isInserted", false);
                }
            });
            if (RepositoryController !== undefined)
                RepositoryController.updateTemplate(templateName, template);

            return template;
        } catch (e) {
            console.log(e);
            return null;
            //tratamento de erro
        }
    },

    getTemplate : function(path, view, templateName, async){
        if (templateName) {
            var template = Ember.TEMPLATES[templateName];
            if (template != null) {
                view.set("templateName", templateName);
                view.rerender();
                return;
            }
        }
        async = async == undefined ? true : async;
        $.ajax({
            url: path,
            async: async,
            success: function(data) {
                var templateName = "";
                $(data).filter('script[type="text/x-handlebars"]').each(function() {
                    templateName = $(this).attr('data-template-name');
                    Ember.TEMPLATES[templateName] = Ember.Handlebars.compile($(this).html());
                });
                if (view != null) {
                    view.set("templateName", templateName);
                    view.rerender();
                }
            }
        });
    },

    goToPreviusView: function() {
        var previousViews = FactoryController.get("previousViews");
        if (previousViews == null || previousViews.length == 0) {
            FactoryController.loadAppTemplate("index");
            return;
        }
        if (previousViews.length - 1 == 0) {
            previousViews.pop();
            FactoryController.loadAppTemplate("index");
            FactoryController.set("previousViews", previousViews);
            return;
        }
        previousViews.pop();
        var previousView = previousViews[previousViews.length - 1];
        if (previousView.template == "index") {
            previousViews = [];
            FactoryController.loadAppTemplate("index");
            FactoryController.set("previousViews", previousViews);
        }
        switch (previousView.type) {
            case "dialog":
                FactoryController.loadModalTemplate(previousView.template);
                break;
            case "home":
                FactoryController.loadAppTemplate("index");
                break;
            case "section":
                previousViews.pop();
                FactoryController.loadAppTemplate(previousView.template);
                break;
        }
        FactoryController.set("previousViews", previousViews);
    },

    createCurrentTemplate : function(templateName, type){
        var currentView = {};
        currentView.template = templateName;
        currentView.type = type;
        return currentView;
    }

});
