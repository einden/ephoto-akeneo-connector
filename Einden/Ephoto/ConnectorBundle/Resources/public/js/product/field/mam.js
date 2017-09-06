'use strict';

define([
        'jquery',
		'underscore',
		'pim/field',
        'text!eindenephotoconnector/templates/product/field/mam.html',
		'jquery.slimbox',
    ], function ($, _, Field, fieldTemplate) {

        var AssetSelectionView = Field.extend({

			values: null,
			
			// Prépare le template
			fieldTemplate: _.template(fieldTemplate),

			events: {
                // Déclaration des événements
				'click .display-file': 'displayFile',
				'click .add-file': 'selectFile',
				'click .remove-file': 'removeFile',
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
						'{"file":"https://vmware.ephoto.fr/link/AjcAOgt8USwOfwUnBWxTMAR5Azw",'+
						'"thumbnail":"https://vmware.ephoto.fr/small/m1p5e0izm5t9x.JPG",'+
						'"name":"00037610.JPG"}';
				}
				
				// Décode les valeurs
				this.values = JSON.parse(context.value.data);
	
				// la fonction fieldTemplate (lib underscore) remplace les valeurs dans le template
                return this.fieldTemplate({
                    // Valeur retourné à la validation XHR
					value : context.value.data,
                    
					// Valeurs pour remplir le template
					download : this.values.file + '&download',
					thumbnail : this.values.thumbnail,
					name : this.values.name,
                });
            },

            // Sélectionner un fichier
			selectFile: function() {
				alert('select ePhoto...');

            },
			
			// Retirer un fichier
			removeFile: function() {
				alert('remove file');
				
			},
			
			// Afficher un fichier
            displayFile: function () {
				$.slimbox(this.values.file, '', {overlayOpacity: 0.3});
            },
        });

		return AssetSelectionView;
    }
);