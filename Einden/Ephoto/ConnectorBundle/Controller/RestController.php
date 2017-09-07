<?php

namespace Einden\Ephoto\ConnectorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class RestController extends Controller
{	
	/**
	 * Retourne la configuration
	 *
	 * @return JsonResponse
	 */
	public function getConfigAction()
	{
		$config = $this->get('oro_config.global');
		
		$values = array(
			'base_url' => $config->get('pim_einden_ephoto_connector.base_url')
		);

		return new JsonResponse($values);
	}
}
