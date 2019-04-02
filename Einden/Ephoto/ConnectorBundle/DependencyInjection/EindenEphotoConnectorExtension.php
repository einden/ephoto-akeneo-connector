<?php

namespace Einden\Ephoto\ConnectorBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class EindenEphotoConnectorExtension extends Extension implements PrependExtensionInterface
{

    public function prepend(ContainerBuilder $container)
    {
        $loader = new YamlFileLoader(
                $container,
                new FileLocator(__DIR__.'/../Resources/config')
        );

        $loader->load('config.yml');
        $configs = $container->getExtensionConfig($this->getAlias());
        $config = $this->processConfiguration(new Configuration(), $configs);
        $container->prependExtensionConfig($this->getAlias(), $config);
    }

    public function getAlias()
    {
        return 'pim_einden_ephoto_connector';
    }

    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');
		$loader->load('converters.yml');
		$loader->load('formatters.yml');
        $loader->load('attribute_types.yml');
        $loader->load('comparators.yml');
        $loader->load('updaters.yml');
        $loader->load('filters.yml');

        $this->loadAttributeIcons($loader, $container);
    }

    protected function loadAttributeIcons(LoaderInterface $loader, ContainerBuilder $container)
    {
        $loader->load('attribute_icons.yml');
        $icons = $container->getParameter('pim_enrich.attribute_icons');
        $icons += $container->getParameter('einden.ephoto.attribute_icons');
        $container->setParameter('pim_enrich.attribute_icons', $icons);
    }

}
