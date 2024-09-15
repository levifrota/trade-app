import SQLite from 'react-native-sqlite-storage';

interface Item {
  id: number;
  name: string;
  category: string;
  imageUri: string;
}

// Abre o banco de dados usando 'await'
const openDatabase = async () => {
  return await SQLite.openDatabase({ name: 'items.db', location: 'default' });
};

export const createTable = async () => {
  const db = await openDatabase(); // Usa 'await' para garantir que o banco foi aberto
  db.transaction((txn) => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, imageUri TEXT)`,
      [],
      () => {
        console.log('Tabela criada com sucesso');
      },
      (error) => {
        console.error('Erro ao criar tabela: ', error);
      }
    );
  });
};

export const insertItem = async ({ name, category, imageUri }: any) => {
  const db = await openDatabase(); // Usa 'await' para garantir que o banco foi aberto
  db.transaction((txn) => {
    txn.executeSql(
      `INSERT INTO items (name, category, imageUri) VALUES (?, ?, ?)`,
      [name, category, imageUri],
      () => {
        console.log('Item inserido com sucesso');
      },
      (error) => {
        console.error('Erro ao inserir item: ', error);
      }
    );
  });
};

export const getItems = async (): Promise<Item[]> => {
  const db = await openDatabase();
  return new Promise<Item[]>((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT * FROM items`,
        [],
        (_, { rows }) => {
          const items: Item[] = [];
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i) as Item); // Forçando o tipo Item para cada linha
          }
          resolve(items);
        },
        (error) => {
          console.error('Erro ao buscar itens: ', error);
          reject([]);
        }
      );
    });
  });
};