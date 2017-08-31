<?php

    namespace Einden\Ephoto\ConnectorBundle\Extension\Normalizer\Standard;

    use Pim\Component\Catalog\Model\ProductInterface;
    use Symfony\Component\HttpFoundation\RequestStack;
    use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

    class ProductNormalizer extends \Pim\Component\Catalog\Normalizer\Standard\ProductNormalizer
    {
        /**
         * @var RequestStack
         */
        private $request;

        public function __construct(
                NormalizerInterface $propertiesNormalizer,
                NormalizerInterface $associationsNormalizer,
                RequestStack $requestStack
        ) {

            parent::__construct($propertiesNormalizer, $associationsNormalizer);

            $this->request = $requestStack->getCurrentRequest();
        }

        public function supportsNormalization($data, $format = null)
        {
            $isEphotoApiRequest = $this->request ? strpos(
                            $this->request->getRequestUri(),
                            '/api/rest/ephoto'
                    ) !== false : false;

            $isSupported = $data instanceof ProductInterface && 'json' === $format && $isEphotoApiRequest;

            return $isSupported;
        }

    }