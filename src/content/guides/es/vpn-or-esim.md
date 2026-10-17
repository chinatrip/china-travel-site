---
title: "¿VPN o eSIM para China? Cómo conectarte"
date: 2026-06-04
last_verified: 2026-10-17
lang: es
source_en: guides/vpn-or-esim
source_last_verified: 2026-10-17
verified_against:
  - https://www.airalo.com/china-esim
  - https://esim.holafly.com/esim-china/
  - https://landingin.syncosmic.com/blog/vpn-china-2026-what-actually-works
volatility: high
review:
  status: audited
  page_audit: 2026-06-04
  notes: "2026-10-17: translation re-checked against the corrected English source and updated where the source changed: iPhone eSIM claim (mainland dual-SIM + eSIM-only iPhone Air with China-carrier-only restriction), eSIM bypass scoped to eSIM data and attributed to providers, LetsVPN April/May-2026 status, Holafly bundled-VPN/payment behaviour hedged (no published Alipay/WeChat IP rule), removed named ExpressVPN mirror URLs and the iCloud Mail/WeTransfer specifics, laptop tethering now notes the Holafly 1 GB/day hotspot cap, free-VPN and protocol overstatements softened. No other sections re-checked."
description: "¿VPN o eSIM para China en 2026? Una eSIM de viaje extranjera puede enrutar los datos fuera del continente sin VPN; una SIM china sí necesita una. Guía de decisión para viajeros. Actualizado en octubre de 2026."
faqs:
  - q: "¿Necesito una VPN o una eSIM para China?"
    a: "Para la mayoría de los viajeros de estancia corta, basta con una eSIM extranjera: enruta los datos a través de una pasarela en el extranjero y evita el Gran Cortafuegos, así que Google, WhatsApp e Instagram funcionan sin VPN. Necesitas una VPN si usas una tarjeta SIM china, dependes del Wi-Fi de un hotel chino o usas un portátil/ordenador que no admite la eSIM."
  - q: "¿Por qué necesitaría una VPN si ya tengo una eSIM?"
    a: "No la necesitas, siempre que te mantengas en los datos móviles de la eSIM extranjera. La confusión surge porque una SIM china y el Wi-Fi chino están detrás del cortafuegos y sí necesitan una VPN, y porque los portátiles usan Wi-Fi en lugar de la eSIM, así que necesitan una VPN o los datos compartidos por anclaje desde tu teléfono. Muchos viajeros mantienen una VPN instalada únicamente como respaldo para esos casos."
  - q: "¿Por qué mi eSIM extranjera hace que fallen Alipay o WeChat Pay?"
    a: "Algunas eSIM extranjeras (por ejemplo, Holafly) incluyen una VPN, así que tu tráfico parece venir de fuera de China. Entonces un pago puede fallar o un miniprograma puede no cargar, pero Alipay y WeChat Pay no publican ninguna norma sobre la discrepancia de IP: trátalo como un patrón de diagnóstico, no como una causa documentada. Si un pago falla, reinténtalo con Wi-Fi chino o una SIM china para esa transacción; en una VPN normal, desactívala mientras pagas."
  - q: "¿Qué VPN siguen funcionando en China en 2026?"
    a: "La fiabilidad es un blanco móvil: los servicios que funcionaban la semana pasada pueden quedar bloqueados de un día para otro. En abril de 2026 LetsVPN suspendió su servicio en China continental; aunque lo reanudó a nivel mundial en mayo, sigue sin poder garantizar disponibilidad en China continental, y otras herramientas también se vieron afectadas. Astrill y ExpressVPN son los que se recomiendan de forma más consistente; los protocolos ofuscados más nuevos (Xray Reality, Trojan) sobreviven mejor que las variantes más antiguas de Shadowsocks. Instala y prueba dos antes de volar."
  - q: "¿Qué hago si mi única VPN deja de funcionar cuando ya estoy en China?"
    a: "Esto es difícil porque los sitios web de los proveedores de VPN y la mayoría de las fichas de las VPN en las tiendas de aplicaciones están bloqueados desde dentro de China. Opciones: cambia a tu VPN de respaldo, usa un enlace espejo para China que hayas guardado, pide que alguien te envíe el instalador a una dirección que puedas abrir sin VPN (por ejemplo Outlook o Yahoo), usa una cuenta de App Store de otra región, o espera hasta Hong Kong/Macao (sin cortafuegos) para reinstalar. La solución es la prevención: instala dos VPN y guarda los enlaces espejo antes de llegar."
  - q: "¿Un iPhone admite eSIM en China?"
    a: "La mayoría de los iPhone comprados fuera de China continental admiten eSIM y funcionan con una eSIM extranjera para China. Los modelos vendidos en China continental suelen ser de doble SIM física sin eSIM; la excepción es el iPhone Air, vendido en China continental desde octubre de 2025, pero una unidad china solo puede instalar eSIM de operadores chinos dentro del continente, así que una eSIM de viaje extranjera no se instalará allí. Comprueba tu modelo exacto antes de depender de una eSIM."
category: guide
---

# ¿VPN o eSIM para China? Cómo conectarte

**Respuesta corta:** si solo quieres que Google, WhatsApp, Instagram y Maps funcionen en tu teléfono para un viaje normal, compra una **eSIM de viaje extranjera** y normalmente **no** necesitas una VPN. Estas eSIM enrutan los datos a través de pasarelas fuera de China continental, así que el Gran Cortafuegos no se aplica a esos datos: es la descripción que dan los proveedores, y se aplica solo a los datos de la eSIM. Solo necesitas una **VPN** si usas una **tarjeta SIM china**, dependes del **Wi-Fi chino** o necesitas sitios bloqueados en un **portátil/ordenador**. Ojo: no todas las "eSIM para China" evitan el cortafuegos; algunas eSIM turísticas de China Unicom enrutan el tráfico dentro del país, así que comprueba el enrutamiento antes de comprar.

Esto es lo más confuso para quienes visitan por primera vez —"*¿por qué necesitaría una VPN si tengo una eSIM?*"— así que esta página explica exactamente quién necesita qué, y los detalles que nadie te advierte.

> Esta es una guía de decisión. Para listas completas de proveedores y configuración paso a paso, consulta [Acceso a internet y el Gran Cortafuegos](/guides/internet-connectivity/) y la [guía de tarjetas SIM y eSIM](/guides/sim-card/).

## ¿Necesito una VPN o una eSIM para China?

Elige la fila que coincida con tu caso:

| Tu situación | Qué necesitas | Por qué |
|---|---|---|
| Viaje corto, solo teléfono, quieres que funcionen las apps bloqueadas | **eSIM extranjera, sin VPN** | Los datos de una eSIM de viaje extranjera se enrutan fuera del continente |
| Quieres un número de teléfono chino (+86) para apps locales | **SIM china + VPN** | Una SIM china está detrás del cortafuegos, así que necesita una VPN |
| Llevas un portátil y necesitas Google/Gmail en él | **eSIM (compartiendo conexión) o VPN en el portátil** | El portátil usa Wi-Fi, no tu eSIM, salvo que compartas la conexión |
| Estancia larga / residente | **SIM china + 2 VPN** | Necesitarás un número local; las VPN son tu solución para el cortafuegos |
| Solo necesitas apps chinas (Alipay, Amap, WeChat, DiDi) | **Nada especial** | Todas funcionan de forma nativa sin VPN |

**Regla general:** *eSIM = el camino fácil y sin VPN para turistas. VPN = solo cuando estás en una SIM china o en Wi-Fi chino, o en un ordenador.*

## ¿Cómo evita una eSIM extranjera el Gran Cortafuegos sin VPN?

Cuando usas una eSIM de viaje extranjera (Airalo, Holafly, Ubigi, Nomad), tu teléfono se conecta a una torre china, pero el proveedor enruta tus **datos a través de su propia red en el extranjero antes de llegar a internet**. Como el tráfico sale fuera de China continental, el filtrado de China —que solo se aplica al tráfico que sale *dentro* del territorio continental— no se aplica a esos datos. Es la descripción que dan los proveedores, no una auditoría independiente del enrutamiento; los puntos de salida varían según proveedor y plan, y algunas "eSIM para China" (por ejemplo, eSIM turísticas de China Unicom) enrutan dentro del país y no evitan nada. En las que sí enrutan fuera, Google, WhatsApp y YouTube suelen funcionar.

Una **tarjeta SIM china** es lo contrario: sus datos salen dentro de China continental, así que pasan directamente por el cortafuegos y los servicios bloqueados siguen bloqueados salvo que añadas una VPN.

> **Advertencia sobre el iPhone:** la mayoría de los modelos de iPhone comprados **en China continental** son de doble SIM física sin eSIM, así que no pueden usar una eSIM extranjera. La excepción es el **iPhone Air**, vendido en China continental desde octubre de 2025 — pero una unidad china solo puede instalar eSIM de operadores chinos mientras estás en el continente, así que una eSIM de viaje extranjera no se instalará allí. La mayoría de los iPhone comprados fuera de China continental admiten eSIM; verifica tu modelo exacto.

## ¿Cuándo sigo necesitando una VPN?

Incluso con una eSIM, una VPN es útil (o necesaria) cuando:

- **Usas una tarjeta SIM china** — necesaria si quieres un número +86 para registrarte en apps y recibir SMS. Una SIM china está detrás del cortafuegos. Dicho esto, la mayoría de los visitantes en realidad no necesitan para nada un [número de teléfono chino](/guides/chinese-phone-number/).
- **Estás en Wi-Fi chino** — el Wi-Fi de hoteles, cafeterías y aeropuertos está detrás del cortafuegos. (Los datos móviles de tu eSIM no lo están, así que a menudo basta con apagar el Wi-Fi.)
- **Estás en un portátil o un ordenador de escritorio** — los ordenadores se conectan por Wi-Fi, no por la eSIM de tu teléfono, así que necesitan o bien una VPN o bien los datos de la eSIM de tu teléfono compartidos por anclaje.
- **Como respaldo** — muchos viajeros mantienen una VPN instalada incluso con una eSIM, por si acaban en un Wi-Fi chino.

## ¿Por qué mi eSIM extranjera hace que fallen Alipay o WeChat Pay?

Esta situación pilla a la gente por sorpresa: algunas eSIM extranjeras (en especial **Holafly**) incluyen una VPN, así que tu tráfico parece venir de fuera de China. **No hay ninguna norma publicada de Alipay/WeChat** sobre la discrepancia de IP —es un patrón de diagnóstico, no una causa documentada— pero a veces un pago puede fallar o un **miniprograma** puede no cargar mientras usas ese tipo de eSIM.

**Cómo gestionarlo:**

- Si un pago falla con una eSIM que incluye VPN, completa ese pago concreto a través de **Wi-Fi chino** o de una **SIM china**.
- En una VPN normal (una app aparte), simplemente **desactiva la VPN** mientras pagas y vuelve a activarla después.
- Por eso también una **configuración doble** (eSIM extranjera para los datos + una SIM china barata para un número y los pagos) es la opción más robusta para viajes largos o con muchos pagos.

Consulta [Pago móvil](/es/guides/mobile-payment/) para conocer el otro gran detalle de los pagos: algunos códigos QR personales no aceptan pagos con tarjeta extranjera, mientras que los de comercio suelen aceptarlos.

## ¿Qué es mejor: eSIM, SIM china o roaming?

| Opción | ¿Evita el cortafuegos? | ¿Da número +86? | Mejor para | Cuidado con |
|---|---|---|---|---|
| **eSIM extranjera** (Airalo, Holafly, Ubigi, Nomad) | ✅ Normalmente (sin VPN) | ❌ No | La mayoría de los turistas | Algunas incluyen VPN, lo que puede afectar a los pagos; sin número local; la mayoría de los iPhone de China continental no tienen eSIM |
| **SIM china** (China Mobile/Unicom) | ❌ No (necesita VPN) | ✅ Sí | Estancias largas, apps que requieren +86 | Detrás del cortafuegos; se compra con pasaporte |
| **Roaming de tu operador de origen** | ✅ A menudo sí | ❌ No | Escalas cortas, sin configuración | Puede ser caro; la fiabilidad varía |
| **eSIM + SIM china (doble)** | ✅ Sí | ✅ Sí | Viajes largos / con muchos pagos | Cuesta un poco más; se necesita un teléfono con doble SIM |

Para calcular cuántos datos necesitas, el momento de activación y notas marca por marca, consulta la [guía de tarjetas SIM y eSIM](/guides/sim-card/).

## ¿Por qué las VPN que funcionaban la semana pasada dejan de funcionar de repente?

El cortafuegos de China es un **blanco móvil**, no un muro fijo. Usa inspección profunda de paquetes para detectar y bloquear el tráfico de VPN, y se actualiza constantemente, con más dureza en torno a fechas políticamente sensibles.

- **Abril de 2026:** **LetsVPN** suspendió su servicio en China continental; lo reanudó a nivel mundial en mayo de 2026 pero sigue sin poder garantizar disponibilidad en China continental, y otras herramientas también se vieron afectadas ese mes.
- Algunos proveedores suspenden cuentas por **uso elevado de ancho de banda**, según informes de usuarios, así que no dependas de una sola cuenta para un uso intenso.
- **Los protocolos importan:** los protocolos ofuscados más nuevos como **Xray Reality** y **Trojan** sobreviven actualmente mejor que las variantes más antiguas de **Shadowsocks**, que son menos fiables.
- **Las más fiables en 2026:** **Astrill** (StealthVPN) y **ExpressVPN** (Lightway) son las que se recomiendan de forma más consistente; **las VPN gratuitas rara vez funcionan** en China.

**Instala y prueba siempre dos VPN antes de volar**, y mantenlas actualizadas.

## ¿Cómo consigo una VPN si ya estoy en China y la mía dejó de funcionar?

Esto es realmente difícil, porque los propios sitios web de los proveedores de VPN y la mayoría de las fichas de las VPN en las tiendas de aplicaciones están bloqueados desde dentro de China. En orden aproximado:

1. **Cambia a tu VPN de respaldo** (por esto instalas dos).
2. **Usa un enlace espejo para China que hayas guardado** — algunos proveedores publican URLs de descarga espejo para China en sus páginas de soporte. Guárdalas en tu app de notas *antes* de viajar.
3. **Pide que alguien te envíe el instalador** — un amigo puede mandártelo a una dirección que puedas abrir sin VPN (por ejemplo, Outlook o Yahoo), o usar un servicio de transferencia de archivos al que puedas acceder.
4. **Usa una cuenta de App Store de otra región** — la App Store de China elimina muchas apps de VPN; la tienda de otra región puede seguir mostrándolas.
5. **Espera hasta Hong Kong, Macao o Taiwán** — el cortafuegos no se aplica ahí, así que puedes descargar y configurar sin problemas, y luego volver.

**La prevención supera a todo esto:** instala dos VPN y guarda sus enlaces espejo antes de salir.

## Recomendación rápida por escenario

- **Viaje turístico de dos semanas, solo teléfono:** eSIM extranjera (Airalo o Holafly). No hace falta VPN. Opcionalmente, una VPN de respaldo para el Wi-Fi chino.
- **Quieres un número chino para cada app local:** SIM china + dos VPN (Astrill + ExpressVPN).
- **Estancia con muchos pagos o de más de un mes:** doble configuración — eSIM extranjera para datos sin cortafuegos + una SIM china barata para un número +86 y pagos fiables.
- **Llevas un portátil para trabajar:** eSIM con anclaje a red (tethering), o una VPN en el portátil; prueba el anclaje antes de irte y revisa el límite de zona Wi-Fi: Holafly, por ejemplo, limita el anclaje a 1 GB al día.

## Véase también

- [Acceso a internet y el Gran Cortafuegos](/guides/internet-connectivity/) — lista completa de bloqueos, tabla de proveedores de VPN, pasos de configuración
- [Tarjetas SIM y eSIM](/guides/sim-card/) — marcas de eSIM, cálculo de datos, activación, opciones de SIM local
- [Pago móvil](/es/guides/mobile-payment/) — configuración de Alipay/WeChat y por qué fallan los pagos
