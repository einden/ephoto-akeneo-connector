'use strict';

define([
        'jquery',
		'underscore',
		'pim/field',
        'text!eindenephotoconnector/templates/product/field/mam.html',
		'routing',
		'jquery.slimbox',
    ], function ($, _, Field, fieldTemplate, Routing) {

        var AssetSelectionView = Field.extend({

			// Configuration
			config: null,
			
			// Les valeurs courantes
			values: null,

			// Prépare le template
			fieldTemplate: _.template(fieldTemplate),

			// Déclaration des événements
			events: {
				'click .display-file': 'displayFile',
				'click .add-file': 'selectFile',
				'click .remove-file': 'removeFile',
            },		

			// Initialisation
			initialize: function (attribute) {
				AssetSelectionView.__super__.initialize.apply(this, arguments);

				// Chargement de la configuration
				$.getJSON(Routing.generate('einden_ephoto_get_config'), function(result) {
					
					this.config = result;

					if(typeof this.config !== 'object' || typeof this.config.baseurl !== 'string' || !this.config.baseurl.length) {
						alert('An error has occurred !');
						return;
					}
					
					// Chargement de l'API
					if(typeof ePhoto === 'undefined') {
						$.getScript( this.config.baseurl + 'api/apiJS.js', function( data, textStatus, jqxhr ) {
							if(jqxhr.status !== 200) {
								alert('The ePhoto server is unavailable !');
								return;	
							}
						});
					}
	
				}.bind(this));
            },

            // Appelé à l'affichage de la page
			renderInput: function (context) {
				
				// Charge les valeurs
				if(null === this.values) {
					this.values = JSON.parse(context.value.data ? context.value.data : '{}');
				}

				// Retourne le template formaté
                return this.fieldTemplate({
					download : this.values.file + '&download',
					thumbnail : this.values.thumbnail,
					name : this.values.name,
                });
            },

            // Sélectionner un fichier
			selectFile: function() {
				if(typeof ePhoto === 'undefined') {
					alert('The ePhoto server is unavailable !');
					return;
				}

				this.values = {
					"file" : "https://vmware.ephoto.fr/link/AjcAOgt8USwOfwUnBWxTMAR5Azw",
					"thumbnail" : "https://vmware.ephoto.fr/small/m1p5e0izm5t9x.JPG",
					"name" : "00037610.JPG"
				};
				
				this.updateField();
            },
			
			// Retirer un fichier
			removeFile: function() {
				this.values = {};

				this.updateField();
			},
			
			// Met à jour le champ
			updateField: function() {
				this.setCurrentValue(JSON.stringify(this.values));
				this.render();
			},
			
			// Afficher un fichier
            displayFile: function () {
				$.slimbox(this.values.file, '', {overlayOpacity: 0.3});
            },
        });

		return AssetSelectionView;
    }
);