<?php
/*
 * This file is part of the Ephoto Connector Bundle package.
 */

namespace Einden\Ephoto\ConnectorBundle\Updater;

use Pim\Component\Catalog\Builder\ProductBuilderInterface;
use Pim\Component\Catalog\Model\AttributeInterface;
use Pim\Component\Catalog\Model\ProductInterface;
use Pim\Component\Catalog\Updater\Setter\AbstractAttributeSetter;
use Pim\Component\Catalog\Validator\AttributeValidatorHelper;

class EphotoAttributeSetter extends AbstractAttributeSetter
{
	/**
	 * @param ProductBuilderInterface  $productBuilder
	 * @param AttributeValidatorHelper $attrValidatorHelper
	 * @param array                    $supportedTypes
	 */
	public function __construct(
			ProductBuilderInterface $productBuilder,
			AttributeValidatorHelper $attrValidatorHelper,
			array $supportedTypes
	) {
		parent::__construct($productBuilder, $attrValidatorHelper);
		$this->supportedTypes = $supportedTypes;
	}

	/**
	 * Set attribute data
	 *
	 * @param ProductInterface   $product   The product to modify
	 * @param AttributeInterface $attribute The attribute of the product to modify
	 * @param mixed              $data      The data to set
	 * @param array              $options   Options passed to the setter
	 */
	public function setAttributeData(
			ProductInterface $product,
			AttributeInterface $attribute,
			$data,
			array $options = []
	) {
		$options = $this->resolver->resolve($options);
		$this->checkLocaleAndScope($attribute, $options['locale'], $options['scope'], 'text');
		$this->setData($product, $attribute, $data, $options['locale'], $options['scope']);
	}

	/**
	 * Set the data into the product value
	 *
	 * @param ProductInterface   $product
	 * @param AttributeInterface $attribute
	 * @param mixed              $data
	 * @param string             $locale
	 * @param string             $scope
	 */
	protected function setData(
			ProductInterface $product,
			AttributeInterface $attribute,
			$data,
			$locale,
			$scope
	) {
		$value = $product->getValue($attribute->getCode(), $locale, $scope);
		if (null === $value) {
			$value = $this->productBuilder->addProductValue(
					$product,
					$attribute,
					$locale,
					$scope
			);
		}
		if (is_string($data) && '' === trim($data)) {
			$data = null;
		}
		$value->setData($data);
	}
}