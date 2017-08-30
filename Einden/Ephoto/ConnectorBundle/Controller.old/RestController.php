<?php
/*
 * This file is part of the Ephoto Connector Bundle package.
 */

namespace Einden\Ephoto\ConnectorBundle\Controller;

use Pim\Bundle\CatalogBundle\Entity\Attribute;
use Pim\Bundle\CatalogBundle\Entity\Category;
use Pim\Component\Api\Repository\ProductRepositoryInterface;
use Pim\Component\Catalog\Model\Product;
use Pim\Component\Catalog\Query\ProductQueryBuilderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class RestController extends Controller
{
	public function productDetailAction(Product $product)
	{
		$serializer = $this->get('pim_serializer');

		$response = new Response($serializer->serialize($product, 'json'));
		$response->headers->add(['Content-Type' => 'application/json']);

		return $response;
	}

	public function categoryDetailAction(Category $category)
	{
		$serializer = $this->get('pim_serializer');

		$response = new Response($serializer->serialize($category, 'json'));
		$response->headers->add(['Content-Type' => 'application/json']);

		return $response;
	}

	public function categoryIndexAction(Request $request)
	{
		$serializer = $this->get('pim_serializer');
		$repo = $this->get('pim_api.repository.category');
		$paginator = $this->get('pim_api.pagination.offset_hal_paginator');

		$defaultParameters = [
				'page'       => 1,
				'limit'      => 25,
				'with_count' => 'false',
		];

		$queryParameters = array_merge($defaultParameters, $request->query->all());

		$offset = $queryParameters['limit'] * ($queryParameters['page'] - 1);
		$order = ['root' => 'ASC', 'left' => 'ASC'];
		$categories = $repo->searchAfterOffset([], $order, $queryParameters['limit'], $offset);

		$parameters = [
				'query_parameters' => $queryParameters,
				'list_route_name'  => 'einden_ephoto_category_index',
				'item_route_name'  => 'pim_api_category_get',
		];

		$count = true === $request->query->getBoolean('with_count') ? $repo->count() : null;
		$paginatedCategories = $paginator->paginate(
				$serializer->normalize($categories, 'external_api'),
				$parameters,
				$count
		);

		return new JsonResponse($paginatedCategories);
	}

	public function channelIndexAction(Request $request)
	{
		$serializer = $this->get('pim_serializer');
		$repo = $this->get('pim_api.repository.channel');
		$paginator = $this->get('pim_api.pagination.offset_hal_paginator');

		$defaultParameters = [
				'page'       => 1,
				'limit'      => 25,
				'with_count' => 'false',
		];
		$queryParameters = array_merge($defaultParameters, $request->query->all());

		$offset = $queryParameters['limit'] * ($queryParameters['page'] - 1);
		$channels = $repo->searchAfterOffset([], ['code' => 'ASC'], $queryParameters['limit'], $offset);

		$parameters = [
				'query_parameters' => $queryParameters,
				'list_route_name'  => 'einden_ephoto_channel_index',
				'item_route_name'  => 'pim_api_channel_get',
		];

		$count = true === $request->query->getBoolean('with_count') ? $repo->count() : null;
		$paginatedChannels = $paginator->paginate(
				$serializer->normalize($channels, 'external_api'),
				$parameters,
				$count
		);

		return new JsonResponse($paginatedChannels);
	}

	public function productIndexAction(Request $request)
	{

		$defaultParameters = [
				'pagination_type' => 'page',
				'page'            => 1,
				'limit'           => 25,
		];
		$queryParameters = array_merge($defaultParameters, $request->query->all());

		$serializer = $this->get('pim_serializer');
		$repo = $this->get('pim_api.repository.product');
		$pqb = $this->get('pim_catalog.query.product_query_builder_factory')->create();
		$routes = ['list' => 'pim_api_product_list', 'detail' => 'pim_api_product_get'];

		$paginatedProducts = $this->searchAfterOffset($serializer, $repo, $pqb, $queryParameters, $routes);

		return new JsonResponse($paginatedProducts);
	}

	public function attributeIndexAction(Request $request)
	{
		$serializer = $this->get('pim_serializer');
		$repo = $this->get('pim_api.repository.attribute');
		$paginator = $this->get('pim_api.pagination.offset_hal_paginator');

		$defaultParameters = [
				'page'       => 1,
				'limit'      => 25,
				'with_count' => 'false',
		];

		$queryParameters = array_merge($defaultParameters, $request->query->all());

		$offset = $queryParameters['limit'] * ($queryParameters['page'] - 1);
		$attributes = $repo->searchAfterOffset([], ['code' => 'ASC'], $queryParameters['limit'], $offset);

		$parameters = [
				'query_parameters' => $queryParameters,
				'list_route_name'  => 'einden_ephoto_attribute_index',
				'item_route_name'  => 'einden_ephoto_attribute_show_by_code',
		];

		$count = true === $request->query->getBoolean('with_count') ? $repo->count() : null;
		$paginatedAttributes = $paginator->paginate(
				$serializer->normalize($attributes, 'external_api'),
				$parameters,
				$count
		);

		return new JsonResponse($paginatedAttributes);

	}

	public function attributeDetailAction(Attribute $attribute)
	{
		$serializer = $this->get('pim_serializer');

		$response = new Response($serializer->serialize($attribute, 'json'));
		$response->headers->add(['Content-Type' => 'application/json']);

		return $response;
	}

	public function attributeDetailByCodeAction($code)
	{
		$serializer = $this->get('pim_serializer');
		$repo = $this->get('pim_catalog.repository.attribute');
		$attribute = $repo->findOneBy(['code' => $code]);
		if (null === $attribute) {
			throw new NotFoundHttpException('No matching attribute was found');
		}

		$response = new Response($serializer->serialize($attribute, 'json'));
		$response->headers->add(['Content-Type' => 'application/json']);

		return $response;
	}

	protected function searchAfterOffset(
			$serializer,
			ProductRepositoryInterface $repository,
			$pqb,
			array $queryParameters,
			$routes
	) {

		$defaultParameters = [
				'page'       => 1,
				'with_count' => 'false',
		];

		$queryParameters = array_merge($defaultParameters, $queryParameters);

		$count = 'true' === $queryParameters['with_count'] ? $repository->count($pqb) : null;

		$offset = ($queryParameters['page'] - 1) * $queryParameters['limit'];
		$entities = $repository->searchAfterOffset(
				$pqb,
				$queryParameters['limit'],
				$offset
		);

		$parameters = [
				'query_parameters'    => $queryParameters,
				'list_route_name'     => $routes['list'],
				'item_route_name'     => $routes['detail'],
				'item_identifier_key' => 'identifier',
		];
		$paginator = $this->get('pim_api.pagination.offset_hal_paginator');

		$paginatedProducts = $paginator->paginate(
				$serializer->normalize($entities, 'json'),
				$parameters,
				$count
		);

		return $paginatedProducts;
	}

}
