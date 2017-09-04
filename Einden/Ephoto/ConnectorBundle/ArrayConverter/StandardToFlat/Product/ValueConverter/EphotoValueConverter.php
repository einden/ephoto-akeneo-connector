<?php

namespace Einden\Ephoto\ConnectorBundle\ArrayConverter\StandardToFlat\Product\ValueConverter;

use Pim\Component\Connector\ArrayConverter\FlatToStandard\Product\AttributeColumnsResolver;
use Pim\Component\Connector\ArrayConverter\StandardToFlat\Product\ValueConverter\AbstractValueConverter;
use Pim\Component\Connector\ArrayConverter\StandardToFlat\Product\ValueConverter\ValueConverterInterface;

class EphotoValueConverter extends AbstractValueConverter implements ValueConverterInterface
{
	public function __construct(AttributeColumnsResolver $columnsResolver)
	{
		parent::__construct($columnsResolver, ['einden_catalog_ephoto']);
	}

	/**
	 * Converts a value (A REVOIR)
	 *
	 * @param string $attributeCode
	 * @param mixed  $data
	 *
	 * @return array
	 */
	public function convert($attributeCode, $data)
	{
		$convertedItem = [];

		foreach ($data as $value) {
			$flatName = $this->columnsResolver->resolveFlatAttributeName(
					$attributeCode,
					$value['locale'],
					$value['scope']
			);

			$convertedItem[$flatName] = $this->convertAssetIdsToUrls(
					$value['data'],
					$value['scope']
			);
		}

		return $convertedItem;
	}

	/**
	 * A REVOIR
	 * @param string $data
	 * @param string $scope
	 *
	 * @return string
	 */
	private function convertAssetIdsToUrls($data, $scope)
	{
		if (trim($data) === '') {
			return '';
		}

		$arr_exploded = explode(',', $data);
		
		$arr_exploded = array_map(
				function ($assetId) use ($scope) {
					return "id=$assetId&kanal=$scope";
				
				}, $arr_exploded
		);

		return implode(';', $arr_exploded);
	}
}
