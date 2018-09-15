<?php
/**
 * Denormalize attribute
 */

namespace Einden\Ephoto\ConnectorBundle\Extension\Denormalizer\Standard;

use Pim\Component\Catalog\Denormalizer\Standard\ProductValue\AbstractValueDenormalizer;

class AttributDenormalizer extends AbstractValueDenormalizer
{
    public function denormalize($data, $class, $format = null, array $context = [])
    {
        return '' === $data ? null : $data;
    }
}
