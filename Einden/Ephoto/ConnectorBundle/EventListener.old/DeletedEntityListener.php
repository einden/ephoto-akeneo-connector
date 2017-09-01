<?php

namespace Einden\Ephoto\ConnectorBundle\EventListener;

use Pim\Component\Catalog\Model\Product;
use Symfony\Component\EventDispatcher\GenericEvent;

class DeletedEntityListener extends AbstractModificationListener
{

	public function onPostRemove(GenericEvent $event)
	{
		$subject = $event->getSubject();

		$this->ephoto->notifyAboutEntityDeletion($event->getSubjectId(), $subject);

	}

	public function onMassRemoveProducts(GenericEvent $event)
	{
		foreach ($event->getSubject() as $productId) {
			#$this->ephoto->notifyAboutEntityDeletion($productId, new Product());
		}
	}
}