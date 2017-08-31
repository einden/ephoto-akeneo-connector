<?php

    namespace Einden\Ephoto\ConnectorBundle\Extension\Normalizer\Standard;

    use Pim\Component\Catalog\Model\ChannelInterface;
    use Symfony\Component\HttpFoundation\RequestStack;
    use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

    class ChannelNormalizer extends \Pim\Component\Catalog\Normalizer\Standard\ChannelNormalizer
    {
        /** @var null|\Symfony\Component\HttpFoundation\Request */
        private $request;

        public function __construct(NormalizerInterface $translationNormalizer, RequestStack $requestStack)
        {
            $this->request = $requestStack->getCurrentRequest();

            parent::__construct($translationNormalizer);
        }

        public function normalize($object, $format = null, array $context = [])
        {
            return ['id' => $object->getId()] + parent::normalize($object, $format, $context);
        }

        public function supportsNormalization($data, $format = null)
        {
            $isEphotoApiRequest = $this->request ? strpos(
                            $this->request->getRequestUri(),
                            'api/rest/ephoto'
                    ) > 0 : false;

            return $data instanceof ChannelInterface && 'json' === $format && $isEphotoApiRequest;
        }

    }