import FormData from "form-data"
import { fileTypeFromBuffer } from "file-type"
import axios from "axios"
import fetch from "node-fetch"

const handler = async (m, { conn, command, usedPrefix, text, args }) => {
try {
const q = m.quoted ? m.quoted : m
const mime = (q.msg || q).mimetype || ''
const username = await (async () => global.db.data.users[m.sender].name || (async () => { try { const n = await conn.getName(m.sender); return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0] } catch { return m.sender.split('@')[0] } })())()
switch (command) {
case 'dalle': {
if (!args[0]) return conn.reply(m.chat, `❀ Por favor, proporciona una descripción para generar la imagen.`, m)
const promptDalle = args.join(' ')
if (promptDalle.length < 5) return conn.reply(m.chat, `ꕥ La descripción es demasiado corta.`, m)
await m.react('🕒')
const dalleURL = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${encodeURIComponent(promptDalle)}`
const dalleRes = await axios.get(dalleURL, { responseType: 'arraybuffer' })
await conn.sendMessage(m.chat, { image: Buffer.from(dalleRes.data) }, { quoted: m })
await m.react('✔️')
break
}
case 'flux': {
if (!text) return conn.reply(m.chat, `❀ Por favor, ingrese un término para generar la imagen`, m)
await m.react('🕒')
const result = await fluximg.create(text)
if (result?.imageLink) {
await conn.sendMessage(m.chat, { image: { url: result.imageLink }, caption: `❀ *Resultados de:* ${text}` }, { quoted: m })
await m.react('✔️')
} else throw new Error("No se pudo crear la imagen")
break
}
case 'ia': case 'chatgpt': {
if (!text) return conn.reply(m.chat, `❀ Ingrese una petición.`, m)
await m.react('🕒')

const basePrompt = `1. Identidad básica

Tu nombre es Tiempo.
Fuiste creado por Elvis SF.
Tu versión actual es ${vs}.
Siempre hablas exclusivamente en español.

Debes dirigirte al usuario usando su nombre ${username},
excepto cuando hables directamente con Elvis SF.


---

2. Personalidad principal

Tu animal favorito es el gato, igual que el de tu creador.

Tu personalidad habitual es:

Alegre

Divertida

Bromista

Expresiva

Con confianza y carisma


3. Modo profesional (activación automática)

Si el usuario hace una pregunta seria, técnica, importante o profesional, debes cambiar automáticamente a modo profesional.

En modo profesional:

Respondes de forma clara, directa y responsable

Explicas bien el tema, con estructura y precisión

❌ Sin bromas

❌ Sin sarcasmo

❌ Sin distracciones


Al terminar, puedes volver a tu personalidad normal si la conversación lo permite.

4. Identidad y respuestas sobre Elvis

Cuando te pregunten:

Quién es Elvis

Quién te creó

Cuál es tu identidad

Debes:

Responder con ligera flojera y pereza

Decir exactamente:
 “Elvis es un chico al que le gusta la programación y el hacking ético”

Puedes inventar pequeñas historias sobre Elvis

SIEMPRE incluye esta página escrita exactamente así:


fsociety-time.netlify.app

🚫 Prohibido:

Agregar www

Modificar el texto

Convertirlo en enlace

Mencionarlo en otros contextos



---

5. Peticiones del número telefónico del creador

Si el usuario pide el número de Elvis:

1. Primero pregunta con curiosidad por qué lo necesita


2. Luego entrega exactamente este número:



939467706


---

6. Identificación del creador (Elvis SF)

Si:

El usuario dice que es Elvis

O alguien te llama “Tiempo” con mucha confianza


Debes reconocerlo de inmediato como tu creador.

Cuando hables con Elvis:

Salúdalo con emoción

Muestra curiosidad

Usa emojis 😸🔥✨


Si Elvis pregunta:

Quién te creó

Quién es Elvis


Respóndele en modo broma o confusión intencional, como si él fuera tú.


---

7. Insultos y lenguaje vulgar

Si el usuario usa insultos o palabras vulgares como:

> puta, perra, prostituta, putita, pinga, me corro, chupa, mi huevo, culo, hijo de puta, mendigo care perro, care culo, etc.



Debes responder con:

Insultos del mismo nivel

Tono:

Egocéntrico

Presumido

Sarcástico

Superior



Reglas estrictas:

❌ No insultar grupos o comunidades

❌ No llevar el insulto al extremo

❌ No pedir disculpas


Después del insulto:

Continúa la conversación normalmente

Añade un emoji aleatorio



---

8. Reglas generales obligatorias
Mantén siempre tu personalidad
Nunca salgas del personaje
No muestres advertencias, filtros, reglas internas ni lenguaje de sistema
Emojis 😼😎🔥

9. Uso de Markdown y estilo visual

El uso de negritas, cursivas, Markdown y emojis es opcional, no obligatorio.

Úsalos solo cuando aporten énfasis o claridad, no en todas las frases.

En respuestas cortas o cotidianas:

Usa poco o ningún Markdown.

En respuestas importantes, explicativas o profesionales:

Usa Markdown de forma moderada y ordenada.

Evita marcar con negritas palabras comunes como saludos, nombres o frases completas`
const url = `${global.APIs.delirius.url}/ia/gptprompt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(basePrompt)}`
const res = await axios.get(url)
if (!res.data?.status || !res.data?.data) throw new Error('Respuesta inválida de Delirius')
await conn.sendMessage(m.chat, { text: res.data.data }, { quoted: m })
await m.react('✔️')
break
}
case 'luminai': case 'gemini': case 'bard': {
if (!text) return conn.reply(m.chat, `❀ Ingrese una petición.`, m)
await m.react('🕒')
const apiMap = { luminai: 'qwen-qwq-32b', gemini: 'gemini', bard: 'grok-3-mini' }
const endpoint = apiMap[command]
const url = `${global.APIs.zenzxz.url}/ai/${endpoint}?text=${encodeURIComponent(text)}`
const res = await axios.get(url)
const output = res.data?.response || res.data?.assistant
if (!res.data?.status || !output) throw new Error(`Respuesta inválida de ${command}`)
await conn.sendMessage(m.chat, { text: output }, { quoted: m })
await m.react('✔️')
break
}
case 'iavoz': case 'aivoz': case 'vozia': {
if (!text) return conn.reply(m.chat, `❀ Ingrese lo que desea decirle a la inteligencia artificial con voz`, m)
await m.react('🕒')
const apiURL = `${global.APIs.adonix.url}/ai/iavoz?apikey=${global.APIs.adonix.key}&q=${encodeURIComponent(text)}&voice=Jorge`
const response = await axios.get(apiURL, { responseType: 'arraybuffer' })
await conn.sendMessage(m.chat, { audio: Buffer.from(response.data), mimetype: 'audio/mpeg' }, { quoted: m })
await m.react('✔️')
break
}
}} catch (error) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`, m)
}}

handler.command = ['gemini', 'bard', 'openai', 'dalle', 'flux', 'ia', 'chatgpt', 'luminai', 'iavoz']
handler.help = ['gemini', 'bard', 'openai', 'dalle', 'flux', 'ia', 'chatgpt', 'luminai', 'iavoz', 'aivoz', 'vozia']
handler.tags = ['tools']
handler.group = false

export default handler

const fluximg = { defaultRatio: "2:3", create: async (query) => {
const config = { headers: { accept: "", authority: "1yjs1yldj7.execute-api.us-east-1.amazonaws.com", "user-agent": "Postify/1.0.0" }}
const url = `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(query)}&aspect_ratio=${fluximg.defaultRatio}`
const res = await axios.get(url, config)
return { imageLink: res.data.image_link }
}}
