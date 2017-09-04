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

			// Prépare le template
			fieldTemplate: _.template(fieldTemplate),
            
			events: {
                // Evénement lors du clic sur le bouton (= "onclick")
				'click .add-asset': 'selectFile'
            },

			initialize: function (attribute) {
                AssetSelectionView.__super__.initialize.apply(this, arguments);
            },

            // Appelé à l'affichage de la page
			renderInput: function (context) {
				if(!context.value.data) {
					alert('vide');
					
					// context.value.data = "";
					context.value.data = 
						'{"link":"https://vmware.ephoto.fr/link/AjcAOgt8USwOfwUnBWxTMAR5Azw",'+
						'"thumbnail":"https://vmware.ephoto.fr/small/m1p5e0izm5t9x.JPG",'+
						'"name":"00037610.JPG"}';
				}
					
                // Appel de la méthode renderfield pour formaté les valeurs sauvegardés
				// Retourne le rendu html (le template avec les valeurs remplacées)
				return this.renderField(context.value.data);
            },

            // Formate les valeurs sérialisées de la page en objet
			renderField: function (value) {
				var values = JSON.parse(value);

				// la fonction fieldTemplate (lib underscore) remplace les valeurs dans le template
                return this.fieldTemplate({
                    // Valeur retourné à la validation XHR
					value : value,
                    
					// Valeurs pour remplir le template
					link : values.link,
					thumbnail : values.thumbnail,
					name : values.name,
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