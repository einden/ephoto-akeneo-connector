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

			// ID du bundle Akeneo
			CLIENT : 'D61e2620',
			
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
				console.log('initialize');
				
				AssetSelectionView.__super__.initialize.apply(this, arguments);
				
				this.initializeEphoto();
			},
			
			// Initialisation de l'API ePhoto
			initializeEphoto: function() {
				
				if(null !== this.config) return;

				console.log('initializeEphoto');
				
				// Une première déclaration pour éviter les multiples initialisations
				this.config = {};
				
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
							console.log('initialize API');
							
							$.getScript(
								this.config.baseurl + 'api/apiJS.js',
								function( data, textStatus, jqxhr ) {
									if(jqxhr.status !== 200 || typeof ePhoto === 'undefined') {
										alert('The ePhoto server is unavailable !');
										return;	
									}

									this.api=new ePhoto({
										server : this.config.baseurl,
										onConnect : this.apiConnected.bind(this),
										client : this.CLIENT 
									});

									this.api.connect();

									this.api.File.setMode('link');

									this.api.File.setButtons(this.api.IMAGE_FILES, [{'definition':'middle'}]);

									this.api.File.callOnFileReceived(this.insertFile.bind(this));

								}.bind(this)

							);
						}

					}.bind(this)
				);
			},
			
			apiConnected: function() {
				alert('API connected');
				
				//var i = '#EphotoField-' + this.attribute.id + '.select';
				//console.log(i);
				//console.log(document.getElementById(i));
				//$(i).css('visibility', 'hidden');
			},

			// Rendu du champ
			// Note : renderInput se fait avant initialize()
			renderInput: function (context) {
				console.log('renderInput');

				// Charge les actifs au premier chargement
				if(null === this.assets) {
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
				console.log('selectFile');
				console.log(this.api);
				
				if(!this.api || !this.api.isConnected()) {
					alert('The ePhoto server is unavailable !');
					return;
				}
				
				this.api.File.get();
			},
			
			// Insert le fichier
			insertFile: function(result) {
				if(result === 'failure') {
					alert('Une erreur a été rencontrée !');
					return;
				}
				
				if(result === 'fileDoesNotExist' || result === 'no authentication') {
					alert('Aucun fichier sélectionné !');
					return;
				}

				this.assets.push({
					file : result,
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