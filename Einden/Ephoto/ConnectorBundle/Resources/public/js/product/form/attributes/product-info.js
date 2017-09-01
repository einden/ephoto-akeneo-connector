'use strict';

/*
 * https://docs.akeneo.com/1.7/cookbook/ui_customization/add_custom_information_to_a_field.html#how-to-add-custom-information-to-a-field
 */
define(
    [
        'jquery',
        'underscore',
        'pim/form'
    ],
    function ($, _, BaseForm) {
        return BaseForm.extend({
            configure: function () {
                this.listenTo(this.getRoot(), 'pim_enrich:form:field:extension:add', this.addFieldExtension);

                return BaseForm.prototype.configure.apply(this, arguments);
            },
            addFieldExtension: function (event) {
                var product = this.getFormData();
                event.promises.push($.Deferred().resolve().then(function () {
                    var field = event.field;
                    field.productAttributes = product.meta;
                }.bind(this)).promise());

                return this;
            }
        });
    }
);