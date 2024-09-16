import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (uri: string, imageName: string) => {
  try {
    // Crie uma referência para onde o arquivo será armazenado
    const imageRef = ref(storage, `images/${imageName}`);

    // Converte o URI da imagem para um Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Faz o upload
    await uploadBytes(imageRef, blob);

    // Obtém o URL de download
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem: ', error);
    throw error;
  }
};
