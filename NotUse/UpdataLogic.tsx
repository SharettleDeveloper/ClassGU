// const useFirestoreData = (email: string | null) => {
//     const [data, setData] = useState<ShareDocument | null>(null);
  
//     useEffect(() => {
//       if (!email) return;
  
//       const fetchData = async () => {
//         try {
//           const docRef = doc(firestore, `users/users/${email}/share`);
//           const docSnap = await getDoc(docRef);
  
//           if (docSnap.exists()) {
//             setData(docSnap.data() as ShareDocument);
//           } else {
//             console.log('No such document!');
//           }
//         } catch (error) {
//           console.error('Error fetching document:', error);
//         }
//       };
  
//       fetchData();
//     }, [email]);
  
//     return data;
//   };






// const updateFirestoreData = async (classId: string, fileName: string, classData: ClassData, currentUser: any) => {
//     const classDocRef = doc(firestore, `class/class/${classId}/share`);
//     const userDocRef = doc(firestore, `users/users/${currentUser.email}/share`);
  
//     try {
//       // クラスコレクションに保存または更新
//       await setDoc(classDocRef, {
//         [fileName]: classData,
//       }, { merge: true });
  
//       // ユーザーコレクションに保存または更新
//       await setDoc(userDocRef, {
//         [fileName]: {
//           path: `class/class/${classId}/share/`,
//           classData,
//         },
//       }, { merge: true });
  
//       console.log(`Document ${fileName} successfully updated!`);
//     } catch (error) {
//       console.error("Error updating document: ", error);
//     }
//   };





//   import { doc, deleteField, updateDoc } from 'firebase/firestore';

// const deleteFirestoreData = async (classId: string, fileName: string, currentUser: any) => {
//   const classDocRef = doc(firestore, `class/class/${classId}/share`);
//   const userDocRef = doc(firestore, `users/users/${currentUser.email}/share`);

//   try {
//     // クラスコレクションから削除
//     await updateDoc(classDocRef, {
//       [fileName]: deleteField(),
//     });

//     // ユーザーコレクションから削除
//     await updateDoc(userDocRef, {
//       [fileName]: deleteField(),
//     });

//     console.log(`Document ${fileName} successfully deleted!`);
//   } catch (error) {
//     console.error("Error deleting document: ", error);
//   }
// };




