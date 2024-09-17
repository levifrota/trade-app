import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('userProfile.db');

export const createTable = async () => {
  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS userProfile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT UNIQUE,
        photoUrl TEXT
      );`,
      [],
      () => {
        console.log('Tabela criada com sucesso');
      },
      (error) => {
        console.error('Erro ao criar tabela:', error);
      }
    );
};

export const saveProfileImage = async (userId, photoUrl) => {
  await db.execAsync(
    'INSERT OR REPLACE INTO userProfile (userId, photoUrl) VALUES (?, ?);',
    [userId, photoUrl],
    (_, result) => {
      console.log('Imagem de perfil salva:', result);
    },
    (_, error) => {
      console.error('Erro ao salvar imagem de perfil:', error);
    }
  );
};

export const getProfileImage = async (userId, callback) => {
  await db.execAsync(
    'SELECT photoUrl FROM userProfile WHERE userId = ?;',
    [userId],
    (_, { rows }) => {
      if (rows.length > 0) {
        callback(rows._array[0].photoUrl);
      } else {
        callback(null);
      }
    },
    (_, error) => {
      console.error('Erro ao buscar imagem de perfil:', error);
    }
  );
};
