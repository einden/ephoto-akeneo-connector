/*
 * This file is part of the Ephoto Connector Bundle package.
 */

"use strict";

define([
        'underscore',
        'oro/translator',
        'routing',
        'pim/form',
        'text!eindenephotoconnector/templates/system/group/configuration.html'
    ],
    function (_,
              __,
              Routing,
              BaseForm,
              template) {
        return BaseForm.extend({
            className: 'AknFormContainer AknFormContainer--withPadding',
            events: {
                'change .ephoto-config': 'updateModel'
            },
            isGroup: true,
            label: __('ephoto.configuration.tab.label'),
            template: _.template(template),

            render: function () {
                this.$el.html(this.template({
                    base_url: this.getFormData()['pim_eikona_tessa_connector___base_url'] ?
                        this.getFormData()['pim_eikona_tessa_connector___base_url'].value : '',
                }));


                this.delegateEvents();

                return BaseForm.prototype.render.apply(this, arguments);
            },

            updateModel: function (event) {
                var name = event.target.name;
                var data = this.getFormData();
                var newValue = event.target.value;
                if (name in data) {
                    data[name].value = newValue;
                } else {
                    data[name] = {value: newValue};
                }
                this.setData(data);
            }
        });
    }
);