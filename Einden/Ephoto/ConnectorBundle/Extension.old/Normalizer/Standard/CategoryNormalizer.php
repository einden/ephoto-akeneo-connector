<?php

    namespace Einden\Ephoto\ConnectorBundle\Extension\Normalizer\Standard;

    use Einden\Component\Classification\Model\CategoryInterface;
    use Pim\Component\Catalog\Normalizer\Standard\TranslationNormalizer;
    use Symfony\Component\HttpFoundation\RequestStack;

    class CategoryNormalizer extends \Pim\Component\Catalog\Normalizer\Standard\CategoryNormalizer
    {
        /** @var null|\Symfony\Component\HttpFoundation\Request */
        private $request;

        public function __construct(TranslationNormalizer $translationNormalizer, RequestStack $requestStack)
        {
            $this->request = $requestStack->getCurrentRequest();

            parent::__construct($translationNormalizer);
        }

        public function normalize($object, $format = null, array $context = [])
        {
            return ['id' => $object->getId()] + parent::normalize(
                            $object,
                            $format,
                            $context
                    );
        }

        public function supportsNormalization($data, $format = null)
        {
            $isEphotoApiRequest = $this->request ? strpos(
                            $this->request->getRequestUri(),
                            'api/rest/ephoto'
                    ) > 0 : false;

            return $data instanceof CategoryInterface && 'json' === $format && $isEphotoApiRequest;
        }

    }