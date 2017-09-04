'use strict';

define([
        'pim/field',
        'underscore',
        'text!eindenephotoconnector/templates/product/field/mam.html',
    ], function (Field,
                 _,
                 fieldTemplate,
		) {

        var AssetSelectionView = Field.extend({

			// utilisé par renderField()
			fieldTemplate: _.template(fieldTemplate),
            
			events: {
                // Evénement lors du clic sur le bouton (= "onclick")
				'click .add-asset': 'selectFile'
            },

            // Appelé à l'affichage de la page
			initialize: function (attribute) {
                AssetSelectionView.__super__.initialize.apply(this, arguments);
            },

            // Appelé à l'affichage de la page
			renderInput: function (context) {
				if(!context.value.data) {
					// context.value.data = "";
					// fausses valeurs
					context.value.data = "119723,119719";
				}
					
                // Appel de la méthode renderfield pour formaté les valeurs sauvegardés
				// Retourne l'objet qui sera accessible dans le template
				var field = this.renderField(context.value.data);

				// Retourne le rendu html (le template avec les valeurs remplacées)
				return field;
            },

            // Formate les valeurs sérialisées de la page en objet
			renderField: function (value) {
				// Contruit la liste des médias sous forme d'objet {id:integer, url:string}
				var i, assets = [];
				var values = value.split(',');
				
				for(i=0; i<values.length; i++) {
                    if (!values[i]) return;
                    
					assets.push({
                        id: values[i],
                        url: ''
                    });
				}

				// la fonction fieldTemplate (lib underscore) remplace les valeurs dans le template
                return this.fieldTemplate({
                    // Value sera retourné à la validation XHR
					value: value,
                    // Assets va remplir le template
					assets: assets
                });
            },

            // Non utilisé
			//updateModel: function () {
            //},

            // Appelé au clic sur "Sélectionner le fichier"
			selectFile: function () {
				alert('select ePhoto...');
				
				// Deferred est une méthode JQuery qui permet...
				//var deferred = $.Deferred();
                //return deferred.promise();
            }			
        });

		return AssetSelectionView;
    }
);