<?php

namespace Einden\Ephoto\ConnectorBundle\DataGrid\Formatter\Property\ProductValue;

use Pim\Bundle\DataGridBundle\Extension\Formatter\Property\ProductValue\TwigProperty;

/**
 * Field property, able to render majority of product attribute values
 *
 * @author    Nicolas Dupont <nicolas@akeneo.com>
 * @copyright 2013 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class EphotoProperty extends TwigProperty
{
    const TEMPLATE = 'EindenEphotoConnectorBundle:Property:image.html.twig';	
	
	public function __construct(
			\Twig_Environment $environment
	) {
		parent::__construct($environment);
	}

	/**
	 * {@inheritdoc}
	 */
	protected function convertValue($value)
	{
		$result = $this->getBackendData($value);

		if (null === $result) {
			return null;
		}

		$attribute = $value['attribute'];
		$text = $value['text'];

		if ($attribute['type'] === 'einden_catalog_ephoto') {
			$thumbnail = '';
			
			if($text) {
				$values = json_decode($text);

				if(isset($values[0]->thumbnail)) {
					// get first thumbnail
					$thumbnail = $values[0]->thumbnail;
				}
			}
			
			return $this->environment->loadTemplate(self::TEMPLATE)->render([
				'thumbnail' => $thumbnail	
			]);
		}

		return parent::convertValue($result);
	}
}
