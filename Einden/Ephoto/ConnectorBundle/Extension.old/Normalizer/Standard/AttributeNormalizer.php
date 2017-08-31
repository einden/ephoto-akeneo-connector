<?php

    namespace Einden\Ephoto\ConnectorBundle\Extension\Normalizer\Standard;

    use Pim\Component\Catalog\Model\AttributeInterface;
    use Pim\Component\Catalog\Normalizer\Standard\DateTimeNormalizer;
    use Pim\Component\Catalog\Normalizer\Standard\TranslationNormalizer;
    use Symfony\Component\HttpFoundation\RequestStack;

    class AttributeNormalizer extends \Pim\Component\Catalog\Normalizer\Standard\AttributeNormalizer
    {
        /** @var \Symfony\Component\HttpFoundation\Request */
        private $request;

        public function __construct(
                TranslationNormalizer $translationNormalizer,
                DateTimeNormalizer $dateTimeNormalizer,
                RequestStack $requestStack
        ) {
            $this->request = $requestStack->getCurrentRequest();

            parent::__construct($translationNormalizer, $dateTimeNormalizer);
        }

        public function normalize($object, $format = null, array $context = [])
        {
            $result = parent::normalize($object, $format, $context);
            $result['properties'] = $object->getProperties();

            return $result;
        }

        public function supportsNormalization($data, $format = null)
        {
            $isEphotoApiRequest = $this->request ? strpos(
                            $this->request->getRequestUri(),
                            'api/rest/ephoto'
                    ) > 0 : false;

            return $data instanceof AttributeInterface && 'json' === $format && $isEphotoApiRequest;
        }

    }