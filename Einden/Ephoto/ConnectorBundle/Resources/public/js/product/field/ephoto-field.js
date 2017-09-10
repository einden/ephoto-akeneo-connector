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

			// Instance ePhoto API
			api: null,
			
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
				
				$('#EphotoField-' + this.attribute.id + '.select').hide();

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
										if(jqxhr.status !== 200 || typeof ePhoto === 'undefined') {
											alert('The ePhoto server is unavailable !');
											return;	
										}

										this.api=new ePhoto({ server: this.config.baseurl });
										this.api.connect();
										
										this.api.File.setMode('link');
										
										// obj.File.setButtons( obj.IMAGE_FILES, [{'size':'200'},  {'size':'600'}] );
										this.api.File.setButtons( this.api.IMAGE_FILES, [{'size':'320'}, {'size':'1200'}] );
										
										//$('#EphotoField-' + this.attribute.id + '.select').show();
									
									}.bind(this)
								
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
				var inc, assets = this.assets.slice();
				
				for(inc in assets) {
					assets[inc].id = this.attribute.id + '-' + inc;
				}

				// Retourne le template formaté
                return this.fieldTemplate({
					id : this.attribute.id,
					assets : assets
                });
            },

            // Sélectionner un fichier
			selectFile: function () {
				if(typeof ePhoto === 'undefined') {
					alert('The ePhoto server is unavailable !');
					return;
				}

				this.api.File.callOnFileReceived(this.insertFile);
			},
			
			// Insert le fichier
			insertFile: function(result) {
				if(result === 'failure') {
					alert('Une erreur a été rencontrée !');
					return;
				}
				
				if(result === 'fileDoesNotExist') {
					alert('Aucun fichier sélectionné !');
					return;
				}
				
				console.log(result);

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