<?php

    namespace Einden\Ephoto\ConnectorBundle\DataGrid\Formatter\Property\ProductValue;

    use Einden\Ephoto\ConnectorBundle\Ephoto;
    use Pim\Bundle\DataGridBundle\Extension\Formatter\Property\ProductValue\TwigProperty;
    use Symfony\Component\Translation\TranslatorInterface;

    /**
     * Field property, able to render majority of product attribute values
     *
     * @author    Nicolas Dupont <nicolas@akeneo.com>
     * @copyright 2013 Akeneo SAS (http://www.akeneo.com)
     * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
     */
    class TessaProperty extends TwigProperty
    {
        const TEMPLATE_KEY = 'EindenEphotoConnectorBundle:Property:image.html.twig';

        /**
         * @var Ephoto
         */
        protected $ephoto;

        public function __construct(
                \Twig_Environment $environment,
                TranslatorInterface $translator,
                Ephoto $ephoto
        ) {
            $this->translator = $translator;
            $this->ephoto = $ephoto;
            parent::__construct($environment);
        }

        /**
         * {@inheritdoc}
         */
        protected function convertValue($value)
        {
            $result = $this->getBackendData($value);

            if (null === $result) {
                return null;
            }

            $attribute = $value['attribute'];
            if ('einden_catalog_ephoto' === $attribute['type']) {
                $result = explode(',', $result);

                $assetId = array_shift($result);
                return $this->getTemplate()->render(
                        [
                                'count'   => count($result),
                                'assetId' => $assetId,
                        ]
                );
            }

            return parent::convertValue($result);
        }

        protected function getTemplate()
        {
            return $this->environment->loadTemplate(self::TEMPLATE_KEY);
        }

    }
