---
title: "¿VPN o eSIM para China? Cómo conectarte"
date: 2026-06-04
last_verified: 2026-06-04
lang: es
source_en: guides/vpn-or-esim
source_last_verified: 2026-06-04
verified_against:
  - https://www.airalo.com/china-esim
  - https://esim.holafly.com/esim-china/
  - https://landingin.syncosmic.com/blog/vpn-china-2026-what-actually-works
volatility: high
review:
  status: audited
  page_audit: 2026-06-04
  notes: "New GEO decision-tree page synthesized from audited internet-connectivity.md and sim-card.md plus r/travelchina + r/chinalife research (2026-06). VPN status is high-volatility — recheck before each update."
description: "¿VPN o eSIM para China en 2026? Una eSIM extranjera evita el Gran Cortafuegos sin VPN; una SIM china sí lo necesita. Guía de decisión para viajeros. Actualizado en junio de 2026."
faqs:
  - q: "¿Necesito una VPN o una eSIM para China?"
    a: "Para la mayoría de los viajeros de estancia corta, basta con una eSIM extranjera: enruta los datos a través de una pasarela en el extranjero y evita el Gran Cortafuegos, así que Google, WhatsApp e Instagram funcionan sin VPN. Necesitas una VPN si usas una tarjeta SIM china, dependes del Wi-Fi de un hotel chino o usas un portátil/ordenador que no admite la eSIM."
  - q: "¿Por qué necesitaría una VPN si ya tengo una eSIM?"
    a: "No la necesitas, siempre que te mantengas en los datos móviles de la eSIM extranjera. La confusión surge porque una SIM china y el Wi-Fi chino están detrás del cortafuegos y sí necesitan una VPN, y porque los portátiles (que usan Wi-Fi, no la eSIM) también necesitan una. Muchos viajeros mantienen una VPN instalada únicamente como respaldo para esos casos."
  - q: "¿Por qué mi eSIM extranjera hace que fallen Alipay o WeChat Pay?"
    a: "Algunas eSIM extranjeras (por ejemplo, Holafly) incluyen una VPN siempre activa que no se puede desactivar, y una IP no china a veces activa los controles antifraude de Alipay o WeChat Pay o impide que cargue un miniprograma. Si un pago falla, cambia al Wi-Fi chino o a una SIM china para esa transacción; en una VPN normal, simplemente desactívala mientras pagas."
  - q: "¿Qué VPN siguen funcionando en China en 2026?"
    a: "La fiabilidad es un blanco móvil: los servicios que funcionaban la semana pasada pueden quedar bloqueados de un día para otro, y la ofensiva de 2026 afectó a muchos (LetsVPN quedó prácticamente inutilizable para muchos usuarios). Astrill y ExpressVPN son los que se recomiendan de forma más consistente; los protocolos más nuevos como Xray Reality y Trojan sobreviven mejor que las variantes más antiguas de Shadowsocks. Instala y prueba dos antes de volar."
  - q: "¿Qué hago si mi única VPN deja de funcionar cuando ya estoy en China?"
    a: "Esto es difícil porque los sitios web de los proveedores de VPN y la mayoría de las fichas de las VPN en las tiendas de aplicaciones están bloqueados desde dentro de China. Opciones: cambia a tu VPN de respaldo, usa un enlace de descarga espejo para China que hayas guardado, pide que alguien te envíe el instalador por correo o por WeTransfer, usa una cuenta de App Store de otra región, o espera hasta Hong Kong/Macao (sin cortafuegos) para reinstalar. La solución es la prevención: instala dos VPN y guarda los enlaces espejo antes de llegar."
  - q: "¿Un iPhone admite eSIM en China?"
    a: "Los iPhone comprados fuera de China continental tienen eSIM y funcionan con normalidad con una eSIM extranjera para China. Los modelos de iPhone vendidos en China continental no tienen hardware de eSIM, así que un iPhone comprado en China continental no puede usar una; comprueba tu modelo antes de depender de una eSIM."
category: guide
---

# ¿VPN o eSIM para China? Cómo conectarte

**Respuesta corta:** si solo quieres que Google, WhatsApp, Instagram y Maps funcionen en tu teléfono para un viaje normal, compra una **eSIM extranjera** y **no** necesitas una VPN. Una eSIM extranjera enruta tus datos a través de una pasarela fuera de China continental, así que el Gran Cortafuegos nunca los toca. Solo necesitas una **VPN** si usas una **tarjeta SIM china**, dependes del **Wi-Fi chino** o necesitas sitios bloqueados en un **portátil/ordenador**.

Esto es lo más confuso para quienes visitan por primera vez —"*¿por qué necesitaría una VPN si tengo una eSIM?*"— así que esta página explica exactamente quién necesita qué, y los detalles que nadie te advierte.

> Esta es una guía de decisión. Para listas completas de proveedores y configuración paso a paso, consulta [Acceso a internet y el Gran Cortafuegos](/guides/internet-connectivity/) y la [guía de tarjetas SIM y eSIM](/guides/sim-card/).

## ¿Necesito una VPN o una eSIM para China?

Elige la fila que coincida con tu caso:

| Tu situación | Qué necesitas | Por qué |
|---|---|---|
| Viaje corto, solo teléfono, quieres que funcionen las apps bloqueadas | **eSIM extranjera, sin VPN** | Los datos de la eSIM evitan el cortafuegos por completo |
| Quieres un número de teléfono chino (+86) para apps locales | **SIM china + VPN** | Una SIM china está detrás del cortafuegos, así que necesita una VPN |
| Llevas un portátil y necesitas Google/Gmail en él | **eSIM (compartiendo conexión) o VPN en el portátil** | El portátil usa Wi-Fi, no tu eSIM, salvo que compartas la conexión |
| Estancia larga / residente | **SIM china + 2 VPN** | Necesitarás un número local; las VPN son tu solución para el cortafuegos |
| Solo necesitas apps chinas (Alipay, Amap, WeChat, DiDi) | **Nada especial** | Todas funcionan de forma nativa sin VPN |

**Regla general:** *eSIM = el camino fácil y sin VPN para turistas. VPN = solo cuando estás en una SIM china o en Wi-Fi chino, o en un ordenador.*

## ¿Cómo evita una eSIM extranjera el Gran Cortafuegos sin VPN?

Cuando usas una eSIM extranjera o de Hong Kong (Airalo, Holafly, Ubigi, Nomad), tu teléfono se conecta a una torre china, pero tus **datos se enrutan mediante un túnel de vuelta a la red de origen del proveedor en el extranjero antes de llegar a internet**. Como el tráfico sale fuera de China continental, el filtrado de China —que solo se aplica al tráfico que sale *dentro* del territorio continental— nunca lo ve. Google, WhatsApp, YouTube y todo lo demás simplemente funcionan.

Una **tarjeta SIM china** es lo contrario: sus datos salen dentro de China continental, así que pasan directamente por el cortafuegos y los servicios bloqueados siguen bloqueados salvo que añadas una VPN.

> **Advertencia sobre el iPhone:** los iPhone vendidos en **China continental no tienen hardware de eSIM**, así que un iPhone comprado en China continental no puede usar una eSIM extranjera. Los iPhone comprados en cualquier otro lugar están bien. Compruébalo antes de depender de una eSIM.

## ¿Cuándo sigo necesitando una VPN?

Incluso con una eSIM, una VPN es útil (o necesaria) cuando:

- **Usas una tarjeta SIM china** — necesaria si quieres un número +86 para registrarte en apps y recibir SMS. Una SIM china está detrás del cortafuegos. Dicho esto, la mayoría de los visitantes en realidad no necesitan para nada un [número de teléfono chino](/guides/chinese-phone-number/).
- **Estás en Wi-Fi chino** — el Wi-Fi de hoteles, cafeterías y aeropuertos está detrás del cortafuegos. (Los datos móviles de tu eSIM no lo están, así que a menudo basta con apagar el Wi-Fi.)
- **Estás en un portátil o un ordenador de escritorio** — los ordenadores se conectan por Wi-Fi, no por la eSIM de tu teléfono, así que necesitan o bien una VPN o bien los datos de la eSIM de tu teléfono compartidos por anclaje.
- **Como respaldo** — muchos viajeros mantienen una VPN instalada incluso con una eSIM, por si acaban en un Wi-Fi chino.

## ¿Por qué mi eSIM extranjera hace que fallen Alipay o WeChat Pay?

Esto pilla a la gente por sorpresa: algunas eSIM extranjeras (en especial **Holafly**) incluyen una **VPN siempre activa que no puedes desactivar**. Como tu tráfico parece provenir de fuera de China, a veces puede:

- activar los controles antifraude de **Alipay / WeChat Pay**, de modo que se rechace un pago, o
- impedir que cargue un **miniprograma** (por ejemplo, pedir en Luckin, algunos servicios de bicicletas compartidas).

**Cómo gestionarlo:**

- Si un pago falla con una eSIM de VPN siempre activa, completa ese pago concreto a través de **Wi-Fi chino** o de una **SIM china**.
- En una VPN normal (una app aparte), simplemente **desactiva la VPN** mientras pagas y vuelve a activarla después.
- Por eso también una **configuración doble** (eSIM extranjera para los datos + una SIM china barata para un número y los pagos) es la opción más robusta para viajes largos o con muchos pagos.

Consulta [Pago móvil](/es/guides/mobile-payment/) para conocer el otro gran detalle de los pagos: las tarjetas extranjeras solo pueden pagar códigos QR de **comercios**, no los personales.

## ¿Qué es mejor: eSIM, SIM china o roaming?

| Opción | ¿Evita el cortafuegos? | ¿Da número +86? | Mejor para | Cuidado con |
|---|---|---|---|---|
| **eSIM extranjera** (Airalo, Holafly, Ubigi, Nomad) | ✅ Sí (sin VPN) | ❌ No | La mayoría de los turistas | Las eSIM con VPN siempre activa pueden hacer que falle Alipay; sin número local; los iPhone de China continental no tienen eSIM |
| **SIM china** (China Mobile/Unicom) | ❌ No (necesita VPN) | ✅ Sí | Estancias largas, apps que requieren +86 | Detrás del cortafuegos; se compra con pasaporte |
| **Roaming de tu operador de origen** | ✅ A menudo sí | ❌ No | Escalas cortas, sin configuración | Puede ser caro; la fiabilidad varía |
| **eSIM + SIM china (doble)** | ✅ Sí | ✅ Sí | Viajes largos / con muchos pagos | Cuesta un poco más; se necesita un teléfono con doble SIM |

Para calcular cuántos datos necesitas, el momento de activación y notas marca por marca, consulta la [guía de tarjetas SIM y eSIM](/guides/sim-card/).

## ¿Por qué las VPN que funcionaban la semana pasada dejan de funcionar de repente?

El cortafuegos de China es un **blanco móvil**, no un muro fijo. Usa inspección profunda de paquetes y aprendizaje automático para detectar y bloquear el tráfico de VPN, y se actualiza constantemente, con más dureza en torno a fechas políticamente sensibles.

- **La ofensiva de 2026** afectó a muchos servicios populares; **LetsVPN**, durante mucho tiempo una de las favoritas de la comunidad, quedó prácticamente inutilizable para muchos usuarios.
- Algunos proveedores bloquean cuentas por **uso elevado de ancho de banda** (descargar juegos de Steam, uso intenso de torrents), algo que a menudo se atribuye a un "sistema de IA", así que no dependas de una sola cuenta para un uso intenso.
- **Los protocolos importan:** los protocolos ofuscados más nuevos como **Xray Reality** y **Trojan** sobreviven actualmente mejor que las variantes más antiguas de **Shadowsocks**, que en su mayoría están muertas.
- **Las más fiables en 2026:** **Astrill** (StealthVPN) y **ExpressVPN** (Lightway) son las que se recomiendan de forma más consistente; **las VPN gratuitas tienen una tasa de éxito de ~0%** en China.

**Instala y prueba siempre dos VPN antes de volar**, y mantenlas actualizadas.

## ¿Cómo consigo una VPN si ya estoy en China y la mía dejó de funcionar?

Esto es realmente difícil, porque los propios sitios web de los proveedores de VPN y la mayoría de las fichas de las VPN en las tiendas de aplicaciones están bloqueados desde dentro de China. En orden aproximado:

1. **Cambia a tu VPN de respaldo** (por esto instalas dos).
2. **Usa un enlace espejo para China que hayas guardado** — algunos proveedores (por ejemplo, ExpressVPN) dan a sus suscriptores URLs de descarga especiales para China. Guárdalas en tu app de notas *antes* de viajar.
3. **Pide que alguien te envíe el instalador** — un amigo puede mandártelo por correo (Outlook/Yahoo/iCloud Mail funcionan sin VPN) o compartirlo a través de WeTransfer, que a menudo no está bloqueado.
4. **Usa una cuenta de App Store de otra región** — la App Store de China elimina muchas apps de VPN; la tienda de otra región puede seguir mostrándolas.
5. **Espera hasta Hong Kong, Macao o Taiwán** — el cortafuegos no se aplica ahí, así que puedes descargar y configurar sin problemas, y luego volver.

**La prevención supera a todo esto:** instala dos VPN y guarda sus enlaces espejo antes de salir.

## Recomendación rápida por escenario

- **Viaje turístico de dos semanas, solo teléfono:** eSIM extranjera (Airalo o Holafly). No hace falta VPN. Opcionalmente, una VPN de respaldo para el Wi-Fi chino.
- **Quieres un número chino para cada app local:** SIM china + dos VPN (Astrill + ExpressVPN).
- **Estancia con muchos pagos o de más de un mes:** doble configuración — eSIM extranjera para datos sin cortafuegos + una SIM china barata para un número +86 y pagos fiables.
- **Llevas un portátil para trabajar:** eSIM con anclaje a red (tethering), o una VPN en el portátil; prueba el anclaje antes de irte.

## Véase también

- [Acceso a internet y el Gran Cortafuegos](/guides/internet-connectivity/) — lista completa de bloqueos, tabla de proveedores de VPN, pasos de configuración
- [Tarjetas SIM y eSIM](/guides/sim-card/) — marcas de eSIM, cálculo de datos, activación, opciones de SIM local
- [Pago móvil](/es/guides/mobile-payment/) — configuración de Alipay/WeChat y por qué fallan los pagos
