<?php
    namespace Einden\Ephoto\ConnectorBundle\Comparator\Attribute;

    use Pim\Component\Catalog\Comparator\ComparatorInterface;

    class EphotoComparator implements ComparatorInterface
    {

        public function supports($type)
        {
            return 'einden_catalog_ephoto' === $type;
        }

        public function compare($data, $originals)
        {
            $default = ['locale' => null, 'scope' => null, 'data' => null];
            $originals = array_merge($default, $originals);

            return (string)$data['data'] !== (string)$originals['data'] ? $data : null;
        }

    }