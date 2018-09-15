<?php
/**
 * Ephoto Value Converter
 */

namespace Einden\Ephoto\ConnectorBundle\ArrayConverter\FlatToStandard\Product\ValueConverter;

use Pim\Component\Connector\ArrayConverter\FlatToStandard\Product\FieldSplitter;
use Pim\Component\Connector\ArrayConverter\FlatToStandard\Product\ValueConverter\AbstractValueConverter;

class EphotoValueConverter extends AbstractValueConverter
{
	public function __construct(
		FieldSplitter $fieldSplitter
	) {
		$this->supportedFieldType = ['einden_catalog_ephoto'];
		
		parent::__construct($fieldSplitter);
	}
	
	/**
	 * Converts a value
	 *
	 * @param string $attributeCode
	 * @param mixed  $data
	 *
	 * @return array
	 */
	public function convert(array $attributeFieldInfo, $value)
	{
		$result = [
				$attributeFieldInfo['attribute']->getCode() => [
						[
								'locale' => $attributeFieldInfo['locale_code'],
								'scope'  => $attributeFieldInfo['scope_code'],
								'data'   => '',
						],
				],
		];

		return $result;
	}

}
