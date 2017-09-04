'use strict';

define([
        'pim/field',
        'underscore',
        'text!eindenephotoconnector/templates/product/field/mam.html',
        'pim/form-builder',
        'routing',
        'oro/loading-mask'
    ], function (Field,
                 _,
                 fieldTemplate,
                 FormBuilder,
                 Routing, LoadingMask) {
        var model,
            modalBox;

        var AssetSelectionView = Field.extend({
            productAttributes: {},
            fieldTemplate: _.template(fieldTemplate),
            events: {
                'change input[name=asset-sids]': 'updateModel',
                'click .add-asset': 'openModal'
            },

            // Appelé à l'affichage de la page
			initialize: function (attribute) {
                alert('initialize');
				
				model = this;
                AssetSelectionView.__super__.initialize.apply(this, arguments);
            },

            // Appelé à l'affichage de la page
			renderInput: function (context) {
                alert('renderInput');
				
				// on recupère la valeur du champ input (context)
				this.currentRenderContext = context;

                if (!context.value.data)
                    context.value.data = "";

				// TEST
				context.value.data = "119723,119719";
				
                // Appel de la méthode renderfield pour formaté les valeurs sauvegardés
				// Retourne l'objet qui sera accessible dans le template
				return this.renderField(context.value.data);

            },

            // Formate les valeurs sérialisées de la page en objet
			renderField: function (value) {
                alert('renderField');
				
				// Contruit la liste des médias sous forme d'objet {id:integer, url:string}
				var assets = [];
                _.each(value.split(','), function (item) {
                    if (!item) return;
                    assets.push({
                        id: item,
                        url: Routing.generate(
                            'eikona_tessa_media_show',
                            {assetId: item}
                        )
                    })
                });
				
				console.log(assets);
				
				// Appel retourné au framework pour être poussé dans le template
                return this.fieldTemplate({
                    // La valeur brut pour remplir le champ caché sids
					value: value,
                    // La liste des assets (id et miniature)
					assets: assets
                });
            },

            updateModel: function () {
				alert('updateModel');
            },

            openModal: function () {
                alert('openModal');
	
				// Rechercher le but du constructeur Deferred()
				var deferred = $.Deferred();
/*
                // Ajoute un événement Websocket 
				$(window).on('message', this.receiveMessage);

                FormBuilder.build('eikon-tessa-asset-selection-form').then(function (form) {
                    modalBox = new Backbone.BootstrapModal({
                        modalOptions: {
                            backdrop: 'static',
                            keyboard: false
                        },
                        allowCancel: true,
                        okCloses: false,
                        title: _.__('tessa.asset management.title'),
                        content: '',
                        cancelText: _.__('tessa.asset management.cancel'),
                        okText: _.__('tessa.asset management.confirm')
                    });
                    modalBox.open();
                    model = this;
                    modalBox.$el.addClass('EikonModalAssetsSelection');
                    form.setElement(modalBox.$('.modal-body'))
                        .render();

                    modalBox.$el.find('iframe')
                        .on('load', this.onIframeReady)
                        .prop('src', this.getUrl());

                    modalBox.on('cancel', deferred.reject);
                    modalBox.on('ok', function () {
                        var assets = _.sortBy(form.getAssets(), 'code');
                        modalBox.close();
                        $(window).off('message', this.receiveMessage);
                        deferred.resolve(assets);
                    }.bind(this));

                    var loadingMask = new LoadingMask();
                    loadingMask.render().$el.appendTo(modalBox.$el.find('.modal-body'))
                        .css({
                            'position': 'absolute',
                            'width': '100%',
                            'height': '100%',
                            'top': '0',
                            'left': '0'
                        });
                    loadingMask.show();

                    setTimeout(function () {
                        loadingMask.hide().$el.remove();
                    }, 5000);
                }.bind(this));
*/
                return deferred.promise();
            },

			/*
            receiveMessage: function (event) {
                alert('receiveMessage');
				
				console.log('Hi! Yes, the App has got a message ;) Senders origin: ' + event.originalEvent.origin);
                var sids = [];
                $.each(JSON.parse(event.originalEvent.data), function (i, v) {
                    sids.push(v.position_asset_system_id);
                });
                model.setCurrentValue(sids.join(','));
                model.render();

                if (modalBox)
                    modalBox.close();

                $(window).off('message');
            },
			*/
			
            /*
			onIframeReady: function (e) {
                alert('onIframeReady');
                
				var iframe = e.target;
                var iframeContent = iframe.contentWindow;

                if (iframe.src == "")
                    return;
                iframeContent.postMessage(JSON.stringify({'selected': model.getCurrentValue().data.split(',')}), "*");
            },
			*/

            /*
			getRequiredAttributeValues: function () {
                alert('getRequiredAttributeValues');
				
				return {
                    'allowed_extensions': this.attribute.allowed_extensions,
                    'code': this.attribute.code,
                    'field_type': this.attribute.field_type,
                    'labels': this.attribute.labels,
                    'type': this.attribute.type,
                };
            },
			*/

           /*
			getUrl: function () {
               alert('getUrl');
				
				var data = {
                    "ProductId": this.productAttributes.id,
                    "attribute": JSON.stringify(this.getRequiredAttributeValues()),
                    "context": JSON.stringify(this.currentRenderContext.value)
                };

                return Routing.generate('einden_ephoto_get_sso', {
                    data: jQuery.param(data)
                })
            },
		  */
        });

		return AssetSelectionView;
    }
);