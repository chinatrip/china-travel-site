---
title: "Pagos fallidos en China: soluciones para extranjeros (2026)"
date: 2026-06-15
last_verified: 2026-06-15
lang: es
source_en: guides/payment-failures
source_last_verified: 2026-06-15
verified_against:
  - https://english.www.gov.cn/news/202404/11/content_WS6617c858c6d0868f4e8e5f4d.html
  - https://english.beijing.gov.cn/specials/paymentservices/news/202505/t20250528_4100629.html
  - https://wise.com/sg/blog/link-wise-card-alipay-wechat-china
  - https://m.unionpayintl.com/ZT/en/NHCAPP/
  - https://www.unionpayintl.com/cn/mediaCenter/newsCenter/companyNews/3016318.shtml
  - https://www.chinavigators.com/wechat-pay-foreigners-guide/
  - https://wise.com/us/blog/alipay-limit
  - https://wise.com/en-cn/blog/alipay-fee-international-cards
  - https://www.chinasurvival.com/en/blog/why-wechat-and-alipay-fail-with-foreign-numbers-and-how-to-fix-it
volatility: high
review:
  status: audited
  page_audit: 2026-06-12
  citation_check: 2026-06-15
  notes: "Adopted into the wiki from the site GEO page (issue #18): site-route links converted to [[wiki/...]], and the full failure table consolidated here from mobile-payment.md (issue #22 item 3). Fix iteration 1 (2026-06-15): the 9 NOT_FOUND claims from the first Type-3 run were each resolved — merchant/personal-QR + P2P (receive-only), VPN-trips-fraud, unverified-account limits, 3%-on-full-amount, SMS-blocked, bank-blocks-binding, and balance-no-surcharge are now sourced to chinavigators / Wise / China Survival Kit (added to verified_against); the multi-week refund window, the platform-risk-control silent block, the redirect-filter, the checkout-unselectable card, and the WeChat contact-vouching framing are degraded in text to 'traveler-reported, not independently verified' (Shuimu BBS, outside verified_against). Re-run Type-3 (2026-06-15): 16 supported / 0 contradicted / 6 NOT_FOUND, where all 6 NOT_FOUND are the explicitly traveler-reported items (silent risk-control block, 3-D Secure binding step, checkout-unselectable card, redirect filter, WeChat contact-vouching, multi-week refund). Fees/limits are high-volatility — recheck against mobile-payment.md before update."
description: >-
  Por qué falla Alipay o WeChat Pay en China: QR personal, VPN encendida,
  recargo del 3% desde ¥200 o cuenta sin verificar, y cómo resolverlo. Junio
  de 2026.
faqs:
  - q: ¿Por qué mi pago con Alipay o WeChat Pay sigue fallando en China?
    a: >-
      Las cuatro causas comunes son: pagar al código QR personal de un vendedor
      (las billeteras con tarjeta extranjera solo pueden pagar a códigos de
      comercio), una VPN encendida, que el emisor rechace el recargo del 3% en
      pagos de ¥200 o más, o una cuenta no verificada que alcanza un límite bajo.
      Configura ambas apps, completa la verificación de pasaporte y lleva ¥200-500
      en efectivo como respaldo.
  - q: ¿Por qué no puedo pagar a un vendedor pequeño o devolverle el dinero a un amigo?
    a: >-
      Las cuentas de Alipay/WeChat vinculadas a una tarjeta extranjera pueden
      pagar a códigos QR de comercio, pero no pueden enviar dinero a un código de
      cobro personal ni hacer transferencias P2P: eso requiere una tarjeta
      bancaria china. Si un vendedor pequeño usa un código personal, paga con la
      otra app, pregunta si tiene un código de comercio o usa efectivo.
  - q: ¿Por qué falla mi pago cuando mi VPN está encendida?
    a: >-
      Una IP no china procedente de una VPN puede activar los controles de fraude
      de Alipay/WeChat y provocar el rechazo de un pago. Desactiva la VPN para
      pagar y vuelve a activarla después. En una eSIM extranjera con una VPN
      siempre activa que no puedes desactivar, paga a través del Wi-Fi chino o
      una SIM china para esa transacción.
  - q: ¿Por qué se rechazan los pagos de ¥200 o más?
    a: >-
      Los pagos de ¥200 o más llevan un recargo del 3% por tarjeta extranjera
      sobre el importe total, y algunos emisores lo rechazan. Pide al comercio que
      divida la cuenta en importes inferiores a ¥200 (que no tienen recargo) o
      cambia a la otra app.
  - q: 'Mi tarjeta funcionaba bien y de repente dejó de hacerlo, ¿qué pasó?'
    a: >-
      El control de riesgo de la plataforma o un límite de gasto regulatorio
      pueden bloquear una tarjeta sin previo aviso. Prueba la otra app, desvincula
      y vuelve a vincular la tarjeta, completa la verificación de pasaporte si no
      lo has hecho o recurre al efectivo. Con Alipay y WeChat Pay configurados,
      casi todos los comercios aceptan al menos uno.
category: guide
---

# ¿Por qué falló mi pago en China? Solución de problemas para extranjeros

**Respuesta corta:** cuatro causas explican la mayoría de los fallos cotidianos de pago con tarjeta extranjera en China —

1. estás pagando a un código QR **personal**, no a uno de **comercio**,
2. tu **VPN está encendida**,
3. el pago es de **¥200 o más** y tu banco rechazó el recargo del 3%, o
4. tu cuenta está **sin verificar** y alcanzó un límite bajo.

Configura **ambas** apps, Alipay y WeChat Pay, completa la **verificación de pasaporte** y lleva **¥200-500 en efectivo** — entre las dos apps y el efectivo, quedas cubierto en casi todas las situaciones de pago que encontrará un visitante. La tabla de síntomas de abajo también cubre los fallos en la etapa de configuración y los casos excepcionales. Para el detalle completo de configuración y comisiones, consulta [[wiki/concepts/mobile-payment.md]].

## ¿Por qué falla mi pago con Alipay o WeChat Pay?

Busca tu síntoma:

| Síntoma | Causa probable | Solución |
|---|---|---|
| El QR de un vendedor pequeño no acepta el pago | Es un código de cobro **personal**; las tarjetas extranjeras no pueden pagarlo (chinavigators marca "Split bills with friends" y "P2P transfers to contacts" como ✗ para las tarjetas extranjeras — "receiving only possible") | Prueba la otra app (puede que allí el vendedor tenga un código de comercio), pide un código de comercio o paga en efectivo |
| Pago rechazado estando conectado | La **VPN está encendida** y activó los controles de fraude ("An active VPN causes geographic IP mismatches that trigger fraud detection" — chinavigators) | Desactiva la VPN para pagar y vuelve a activarla después |
| Falla solo en importes **≥ ¥200** | El emisor rechazó el **recargo del 3%** | Pide dividir la cuenta en importes inferiores a ¥200, o cambia de app |
| Límite alcanzado enseguida / bloqueado pronto | Cuenta **sin verificación de pasaporte** (las cuentas extranjeras no verificadas tienen un tope de ~$500/transacción y ~$2,000/año; la verificación lo eleva — Wise) | Completa la verificación de identidad dentro de la app |
| La tarjeta funcionaba y luego dejó de hacerlo | Se alcanzó el **control de riesgo / límite de gasto**, sin aviso (reportado por viajeros, no verificado de forma independiente — Shuimu BBS 2026-05-11) | Vuelve a vincular la tarjeta, cambia de app o usa efectivo |
| Vinculación de la tarjeta rechazada en la configuración | Tu **banco de origen la bloquea** como fraude en el extranjero ("your home bank might block it as overseas fraud" — China Survival Kit); a veces interviene un paso de aprobación 3-D Secure (reportado por viajeros, no verificado de forma independiente) | Llama a tu banco; avísale primero de tu viaje a China |
| El código de verificación por SMS nunca llega | Tu operador marca los servidores de SMS chinos como spam y bloquea el mensaje ("the SMS black hole" — China Survival Kit) | Reenvíalo; si persiste, regístrate con un operador extranjero antes de llegar |
| La tarjeta se vincula pero no se puede seleccionar al pagar | El control de riesgo de Alipay/WeChat bloquea la tarjeta en silencio para ese comercio o tipo de transacción; sin mensaje de error (reportado por viajeros, no verificado de forma independiente — Shuimu BBS 2026-05-11) | Prueba la otra app; recurre al pago con tarjeta en el terminal de pago o al efectivo |
| Una app de terceros redirige a Alipay/WeChat pero solo aparecen tarjetas nacionales | El flujo de redirección pasa por un filtro que excluye las tarjetas extranjeras, incluso si ya hay una vinculada a la billetera (reportado por viajeros, no verificado de forma independiente — Shuimu BBS 2026-05-11) | Abre Alipay/WeChat directamente y completa el pago desde allí |
| Registro de WeChat atascado en "pide a un amigo que escanee" | Un paso de aval por un contacto, que según se informa se activa a menudo en los registros con número extranjero (reportado por viajeros, no verificado de forma independiente) | Busca un contacto que cumpla los requisitos antes de llegar; según se informa, el servicio de atención al cliente de WeChat dentro de la app puede desbloquearlo, aunque puede tardar varios días (reportado por viajeros) — consulta [[wiki/concepts/mobile-payment.md]] para las condiciones del aval |
| El reembolso no ha llegado | Los reembolsos transfronterizos deben pasar por la conversión de divisa y los controles de cumplimiento, por lo que pueden tardar (un plazo concreto de varias semanas es reportado por viajeros, no verificado de forma independiente) | Reclama primero al comercio, en segundo lugar a la app y en tercer lugar al emisor de la tarjeta |

## ¿Por qué no puedo pagar a un vendedor pequeño o devolverle el dinero a un amigo?

Este es el fallo del que nadie te advierte. Una cuenta de Alipay o WeChat vinculada a una tarjeta extranjera puede pagar a códigos QR de **comercio**, pero **no puede enviar dinero a un código de cobro personal ni hacer transferencias entre personas** — eso requiere una **tarjeta bancaria china** vinculada. (chinavigators marca "Split bills with friends", "Send red packets" y "P2P transfers to contacts" como no disponibles para las cuentas con tarjeta extranjera — "receiving only possible".)

Así que cuando un puesto callejero, un restaurante diminuto o un particular muestra un QR de cobro **personal**, tu pago con tarjeta extranjera es rechazado aunque la app funcione bien en otros lugares.

**Soluciones:**

- Prueba la **otra app** — puede que el vendedor tenga tanto una opción personal como una de comercio.
- Pregunta si tiene un **código de comercio** (商家码) en lugar de uno personal.
- Paga en **efectivo**.
- Si le estás devolviendo dinero a una persona, haz que sea *ella* quien pague directamente al comercio y ajusten cuentas después, o usa efectivo — puedes *recibir* RMB de un amigo chino, pero una cuenta con tarjeta extranjera no puede *enviarlo*. Consulta [[wiki/concepts/mobile-payment.md#receiving-rmb-from-friends-both-apps]].

## ¿Por qué falla mi pago cuando la VPN está encendida?

Una VPN hace que tu tráfico parezca provenir de fuera de China, lo que puede activar la detección de fraude de Alipay/WeChat y rechazar un pago sin avisar. Como lo expresa chinavigators, "an active VPN causes geographic IP mismatches that trigger fraud detection".

- **Desactiva la VPN** para completar el pago y vuelve a activarla después.
- En un **eSIM extranjero con una VPN siempre activa** (por ejemplo, Holafly) que no puedes desactivar, haz ese pago concreto a través de una **Wi-Fi china** o una **SIM china**. Consulta [[wiki/concepts/internet-connectivity.md]].

## ¿Por qué se rechazan los pagos de ¥200 o más?

Los pagos **inferiores a ¥200 no tienen comisión**, pero a partir de **¥200 o más** Alipay y WeChat añaden un **recargo del 3% por tarjeta extranjera sobre el importe total pagado con la tarjeta** (el umbral de ¥200 y la tasa del 3% están confirmados por el aviso municipal de servicios de pago de Beijing, mayo de 2025; que la comisión se cobra sobre el importe total de la tarjeta —no solo sobre la parte por encima de ¥200— lo indica Wise: "handling fee is only charged on the amount paid by credit card") — y algunos emisores de tarjetas rechazan el importe con recargo.

- **Pide al comercio que divida la cuenta** en importes inferiores a ¥200 cada uno — están acostumbrados y evita el recargo por completo.
- O cambia a la **otra app**, o paga una parte en efectivo.
- Una tarjeta con **0% de comisión por transacción en el extranjero** evita la parte del emisor, pero el 3% de la plataforma sigue aplicándose a partir de ¥200.
- Si un amigo chino puede enviarte RMB, **los pagos con el saldo de la billetera no llevan el recargo por tarjeta extranjera** — Wise señala que la comisión del 3% se cobra "only charged on the amount paid by credit card", mientras que gastar desde el saldo de la cuenta de Alipay "not calculated for handling fees" (véase la alternativa n.º 4 más abajo).

## Mi tarjeta funcionaba y de repente dejó de hacerlo, ¿por qué?

Los viajeros informan de que el control de riesgo de Alipay/WeChat o un tope de gasto regulatorio pueden bloquear una tarjeta que antes funcionaba **sin ningún aviso ni mensaje de error** (no verificado de forma independiente).

- Cambia a la **otra app** (si Alipay falla, WeChat normalmente funciona, y viceversa).
- **Desvincula y vuelve a vincular** la tarjeta.
- Asegúrate de que tu **verificación de identidad con pasaporte** esté completa — Wise informa de que las cuentas extranjeras no verificadas tienen un tope bajo (~$500 por transacción / ~$2,000 al año) y de que la verificación "may be able to increase your limit to 5,000 USD per transaction or 50,000 USD per year".
- Recurre al **efectivo** o, en los establecimientos cubiertos (hoteles de 3 estrellas o más, atracciones 4A/5A, complejos turísticos nacionales/provinciales), a un **pago con tarjeta extranjera en el terminal de pago**.

## ¿Cuál es mi alternativa cuando nada funciona?

En orden aproximado:

1. **La otra billetera** — Alipay ↔ WeChat Pay; con ambas configuradas, casi todos los comercios aceptan al menos una de ellas.
2. **Efectivo** — lleva ¥200-500 en billetes pequeños; imprescindible en ciudades de segundo y tercer nivel, taxis y puestos callejeros.
3. **Pago con tarjeta extranjera en el terminal de pago** — según la circular de abril de 2024 liderada por el PBOC, todos los hoteles turísticos de 3 estrellas o más, las atracciones turísticas nacionales 4A/5A y los complejos turísticos nacionales/provinciales deben aceptar tarjetas bancarias extranjeras en el terminal de pago (fuente: english.www.gov.cn, abril de 2024); pide hablar con el encargado si un establecimiento cubierto se niega.
4. **Recibir de un local** — un amigo chino puede enviar RMB a tu saldo de la billetera (chinavigators confirma que recibir es posible para las cuentas con tarjeta extranjera, aunque enviar no lo sea); el saldo se gasta directamente como RMB, y el recargo por tarjeta extranjera no se le aplica (Wise: la comisión del 3% se cobra "only charged on the amount paid by credit card", no sobre el saldo de la cuenta de Alipay).
5. **UnionPay "Nihao China"** — la app oficial de UnionPay para visitantes extranjeros (lanzada el 19 de diciembre de 2025; admite la recarga desde tarjetas internacionales Visa/Mastercard/UnionPay — fuente: UnionPay International, consultado el 2026-06-12); trátala como respaldo, no como opción principal.

## Véase también

- [[wiki/concepts/mobile-payment.md]] — configuración completa de Alipay/WeChat, comisiones, límites
- [[wiki/concepts/foreign-exchange.md]] — cajeros automáticos, límites de efectivo, dónde funcionan las tarjetas
- [[wiki/concepts/internet-connectivity.md]] — por qué una VPN puede romper los pagos, opciones de eSIM
