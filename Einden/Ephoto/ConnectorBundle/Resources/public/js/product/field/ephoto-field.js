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

			// Akeneo bundle ID
			CLIENT : 'D61e2620',
			
			// Instance ePhoto API
			api: null,
			
			// Configuration
			config: null,

			// Selected Assets
			assets: null,

			// Prepares the template
			fieldTemplate: _.template(fieldTemplate),

			// Declaration of events
			events: {
				'click .display-file': 'displayFile',
				'click .add-file': 'selectFile',
				'click .remove-file': 'removeFile',
				'click .download-file': 'downloadFile',
			},
			
			// Les métadonnées de la norme DublinCore (hors title et source)
			metadatas: [
				'description.abstract',
				'contributor',
				'subject',
				'creator',
				'publisher',
				'title.alternative',
				'coverage',
				'relation',
				'rights'
			],

			/**
			 * Initialization
			 *
			 * @param
			 */
			initialize: function (attribute) {
				AssetSelectionView.__super__.initialize.apply(this, arguments);

				$.getJSON(
					Routing.generate('einden_ephoto_get_config'),
					function(config) {
						var check = (
							typeof config === 'object' &&
							typeof config.baseurl === 'string' &&
							config.baseurl.length
						);

						if(!check) {
							alert(_.__('ephoto.field.an_error_has_occurred'));
							return;
						}
						
						this.config = config;

						// Load the API
						if(typeof ePhoto === 'undefined') {
							$.getScript(
								this.config.baseurl + 'api/apiJS.js',
								function( data, textStatus, jqxhr ) {
									if(jqxhr.status !== 200 || typeof ePhoto === 'undefined') {
										alert(_.__('ephoto.field.ephoto_server_is_unavailable'));
										return;	
									}

									this.connect();

								}.bind(this)

							);
						
						} else {
							this.connect();
						}

					}.bind(this)
				);
			},

			/**
			 * Initializing the ePhoto API
			 */	
			connect: function() {
				this.api=new ePhoto({
					server : this.config.baseurl,
					authID: this.getCookie('ephoto.akeneo.connector.authid'),
					onConnect : this.isConnected.bind(this),
					client : this.CLIENT 
				});

				this.api.connect();

				this.api.File.setMode('link');
				
				this.api.File.enableDCore();

				this.api.File.setButtons(this.api.IMAGE_FILES, [{'definition':'middle'}]);

				this.api.File.callOnFileReceived(this.insertFile.bind(this));	
			},

			/**
			 * callback when connected
			 */	
			isConnected: function() {
				this.setCookie('ephoto.akeneo.connector.authid', this.api.getAuthID());
			},

			/**
			 * Rendering of the field
			 *
			 * @param {object} Context
			 */
			renderInput: function (context) {
				// Loads assets
				this.assets = context.value.data ? JSON.parse(context.value.data) : [];
				
				// Complete values
				var inc, assets = this.assets.slice();
				
				for(inc in assets) {
					assets[inc].id = this.attribute.id + '-' + inc;
				}

				// Return the formatted template
				return this.fieldTemplate({
					id : this.attribute.id,
					assets : assets
				});
			},

			/**
			 * Select File
			 */
			selectFile: function () {
				if(!this.api || !this.api.isConnected()) {
					alert(_.__('ephoto.field.ephoto_server_is_unavailable'));
					return;
				}
				
				this.api.File.get();
			},
			
			/**
			 * Insert the file
			 *
			 * @param {string} the link to the image
			 * @param {xml} DublinCore XML metadata
			 */
			insertFile: function(file, dcore) {
				var i, value, result = {};
				
				// Vérification du fichier
				if(file === 'failure') {
					alert(_.__('ephoto.field.an_error_has_occurred'));
					return;
				}

				if(file === 'fileDoesNotExist' || file === 'no authentication') {
					alert(_.__('ephoto.field.no_files_selected'));
					return;
				}
				
				// Suppression de l'extension dans le lien
				var ext = file.substr(file.lastIndexOf('.') + 1);
				
				if(ext.length === 3) {
					file = file.substr(0, file.lastIndexOf('.'));
				}
				
				// Lien vers le fichier
				result.file = file;
				
				// Lien vers le fichier en forcant le téléchargement
				result.downloadfile = file + '&download';

				// Extraction des métadonnées de la norme DublinCore
				// Les métadonnées obligatoires
				value = dcore.getElementsByTagName('dc:title');
				if(!value.length) { return; }

				result.name = value[0].childNodes[0].nodeValue;

				value = dcore.getElementsByTagName('dc:format');
				
				if(value.length) {
					result.format = value[0].childNodes[0].nodeValue;
					
					if(result.format === 'JPEG') {
						result.format = 'JPG';
					}
					
					result.name += '.' + result.format.toLowerCase();
				}

				value = dcore.getElementsByTagName('dc:source');
				if(!value.length) { return; }
				
				value = value[0].childNodes[0].nodeValue;
				result.thumbnail = value.replace('media/', 'small/').replace('file/', 'small/') + '.JPG';

				// Les métadonnées facultatives
				for(i=0; i<this.metadatas.length; i++) {
					value = dcore.getElementsByTagName('dc:' + this.metadatas[i]);

					if(value.length) {
						result[ this.metadatas[i].replace('.', '_') ] = value[0].childNodes[0].nodeValue;
					}
				}

				// Ajout au JSON
				this.assets.push(result);
				
				this.updateField();
			},
			
			/**
			 * Remove a file
			 *
			 * @param {event}
			 */
			removeFile: function (event) {
				var item = this.getItem(event);

				this.assets.splice(item.inc, 1);
				this.updateField();
			},

			/**
			 * Download a file
			 *
			 * @param {event}
			 */
			downloadFile: function (event) {
				var item = this.getItem(event);
				if(typeof item.asset.file !== 'string') return;
				
				window.location.href = item.asset.file + '&download';
			},
			
			/**
			 * Display a file
			 *
			 * @param {event}
			 */
			displayFile: function (event) {
				var item = this.getItem(event);
				if(typeof item.asset.file !== 'string') return;
				
				$.slimbox(item.asset.file, '', {overlayOpacity: 0.3});
			},
			
			/**
			 * Return the selected item
			 *
			 * @param {event}
			 */
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
			
			/**
			 * Updates field
			 */
			updateField: function () {
				this.setCurrentValue(this.assets && this.assets.length ? JSON.stringify(this.assets) : null);
				this.render();
			},
			
			/**
			 * Saving a variable in the cookie
			 */
			setCookie: function(name, value, expires, path, domain, secure) {
				var curCookie=name + "=" + escape(value) +
						((expires) ? "; expires=" + expires.toGMTString() : "") +
						((path) ? "; path=" + path : "") +
						((domain) ? "; domain=" + domain : "") +
						((secure) ? "; secure" : "");

				document.cookie= curCookie;	
			},

			/**
			 * Return the value stored in the cookie
			 */
			getCookie: function(name) {
				var dc=document.cookie;
				var prefix = name + "=";
				var begin=dc.indexOf("; "+ prefix);

				if(begin===-1) {
					begin=dc.indexOf(prefix);
					if(begin!==0) { return null; }
				} else {
					begin+=2;
				}

				var end=document.cookie.indexOf(";", begin);
				if(end===-1) { end=dc.length; }
				var value=unescape(dc.substring(begin + prefix.length, end));

				return value;
			}
		});

		return AssetSelectionView;
	}
);