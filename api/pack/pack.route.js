const express = require('express');
const controller = require('./pack.controller.js');
const { body, param, query } = require('express-validator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pack
 *   description: Pack information in Store
 */
/*
router
  .route('/internal/packs/create')
  .post(
    validateInternalAppId,
    body('packId').isInt({ min: 1 }),
    body('collectionId').isString().notEmpty(),
    body('nftId').isInt({ min: 1 }),
    body('seller').isEthereumAddress(),
    body('price').isInt({ gt: 0 }),
    controller.createPack
  );
*/

/**
 * @swagger
 * /api/v1/public/packs/{id}:
 *   get:
 *     summary: Get pack detail in store
 *     tags: [Pack]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Pack's packId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                  type: number
 *                  example: 0
 *                 message:
 *                  type: string
 *                  example: Successfully
 *                 data:
 *                  $ref: '#/components/schemas/Pack'
 *
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route('/public/packs/:packId')
  .get(
    param('packId').isString().notEmpty(),
    controller.getPackById
  );

/**
 * @swagger
 * /api/v1/public/packs:
 *   get:
 *     summary: Get pack list on Store
 *     tags: [Pack]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Item's name
 *       - in: query
 *         name: collectionId
 *         required: false
 *         schema:
 *           type: string
 *         description: Item's collectionId
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *         description: Sort option
 *         example: -price
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                  type: number
 *                  example: 0
 *                 message:
 *                  type: string
 *                  example: Successfully
 *                 data:
 *                  type: object
 *                  properties:
 *                    data:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/StoreOrder'
 *                    paginator:
 *                       $ref: '#/components/schemas/Paginator'
 *
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route('/public/packs')
  .get(
    query('sort').optional().isString().notEmpty(),
    controller.getPacks
  );

/**
 * @swagger
 * /api/v1/game/packs/{id}:
 *   get:
 *     summary: Get pack detail in game
 *     tags: [Pack]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Pack's packId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                  type: number
 *                  example: 0
 *                 message:
 *                  type: string
 *                  example: Successfully
 *                 data:
 *                  $ref: '#/components/schemas/Pack'
 *
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route('/game/packs/:packId')
  .get(
    param('packId').isString().notEmpty(),
    controller.getPackById
  );

/**
 * @swagger
 * /api/v1/game/packs:
 *   get:
 *     summary: Get pack list in game
 *     tags: [Pack]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Item's name
 *       - in: query
 *         name: collectionId
 *         required: false
 *         schema:
 *           type: string
 *         description: Item's collectionId
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *         description: Sort option
 *         example: -price
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                  type: number
 *                  example: 0
 *                 message:
 *                  type: string
 *                  example: Successfully
 *                 data:
 *                  type: object
 *                  properties:
 *                    data:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/StoreOrder'
 *                    paginator:
 *                       $ref: '#/components/schemas/Paginator'
 *
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route('/game/packs')
  .get(
    query('sort').optional().isString().notEmpty(),
    controller.getPacksInGame
  );

module.exports = router;
