import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export const logout = async () => {
  try {
    await signOut(auth); 
    localStorage.removeItem("user");
    return true;
  } catch (error) {
    console.error("Erro ao deslogar:", error.message);
    return false;
  }
};


 
export const criarUsuarioNoFirestore = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), { 
        email: user.email,
        nome: '',
        createdAt: new Date(),
      });
      console.log('Usuário criado e salvo no Firestore');
      return { success: true };
    } catch (error) {
      console.error('Erro ao criar usuário: ', error);
      return { success: false, errorCode: error.message };
    }
  };
  
 
  export const loginOuCriarUsuarioNoFirestore = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          nome: '',
          createdAt: new Date(),
        });
        console.log('Usuário criado no Firestore');
      } else {
        console.log('Usuário já existe no Firestore');
      }
  
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer login: ', error);
      return { success: false, message: "Erro ao autenticar o usuário" };
    }
  };
  
