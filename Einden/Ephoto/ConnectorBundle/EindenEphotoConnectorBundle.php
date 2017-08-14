<?php

/*
 * This file is part of the Ephoto Connector Bundle package.
 */

namespace Einden\Ephoto\ConnectorBundle;

use Einden\Ephoto\ConnectorBundle\DependencyInjection\Compiler\OroConfigCompilerPass;
use Einden\Ephoto\ConnectorBundle\DependencyInjection\EindenEphotoConnectorExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class EindenEphotoConnectorBundle extends Bundle
{
	public function build(ContainerBuilder $container)
	{
		parent::build($container);
		$container->addCompilerPass(new OroConfigCompilerPass());
	}
	
        public function getContainerExtension()
        {
            if (null === $this->extension) {
                $this->extension = new EindenEphotoConnectorExtension();
            }

            return $this->extension;
        }	
}
