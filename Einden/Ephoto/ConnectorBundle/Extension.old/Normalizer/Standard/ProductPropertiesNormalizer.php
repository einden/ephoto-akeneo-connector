<?php

    namespace Einden\Ephoto\ConnectorBundle\Extension\Normalizer\Standard;

    use Pim\Bundle\CatalogBundle\Filter\CollectionFilterInterface;
    use Pim\Component\Catalog\Model\ProductInterface;
    use Symfony\Component\DependencyInjection\ContainerInterface;
    use Symfony\Component\HttpFoundation\RequestStack;

    class ProductPropertiesNormalizer extends \Pim\Component\Catalog\Normalizer\Standard\Product\PropertiesNormalizer
    {
        /**
         * @var ContainerInterface
         */
        private $request;

        public function __construct(
                CollectionFilterInterface $filter,
                RequestStack $requestStack
        ) {
            $this->request = $requestStack->getCurrentRequest();
            parent::__construct($filter);
        }

        public function normalize($product, $format = null, array $context = [])
        {
            $data = parent::normalize(
                    $product,
                    $format,
                    $context
            );
            $data['id'] = $product->getId();

            return $data;
        }

        public function supportsNormalization($data, $format = null)
        {
            $isEphotoApiRequest = $this->request ? strpos(
                            $this->request->getRequestUri(),
                            'api/rest/ephoto'
                    ) > 0 : false;
            $isSupported = $data instanceof ProductInterface && 'json' === $format && $isEphotoApiRequest;

            return $isSupported;
        }

    }