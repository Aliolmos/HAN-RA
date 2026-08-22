/**
 * HAN-RA Editorial — Cloud Functions
 * ============================================================
 * Estas funciones existen porque las claves secretas (Access Token
 * de Mercado Pago, token de la API de Andreani) NUNCA deben viajar
 * en el código del navegador: cualquiera podría abrir el código
 * fuente de la web y robarlas. Por eso viven acá, en el servidor.
 *
 * El front-end (script.js) le pega a estas dos direcciones:
 *   POST /cotizarEnvio       -> calcula el costo de envío
 *   POST /crearPreferenceMP  -> crea el link de pago de Mercado Pago
 * ============================================================
 */

const { onRequest } = require('firebase-functions/v2/https');
const axios = require('axios');
const cors = require('cors')({ origin: true });

/* ============================================================
   1) COMPLETÁ ESTOS DATOS ANTES DE DEPLOYAR
   ============================================================ */

// Mercado Pago -> Tu cuenta -> "Tus integraciones" -> credenciales
// de PRODUCCIÓN -> Access Token (empieza con APP_USR-...)
const MP_ACCESS_TOKEN = 'APP_USR-aa6c9501-fd17-4d5c-bbb8-73aca9fa59b9';

// Andreani -> credenciales de tu cuenta empresa/PyME para la API.
// Se piden desde https://pymes.andreani.com o escribiendo a tu
// contacto comercial de Andreani; ellos te dan token + contrato.
const ANDREANI_CLIENT_TOKEN = 'TU_TOKEN_DE_ANDREANI';
const ANDREANI_CONTRATO     = 'TU_NUMERO_DE_CONTRATO';
const ANDREANI_CP_ORIGEN    = '5014';  // CP desde donde salen tus envíos (Córdoba Capital)
const ANDREANI_PESO_KG      = 0.4;     // peso estimado de 1 libro (ajustalo a tu producto real)

// URL real de tu sitio ya publicado (para que Mercado Pago sepa
// a dónde volver después de pagar)
const SITIO_URL = 'https://editorialhan-ra.com';

/* ============================================================
   2) COTIZAR ENVÍO (Andreani)
   ============================================================
   ⚠️ IMPORTANTE: la URL y el formato del body de acá abajo son
   una referencia general. Andreani entrega la documentación
   exacta de su API (endpoint, autenticación y campos) recién
   cuando te dan de alta como cliente/contrato — ajustá esto con
   los datos reales que ellos te pasen. No pude verificar el
   endpoint en vivo porque necesita tus credenciales.
   ============================================================ */
exports.cotizarEnvio = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const { codigoPostal, cantidadLibros } = req.body || {};

            if (!codigoPostal || !/^\d{4}$/.test(codigoPostal)) {
                return res.status(400).json({ error: 'Código postal inválido.' });
            }

            const pesoTotal = ANDREANI_PESO_KG * Math.max(1, cantidadLibros || 1);

            const response = await axios.post(
                'https://apis.andreani.com/v1/tarifas',
                {
                    contrato: ANDREANI_CONTRATO,
                    cpOrigen: ANDREANI_CP_ORIGEN,
                    cpDestino: codigoPostal,
                    peso: pesoTotal,
                    volumen: 0.01,
                    bultos: 1,
                    entrega: 'domicilio'
                },
                {
                    headers: {
                        'x-authorization-token': ANDREANI_CLIENT_TOKEN,
                        'Content-Type': 'application/json'
                    },
                    timeout: 8000
                }
            );

            const costoEnvio =
                response.data?.tarifaTotal ??
                response.data?.total ??
                response.data?.precio;

            if (!costoEnvio) {
                throw new Error('Andreani no devolvió un costo de envío válido.');
            }

            res.json({ costoEnvio: Math.round(costoEnvio) });

        } catch (err) {
            console.error('Error cotizando envío con Andreani:', err.response?.data || err.message);
            res.status(500).json({ error: 'No se pudo cotizar el envío en este momento.' });
        }
    });
});

/* ============================================================
   3) CREAR PREFERENCIA DE PAGO (Mercado Pago Checkout Pro)
   ============================================================ */
exports.crearPreferenceMP = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const { items, shippingCost, buyerEmail, externalReference } = req.body || {};

            if (!Array.isArray(items) || !items.length) {
                return res.status(400).json({ error: 'El carrito está vacío.' });
            }

            const mpItems = items.map(it => ({
                title: it.title,
                quantity: it.qty,
                unit_price: Number(it.price),
                currency_id: 'ARS'
            }));

            if (shippingCost > 0) {
                mpItems.push({
                    title: 'Costo de envío',
                    quantity: 1,
                    unit_price: Number(shippingCost),
                    currency_id: 'ARS'
                });
            }

            const response = await axios.post(
                'https://api.mercadopago.com/checkout/preferences',
                {
                    items: mpItems,
                    payer: { email: buyerEmail },
                    external_reference: externalReference,
                    back_urls: {
                        success: `${SITIO_URL}/?pago=ok`,
                        failure: `${SITIO_URL}/?pago=error`,
                        pending: `${SITIO_URL}/?pago=pendiente`
                    },
                    auto_return: 'approved'
                },
                {
                    headers: {
                        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 8000
                }
            );

            res.json({ init_point: response.data.init_point });

        } catch (err) {
            console.error('Error creando preferencia de Mercado Pago:', err.response?.data || err.message);
            res.status(500).json({ error: 'No se pudo iniciar el pago en este momento.' });
        }
    });
});