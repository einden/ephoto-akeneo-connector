<?php

namespace Einden\Ephoto\ConnectorBundle\EventListener;

use Pim\Component\Catalog\Model\ChannelInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class ChannelModificationListener extends AbstractModificationListener
{

	public function onPostSave(GenericEvent $event)
	{
		$subject = $event->getSubject();

		if ($subject instanceof ChannelInterface) {
			$this->ephoto->notifyAboutChannelModifications($subject);
		}
	}

}