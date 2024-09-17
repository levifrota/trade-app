import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('userProfile.db');

export const createTable = async () => {
  try {
    const db = await dbPromise;
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS userProfile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT UNIQUE,
        photoUrl TEXT
      );
    `);
    console.log('Tabela criada com sucesso');
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
  }
};

export const saveProfileImage = async (userId, photoUrl) => {
  try {
    const db = await dbPromise;
    const result = await db.runAsync(
      'INSERT OR REPLACE INTO userProfile (userId, photoUrl) VALUES (?, ?);',
      [userId, photoUrl]
    );
    console.log('Imagem de perfil salva:', result.changes);
  } catch (error) {
    console.error('Erro ao salvar imagem de perfil:', error);
  }
};


export const getProfileImage = async (userId) => {
  try {
    const db = await dbPromise;
    const row = await db.getFirstAsync(
      'SELECT photoUrl FROM userProfile WHERE userId = ?;',
      [userId]
    );
    if (row) {
      return row.photoUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar imagem de perfil:', error);
    return null;
  }
};
