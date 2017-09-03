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
            // Les évenements
			events: {
                // Appel de la méthode updateModal à chaque changement du input "asset-sids" (= onchange)
				'change input[name=asset-sids]': 'updateModal',
                // Appel de la méthode openModal au clic sur add-asset (= onclick)
				'click .add-asset': 'openModal'
            },
            // Inialisation de ???
			initialize: function (attribute) {
                alert('initialize');
				model = this;
                AssetSelectionView.__super__.initialize.apply(this, arguments);
            },
            // Rendu champ Input ???
			renderInput: function (context) {
                alert('renderInput');
				this.currentRenderContext = context;

                if (!context.value.data)
                    context.value.data = "";

                return this.renderField(context.value.data);

            },
            // ???
			renderField: function (value) {
                alert('renderField');
				var assets = [];
                // Split value et appel la méthode pour chaque valeur
				_.each(value.split(','), function (item) {
                    if (!item) return;
                    // Pour chaque valeur, ajoute un objet au tableau "assets"
					assets.push({
                        id: item,
                        url: Routing.generate(
                            'einden_ephoto_media_show',
                            {assetId: item}
                        )
                    })
                });
                // Appel de la méthode "fieldTemplate" (???) avec la chaine (value) et le tableau des valeurs (assets)
				return this.fieldTemplate({
                    value: value,
                    assets: assets
                });
            },
            // Mise à jour des valeurs (changement du champ sids)
			updateModal: function () {
				alert('updateModal');
            },
            // Ouverture de la fenêtre ePhoto
			openModal: function () {
                alert('openModal');
            },
        });
        return AssetSelectionView;
    }
);