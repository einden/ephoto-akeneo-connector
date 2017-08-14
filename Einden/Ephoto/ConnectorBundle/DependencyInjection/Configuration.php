<?php

namespace Einden\Ephoto\ConnectorBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link
 * http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{

	/**
	 * {@inheritDoc}
	 */
	public function getConfigTreeBuilder()
	{
		$treeBuilder = new TreeBuilder();

		$root = $treeBuilder->root('pim_einden_ephoto_connector');

		$children = $root->children();

		$children->arrayNode('settings')
				 ->children()
				 ->arrayNode('base_url')
				 ->children()
				 ->scalarNode('value')->end()
				 ->scalarNode('scope')->end()
				 ->end()
				->end()
				->end()
				->end();

		$children->end();

		$root->end();

		return $treeBuilder;
	}
}
