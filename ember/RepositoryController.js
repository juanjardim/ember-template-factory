/*!
 * @overview  Ember - Template Factory
 * @copyright Copyright 2014-2014 Juan Jardim and contributors
 * @license   Licensed under MIT license
 *            See https://github.com/juanjardim/ember-template-factory/blob/master/LICENSE
 * @version   0.5.0
 */


var RepositoryController = Em.ArrayController.create({
    templates : [],


    getCreatedTemplate : function(fileName, storage){
        var entries = RepositoryController.get(storage);
        if(!entries)
            return null;
        for(var i = 0; i < entries.length; i++){
            if(entries[i].get("fileName") == fileName)
                return entries[i].get("entry");
        }
        return null;
    },

    updateCreatedTemplate : function(fileName, Template, storage){
        if(!fileName || !Template)
            return;
        var entries = RepositoryController.get(storage);
        if(!entries)
            return;
        for(var i = 0; i < entries.length; i++){
            if(entries[i].get("fileName") == fileName){
                entries[i].set("entry", Template);
                return;
            }
        }
        var hasEntry = RepositoryController.getCreatedTemplate(fileName, storage);
        if(hasEntry)
            return;
        entries.pushObject(Ember.Object.create({
            fileName : fileName,
            entry : Template
        }));
    },

    getSectionTemplateByParentTemplate : function(parentTemplateName){
        var entries = RepositoryController.get("templates");
        if(!entries)
            return null;
        var Templates = [];
        for(var i = 0; i < entries.length; i++){
            if(entries[i].get("parentTemplateName") == parentTemplateName)
                Templates.push(entries[i].get("entry"));
        }
        return Templates;
    },

    getSectionTemplate : function(parentTemplateName, sectionTemplateName){
        var entries = RepositoryController.get("templates");
        if(!entries)
            return null;
        for(var i = 0; i < entries.length; i++){
            if(entries[i].get("parentTemplateName") == parentTemplateName && entries[i].get("sectionTemplateName") == sectionTemplateName)
                return entries[i].get("entry");
        }
        return null;
    },

    updateSectionTemplates : function(parentTemplateName, sectionTemplateName, Template){
        if(!parentTemplateName || !sectionTemplateName || !Template)
            return;
        var entries = RepositoryController.get("templates");
        for(var i = 0; i < entries.length; i++){
            if(entries[i].get("parentTemplateName") == parentTemplateName && entries[i].get("sectionTemplateName") == sectionTemplateName){
                entries[i].set("entry", Template);
                return;
            }
        }
        var hasEntry = RepositoryController.getSectionTemplate(parentTemplateName, sectionTemplateName);
        if(hasEntry)
            return;
        entries.pushObject(Ember.Object.create({
            parentTemplateName : parentTemplateName,
            sectionTemplateName : sectionTemplateName,
            entry : Template
        }));
    },

    getTemplate : function(templateName){
        var entries = RepositoryController.get("templates");
        if(!entries)
            return null;
        for(var i = 0; i < entries.length; i++){
            if(entries[i].get("templateName") == templateName)
                return entries[i].get("entry");
        }
        return null;
    },

    updateTemplate : function(templateName, template){
        if(!templateName || !template)
            return;
        var entries = RepositoryController.get("templates");
        for(var i = 0; i < entries.length; i++){
            if(entries[i].get("templateName") == templateName){
                entries[i].set("entry", template);
                return;
            }
        }
        var hasEntry = RepositoryController.getTemplate(templateName);
        if(hasEntry)
            return;
        entries.pushObject(Ember.Object.create({
            templateName : templateName,
            entry : template
        }));
    },



});



