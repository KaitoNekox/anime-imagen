import axios from 'axios';

// Función para formatear el texto decorativamente
const formatMessage = (characterName, animeName) => {
  return `🌟 *Personaje:* ${characterName || 'Desconocido'} 🌟\n` +
         `📺 *Anime:* ${animeName || 'Desconocido'} 📺\n` +
         `✨ Disfruta esta imagen! ✨`;
};

export default async function handler(req, res) {
  try {
    // Configuración para obtener solo imágenes SFW
    const response = await axios.get('https://api.waifu.im/search', {
      params: {
        is_nsfw: false,
        included_tags: ['waifu'],
        height: '>=600'
      },
      headers: {
        'Accept-Version': 'v5'
      }
    });

    const imageData = response.data.images[0];
    
    // Extraer la información relevante
    const result = {
      imageUrl: imageData.url,
      message: formatMessage(
        imageData.tags.find(t => t.description)?.description,
        imageData.source
      ),
      success: true
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la imagen de anime'
    });
  }
}
