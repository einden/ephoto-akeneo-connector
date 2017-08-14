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
                'change input[name=asset-sids]': 'updateModal',
                'click .add-asset': 'openModal'
            },
            initialize: function (attribute) {
                model = this;
                AssetSelectionView.__super__.initialize.apply(this, arguments);
            },
            renderInput: function (context) {
                this.currentRenderContext = context;

                if (!context.value.data)
                    context.value.data = "";

                return this.renderField(context.value.data);

            },
            renderField: function (value) {
                var assets = [];
                _.each(value.split(','), function (item) {
                    if (!item) return;
                    assets.push({
                        id: item,
                        url: Routing.generate(
                            'einden_ephoto_media_show',
                            {assetId: item}
                        )
                    })
                });
                return this.fieldTemplate({
                    value: value,
                    assets: assets
                });
            },
            updateModal: function () {
				alert('updateModal');
            },
            openModal: function () {
                alert('openModal');
            },
        });
        return AssetSelectionView;
    }
);