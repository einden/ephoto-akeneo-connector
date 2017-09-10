'use strict';

define([
		'jquery',
		'underscore',
		'pim/field',
		'text!eindenephotoconnector/templates/product/field/ephoto-field.html',
		'routing',
		'jquery.slimbox',
	], function ($, _, Field, fieldTemplate, Routing) {

		var AssetSelectionView = Field.extend({

			// Configuration
			config: null,

			// Les actifs sélectionnés
			assets: null,

			// Prépare le template
			fieldTemplate: _.template(fieldTemplate),

			// Déclaration des événements
			events: {
				'click .display-file': 'displayFile',
				'click .add-file': 'selectFile',
				'click .remove-file': 'removeFile',
				'click .download-file': 'downloadFile',
			},

			// Initialisation
			initialize: function (attribute) {
				AssetSelectionView.__super__.initialize.apply(this, arguments);

				// Chargement de la configuration
				if(null === this.config) {
					$.getJSON(
						Routing.generate('einden_ephoto_get_config'),
						function(result) {
							this.config = result;

							var configchecked = (
								typeof this.config === 'object' &&
								typeof this.config.baseurl === 'string' &&
								this.config.baseurl.length
							);

							if(!configchecked) {
								alert('An error has occurred !');
								return;
							}

							// Chargement de l'API
							if(typeof ePhoto === 'undefined') {
								$.getScript(
									this.config.baseurl + 'api/apiJS.js',
									function( data, textStatus, jqxhr ) {
										if(jqxhr.status !== 200) {
											alert('The ePhoto server is unavailable !');
											return;	
										}
									}
								);
							}

						}.bind(this)
					);
				}
			},

			// Rendu du champ
			renderInput: function (context) {

				// Charge les actifs au premier chargement
				if(null === this.assets) {
					console.log('chargement : ' + context.value.data);

					this.assets = context.value.data ? JSON.parse(context.value.data) : [];
				}
				
				// Complète les valeurs
				var inc, assets = this.assets.slice(), id = this.attribute.id + '-';
				
				for(inc in assets) {
					assets[inc].id = id + inc;
				}

				// Retourne le template formaté
                return this.fieldTemplate({
					assets : assets
                });
            },

            // Sélectionner un fichier
			selectFile: function () {
				if(typeof ePhoto === 'undefined') {
					alert('The ePhoto server is unavailable !');
					return;
				}

				this.assets.push({
					file : "https://vmware.ephoto.fr/link/AjcAOgt8USwOfwUnBWxTMAR5Azw",
					thumbnail : "https://vmware.ephoto.fr/small/m1p5e0izm5t9x.JPG",
					name : "00037610"
				});

				this.updateField();
			},
			
			// Retirer un fichier
			removeFile: function (event) {
				var item = this.getItem(event);

				this.assets.splice(item.inc, 1);
				this.updateField();
			},

			// Télécharger un fichier
			downloadFile: function (event) {
				var item = this.getItem(event);
				if(typeof item.asset.file !== 'string') return;
				
				window.location.href = item.asset.file + '&download';
			},
			
			// Afficher un fichier
			displayFile: function (event) {
				var item = this.getItem(event);
				if(typeof item.asset.file !== 'string') return;
				
				$.slimbox(item.asset.file, '', {overlayOpacity: 0.3});
            },
			
			// Retourne l'item sélectionné
			getItem: function (event) {
				var el = event.currentTarget || event.srcElement;
				var id = el.id.split('.')[0];
				var inc = id.split('-')[2];	
				
				return {
					id : id,
					inc : inc,
					asset : this.assets[inc]
				};
			},
			
			// Met à jour le champ
			updateField: function () {
				this.setCurrentValue(this.assets && this.assets.length ? JSON.stringify(this.assets) : null);
				this.render();
			}
		});

		return AssetSelectionView;
	}
);