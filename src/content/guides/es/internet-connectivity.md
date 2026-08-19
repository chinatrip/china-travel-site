---
title: "Acceso a internet y el Gran Cortafuegos para visitantes extranjeros"
date: 2026-07-01
last_verified: 2026-07-20
lang: es
source_en: guides/internet-connectivity
source_last_verified: 2026-07-20
verified_against:
  - https://chinasurvivalkit.com/blog/china-firewall-test-websites-apps-guide
  - https://nordvpn.com/blog/vpn-for-china/
  - https://landingin.syncosmic.com/blog/vpn-china-2026-what-actually-works
  - https://www.airalo.com/china-esim
  - https://www.airalo.com/help/using-managing-esims/ZSEEHBT5HW6F/stay-connected-in-china-your-guide-to-unfiltered-internet-access-is-a-vpn-required/ZDZBNIKI4TFP
volatility: high
review:
  status: audited
  page_audit: 2026-06-15
  citation_check: 2026-07-01
  notes: "2026-07-20: Added a reader-facing 'Can I access Google/Gmail/WhatsApp from my hotel in China?' section per traveler feedback. Its one non-generic claim — that some international-chain hotels (e.g. Holiday Inn, per one business traveler's report) have had room Wi-Fi reaching international services without a VPN — is explicitly framed as an unverified individual anecdote (not a guarantee, varies by property, changes over time); no hotel is presented as a reliable or endorsed option, and readers are steered to ask the hotel directly and to bring their own eSIM/VPN. No new external source added (the anecdote is traveler feedback, deliberately NOT asserted as verified fact); other sections not re-verified this round; page_audit unchanged. --- 2026-07-01: added cross-link to /guides/chinese-phone-number/; re-verified — drift-scan 2026-W27 confirmed no Tier-1 drift, key sources spot-checked. Caveat: verified_against source nordvpn.com/blog/vpn-for-china/ returned HTTP 403 this pass and was NOT re-confirmed; the page's headline claim (foreign eSIM bypasses the GFW without a VPN) is supported by the Airalo primary source + the State Dept citation + drift-scan 2026-W27 no-drift, so the date bump holds, but the NordVPN article itself was not re-checked this round."
description: >-
  Qué bloquea el Gran Cortafuegos (Google, WhatsApp, Instagram), qué VPN
  funcionan tras la ofensiva de 2026 y por qué una eSIM extranjera lo evita
  sin VPN.
faqs:
  - q: "¿Necesito una VPN para acceder a Google, WhatsApp e Instagram en China?"
    a: "Solo si te conectas a través de una SIM china o del Wi-Fi local. Una eSIM extranjera (Airalo, Holafly, Nomad) enruta tus datos mediante itinerancia internacional a través de pasarelas fuera de China continental, así que evita el Gran Cortafuegos y los servicios bloqueados funcionan sin VPN. Con una SIM china o el Wi-Fi local sí necesitas una VPN que funcione."
  - q: "¿Qué VPN siguen funcionando en China en 2026?"
    a: "A junio de 2026, Astrill (StealthVPN) y ExpressVPN (Lightway) son las que más consistentemente se reporta que funcionan. Aun así, la fiabilidad de las VPN es un blanco móvil: un servicio que funciona una semana puede quedar bloqueado a la siguiente, la ofensiva de 2026 afectó a muchos, y los proveedores que dependen solo de protocolos estándar sin ofuscación basada en TLS (WireGuard puro, OpenVPN, IKEv2) fallan cada vez más. Instala y prueba dos VPN antes de volar."
  - q: "¿Puedo descargar una VPN cuando ya estoy en China?"
    a: "Es muy difícil: las tiendas de aplicaciones y los sitios web de las VPN están en gran medida bloqueados desde dentro de China. Descarga y prueba tu VPN antes de llegar. Si tu única VPN deja de funcionar, algunas opciones son una cuenta de App Store de otra región o pedir que alguien te envíe el archivo de instalación."
  - q: "¿Es legal que los turistas usen una VPN en China?"
    a: "Oficialmente está restringido, no es libremente legal: el Departamento de Estado de EE. UU. (2026) advierte de que el uso de una VPN es ilegal en la mayoría de los casos y podría acarrear la confiscación del dispositivo, una multa o la detención, y China exige que las VPN cuenten con licencia del gobierno. En la práctica, la aplicación de la ley se ha dirigido a los proveedores y distribuidores, más que a los turistas concretos que usan una VPN para su comunicación personal, y la seguridad del aeropuerto no revisa los dispositivos; pero valora tú mismo el riesgo y consulta el aviso oficial de viaje de tu país."
category: guide
---

# Acceso a internet y el Gran Cortafuegos para visitantes extranjeros

El internet de China está filtrado por el **Gran Cortafuegos (GFW, 防火长城)**, un sistema de alcance nacional que bloquea miles de sitios web y apps extranjeros. Toda conexión a internet dentro de China continental —el Wi-Fi de los hoteles, los datos de una SIM local— pasa por él, **salvo que uses una eSIM extranjera** (véase la sección de la eSIM extranjera más abajo). Esta página cubre qué está bloqueado, qué funciona de forma nativa y cómo prepararte.

## ¿Qué está bloqueado en China?

| Categoría | Servicios bloqueados |
|---|---|
| Búsqueda | Google, DuckDuckGo; Bing (intermitente) |
| Correo | Gmail (app y web) |
| Mensajería | WhatsApp, Telegram, Signal, Discord, Slack, Line |
| Redes sociales | Facebook, Instagram, Twitter/X, Reddit, Snapchat, Pinterest, TikTok internacional |
| Vídeo | YouTube, Netflix, Twitch, Vimeo |
| Noticias | BBC, CNN, NYT, Reuters, Bloomberg, The Guardian y la mayoría de los grandes medios extranjeros |
| Nube / productividad | Google Drive, Docs, Sheets, Meet; Dropbox; Notion; Medium |
| Navegación | Google Maps, Google Translate (web y app) |
| Infraestructura de VPN | Sitios web de proveedores de VPN, la mayoría de las fichas de VPN en las tiendas de aplicaciones |

En 2026, el GFW bloquea miles de dominios y servicios (fuente: chinasurvivalkit.com). La lista cambia: de vez en cuando algunos servicios se bloquean o se desbloquean sin aviso.

## ¿Qué funciona en China sin VPN?

| Categoría | Servicios que funcionan |
|---|---|
| Correo | Outlook / Hotmail, Yahoo Mail, Apple iCloud Mail |
| Mensajería | **WeChat** (dominante: configúralo antes de llegar), iMessage entre dispositivos Apple mediante el número de teléfono (requiere iMessage activado y datos móviles o Wi-Fi) |
| Navegación | **Amap / Gaode (高德地图)** ✅ recomendado; Baidu Maps; Apple Maps |
| Traducción | Baidu Translate, DeepL, Microsoft Translator, traducción integrada de WeChat |
| Pago | Alipay, WeChat Pay, la mayoría de las apps bancarias internacionales |
| Vídeo | Bilibili, iQiyi, Youku, Tencent Video (contenido chino) |
| Búsqueda | Baidu (resultados en chino) |

**Nota sobre el Wi-Fi público:** la mayor parte del Wi-Fi público gratuito en China (aeropuertos, centros comerciales, estaciones de metro) requiere autenticación por SMS a un número de móvil chino para conectarse. Sin una SIM local puede que no puedas usarlo. Una eSIM extranjera o el Wi-Fi de un hotel (que normalmente usa las credenciales de la habitación) evita esta barrera.

## ¿Puedo acceder a Google, Gmail y WhatsApp desde mi hotel en China?

Normalmente no a través del propio Wi-Fi del hotel: igual que otras conexiones dentro del país, el Wi-Fi estándar de un hotel pasa por el Gran Cortafuegos, así que Google, Gmail, WhatsApp y servicios similares están bloqueados salvo que uses una VPN o una eSIM extranjera. Algunos viajeros de negocios informan de que ciertos hoteles de cadenas internacionales han tenido un Wi-Fi de habitación que llegaba a los servicios internacionales sin VPN; un visitante frecuente, por ejemplo, reserva Holiday Inn en parte por este motivo. **Tómalo como la experiencia pasada de viajeros concretos, no como una garantía:** no es algo que hayamos verificado, las políticas de red de los hoteles varían según el establecimiento y cambian con el tiempo, y no deberías contar con ello.

Si el acceso fiable a Google / WhatsApp / herramientas de oficina es importante para tu viaje:

- **Pregunta directamente al hotel antes de reservar:** "¿El Wi-Fi de la habitación tiene acceso internacional sin restricciones, o necesitaré una VPN?"
- **Lleva tu propia opción que no dependa del hotel:** una eSIM extranjera llega a los servicios internacionales sin VPN (se explica en la sección de la eSIM extranjera más abajo en esta página, y en [[wiki/concepts/sim-card.md]]), y una VPN —incluida una VPN de empresa— configurada antes de llegar es la solución empresarial estándar (véase la sección de configuración de VPN más abajo en esta página).

No dependas de la red de ningún hotel concreto para una conectividad crítica: lleva tu propia eSIM o una VPN probada como vía fiable.

## ¿Qué debo configurar antes de llegar a China?

**Instala y configura estas apps antes de salir de casa.** Varios pasos clave de configuración —vincular una tarjeta extranjera, la verificación por SMS, el paso de aval de WeChat— son mucho más fáciles, o solo son posibles, mientras sigues con tu operador de origen y una IP no china.

Una vez en China:
- Google Play está bloqueado (los usuarios de Android sin VPN no pueden descargar apps).
- La App Store funciona, pero está restringida por región para algunas apps: la versión china de la App Store difiere de la internacional.
- La verificación por SMS para cuentas nuevas es menos fiable con una SIM china recién comprada.

### Apps imprescindibles

**1. Alipay** — Método de pago principal. Aceptado en la inmensa mayoría de comercios, restaurantes, transporte y atracciones.

- Instalar: App Store / Google Play (disponible fuera de China)
- Regístrate con tu número de teléfono extranjero
- Completa la verificación de identidad con pasaporte dentro de la app
- Vincula una Visa o Mastercard en **Me → Bank Cards → Add Bank Card** (omite el aviso de "Tour Pass" si aparece)
- Haz un pequeño pago de prueba (≤ ¥10) para confirmar que la tarjeta funciona
- Llama al emisor de tu tarjeta para avisarle de tu viaje a China: algunos emisores bloquean el código de comercio de Alipay si no se les avisa antes del viaje

Consulta [[wiki/concepts/mobile-payment.md]] para conocer los detalles de comisiones y los límites.

**2. WeChat** — Mensajería, WeChat Pay (segundo método de pago), Mini Programs (apps integradas para DiDi, 12306, atracciones, hoteles) y recibir dinero de contactos locales.

> **Reserva de atracciones mediante Mini Programs:** Muchas de las principales atracciones de China —incluidas la plaza de Tiananmén, el Museo del Palacio y los sitios populares en temporada alta— exigen reservar la entrada por adelantado a través de los Mini Programs de WeChat. A menudo no se admite la entrada sin reserva previa. Durante la Semana Dorada y las fiestas nacionales, se rechaza a los visitantes sin reserva. Completa la configuración de WeChat antes de salir para poder reservar las entradas con antelación. (Fuente: Reddit r/travelchina, 2026-05-08)

- Instalar: App Store / Google Play
- Regístrate con tu número de teléfono extranjero
- WeChat puede exigir que un contacto de WeChat ya existente escanee un código QR para verificar tu nueva cuenta: es un paso de control de riesgo que se activa con frecuencia en los registros con número extranjero. Tu contacto debe llevar registrado más de 6 meses, tener WeChat Pay desde hace más de 3 meses, no haber avalado otra cuenta en el último mes y no estar bloqueado. Busca un contacto que cumpla los requisitos y completa este paso **antes de salir**: puede llevar días si se hace a mitad del viaje.
- Vincula una Visa o Mastercard: **Me → Services → Wallet → Bank Cards → Add Bank Card**
- Completa la verificación de identidad con pasaporte

Consulta [[wiki/entities/wechat.md]] y [[wiki/concepts/mobile-payment.md]].

**3. Amap (高德地图 / Gaode Maps)** — Google Maps está bloqueado por el Gran Cortafuegos. Amap es el sustituto estándar para la navegación paso a paso, las indicaciones de transporte público y el transporte con conductor.

- Instalar: busca "Amap" o "Gaode Maps" en App Store / Google Play
- Abre la app, cambia al inglés (Settings → Language) y confirma que el mapa carga tu ciudad de origen: así verificas que la instalación funciona antes de necesitarla en China

Consulta [[wiki/entities/amap.md]].

**4. DiDi** — Principal app de transporte con conductor. Más barata y con más disponibilidad que los taxis en la mayoría de las ciudades; interfaz en inglés disponible.

- Instalar: App Store / Google Play. En Google Play, instala la versión **China DiDi**: la versión global no funciona correctamente en China continental.
- Regístrate con tu número de teléfono extranjero
- Vincula un método de pago (Alipay, WeChat Pay o una tarjeta extranjera directamente en DiDi)
- Configura la app en inglés: Settings → Language
- **Atajo:** DiDi también está disponible como Mini Program dentro de Alipay; si ya tienes Alipay configurado, puedes pedir viajes directamente desde ahí sin una app de DiDi aparte.

Consulta [[wiki/entities/didi.md]].

**5. 12306 (Ferrocarriles de China)** — Necesaria para comprar billetes de tren de alta velocidad (高铁). Los extranjeros pueden reservar directamente con un número de pasaporte.

- Instalar: busca "12306" en la App Store. En Android fuera de China, la versión de Google Play puede tener disponibilidad limitada: instala el APK desde 12306.cn si hace falta, o reserva a través del sitio web en inglés en [www.12306.cn](https://www.12306.cn)
- Registra una cuenta con tu número de pasaporte
- Añade la información del pasajero en **My → My Passengers**
- Confirma que puedes buscar rutas: prueba una búsqueda Beijing → Shanghái para verificar que la cuenta funciona

Consulta [[wiki/entities/12306.md]].

**6. VPN (2 o más proveedores)** — Si necesitas acceder a servicios bloqueados (Google, Gmail, WhatsApp, Instagram, Facebook, YouTube, la mayoría de los sitios de noticias occidentales).

- **Crítico:** Descarga y prueba tu VPN **antes de salir**. El propio sitio web del proveedor de VPN suele estar bloqueado en China, lo que hace imposible descargarla o comprarla desde dentro de China.
- Instala la VPN que elijas (véase la sección de configuración de VPN más abajo para las recomendaciones de proveedores)
- Suscríbete a un plan y verifica que se conecta en tu país de origen
- Mantén la app actualizada: las apps de VPN desactualizadas suelen dejar de funcionar tras las actualizaciones del cortafuegos
- Nota: usar una VPN con las apps de pago (Alipay, WeChat Pay) puede activar de vez en cuando la detección de fraude. Desactiva la VPN al completar los pagos si una transacción se rechaza de forma inesperada.

### Apps recomendadas

**7. Meituan (美团)** — Reparto de comida, reserva de hoteles, bicicletas compartidas y ocio local en una sola app.

- Instalar: App Store / Google Play. La versión internacional tiene soporte parcial en inglés; la versión china completa tiene más funciones.
- Regístrate con tu número de teléfono extranjero. Hay una interfaz en inglés disponible en Settings, aunque algunos menús siguen en chino.

Consulta [[wiki/entities/meituan.md]].

**8. UnionPay "Nihao China"** — App de pago complementaria lanzada en diciembre de 2025, diseñada específicamente para los visitantes extranjeros. Acepta tarjetas internacionales Visa, Mastercard y UnionPay. Útil como respaldo si Alipay o WeChat Pay fallan, e incluye la recarga de la tarjeta de transporte en las principales ciudades.

- Instalar: busca "Nihao China" o "UnionPay Nihao China" en App Store / Google Play
- Regístrate y vincula una tarjeta. La cobertura sigue ampliándose: trátala como un respaldo, no como opción principal.

### Apps de traducción

| App | Funciona sin VPN | Notas |
|---|---|---|
| **Baidu Translate** | ✅ Sí | La mejor opción sin VPN; incluye traducción por cámara/foto; gratis pero con mucha publicidad |
| **Traducción de WeChat** | ✅ Sí | Traducción con un toque dentro de las conversaciones de WeChat; también traduce menús mediante la cámara en la función de escaneo de WeChat |
| **Google Translate** | Requiere VPN | El modo foto/cámara funciona y es preciso; más lento que las apps nativas. Descarga los paquetes de idioma sin conexión antes de llegar. |
| **DeepL** | ✅ Sí | Bueno para lenguas europeas; experiencia con el chino limitada |
| **Microsoft Translator** | ✅ Sí | Buena traducción por cámara; menos popular pero fiable |

**Consejo práctico para restaurantes:** los menús con código QR son casi universales en China y están solo en chino. Tanto el modo cámara de Google Translate (con VPN) como el modo cámara de Baidu Translate (sin necesidad de VPN) sirven para fotografiar y traducir los menús. Baidu es más lento, pero no requiere VPN.

### Lista adicional antes de salir

- [ ] **Descarga mapas sin conexión** (áreas sin conexión de Apple Maps o Google Maps, como referencia cuando la VPN no funcione)
- [ ] **Descarga los paquetes sin conexión de Google Translate** para los idiomas que necesites
- [ ] **Descarga entretenimiento** (series de Netflix, música) para usarlo sin conexión: da por hecho que la VPN puede fallar a veces
- [ ] **Descarga Baidu Translate** como alternativa de traducción sin VPN

## ¿Cómo configuro una VPN para China?

### Por qué necesitas una VPN

Sin una VPN pierdes el acceso a Gmail, WhatsApp, Google Maps, YouTube y la mayoría de las herramientas de comunicación occidentales. Para muchos visitantes son esenciales. Una VPN que funcione restaura el acceso completo a internet.

### Instálala antes de llegar

Los sitios web de los proveedores de VPN están bloqueados en China. Las tiendas de aplicaciones eliminan las apps de VPN para los usuarios con cuentas chinas. **No puedes descargar ni configurar una VPN después de llegar.** Instala al menos dos apps de VPN y compra las suscripciones antes de tu vuelo.

### Proveedores fiables (a junio de 2026)

Los costes mensuales aproximados de abajo son las tarifas habituales de los planes de larga duración y varían con las promociones: consulta el sitio de cada proveedor antes de comprar. Las clasificaciones reflejan a la comunidad de expatriados y viajeros centrada en China a junio de 2026 y cambian a medida que evoluciona el GFW.

| Proveedor | Protocolo para China | Coste aprox. | Fiabilidad | Notas |
|---|---|---|---|---|
| **Astrill** | StealthVPN | ~$15–30/mes | A menudo valorada como la más fiable de forma consistente por la comunidad de expatriados en China; protocolo stealth | Larga trayectoria frente al GFW; cara |
| **ExpressVPN** | Lightway con ofuscación | ~$8–13/mes | Bien valorada; protocolo Lightway; actualizaciones frecuentes para China | Garantía de devolución del dinero de 30 días; el chat dentro de la app funciona incluso cuando la VPN está caída |
| **Surfshark** | Modo NoBorders | ~$2–5/mes | Informes dispares; el modo NoBorders ayuda pero es inconsistente | Opción económica; activa NoBorders antes de llegar |
| **NordVPN** | Servidores ofuscados | ~$4–8/mes | Ha tenido dificultades importantes en China en los últimos años; no se recomienda como principal | La inspección profunda de paquetes de China ha superado a la ofuscación de NordVPN; consérvala solo como respaldo. |
| **Shadowsocks** | Proxy SOCKS5 | Autoalojado / variable | Muy alta (autoalojado) | Opción técnica para usuarios avanzados; más difícil de bloquear que las VPN comerciales; poco intuitiva |

> Nota: una ofensiva general en 2026 ("the Great Unplug") reforzó aún más la detección: los protocolos estándar WireGuard, OpenVPN e IKEv2 ahora se bloquean con una precisión casi total dentro de China, así que los proveedores que dependen solo de esos protocolos (sin ofuscación basada en TLS) fallan cada vez más.

La fiabilidad de las VPN cambia rápidamente a medida que evoluciona el GFW. Ningún proveedor garantiza la conectividad. El rendimiento se degrada durante los periodos políticamente sensibles (Día Nacional, sesiones de la APN, etc.). Instala siempre 2 o más proveedores antes de salir.

**Las VPN gratuitas no funcionan.** Las VPN gratuitas fallan de forma sistemática en China: carecen de la ofuscación necesaria para evadir el GFW y suelen quedar bloqueadas en cuestión de días. Los viajeros con experiencia coinciden de forma abrumadora en que solo los proveedores de pago, probados en China, tienen alguna posibilidad.

Consulta reseñas actuales de sitios tecnológicos centrados en China (por ejemplo, VPNmentor, las guías de China de Comparitech) justo antes de viajar: la detección del GFW mejora constantemente y las clasificaciones de proveedores cambian.

### Estrategia de respaldo con varias VPN

**Suscríbete al menos a 2 proveedores de VPN** (~$10–15/mes en total). Esta es la recomendación sobre VPN más importante de todas por parte de los viajeros con experiencia en China.

- Si una VPN queda bloqueada, cambia de inmediato a la de respaldo.
- Combinaciones recomendadas: ExpressVPN + Astrill, o ExpressVPN + Surfshark.
- Varios viajeros informan de fallos catastróficos con configuraciones de una sola VPN (días sin internet occidental, sin poder descargar alternativas porque los sitios web de las VPN también están bloqueados).
- Durante los periodos políticamente sensibles (Día Nacional, el 1 de octubre, o el Congreso del Partido), incluso las mejores VPN tienen dificultades: las de respaldo se vuelven críticas.

### ¿Qué fiabilidad tienen las VPN?

La fiabilidad de las VPN en China no está garantizada. El GFW usa aprendizaje automático para detectar y bloquear el tráfico de VPN. Las conexiones se degradan en torno a las fechas políticamente sensibles (Día Nacional, Congreso del Partido, grandes aniversarios). Incluso las VPN fiables sufren cortes. Mantén dos proveedores instalados y cambia si uno falla.

**Degradación en horas punta:** las velocidades de las VPN suelen volverse inutilizables entre las 19:00 y las 22:00, cuando la congestión de la red es máxima. Planifica las tareas que consumen muchos datos (videollamadas, streaming) fuera de estas horas.

**Consumo de batería:** mantener una conexión VPN de forma continua consume mucha batería. Lleva una batería externa (power bank).

### Situación legal para los visitantes extranjeros

**Situación legal (importante):** El Departamento de Estado de EE. UU. (actualizado en mayo de 2026) afirma que el uso de una VPN en China es «ilegal en la mayoría de los casos y puede acarrear la confiscación de tu dispositivo, una multa o la detención». El FCDO del Reino Unido señala que las VPN deben contar con licencia del gobierno chino. En la práctica, la aplicación de la ley históricamente ha ido dirigida a los proveedores y distribuidores de VPN, más que a los turistas extranjeros que usan una VPN para su comunicación personal. Aun así, los viajeros deben ser conscientes del riesgo legal y tomar su propia decisión informada. Este wiki solo proporciona información: consulta el aviso oficial de viaje de tu país.

La seguridad del aeropuerto no comprueba si hay apps de VPN en los dispositivos.

### Resolución de problemas de VPN

Cuando tu VPN deje de funcionar en China, prueba estos pasos en orden:

1. **Cambia la ubicación del servidor**: prueba servidores de Hong Kong, Japón, Singapur o Estados Unidos.
2. **Cambia de protocolo**: alterna entre OpenVPN, Lightway (ExpressVPN), IKEv2 y L2TP.
3. **Fuerza el cierre y reinicia** la app de VPN.
4. **Borra la caché y las cookies del navegador**: algunas apps guardan en caché los bloqueos incluso con la VPN activa. Prueba el modo incógnito o de navegación privada.
5. **Reinicia el dispositivo**: a veces la pila de red necesita un reinicio completo.
6. **Contacta con el soporte de la VPN**: ExpressVPN y Astrill ofrecen chat 24/7. El chat dentro de la app de ExpressVPN funciona incluso cuando la propia VPN está caída. Guarda las direcciones de correo del soporte sin conexión como respaldo.
7. **Cambia a la VPN de respaldo**: si la principal falla durante más de 30 minutos, activa tu segundo proveedor.

**Problemas frecuentes de sincronización temporal:** una VPN que funcionaba ayer puede no funcionar hoy: el GFW actualiza las listas de bloqueo de forma continua. Inténtalo de nuevo más tarde; a menudo las conexiones se restablecen en cuestión de horas.

### Si olvidaste instalar la VPN antes de ir a China

Esta es una situación difícil porque los propios sitios web de los proveedores de VPN están bloqueados. Opciones:

1. **Pregunta en tu hotel**: algunos hoteles ayudan a los huéspedes a configurar una VPN en sus dispositivos, u ofrecen ordenadores del centro de negocios con acceso VPN.
2. **Usa enlaces espejo guardados**: ExpressVPN facilita a sus suscriptores URLs de descarga espejo especiales para China. Si las guardaste en tu app de notas antes de llegar, puede que sigan funcionando.
3. **Espera hasta Hong Kong o Macao**: el GFW no se aplica ahí; puedes descargar y configurar apps de VPN sin problemas, y luego volver a China continental.
4. **Wi-Fi del aeropuerto**: al aterrizar, el Wi-Fi del aeropuerto puede permitir las primeras conexiones VPN. Pruébalo de inmediato antes de salir del aeropuerto.
5. **Usa el dispositivo de otro viajero**: como último recurso, accede brevemente a un sitio web de VPN desde un dispositivo que ya tenga la VPN funcionando.

**Prevención:** Guarda las guías de configuración de la VPN como PDF sin conexión. Guarda los enlaces espejo en tu app de notas. Envíate por correo los enlaces de descarga de la VPN (accesibles a través de Outlook/Yahoo, que funcionan sin VPN).

## ¿Cómo se conecta a internet una eSIM extranjera sin VPN?

Una eSIM extranjera (Airalo, Holafly, Ubigi) enruta todos los datos a través de pasarelas fuera de China continental, evitando el GFW por completo sin VPN. Google, WhatsApp, YouTube y todos los demás servicios funcionan de forma nativa. Los costes van desde unos pocos dólares por un pequeño paquete de datos fijos hasta unos $70 por un plan de datos ilimitados de 30 días (a junio de 2026); la tabla de precios por proveedor actual y la comparativa están en [[wiki/concepts/sim-card.md]].

**Contrapartida:** las eSIM solo proporcionan datos, no un número de teléfono chino (+86). Si necesitas un número +86 para registrarte en apps o para la verificación por SMS, necesitarás además una SIM física local. Consulta [cómo conseguir un número de teléfono chino](/guides/chinese-phone-number/) para conocer las opciones y qué apps lo requieren realmente.

Para los visitantes que se quedan hasta unas pocas semanas y no necesitan un número local, el enfoque de la eSIM es la solución de conectividad más fiable.

### Combinaciones de eSIM + VPN

Los tres proveedores de abajo evitan el GFW mediante itinerancia internacional (roaming); ninguno *requiere* una VPN. La columna "VPN integrada" indica si el proveedor también incluye una app de VPN para mayor redundancia.

| Proveedor de eSIM | ¿VPN integrada? | Mejor para | Notas |
|---|---|---|---|
| **Holafly** | Sí (incluida) | Viajeros que quieren cero complicaciones de configuración | Recomendada con frecuencia en las comunidades de viajeros. Datos ilimitados. La VPN incluida puede ser más lenta que una VPN dedicada en las horas punta de la tarde-noche; algunos llevan una VPN de respaldo. |
| **Airalo** | No | Viajeros con presupuesto ajustado que se manejan bien con la tecnología | Opción económica popular. Funciona sin ninguna VPN mediante itinerancia. Los precios actuales de los planes se mantienen en [[wiki/concepts/sim-card.md]]. |
| **Nomad** | No | Alternativa económica | Funciona mediante itinerancia, sin necesidad de VPN; a menudo más barata que Holafly. |

**Cómo funciona el sorteo del bloqueo:** una eSIM de viaje extranjera se conecta mediante *itinerancia internacional (roaming)*, no a través de la red doméstica de China; tus datos se enrutan por pasarelas fuera de China continental (normalmente Hong Kong o Singapur), así que ante el GFW apareces como un usuario de itinerancia internacional. Esto significa que una eSIM de solo datos como Airalo evita el cortafuegos por sí sola: Google, WhatsApp y las redes sociales funcionan sin ninguna VPN. La propia documentación de Airalo confirma que "NO se requiere una VPN" con su eSIM para China (fuente: airalo.com, consultado en junio de 2026). Una VPN incluida (como con Holafly) es una comodidad, no un requisito, y algunos viajeros siguen llevando una VPN aparte como respaldo por si el enrutamiento de la itinerancia se degrada.

**Sobrecarga de datos de la VPN:** en los planes de datos con límite, el cifrado de la VPN añade aproximadamente entre un 20 % y un 30 % de consumo de datos adicional. Tenlo en cuenta al elegir tu plan de datos.

**Estrategia de doble SIM:** algunos viajeros compran una eSIM de Holafly por la comodidad de los datos + VPN, más una SIM física local de China Mobile (~$10) para tener un número de teléfono chino (necesario para el registro en Alipay y algunos servicios). Lo mejor de ambos mundos.

## Referencia rápida: bloqueado → alternativa

| Bloqueado | Usa en su lugar | ¿Necesita VPN? |
|---|---|---|
| Google Maps | Amap (高德地图) | No |
| Google Translate | Baidu Translate / traducción de WeChat | No |
| WhatsApp | WeChat | No |
| Gmail | Outlook o Yahoo Mail | No (o VPN) |
| YouTube | VPN, o Bilibili para contenido chino | Sí para YouTube |
| Búsqueda de Google | VPN | Sí |
| Instagram / Twitter | VPN | Sí |

## ¿Se aplica el Gran Cortafuegos en Hong Kong, Macao y Taiwán?

El GFW **no** se aplica en Hong Kong, Macao ni Taiwán. Todos los servicios internacionales habituales funcionan con normalidad en estos territorios sin VPN.

## Véase también

- [[wiki/concepts/sim-card.md]] — opciones de eSIM extranjera que evitan el GFW de forma nativa; opciones de SIM local
- [[wiki/concepts/mobile-payment.md]] — configuración de WeChat y Alipay antes de llegar
