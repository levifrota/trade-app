import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const addItemToFirestore = async (name: string, category: string) => {
  try {
    const docRef = await addDoc(collection(db, 'items'), {
      name,
      category,
    });
    console.log('Documento escrito com ID: ', docRef.id);
  } catch (error) {
    console.error('Erro ao adicionar documento: ', error);
    throw error;
  }
};

export const getItemsFromFirestore = async () => {
  try {
    const q = query(
      collection(db, 'items'),
      where('category', '==', 'algumaCategoria')
    );
    const querySnapshot = await getDocs(q);
    const items: any[] = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });
    return items;
  } catch (error) {
    console.error('Erro ao buscar documentos: ', error);
    throw error;
  }
};
