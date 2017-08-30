<?php
/*
 * This file is part of the Ephoto Connector Bundle package.
 */

namespace Einden\Ephoto\ConnectorBundle\Enrich\Provider\Field;

use Pim\Bundle\EnrichBundle\Provider\Field\FieldProviderInterface;
use Pim\Component\Catalog\Model\AttributeInterface;

class MamFieldProvider implements FieldProviderInterface
{
	public function getField($attribute)
	{
		return 'einden-ephoto-field';
	}

	public function supports($element)
	{
		return $element instanceof AttributeInterface &&
				$element->getAttributeType() === 'einden_catalog_ephoto';
	}
}