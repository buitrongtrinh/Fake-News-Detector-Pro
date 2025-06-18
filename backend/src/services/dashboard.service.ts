import { auth, firestore } from "./firebase.service"

export async function getAllUsersWithHistory() {
  const list = await auth.listUsers(1000);

  // Dùng Promise.all để xử lý async bên trong map
  const usersWithHistory = await Promise.all(
    list.users.map(async (userRecord) => {
      const fullUser = await auth.getUser(userRecord.uid); // lấy customClaims

      const role = fullUser.customClaims?.role || "user";

      const historySnapshot = await firestore
        .collection("history")
        .where("userId", "==", userRecord.uid)
        .orderBy("createdAt", "desc") // nếu có timestamp
        .get();

      const history = historySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        uid: userRecord.uid,
        email: userRecord.email || "",
        displayName: userRecord.displayName || "",
        createdAt: userRecord.metadata.creationTime,
        lastLogin: userRecord.metadata.lastSignInTime,
        role, // ✅ thêm role vào đây
        history,
      };
    })
  );

  return usersWithHistory;
}

export const deleteUserAndData = async (uid: string) => {
  // Lấy thông tin người dùng
  const userRecord = await auth.getUser(uid);

  // Kiểm tra quyền
  const role = (userRecord.customClaims && userRecord.customClaims.role) || "user";
  if (role === "admin") {
    throw new Error("Không thể xóa người dùng có vai trò admin.");
  }

  // Xóa tài khoản
  await auth.deleteUser(uid);

  // Xóa lịch sử (nếu lưu theo uid)
  await firestore.collection("history").doc(uid).delete();

  return true;
};