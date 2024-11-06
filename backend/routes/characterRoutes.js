// routes/characterRoutes.js
const express = require('express');
const router = express.Router();
const { Character } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Characters
 *   description: Операции с персонажами
 */
/**
/**
 * @swagger
 * /characters:
 *   post:
 *     summary: Создание нового персонажа
 *     description: Создает новый персонаж с указанными данными.
 *     tags:
 *       - Characters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               imageWebp:
 *                 type: string
 *               imageJpeg:
 *                 type: string
 *               avatar:
 *                 type: string
 *               fallbackAvatar:
 *                 type: string
 *               isPremium:
 *                 type: boolean
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     webp:
 *                       type: string
 *                     jpg:
 *                       type: string
 *               premiumPhotos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     webp:
 *                       type: string
 *                     jpg:
 *                       type: string
 *               premiumVideos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Персонаж успешно создан
 *       500:
 *         description: Ошибка при создании персонажа
 */
router.post('/', async (req, res) => {
    try {
        const character = await Character.create(req.body);
        res.status(201).json(character);
    } catch (error) {
        console.error('Ошибка при создании персонажа:', error);
        res.status(500).json({ message: 'Ошибка при создании персонажа', error });
    }
});

/**
 * @swagger
 * /characters:
 *   get:
 *     summary: Получение всех персонажей
 *     description: Возвращает список всех персонажей.
 *     tags:
 *       - Characters
 *     responses:
 *       200:
 *         description: Успешный ответ
 *       500:
 *         description: Ошибка при получении персонажей
 */
router.get('/', async (req, res) => {
    try {
        const characters = await Character.findAll();
        res.json(characters);
    } catch (error) {
        console.error('Ошибка при получении персонажей:', error);
        res.status(500).json({ message: 'Ошибка при получении персонажей', error });
    }
});

/**
 * @swagger
 * /characters/{id}:
 *   get:
 *     summary: Получение персонажа по ID
 *     description: Возвращает персонажа по указанному ID.
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ
 *       404:
 *         description: Персонаж не найден
 *       500:
 *         description: Ошибка при получении персонажа
 */
router.get('/:id', async (req, res) => {
    try {
        const character = await Character.findByPk(req.params.id);
        if (!character) {
            return res.status(404).json({ message: 'Персонаж не найден' });
        }
        res.json(character);
    } catch (error) {
        console.error('Ошибка при получении персонажа:', error);
        res.status(500).json({ message: 'Ошибка при получении персонажа', error });
    }
});

/**
 * @swagger
 * /characters/{id}:
 *   put:
 *     summary: Обновление персонажа
 *     description: Обновляет данные персонажа по указанному ID.
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shortDescription:
 *                 type: string
 *               isPremium:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Персонаж успешно обновлен
 *       404:
 *         description: Персонаж не найден
 *       500:
 *         description: Ошибка при обновлении персонажа
 */
router.put('/:id', async (req, res) => {
    try {
        const character = await Character.findByPk(req.params.id);
        if (!character) {
            return res.status(404).json({ message: 'Персонаж не найден' });
        }
        await character.update(req.body);
        res.json(character);
    } catch (error) {
        console.error('Ошибка при обновлении персонажа:', error);
        res.status(500).json({ message: 'Ошибка при обновлении персонажа', error });
    }
});

/**
 * @swagger
 * /characters/{id}:
 *   delete:
 *     summary: Удаление персонажа
 *     description: Удаляет персонажа по указанному ID.
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Персонаж удален
 *       404:
 *         description: Персонаж не найден
 *       500:
 *         description: Ошибка при удалении персонажа
 */
router.delete('/:id', async (req, res) => {
    try {
        const character = await Character.findByPk(req.params.id);
        if (!character) {
            return res.status(404).json({ message: 'Персонаж не найден' });
        }
        await character.destroy();
        res.json({ message: 'Персонаж удален' });
    } catch (error) {
        console.error('Ошибка при удалении персонажа:', error);
        res.status(500).json({ message: 'Ошибка при удалении персонажа', error });
    }
});

module.exports = router;
