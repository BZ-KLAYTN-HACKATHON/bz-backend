const express = require('express');
const controller = require('./item.controller.js');
const { body, param, query } = require('express-validator')
const ObjectId = require('mongoose').Types.ObjectId;

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Item
 *   description: NFT Item Management
 */

/**
 * @swagger
 * /api/v1/internal/collections/{collectionId}/items:
 *   post:
 *     summary: Create new item
 *     tags: [Item]
 *     security:
 *       - accessKey: []
 *         appId:  []
 *     parameters:
 *      - in: path
 *        name: collectionId
 *        required: true
 *        schema:
 *          type: string
 *        example: RG-02
 *        description: Item's collectionId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             minItems: 1
 *             items:
 *              type: object
 *              required:
 *                 - server
 *                 - userId
 *                 - createdBy
 *                 - name
 *                 - type
 *                 - attributes
 *              properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                   example: 425188d5-4565-48b2-af78-abe35bdce92b
 *                   description: ROFI account id
 *                 server:
 *                   type: string
 *                   example: 1
 *                   description: Game server id
 *                 name:
 *                   type: string
 *                   example: Ice Lyre
 *                   description: Item name
 *                 type:
 *                   type: string
 *                   example: 78001
 *                   description: Item type code
 *                 createdBy:
 *                   type: string
 *                   format: uuid
 *                   example: 425188d5-4565-48b2-af78-abe35bdce92b
 *                   description: ROFI account id who create the item
 *                 attributes:
 *                   type: object
 *                   example:
 *                    mdp: 14
 *                    dp: 7
 *                    earnPoint: 1
 *                    rarity: 1
 *                   description: Other item's attributes
 *                 metadata:
 *                   type: object
 *                   example:
 *                    purchaseId: 123FE
 *                   description: Other item's information
 *                 source:
 *                   type: string
 *                   example: airdrop
 *                   description: the origin of item where item created
 *             example:
 *               - name: Ice Lyre
 *                 type: '78001'
 *                 server: 1
 *                 attributes:
 *                   mdp: 14
 *                   dp: 7
 *                   earnPoint: 1
 *                   rarity: 1
 *                 userId: 425188d5-4565-48b2-af78-abe35bdce92b
 *                 createdBy: 2a5ef8f8-ef20-4311-9fd2-f9a3c19e0962
 *                 imageUrl: https://rofi-game-01.b-cdn.net/item/1101.png
 *                 metadata:
 *                  purchaseId: 123FE
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
 *                 message:
 *                  type: string
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *             example:
 *               code: 0
 *               message:
 *               data:
 *               - userId: 425188d5-4565-48b2-af78-abe35bdce92b
 *                 imageUrl: https://cdn-iw-02.rofi.io/item/78001.jpg
 *                 videoUrl: https://cdn-iw-02.rofi.io/videos/rg_01_01/78001.mp4
 *                 collectionId: RG-02
 *                 type: '78001'
 *                 name: Ice Lyre
 *                 price:
 *                 orderId:
 *                 nftOwner:
 *                 status: 1
 *                 server: 1
 *                 createdBy: 425188d5-4565-48b2-af78-abe35bdce92b
 *                 attributes:
 *                   mdp: 14
 *                   dp: 7
 *                   earnPoint: 1
 *                   rarity: 1
 *                 metadata:
 *                   purchaseId: 123FE
 *                 _id: 645878ff4c01970999329773
 *                 createdAt: '2023-05-08T04:22:23.394Z'
 *                 updatedAt: '2023-05-08T04:22:23.394Z'
 *                 nftId:
 *                 id: 645878ff4c01970999329773
 *
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              code: 400
 *              message: "Invalid type"
 */

router
  .route('/internal/collections/:collectionId/items')
  .post(
    body().isArray(),
    body('*.userId').isString().notEmpty(),
    body('*.name').isString().notEmpty(),
    body('*.type').isString().notEmpty(),
    body('*.gameDescription').optional().isString(),
    body('*.collectionDescription').optional().isString(),
    body('*.itemDescription').optional().isString(),
    body('*.server').isInt({ min: 1 }).notEmpty(),
    body('*.createdBy').isString().notEmpty(),
    body('*.imageUrl').optional().isURL(),
    body('*.videoUrl').optional().isURL(),
    body('*.attributes').isObject(),
    body('*.metadata').optional().isObject(),
    body('*.source').optional().isString(),
    controller.createItems
  );

/**
 * @swagger
 * /api/v1/internal/items/mint:
 *   post:
 *     summary: Update item purchased by another user
 *     tags: [Item]
 *     security:
 *       - accessKey: []
 *         appId:  []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - userId
 *               - nftId
 *               - nftOwner
 *               - transactionHash
 *             properties:
 *              userId:
 *                type: string
 *                format: uuid
 *                example: b9e4ffd0-1e84-4ef5-a2bb-e269b603a179
 *                description: ROFI account id
 *              itemId:
 *                type: string
 *                example: 645878ff4c01970999329773
 *                description: Item's id in ROFI platform
 *              nftId:
 *                type: integer
 *                minimum: 1
 *                example: 1234
 *                description: Item's on-chain id (ERC721 ID)
 *              nftOwner:
 *                type: string
 *                example: '0x2193E1FCF612e48aD57081c95931cf74Db5797c9'
 *                description: Wallet address of new owner
 *              transactionHash:
 *                type: string
 *                example: '0x6fe4036830cda7553a59ebe612353ce7c0342cca8de5a8e8d5ddf38c77087bc5'
 *                description: Transaction hash on blockchain in which the item was minted
 *
 *             example:
 *               userId: b9e4ffd0-1e84-4ef5-a2bb-e269b603a179
 *               itemId: 645878ff4c01970999329773
 *               nftId: 2223
 *               nftOwner: '0x2193E1FCF612e48aD57081c95931cf74Db5797c9'
 *               transactionHash: '0x4815898fcd298d6640e54e8b529a0c2604fd50bc4cd627f1a45e59b1f2420bb7'
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
 *                  $ref: '#/components/schemas/Item'
 *               example:
 *                 code: 0
 *                 message:
 *                 data:
 *                   code: 0
 *                   message:
 *                   data:
 *                     _id: 645878ff4c01970999329773
 *                     userId: b9e4ffd0-1e84-4ef5-a2bb-e269b603a179
 *                     imageUrl: https://cdn-iw-02.rofi.io/item/78001.jpg
 *                     videoUrl: https://cdn-iw-02.rofi.io/videos/rg_01_01/78001.mp4
 *                     collectionId: RG-02
 *                     type: '78001'
 *                     name: Ice Lyre
 *                     price:
 *                     orderId:
 *                     nftOwner: '0x2193E1FCF612e48aD57081c95931cf74Db5797c9'
 *                     status: 1
 *                     server: 1
 *                     createdBy: 425188d5-4565-48b2-af78-abe35bdce92b
 *                     attributes:
 *                       mdp: 14
 *                       dp: 7
 *                       earnPoint: 1
 *                       rarity: 1
 *                     createdAt: '2023-05-08T04:22:23.394Z'
 *                     updatedAt: '2023-05-08T07:24:19.444Z'
 *                     nftId: 2223
 *                     id: 645878ff4c01970999329773
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

/**
 * @swagger
 * /api/v1/internal/items/{itemId}:
 *   get:
 *     summary: Get detail an item by id
 *     tags: [Item]
 *     security:
 *       - accessKey: []
 *         appId:  []
 *     parameters:
 *      - in: path
 *        name: itemId
 *        required: true
 *        schema:
 *          type: string
 *        example: 645878ff4c01970999329773
 *        description: Item's id in ROFI Platform
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
 *                  $ref: '#/components/schemas/Item'
 *               example:
 *                 code: 0
 *                 message:
 *                 data:
 *                   _id: 645878ff4c01970999329773
 *                   userId: b9e4ffd0-1e84-4ef5-a2bb-e269b603a179
 *                   imageUrl: https://cdn-iw-02.rofi.io/item/78001.jpg
 *                   videoUrl: https://cdn-iw-02.rofi.io/videos/rg_01_01/78001.mp4
 *                   collectionId: RG-02
 *                   type: '78001'
 *                   name: Ice Lyre
 *                   price:
 *                   orderId:
 *                   nftOwner: '0x2193E1FCF612e48aD57081c95931cf74Db5797c9'
 *                   status: 1
 *                   server: 1
 *                   createdBy: 425188d5-4565-48b2-af78-abe35bdce92b
 *                   attributes:
 *                     mdp: 14
 *                     dp: 7
 *                     earnPoint: 1
 *                     rarity: 1
 *                   createdAt: '2023-05-08T04:22:23.394Z'
 *                   updatedAt: '2023-05-08T07:42:01.236Z'
 *                   nftId: 2223
 *                   id: 645878ff4c01970999329773
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
  .route('/internal/items/:itemId')
  .get(
    controller.getItemById
  );

/**
 * @swagger
 * /api/v1/public/collections/{collectionId}/items:
 *   get:
 *     summary: User get its item list in a collection
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: collectionId
 *        required: true
 *        schema:
 *          type: string
 *        example: RG-02
 *        description: Item's collectionId
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
 *                        type: object
 *                        $ref: '#/components/schemas/Item'
 *                    paginator:
 *                      type: object
 *                      $ref: '#/components/schemas/Paginator'
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
  .route('/public/collections/:collectionId/items')
  .get(
    query('nftOwner').isEthereumAddress(),
    query('name').optional().isString(),
    query('page').optional().isInt({ gt: 0}),
    controller.getItems
  );

/**
 * @swagger
 * /api/v1/public/items/{itemId}:
 *   get:
 *     summary: User get detail an item by id
 *     tags: [Item]
 *     parameters:
 *      - in: path
 *        name: itemId
 *        required: true
 *        schema:
 *          type: string
 *        example: 645878ff4c01970999329773
 *        description: Item's id in ROFI Platform
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
 *                  $ref: '#/components/schemas/Item'
 *               example:
 *                 code: 0
 *                 message:
 *                 data:
 *                   _id: 645878ff4c01970999329773
 *                   userId: b9e4ffd0-1e84-4ef5-a2bb-e269b603a179
 *                   imageUrl: https://cdn-iw-02.rofi.io/item/78001.jpg
 *                   videoUrl: https://cdn-iw-02.rofi.io/videos/rg_01_01/78001.mp4
 *                   collectionId: RG-02
 *                   type: '78001'
 *                   name: Ice Lyre
 *                   price:
 *                   orderId:
 *                   nftOwner: '0x2193E1FCF612e48aD57081c95931cf74Db5797c9'
 *                   status: 1
 *                   server: 1
 *                   createdBy: 425188d5-4565-48b2-af78-abe35bdce92b
 *                   attributes:
 *                     mdp: 14
 *                     dp: 7
 *                     earnPoint: 1
 *                     rarity: 1
 *                   createdAt: '2023-05-08T04:22:23.394Z'
 *                   updatedAt: '2023-05-08T07:42:01.236Z'
 *                   nftId: 2223
 *                   id: 645878ff4c01970999329773
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
  .route('/public/items/:itemId')
  .get(
    param('itemId').isString().custom(value => ObjectId.isValid(value)),
    controller.getItemById
  );

module.exports = router;
