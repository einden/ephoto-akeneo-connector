<?php

namespace Einden\Ephoto\ConnectorBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/**
 * Inject the extension settings in the configuration controller.
 * TODO: should be reworked in the PIM core project
 *
 * @author    Jean-Marie Leroux <jean-marie.leroux@akeneo.com>
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class OroConfigCompilerPass implements CompilerPassInterface
{
    /**
     * {@inheritDoc}
     */
    public function process(ContainerBuilder $container)
    {
        $configManagerDefinition = $container->findDefinition('oro_config.global');
        $settings = $configManagerDefinition->getArguments()[1];

        $diExtensionName = 'pim_einden_ephoto_connector';
        $bundleSettings = $settings[$diExtensionName];

        $configControllerDefinition = $container->findDefinition('oro_config.controller.configuration');
        $arguments = $configControllerDefinition->getArguments();
        $options = $arguments[3];

        foreach ($bundleSettings as $name => $value) {
            $options[] = [
                'section' => $diExtensionName,
                'name'    => $name,
            ];
        }
        $arguments[3] = $options;
        $configControllerDefinition->setArguments($arguments);
    }
}
