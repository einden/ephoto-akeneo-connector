<?php

/*
 * This file is part of the Ephoto Connector Bundle package.
 */

namespace Einden\Ephoto\ConnectorBundle\AttributeType;

use Pim\Bundle\CatalogBundle\AttributeType\AbstractAttributeType;
use Pim\Component\Catalog\Model\AttributeInterface;

class EphotoType extends AbstractAttributeType
{
	public function getName()
	{
		return 'einden_catalog_ephoto';
	}

	/*
	Example for add custom properties :
	protected function defineCustomAttributeProperties(AttributeInterface $attribute)
	{
		$properties = parent::defineCustomAttributeProperties($attribute) + [
						'maximumCount'      => [
								'name'      => 'maximumCount',
								'fieldType' => 'number',
								'options'   => [
										'label'         => 'info.attribute.max count files.label',
										'property_path' => 'properties[maximumCount]',
										'help'          => 'info.attribute.max count files.help',
								],
						],
				];

		return $properties;
	}
	*/
}